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
        child.layout = child.layout || {};
        if(child.children && !child.layout.type){
            child.layout.type = 'menu';
            child.layout.orientation = 'vertical';
        }
        if(!child.type)child.type = 'menu.Item';
        return child;
    },

    getParentForNewChild:function(){
        return this.view.layout.orientation === 'horizontal' ? this.parent() : this.getMenuContainer().getEl();
    },

    onNewChild:function(child){
        this.assignMenuItemFns(child);
        if(child.layout && child.layout.type && child.layout.type.toLowerCase() === 'menu'){
            child.addEvent('addChild', this.assignMenuItemFns.bind(this));
        }
    },

    parentContainers:undefined,

    getMenuContainersToShow:function(){
        if(this.parentContainers === undefined){
            var v = this.view;
            this.parentContainers = [];
            while(v && v.getParentMenuItem){
                this.parentContainers.push(v.getMenuContainerToShow());
                v = v.getParent();
            }
        }
        return this.parentContainers;
    },

    assignMenuItemFns:function(child){
        var lm = this;
        var p = lm.view.getParent();

        child.getMenuLayoutManager = function(){
            return this.parentComponent && this.parentComponent.getMenuLayoutManager ? this.parentComponent.getMenuLayoutManager() : lm;
        }.bind(child);

        child.getParentMenuItem = function(){
            return p && p.layout.type && p.layout.type.toLowerCase() === 'menu' ? lm.view : undefined;
        }.bind(child);

        child.isTopMenuItem = function(){
            return p ? p.layout.type.toLowerCase() !== 'menu' : true;
        }.bind(child);

        child.getMenuContainer = function(){
            return lm.getMenuContainer();
        }.bind(child);

        child.getMenuContainerToShow = function(){
            if(this.layout.type && this.layout.type.toLowerCase() === 'menu' && this.children.length > 0){
                this.children[0].show();
                return this.children[0].getMenuContainer();
            }
            return undefined;
        }.bind(child);

        child.getMenuContainersToShow = function(){
            var cnt = lm.getMenuContainersToShow();
            var cmp = this.getMenuContainerToShow();
            if(cmp)cnt.push(cmp);
            return cnt;
        }.bind(child);
    }
});