/**
 A basic ludoJS view. When rendered on a Web page, a View is made out of two &lt;div> elements, one parent and one child(called body).
 @example {@lang XML}
 <!--  A basic rendered ludoJS view -->
 <div class="ludo-view-container">
 	<div class="ludo-body"></div>
 </div>
 @namespace ludo
 @class ludo.View
 @augments ludo.Core
 @param {Object} config
 @param {String} config.bodyCls Additional css classes to assign to the body &lt;div>, example: bodyCls: "classname1 classname2"
 @param {Array} config.children An array of config objects for the child views. Example: children:[{ html: "child 1", layout:{ height: 100 }}, { html: "Child 2", layout: { height:200 } }]. See <a href="../demo/view/children.php" onclick="var w = window.open(this.href);return false">Demo</a>
 @param {String} config.cls Additional css classes to assign to the views &lt;div>, example: cls: "classname1 classname2"
 @param {Object} config.containerCss Specific css rules to apply to the View, @example: containerCss:{ border: '1px solid #ddd' } for a gray border
 @param {Object} config.css Specific css rules to apply to the View's body &lt;div, @example: css:{ 'background-color': '#EEEEEE' } for a light gray background
 @param {Object} config.dataSource A config object for the data source.
 @param {Object} config.formConfig Default form properties for child form views. Example: formConfig:{labelWidth:100}. Then we don't have to specify labelWidth:100 for all the child form views.
 @param {Boolean} config.hidden When true, the View will be initially hidden. For performance reasons initially hidden Views will not be rendered until View.show() is called.
 @param {String} config.html Static HTML to show inside the View's body &lt;div>
 @param {String} config.id Id of view. When set, you can easily get access to the View by calling ludo.get("&lt;idOfView>").
 @param {Object} config.layout An object describing the layout for this view and basic layout rules for child views
 @param {String} config.name When set, you can access it by calling parentView.child["&lt;childName>"]
 @param {String} config.title Title of this view. If the view is a child in tab layout, the title will be displayed on the Tab
 @param {String} config.tpl A template for string when inserting JSON Content(the insertJSON method), example: "name:{firstname} {lastname}<br>"
 // TODO describe data sources
 @example {@lang Javascript}
	// Example 1: View render to &lt;body> tag
    new ludo.View({
 		renderTo:document.body,
 		html : 'Hello'
	}

	// Example 2: Creating custom View
 	myApp = {};
    myApp.View = new Class({
 		Extends: ludo.View,
 		type : 'myApp.View',
 		ludoRendered:function(){
 			this.html('My custom component');
		}
	}
    children:[{
		type : 'myApp.View'
	}]
 *
 */
