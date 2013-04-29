ludo.chart.ChartBase = new Class({
    Extends: ludo.chart.Group,
    currentHighlighted:undefined,

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ['animate']);
    },

    update:function(data){
        this.parent(data);
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
    }
});