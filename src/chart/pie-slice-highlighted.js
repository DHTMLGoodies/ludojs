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
        plugins:[
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

    styles:{
        'stroke':'#ffffff',
        'fill' : '#ffffff',
        'stroke-location':'inside',
        'fill-opacity' : .5,
        'stroke-opacity' : .8,
        'stroke-width' : 1
    },

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
        var p = this.getParent().getDataSource();
        p.addEvents({
            'enter' : this.show.bind(this),
            'leave' : this.hide.bind(this),
            'select' : this.focus.bind(this),
            'blur' : this.blur.bind(this)
        });
    },

    show:function (record) {

        if(!this.getParent().rendered)return;
        var f = this.getParent().getFragmentFor(record);

        var path = f.getPath({
            radius:this.getParent().getRadius() + this.size,
            angle:record.__angle,
            radians:record.__radians
        });
        this.node.set('d', path);

        this.node.css('fill', record.__colorOver);

        if (this.getParent().getDataSource().isSelected(record)) {
            var t = f.nodes[0].getTranslate();
            this.node.translate(t[0], t[1]);
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

        this.node.updateMatrix();

        this.node.animate({
            translate:[coords.x,coords.y]
        },100);
    },

    blur:function(){

        this.node.animate({
            translate:[0,0]
        },100);


    }
});