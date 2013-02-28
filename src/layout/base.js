/**
* Base class for ludoJS layouts
 * @namespace layout
 * @class Base
 */
ludo.layout.Base = new Class({
	Extends:Events,
	view:null,
	tabStrip:null,
	resizables:[],
	benchmarkTime:false,

	viewport:{
		top:0, left:0,
		width:0, height:0,
		bottom:0, right:0
	},

	initialize:function (view) {
		this.view = view;
		this.onCreate();
	},

	onCreate:function () {
		if (this.view.layout.collapseBar) {
			this.addCollapseBars();
		}
	},
    /**
    * Method executed when adding new child view to a layout
     * @method addChild
     * @param {ludo.View} child
     * @param {ludo.View} insertAt
     * @optional
     * @param {String} pos
     * @optional
     */
	addChild:function (child, insertAt, pos) {
		child = this.getNewComponent(child);
		var parentEl = this.getParentForNewChild();
		if (insertAt) {
			var children = [];
			for (var i = 0; i < this.view.children.length; i++) {
				if (pos == 'after') {
					children.push(this.view.children[i]);
					parentEl.adopt(this.view.children[i].getEl());
				}
				if (this.view.children[i].getId() == insertAt.getId()) {
					children.push(child);
					parentEl.adopt(child.getEl());
				}
				if (pos == 'before') {
					children.push(this.view.children[i]);
					parentEl.adopt(this.view.children[i].getEl());
				}
			}
			this.view.children = children;
		} else {
			this.view.children.push(child);
            var el = child.getEl();
            parentEl.appendChild(el);
		}

		this.onNewChild(child);
		this.addChildEvents(child);
		if (child.isCollapsible !== undefined && child.isCollapsible()) {
			// if (child.getElForCollapsedState !== undefined)child.getElForCollapsedState().inject(child.getEl(), 'after');
			if (child.collapsed) {
				child.collapse();
			}
		}
		/**
		 * Event fired by layout manager when a new child is added
		 * @event addChild
		 * @param {ludo.View} child
		 * @param {ludo.layout.Base} layout manager
		 */
		this.fireEvent('addChild', [child, this]);
		return child;
	},
    /**
    * Return parent DOM element for new child
     * @method getParentForNewChild
     * @protected
     */
	getParentForNewChild:function(){
		return this.view.els.body;
	},

	layoutProperties:['collapsible', 'collapsed'],
	/**
	 * Implementation in sub classes
	 * @method onNewChild
	 * @private
	 */
	onNewChild:function (child) {
		var keys = this.layoutProperties;
		for (var i = 0; i < keys.length; i++) {
			if (child.layout[keys[i]] === undefined && child[keys[i]] !== undefined) {
				child.layout[keys[i]] = child[keys[i]];
			}
		}
		if(child.layout.collapseTo !== undefined){
			var view = ludo.get(child.layout.collapseTo);
			if(view){
				var bar = view.getLayoutManager().getCollapseBar(child.layout.collapsible);
				if(bar)bar.addView(child);
			}
		}
	},

	addChildEvents:function(){

	},

	resizeChildren:function () {
		if (this.benchmarkTime) {
			var start = new Date().getTime();
		}
		if (this.view.isHidden()) {
			return;
		}
		if (this.idLastDynamic === undefined) {
			this.setIdOfLastChildWithDynamicWeight();
		}

		this.storeViewPortSize();

		this.resize();
		if (this.benchmarkTime) {
			ludo.util.log("Time for resize(" + this.view.layout.type + "): " + (new Date().getTime() - start));
		}
	},

	storeViewPortSize:function () {
		this.viewport.absWidth = this.getAvailWidth();
		this.viewport.absHeight = this.getAvailHeight();
		this.viewport.width = this.getAvailWidth() - this.viewport.left - this.viewport.right;
		this.viewport.height = this.getAvailHeight() - this.viewport.top - this.viewport.bottom;
	},

	previousContentWidth:undefined,

	idLastDynamic:undefined,

	setIdOfLastChildWithDynamicWeight:function () {
		for (var i = this.view.children.length - 1; i >= 0; i--) {
			if (this.hasLayoutWeight(this.view.children[i])) {
				this.idLastDynamic = this.view.children[i].id;
				return;
			}
		}
		this.idLastDynamic = 'NA';
	},

	hasLayoutWeight:function (child) {
		return child.layout !== undefined && child.layout.weight !== undefined;
	},

	getNewComponent:function (config) {
		config.renderTo = this.view.getBody();
		config.type = config.type || this.view.cType;
		config.parentComponent = this.view;
		return ludo.factory.create(config);
	},

	isLastSibling:function (child) {
		var children = this.view.initialItemsObject;
		if (children.length) {
			return children[children.length - 1].id == child.id;
		} else {
			return this.view.children[this.view.children.length - 1].id == child.id;
		}
	},

	prepareView:function () {

	},

	resize:function () {
		var config = {};
		config.width = ludo.dom.getInnerWidthOf(this.view.getBody());
		if (config.width < 0) {
			config.width = null;
		}
		for (var i = 0; i < this.view.children.length; i++) {
			this.view.children[i].resize(config);
		}
	},

	getAvailWidth:function () {
		return ludo.dom.getInnerWidthOf(this.view.getBody());
	},

	getAvailHeight:function () {
		return this.view.getInnerHeightOfBody();
	},

	addCollapseBars:function () {
		var pos = this.view.layout.collapseBar;
		if (!ludo.util.isArray(pos))pos = [pos];
		for (var i = 0; i < pos.length; i++) {
			this.addChild(this.getCollapseBar(pos[i]));
		}
	},

	collapseBars:{},
	getCollapseBar:function (position) {
		position = position || 'left';
		if (this.collapseBars[position] === undefined) {
			var bar = this.collapseBars[position] = new ludo.layout.CollapseBar({
				position:position,
				parentComponent:this.view,
				parentLayout:this.view.layout,
				listeners:{
					'show':this.toggleCollapseBar.bind(this),
					'hide':this.toggleCollapseBar.bind(this)
				}
			});
			this.updateViewport(bar.getChangedViewport());
		}
		return this.collapseBars[position];
	},

	toggleCollapseBar:function (bar) {
		this.updateViewport(bar.getChangedViewport());
		this.resize();
	},
    /**
     * Update viewport properties, coordinates of DHTML Container for child views, i.e. body of parent view
     * @method updateViewport
     * @param {Object} c
     */
	updateViewport:function (c) {
		this.viewport[c.key] = c.value;
	},

	createRenderer:function(){
		if(this.renderer === undefined){
			this.renderer = new ludo.layout.Renderer({
				view:this.view
			});
		}
		return this.renderer;
	},

	getRenderer:function(){
		return this.renderer ? this.renderer : this.createRenderer();
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
     * @protected
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
     * @protected
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
     * @protected
     */
    clearTemporaryValues:function(child){
        if(child.layout.cached_width !== undefined)child.layout.width = child.layout.cached_width;
        if(child.layout.cached_height !== undefined)child.layout.height = child.layout.cached_height;
        child.layout.cached_width = undefined;
        child.layout.cached_height = undefined;
        this.resize();
    }
});