/**
 * Base class for fragments/SVG elements used by charts, example slices in a Pie chart or bars in a bar chart.
 * @namespace chart
 * @class item
 */
ludo.chart.Item = new Class({
    Extends:ludo.canvas.NamedNode,
    tooltip:undefined,
    chart:undefined,

    initialize:function (chart, config) {
        // TODO clean access to chart View from all sub views and sub SVG elements.
        this.chart = chart;

        this.parent(config);
        chart.getCanvas().adopt(this);
        this.addEvent('mouseenter', this.createTooltip.bind(this));
    },

    createTooltip:function (e) {
        if (this.tooltip === undefined) {
            // TODO configurable Tooltip styles or stylesheet
            // TODO possible to turn tooltip on/off
            var p = new ludo.canvas.Paint(this.chart.getTooltipStyles());
            this.chart.getCanvas().adopt(p);
            this.tooltip = new ludo.chart.Tooltip(this, p);
            this.tooltip.showTooltip(e);
        }
    }
});