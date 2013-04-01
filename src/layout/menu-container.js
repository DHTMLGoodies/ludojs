ludo.layout.MenuContainer = new Class({
    Extends:Events,
    lm:undefined,

    initialize:function(layoutManager){
        this.lm = layoutManager;
        this.createDom();
    },

    createDom:function(){
        this.el = ludo.dom.create({
            'css' : {
                'position' : 'absolute',
                'display' : 'none'
            },
            renderTo:document.body
        });
    },

    resize:function(config){

    }
});