/**
 Add-on for Pie chart. This add-on highlights slices in a pie chart by showing a larger slice behind
 current highlighted chart slice.
 See {{#crossLink "chart/Pie"}}{{/crossLink}} for example of use.
 @namespace ludo.chart
 @class ludo.chart.PieSliceHighlighted
 @param {Object} config
 @param {Object} config.styles. Example:
 <code>
 styles:{
            'fill' : '#f00'
        }
 </code>
 @param {Number} config.size Highlight size, default: 5
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

    styles:undefined,

    size : 5,

    __construct:function (config) {
        this.parent(config);

        this.setConfigParams(config, ['styles','size']);

        this.node = new ludo.canvas.Path();
        if(this.styles){
            this.node.css(this.styles);
        }else{
            this.node.css('fill-opacity' , .3);
        }

        this.getParent().append(this.node);
        this.node.toBack();
    },

    ludoEvents:function () {
        this.parent();
        var p = this.getParent().dataProvider();
        p.addEvents({
            'enter' : this.show.bind(this),
            'leave' : this.hide.bind(this),
            'focus' : this.focus.bind(this),
            'blur' : this.blur.bind(this)
        });
    },

    show:function (record) {
        if(!this.getParent().rendered)return;

        var f = this.getParent().getFragmentFor(record);

        var path = f.getPath({
            radius:this.getParent().getRadius() + this.size,
            angle:record.getAngle(),
            degrees:record.getDegrees()
        });
        this.node.set('d', path);
        if(!this.styles){
            this.node.setStyles({ fill : record.get('color')});
        }
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
        var coords = f.centerOffset(this.getParent().getHighlightSize());
        this.node.translate(0,0);
        this.node.engine().effect().fly(this.node.getEl(), coords.x, coords.y,.1);
    },

    blur:function(){
        this.node.engine().effect().flyBack(this.node.getEl(),.1);
    }
});