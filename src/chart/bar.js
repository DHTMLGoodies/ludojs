/**
 * Bar Chart component
 * @class ludo.chart.Bar
 * @augments ludo.chart.Base
 * @param {Object} config
 * @param {String} config.orientation Bar chart orientation, __horizontal__ or __vertical__
 * @param {Number} config.barSize Fraction width of bars, default: 0.8
 * @param {Boolean} config.animate True to initially animate the chart, default: false
 * @param {Function} config.easing Easing method to use. default: ludo.svg.easing.outSine
 * @param {Function} config.duration Animation duration in ms(1/1000s). Default: 300
 * @param {Boolean} config.stacked Stack child data items
 */
ludo.chart.Bar = new Class({

    Extends: ludo.chart.Base,
    type:'chart.Bar',

    nodes: undefined,
    orientation: 'horizontal',
    barSize: undefined,

    outline: undefined,
    lines: undefined,
    animationDuration : 500,

    fragmentType : 'chart.BarItem',
    stacked:false,

    __construct: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['outline', 'bgLines', 'orientation','stacked']);

        this.barSize = config.barSize || .8;
        this.lineIncrement = config.lineIncrement || 10;
        this.nodes = {
            outline: {},
            lines: undefined,
            bars: [],
            barMap: {}
        };
    },

    renderBackgroundItems: function () {
        this.parent();


        this.createOutline();
    },


    render:function(){
        this.parent();
        this.resizeElements();

    },

    enter: function (record) {
        
    },

    leave: function (record) {

    },

    fn: function (name, record) {
        var ds = this.ds;
        return function () {
            ds[name](record.id);
        };
    },

    createOutline: function () {
        if (!this.outline)return;
        var s = this.getSize();
        if (this.outline.left || this.outline.bottom || this.outline.top || this.outline.right) {

            jQuery.each(this.outline, function (key, styles) {
                var pos = {
                    x1: 0, y1: 0, x2: 0, y2: 0
                };

                var el = this.outline[key] = new ludo.svg.Node('line', pos);
                el.css(styles);
                this.append(el);
            }.bind(this));
        } else {

            var el = this.outline['around'] = new ludo.svg.Rect({
                x: 0, y: 0, width: s.x, height: s.y
            });
            el.css(this.outline);
            this.append(el);
        }
    },

    getLine: function (index) {
        if(this.nodes.lines == undefined){
            this.nodes.lines = [];
        }
        if (this.nodes.lines[index] == undefined) {
            var el = new ludo.svg.Node('line', {x1: 0, y1: 0, x2: 0, y2: 0});
            this.append(el);
            el.css(this.bgLines);
            this.nodes.lines.push(el);
        }
        return this.nodes.lines[index];
    },

    onResize: function () {
        this.parent();
        this.resizeElements();
    },

    resizeElements: function () {
        this.resizeOutline();
        this.resizeBgLines();
        this.resizeBars();

        jQuery.each(this.nodes.outline, function (key, el) {
            el.toFront();
        });
    },



    resizeBars: function () {
        var s = this.getSize();
        var d = this.ds.getData(this);
        var a = { x : 0, y:0 ,width:s.x,height:s.y};
        var availSize = this.orientation == 'horizontal' ? s.x / d.length : s.y / d.length;

        var insetX = 0;
        var insetY = 0;
        if(this.orientation == 'horizontal'){
            a.width = (s.x / d.length) * this.barSize;
            insetX = (availSize - a.width) / 2;
        }else{
            a.height =(s.y / d.length) * this.barSize;
            insetY = (availSize - a.height) / 2;
        }


        for (var i = 0; i < d.length; i++) {
            
            this.fragments[i].setArea(a.x + insetX,a.y + insetY,a.width,a.height);

            if(this.orientation == 'horizontal'){
                a.x += availSize;
            }else{
                a.y += availSize;
            }
        }
    },

    resizeBgLines: function () {
        if (this.bgLines == undefined)return;

        var s = this.getSize();
        var min = this.ds.min();
        var max = this.ds.max();

        var values = ludo.chart.LineUtil.values(min, max, this.orientation == 'vertical'? s.x : s.y);

        jQuery.each(this.nodes.lines, function(i, line){
            line.hide();
        });


        for (var i = 0; i < values.length; i++) {
            var r = (values[i] - min) / (max - min);
            var l = this.getLine(i);

            l.show();
            if (this.orientation == 'horizontal') {
                l.attr('x2', s.x);
                l.attr('y1', s.y * r);
                l.attr('y2', s.y * r);
            } else {
                l.attr('y2', s.y);
                l.attr('x1', s.x * r);
                l.attr('x2', s.x * r);
            }

        }
    },

    resizeOutline: function () {
        var s = this.getSize();
        jQuery.each(this.outline, function (key, el) {
            el.toFront();
            switch (key) {
                case 'around':
                    el.css({
                        width: s.x, height: s.y
                    });
                    break;
                case 'left':
                    el.attr('y2', s.y);
                    break;
                case 'right':
                    el.attr('x2', s.x);
                    el.attr('x1', s.x);
                    el.attr('y2', s.y);
                    break;
                case 'top':
                    el.attr('x2', s.x);
                    break;
                case 'bottom':
                    el.attr('x2', s.x);
                    el.attr('y1', s.y);
                    el.attr('y2', s.y);
                    break;
            }
        }.bind(this));
    },

    getTooltipPosition:function(){
        return this.orientation == 'horizontal' ? 'above': 'right';
    }

});