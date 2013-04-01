ludo.layout.MenuHorizontal = new Class({
    Extends: ludo.layout.Menu,

    onNewChild:function(child){
        child.getEl().style.position = 'absolute';
    }
});