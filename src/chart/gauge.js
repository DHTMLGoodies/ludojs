ludo.chart.Gauge = new Class({
    Extends:ludo.chart.Base,
    fragmentType:'chart.Needle',

    startOffset:0,
    endOffset:0,

    circle:undefined,

    min:0,
    max:100,

    __construct:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['startOffset', 'endOffset','min','max']);
    },

    render:function () {
        this.circle = new ludo.svg.Circle(this.getCircleAttributes());
        this.circle.css({
            'stroke':'#000',
            'fill':'#f2f2f2',
            'stroke-width':2,
            'stroke-location':'inside'
        });
        this.append(this.circle);
        this.circle.toBack();
    },

    onResize:function () {
        this.circle.setProperties(this.getCircleAttributes());
        this.fragments[0].resize();
    },

    getCircleAttributes:function () {
        var center = this.getCenter();
        return {
            cx:center.x,
            cy:center.y,
            r:(this.getSquareSize() / 2) - 5
        };
    },

    getTotalAngle:function(){
        return 360 - this.startOffset - this.endOffset;
    },

    getMin:function(){
        return this.min;
    },

    getMax:function(){
        return this.max;
    }
});