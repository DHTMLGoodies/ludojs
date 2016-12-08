/**
 * Data source for charts
 *
 * The chart data source expects an array of objects, example:
 * 
 * <code>
 * [
 { id: 1, label:'John', value:100 },
 { id: 2, label:'Jane', value:245 },
 { id: 3, label:'Martin', value:37 },
 { id: 4, label:'Mary', value:99 },
 { id: 5, label:'Johnny', value:127 },
 { id: 6, label:'Catherine', value:55 },
 { id: 7, label:'Tommy', value:18 }
 ]   
 *     
 * </code>
 * The chart data source will add some special properties to the records.
 * Example: "Jane" in the data above will be something like:
 * <code>
 * {
 *      id:'1', name: 'Jane', value, 245,
 *      \_\_color: '#4719D2'
 *      \_\_colorOver: '#5629E1'
 *      \_\_count : 7,
 *      \_\_fraction:0.35976505139500736,
 *      \_\_sum : 681
 *      \_\_index: 1,
 *      \_\_percent: 36,
 *      \_\_angle : 0.92264101427013,
 *      \_\_radians : 2.2604704849618193,
 *      \_\_uid : "chart-node-iw7znu0v"
 *      \_\_min : 18
 *      \_\_max : 245
 * }
 * </code>
 *
 * where \_\_color is the records assigned color and \_\_colorOver is it's color when highlighted.
 * You can set this properties manually in your data. When not set, LudoJS will use colors from a color scheme.
 * You can also set \_\_stroke and \_\_strokeOver for stroke colors.
 * \_\_count is the total number or records in the array.
 * \_\_sum is sum(values) in the array.
 * \_\_fraction is record.value / record.\_\_sum
 * \_\_index is the index of Jane in the array(John has index 0, Jane index 1, Martin index 2 and so on).
 * \_\_percent is the rounded value of \_\_fraction * 100
 * \_\_angle is mostly for internal use and represents this records start angle in radians when all records fill a circle.
 * \_\_radians is how many radians of a circle this record fills. A circle has Math.PI * 2 radians. \_\_angle and radians
 * are only set when values are numeric.
 * |_|_min is the lowest value of all records
 * |_|_max is the highest value of all records.
 *
 *
 * @class ludo.chart.DataSource
 * @param {Object} config
 * @param {Array} config.data Pie chart data.
 * @param {String} config.url Get chart data from this url. config.data will not be set when you use an url.
 * @param {Function} config.valueOf Function which returns value of a node. Two arguments are sent to this method: 1) the record,
 * 2) The View asking for the value. Example
 * <code>
 *     valueOf:function(record, caller){
 *          return record.value;
 *     }
 * </code>
 * @param {Function} config.textOf Function which returns text of a node. The record and caller are sent to this function.
 * You can return different texts based on the type attribute of the caller. example:
 * <code>
 * textOf:function(record, caller){
        if(caller.type == 'chart.Tooltip'){ // return text for the tooltip
            return record.label + ': '+ record.value  + ' (' + record.__percent + '%)';
        }
        // Default text
        return record.label;
    }
 *
 * </code>
 * @param {String} config.valueKey the key in the data for value, default: 'value'
 * @param {Function} getText Function returning text. Argument to this function: The View asking for the text, example, a ludo.chart.Text
 * @param {Function} max Function returning max value for the chart. This is optional. If not set, it will return the maximum value found in the data array.
 * For bar charts, you might want to use this to return a higher value, example: <code>max:function(){ return this.maxVal + 20 }</code>.
 * @param {Function} min Function returning min value for the chart. Default: minimum(0, data arrays minimum value)
 * @param {Function} value. Function returning a value for display. Arguments. 1) value, 2) caller. Example for a label, you might want to return 10 instead of value 10 000 000.
 * @param {Function} increments. Function returning increments for lines, labels etc. This function may return an array of values(example: for a chart with values form 0-100, this function
 * may return [0,10,20,30,40,50,60,70,80,90,100]. This function may also return a numeric value, example: 10 instead of the array. Three arguments are sent to this function: 1) the data arrays
 * minimum value, 2) the data arrays maximum value and 3) The caller, i.e. the SVG view asking for the increments.
 * @param {Function} strokeOf Optional function returning stroke color for chart item, Arguments: 1) chart record, 2) caller
 * @param {Function} strokeOverOf Optional function returning mouse over stroke color for chart item, Arguments: 1) chart record, 2) caller
 * @example
 *     var dataSource = new ludo.chart.DataSource({
        data:[
            { id: 1, label:'John', value:100 },
            { id: 2, label:'Jane', value:245 },
            { id: 3, label:'Martin', value:37 },
            { id: 4, label:'Mary', value:99 },
            { id: 5, label:'Johnny', value:127 },
            { id: 6, label:'Catherine', value:55 },
            { id: 7, label:'Tommy', value:18 }
        ],

        textOf:function(record, caller){
            if(caller.type == 'chart.Tooltip'){ // Text for the tooltip
                return record.label + ': '+ record.value  + ' (' + record.__percent + '%)';
            }
            // Default text
            return record.label;
        },

        valueOf:function(record, caller){
            return record.value;
        }

    });
 */
