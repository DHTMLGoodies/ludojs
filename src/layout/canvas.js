/**
 * Layout manager for items in a chart
 * @namespace chart
 * @class ludo.layout.Canvas
 * @augments layout.Relative
 */
ludo.layout.Canvas = new Class({
	Extends:ludo.layout.Relative,

	addChild:function (child) {
		child = this.getValidChild(child);
		child = this.getNewComponent(child);

		this.view.children.push(child);
		var el = child;
		this.view.getCanvas().append(el);

		this.onNewChild(child);
		this.addChildEvents(child);

		this.fireEvent('addChild', [child, this]);



		return child;
	},

	/**
	 * Add events to child view
	 * @function addChildEvents
	 * @param {ludo.View} child
	 * @private
	 */
	addChildEvents:function (child) {
		child.addEvent('hide', this.hideChild.bind(this));
		child.addEvent('show', this.clearTemporaryValues.bind(this));

	},

	/**
	 * Position child at this coordinates
	 * @function positionChild
	 * @param {canvas.View} child
	 * @param {String} property
	 * @param {Number} value
	 * @private
	 */
	positionChild:function (child, property, value) {

		child[property] = value;
		this.currentTranslate[property] = value;
		child['node'].setTranslate(this.currentTranslate.left, this.currentTranslate.top);
	},

	currentTranslate:{
		left:0,top:0
	},

	zIndexAdjusted:false,
	_rendered:false,

	resize:function(){
		this.parent();

		if(!this.zIndexAdjusted){
			this.zIndexAdjusted = true;

			for (var i = 0; i < this.children.length; i++) {
				if(this.children[i].layout.zIndex != undefined){
					this.view.getCanvas().append(this.children[i]);
				}
			}
		}

		if(!this._rendered){
			this._rendered = true;

			jQuery.each(this.children, function(i, child){
				child.rendered();
			});
		}

	}



});