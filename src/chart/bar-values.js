ludo.chart.BarValues = new Class({
    Extends: ludo.chart.Base,
    type: 'chart.BarValues ',
    fragmentType: undefined,

    orientation: undefined,
    styling: undefined,
    nodes: undefined,

    min: undefined,
    max: undefined,
    count: undefined,
    size: undefined,

    increment: 10,
    padding: 0,

    __construct: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['orientation', 'styling', 'padding']);
        if (this.orientation == undefined)this.orientation = 'horizontal';
        this.styling = this.styling || {};
        this.nodes = [];
    },

    render: function () {
        this.parent();
        this.resizeNodes();
    },

    onResize: function () {
        this.parent();
        this.resizeNodes();
    },


    resizeNodes: function () {
        var ds = this.ds;

        this.min = ds.min();
        this.max = ds.max();
        this.count = this.getCount();
        this.size = this.getSize();

        for (var i = 0; i < this.count; i++) {
            var el = this.getNode(i);
            var val = this.val(i);
            el.text(val);
            var pos = this.getPos(val);
            el.attr('x', pos.x);
            el.attr('y', pos.y);

            if(i==this.count-1){
                el.textAnchor('end');
            }
        }
    },

    val: function (index) {
        return this.ds.getIncrements()[index];
    },

    getCount: function () {
        return this.ds.getIncrements().length;
    },

    getPos: function (val) {
        var ret = {x: 0, y: 0};
        var ratio = (val - this.min) / (this.max - this.min);
        if (this.orientation == 'horizontal') {
            ret.x = (this.size.x * ratio);
            ret.y = this.size.y / 2 + this.padding;
        } else {
            ret.x = this.size.x - this.padding;
            ret.y = this.size.y - (this.size.y * ratio);
        }

        return ret;
    },

    getNode: function (index) {
        if (this.nodes[index] == undefined) {
            var el = new ludo.canvas.Text("", {});
            this.nodes.push(el);
            if (this.orientation == 'horizontal') {
                el.textAnchor('middle');
            } else {
                el.textAnchor('end');
                el.attr('alignment-baseline', 'middle');
            }
            el.css(this.styling);
            this.append(el);
        }
        return this.nodes[index];

    }

});