ludo.chart.DataSource = new Class({
    Extends: ludo.dataSource.JSON,
    type: 'chart.DataSource',
    map: undefined,

    valueOf: undefined,
    textOf: undefined,
    valueKey:'value',

    startAngle: 0,

    color:'#1976D2',

    colorOf: undefined,
    colorOverOf: undefined,

    strokeOf:undefined,
    strokeOverOf:undefined,

    colorUtilObj : undefined,

    count:undefined,

    highlighted:undefined,

    selectedRecord:undefined,

    /**
     * Max value in data array
     * @property {Number} maxVal
     * @mamberof ludo.chart.DataSource.prototype
     */
    maxVal:undefined,

    /**
     * Min value in data array
     * @property {Number} minVal
     * @mamberof ludo.chart.DataSource.prototype
     */
    minVal:undefined,

    _increments:undefined,
    increments:undefined,

    __construct: function (config) {
        this.setConfigParams(config, ['valueKey','color','valueOf', 'textOf', 'getText','max','min','increments','strokeOf', 'strokeOverOf']);
        this.parent(config);

        if(this.valueOf == undefined){
            console.warn("Method valueOf(record, caller) not implemented in chart data source");
        }
        if(this.textOf == undefined){
            console.warn("Method textOf(record, caller) not implemented in chart data source");
        }
    },

    parseNewData: function (data) {
        this.handleData(data);
        this.parent(this.data);
    },

    handleData:function(data){
        this.data = data;
        this.map = {};
        this.startAngle = 0;
        this.minVal = undefined;
        this.maxVal = undefined;
        this.count = this.getCount(this.data);
        this.parseChartBranch(this.data);
        this.updateIncrements();
    },

    update: function (record) {
        this.handleData(this.data);
        this.fireEvent('update', [record, this]);
    },

    updateIncrements:function(){
        if(this.increments == undefined)return;
        var inc = this.increments(this.minVal, this.maxVal, this);
        if(jQuery.isArray(inc)){
            this._increments = inc;
        }else{
            this._increments = [];
            for(var i=this.min(), len = this.max(); i<=len; i+=inc){
                this._increments.push(i);
            }
        }

    },

    getIncrements:function(){
        return this._increments;
    },

    sum: function (branch) {
        var sum = 0;
        jQuery.each(branch, function (key, node) {
            sum += (this.value(node) || 0);
        }.bind(this));
        return sum;
    },

    getCount:function(data){

         var count = 0;
        jQuery.each(data, function(key, node){
            count++;
            if(node.children != undefined && jQuery.isArray(node.children)){
                count += this.getCount(node.children);
            }
        }.bind(this));

        return count;
    },

    updateValues:function(branch, parent){

        jQuery.each(branch, function (key, node) {
            var val = this.value(node);

            if(val == undefined || !isNaN(val)){
                if(node.children != undefined){
                    val = this.sum(node.children);
                    var vk = this.valueKey;

                    if(vk != undefined){
                        node[vk] = val;
                    }
                }
            }

            if(val != undefined && !isNaN(val)){
                if(this.maxVal == undefined){
                    this.maxVal = val;
                }else{
                    this.maxVal = Math.max(this.maxVal, val);
                }

                if(this.minVal == undefined){
                    this.minVal = val;
                }else{
                    this.minVal = Math.min(this.minVal,val);
                }
            }
        }.bind(this));
    },

    parseChartBranch: function (branch, parent) {

        this.updateValues(branch,parent);

        var sum = this.sum(branch);
        var angle = parent && parent.angle ? parent.angle : 0;
        var i = 0;
        jQuery.each(branch, function (key, node) {
            node.__sum = sum;
            var val = this.value(node);
            if(val == undefined || !isNaN(val)){
                if(val != undefined){
                    node.__min = this.minVal;
                    node.__max = this.maxVal;
                    node.__fraction = val / sum;
                    node.__percent = Math.round(node.__fraction * 100);
                    node.__radians = ludo.geometry.degreesToRadians(node.__fraction * 360);
                    node.__angle = angle;
                    node.__count = this.count;
                    angle += node.__radians;
                }
            }

            if(node.index == undefined){
                node.__index = i++;
            }

            this.setColor(node);



            if(node.id == undefined){
                node.id = 'chart-node-' + String.uniqueID();
            }
            if(node.__uid == undefined){
                node.__uid = 'chart-node-' + String.uniqueID();
            }
            this.map[node.id] = node;

            if(node.children != undefined){
                this.parseChartBranch(node.children, node);
            }

        }.bind(this));
    },

    val:function(id, value){
        if(arguments.length == 2){
            if(this.valueKey != undefined){
                var rec = this.byId(id);
                if(rec){
                    rec[this.valueKey] = value;
                    this.update(rec);
                }

            }
        }else{
            return this.valueOf(this.byId(id));
        }
    },

    byId: function (id) {
        if (this.map != undefined) {
            return this.map[id];
        }
        return undefined;
    },

    enterId:function(id){
        this.enter(this.map[id]);    
    },
    
    enter:function(record){
        this.highlighted = record;
        this.fireEvent('enter', [record, this]);
        this.fireEvent('enter' + record.__uid, [record, this]);
    },

    leaveId:function(id){
        this.leave(this.map[id]);    
    },
    
    leave:function(record){
        this.fireEvent('leave', [record, this]);
        this.fireEvent('leave' + record.__uid, [record, this]);
    },
    
    selectId:function(id){
        this.select(this.map[id]);    
    },

    select:function(record){
        if(this.selectedRecord != undefined){
            this.fireEvent('blur', [this.selectedRecord, this]);
            this.fireEvent('blur' + this.selectedRecord.__uid, [this.selectedRecord, this]);
        }
        this.selectedRecord = record;
        this.fireEvent('select', [record, this]);
        this.fireEvent('select' + record.__uid, [record, this]);
    },

    value:function(record, caller){
        var val = this.valueOf != undefined ? this.valueOf(record, caller) : undefined;
        if(val == undefined && this.valueKey != undefined){
            return record[this.valueKey];
        }
        return val;
    },

    isSelected:function(record){
        return this.selectedRecord == record;
    },

    hasData:function(){
        return this.data && this.data.length > 0;
    },

    setColor:function(record){
        var u = false;

        if(record.__color == undefined){

            if(this.colorOf != undefined){
                record.__color = this.colorOf(record);
            }else{
                record.__color = this.color;
            }
            u = true;
        }

        if(record.__colorOver == undefined){
            record.__colorOver = this.colorUtil().brighten(record.__color, 7);
            if(record.__colorOver == record.__color){
                record.__color = this.colorUtil().darken(record.__color, 7);
            }
            u = true;
        }

        if(record.__stroke == undefined && this.strokeOf != undefined){
            record.__stroke = this.strokeOf(record, this);
        }
        if(record.__strokeOver == undefined && this.strokeOverOf != undefined){
            record.__strokeOver = this.strokeOverOf(record, this);
        }
        if(u){
            this.color = this.colorUtil().offsetHue(record.__color, (360 / (record.__count + 1)));
        }
    },

    colorUtil:function(){
        if(this.colorUtilObj == undefined){
            this.colorUtilObj = new ludo.color.Color();
        }
        return this.colorUtilObj;
    },

    getHighlighted:function(){
        return this.highlighted;
    },

    getText:function(caller){

    },

    length:function(){
        return this.data.length;
    },

    max:function(){
        return this.maxVal;
    },

    min:function(){
        return Math.min(0, this.minVal);
    }
});