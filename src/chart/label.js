ludo.chart.Label = new Class({
    Extends:ludo.chart.Fragment,

    textStyles:undefined,
    boxStyles:undefined,

    textStylesOver:undefined,
    boxStylesOver:undefined,

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['textStyles', 'boxStyles', 'textStylesOver','boxStylesOver']);

    },

    createNodes:function () {
        var g = this.createNode('g');

        this.bg = new ludo.canvas.Rect({
            x:0, y:0, width:10, height:10
        });
        this.bg.setStyle('fill', '#fff');
        this.bg.setStyle('fill-opacity', '0');
        g.adopt(this.bg);

        this.colorBox = new ludo.canvas.Rect({
            x:1, y:1, width:10, height:10
        });
        g.adopt(this.colorBox);
        this.colorBox.setStyles(this.getBoxStyles());

        this.textNode = new ludo.canvas.Text(this.record.getLabel(), {
            x:15, y:10
        });
        this.textNode.setStyles(this.getTextStyles());
        g.adopt(this.textNode);
        this.setSize();

        this.bg.set('width', this.size.x);
        this.bg.set('height', this.size.x);
    },

    setSize:function () {
        this.size = this.nodes[0].getSize();
    },

    getSize:function () {
        return this.size;
    },

    node:function () {
        return this.nodes[0];
    },

    getBoxStyles:function () {
        var ret = this.boxStyles || {};
        ret.fill = this.record.get('color');
        ret.stroke = this.record.get('color');
        if(!ret['stroke-width'])ret['stroke-width'] = 1;
        ret['stroke-location'] = 'outside';
        return ret;
    },

    getTextStyles:function () {
        return this.boxStyles || {
            'font-size':'12px',
            'font-weight' : 'normal'
        };
    },

    getTextStylesOver:function () {
        return this.textStylesOver || { 'font-weight':'bold' };
    },

    getBoxStylesOver:function(){
        return this.boxStylesOver || { 'stroke-width' : 1, 'stroke' : '#000' };
    },

    enter:function () {
        this.textNode.setStyles(this.getTextStylesOver());
        this.colorBox.setStyles(this.getBoxStylesOver());

    },

    leave:function () {
        this.textNode.setStyles(this.getTextStyles());
        this.colorBox.setStyles(this.getBoxStyles());
    }
});