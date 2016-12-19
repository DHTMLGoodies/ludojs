/**
 * Superclass for the linear vertical and linear horizontal layout.
 * 
 * Use the orientation attribute to choose between horizontal and vertical.
 * 
 * For dynamic sized child views, use the weight attribute instead of height/width.
 *
 * The reserved words **matchParent** and **wrap** can be used for height when rendered vertically, and
 * width when rendered horizontally. **matchParent** means same size as parent, while **wrap** will use
 * minimum width/height.
 * 
 * @class layout.layout.Linear
 * @example
 * layout:{
 * 		type:'linear',
 * 		orientation:'vertical',
 * 		height:'matchParent', width:'matchParent'	
 * },
 * children:[
 * 	{ html: 'First view', layout: { height: 30 }},
 * 	{ html: 'Second View', layout: { weight: 1 }}
 * ]
 */
ludo.layout.Linear = new Class({
	Extends:ludo.layout.Base,

    onCreate:function(){
        // TODO refactor this.
        this.view.getBody().css('overflow', 'hidden');
        this.view.getBody().css('position', 'relative');
        this.parent();
    },

	onNewChild:function (child) {
		this.parent(child);
		this.updateLayoutObject(child);
		child.addEvent('collapse', this.minimize.bind(this));
		child.addEvent('expand', this.clearTemporaryValues.bind(this));
		child.addEvent('minimize', this.minimize.bind(this));
		child.addEvent('maximize', this.clearTemporaryValues.bind(this));
		child.addEvent('show', this.clearTemporaryValues.bind(this));
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

	beforeResize:function (resize, child) {
		if (resize.orientation === 'horizontal') {
			resize.setMinWidth(child.layout.minWidth || 10);
			resize.setMaxWidth(child.layout.maxWidth || this.view.getBody().width());
		} else {
			resize.setMinHeight(child.layout.minHeight || 10);
			resize.setMaxHeight(child.layout.maxHeight || this.view.getBody().height());
		}
	},

	getResizableFor:function (child, r) {
		var resizeProp = (r === 'left' || r === 'right') ? 'width' : 'height';
		return new ludo.layout.Resizer({
			name:'resizer-' + child.name,
			orientation:(r === 'left' || r === 'right') ? 'horizontal' : 'vertical',
			pos:r,
            hidden:child.isHidden(),
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