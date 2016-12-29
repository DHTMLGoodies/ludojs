ludo.chart.ChartValues = new Class({
    Extends: ludo.chart.Base,
    type: 'chart.ChartValues',
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

    values:undefined,

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

        if(this.ds.minX != undefined){
            if(this.orientation == 'horizontal'){
                this.min = ds.minX();
                this.max = ds.maxX();
            }else{
                this.min = ds.minY();
                this.max = ds.maxY();
            }

        }else{
            this.min = ds.min();
            this.max = ds.max();
        }



        this.size = this.getSize();
        var availSize = this.orientation == 'horizontal' ? this.size.x : this.size.y;
        this.values = ludo.chart.LineUtil.values(this.min, this.max, availSize, this);

        this.count = this.values.length;


        jQuery.each(this.nodes, function(index, node){
            node.hide();
        });

        for (var i = 0; i < this.count; i++) {
            var el = this.getNode(i);
            el.show();
            var val = this.val(i);

            el.text(this.ds.valueForDisplay(val, this));
            var pos = this.getPos(val);

            el.attr('x', pos.x);
            el.attr('y', pos.y);

            if(i==this.count-1){
                el.textAnchor('end');
            }
        }
    },

    val: function (index) {
        return this.values[index];
    },

    getCount: function () {

        return this.values.length;
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
            var el = new ludo.svg.Text("", {});
            this.nodes.push(el);
            if (this.orientation == 'horizontal') {
                el.textAnchor(index == 0 ? 'start' : index == this.getCount() ? 'end' : 'middle');
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