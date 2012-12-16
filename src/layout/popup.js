/**
 * Class handling popup layout defined by setting layout.type to "popup". The popup layout model
 * does not render it's children inside the "body" of it's parent. Instead, it's rendered as direct
 * children of document.body(&lt;body>). Layout properties are used to measure size and
 * position. One example of use is a combo box which displays a child view below a button or input box.
 * See {{#crossLink "layout.LayoutSpec"}}{{/crossLink}} for the available position and
 * sizing properties available to children inside a popup layout.
 * @namespace layout
 * @class Popup
 *
 */
ludo.layout.Popup = new Class({
	Extends:ludo.layout.Base,
	visibleChild:undefined,
	addChild:function (child, insertAt, pos) {
		if (!child.layout || !child.layout.visible)child.hidden = true;
		return this.parent(child, insertAt, pos);
	},

	onNewChild:function (child) {
		if (!child.isHidden()) {
			this.setVisibleChild(child);
		}
		child.getEl().style.position = 'absolute';
		child.addEvent('show', this.setVisibleChild.bind(this));
		this.parent(child);
	},

	setVisibleChild:function (child) {
		if (this.visibleChild && this.shouldToggle())this.visibleChild.hide();
		this.visibleChild = child;
		this.fireEvent('showChild', child);
	},

	getParentForNewChild:function () {
		return document.body;
	},

	shouldToggle:function(){
		return this.view.layout.toggle;
	},

	resize:function(){
		var c = this.view.children;
		for(var i=0;i< c.length;i++){
			if(!c[i].isHidden())c[i].getLayoutManager().getRenderer().resize();
		}
	}
});