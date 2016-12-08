/**
 * Bar Chart
 * @param {Object} config
 * @param {String} config.orientation Bar chart orientation, __horizontal__ or __vertical__
 * @param {Number} config.barSize Fraction width of bars, default: 0.8
 * @param {Boolean} config.animate True to enable animation
 * @param {Function} config.easing Easing method to use. default: ludo.canvas.easing.outSine
 * @param {Function} config.duration Animation duration in ms(1/1000s). Default: 300
 */
ludo.chart.Bar = new Class({

    Extends: ludo.chart.Base,

    nodes: undefined,
    orientation: 'horizontal',
    barSize: undefined,

    outline: undefined,
    lines: undefined,
    animationDuration : 500,
    __construct: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['outline', 'lines', 'orientation']);

        this.barSize = config.barSize || .8;
        this.lineIncrement = config.lineIncrement || 10;
        this.nodes = {
            outline: {},
            lines: undefined,
            bars: [],
            barMap: {}
        };
    },

    render: function () {
        this.parent();

        this.createLines();
        this.createBars();
        this.createOutline();
        this.resizeElements();

    },

    createBars: function () {
        var d = this.ds.getData();
        for (var i = 0; i < d.length; i++) {
            this.getBar(i, d[i]);
        }
    },


    getBar: function (index, record) {

        if (this.nodes.bars[index] == undefined) {
            var c = {
                x: 0, y: 0, width: 0, height: 0
            };


            var el = new ludo.canvas.Rect(c);
            this.nodes.barMap[record.id] = el;
            this.nodes.bars.push(el);
            this.append(el);
            el.css('fill', record.__color);
            el.on('click', this.fn('selectId', record));

            if (record.__stroke != undefined) {
                el.css('stroke', record.__stroke);
            }

            if (el.mouseenter != undefined) {
                el.mouseenter(this.fn('enterId', record));
                el.mouseleave(this.fn('leaveId', record));
            } else {
                el.on('mouseenter', this.fn('enterId', record));
                el.on('mouseleave', this.fn('leaveId', record));
            }
        }

        return this.nodes.bars[index];
    },

    enter: function (record) {
        this.nodes.barMap[record.id].css('fill', record.__colorOver);
    },

    leave: function (record) {
        this.nodes.barMap[record.id].css('fill', record.__color);
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

                var el = this.outline[key] = new ludo.canvas.Node('line', pos);
                el.css(styles);
                this.append(el);
            }.bind(this));
        } else {

            var el = this.outline['around'] = new ludo.canvas.Rect({
                x: 0, y: 0, width: s.x, height: s.y
            });
            el.css(this.outline);
            this.append(el);
        }
    },

    getLine: function (index) {
        if (this.nodes.lines[index] == undefined) {
            var el = new ludo.canvas.Node('line', {x1: 0, y1: 0, x2: 0, y2: 0});
            this.append(el);
            this.nodes.lines.push(el);
        }
        return this.nodes.lines[index];
    },

    createLines: function () {
        if (this.lines == undefined)return;

        var inc = this.ds.getIncrements();

        this.nodes.lines = [];

        for (var i = 0; i < inc.length; i++) {
            var el = this.getLine(i);
            el.css(this.lines);
        }
    },

    onResize: function () {
        this.parent();
        this.resizeElements();
    },

    resizeElements: function () {
        this.resizeOutline();
        this.resizeLines();
        this.resizeBars();

        jQuery.each(this.nodes.outline, function (key, el) {
            el.toFront();
        });

    },

    renderAnimation: function () {

        var d = this.ds.getData();
        var s = this.getSize();
        var min = this.ds.min();
        var max = this.ds.max();

        for (var i = 0; i < d.length; i++) {
            var b = this.getBar(i, d[i]);
            var val = this.ds.valueOf(d[i], this);
            var r = (val - min) / (max - min);
            if (this.orientation == 'horizontal') {
                var height = (s.y * r);
                b.attr('height', 0);
                b.attr('y', s.y);
                b.animate({
                        'height': height
                    }, this.duration, ludo.canvas.easing.inOutSine, undefined,
                    function (node, delta, time, changes) {
                        node.set('y', s.y - changes.height);
                    });
            }else{

                var width = (s.x * r);
                b.attr('width', 0);

                b.animate({
                        'width': width
                    }, this.duration, this.easing, undefined,
                    function (node, delta, time, changes) {

                    });

            }
        }

    },

    resizeBars: function () {
        var d = this.ds.getData();

        var s = this.getSize();
        var min = this.ds.min();
        var max = this.ds.max();

        var availSize = this.orientation == 'horizontal' ? s.x / d.length : s.y / d.length;
        var size = availSize * this.barSize;
        var offset = (availSize - size ) / 2;

        for (var i = 0; i < d.length; i++) {

            var b = this.getBar(i, d[i]);
            var val = this.ds.valueOf(d[i], this);

            var r = (val - min) / (max - min);


            if (this.orientation == 'horizontal') {

                var x = availSize * i / d.length;
                var height = (s.y * r);

                b.attr('width', size);
                b.attr('x', (i * availSize) + offset);
                b.attr('y', s.y - height);
                b.attr('height', height);
            } else {
                b.attr('height', size);
                b.attr('width', s.x * r);
                b.attr('y', (i * availSize) + offset);
            }

        }
    },

    resizeLines: function () {
        if (this.lines == undefined)return;

        var inc = this.ds.getIncrements();
        var s = this.getSize();
        var min = this.ds.min();
        var max = this.ds.max();

        for (var i = 0; i < inc.length; i++) {
            var r = (inc[i] - min) / (max - min);
            var l = this.getLine(i);
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
    }

});