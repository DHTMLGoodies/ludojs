/**
 * This class arranges child views in a column layout (side by side).
 * @namespace layout
 * @class LinearVertical
 *
 */
ludo.layout.LinearVertical = new Class({
	Extends:ludo.layout.Linear,
	onCreate:function(){
		this.parent();
	},
	resize:function () {

		var componentHeight = this.view.getInnerHeightOfBody();
		if (componentHeight == 0) {
			return;
		}
		var totalHeightOfItems = 0;
		var totalWeight = 0;
		var height;
		var tm = 0;
		for (var i = 0; i < this.view.children.length; i++) {
			if (!this.hasLayoutWeight(this.view.children[i])) {
                height = this.view.children[i].isHidden() ? 0 :  this.getHeightOf(this.view.children[i]);
                totalHeightOfItems += height
			} else {
				if (!this.view.children[i].isHidden()) {
					totalWeight += this.view.children[i].layout.weight;
				}
			}
		}

		totalWeight = Math.max(1, totalWeight);

        var remainingHeight;
		var stretchHeight = remainingHeight = (componentHeight - totalHeightOfItems);

		var width = ludo.dom.getInnerWidthOf(this.view.getBody());
		// var currentTop = 0;
		for (i = 0; i < this.view.children.length; i++) {
			if(!this.view.children[i].isHidden()){
				var config = { width:width };
				if (this.hasLayoutWeight(this.view.children[i])) {
					if (this.view.children[i].id == this.idLastDynamic) {
						config.height = remainingHeight;
					} else {
						config.height = Math.round(stretchHeight * this.view.children[i].layout.weight / totalWeight);
						remainingHeight -= config.height;
					}
				} else {
					config.height = this.getHeightOf(this.view.children[i]);
				}
				if (config.height < 0) {
					config.height = undefined;
				}
				if(tm > 0){
					config.top = tm;
				}
				if(this.view.children[i].getEl().style.position === 'absolute'){
					tm += this.view.children[i].getHeight();
				}

				this.resizeChild(this.view.children[i], config);
			}
		}
	},
	resizeChild:function (child, resize) {
		child.layout.height = resize.height;
		child.resize(resize);
		child.saveState();
	},

	onNewChild:function (child) {
		this.parent(child);
		if (this.isResizable(child)) {
			var isLastSibling = this.isLastSibling(child);
			var resizer = this.getResizableFor(child, isLastSibling ? 'above' : 'below');
			this.addChild(resizer, child, isLastSibling ? 'before' : 'after');
		}
	}
});