ludo.View = new Class({
	Extends:ludo.Core,
	type:'View',
	cType:'View',
	cls:'',
	bodyCls:'',
	cssSignature:undefined,
	closable:true,
	minimizable:false,
	movable:false,
	resizable:false,
	alwaysInFront:false,
	statefulProperties:['layout'],

	els:{

	},
	state:{},

	defaultDS : 'dataSource.JSON',
	tagBody:'div',
	id:null,
	children:[],
	child:{},
	dataSource:undefined,
	socket:undefined,
	parentComponent:null,
	objMovable:null,
	width:undefined,
	height:undefined,
	overflow:undefined,
	_html:'',

	hidden:false,

	css:undefined,
	containerCss:undefined,
	formConfig:undefined,
	isRendered:false,
	unRenderedChildren:[],

	/**
	 * Draw a frame around the component. This is done by assigning the container to css class
	 * ludo-container-frame and body element to ludo-body-frame. You can also customize layout
	 * by specifying css and|or containerCss
	 * @property frame
	 * @type {Boolean}
	 * @default false
	 */
	frame:false,

	form:undefined,

	layout:undefined,

	tpl:'',
	/**
	 * Default config for ludo.tpl.Parser. ludo.tpl.Parser is a JSON parser which
	 * converts uses the template defined in tpl and converts JSON into a String.
	 * If you want to create your own parser, extend ludo.tpl.Parser and change value of JSONParser to the name
	 * of your class
	 * @property object JSONParser
	 * @memberof ludo.View.prototype
	 * @default { type: 'tpl.Parser' }
	 */
	JSONParser:{ type:'tpl.Parser' },
	initialItemsObject:[],
	contextMenu:undefined,
	lifeCycleComplete:false,

	lifeCycle:function (config) {
		this._createDOM();
		if (!config.children) {
			config.children = this.children;
			this.children = [];
		}

		this.ludoConfig(config);

		if (!config.children || !config.children.length) {
			config.children = this.getClassChildren();
		}

		if (this.hidden) {
			this.unRenderedChildren = config.children;
		} else {
			this.remainingLifeCycle(config);
		}
	},

	/**
	 * Return child views of this class.
	 * By default it returns the children property of the class. There may be advantages of defining children
	 * in this method. By defining children in the children property of the class, you don't have access to "this". By returning
	 * children from getClassChildren, you will be able to use "this" as a reference to the class instance.
	 * @function getClassChildren
	 * @memberof ludo.View.prototype
	 * @return {Array|children}
	 */
	getClassChildren:function () {
		return this.children;
	},

	remainingLifeCycle:function (config) {
		if (this.lifeCycleComplete)return;
		if (!config && this.unRenderedChildren) {
			config = { children:this.unRenderedChildren };
		}

		this.lifeCycleComplete = true;
		this._styleDOM();

		if (config.children) {
			for (var i = 0; i < config.children.length; i++) {
				config.children[i].id = config.children[i].id || 'ludo-' + String.uniqueID();
			}
			this.initialItemsObject = config.children;
			this.addChildren(config.children);
		}
		this.ludoDOM();
		this.ludoCSS();
		this.ludoEvents();

		this.increaseZIndex();

		if (this.layout && this.layout.type && this.layout.type == 'tabs') {
			this.getLayout().prepareView();
		}

		this.addCoreEvents();
		this.ludoRendered();

		if (!this.parentComponent) {
			ludo.dom.clearCache();
			ludo.dom.clearCache.delay(50, this);
			var r = this.getLayout().getRenderer();
			r.resize();
			r.resizeChildren();
		}

		/**
		 * Event fired when component has been rendered
		 * @event render
		 * @param Component this
		 */
		this.fireEvent('render', this);
		
	},

	/**
	 * First life cycle step when creating and object
	 * @function ludoConfig
	 * @param {Object} config
	 */
	ludoConfig:function (config) {
		this.parent(config);
		config.els = config.els || {};
		if (this.parentComponent)config.renderTo = undefined;
		var keys = ['css', 'contextMenu', 'renderTo', 'tpl', 'containerCss', 'socket', 'form', 'title', 'hidden',
			'dataSource', 'movable', 'resizable', 'closable', 'minimizable', 'alwaysInFront',
			'parentComponent', 'cls', 'bodyCls', 'objMovable', 'width', 'height', 'frame', 'formConfig',
			'overflow'];
		if(config.html != undefined)this._html = config.html;
		this.setConfigParams(config, keys);

		if (this.socket) {
			if (!this.socket.type)this.socket.type = 'socket.Socket';
			this.socket.component = this;
			this.socket = this.createDependency('socket', this.socket);
		}

		if (this.renderTo)this.renderTo = $(this.renderTo);

		this.layout = ludo.layoutFactory.getValidLayoutObject(this, config);

		this.insertDOMContainer();
	},

	insertDOMContainer:function () {
		if (this.hidden)this.els.container.css('display', 'none');
		if (this.renderTo)this.renderTo.append(this.els.container);
	},

	/**
	 The second life cycle method
	 This method is typically used when you want to create your own DOM elements.
	 @memberof ludo.View.prototype
	 @function ludoDOM
	 @example
	 ludoDOM : function() {<br>
			 this.parent(); // Always call parent ludoDOM
			 var myEl = $('<div>');
			 myEl.html('My Content');
			 this.getEl().append(myEl);
		 }
	 */
	ludoDOM:function () {
		if (this.contextMenu) {
			if (!ludo.util.isArray(this.contextMenu)) {
				this.contextMenu = [this.contextMenu];
			}
			for (var i = 0; i < this.contextMenu.length; i++) {
				this.contextMenu[i].applyTo = this;
				this.contextMenu[i].contextEl = this.isFormElement() ? this.getFormEl() : this.getEl();
				new ludo.menu.Context(this.contextMenu[i]);
			}
			this.contextMenu = undefined;
		}

		if (this.cls) {
			this.getEl().addClass(this.cls);
		}
		if (this.bodyCls)this.getBody().addClass(this.bodyCls);
		if (this.type)this.getEl().addClass('ludo-' + (this.type.replace(/\./g, '-').toLowerCase()));
		if (this.css)this.getBody().css(this.css);
		if (this.containerCss)this.getEl().css(this.containerCss);

		if (this.frame) {
			this.getEl().addClass('ludo-container-frame');
			this.getBody().addClass('ludo-body-frame');
		}
		if (this.cssSignature !== undefined)this.getEl().addClass(this.cssSignature);
	},

	ludoCSS:function () {

	},
	/**
	 The third life cycle method
	 This is the place where you add custom events
	 @function ludoEvents
	 @return void
	 @example
	 ludoEvents:function(){
			 this.parent();
			 this.addEvent('load', this.myMethodOnLoad.bind(this));
		 }
	 */
	ludoEvents:function () {
		if (this.dataSource) {
			this.getDataSource();
		}
	},

	/**
	 * The final life cycle method. When this method is executed, the view (including child views)
	 * are fully rendered.
	 * @memberof ludo.View.prototype
	 * @function ludoRendered
	 * @fires 'render'
	 */
	ludoRendered:function () {
		if (!this.layout.height && !this.layout.above && !this.layout.sameHeightAs && !this.layout.alignWith) {
			this.autoSetHeight();
		}
		if (!this.parentComponent) {
			this.getLayout().createRenderer();
		}

		this.isRendered = true;
		if (this.form) {
			this.getForm();
		}
	},


	/**
	 * Parse and insert JSON into the view
	 * The JSON will be sent to the JSON parser(defined in JSONParser) and
	 * This method will be called automatically when you're using a JSON data-source
	 * @function insertJSON
	 * @param {Object} json
	 * @return void
	 */
	JSON:function(json){
		if (this.tpl) {
			this.getBody().html(this.getTplParser().asString(json, this.tpl));
		}
	},

	insertJSON:function (data) {
		console.warn("Use of deprecated insertJOSN");
		if (this.tpl) {
			this.getBody().html(this.getTplParser().asString(data, this.tpl));
		}
	},

	getTplParser:function () {
		if (!this.tplParser) {
			this.tplParser = this.createDependency('tplParser', this.JSONParser);
		}
		return this.tplParser;
	},

	autoSetHeight:function () {
		var size = this.getBody().outerHeight(true);
		this.layout.height = size + ludo.dom.getMBPH(this.getEl());
	},

	/**
	 * Set HTML
	 * @function html
	 * @param html
	 * @type string
	 * @example
	 var view = new ludo.View({
	 	renderTo:document.body,
	 	layout:{ width:500,height:500 }
	 });
	 view.html('<h1>Heading</h1><p>Paragraph</p>');
     */

	html:function(html){
		this.getBody().html(html);
	},

	setHtml:function (html) {
		console.warn("Use of deprecated setHTML");
		console.trace();
		this.getBody().html(html);
	},

	setContent:function () {
		if (this._html) {
			if (this.children.length) {
				var el = $('<div>' + this._html + '</div>');
				this.getBody().append(el);
			} else {
				this.getBody().html(this._html);
			}
		}
	},

	/**
	 * Load content from the server. This method will send an Ajax request to the server
	 * using the properties specified in the remote object or data-source
	 * @function load
	 * @return void
	 */
	load:function () {
		/**
		 * This event is fired from the "load" method before a remote request is sent to the server.
		 * @event beforeload
		 * @param {String} url
		 * @param {Object} this
		 */
		this.fireEvent('beforeload', [this.getUrl(), this]);
		if (this.dataSource) {
			this.getDataSource().load();
		}
	},
	/**
	 * Get reference to parent component
	 * @function getParent
	 * @return {Object} component | null
	 */
	getParent:function () {
		return this.parentComponent ? this.parentComponent : null;
	},

	setParentComponent:function (parentComponent) {
		this.parentComponent = parentComponent;
	},

	_createDOM:function () {
		this.els.container = $('<div>');
		this.els.body = $('<' + this.tagBody + '>');
		this.els.container.append(this.els.body);
	},

	_styleDOM:function () {
		this.els.container.addClass('ludo-view-container');
		this.els.body.addClass('ludo-body');

		this.els.container.attr("id", this.getId());

		this.els.body.css('height','100%');
		if (this.overflow == 'hidden') {
			this.els.body.css('overflow', 'hidden');
		}

		if (ludo.util.isTabletOrMobile()) {
			this.els.container.addClass('ludo-view-container-mobile');
		}

		this.setContent();
	},

	addCoreEvents:function () {
		if (!this.getParent() && this.type !== 'Application') {
			this.getEl().on('mousedown', this.increaseZIndex.bind(this));
		}
	},

	increaseZIndex:function (e) {
		if (e && e.target && e.target.tagName.toLowerCase() == 'a') {
			return;
		}
		/** Event fired when a component is activated, i.e. brought to front
		 * @event activate
		 * @param {Object} ludo.View
		 */
		this.fireEvent('activate', this);
		this.setNewZIndex();
	},

	setNewZIndex:function () {
		this.getEl().css('zIndex', ludo.util.getNewZIndex(this));
	},

	/**
	 * Return reference to components DOM container. A view has two &lt;div> elements, one parent and a child. getEl()
	 * returns the parent, getBody() returns the child.
	 * DOM "body" element
	 * @function getEl()
	 * @return {Object} DOMElement
	 */
	getEl:function () {
		return this.els.container ? this.els.container : null;
	},
	/**
	 * Return reference to the "body" div HTML Element.
	 * @memberof ludo.view.prototype
	 * @function getBody
	 * @return {Object} DOMElement
	 */
	getBody:function () {
		return this.els.body;
	},
	/**
	 * Hides the view
	 * @function hide
	 * @memberof ludo.view.prototype
	 * @return void
	 */
	hide:function () {
		if (!this.hidden && this.getEl().css('display') !== 'none') {
			this.getEl().css('display', 'none');
			this.hidden = true;
			/**
			 * Fired when a component is hidden using the hide method
			 * @event hide
			 * @param {Object} htis
			 */
			this.fireEvent('hide', this);
			this.resizeParent();
		}
	},
	/**
	 * Hide component after n seconds
	 * @function hideAfterDelay
	 * @param {number} seconds
	 * @default 1
	 */
	hideAfterDelay:function (seconds) {
		this.hide.delay((seconds || 1) * 1000, this);
	},
	/**
	 * Is this component hidden?
	 * @memberof ludo.View.prototype
	 * @function isHidden
	 * @return {Boolean}
	 */
	isHidden:function () {
		return this.hidden;
	},

	/**
	 * Return true if this component is visible
	 * @function isVisible
	 * @return {Boolean}
	 *
	 */
	isVisible:function () {
		return !this.hidden;
	},

	/**
	 * Make the view visible
	 * @memberof ludo.View.prototype
	 * @function show
	 * @param {Boolean} skipEvents
	 * @return void
	 */
	show:function (skipEvents) {
		if (this.els.container.css('display') === 'none') {
			this.els.container.css('display', '');
			this.hidden = false;
		}

		if (!this.lifeCycleComplete) {
			this.remainingLifeCycle();
		}
		/**
		 * Event fired just before a component is shown using the show method
		 * @event beforeshow
		 * @param {Object} this
		 */
		if (!skipEvents)this.fireEvent('beforeshow', this);

		this.setNewZIndex();

		/**
		 * Fired when a component is shown using the show method
		 * @event show
		 * @param {Object} this
		 */
		if (!skipEvents)this.fireEvent('show', this);

		if (this.parentComponent) {
			this.resizeParent();
		} else {
			this.getLayout().getRenderer().resize();
		}
	},

	resizeParent:function () {
		var parent = this.getParent();
		if (parent) {
			if (parent.children.length > 0)parent.getLayout().resizeChildren();
		}
	},

	/**
	 * Call show() method of a child component
	 * key must be id or name of child
	 * @function showChild
	 * @param {String} key
	 * @return {Boolean} success
	 */
	showChild:function (key) {
		var child = this.getChild(key);
		if (child) {
			child.show();
			return true;
		}
		return false;
	},

	/**
	 * Return Array of direct child views.
	 * @memberof ludo.View.prototype
	 * @function getChildren
	 * @return Array of Child components
	 */
	getChildren:function () {
		return this.children;
	},
	/**
	 * Return Array of child views, recursive.
	 * @memberof ludo.View.prototype
	 * @function getAllChildren
	 * @return Array of sub components
	 */
	getAllChildren:function () {
		var ret = [];
		for (var i = 0; i < this.children.length; i++) {
			ret.push(this.children[i]);
			if (this.children[i].hasChildren()) {
				ret = ret.append(this.children[i].getChildren());
			}
		}
		return ret;
	},
	/**
	 * Returns true if this component contain any children
	 * @memberof ludo.View.prototype
	 * @function hasChildren
	 * @return {Boolean}
	 */
	hasChildren:function () {
		return this.children.length > 0;
	},

	/**
	 * Set new title
	 * @memberof ludo.View.prototype
	 * @function setTitle
	 * @param {String} title
	 */
	setTitle:function (title) {
		this.title = title;
	},

	/**
	 * Returns total width of component including padding, borders and margins
	 * @memberof ludo.View.prototype
	 * @function getWidth
	 * @return {Number} width
	 */
	getWidth:function () {
		return this.layout.pixelWidth ? this.layout.pixelWidth : this.layout.width;
	},

	/**
	 * Get current height of component
	 * @memberof ludo.View.prototype
	 * @function getHeight
	 * @return {Number}
	 */
	getHeight:function () {
		return this.layout.pixelHeight ? this.layout.pixelHeight : this.layout.height;
	},

	/**
	 Resize View and it's children. Example:
	 @function resize
	 @memberof ludo.View.prototype
	 @param {Object} config
	 @example
	 view.resize(
	 { width: 200, height:200 }
	 );
	 */
	resize:function (config) {

		if (this.isHidden()) {
			return;
		}
		config = config || {};

		if (config.width) {
			if (this.layout.aspectRatio && this.layout.preserveAspectRatio && config.width && !this.isMinimized()) {
				config.height = config.width / this.layout.aspectRatio;
			}
			// TODO layout properties should not be set here.
			this.layout.pixelWidth = config.width;
			if (!isNaN(this.layout.width))this.layout.width = config.width;
			var width = config.width - ludo.dom.getMBPW(this.els.container);
			if (width > 0) {
				this.els.container.css('width', width);
			}
		}

		if (config.height && !this.state.isMinimized) {
			// TODO refactor this part.
			if (!this.state.isMinimized) {
				this.layout.pixelHeight = config.height;
				if (!isNaN(this.layout.height))this.layout.height = config.height;
			}
			var height = config.height - ludo.dom.getMBPH(this.els.container);
			if (height > 0) {
				this.els.container.css('height', height);
			}
		}

		if (config.left !== undefined || config.top !== undefined) {
			this.setPosition(config);
		}

		this.resizeDOM();

		if (config.height || config.width) {
			/**
			 * Event fired when component is resized
			 * @event resize
			 */
			this.fireEvent('resize');
		}
		if (this.children.length > 0)this.getLayout().resizeChildren();
	},
	/**
	 * Returns true component is collapsible
	 * @function isCollapsible
	 * @return {Boolean}
	 */
	isCollapsible:function () {
		return this.layout && this.layout.collapsible ? true : false;
	},

	isChildOf:function (view) {
		var p = this.parentComponent;
		while (p) {
			if (p.id === view.id)return true;
			p = p.parentComponent;
		}
		return false;
	},

	setPosition:function (pos) {
		if (pos.left !== undefined && pos.left >= 0) {
			this.els.container.css('left', pos.left);
		}
		if (pos.top !== undefined && pos.top >= 0) {
			this.els.container.css('top', pos.top);
		}
	},

	getLayout:function () {
		if (!this.hasDependency('layoutManager')) {
			this.createDependency('layoutManager', ludo.layoutFactory.getManager(this));
		}
		return this.getDependency('layoutManager');
	},

	resizeChildren:function () {
		if (this.children.length > 0)this.getLayout().resizeChildren();
	},

	isMinimized:function () {
		return false;
	},

	cachedInnerHeight:undefined,
	resizeDOM:function () {

		if (this.layout.pixelHeight > 0) {
			var height = this.layout.pixelHeight ? this.layout.pixelHeight - ludo.dom.getMBPH(this.els.container) : this.els.container.css('height').replace('px', '');
			height -= ludo.dom.getMBPH(this.els.body);
			if (height <= 0 || isNaN(height)) {
				return;
			}
			this.els.body.css('height', height);
			this.cachedInnerHeight = height;
		}
	},

	getInnerHeightOfBody:function () {
		return this.cachedInnerHeight ? this.cachedInnerHeight : this.els.body.height();
	},

	getInnerWidthOfBody:function () {
		return this.layout.pixelWidth ? this.layout.pixelWidth - ludo.dom.getMBPW(this.els.container) - ludo.dom.getMBPW(this.els.body) : ludo.dom.getInnerWidthOf(this.els.body);
	},

	/**
	 * Add child components
	 * Only param is an array of child objects. A Child object can be a component or a JSON object describing the component.
	 * @function addChildren
	 * @memberof ludo.View.prototype
	 * @param {Array} children
	 * @return {Array} of new children
	 */
	addChildren:function (children) {
		var ret = [];
		for (var i = 0, count = children.length; i < count; i++) {
			ret.push(this.addChild(children[i]));
		}
		return ret;
	},
	/**
	 * Add a child component. The method will returned the created component.
	 * @memberof ludo.View.prototype
	 * @function addChild
	 * @param {Object|View} child. A Child object can be a View or a JSON config object for a new View.
	 * @param {String} insertAt
	 * @optional
	 * @param {String} pos
	 * @optional
	 * @return {View} child
	 */
	addChild:function (child, insertAt, pos) {
		child = this.getLayout().addChild(child, insertAt, pos);
		if (child.name) {
			this.child[child.name] = child;
		}
		child.addEvent('dispose', this.removeChild.bind(this));
		return child;
	},

	isMovable:function () {
		return this.movable;
	},

	isClosable:function () {
		return this.closable;
	},

	isMinimizable:function () {
		return this.minimizable;
	},
	/**
	 * Get child view by name or id
	 * @memberof ludo.View.prototype
	 * @function getChild
	 * @param {String} childName id or name of child view
	 *
	 */
	getChild:function (childName) {
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i].id == childName || this.children[i].name == childName) {
				return this.children[i];
			}
		}
		return undefined;
	},

	removeChild:function (child) {
		this.children.erase(child);
		child.parentComponent = null;
	},
	/**
	 * Remove all children
	 * @function disposeAllChildren
	 * @return void
	 */
	disposeAllChildren:function () {
		for (var i = this.children.length - 1; i >= 0; i--) {
			this.children[i].dispose();
		}
	},
	/**
	 * Hide and removes the view view
	 * @memberof ludo.View.prototype
	 * @function remove
	 * @return void
	 */
	remove:function(){
		this.fireEvent('dispose', this);
		ludo.util.dispose(this);
	},


	dispose:function () {
		console.warn("Use of deprecated dispose");
		console.trace();
        this.fireEvent('dispose', this);
        ludo.util.dispose(this);
	},
	/**
	 * Returns title
	 * @function getTitle
	 * @memberOf ludo.View.prototype
	 * @return string
	 */
	getTitle:function () {
		return this.title;
	},

	dataSourceObj:undefined,

	/**
	 * @funtion getDataSource
	 * @memberOf ludo.View.prototype
	 * Returns object of type ludo.dataSource.*
	 * @returns {undefined|*}
     */
	getDataSource:function () {
		if (!this.dataSourceObj && this.dataSource) {
			var obj;
			if (ludo.util.isString(this.dataSource)) {
				obj = this.dataSourceObj = ludo.get(this.dataSource);
			} else {
				if (!this.dataSource.type) {
					this.dataSource.type = this.defaultDS;
				}
                if(this.dataSource.shim && !this.dataSource.shim.renderTo){
                    this.dataSource.shim.renderTo = this.getEl()
                }
				obj = this.dataSourceObj = this.createDependency('viewDataSource', this.dataSource);
			}

			var method = obj.getSourceType() === 'HTML' ? 'html' : 'insertJSON';

			if (obj.hasData()) {
				this[method](obj.getData());
			}
			obj.addEvent('load', this[method].bind(this));
		}
		return this.dataSourceObj;
	},
	_shim:undefined,
	shim:function(){
		if(this._shim === undefined){
			this._shim = new ludo.view.Shim({
				txt : '',
				renderTo:this.getEl()
			});
		}
		return this._shim;
	},

    /**
     Returns {@link ludo.form.Manager"} for this view.
     @function getForm     *
     @return {ludo.form.Manager}
	 @memberof ludo.View.prototype
     @example
        view.getForm().reset();

     to reset all form fields

     @example
        view.getForm().save();

     to submit the form

     @example
        view.getForm().read(1);

     to send a read request to the server for record with id 1.
     */
	getForm:function () {
		if (!this.hasDependency('formManager')) {
			this.createDependency('formManager',
				{
					type:'ludo.form.Manager',
					view:this,
					form:this.form
				});
		}
		return this.getDependency('formManager');
	},

	getParentForm:function () {
		var parent = this.getParent();
		return parent ? parent.hasDependency('formManager') ? parent.getDependency('formManager') : parent.getParentForm() : undefined;
	},

	isFormElement:function () {
		return false;
	},

	getHeightOfButtonBar:function () {
		return 0;
	},

	getSocket:function () {
		return this.socket;
	},

	canvas:undefined,
	/**
	 Returns drawable Canvas/SVG
	 @function getCanvas
	 @memberof ludo.View.prototype
	 @return {canvas.Canvas} canvas
	 @example
	    var win = new ludo.Window({
		   id:'myWindow',
		   left:50, top:50,
		   width:410, height:490,
		   title:'Canvas',
		   css:{
			   'background-color':'#FFF'
		   }
	   });
	    // Creating line style
	    var paint = new ludo.canvas.Paint({
		   css:{
			   'fill':'#FFFFFF',
			   'stroke':'#DEF',
			   'stroke-width':'5'
		   }
	   });
	 	// Get reference to canvas
	    var canvas = win.getCanvas();
	    canvas.append(new ludo.canvas.Node('line', { x1:100, y1:100, x2:200, y2:200, "class":paint }));
	 */
	getCanvas:function () {
		if (this.canvas === undefined) {
			this.canvas = this.createDependency('canvas', new ludo.canvas.Canvas({
				renderTo:this
			}));
		}
		return this.canvas;
	}
});

ludo.factory.registerClass('View', ludo.View);