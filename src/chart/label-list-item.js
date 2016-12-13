ludo.chart.LabelListItem = new Class({
    Extends:ludo.chart.Fragment,
    type:'chart.LabelListItem',


    createNodes:function () {
        var g = this.createNode('g');

        this.bg = new ludo.canvas.Rect({
            x:0, y:0, width:10, height:10
        });
        this.bg.css('fill', '#fff');
        this.bg.css('fill-opacity', '0');
        g.append(this.bg);

        var colorBoxCoords = this.getCoordinatesForColorBox();
        this.colorBox = new ludo.canvas.Rect(colorBoxCoords);
        g.append(this.colorBox);


        this.colorBox.css(this.getBoxStyles());


        this.textNode = new ludo.canvas.Text(this.getDataSource().textOf(this.record, this), {
            x:colorBoxCoords.x + colorBoxCoords.width + 3, y : this.getYForText()
        });
        this.textNode.css(this.getTextStyles());
        g.append(this.textNode);
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
        ret.fill = this.record.__color;
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
        if(!ret['fill'])ret['fill'] = this.record.__colorOver;
        return ret;
    },

    enter:function () {
        this.textNode.css(this.getTextStylesOver());
        this.colorBox.css(this.getBoxStylesOver());
    },

    leave:function () {
        this.textNode.css(this.getTextStyles());
        this.colorBox.css(this.getBoxStyles());
    }
});