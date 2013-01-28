/**
 Class for relative positioning of child views. This is the most powerful layout
 in ludoJS.
 An instance of this class is created dynamically when
 layout.type for a View is set to "relative".
 This layout uses ideas from Android's relative layout.
 When using a relative layout, all layout properties should be defined inside a layout config object.
 That also includes width and height.
 @namespace layout
 @class Relative
 @constructor

 */
ludo.layout.Relative = new Class({
	Extends:ludo.layout.Base,
	children:undefined,
    /**
     * Array of valid layout properties
     * @property {Array} layoutFnProperties
     * @private
     */
	layoutFnProperties:[
		'width', 'height',
		'alignParentTop', 'alignParentBottom', 'alignParentLeft', 'alignParentRight',
		'leftOf', 'rightOf', 'below', 'above',
		'alignLeft', 'alignRight', 'alignTop', 'alignBottom',
		'sameWidthAs', 'sameHeightAs',
		'centerInParent', 'centerHorizontal', 'centerVertical',
		'fillLeft', 'fillRight', 'fillUp', 'fillDown',
		'absBottom','absWidth','absHeight','absLeft','absTop','absRight'
	],
    /**
     * Internal child coordinates set during resize
     * @property {Object} newChildCoordinates
     * @private
     */
	newChildCoordinates:{},
    /**
     * Internal storage of child coordinates for last resize
     * @property {Object} lastChildCoordinates
     * @private
     */
	lastChildCoordinates:{},

	onCreate:function () {
		this.parent();
		this.view.getBody().style.position = 'relative';
	},

	resize:function () {
		if (this.children === undefined) {
			this.prepareResize();
		}
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].layoutResizeFn.call(this.children[i], this);
		}
	},

    /**
     * No resize done yet, create resize functions
     * @method prepareResize
     * @private
     */
	prepareResize:function(){
		this.fixLayoutReferences();
		this.arrangeChildren();
		this.createResizeFunctions();
	},

    /**
     * Create/Compile resize functions for each child
     * @method createResizeFunctions
     * @private
     */
	createResizeFunctions:function () {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].layoutResizeFn = this.getResizeFnFor(this.children[i]);
		}
	},
    /**
     * Convert layout id references to direct view reference for optimal performance
     * @method fixLayoutReferences
     * @private
     */
	fixLayoutReferences:function () {
		for (var i = 0; i < this.view.children.length; i++) {
			var c = this.view.children[i];
			var k = this.depKeys;
			for (var j = 0; j < k.length; j++) {
				if (c.layout[k[j]] !== undefined)c.layout[k[j]] = this.getReference(c.layout[k[j]]);
			}
		}
	},
    /**
     * Return resize function for a child
     * @method getResizeFnFor
     * @param {ludo.View} child
     * @return {Function}
     * @private
     */
	getResizeFnFor:function (child) {
		var fns = this.getLayoutFnsFor(child);
		return function (layoutManager) {
			for (var i = 0; i < fns.length; i++) {
				fns[i].call(child, layoutManager);
			}
		};
	},
    /**
     * Return array of resize function to call when view is resized.
     * @method getLayoutFnsFor
     * @param {ludo.View} child
     * @return {Array}
     * @private
     */
	getLayoutFnsFor:function (child) {
		var ret = [];
		var p = this.layoutFnProperties;
		for (var i = 0; i < p.length; i++) {
			if (child.layout[p[i]] !== undefined && child.layout[p[i]] !== false) {
				var fn = this.getLayoutFn(p[i], child);
				if (fn)ret.push(fn);
			}
		}
		ret.push(this.getLastLayoutFn(child));
		return ret;
	},
    /**
     Return one resize function for a child
     @method getLayoutFn
     @param {String} property
     @param {ludo.View} child
     @return {Function|undefined}
     @private
     @example
        getLayoutFn(left, view)
     may return
        function(){
            this.newChildCoordinates[view.id]['left'] = 20;
        }
     The resize functions are created before first resize is made. For second resize,
     the layout functions for each view will simply be called. This is done for optimal performance
     so that we don't need to calculate more than we have to(Only first time).
     */
	getLayoutFn:function (property, child) {
		var c = this.newChildCoordinates[child.id];
		var refC;
		switch (property) {
			case 'top':
			case 'left':
				return function () {
					c[property] = child.layout[property];
				}.bind(child);
			case 'width':
			case 'height':
				return this.getPropertyFn(child, property);
			case 'absLeft':
				return function () {
					c.left = 0;
				};
			case 'absRight':
				return function () {
					c.right = 0;
				};
			case 'absBottom':
				return function () {
					c.bottom = 0;
				};
			case 'absWidth':
				return function(lm){
					c.width = lm.viewport.absWidth;
				};
			case 'absHeight':
				return function(lm){
					c.height = lm.viewport.absHeight;
				};
			case 'alignParentLeft':
				return function (lm) {
					c.left = lm.viewport.left;
				};
			case 'alignParentRight':
				return function (lm) {
					c.right = lm.viewport.right;
				};
			case 'alignParentTop':
				return function (lm) {
					c.top = lm.viewport.top;
				};
			case 'alignParentBottom':
				return function (lm) {
					c.bottom = lm.viewport.bottom;
				};
			case 'leftOf':
				refC = this.lastChildCoordinates[child.layout.leftOf.id];
				return function () {
					c.right = refC.right + refC.width;
				};
			case 'rightOf':
				refC = this.lastChildCoordinates[child.layout.rightOf.id];
				return function () {
					c.left = refC.left + refC.width;
				};
			case 'below':
				refC = this.lastChildCoordinates[child.layout.below.id];
				return function () {
					c.top = refC.top + refC.height;
				};
			case 'above':
				refC = this.lastChildCoordinates[child.layout.above.id];
				return function () {
					c.bottom = refC.bottom + refC.height;
				};
			case 'sameHeightAs':
				refC = this.lastChildCoordinates[child.layout.sameHeightAs.id];
				return function () {
					c.height = refC.height;
				};
			case 'sameWidthAs':
				refC = this.lastChildCoordinates[child.layout.sameWidthAs.id];
				return function () {
					c.width = refC.width;
				};
			case 'centerInParent':
				return function (lm) {
					c.top = parseInt(lm.viewport.height / 2 - c.height / 2);
					c.left = parseInt(lm.viewport.width / 2 - c.width / 2);
				};
			case 'centerHorizontal':
				return function (lm) {
					c.left = parseInt(lm.viewport.width / 2 - c.width / 2);
				};
			case 'centerVertical':
				return function (lm) {
					c.top = parseInt(lm.viewport.height / 2 - c.height / 2);
				};
			case 'fillLeft':
				return function (lm) {
					if (c.right !== undefined) {
						c.width = lm.viewport.absWidth - c.right;
					}
				};
			case 'fillRight':
				return function (lm) {
					if (c.left === undefined)c.left = 0;
					c.width = lm.viewport.absWidth - c.left - lm.viewport.right;
				};
			case 'fillDown':
				return function (lm) {
					if (c.top === undefined)c.top = 0;
					c.height = lm.viewport.absHeight - c.top - lm.viewport.bottom;
				};
			case 'fillUp':
				return function (lm) {
					if (c.bottom !== undefined) {
						c.height = lm.viewport.absHeight - c.bottom - lm.viewport.top;
					}
				};
			case 'alignLeft':
				return this.getAlignmentFn(child, property, 'left');
			case 'alignRight':
				return this.getAlignmentFn(child, property, 'right');
			case 'alignTop':
				return this.getAlignmentFn(child, property, 'top');
			case 'alignBottom':
				return this.getAlignmentFn(child, property, 'bottom');
		}
		return undefined;
	},
    /**
     * Return special resize function for the properties alignLeft, alignRight, alignTop and alignBottom
     * @method getAlignmentFn
     * @param {ludo.View} child
     * @param {String} alignment
     * @param {String} property
     * @return {Function}
     * @private
     */
	getAlignmentFn:function (child, alignment, property) {
		var c = this.newChildCoordinates[child.id];
		var refC = this.lastChildCoordinates[child.layout[alignment].id];
		return function () {
			c[property] = refC[property];
		};
	},

    /**
     * Returns layout function for the width and height layout properties
     * @method getPropertyFn
     * @param {ludo.View} child
     * @param {String} property
     * @return {Function|undefined}
     * @private
     */
	getPropertyFn:function (child, property) {
		var c = this.newChildCoordinates[child.id];

		if (isNaN(child.layout[property])) {
			switch (child.layout[property]) {
				case 'matchParent':
					return function (lm) {
						c[property] = lm.viewport[property];
					};
				case 'wrap':
					var ws = ludo.dom.getWrappedSizeOfView(child);
					var key = property === 'width' ? 'x' : 'y';
					return function(){
						c[property] = ws[key];
					};
				default:
					if (child.layout[property].indexOf !== undefined && child.layout[property].indexOf('%') >= 0) {
						var size = parseInt(child.layout[property].replace(/[^0-9]/g));
						return function (lm) {
							c[property] = parseInt(lm.viewport[property] * size / 100);
						}
					}
					return undefined;
			}
		} else {
			return function () {
				c[property] = child.layout[property];
			}.bind(child);
		}
	},

	posProperties:['left', 'right', 'bottom', 'top'],

    /**
     * Final resize function for each child. All the other dynamically created
     * layout function stores values for the left,width,top,bottom, width and height properties.
     * This function call the resize function for each view with the values of these previously
     * set properties
     * @method getLayoutLayoutFn
     * @param {ludo.View} child
     * @return {Function}
     * @private
     */
	getLastLayoutFn:function (child) {
		return function (lm) {
			var c = lm.newChildCoordinates[child.id];
			var lc = lm.lastChildCoordinates[child.id];
			var p = lm.posProperties;

			child.resize({
				width:c.width !== lc.width ? c.width : undefined,
				height:c.height !== lc.height ? c.height : undefined
			});
			for (var i = 0; i < p.length; i++) {
				var key = p[i];
				if (c[key] !== undefined){
					lm.positionChild(child, key, c[key]);
				}
				lc[key] = c[key];
			}
			lc.width = c.width;
			lc.height = c.height;
			lm.updateLastCoordinatesFor(child);
		}
	},

    /**
     * Update lastChildCoordinates properties for a child after resize is completed
     * @method updateLastCoordinatesFor
     * @param {ludo.View} child
     * @private
     */
	updateLastCoordinatesFor:function (child) {
		var lc = this.lastChildCoordinates[child.id];
		var el = child.getEl();
		if (lc.left === undefined) lc.left = el.offsetLeft;
		if (lc.top === undefined) lc.top = el.offsetTop;
		if (lc.width === undefined) lc.width = el.offsetWidth;
		if (lc.height === undefined) lc.height = el.offsetHeight;
		if (lc.right === undefined) lc.right = this.viewport.width - lc.left - lc.width;
		if (lc.bottom === undefined) lc.bottom = this.viewport.height - lc.top - lc.height;
	},

    /**
     * Position child at this coordinates
     * @method positionChild
     * @param {ludo.View} child
     * @param {String} property
     * @param {Number} value
     * @private
     */
	positionChild:function (child, property, value) {
		child.getEl().style[property] = value + 'px';
		child[property] = value;

	},
    /**
     * Creates empty newChildCoordinates and lastChildCoordinates for a child view
     * @method assignDefaultCoordinates
     * @param {ludo.View} child
     * @private
     */
	assignDefaultCoordinates:function (child) {
		this.newChildCoordinates[child.id] = {};
		this.lastChildCoordinates[child.id] = {};
	},

    /**
     * Before first resize, the internal children array is arranged so that views dependent of
     * other views are resized after the view it's depending on. example: if view "a" has leftOf property
     * set to view "b", then view "b" should be resized and positioned first. This method rearranges
     * the internal children array according to this
     * @method arrangeChildren
     * @private
     */
	arrangeChildren:function () {
		this.children = [];
		for (var i = 0; i < this.view.children.length; i++) {
			var c = this.view.children[i];
			this.children.push(c);
			this.assignDefaultCoordinates(c);
			if(c.isHidden()){
				this.setTemporarySize(c, { width:0, height:0 });
			}
		}

		this.createResizables();

		var child = this.getWronglyArrangedChild();
		var counter = 0;
		while (child && counter < 30) {
			var dep = this.getDependencies(child);
			if (dep.length > 0) {
				for (var j = 0; j < dep.length; j++) {
					if (this.isArrangedBefore(child, dep[j])) {
						var index = this.children.indexOf(child);
						this.children.splice(index, 1);
						this.children.push(child);
					}
				}
			}
			child = this.getWronglyArrangedChild();
			counter++;
		}

		if (counter === 30) {
			ludo.util.log('Possible circular layout references defined for children in Relative layout');
		}
	},


	resizeKeys:{
		'left':'leftOf',
		'right':'rightOf',
		'above':'above',
		'below':'below'
	},
    /**
     * Create resize handles for resizable children
     * @method createResizables
     * @private
     */
	createResizables:function () {
		for (var i = this.children.length - 1; i >= 0; i--) {
			var c = this.children[i];
			if (this.isChildResizable(c)) {
				for (var j = 0; j < c.layout.resize.length; j++) {
					var r = c.layout.resize[j];
					var resizer = this.getResizableFor(c, r);
					this.assignDefaultCoordinates(resizer);
					this.updateReference(this.resizeKeys[r], c, resizer);
					switch (r) {
						case 'left':
						case 'above':
							this.children.splice(i, 0, resizer);
							break;
						default:
							this.children.splice(i + 1, 0, resizer);
							break;

					}
				}
			}
		}
	},
    /**
     * Return resizable handle for a child view
     * @method getResizableFor
     * @param {ludo.View} child
     * @param {String} direction
     * @return {ludo.layout.Resizer}
     * @private
     */
	getResizableFor:function (child, direction) {
		var resizeProp = (direction === 'left' || direction === 'right') ? 'width' : 'height';
		return new ludo.layout.Resizer({
			name:'resizer-' + child.name,
			orientation:(direction === 'left' || direction === 'right') ? 'horizontal' : 'vertical',
			pos:direction,
			renderTo:this.view.getBody(),
			sibling:this.getSiblingForResize(child,direction),
			layout:this.getResizerLayout(child, direction),
			view:child,
			listeners:{
				'resize':function (change) {
					child.layout[resizeProp] += change;
					this.resize();
				}.bind(this),
				'before':this.beforeResize.bind(this)
			}
		});
	},

    /**
     * Return sibling which may be affected when a child is resized
     * @method getSiblingForResize
     * @param {ludo.View} child
     * @param {String} direction
     * @return {ludo.View|undefined}
     * @private
     */
	getSiblingForResize:function(child, direction){
		switch(direction){
			case 'left':
				return child.layout.rightOf;
			case 'right':
				return child.layout.leftOf;
			case 'above':
				return child.layout.below;
			case 'below':
				return child.layout.above;
		}
		return undefined;
	},
    /**
     * Before resize function executed for a resize handle
     * @method beforeResize
     * @param {ludo.layout.Resizer} resize
     * @param {ludo.View} child
     * @private
     */
	beforeResize:function(resize, child){
		if(resize.orientation === 'horizontal'){
			resize.setMinWidth(child.layout.minWidth || 10);
			resize.setMaxWidth(child.layout.maxWidth || this.view.getBody().offsetWidth);
		}else{
			resize.setMinHeight(child.layout.minHeight || 10);
			resize.setMaxHeight(child.layout.maxHeight || this.view.getBody().offsetHeight);
		}
	},
    /**
     * Return layout config for a resize handle
     * @method getResizerLayout
     * @param {ludo.View} child
     * @param {String} resize
     * @return {ludo.layout.RelativeSpec}
     * @private
     */
	getResizerLayout:function (child, resize) {
		var ret = {};
		switch (resize) {
			case 'left':
			case 'right':
				ret.sameHeightAs = child;
				ret.alignTop = child;
				ret.width = 5;
				break;
			default:
				ret.sameWidthAs = child;
				ret.alignLeft = child;
				ret.height = 5;
		}
		return ret;
	},

    /**
     * Update layout references when a resize handle has been created. example: When a resize handle
     * is added to the left of a child view. The leftOf view of this child is now the resize handle
     * and not another view
     * @method updateReferences
     * @param {String} property
     * @param {ludo.View} child
     * @param {ludo.layout.Resizer} resizer
     * @private
     */
	updateReference:function (property, child, resizer) {
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i].layout[property] === child) {
				this.children[i].layout[property] = resizer;
				resizer.layout.affectedSibling = this.children[i];
			}
		}
		resizer.layout[property] = child;
	},
    /**
     * Returns true if a child is resizable
     * @method isChildResizable
     * @param {ludo.View} child
     * @return {Boolean}
     * @private
     */
	isChildResizable:function (child) {
		return child.layout && child.layout.resize && child.layout.resize.length > 0;
	},

    /**
     * Return a child which should be rearrange because it's layout depends on a next sibling
     * @method getWronglyArrangedChild
     * @return {ludo.View|undefined}
     * @private
     */
	getWronglyArrangedChild:function () {
		for (var i = 0; i < this.children.length; i++) {
			var c = this.children[i];
			var dep = this.getDependencies(c);
			if (dep.length > 0) {
				for (var j = 0; j < dep.length; j++) {
					if (this.isArrangedBefore(c, dep[j])) {
						return c;
					}
				}
			}
		}
		return undefined;
	},
    /**
     * Returns true if a child is previous sibling of another child
     * @method isArrangedBefore
     * @param {ludo.View} child
     * @param {ludo.View} of
     * @return {Boolean}
     * @private
     */
	isArrangedBefore:function (child, of) {
		return this.children.indexOf(child) < this.children.indexOf(of);
	},

    /**
     * All the layout options where value is a reference to another child
     * @property depKeys
     * @private
     */
	depKeys:['above', 'below', 'leftOf', 'rightOf', 'alignLeft', 'alignBottom', 'alignRight', 'alignTop', 'sameWidthAs', 'sameHeightAs'],

    /**
     * Return all the siblings a child is depending on for layout
     * @method getDependencies
     * @param {ludo.View} child
     * @return {Array}
     * @private
     */
	getDependencies:function (child) {
		var ret = [];
		for (var i = 0; i < this.depKeys.length; i++) {
			if (child.layout[this.depKeys[i]] !== undefined) {
				var ref = child.layout[this.depKeys[i]];
				if (ref !== undefined) {
					ret.push(ref);
				}
			}
		}
		return ret;
	},
    /**
     * Return direct reference to child
     * @method getReference
     * @param {String|ludo.View} child
     * @return {ludo.View}
     * @private
     */
	getReference:function (child) {
		if (child['getId'] !== undefined)return child;
		if (this.view.child[child] !== undefined)return this.view.child[child];
		return ludo.get(child);
	},

    /**
     * Clear internal children array. When this is done, resize function will be recreated. This happens
     * when a child is removed or when a new child is added
     * @method clearChildren
     * @private
     */
	clearChildren:function () {
		this.children = undefined;
	},
    /**
     * Return internal children array
     * @method getChildren
     * @return {Array}
     * @private
     */
	getChildren:function () {
		return this.children;
	},

    /**
     * Validate and set required layout properties of new children
     * @method onNewChild
     * @param {ludo.View} child
     * @private
     */
	onNewChild:function (child) {
		this.parent(child);
		child.getEl().style.position = 'absolute';
		if (child.layout.centerInParent !== undefined) {
			child.layout.centerHorizontal = undefined;
			child.layout.centerVertical = undefined;
		}
		if(child.layout.fillRight === undefined){
			if (child.layout.width === undefined)child.layout.width = child.width ? child.width : undefined;
		}

		if (child.layout.height === undefined)child.layout.height = child.height ? child.height : undefined;

		if (child.layout.leftOf !== undefined)child.layout.right = undefined;
		if (child.layout.rightOf !== undefined)child.layout.left = undefined;
		if (child.layout.below !== undefined)child.layout.top = undefined;
		if (child.layout.above !== undefined)child.layout.bottom = undefined;


	},

    /**
     * Add events to child view
     * @method addChildEvents
     * @param {ludo.View} child
     * @private
     */
	addChildEvents:function(child){
		child.addEvent('hide', this.hideChild.bind(this));
		child.addEvent('show', this.clearTemporaryValues.bind(this));
		child.addEvent('collapse', this.minimize.bind(this));
		child.addEvent('minimize', this.minimize.bind(this));
		child.addEvent('expand', this.clearTemporaryValues.bind(this));
		child.addEvent('maximize', this.clearTemporaryValues.bind(this));
	},

    /**
     * Executed when a child is hidden. It set's the internal layout properties width and height to 0(zero)
     * @method hideChild
     * @param {ludo.View} child
     * @private
     */
	hideChild:function(child){
		this.setTemporarySize(child, {
			width:0,height:0
		});
	},

    /**
     * Executed when a child is minimized. It set's temporary width or properties
     * @method minimize
     * @param {ludo.View} child
     * @param {Object} newSize
     * @private
     */
	minimize:function(child, newSize){
		this.setTemporarySize(child, newSize);
		this.resize();
	},

    /**
     * Store temporary size when a child is minimized or hidden
     * @method setTemporarySize
     * @param {ludo.View} child
     * @param {Object} newSize
     * @private
     */
	setTemporarySize:function(child, newSize){
		if(newSize.width !== undefined){
			child.layout.cached_width = child.layout.width;
			child.layout.width = newSize.width;
		}else{
			child.layout.cached_height = child.layout.height;
			child.layout.height = newSize.height;
		}
	},
    /**
     * Clear temporary width or height values. This method is executed when a child
     * is shown or maximized
     * @method clearTemporaryValues
     * @param {ludo.View} child
     * @private
     */
	clearTemporaryValues:function(child){
		if(child.layout.cached_width !== undefined)child.layout.width = child.layout.cached_width;
		if(child.layout.cached_height !== undefined)child.layout.height = child.layout.cached_height;
		child.layout.cached_width = undefined;
		child.layout.cached_height = undefined;
		this.resize();
	}
});