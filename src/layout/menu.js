ludo.layout.Menu = new Class({
    Extends: ludo.layout.Base,

    onCreate:function(){
        this.menuContainer = new ludo.layout.MenuContainer(this);
    },

    getMenuContainer:function(){
        return this.menuContainer;
    },

    getValidChild:function(child){
        if(ludo.util.isString(child))child = { html : child };
        if(!child.layout || !child.layout.type){
            child.layout = child.layout || {};
            child.layout.type = 'Menu'
        }
        if(!child.type)child.type = 'menu.Item';
        child.renderTo = this.menuContainer.getEl();

        return child;
    }
});