/**
 * Base class for fragments/SVG elements used by charts, example slices in a Pie chart or bars in a bar chart.
 * @namespace chart
 * @class item
 */
ludo.chart.Item = new Class({
    Extends:ludo.canvas.NamedNode,
    tooltip:undefined,
    group:undefined,

    colors:{},

    initialize:function (group, styles) {
        this.group = group;

        this.setColors(styles);

        this.parent({ "class" : this.getStyleObj(styles)});
		group.adopt(this);
        this.addEvent('mouseenter', this.createTooltip.bind(this));
        this.addEvent('mouseenter', this.enter.bind(this));
        this.addEvent('mouseleave', this.leave.bind(this));
    },

    setColors:function(styles){
        this.colors = {
            normal:{
                fill : styles.fill,
                stroke : styles.stroke
            },
            over:{
                fill : this.group.color().brighten(styles.fill, 5),
                stroke : this.group.color().darken(styles.stroke, 5)
            }
        };
    },

    getStyleObj:function(styles){
        var p = new ludo.canvas.Paint(styles);
        this.group.getCanvas().adoptDef(p);
        return p;
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
    },

    enter:function(){
        this.setStyles(this.colors.over);
    },

    leave:function(){
        this.setStyles(this.colors.normal);
    }
});