ludo.chart.Gauge = new Class({
    Extends: ludo.chart.Base,
    fragmentType:'chart.Needle',

    startOffset:0,
    endOffset:0,

    circle:undefined,

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ['startOffset','endOffset']);
    },

    render:function(){

        this.circle = new ludo.canvas.Circle(this.getCircleAttributes());
        this.circle.setStyles({
            'stroke' : '#000',
            'fill' : '#f2f2f2',
            'stroke-width' : 2,
            'stroke-location' : 'inside'
        });
        this.adopt(this.circle);
        this.circle.toBack();
    },

    onResize:function(){
        this.circle.setProperties(this.getCircleAttributes());
        this.fragments[0].resize();
    },

    getCircleAttributes:function(){
        var center = this.getCenter();
       return {
           cx : center.x,
           cy : center.y,
           r:(this.getSquareSize() / 2) - 5
       };
    }
});