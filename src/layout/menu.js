ludo.layout.Menu = new Class({
    Extends: ludo.layout.Base,

    getValidChild:function(child){
        if(ludo.util.isString(child))child = { html : child };
        if(!child.layout || !child.layout.type){
            child.layout = child.layout || {};
            child.layout.type = 'Menu'
        }
        if(!child.type)child.type = 'menu.Item';
        return child;
    }
});