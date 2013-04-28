ludo.chart.Base = new Class({
    Extends: ludo.View,

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
        this.renderChart.delay(100, this);
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

    renderChart:function(){

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
    }

});