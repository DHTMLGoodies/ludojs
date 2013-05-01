ludo.chart.ChartBase = new Class({
    Extends: ludo.canvas.Group,
    currentHighlighted:undefined,
    chartItems:[],
    animation:{
        duration:1,
        fps:33
    },

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ['animate','animation']);
    },

    update:function(data){
        this.data = data;
        this.renderChart(this.rendered);
    },

    resize:function(config){
        this.parent(config);
        this.renderChart();
    },

    toggleHighlight:function (item) {
        if (this.currentHighlighted && item !== this.currentHighlighted && this.currentHighlighted.isHighlighted()) {
            this.currentHighlighted.highlight();
        }
        this.currentHighlighted = item;
    },

    getChartOrigin:function () {
        var b = this.parentComponent.getBody();
        return {
            x : b.offsetWidth / 2,
            y : b.offsetHeight /2
        }
    },

    getCanvas:function(){
        return this.parentComponent.getCanvas();
    },

    getChart:function(){
        return this.parentComponent;
    },

    color:function(){
        if(this.colorHandler === undefined){
            this.colorHandler = new ludo.color.Color();
        }
        return this.colorHandler;
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

    getChartItem:function(key){
        if (this.chartItems[key] === undefined) {
            this.chartItems[key] = this.createDependency('chartItem-'+ key,
                {
                    type : this.itemType,
                    group : this,
                    styles : this.getChartItemStyle(key)
                });

            this.chartItems[key].addEvent('highlight', this.toggleHighlight.bind(this));
        }
        return this.chartItems[key];
    },

    getChartItemStyle:function(key){
        var color = this.getColor(key);
        return {
            'stroke-location':'inside',
            'fill':color,
            'stroke-linejoin':'round',
            'stroke':'#ffffff',
            'cursor':'pointer'
        };
    },

    getColor:function (key) {
        return this.data[key].color ? this.data[key].color : this.color().offsetHue(this.startColor, key * (360 / (this.data.length + 1)));
    },

    getAnimationSpec:function(){
        return this.animation;
    },

    getPrevious:function(item){
        var index = this.chartItems.indexOf(item);
        return index -1 >= 0 ? this.chartItems[index-1] : undefined;
    }
});