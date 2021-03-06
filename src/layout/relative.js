/**
 Relative Layout. This layout will render children relative to each other based on the rules defined below.
 For a demo, see <a href="../demo/layout/relative.php" onclick="var w=window.open(this.href);return false">Relative layout demo</a>.
 @namespace ludo.layout
 @class ludo.layout.Relative
 @summary layout: {type: "relative" }
 @param {object} config
 @param {number|string} config.width Width in Pixels or "matchParent". 
 @param {number|string} config.height Height in pixels or "matchParent"
 @param {Boolean} config.alignParentTop Align at top edge of parent view
 @param {Boolean} config.alignParentBottom Align bottom of this view with the bottom of parent view
 @param {Boolean} config.alignParentLeft Align left in parent
 @param {Boolean} config.alignParentRight Right align inside parent
 @param {String} config.leftOf Align left of sibling with this id
 @param {String} config.rightOf Align right of sibling with this id
 @param {String} config.below Align below sibling with this id
 @param {String} config.above Align above sibling with this id
 @param {String} config.alignLeft Same left position as sibling with this id.
 @param {String} config.alignRight Same right position as sibling with this id
 @param {String} config.alignTop Same top position as sibling with this id
 @param {String} config.alignBottom Same bottom edge as sibling with this id
 @param {String} config.sameWidthAs Same width as sibling with this id
 @param {String} config.sameHeightAs Same height as sibling with this id
 @param {Boolean} config.centerInParent True to Center view inside parent
 @param {Boolean} config.centerHorizontal True to Center view horizontally inside parent
 @param {Boolean} config.centerVertical True to Center View vertically inside parent
 @param {Boolean} config.fillLeft True to use all remaining space left of view. (left pos will be 0)
 @param {Boolean} config.fillRight True to use all remaining space right of view.
 @param {Boolean} config.fillUp True to use all remaining space above view. (top pos will be 0)
 @param {Number} config.absLeft Absolute pixel value for left position
 @param {Number} config.absRight Absolute pixel value for right position
 @param {Number} config.absTop Absolute pixel value for top position
 @param {Number} config.absBottom Absolute pixel value for bottom position
 @param {Number} config.offsetX After positioning the view, offset left position with these number of pixels.
 @param {Number} config.offsetY After positioning the view, offset top position with these number of pixels.
 @param {Array} config.resize Make the view resizable in these directions(left|right|above|below).
 @example
 var view = new ludo.View({
 	layout:{
 		width:'matchParent',height:'matchParent',
 		type:'relative' // Render children in relative layout
 	},
 	children:[ // array of relative positioned children
 	{
 		// Center this view inside parent
		{ id:'child1', html: 'First View', layout:{ centerInParent:true,width:200,height:200}},
		// Render below "child1" and align it with "child1"
		{ id:'child2', html: 'Second View', layout:{ below:'child1', alignLeft:'child1', width:300,height:50 }
 	}]
 });
 */
