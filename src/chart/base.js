/**
 * Base class for charts
 * @namespace chart
 * @class Base
 * @type {Class}
 */
ludo.chart.Base = new Class({
    Extends: ludo.View,

    // TODO implement layouts for charts (position of labels, chart etc).
    dataProvider:undefined,
    data:undefined,

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ['dataProvider','data','tooltip','animate']);
        if(!this.css){
            this.css = { 'background-color' : '#fff' };
        }
    },

    ludoRendered:function(){
        this.parent();
        this.renderLabels.delay(30, this);
        this.renderChart.delay(30, this);
    },

    getCanvas:function(){
        var addEvents = !this.canvas;
        var c = this.parent();
        if(addEvents)c.addEvent('resize', this.resizeChart.bind(this));
        return c;
    },

    setData:function(data){
        this.data = data;
        this.updateChart();
    },

    renderLabels:function(){

    },

    renderChart:function(){
        this.data = this.getChartData();
    },

    updateChart:function(){

    },

    resizeChart:function(){

    },

    getChartData:function(){
        return this.dataProvider ? this.dataProvider.getData() : this.data;
    },

    color:function(){
        if(this.colorHandler === undefined){
            this.colorHandler = new ludo.color.Color();
        }
        return this.colorHandler;
    },

    getChartOrigion:function(){
        // TODO return center position of chart area, i.e. area excluding label area
        return this.getCanvas().getOrigin();
    },

    getTooltipStyles:function(){
        var s = this.tooltip && this.tooltip.css ? this.tooltip.css : {};
        return Object.merge({
            'stroke-location':'inside',
            'fill-opacity':.7,
            'fill':'#fff',
            'stroke':'#008'
        }, s);
    },

    getSum:function () {
        var sum = 0;
        for (var i = 0; i < this.data.length; i++) {
            sum += this.data[i].value;
        }
        return sum;
    },

    getPercent:function(item){
        return item.value / this.getSum() * 100;
    }

});