ludo.layout.Menu = new Class({
    Extends: ludo.layout.Base,

    onNewChild:function(child){
        if(!child.layout || !child.layout.type){
            child.layout = child.layout || {};
            child.layout.type = 'Menu'
        }
    }
});