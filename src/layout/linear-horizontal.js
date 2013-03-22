/**
 * This class arranges child views in a row layout.
 * @namespace layout
 * @class LinearVertical
 *
 */
ludo.layout.LinearHorizontal = new Class({
	Extends:ludo.layout.Linear,

	resize:function () {
		var totalWidth = this.view.getInnerWidthOfBody();
		var height = this.hasDynamicHeight() ? 'auto' : this.view.getInnerHeightOfBody();
		if (height == 0) {
			return;
		}

		var totalWidthOfItems = 0;
		var totalWeight = 0;
		for (var i = 0; i < this.view.children.length; i++) {
			if (this.view.children[i].isVisible()) {
				if (!this.hasLayoutWeight(this.view.children[i])) {
					var width = this.getWidthOf(this.view.children[i]);
					if (width) {
						totalWidthOfItems += width
					}
				} else {
					totalWeight += this.view.children[i].layout.weight;
				}
			}
		}
		totalWeight = Math.max(1, totalWeight);
		var remainingWidth;
		totalWidth = remainingWidth = totalWidth - totalWidthOfItems;

		var currentLeft = 0;
		for (i = 0; i < this.view.children.length; i++) {
			if (this.view.children[i].isVisible()) {
				var config = { 'height':height, 'left':currentLeft };
				if (this.hasLayoutWeight(this.view.children[i])) {
					if (this.view.children[i].id == this.idLastDynamic) {
						config.width = remainingWidth;
					} else {
						config.width = Math.round(totalWidth * this.view.children[i].layout.weight / totalWeight);
						remainingWidth -= config.width;
					}
				} else {
					config.width = this.getWidthOf(this.view.children[i]);
				}
				this.resizeChild(this.view.children[i], config);
				currentLeft += config.width;
			}
		}

		for (i = 0; i < this.resizables.length; i++) {
			this.resizables[i].colResize();
		}
	},

	resizeChild:function (child, resize) {
		child.layout.width = resize.width;
		child.layout.left = resize.left;
		child.resize(resize);
		child.saveState();
	},

	onNewChild:function (child) {
		this.parent(child);
		child.getEl().style.position = 'absolute';

		if (this.isResizable(child)) {
			var isLastSibling = this.isLastSibling(child);
			var resizer = this.getResizableFor(child, isLastSibling ? 'left' : 'right');
			this.addChild(resizer, child, isLastSibling ? 'before' : 'after');
		}
	},

	hasDynamicHeight:function () {
		return this.view.layout.height && this.view.layout.height == 'dynamic';
	}
});