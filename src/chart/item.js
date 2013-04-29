/**
 * Base class for fragments/SVG elements used by charts, example slices in a Pie chart or bars in a bar chart.
 * @namespace chart
 * @class item
 */
ludo.chart.Item = new Class({
    Extends:ludo.canvas.NamedNode,
    tooltip:undefined,
    group:undefined,

    initialize:function (group, config) {
        this.group = group;
        this.parent(config);
		group.adopt(this);
        this.addEvent('mouseenter', this.createTooltip.bind(this));
    },

    createTooltip:function (e) {
        if (this.tooltip === undefined) {
            // TODO configurable Tooltip styles or stylesheet
            // TODO possible to turn tooltip on/off
            var p = new ludo.canvas.Paint(this.group.getTooltipStyles());
            this.group.getCanvas().adopt(p);
            this.tooltip = new ludo.chart.Tooltip(this, p);
            this.tooltip.showTooltip(e);
        }
    }
});