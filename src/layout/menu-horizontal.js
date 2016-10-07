ludo.layout.MenuHorizontal = new Class({
    Extends:ludo.layout.Menu,

    getValidChild:function (child) {
        child = this.parent(child);
        child.layout.width = child.layout.width || 'wrap';
        return child;
    },

    onNewChild:function (child) {
        child.getEl().css('position', 'absolute');
        this.parent(child);
    },

    resized:false,
    resize:function () {
        if (!this.resized) {
            this.resized = true;
            var left = 0;
            for (var i = 0; i < this.view.children.length; i++) {
                this.view.children[i].resize({ left:left,height:this.viewport.height });
                left += this.view.children[i].getEl().width() + ludo.dom.getMW(this.view.children[i].getEl());
            }
        }
    }
});