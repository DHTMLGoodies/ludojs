/**
 * Abstract base class for linear layouts
 * @namespace layout
 * @class Linear
 */
ludo.layout.Linear = new Class({
	Extends:ludo.layout.Base,

	onNewChild:function (child) {
		this.parent(child);
		this.updateLayoutObject(child);
		child.addEvent('collapse', this.resize.bind(this));
		child.addEvent('expand', this.resize.bind(this));
		child.addEvent('minimize', this.resize.bind(this));
		child.addEvent('maximize', this.resize.bind(this));
	},

	updateLayoutObject:function (child) {
		child.layout = child.layout || {};
		child.layout.width = child.layout.width || child.width;
		child.layout.height = child.layout.height || child.height;
		child.layout.weight = child.layout.weight || child.weight;
		child.layout.resizable = child.layout.resizable || child.resizable;
		child.layout.minWidth = child.layout.minWidth || child.minWidth;
		child.layout.maxWidth = child.layout.maxWidth || child.maxWidth;
		child.layout.minHeight = child.layout.minHeight || child.minHeight;
		child.layout.maxHeight = child.layout.maxHeight || child.maxHeight;
	},

	isResizable:function (child) {
		return child.layout.resizable ? true : false;
	},

	getWidthOf:function (child) {
		return child.layout.width;
	},

	getHeightOf:function (child) {
		return child.layout.height;
	},

	beforeResize:function (resize, child) {
		if (resize.orientation === 'horizontal') {
			resize.setMinWidth(child.layout.minWidth || 10);
			resize.setMaxWidth(child.layout.maxWidth || this.view.getBody().offsetWidth);
		} else {
			resize.setMinHeight(child.layout.minHeight || 10);
			resize.setMaxHeight(child.layout.maxHeight || this.view.getBody().offsetHeight);
		}
	},

	getResizableFor:function (child, r) {
		var resizeProp = (r === 'left' || r === 'right') ? 'width' : 'height';
		return new ludo.layout.Resizer({
			name:'resizer-' + child.name,
			orientation:(r === 'left' || r === 'right') ? 'horizontal' : 'vertical',
			pos:r,
			renderTo:this.view.getBody(),
			layout:{ width:5,height:5 },
			view:child,
			listeners:{
				'resize':function (change) {
					child.layout[resizeProp] += change;
					this.resize();
				}.bind(this),
				'before':this.beforeResize.bind(this)
			}
		});
	}

});