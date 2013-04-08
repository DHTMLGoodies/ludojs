ludo.layout.MenuVertical = new Class({
    Extends: ludo.layout.Menu,
	active:true,

	getValidChild:function(child){
		child = this.parent(child);
		if (!child.layout.width) {
			child.layout.width = 'fitParent';
		}
		return child;
	},

    resize:function () {
        for (var i = 0; i < this.view.children.length; i++) {
            this.view.children[i].getLayoutManager().getRenderer().resize();
        }
    }
});