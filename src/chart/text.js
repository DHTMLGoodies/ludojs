/**
 * Displays SVG text for charts
 * @class ludo.chart.Text
 * @param {Object} config
 * @param {Number} rotate Optional rotation in degrees(clockwise)
 * @param {String} text Optional text. If not set, the datasource should implement the method getText(caller) where caller is the
 * SVG View asking for the text, example, ludo.chart.Text view
 * @param {Object} styling SVG CSS attributes for the text https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text
 * @param {Array} anchor horizontal and vertical anchor of text, example [0.5, 0.5] for center center. First item in the array
 * is horizontal anchor, where 0 is left, 0.5 center and 1 right. The second one is vertical where 0 is top, 0.5 middle and 1 bottom.
 * @type {Type}
 */
ludo.chart.Text = new Class({
    Extends: ludo.chart.Base,
    type: 'chart.Text',
    rotate: undefined,
    text: undefined,
    styling: undefined,
    fragmentType: undefined,
    anchor: undefined,
    n: undefined,

    textSizeRatio:undefined,
    

    __construct: function (config) {
        this.parent(config);
        this.__params(config, ['rotate', 'text', 'styling', 'anchor']);
        if (this.anchor == undefined) {
            this.anchor = [0.5, 0.5];
        }
        if(this.rotate == 'left') this.rotate = -90;
        if(this.rotate == 'right') this.rotate = 90;
        if(this.rotate == 'flip') this.rotate = 180;

        if(this.styling == undefined){
            this.styling = {};
        }

    },

    create: function () {
        this.parent();

        if (this.text == undefined) {
            this.text = this.getDataSource().getText(this);
        }
        
        this.n = new ludo.svg.Text(this.text, {});
        
        this.n.attr('alignment-baseline', 'after-edge');
        
        this.n.css(this.styling);
        if (this.anchor[0] > 0) {
            this.n.textAnchor(this.anchor[0] == .5 ? 'middle' : 'end');
        }
        this.append(this.n);


        this.resizeText();
    },

    onResize:function(){
        this.parent();
        this.resizeText();
    },

    resizeText:function(){
        var bbox = this.n.getBBox();
        var size = this.getSize();

        
        this.n.setRotate(0,0,0);
        var x = 0;
        var y = 0;

        if(this.rotate == -90){
            y = size.y - (this.anchor[0] * size.y);
            x = size.x * this.anchor[1];
            x += (bbox.height / 2);

        }else if(this.rotate == 90){
            y = (this.anchor[0] * size.y);
            x = size.x - (size.x * this.anchor[1]);
            x -= (bbox.height * (1 - this.anchor[1]));

        }else if(this.rotate == 180){
            x = size.x - (size.x * this.anchor[0]);
            y = size.y - (size.y * this.anchor[1] + (bbox.height / 2));

        }else{
            x = size.x * this.anchor[0];
            y = size.y * this.anchor[1] + (bbox.height / 2);
        }



        if(this.rotate){
            this.n.setRotate(this.rotate, x, y);
        }
        this.n.setTranslate(x,y);
    },

    rect:function(){
        var s = this.getSize();
        return this.rotate == 90 || this.rotate == -90 ? { x : s.y, y : s.x } : s;
    },

    center:function(){
        var r = this.rect();
        return {
            x : r.x / 2, y: r.y / 2
        }
    },

    update: function () {
        this.parent();
        this.resizeText();
    }

});