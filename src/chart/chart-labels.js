/**
 * Displays bar labels for a bar chart
 * @class ludo.chart.ChartLabels
 * @param {Object} config
 * @param {Object} config.styling Text styling for the labels.
 */
ludo.chart.ChartLabels = new Class({
    Extends: ludo.chart.Base,
    fragmentType: undefined,
    type: 'chart.ChartLabels',

    orientation: undefined,
    styling: undefined,

    textNodes: undefined,

    padding: 0,

    __construct: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['orientation', 'styling', 'padding']);
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
            var width = size.x / len;
            var y = this.getCenter().y;
            for (i = 0; i < len; i++) {
                el = this.getTextNode(i);
                if (el) {
                    el.attr('x', (width * i) + (width / 2));
                    el.attr('y', y);

                }
            }
        } else {
            var height = size.y / len;
            for (i = 0; i < len; i++) {
                el = this.getTextNode(i);
                if (el) {
                    el.attr('x', size.x - this.padding);
                    el.attr('y', (i * height) + (height / 2));

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
            var el = new ludo.canvas.Text("", {});
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