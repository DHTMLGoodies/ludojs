ludo.chart.Line = new Class({
    Extends: ludo.chart.Bar,
    fragmentType: 'chart.LineItem',
    type:'chart.Line',

    lineStyles:undefined,
    
    __construct:function(config){
        this.parent(config);
        this.setConfigParams(config, ["lineStyles"]);
    },

    resizeElements:function(){
        this.resizeOutline();
        this.resizeBgLines();
        this.resizeLines();
        jQuery.each(this.nodes.outline, function (key, el) {
            el.toFront();
        });

    },

    createFragments:function(){
        this.parent();

        if(this.lineStyles != undefined){
            var s = this.lineStyles;
            jQuery.each(this.fragments, function(key, fragment){
                fragment.getNode().css(s);
            });
        }

    },

    resizeLines:function(){
        var size = this.getSize();

        jQuery.each(this.fragments, function(key, fragment){
            fragment.resize(size.x, size.y);
        });
        
        
    }

});