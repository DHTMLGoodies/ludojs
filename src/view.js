/**
 ludoJS View
 Basic view class in ludoJS. All other views inherits properties from this class. It can be
 used at it is or used as ancestor for new modules.<br><br>
 The View class is also default type when adding children without a specified "type" attribute. <br><br>
 When a Component is created it executes the following life cycle methods. If you extend a component, do not
 override MooTools constructor method initialize(). Instead, extend one or more of the lifeCycle method
 below:
 <br><br>
 <b>ludoConfig(config)</b> - This is where config properties are being parsed. At this point, the DOM
 container and DOM body has been created but not inserted into the page.<br>
 <b>ludoDOM()</b> - The main DOM of the component has been created<br>
 <b>ludoCSS()</b> - A method used to apply CSS styling to DOM elements.<br>
 <b>ludoEvents()</b> - The place to add events<br>
 <b>ludoRendered</b> - The component is fully rendered<br>

 @class View
 @extends Core
 @constructor
 @param {Object} config
 @example
    new ludo.View({
 		renderTo:document.body,
 		html : 'Hello'
	}
 Creates a standard view rendered to the &lt;body> element of your page

 @example
     ...
     children:[{
            html : 'View 1' },
     {
         html : 'View 2' }
     }]
     ...
 adds two views as child of a component

 @example
    ludo.myApp.View = new Class({
 		Extends: ludo.View,
 		type : 'myApp.View',
 		ludoRendered:function(){
 			this.html('My custom component');
		}
	}
    ...
    ...
    children:[{
		type : 'myApp.View'
	}]
     ...

 is a simple example of how to extend a view to create your own views and how to use it.
 *
 */
