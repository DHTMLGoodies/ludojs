ludo.chart.ChartBase = new Class({
    Extends: ludo.canvas.Group,
    currentHighlighted:undefined,
    chartItems:[],
	startColor:'#561AD9',
    animation:{
        duration:1,
        fps:33
    },
	rendered:false,

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ['animate','animation']);
    },

	render:function(){
		if (!this.data)return;
		this.rendered = true;
	},

    update:function(data){
        this.data = data;
        this.render(this.rendered);
    },

    resize:function(config){
        this.parent(config);
        this.render();
    },

    toggleHighlight:function (item) {
        if (this.currentHighlighted && item !== this.currentHighlighted && this.currentHighlighted.isHighlighted()) {
            this.currentHighlighted.highlight();
        }
        this.currentHighlighted = item;
    },

    getCenter:function () {
        return {
            x : this.width / 2,
            y : this.height /2
        }
    },

    getCanvas:function(){
        return this.parentComponent.getCanvas();
    },

    getChart:function(){
        return this.parentComponent;
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

    getAnimationSpec:function(){
        return this.animation;
    },

    getPrevious:function(item){
        var index = this.chartItems.indexOf(item);
        return index -1 >= 0 ? this.chartItems[index-1] : undefined;
    }
});