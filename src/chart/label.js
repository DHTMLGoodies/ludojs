ludo.chart.Label = new Class({
    Extends:ludo.chart.Fragment,



    createNodes:function () {
        var g = this.createNode('g');

        this.bg = new ludo.canvas.Rect({
            x:0, y:0, width:10, height:10
        });
        this.bg.setStyle('fill', '#fff');
        this.bg.setStyle('fill-opacity', '0');
        g.adopt(this.bg);

        var colorBoxCoords = this.getCoordinatesForColorBox();
        this.colorBox = new ludo.canvas.Rect(colorBoxCoords);
        g.adopt(this.colorBox);


        this.colorBox.setStyles(this.getBoxStyles());


        this.textNode = new ludo.canvas.Text(this.record.getLabel(), {
            x:colorBoxCoords.x + colorBoxCoords.width + 3, y : this.getYForText()
        });
        this.textNode.setStyles(this.getTextStyles());
        g.adopt(this.textNode);
        this.setSize();

        this.bg.set('width', this.size.x);
        this.bg.set('height', this.size.x);
    },

    getFontSize:function(){
        var t = this.getTextStyles();
        return t['font-size'] ? parseInt(t['font-size']) : 13;
    },

    getYForText:function(){
        return Math.floor(this.getFontSize() * .9);
    },

    getCoordinatesForColorBox:function(){
        var fontSize = this.getFontSize();
        var size = Math.round(fontSize);
        return {
            x : 0,
            y : fontSize - size,
            width : size,
            height: size
        };
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
        var ret = this.getParent().boxStyles || {};
        ret.fill = this.record.get('color');
        return ret;
    },

    getTextStyles:function () {
        return this.getParent().textStyles || {
            'font-size':'13px',
            'font-weight' : 'normal'
        };
    },

    getTextStylesOver:function () {
        return this.getParent().textStylesOver || { 'font-weight':'bold' };
    },

    getBoxStylesOver:function(){
        var ret = this.getParent().boxStylesOver || {  };
        if(!ret['fill'])ret['fill'] = this.record.get('color-over');
        return ret;
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