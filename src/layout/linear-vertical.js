/**
 * This class arranges child views in a column layout (side by side).
 * @namespace ludo.layout
 * @class ludo.layout.LinearVertical
 * @param {Object} config
 * @param {Boolean} config.resizable - child property
 * @param {String} config.resizePos - child property - Optional position of resize handle - "above" to resize this and previous child,
 * or "below" to resize this and next sibling
 * @param {Number|String} config.height - child property - Numeric height or "wrap"
 * @param {Boolean} config.weight - Dynamic height
 *
 */
ludo.layout.LinearVertical = new Class({
	Extends:ludo.layout.Linear,
	onCreate:function(){
		this.parent();
	},
	resize:function () {
		var availHeight = this.viewport.height;
		var s = {
			width:this.viewport.width,
			height: availHeight
		};

		var totalHeightOfItems = 0;
		var totalWeight = 0;
		var height;
		var tm = this.viewport.top;
		for (var i = 0; i < this.view.children.length; i++) {
			if (!this.hasLayoutWeight(this.view.children[i])) {
                height = this.view.children[i].isHidden() ? 0 :  this.getHeightOf(this.view.children[i], s);
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
			var c = this.view.children[i];
			if(!c.isHidden()){

				var w = c.layout.width;
				var cW = w && !isNaN(w) ? w : width;

				var config = {
					width:c.type == 'layout.Resizer' ? width: cW
				};

				if(w && c.layout.align){
					switch(c.layout.align){
						case 'right':
							config.left = this.viewport.width - c.layout.width;
							break;
						case 'center':
							config.left = (this.viewport.width / 2) - (c.layout.width / 2);
							break;
					}
				}

				if (this.hasLayoutWeight(c)) {
					if (c.id == this.idLastDynamic) {
						config.height = remainingHeight;
					} else {
						config.height = Math.round(stretchHeight * c.layout.weight / totalWeight);
						remainingHeight -= config.height;
					}
				} else {
					config.height = this.getHeightOf(c, config);
				}

				if (config.height < 0) {
					config.height = undefined;
				}
				if(tm > 0){
					config.top = tm;
				}

				this.resizeChild(c, config);
				tm += c.getEl().outerHeight(true);
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

			var rPos;
			if(child.layout && child.layout.resizePos){
				rPos = child.layout.resizePos;
			}else{
				rPos = isLastSibling ? 'above' : 'below';
			}
			var resizer = this.getResizableFor(child, rPos);
			this.addChild(resizer, child, rPos == 'above' ? 'before' : 'after');
		}

		child.getEl().css('position', 'absolute');
	}
});