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
 *
 * Some charts(example bar charts) accepts nested data, example:
 *
 * <code>
 *
 * [
 * {
 *      "country": "United Kingdom",
 *      "children": [
 *          { "name":"0-14", "people" : 5000 }, { "name":"15-64", "people" : 20000 }, { "name":"65-", "people" : 4000 }
 *      ]
 * },
 * {
 *      "country": "Germany",
 *      "children": [
 *          { "name":"0-14", "people" : 6000 }, { "name":"15-64", "people" : 29000 }, { "name":"65-", "people" : 4000 }
 *      ]
 * }
 * ]
 *
 * </code>
 *
 * The chart data source will add some special properties and functions to the records.
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
 *      \_\_minAgr : 18
 *      \_\_max : 245
 *      \_\_maxAggr : 245
 *      \_\_parent: undefined
 *      \_\_indexStartVal: undefined
 *      \_\_indexFraction: undefined
 *      \_\_indexSum: undefined
 *
 *      getChildren:function()
 *      getParent():function()
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
 * \_\_min is the minimum value found in the data set
 * \_\_max is the max value found in the data set.
 * \_\_maxAggr is useful for nested data sets. It is set to max(child values) in the data set. For non-nested sets, it will
 * have the same value as \_\_max. Example: for
 * * <code>
 *
 * [
 * {
 *      "country": "United Kingdom",
 *      "children": [
 *          { "name":"0-14", "people" : 5000 }, { "name":"15-64", "people" : 20000 }, { "name":"65-", "people" : 4000 }
 *      ]
 * },
 * {
 *      "country": "Germany",
 *      "children": [
 *          { "name":"0-14", "people" : 6000 }, { "name":"15-64", "people" : 29000 }, { "name":"65-", "people" : 4000 }
 *      ]
 * }
 * ]
 *
 * </code>
 *
 * \_\_maxAggr will be 39000(Sum children of Germany), while \_\_max will be 29000.
 *
 * \_\_parent will for child items contain a reference to parent id which can be retrieved using dataSource.byId(id)
 *
 *  \_\_indexStartVal stores the sum of previous records with the same index as this one. In the example with countries above,
 *  , the value for { "name":"0-14", "people" : 6000 } will be 5000, since the first child of United Kingdom has value 5000.
 *  This value is used when rendering stacked area charts.
 *
 *  \_\_indexFraction stores the size of this record divided by the sum of all records with the same index.
 *
 * getParent() returns a reference to parent record if set, it will return undefined otherwise.
 * getChildren() returns reference to child data array, example the children array of Germany in the example above
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
 * @param {Function} config.getText Function returning text. Argument to this function: The View asking for the text, example, a ludo.chart.Text
 * @param {Function} config.max Function returning max value for the chart. This is optional. If not set, it will return the maximum value found in the data array.
 * For bar charts, you might want to use this to return a higher value, example: <code>max:function(){ return this.maxVal + 20 }</code>.
 * @param {Function} config.min Function returning min value for the chart. Default: minimum(0, data arrays minimum value)
 * @param {Function} config.value. Function returning a value for display. Arguments. 1) value, 2) caller. Example for a label, you might want to return 10 instead of value 10 000 000.
 * @param {Function} config.increments. Function returning increments for lines, labels etc. This function may return an array of values(example: for a chart with values form 0-100, this function
 * may return [0,10,20,30,40,50,60,70,80,90,100]. This function may also return a numeric value, example: 10 instead of the array. Three arguments are sent to this function: 1) the data arrays
 * minimum value, 2) the data arrays maximum value and 3) The caller, i.e. the SVG view asking for the increments.
 * @param {Function } config.valueForDisplay Optional function returning value to display in a view. Arguments: 1) value, 2) caller. Let's say you have a
 * data source with values in millions, example: Population in countries. For the chart.ChartValues view, you might want to display number of millians, i.e.
 * 10 instead of 10000000. This can be done with a valueForDisplay function:
 * <code>
 *     valueForDisplay:function(value, caller){
 *          if(caller.type == 'chart.ChartValues')return Math.round(value / 1000000) + " mill";
 *          return value;
 *     }
 * </code>
 * @param {Function} config.strokeOf Optional function returning stroke color for chart item, Arguments: 1) chart record, 2) caller
 * @param {Function} config.strokeOverOf Optional function returning mouse over stroke color for chart item, Arguments: 1) chart record, 2) caller
 * @param {String} config.childKey Key for child arrays, default: "children"
 * @param {Function} config.shouldInheritColor Optional function returning true if color should be inherited from parent record. Input: record, 2: caller
 * @param {Function} config.shapeOf Optional function returning shape of a record. This is used when rendering dots for the line chart. Default shape is "circle". Can also be
 * "rect", "triangle" or path to an image.
 * @param {Number} config.minBrightness Optional minimum brightness(0-100) when setting colors.
 * @param {Number} config.maxBrightness Optional maximum brightness(0-100) when setting colors.
 * @param {Number} config.minSaturation Optional minimum saturation/color intensity(0-100) when setting colors.
 * @param {Number} config.maxSaturation Optional maximum saturation/color intensity(0-100) when setting colors.
 * @param {Function} config.indexStartValueOf Optional function returning sum value of all previous records
 * with same index. By default, it returns record.\_\_indexStartVal. Example for { "name":"0-14", "people" : 6000 }
 * above it will return 5000, since this is index 0 and the child of United Kingdom with same index has value 5000.
 * This function is used in <a href="../demo/chart/area-world-population-distribution.php">the area chart demo</a> where
 * the chart is configured to render percentage values.
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
    valueKey: 'value',
    childKey: 'children',

    startAngle: 0,

    color: '#1976D2',


    colorOf: undefined,
    colorOverOf: undefined,

    strokeOf: undefined,
    strokeOverOf: undefined,

    colorUtilObj: undefined,

    count: undefined,

    highlighted: undefined,

    selectedRecord: undefined,

    /**
     * Max value in data array
     * @property {Number} maxVal
     * @memberof ludo.chart.DataSource.prototype
     */
    maxVal: undefined,

    dataFor: undefined,
    sortFn: undefined,

    _maxIndexSum:undefined,


    /**
     * Aggregated max value in the data array. Sum value of child data.
     * @property {Number} maxValAggr
     * @memberof ludo.chart.DataSource.prototype
     * @example
     * [
     * {
     *      "country": "United Kingdom",
     *      "children": [
     *          { "name":"0-14", "people" : 5000 }, { "name":"15-64", "people" : 20000 }, { "name":"65-", "people" : 4000 }
     *      ]
     * },
     * {
     *      "country": "Germany",
     *      "children": [
     *          { "name":"0-14", "people" : 6000 }, { "name":"15-64", "people" : 29000 }, { "name":"65-", "people" : 4000 }
     *      ]
     * }
     * ]
     * // maxValAggr will here be 39000 (Sum children of "Germany").
     */
    maxValAggr: undefined,

    /**
     * Min value in data array
     * @property {Number} minVal
     * @memberof ludo.chart.DataSource.prototype
     */
    minVal: undefined,

    minValAgr: undefined,

    _increments: undefined,
    increments: undefined,

    minBrightness: undefined,
    maxBrightness: undefined,
    minSaturation: undefined,
    maxSaturation: undefined,


    __construct: function (config) {
        this.setConfigParams(config, ['indexStartValueOf', 'minBrightness', 'maxBrightness', 'minSaturation',
            'maxSaturation', 'shapeOf', 'dataFor', 'sortFn', 'shouldInheritColor', 'childKey', 'valueKey',
            'color', 'valueOf', 'textOf', 'getText', 'max', 'min', 'increments', 'strokeOf', 'strokeOverOf', 'valueForDisplay']);
        this.parent(config);



        if (this.valueOf == undefined) {
            console.warn("Method valueOf(record, caller) not implemented in chart data source");
        }
        if (this.textOf == undefined) {
            console.warn("Method textOf(record, caller) not implemented in chart data source");
        }
    },

    parseNewData: function (data) {
        this.handleData(data);
        this.parent(this.data);
    },

    handleData: function (data) {
        this.data = data;
        this.map = {};
        this.startAngle = 0;
        this.minVal = undefined;
        this.minValAgr = undefined;
        this.maxVal = undefined;
        this.maxValAggr = undefined;
        this.count = this.getCount(this.data);


        this.parseChartBranch(this.data);
        this.setSumIndexes(this.data);

        if (this.sortFn != undefined) {
            this.sortBranch(this.data);
        }
        this.updateIncrements();


    },

    update: function (record) {
        this.handleData(this.data);
        this.fireEvent('update', [record, this]);
    },

    updateIncrements: function () {
        if (this.increments == undefined)return;
        var inc = this.increments(this.minVal, this.maxVal, this);
        if (jQuery.isArray(inc)) {
            this._increments = inc;
        } else {
            this._increments = [];
            for (var i = this.min(), len = this.max(); i <= len; i += inc) {
                this._increments.push(i);
            }
        }

    },

    getIncrements: function () {
        return this._increments;
    },

    sum: function (branch) {
        var sum = 0;
        jQuery.each(branch, function (key, node) {
            sum += (this.value(node, this) || 0);
        }.bind(this));
        return sum;
    },

    getCount: function (data) {

        var count = 0;
        jQuery.each(data, function (key, node) {
            count++;
            if (node[this.childKey] != undefined && jQuery.isArray(node[this.childKey])) {
                count += this.getCount(node[this.childKey]);
            }
        }.bind(this));

        return count;
    },

    updateValues: function (branch, parent) {

        jQuery.each(branch, function (key, node) {
            var val = this.value(node, this);

            if (val == undefined || !isNaN(val)) {
                if (node[this.childKey] != undefined) {
                    val = this.sum(node[this.childKey]);
                    var vk = this.valueKey;

                    if (vk != undefined) {
                        node[vk] = val;
                    }
                }
            }

            if (val != undefined && !isNaN(val)) {
                if (node[this.childKey] == undefined) {
                    this.setMax(val);
                    this.setMin(val);
                }
                this.setMinAgr(val);
                this.setMaxAgr(val);
            }
        }.bind(this));
    },

    setMax: function (val) {
        if (this.maxVal == undefined) {
            this.maxVal = val;
        } else {
            this.maxVal = Math.max(this.maxVal, val);
        }
    },

    setMaxAgr: function (val) {
        if (this.maxValAggr == undefined) {
            this.maxValAggr = val;
        } else {
            this.maxValAggr = Math.max(this.maxValAggr, val);
        }
    },

    setMin: function (val) {
        if (this.minVal == undefined) {
            this.minVal = val;
        } else {
            this.minVal = Math.min(this.minVal, val);
        }
    },

    setMinAgr: function (val) {
        if (this.minValAgr == undefined) {
            this.minValAgr = val;
        } else {
            this.minValAgr = Math.min(this.minValAgr, val);
        }
    },

    sortBranch: function (branch, parent) {
        if (parent != undefined && this.sortFn != undefined) {
            var fn = this.sortFn(parent, this);
            if (fn != undefined) {
                branch = branch.sort(fn);
            }
        }
        jQuery.each(branch, function (index, node) {
            node.__index = index;
            if (node[this.childKey] != undefined) {
                this.sortBranch(node[this.childKey], node);
            }
        }.bind(this));
    },

    parseChartBranch: function (branch, parent) {


        this.updateValues(branch, parent);

        var sum = this.sum(branch);
        var angle = parent && parent.angle ? parent.angle : 0;
        var i = 0;
        jQuery.each(branch, function (key, node) {
            node.__sum = sum;
            var val = this.value(node, this);
            if (!isNaN(val)) {

                node.__min = this.minVal;
                node.__max = this.maxVal;
                node.__maxAggr = this.maxValAggr;
                node.__minAgr = this.minValAgr;
                node.__fraction = val / sum;
                node.__percent = Math.round(node.__fraction * 100);
                node.__radians = ludo.geometry.toRadians(node.__fraction * 360);
                node.__angle = angle;
                angle += node.__radians;

            }
            node.__count = this.count;

            if (node.index == undefined) {
                node.__index = i++;
            }

            if (parent != undefined) {
                node.__parent = parent.id;

                node.getParent = function () {
                    return parent;
                }
            } else {
                node.getParent = function () {
                    return undefined;
                }
            }


            if (node.id == undefined) {
                node.id = 'chart-node-' + String.uniqueID();
            }
            if (node.__uid == undefined) {
                node.__uid = 'chart-node-' + String.uniqueID();
            }
            this.map[node.id] = node;


            var c = this.childKey;
            node.getChildren = function () {
                return node[c];
            };

            node.getChild = function (index) {
                return node[c][index];
            };

            this.setColor(node);

            if (node[this.childKey] != undefined) {
                this.parseChartBranch(node[this.childKey], node);
            }


        }.bind(this));



        return branch;
    },

    setSumIndexes:function(data){
        var children = data[0].getChildren();
        if(children == undefined)return;
        var sumIndexes = [];
        jQuery.each(data, function(index, record){


            var c = record.getChildren();
            if(c && c.length){
                jQuery.each(c, function(i, childRecord){
                    childRecord.__val = this.valueOf(childRecord, this) || 0;

                    if(sumIndexes.length == i){
                        sumIndexes.push(0);
                    }
                    childRecord.__indexStartVal = sumIndexes[i];
                    sumIndexes[i] += childRecord.__val;
                }.bind(this));
            }
        }.bind(this));

        this._maxIndexSum = undefined;

        jQuery.each(data, function(index, record){
            var c = record.getChildren();
            if(c && c.length){
                jQuery.each(c, function(i, childRecord){
                    if(this._maxIndexSum == undefined){
                        this._maxIndexSum = sumIndexes[i];
                    }else{
                        this._maxIndexSum = Math.max(this._maxIndexSum, sumIndexes[i]);
                    }
                    childRecord.__indexSum = sumIndexes[i];
                    childRecord.__indexFraction = childRecord.__val / sumIndexes[i];
                    childRecord.__indexStartFraction = childRecord.__indexStartVal / sumIndexes[i];
                }.bind(this));
            }
        }.bind(this));
    },

    maxIndexSum:function(){
        return this._maxIndexSum;
    },

    val: function (id, value) {
        if (arguments.length == 2) {
            if (this.valueKey != undefined) {
                var rec = this.byId(id);
                if (rec) {
                    rec[this.valueKey] = value;
                    this.update(rec);
                }

            }
        } else {
            return this.valueOf(this.byId(id));
        }
    },

    byId: function (id) {
        if (this.map != undefined) {
            return this.map[id];
        }
        return undefined;
    },

    enterId: function (id) {
        this.enter(this.map[id]);
    },

    enter: function (record) {
        this.highlighted = record;
        this.fireEvent('enter', [record, this]);
        this.fireEvent('enter' + record.__uid, [record, this]);
    },

    leaveId: function (id) {
        this.leave(this.map[id]);
    },

    leave: function (record) {
        this.fireEvent('leave', [record, this]);
        this.fireEvent('leave' + record.__uid, [record, this]);
    },

    selectId: function (id) {
        this.select(this.map[id]);
    },

    select: function (record) {
        if (this.selectedRecord != undefined) {
            this.fireEvent('blur', [this.selectedRecord, this]);
            this.fireEvent('blur' + this.selectedRecord.__uid, [this.selectedRecord, this]);
        }
        this.selectedRecord = record;
        this.fireEvent('select', [record, this]);
        this.fireEvent('select' + record.__uid, [record, this]);
    },

    value: function (record, caller) {
        var val = this.valueOf != undefined ? this.valueOf(record, caller) : undefined;
        if (val == undefined && this.valueKey != undefined) {
            return record[this.valueKey];
        }
        return val;
    },

    isSelected: function (record) {
        return this.selectedRecord == record;
    },

    hasData: function () {
        return this.data && this.data.length > 0;
    },

    shapes: [
        'circle', 'rect', 'triangle', 'rotatedrect'
    ],
    shapeIndex: 0,

    sumBy: function (search, key) {
        return this._sumBy(this.data, search, key);
    },

    _sumBy: function (array, search, key) {
        var sum = 0;

        jQuery.each(array, function (index, record) {
            if (this.isMatching(record, search)) {
                sum += record[key];
            }
            var children = record.getChildren();
            if (children && children.length > 0) {
                sum += this._sumBy(children, search, key, sum);
            }

        }.bind(this));

        return sum;

    },

    isMatching: function (record, search) {
        for (var key in search) {
            if (record[key] == undefined)return false;
            if (record[key] != search[key])return false;
        }
        return true;

    },

    setColor: function (record) {
        var u = false;

        if (this.shouldInheritColor(record) && record.__parent) {
            var p = record.getParent();
            record.__color = p.__color;
            record.__colorOver = p.__colorOver;
            record.__stroke = p.__stroke;
            record.__strokeOver = p.__strokeOver;
            record.__shape = p.__shape;

            this.color = this.colorUtil().offsetHue(this.color, (360 / (record.__count + 1)));
            return;
        }

        if (record.__shape == undefined) {
            record.__shape = this.shapes[this.shapeIndex++];
            this.shapeIndex = this.shapeIndex % this.shapes.length;
        }

        if (record.__color == undefined) {
            if (this.colorOf != undefined) {
                record.__color = this.colorOf(record);
            }
            if (!record.__color) {
                record.__color = this.color;
            }
            u = true;
        }

        if (record.__colorOver == undefined) {
            record.__colorOver = this.colorUtil().brighten(record.__color, 7);
            if (record.__colorOver == record.__color) {
                record.__color = this.colorUtil().darken(record.__color, 7);
            }
            u = true;
        }

        if (record.__stroke == undefined && this.strokeOf != undefined) {
            record.__stroke = this.strokeOf(record, this);
        }
        if (record.__strokeOver == undefined && this.strokeOverOf != undefined) {
            record.__strokeOver = this.strokeOverOf(record, this);
        }

        this.adjustColor(record);


        if (u) {
            this.color = this.colorUtil().offsetHue(record.__color, (360 / (record.__count + 1)));
        }
    },

    adjustColor: function (record) {
        var b, s;
        var u = this.colorUtil();
        if (this.minBrightness != undefined) {
            b = u.brightness(record.__color);
            if (b < this.minBrightness) {
                record.__color = u.brightness(record.__color, this.minBrightness);
            }
        }
        if (this.maxBrightness != undefined) {
            b = u.brightness(record.__color);
            if (b > this.maxBrightness) {
                record.__color = u.brightness(record.__color, this.maxBrightness);
            }
        }

        if (this.minSaturation != undefined) {
            s = u.saturation(record.__color);
            if (s < this.minSaturation) {
                record.__color = u.saturation(record.__color, this.minSaturation);
            }
        }
        if (this.maxSaturation != undefined) {
            s = u.saturation(record.__color);
            if (s > this.maxSaturation) {
                record.__color = u.saturation(record.__color, this.maxSaturation);
            }
        }
    },

    colorUtil: function () {
        if (this.colorUtilObj == undefined) {
            this.colorUtilObj = new ludo.color.Color();
        }
        return this.colorUtilObj;
    },

    getHighlighted: function () {
        return this.highlighted;
    },

    getText: function (caller) {

    },

    length: function () {
        return this.data.length;
    },

    max: function () {
        return this.maxVal;
    },

    min: function () {
        return Math.min(0, this.minVal);
    },

    valueForDisplay: function (value) {
        return value;
    },

    shouldInheritColor: function () {
        return false;
    },

    getData: function (caller) {
        caller = caller || this;
        var allData = this.parent();
        var d = this.dataFor != undefined ? this.dataFor(caller, allData) : undefined;
        return d ? d : allData;
    },

    shapeOf: function () {
        return undefined;
    },

    indexStartValueOf:function(record){
        return record.__indexStartVal || 0;
    }
});

