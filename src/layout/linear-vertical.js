/**
 * This class arranges child views in a column layout (side by side).
 * @namespace ludo.layout
 * @class ludo.layout.LinearVertical
 *
 */
ludo.layout.LinearVertical = new Class({
	Extends:ludo.layout.Linear,
	onCreate:function(){
		this.parent();
	},
	resize:function () {


		var availHeight = this.viewport.height;



		var totalHeightOfItems = 0;
		var totalWeight = 0;
		var height;
		var tm = this.viewport.top;
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
		var stretchHeight = remainingHeight = (availHeight - totalHeightOfItems);

		var width = this.view.getBody().width();
		for (i = 0; i < this.view.children.length; i++) {
			if(!this.view.children[i].isHidden()){

				var w = this.view.children[i].layout.width;
				var cW = w && !isNaN(w) ? w : width;

				var config = {
					width:cW
				};
				
				if (this.hasLayoutWeight(this.view.children[i])) {
					if (this.view.children[i].id == this.idLastDynamic) {
						config.height = remainingHeight;
					} else {
						config.height = Math.round(stretchHeight * this.view.children[i].layout.weight / totalWeight);
						remainingHeight -= config.height;
					}
				} else {
					config.height = this.getHeightOf(this.view.children[i], config);
				}

				if (config.height < 0) {
					config.height = undefined;
				}
				if(tm > 0){
					config.top = tm;
				}

				this.resizeChild(this.view.children[i], config);
				tm += this.view.children[i].getEl().outerHeight(true);
			}
		}
	},
	resizeChild:function (child, resize) {
		child.layout.height = resize.height;

		child.resize(resize);
		child.saveState();
	},

	getWrappedHeight:function(){
		var h = this.parent();
		for(var i=0;i<this.view.children.length;i++){
			h += this.view.children[0].getEl().outerHeight(true);
		}
		return h;
	},


	onNewChild:function (child) {
		this.parent(child);
		if (this.isResizable(child)) {
			var isLastSibling = this.isLastSibling(child);

			var resizer = this.getResizableFor(child, isLastSibling ? 'above' : 'below');
			this.addChild(resizer, child, isLastSibling ? 'before' : 'after');
		}

		child.getEl().css('position', 'absolute');
	}
});