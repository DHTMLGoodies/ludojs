ludo.chart.Item = new Class({
    Extends:ludo.canvas.NamedNode,
    tooltip:undefined,
    chart:undefined,

    initialize:function (chart, config) {
        this.chart = chart;

        this.parent(config);
        chart.getCanvas().adopt(this);
        this.addEvent('mouseenter', this.createTooltip.bind(this));
    },

    createTooltip:function (e) {
        if (this.tooltip === undefined) {
            var p = new ludo.canvas.Paint(
                {
                    'stroke-location':'inside',
                    'fill-opacity':.7,
                    'fill':'#fff',
                    'stroke':'#f00'
                });
            this.chart.getCanvas().adopt(p);
            this.tooltip = new ludo.chart.Tooltip(this, p);
            this.tooltip.showTooltip(e);
        }
    }
});