ludo.layout.Relative = new Class({
	Extends:ludo.layout.Base,
	children:undefined,
	type:'layout.Relative',
    /*
     * Array of valid layout properties
     * @property {Array} layoutFnProperties
     * @private
     */
	layoutFnProperties:[
		'bottom','right','top','left',
		'width', 'height',
		'alignParentTop', 'alignParentBottom', 'alignParentLeft', 'alignParentRight',
		'leftOf', 'rightOf', 'below', 'above',
		'alignLeft', 'alignRight', 'alignTop', 'alignBottom',
		'sameWidthAs', 'sameHeightAs',
		'centerInParent', 'centerHorizontal', 'centerVertical',
		'fillLeft', 'fillRight', 'fillUp', 'fillDown',
		'absBottom','absWidth','absHeight','absLeft','absTop','absRight','offsetX','offsetY',
		'widthOffset','heightOffset'
	],

	newChildCoordinates:{},
	lastChildCoordinates:{},

	onCreate:function () {
		this.parent();
		this.view.$b().css('position', 'relative');

	},

	resize:function () {
		if (this.children === undefined) {
			this.prepareResize();
		}
		for (var i = 0; i < this.children.length; i++) {
            if(!this.children[i].layoutResizeFn){
                this.children[i].layoutResizeFn = this.getResizeFnFor(this.children[i]);
            }
			this.children[i].layoutResizeFn.call(this.children[i], this);
		}
	},

    /*
     * No resize done yet, create resize functions
     * @function prepareResize
     * @private
     */
	prepareResize:function( ){
		this.fixLayoutReferences();
		this.arrangeChildren();
     	this.createResizeFunctions();
	},

	createResizeFunctions:function () {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].layoutResizeFn = this.getResizeFnFor(this.children[i]);
		}
	},


	fixLayoutReferences:function () {
		for (var i = 0; i < this.view.children.length; i++) {
			var c = this.view.children[i];
			var k = this.depKeys;
			for (var j = 0; j < k.length; j++) {
				if (c.layout[k[j]] !== undefined)c.layout[k[j]] = this.getReference(c.layout[k[j]]);
			}
		}
	},

	getResizeFnFor:function (child) {
		var fns = this.getLayoutFnsFor(child);
		return function (layoutManager) {
			for (var i = 0; i < fns.length; i++) {
				fns[i].call(child, layoutManager);
			}
		};
	},

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
    /*
     Return one resize function for a child

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
			case 'bottom':
			case 'right':
				return function () {
					c[property] = child.layout[property];
				}.bind(child);

            case 'offsetX':
                return function(){
                    c.left += child.layout[property];
                }.bind(child);
            case 'offsetY':
                return function(){
                    c.top += child.layout[property];
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

	getAlignmentFn:function (child, alignment, property) {
		var c = this.newChildCoordinates[child.id];
		var refC = this.lastChildCoordinates[child.layout[alignment].id];
		return function () {
			c[property] = refC[property];
		};
	},

    /*
     * Returns layout function for the width and height layout properties
     */
	getPropertyFn:function (child, property) {
		var c = this.newChildCoordinates[child.id];

		if (isNaN(child.layout[property])) {
			switch (child.layout[property]) {
				case 'matchParent':
					return function (lm) {
						var off = child.layout[property + 'Offset'] || 0;
						c[property] = lm.viewport[property] + off;
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

    /*
     * Final resize function for each child. All the other dynamically created
     */
	getLastLayoutFn:function (child) {
		return function (lm) {
			var c = lm.newChildCoordinates[child.id];
			var lc = lm.lastChildCoordinates[child.id];
			var p = lm.posProperties;
            if(child.layout.above && child.layout.below){
                c.height = lm.viewport.height - c.bottom - c.top;
            }

			if(child.layout.leftOf && child.layout.rightOf){
				c.width = lm.viewport.width - c.right - c.left;
			}



			if(child.isHidden()){
				c.width = 0;
				c.height = 0;
			}
			child.resize({
				width:c.width !== lc.width ? c.width : undefined,
				height:c.height !== lc.height ? c.height : undefined
			});


			if(c.right !== undefined && c.width){
				c.left = lm.viewport.absWidth - c.right - c.width;
				c.right = undefined;
			}

			if(c.bottom !== undefined && c.height){
				c.top = lm.viewport.absHeight - c.bottom - c.height;
				c.bottom = undefined;
			}
			if(c.bottom !== undefined){
				var h = lm.viewport.absHeight - c.bottom - (c.top || 0);
				if(h!= lc.height){
					child.resize({ height: lm.viewport.absHeight - c.bottom - (c.top || 0) });
				}
				c.bottom = undefined;
			}

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
    /*
     * Update lastChildCoordinates properties for a child after resize is completed
     * @function updateLastCoordinatesFor
     * @param {ludo.View} child
     * @private
     */
	updateLastCoordinatesFor:function (child) {
		var lc = this.lastChildCoordinates[child.id];
		var el = child.getEl();
		var pos = el.position == undefined ? { left: el.offsetLeft, top: el.offsetTop } : el.position();
		if (lc.left === undefined) lc.left = pos.left > 0 ? pos.left : 0;
		if (lc.top === undefined) lc.top = pos.top > 0 ? pos.top : 0;
		if (lc.width === undefined) lc.width = el.width != undefined ? el.width() : el.offsetWidth;
		if (lc.height === undefined) lc.height = el.height != undefined ? el.height() : el.offsetHeight;
		if (lc.right === undefined) lc.right = this.viewport.width - lc.left - lc.width;
		if (lc.bottom === undefined) lc.bottom = this.viewport.height - lc.top - lc.height;
	},


	positionChild:function (child, property, value) {
		child.getEl().css(property, value); // style[property] = value + 'px';
		child[property] = value;
	},
    /*
     * Creates empty newChildCoordinates and lastChildCoordinates for a child view
     */
	assignDefaultCoordinates:function (child) {
		this.newChildCoordinates[child.id] = {};
		this.lastChildCoordinates[child.id] = {};
	},

    /*
     * Before first resize, the internal children array is arranged so that views dependent of
     * other views are resized after the view it's depending on. example: if view "a" has leftOf property
     * set to view "b", then view "b" should be resized and positioned first. This method rearranges
     * the internal children array according to this
     * @function arrangeChildren
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
	resizables : {},

    /*
     * Create resize handles for resizable children
     * @function createResizables
     * @private
     */
	createResizables:function () {
		for (var i = this.children.length - 1; i >= 0; i--) {
			var c = this.children[i];
			if (this.isChildResizable(c)) {
				this.resizables[c.id] = {};
				for (var j = 0; j < c.layout.resize.length; j++) {
					var r = c.layout.resize[j];
					var resizer = this.resizables[c.id][r] = this.getResizableFor(c, r);
					this.assignDefaultCoordinates(resizer);
					this.updateReference(this.resizeKeys[r], c, resizer);
                    var pos = r == 'left' || r === 'above' ? i: i+1;
                    this.children.splice(pos, 0, resizer);
				}
			}
		}
	},

	getResizable:function(child, direction){
		return this.resizables[child.id][direction];
	},

    /*
     * Return resizable handle for a child view
     * @function getResizableFor
     * @param {ludo.View} child
     * @param {String} direction
     * @return {ludo.layout.Resizer}
     * @private
     */
	getResizableFor:function (child, direction) {
        // TODO should be possible to render size of resizer to sum of views (see relative.php demo)
		var resizeProp = (direction === 'left' || direction === 'right') ? 'width' : 'height';
		return new ludo.layout.Resizer({
			name:'resizer-' + child.name,
			hidden:child.isHidden(),
			orientation:(direction === 'left' || direction === 'right') ? 'horizontal' : 'vertical',
			pos:direction,
			renderTo:this.view.$b(),
			sibling:this.getSiblingForResize(child,direction),
			layout:this.getResizerLayout(child, direction),
			lm:this,
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

    /*
     * Return sibling which may be affected when a child is resized
     * @function getSiblingForResize
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
    /*
     * Before resize function executed for a resize handle
     * @function beforeResize
     * @param {ludo.layout.Resizer} resize
     * @param {ludo.View} child
     * @private
     */
	beforeResize:function(resize, child){

		if(resize.orientation === 'horizontal'){
			var min = this.toPixels(child.layout.minWidth || 10);
			resize.setMinWidth(min);
			var max = child.layout.maxWidth || this.view.$b().width();
			max = this.toPixels(max, true);
			resize.setMaxWidth(max);
		}else{
			var minHeight = this.toPixels(child.layout.minHeight || 10);
			resize.setMinHeight(minHeight);
			resize.setMaxHeight(child.layout.maxHeight || this.view.$b().height());
		}
	},

	toPixels:function(value, isWidth){
		if(jQuery.type(value) == "string" && value.indexOf('%') >0){
			var val = parseInt(value);
			return val / 100 * (isWidth ? this.viewport.width : this.viewport.height);
		}
		return value;
	},

    /*
     * Return layout config for a resize handle
     * @function getResizerLayout
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

    /*
     * Update layout references when a resize handle has been created. example: When a resize handle
     * is added to the left of a child view. The leftOf view of this child is now the resize handle
     * and not another view
     * @function updateReferences
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
     * @function isChildResizable
     * @param {ludo.View} child
     * @return {Boolean}
     * @private
     */
	isChildResizable:function (child) {
		return child.layout && child.layout.resize && child.layout.resize.length > 0;
	},

    /*
     * Return a child which should be rearrange because it's layout depends on a next sibling
     * @function getWronglyArrangedChild
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
    /*
     * Returns true if a child is previous sibling of another child
     * @function isArrangedBefore
     * @param {ludo.View} child
     * @param {ludo.View} of
     * @return {Boolean}
     * @private
     */
	isArrangedBefore:function (child, of) {
		return this.children.indexOf(child) < this.children.indexOf(of);
	},

    /*
     * All the layout options where value is a reference to another child
     * @property depKeys
     * @private
     */
	depKeys:['above', 'below', 'leftOf', 'rightOf', 'alignLeft', 'alignBottom', 'alignRight', 'alignTop', 'sameWidthAs', 'sameHeightAs'],

    /*
     * Return all the siblings a child is depending on for layout
     * @function getDependencies
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
    /*
     * Return direct reference to child
     * @function getReference
     * @param {String|ludo.View} child
     * @return {ludo.View}
     * @private
     */
	getReference:function (child) {
		if (child['getId'] !== undefined)return child;
		if (this.view.child[child] !== undefined)return this.view.child[child];
		return ludo.get(child);
	},

    /*
     * Clear internal children array. When this is done, resize function will be recreated. This happens
     * when a child is removed or when a new child is added
     * @function clearChildren
     * @private
     */
	clearChildren:function () {
		this.children = undefined;
	},
    /*
     * Return internal children array
     * @function getChildren
     * @return {Array}
     * @private
     */
	getChildren:function () {
		return this.children;
	},

    /*
     * Validate and set required layout properties of new children
     * @function onNewChild
     * @param {ludo.View} child
     * @private
     */
	onNewChild:function (child) {
		this.parent(child);
		if(child.getEl().css != undefined){
			child.getEl().css('position', 'absolute');
		}
        var l = child.layout;
		if (l.centerInParent !== undefined) {
			l.centerHorizontal = undefined;
			l.centerVertical = undefined;
		}
		if(l.fillRight === undefined){
			if (l.width === undefined)l.width = child.width ? child.width : undefined;
		}

		if (l.height === undefined)l.height = child.height ? child.height : undefined;

		if (l.leftOf)l.right = undefined;
		if (l.rightOf)l.left = undefined;
		if (l.below)l.top = undefined;
		if (l.above)l.bottom = undefined;
	},


	addChildEvents:function(child){
		child.addEvent('hide', this.hideChild.bind(this));
		child.addEvent('show', this.clearTemporaryValues.bind(this));
		child.addEvent('collapse', this.minimize.bind(this));
		child.addEvent('minimize', this.minimize.bind(this));
		child.addEvent('expand', this.clearTemporaryValues.bind(this));
		child.addEvent('maximize', this.clearTemporaryValues.bind(this));
	}
});