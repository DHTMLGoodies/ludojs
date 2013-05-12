/**
 Add-on for Pie chart. This add-on highlights slices in a pie chart by showing a larger slice behind
 current highlighted chart slice.
 See {{#crossLink "chart/Pie"}}{{/crossLink}} for example of use.
 @namespace chart
 @class PieSliceHighlighted
 @type {Class}
 @example
    {
        type:'pie.Chart',
        addOns:[
            {
                type:'chart.PieSliceHighlighted',
                size : 5,
                styles:{
                    'fill' : '#aabbcc'
                }
            }
        ]
        ...
        ...
    }
 */
ludo.chart.PieSliceHighlighted = new Class({
    Extends:ludo.chart.AddOn,
    tagName:'path',
    /**
     Styling of slice
     @config {Object} styles
     @default { 'fill' : '#ccc' }
     @example
        styles:{
            'fill' : '#f00'
        }
     */
    styles:undefined,

    /**
     * Size of slice
     * @config {Number} size
     * @default 10
     */
    size : 10,

    ludoConfig:function (config) {
        this.parent(config);

        this.setConfigParams(config, ['styles','size']);
        this.styles = this.styles || { "fill": "#ccc" };
        this.node = new ludo.canvas.Path();
        this.node.setStyles(this.styles);

        this.getParent().adopt(this.node);
        this.node.toBack();
    },

    ludoEvents:function () {
        this.parent();
        this.getParent().addEvent('enterRecord', this.show.bind(this));
        this.getParent().addEvent('leaveRecord', this.hide.bind(this));
        this.getParent().addEvent('focusRecord', this.focus.bind(this));
        this.getParent().addEvent('blurRecord', this.blur.bind(this));
    },

    show:function (record) {
        var f = this.getParent().getFragmentFor(record);

        var path = f.getPath({
            radius:this.getParent().getRadius() + this.size,
            angle:record.getAngle(),
            degrees:record.getDegrees()
        });
        this.node.set('d', path);

        if (record.isFocused()) {
            var t = f.nodes[0].getTranslate();
            this.node.translate(t);
        }else{
            this.node.translate(0,0);
        }
        this.node.show();
    },

    hide:function () {
        this.node.hide();
    },

    focus:function (record) {
        var f = this.getParent().getFragmentFor(record);
        var coords = f.centerOffset(this.size);
        this.node.translate(0,0);
        this.node.engine().effect().fly(this.node.getEl(), coords.x, coords.y,.1);

    },

    blur:function(){
        this.node.engine().effect().flyBack(this.node.getEl(),.1);
    }
});