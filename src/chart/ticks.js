ludo.chart.Ticks = new Class({
    Extends: ludo.chart.Base,
    type: 'chart.Ticks',
    fragmentType: undefined,
    axis: undefined,
    animate: false,
    vAlign: undefined,

    ticks: undefined,
    styles: undefined,

    __construct: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['axis', 'vAlign', 'styles']);
        this.vAlign = this.vAlign || (this.axis == 'x' ? 'top' : 'right');
        this.ticks = [];
        this.styling = this.styling || {};
        this.styling["stroke-width"] = this.styling["stroke-width"] || 1;
    },

    render: function () {
        this.parent();
        this.positionTicks();
    },

    onResize: function () {
        this.parent();
        this.positionTicks();
    },
    positionTicks: function () {

        if (!this.width || !this.height)return;


        var min = this.axis == 'x' ? this.ds.minX() : this.ds.minY();
        var max = this.axis == 'x' ? this.ds.maxX() : this.ds.maxY();

        var size = this.getSize();

        var availSize = this.axis == 'x' ? size.x : size.y;

        jQuery.each(this.ticks, function (i, tick) {
            tick.hide();
        });
        var index = 0;

        var line = this.getTick(index++);
        var offset = line.css('stroke-width') / 2;
        if (this.axis == 'x') {
            var y = this.vAlign == 'top' ? offset : this.height - offset;
            line.setProperties({
                x1: 0, x2: this.width, y1: y, y2: y
            });
            line.show();
        } else {
            var x = this.vAlign == 'left' ? offset : this.width - offset;
            line.setProperties({
                x1: x, x2: x, y1: 0, y2: availSize
            });
            line.show();
        }

        var values = ludo.chart.LineUtil.values(min, max, availSize);

        jQuery.each(values, function (i, v) {

            var tick = this.getTick(index++);
            tick.show();
            var pos = (v - min) / (max - min) * availSize;

            if (this.axis == 'x') {

                tick.set('x1', pos);
                tick.set('x2', pos);
                tick.set('y1', 0);
                tick.set('y2', this.height);
            } else {
                tick.set('y1', this.height - pos);
                tick.set('y2', this.height - pos);
                tick.set('x1', 0);
                tick.set('x2', this.width);
            }
        }.bind(this));

        values = ludo.chart.LineUtil.values(min, max, availSize, this, ludo.chart.LineUtil.minTickSize / 5);


        jQuery.each(values, function (i, v) {

            var tick = this.getTick(index++);
            tick.show();
            var pos = (v - min) / (max - min) * availSize;
            if (this.axis == 'x') {

                tick.set('x1', pos);
                tick.set('x2', pos);
                tick.set('y1', this.vAlign == 'top' ? 0 : this.height);
                tick.set('y2', this.height / 2);
            } else {
                tick.set('y1', this.height - pos);
                tick.set('y2', this.height - pos);
                tick.set('x1', this.vAlign == 'left' ? 0 : this.width);
                tick.set('x2', this.width / 2);
            }
        }.bind(this));
    },

    getTick: function (index) {

        if (this.ticks[index] == undefined) {
            this.ticks[index] = new ludo.svg.Node('line');

            this.ticks[index].css(this.styles);
            this.getChartNode().append(this.ticks[index]);
        }

        return this.ticks[index];


    }

});