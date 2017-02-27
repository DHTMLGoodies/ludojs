/**
 * Displays bar labels for a bar chart
 * @class ludo.chart.ChartLabels
 * @param {Object} config
 * @param {Object} config.styling Text styling for the labels.
 * @param {Number} config.padding Optional space right of labels(vertical mode) or above labels(horizontal mode)
 * @param {Boolean} config.halfInset When true, the first label will be offset 1/2 size vertically/or horizontally.
 */
ludo.chart.ChartLabels = new Class({
    Extends: ludo.chart.Base,
    fragmentType: undefined,
    type: 'chart.ChartLabels',

    orientation: undefined,
    styling: undefined,

    textNodes: undefined,

    padding: 0,
    
    halfInset:true,

    __construct: function (config) {
        this.parent(config);
        this.__params(config, ['orientation', 'styling', 'padding','halfInset']);
        if (this.orientation == undefined)this.orientation = 'horizontal';
        this.styling = this.styling || {};
        this.textNodes = [];

    },

    render: function () {
        this.parent();
        var len = this.getDataSource().length();
        for (var i = 0; i < len; i++) {
            this.getTextNode(i);
        }
        this.resizeChartLabels();

    },

    onResize: function () {
        this.resizeChartLabels();
    },

    resizeChartLabels: function () {
        var size = this.getSize();

        var len = this.length();

        var i, el;

        if (this.orientation == 'horizontal') {
            var width = size.x / (this.halfInset ? len : len-1);
            var y = this.getCenter().y;
            for (i = 0; i < len; i++) {
                el = this.getTextNode(i);
                if (el) {
                    el.attr('x', (width * i) + (this.halfInset ? (width / 2) : 0));
                    el.attr('y', y + this.padding);

                }
            }
        } else {
            var height = size.y / (this.halfInset ? len : len-1);;
            for (i = 0; i < len; i++) {
                el = this.getTextNode(i);
                if (el) {
                    el.attr('x', size.x - this.padding);
                    el.attr('y', (i * height) + (this.halfInset ? (height / 2) : 0));

                }
            }
        }
    },


    getTextNode: function (index) {
        var txt = this.getText(index);
        if (!txt){
            if(this.textNodes[index] == undefined){
                this.textNodes.push(undefined);
            }
            return undefined;
        }
        if (this.textNodes[index] == undefined) {
            var el = new ludo.svg.Text("", {});
            this.textNodes.push(el);
            if (this.orientation == 'horizontal') {
                el.textAnchor('middle');
            } else {
                el.textAnchor('end');
                el.attr('alignment-baseline', 'middle');
            }
            el.css(this.styling);
            this.append(el);
        }

        this.textNodes[index].text(txt);
        return this.textNodes[index];

    },

    getText: function (index) {
        if (this.data != undefined)return this.data[index];
        var rec = this.ds.getData(this)[index];
        return this.ds.textOf(rec, this)
    },

    length: function () {
        if (this.data != undefined)return this.data.length;
        return this.getDataSource().getData(this).length;
    }
});