ludo.View = new Class({
	Extends:ludo.Core,
	type:'View',
	cType:'View',
	cls:'',
	bodyCls:'',

	/**
	 * CSS class added to container of this component
	 * @property string cssSignature
	 * @private
	 * @default undefined
	 */
	cssSignature:undefined,


	closable:true,
	minimizable:false,
	movable:false,
	/**
	 * if set to true and this component is a child of a component with "rows" or "cols" layout, resize
	 * handles will be created for it and it will be resizable. Please notice that components with
	 * stretch set to true are not resizable.
	 * @config resizable
	 * @type {Boolean}
	 */
	resizable:false,

	alwaysInFront:false,

	statefulProperties:['layout'],

	els:{

	},
	state:{},

	defaultDS : 'dataSource.JSON',
	tagBody:'div',
	id:null,

	/**
	 Array of Config objects for dynamically created children
	 @config children
	 @type Array
	 @example
	    new ludo.Window({
           left : 200, top : 200,
           width : 400, height: 400,
           children : [{
               type : 'View',
               html : 'This is my sub component'
           }]
        });
	 */
	children:[],

	child:{},

	dataSource:undefined,

	/**
	 @description Configuration object for socket.Socket, Example:
	 A reference to the socket can be retrieved by this.getSocket()
	 @config socket
	 @type Object
	 @default undefined
	 @example
	    socket:{
            url:'http://127.0.0.1:1337',
            emitEvents:['chat','logout']
        }
	 */
	socket:undefined,

	parentComponent:null,
	objMovable:null,
	/**
	 * Width of component
	 * @config {Number} width
	 */
	width:undefined,
	/**
	 * Height of component
	 * @config {Number} height
	 */
	height:undefined,

	overflow:undefined,

	/**
	 * Static HTML content for the view.
	 * @config {String} html
	 * @default ''
	 */
	_html:'',

	/**
	 * Set this property to true if you want to initally hide the component. You can use
	 * method show to show the component again.
	 * @config {Boolean} hidden
	 * @default true
	 */
	hidden:false,

	/**
	 * CSS styles of body element of component
	 * example: { padding : '2px', margin: '2px' }
	 * @config {Object} css
	 * @default undefined
	 */
	css:undefined,
	/**
	 * CSS styles of component container
	 * example: { padding : '2px', margin: '2px' }
	 * @config {Object} containerCss
	 * @default undefined
	 */
	containerCss:undefined,
	/**
	 * Form config for child elements, example { labelWidth : 200, stretchField:true }, which
	 * will be applied to all child form elemetns if no labelWidth is defined in their config
	 * @config {Object} formConfig
	 * @default undefined
	 */
	formConfig:undefined,

	/**
	 * @property boolean isRendered
	 * @description Property set to true when component and it's children are rendered.
	 */
	isRendered:false,

	/**
	 * Array of unrendered children
	 * @property array unReneredChildren
	 */
	unRenderedChildren:[],

	/**
	 * Draw a frame around the component. This is done by assigning the container to css class
	 * ludo-container-frame and body element to ludo-body-frame. You can also customize layout
	 * by specifying css and|or containerCss
	 * @config frame
	 * @type {Boolean}
	 * @default false
	 */
	frame:false,

	/**
	 Form object, used for form submission. Example

	 @config form
	 @type Object
	 @default undefined
	 @example
	 form : {
            url: 'my-submit-url.php',
            method:'post',
            name : 'myForm'
        }
	 */
	form:undefined,

	/**
	 Layout config object
	 @property layout
	 @type {Object|String}
	 @default undefined
	 @example
	 layout:{
	 		type:'linear',
	 		orientation:'horizontal'
	 	}
	 or shortcut :
	 @example
	 layout:"cols"
	 which is the same as linear horizontal

	 Layout types:
	 linear, fill, grid, tab, popup

	 */
	layout:undefined,


	/**
	 Template for JSON compiler.
	 Curly braces {} are used to specify keys in the JSON object. The compiler will replace {key} with JSON.key<br>
	 The compiled string will be inserted as html of the body element.<br>
	 The template will be compiled automatically when you're loading JSON remotely. If JSON is an array of object, the template will be applied to each object, example:
	 JSON : [ { firstname : 'Jane', lastname : 'Doe' }, { firstname : 'John', lastname: 'Doe' }] <br>
	 tpl : '&lt;div>{lastname}, {firstname}&lt;/div><br>
	 will produce this result:<br><br>
	 &lt;div>Doe, Jane&lt;/div>&lt;div>Doe, John&lt;/div>
	 @property tpl
	 @type String
	 @default '' (empty string)
	 @example
	 tpl:'Firstname: {firstname}, lastname:{lastname}'
	 */
	tpl:'',
	/**
	 * Default config for ludo.tpl.Parser. ludo.tpl.Parser is a JSON compiler which
	 * converts given tpl into a string. If you want to create your own
	 * parser, extend ludo.tpl.Parser and change value of tplParserConfig to the name
	 * of your class
	 * @config object tplParserConfig
	 * @default { type: 'tpl.Parser' }
	 */
	tplParserConfig:{ type:'tpl.Parser' },
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
	 * @method getClassChildren
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
	},

	/**
	 * First life cycle step when creating and object
	 * @method ludoConfig
	 * @param {Object} config
	 */
	ludoConfig:function (config) {
		this.parent(config);
		config.els = config.els || {};
		if (this.parentComponent)config.renderTo = undefined;
		var keys = ['css', 'contextMenu', 'renderTo', 'tpl', 'containerCss', 'socket', 'form', 'title', 'html', 'hidden',
			'dataSource', 'movable', 'resizable', 'closable', 'minimizable', 'alwaysInFront',
			'parentComponent', 'cls', 'bodyCls', 'objMovable', 'width', 'height', 'frame', 'formConfig',
			'overflow'];

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
	 @method ludoDOM
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
	 @method ludoEvents
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
	 * The final life cycle method. When this method is executed, the componenent (including child components)
	 * are fully rendered.
	 * @method ludoRendered
	 */
	ludoRendered:function () {
		if (!this.layout.height && !this.layout.above && !this.layout.sameHeightAs && !this.layout.alignWith) {
			this.autoSetHeight();
		}
		if (!this.parentComponent) {
			this.getLayout().createRenderer();
		}
		/**
		 * Event fired when component has been rendered
		 * @event render
		 * @param Component this
		 */
		this.fireEvent('render', this);
		this.isRendered = true;
		if (this.form) {
			this.getForm();
		}


	},

	/**
	 * Insert JSON into components body
	 * Body of Component will be updated with compiled JSON from ludo.tpl.Parser.
	 * This method will be called automatically when you're using a JSON data-source
	 * @method insertJSON
	 * @param {Object} data
	 * @return void
	 */
	insertJSON:function (data) {
		if (this.tpl) {
			this.getBody().html(this.getTplParser().asString(data, this.tpl));
		}
	},

	getTplParser:function () {
		if (!this.tplParser) {
			this.tplParser = this.createDependency('tplParser', this.tplParserConfig);
		}
		return this.tplParser;
	},

	autoSetHeight:function () {
		var size = this.getBody().outerHeight(true);
		this.layout.height = size + ludo.dom.getMBPH(this.getEl());
	},

	/**
	 * Set HTML
	 * @method html
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
	 * @method load
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
	 * @method getParent
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
	 * Return reference to components DOM container. A component consists of one container and inside it a
	 * DOM "body" element
	 * @method getEl()
	 * @return {Object} DOMElement
	 */
	getEl:function () {
		return this.els.container ? this.els.container : null;
	},
	/**
	 * Return reference to the "body" DOM element. A component consists of one container and inside it a
	 * DOM "body" element
	 * @method getBody()
	 * @return {Object} DOMElement
	 */
	getBody:function () {
		return this.els.body;
	},
	/**
	 * Hide this component
	 * @method hide
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
	 * @method hideAfterDelay
	 * @param {number} seconds
	 * @default 1
	 */
	hideAfterDelay:function (seconds) {
		this.hide.delay((seconds || 1) * 1000, this);
	},
	/**
	 * Is this component hidden?
	 * @method isHidden
	 * @return {Boolean}
	 */
	isHidden:function () {
		return this.hidden;
	},

	/**
	 * Return true if this component is visible
	 * @method isVisible
	 * @return {Boolean}
	 *
	 */
	isVisible:function () {
		return !this.hidden;
	},

	/**
	 * Show this component.
	 * @method show
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
	 * @method showChild
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
	 * Return Array reference to direct direct child components.
	 * @method getChildren
	 * @return Array of Child components
	 */
	getChildren:function () {
		return this.children;
	},
	/**
	 * Return array of all child components, including grand children
	 * @method getAllChildren
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
	 * @method hasChildren
	 * @return {Boolean}
	 */
	hasChildren:function () {
		return this.children.length > 0;
	},

	/**
	 * Set new title
	 * @method setTitle
	 * @param {String} title
	 */
	setTitle:function (title) {
		this.title = title;
	},

	/**
	 * Returns total width of component including padding, borders and margins
	 * @method getWidth
	 * @return {Number} width
	 */
	getWidth:function () {
		return this.layout.pixelWidth ? this.layout.pixelWidth : this.layout.width;
	},

	/**
	 * Get current height of component
	 * @method getHeight
	 * @return {Number}
	 */
	getHeight:function () {
		return this.layout.pixelHeight ? this.layout.pixelHeight : this.layout.height;
	},

	/**
	 Resize Component and it's children. Example:
	 @method resize
	 @param {Object} config
	 @example
	 component.resize(
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
	 * @method isCollapsible
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
	 * @method addChildren
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
	 * @method addChild
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
	 * Get child by name or id
	 * @method getChild
	 * @param {String} childName
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
	 * @method disposeAllChildren
	 * @return void
	 */
	disposeAllChildren:function () {
		for (var i = this.children.length - 1; i >= 0; i--) {
			this.children[i].dispose();
		}
	},
	/**
	 * Hide and dispose view
	 * @method dispose
	 * @return void
	 */
	dispose:function () {

        this.fireEvent('dispose', this);
        ludo.util.dispose(this);
	},
	/**
	 * Returns title of Component.
	 * @method getTitle
	 * @return string
	 */
	getTitle:function () {
		return this.title;
	},

	dataSourceObj:undefined,
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
     Returns {{#crossLink "form.Manager"}}{{/crossLink}} for this view.  The form manager
     gives you access to form methods like save, deleteRecord, reset etc
     @method getForm     *
     @return {form.Manager}
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

	/**
	 * Return socket for NodeJS communication
	 * @method getSocket
	 * @return {socket.Socket} socket
	 */
	getSocket:function () {
		return this.socket;
	},

	canvas:undefined,
	/**
	 Returns drawable Canvas/SVG
	 @method getCanvas
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
	    // Creating style sheet
	    var paint = new ludo.canvas.Paint({
		   css:{
			   'fill':'#FFFFFF',
			   'stroke':'#DEF',
			   'stroke-width':'5'
		   }
	   });
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