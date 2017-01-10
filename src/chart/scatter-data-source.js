/**
 * Data Source for Scatter Charts
 * @class ludo.chart.ScatterDataSource
 * @augments ludo.chart.DataSource
 * @param {Object} config
 * @param {Function} minX Function returning minX value for the chart. Default is minimum x of data. You will typically return
 * 0 here if the chart should start at zero.
 * @param {Function} minY function returning minY value for the chart
 * @param {Function} maxX Function returning maxX value for the chart
 * @param {Function} maxy Function returning maxY value for the chart
 *
 */
ludo.chart.ScatterDataSource = new Class({
    Extends: ludo.chart.DataSource,
    _minX:undefined,
    _maxX:undefined,
    _minY:undefined,
    _maxY:undefined,
    _minMagnitude:undefined,
    _maxMagnitude:undefined,

    __construct:function(config){
        this.parent(config);
        this.setConfigParams(config, ['minX','maxX', 'minY','maxY']);


    },

    parseNode:function(node, parent, i, sum, angle){
        if(jQuery.isArray(node)){
            this._setMin('_minX', node[0]);
            this._setMax('_maxX', node[0]);
            this._setMin('_minY', node[1]);
            this._setMax('_maxY', node[1]);

            if(node.length == 3){
                this._setMin('_minMagnitude', node[2]);
                this._setMax('_maxMagnitude', node[2]);
            }

            node = {
                x : node[0], y: node[1], magnitude: node.length == 3 ? node[2]: 1
            }
        }

        return this.parent(node,parent,i,sum,angle);

    },

    shouldInheritColor:function(){
        return true;
    },
    
    _setMin:function(key, val){
        if(this[key] == undefined)this[key] = val; else this[key] = Math.min(this[key], val);
    },

    _setMax:function(key,val){
        if(this[key] == undefined)this[key] = val; else this[key] = Math.max(this[key], val);
    },

    minX:function(){
        return this._minX;
    },

    maxX:function(){
        return this._maxX;
    },

    minY:function(){
        return this._minY;
    },

    maxY:function(){
        return this._maxY;
    }


});