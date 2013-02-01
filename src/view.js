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
 			this.setHtml('My custom component');
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

	statefulProperties:['width','height'],

	els:{

	},
	state:{},

	/**
	 Array of add-ons config objects
	 Add-ons are special components which operates on a view. When created, config property
	 "view" is sent to constructor of the the plugin.


	 @config addons
	 @type {Array}
	 @example
		 new ludo.View({<br>
		   plugins : [ { type : 'plugins.Sound' }]
	  	 });
	 and inside ludo.plugins.Sound:
	 1) Create reference to view in constructor
	 @example
	 	  initialize:function(config){
         ...
         this.view = config.view;
         ...
      }

	 2) Add event
	 	this.view.addEvent('someEvent', this.playSound.bind(this));
	 Which will cause the plugin to play a sound when "someEvent" is fired by the view.
	 */
	addons:[],

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
	 * width of component
	 * @config width
	 * @type : int
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
	html:'',

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
	 * When a model is specified, the submit() method will submit the model to the server
	 * Updates made to the model will also be reflected to form elements inside this component where
	 * modelKey is set to a column of the model
	 * @config {Object} model - object of type ludo.model.Model
	 * @default undefined
	 */
	model:undefined,

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
	 * Message to display while getting content from server
	 * @config onLoadMessage
	 * @type String
	 * @default 'Loading content...'
	 */
	onLoadMessage:'Loading content...',

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
	 Create copies of events, example:
	 This will fire a "send" event for every "click" event.

	 @config copyEvents
	 @type Object
	 @default undefined
	 @example
	 	copyEvents:{
           'click' : 'send'
        }
	 */
	copyEvents:undefined,
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

	formManager:undefined,

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
	 	linear, fill, grid, tab

	 */
	layout:undefined,

	/**
	 Template for JSON compiler.
	 Curly braces {} are used to specify keys in the JSON object. The compiler will replace {key} with JSON.key<br>
	 The compiled string will be inserted as html of the body element.<br>
	 The template will be compiled automatically when you're loading JSON remotely, and when you're using a
	 ludo.model.Model. If JSON is an array of object, the template will be applied to each object, example:
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
	layoutManager:null,
	initialItemCount:0,
	initialItemsObject:[],
	contextMenu:undefined,
	lifeCycleComplete:false,

	lifeCycle:function (config) {
		if (this.children && !config.children) {
			config.children = this.children;
			this.children = [];
		}
		this._createDOM();

		this.ludoConfig(config);

		if (this.hidden) {
			this.unRenderedChildren = config.children;
		} else {
			this.remainingLifeCycle(config);
		}
	},

	remainingLifeCycle:function (config) {
		if(this.lifeCycleComplete)return;
		if (!config && this.unRenderedChildren) {
			config = { children:this.unRenderedChildren };
		}

		this.lifeCycleComplete = true;
		this._styleDOM();
		this.increaseZIndex();

		if (config.children) {
			for (var i = 0; i < config.children.length; i++) {
				config.children[i].id = config.children[i].id || 'ludo-' + String.uniqueID();
			}
			this.initialItemsObject = config.children;
			this.initialItemCount = config.children.length;
			this.addChildren(config.children);
		}
		this.ludoDOM();
		this.ludoCSS();
		this.ludoEvents();

		if (this.layout && this.layout.type && this.layout.type == 'tabs') {
			this.getLayoutManager().prepareView();
		}

		this.addCoreEvents();
		this.ludoRendered();

		if (!this.parentComponent) {
			ludo.dom.clearCache();
			ludo.dom.clearCache.delay(50, this);
			this.resize({ width:this.width, height:this.height });
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

		if (config.renderTo !== undefined)config.els.parent = config.renderTo;
		if (config.tpl !== undefined)this.tpl = config.tpl;
		this.css = config.css || this.css;

		this.contextMenu = config.contextMenu || this.contextMenu;

		if (config.css !== undefined)this.css = config.css;
		if (config.containerCss !== undefined)this.containerCss = config.containerCss;
		if (config.form !== undefined)this.form = config.form;
		if (config.socket !== undefined)this.socket = config.socket;
		if (this.socket !== undefined) {
			if (this.socket.type === undefined)this.socket.type = 'socket.Socket';
			this.socket.component = this;
			this.socket = ludo._new(this.socket);
		}
		if (config.addons !== undefined)this.addons = config.addons;
		if (config.title !== undefined)this.title = config.title;
		if (config.html !== undefined)this.html = config.html;
		if (config.hidden !== undefined)this.hidden = config.hidden;
		if (config.els.parent && !this.parentComponent)this.els.parent = document.id(config.els.parent);
		this.overflow = config.overflow || this.overflow;
		this.layout = ludo.layoutFactory.getValidLayoutObject(this, config);

		if (config.copyEvents !== undefined)this.copyEvents = config.copyEvents;
		if (this.copyEvents !== undefined) {
			this.copyEvents = Object.clone(this.copyEvents);
			this.createEventCopies();
		}
		if (config.dataSource !== undefined)this.dataSource = config.dataSource;
		if (config.onLoadMessage !== undefined)this.onLoadMessage = config.onLoadMessage;
		if (config.movable !== undefined)this.movable = config.movable;
		if (config.resizable !== undefined)this.resizable = config.resizable;
		if (config.closable !== undefined)this.closable = config.closable;
		if (config.minimizable !== undefined)this.minimizable = config.minimizable;
		if (config.alwaysInFront !== undefined)this.alwaysInFront = config.alwaysInFront;
		if (config.parentComponent)this.parentComponent = config.parentComponent;
		if (config.cls)this.cls = config.cls;
		if (config.objMovable)this.objMovable = config.objMovable;
		if (config.width !== undefined) this.width = config.width;
		if (config.height !== undefined)this.height = config.height;

		if (config.model !== undefined)this.model = config.model;
		this.frame = config.frame || this.frame;
		if (config.formConfig !== undefined)this.formConfig = config.formConfig;

		if (this.layout && this.layout.aspectRatio) {
			if (this.width) {
				this.height = Math.round(this.width / this.layout.aspectRatio);
			} else if (this.height) {
				this.width = Math.round(this.height * this.layout.aspectRatio);
			}
		}
		this.insertDOMContainer();
	},

	insertDOMContainer:function () {
		if (this.hidden) {
			this.els.container.style.display = 'none';
		}
		if (this.els.parent) {
			this.els.parent.adopt(this.els.container);
		}
	},

	/**
	  The second life cycle method
	  This method is typically used when you want to create your own DOM elements.
	 @method ludoDOM
	 @example
		 ludoDOM : function() {<br>
			 this.parent(); // Always call parent ludoDOM
			 var myEl = new Element('div');
			 myEl.set('html', 'My Content');
			 this.getEl().adopt(myEl);
		 }
	 */
	ludoDOM:function () {
		if (this.contextMenu) {
			if (!this.isArray(this.contextMenu)) {
				this.contextMenu = [this.contextMenu];
			}
			for (var i = 0; i < this.contextMenu.length; i++) {
				this.contextMenu[i].component = this;
				var cm = new ludo.menu.Context(this.contextMenu[i]);
				var el = this.isFormElement() ? this.getFormEl() : this.getEl();
				el.addEvent('contextmenu', cm.show.bind(cm));
			}
			this.contextMenu = undefined;
		}

		if (this.cls) {
			if (!instanceOf(this.cls, Array)) {
				this.cls = [this.cls];
			}
			for (var j = 0; j < this.cls.length; j++) {
				ludo.dom.addClass(this.getEl(), this.cls[j]);
			}
		}

		if (this.type) {
			ludo.dom.addClass(this.getEl(), 'ludo-' + (this.type.replace(/\./g, '-').toLowerCase()));
		}

		if (this.css)this.getBody().setStyles(this.css);
		if (this.containerCss)this.getEl().setStyles(this.containerCss);

		if (this.frame) {
			ludo.dom.addClass(this.getEl(), 'ludo-container-frame');
			ludo.dom.addClass(this.getBody(), 'ludo-body-frame');
		}

		if (this.cssSignature !== undefined)ludo.dom.addClass(this.getEl(), this.cssSignature);
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
			if(this.onLoadMessage){
				new ludo.view.Loader({
					view: this,
					txt : this.onLoadMessage
				});
			}
		}

		if (!this.parentComponent && this.els.parent && this.els.parent.tagName.toLowerCase() == 'body') {
			if (!this.isMovable()) {
				document.id(window).addEvent('resize', this.resize.bind(this));
			}
		}
	},

	/**
	 * The final life cycle method. When this method is executed, the componenent (including child components)
	 * are fully rendered.
	 * @method ludoRendered
	 */
	ludoRendered:function () {
		if (!this.height && !this.layout.height) {
			this.autoSetHeight();
		}
		if(!this.parentComponent){
			this.getLayoutManager().createRenderer();
		}
		/**
		 * Event fired when component has been rendered
		 * @event render
		 * @param Component this
		 */
		this.fireEvent('render', this);
		this.isRendered = true;
		if (this.model) {
			this.getFormManager();
		}

		if (this.addons !== undefined) {
			for (var i = 0; i < this.addons.length; i++) {
				var obj = this.addons[i];
				obj.view = this;
				this.addons[i] = ludo._new(obj);
			}
		}
	},

	createEventCopies:function () {
		for (var eventName in this.copyEvents) {
			if (this.copyEvents.hasOwnProperty(eventName)) {
				this.addEvent(eventName, this.getEventCopyFn(this.copyEvents[eventName]));
			}
		}
	},

	getEventCopyFn:function (eventName) {
		return function () {
			var args = Array.prototype.slice.call(arguments);
			this.fireEvent.call(this, eventName, args);
		}.bind(this)
	},

	receiveJSON:function (json) {
		this.data = json.data;
		this.insertJSON(json);
	},

	/**
	 * Insert JSON into components body
	 * Body of Component will be updated with compiled JSON from ludo.tpl.Parser.
	 * This method will be called automatically when you're using a ludo.model.Model or a
	 * JSON data-source
	 * @method insertJSON
	 * @param {Object} json
	 * @return void
	 */
	insertJSON:function (json) {
		if (this.tpl) {
			this.getBody().set('html', this.getTplParser().getCompiled(json, this.tpl));
		}
	},

	getTplParser:function () {
		if (!this.tplParser) {
			var config = this.tplParserConfig;
			this.tplParser = ludo._new(config);
		}
		return this.tplParser;
	},

	autoSetHeight:function () {
		var size = this.getBody().measure(function () {
			return this.getSize();
		});
		size.y += ludo.dom.getBH(this.getBody());
		size.y += ludo.dom.getBH(this.getEl());
		this.height = size.y;
	},
	/**
	 * Set HTML of components body element
	 * @method setHtml
	 * @param html
	 * @type string
	 */
	setHtml:function (html) {
		this.getBody().set('html', html);
	},

	setContent:function () {
		if (this.html) {
			if(this.children.length){
				var html = document.createElement('div');
				html.innerHTML = this.html;
				this.getBody().adopt(html);
			}else{
				this.getBody().innerHTML = this.html;
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

	/**
	 * Return reference to parent DOM element for this component
	 * @method getParentEl
	 * @return DOMElement el
	 */
	getParentEl:function () {
		if (this.parentComponent) {
			return this.parentComponent.getBody();
		}
		return this.els.parent;
	},

	_createDOM:function () {
		this.els.container = new Element('div');
		this.els.body = new Element(this.tagBody);
		this.els.container.adopt(this.els.body);
	},

	_styleDOM:function () {
		ludo.dom.addClass(this.els.container, 'ludo-view-container');
		ludo.dom.addClass(this.els.body, 'ludo-body');

		this.els.container.id = this.getId();

		if (this.cls) {
			ludo.dom.addClass(this.els.container, this.cls);
		}
		this.els.body.style.height = '100%';
		if (this.overflow == 'hidden') {
			this.els.body.style.overflow = 'hidden';
		}

		if (ludo.util.isTabletOrMobile()) {
			ludo.dom.addClass(this.els.container, 'ludo-view-container-mobile');
			ludo.dom.addClass(this.els.body, 'ludo-body-mobile');
		}

		this.setContent();
	},

	addCoreEvents:function () {
		var parent = this.getParent();
		if (!parent && this.type !== 'Application') {
			this.getEl().addEvent('mousedown', this.increaseZIndex.bind(this));
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
		this.getEl().style.zIndex = ludo.util.getNewZIndex(this);
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
	 * Hide all child components
	 * @method hideAllChildren
	 * @return void
	 */
	hideAllChildren:function () {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].hide();
		}
	},
	/**
	 * Hide this component
	 * @method hide
	 * @return void
	 */
	hide:function () {
		if (!this.hidden && this.getEl().getStyle('display') !== 'none') {
			this.getEl().style.display='none';
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
		seconds = seconds || 1;
		this.hide.delay(seconds * 1000, this);
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
	 * Show this component.
	 * @method show
	 * @param {Boolean} skipEvents
	 * @return void
	 */
	show:function (skipEvents) {
		if (this.els.container.style.display === 'none') {
			this.els.container.style.display = '';
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
			this.resize({ width:this.width, height:this.height });
		}
	},

	resizeParent:function () {
		var parent = this.getParent();
		if (parent) {
			if(parent.children.length > 0)parent.getLayoutManager().resizeChildren();
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
		for (var i = 0, count = this.children.length; i < count; i++) {
			if (this.children[i].getId() == key || this.children[i].getName() == key) {
				this.children[i].show();
				return true;
			}
		}
		return false;
	},

	/**
	 * Return Array reference to direct direct child components.
	 * @method getChildren
	 * @return Array of Child components
	 */
	getChildren:function () {
		var ret = [];
		for (var i = 0; i < this.children.length; i++) {
			ret.push(this.children[i]);
		}
		return ret;
	},
	/**
	 * Return array of all child components, including childrens children
	 * @method getAllChildren
	 * @return Array of sub components
	 */
	getAllChildren:function () {
		var ret = [];
		for (var i = 0; i < this.children.length; i++) {
			ret.push(this.children[i]);
			if (this.children[i].hasChildren) {
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
	 * Return true if this component is visible
	 * @method isVisible
	 * @return {Boolean}
	 *
	 */
	isVisible:function () {
		return !this.hidden;
	},

	/**
	 * Set new title
	 * @method setTitle
	 * @param {String} title
	 */
	setTitle:function (title) {
		this.title = title;
	},

	setWidth:function (width) {
		this.width = width;
	},

	setHeight:function (height) {
		this.height = height;
	},

	/**
	 * Returns total width of component including padding, borders and margins
	 * @method getWidth
	 * @return {Number} width
	 */
	getWidth:function () {
		return this.width;
	},
	/**
	 * Get current height of component
	 * @method getHeight
	 * @return {Number}
	 */
	getHeight:function () {
		return this.height;
	},

	/**
	 * Return component type, example "Component", "Window" or "form.Text"
	 * @method getType
	 * @return string
	 */
	getType:function () {
		return this.type;
	},

	getLayout:function () {
		return this.layout;
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
			if (this.layout && this.layout.preserveAspectRatio && this.width && !this.isMinimized()) {
				var ratio = this.layout.aspectRatio;
				if (ratio) {
					config.height = config.width / ratio;
				}
			}
			if (!this.state.isCollapsed) {
				this.width = config.width;
			}
			var width = config.width - ludo.dom.getBW(this.els.container) - ludo.dom.getPW(this.els.container) - ludo.dom.getMW(this.els.container);
			if (width > 0) {
				this.els.container.style.width = width + 'px';
			}
		}

		if (config.height) {
			if (!this.state.isCollapsed && !this.state.isMinimized) {
				this.height = config.height;
			}
			var height = config.height - ludo.dom.getMBPH(this.els.container);
			if (height > 0) {
				this.els.container.style.height = height + 'px';
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
		if(this.children.length > 0)this.getLayoutManager().resizeChildren();
	},
	/**
	 * Returns true component is collapsible
	 * @method isCollapsible
	 * @return {Boolean}
	 */
	isCollapsible:function () {
		return this.layout && this.layout.collapsible ? true : false;
	},

	setPosition:function (config) {
		if (config.left !== undefined && config.left >= 0) {
			this.getEl().setStyle('left', config.left);
		}
		if (config.top !== undefined && config.top >= 0) {
			this.getEl().setStyle('top', config.top);
		}
	},

	getLayoutManager:function () {
		if (!this.layoutManager) {
			this.layoutManager = ludo.layoutFactory.getManager(this);
		}
		return this.layoutManager;
	},

	resizeChildren:function () {
		if(this.children.length > 0)this.getLayoutManager().resizeChildren();
	},

	isMinimized:function () {
		return false;
	},

	cachedInnerHeight:undefined,
	resizeDOM:function () {
		if (this.height <= 0) {
			return;
		}
		var height;
		if (this.height) {
			height = this.height - ludo.dom.getMBPH(this.els.container);
		} else {
			height = this.els.container.style.height.replace('px', '');
		}
		height -= ludo.dom.getMBPH(this.els.body);
		if (height <= 0 || isNaN(height)) {
			return;
		}
		this.els.body.style.height = height + 'px';
		this.cachedInnerHeight = height;
	},

	getInnerHeightOfBody:function () {
		if (this.cachedInnerHeight) {
			return this.cachedInnerHeight;
		}
		return ludo.dom.getInnerHeightOf(this.els.body);
	},

	getInnerWidthOfBody:function () {
		if (this.width) {
			var c = this.els.container;
			var e = this.els.body;
			return this.getWidth() - ludo.dom.getMBPW(c) - ludo.dom.getMBPW(e);
		}
		return ludo.dom.getInnerWidthOf(this.els.body);
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
	 * @param {Object} child. A Child object can be a component or a JSON object describing the component.
	 * @return component child
	 */
	addChild:function (child, insertAt, pos) {
		child = this.getLayoutManager().addChild(child, insertAt, pos);
		if (child.name) {
			this.child[child.name] = child;
		}
		child.addEvent('dispose', this.removeChild);
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
	disposeCanceled:false,
	/**
	 Cancel dispose of view. A good example of where this is useful is in
	 a tab layout where the 'x' icons might dispose children. If you want to
	 have some validation before view is disposed, you can add event to beforeDispose
	 and call view.cancelDispose in case you don't want to dispose the view.
	 @method cancelDispose
	 @example
	 	function confirmDispose(view){
	 		if(!confirm('Are you sure')){
	 			view.cancelDispose();
	 		}
	 	}
	 	view.addEvent('beforeDispose', confirmDispose);
	 */
	cancelDispose:function(){
		this.disposeCanceled = true;
	},
	/**
	 * Hide and destroy component
	 * @method dispose
	 * @return void
	 */
	dispose:function () {
		this.disposeCanceled = false;
		this.fireEvent('beforeDispose', this);
		if(!this.disposeCanceled){
			if (this.getParent()) {
				this.getParent().removeChild(this);
			}
			var initialItemCount = this.children.length;
			for (var i = initialItemCount - 1; i >= 0; i--) {
				this.children[i].dispose();
			}
			for (var name in this.els) {
				if (this.els.hasOwnProperty(name)) {
					if (this.els[name] && this.els[name].tagName && name != 'parent') {
						this.els[name].dispose();
					}
				}
			}
			this.getEl().dispose();
			this.fireEvent('dispose', this);
			ludo.CmpMgr.deleteComponent(this);
			if(this.layoutManager)delete this.layoutManager;
			delete this.els;
			delete this;
		}
	},
	/**
	 * Returns title of Component.
	 * @method getTitle
	 * @return string
	 */
	getTitle:function () {
		return this.title;
	},

	getHtmlText:function () {
		return this.html;
	},

	clearDomElements:function (cls) {
		var els = this.els.body.getElements(cls);
		for (var i = els.length - 1; i >= 0; i--) {
			els[i].dispose();
		}
	},

	dataSourceObj:undefined,
	getDataSource:function () {
		if (!this.dataSourceObj && this.dataSource) {
			var obj;
			if (ludo.util.isString(this.dataSource)) {
				obj = this.dataSourceObj = ludo.get(this.dataSource);
			} else {
				if (!this.dataSource.type) {
					this.dataSource.type = 'dataSource.JSON';
				}
				obj = this.dataSourceObj = ludo._new(this.dataSource);
			}

			switch (obj.getSourceType()) {
				case 'HTML':
					if (obj.hasData()) {
						this.setHtml(obj.getData());
					}
					obj.addEvent('load', this.setHtml.bind(this));
					break;
				case 'JSON':
					if (obj.hasData()) {
						this.insertJSON(obj.getData());
					}
					obj.addEvent('load', this.insertJSON.bind(this));
					break;
			}
		}
		return this.dataSourceObj;
	},

	getFormManager:function () {
		if (!this.formManager) {
			this.formManager = new ludo.form.Manager({
				component:this,
				form:this.form,
				model:this.model
			});
		}
		return this.formManager;
	},

	hasFormManager:function () {
		return this.formManager !== undefined;
	},

	getParentFormManager:function () {
		var parent = this.getParent();
		while (parent) {
			if (parent.formManager !== undefined)return parent.formManager;
			parent = parent.getParent();
		}
		return undefined;
	},

	getIndexOf:function (child) {
		return this.children.indexOf(child);
	},

	getTotalHeightOfTitleAndStatusBar:function () {
		return 0;
	},

	isFormElement:function () {
		return false;
	},
	/**
	 * Return values of all child form components, including childrens children.
	 * @method getValues
	 * @return Array of Objects, example: [ {name:value},{name:value}]
	 */
	getValues:function () {
		return this.getFormManager().getValues();
	},
	/**
	 * Returns true if all form components inside this component are valid(including childrens children)
	 * @method isFormValid
	 * @return {Boolean} valid
	 */
	isFormValid:function () {
		return this.getFormManager().isValid();
	},
	/**
	 Submit form to server. This method will call the submit method of ludo.form.Manager.
	 It will send data to the server in this format:
	 A submission will on success commit all form elements, i.e. set the dirty flag to
	 false by updating initialValue to current value.
	 On success, a "submit" event will be fired with server response as first argument
	 and component as second argument.

	 On failure a "submitfail" event will be fired with the same arguments as for "submit"

	 @method submit
	 @return void
	 @example
	 	{
			 saveForm: 1,
			 componentId : id of ludo.View,
			 componentName : name of ludo.View,
			 data : {
				 firstname : 'John',
				 lastname : 'Doe'
				 formField : 'formValue
			 }
		 }
	 */
	submit:function () {
		this.fireEvent('submit', this);
		this.getFormManager().submit();
	},
	/**
	 * Reset all form elements of this component(including childrens children) back to it's
	 * initial or commited value
	 * @method reset
	 * @return void
	 */
	reset:function () {
		this.getFormManager().reset();
	},

	/**
	 * Returns reference to ludo.model.Model object
	 * @method getModel
	 * @return {model.Model} model
	 */
	getModel:function () {
		return this.getFormManager().getModel();
	},
	getHeightOfButtonBar:function () {
		return 0;
	},
	/**
	 * Resize component to fit size of only child
	 * @method fitToChild
	 * @return void
	 */
	fitToChild:function (child) {
		var size = child.getEl().getSize();
		var b = this.getBody();
		var c = this.getEl();

		var config = {
			width:size.x + ludo.dom.getMW(child.getEl()) + ludo.dom.getBW(b) + ludo.dom.getPW(b) + ludo.dom.getMW(b) + ludo.dom.getBW(c) + ludo.dom.getPW(c) + ludo.dom.getMW(c),
			height:size.y + ludo.dom.getMH(child.getEl()) + ludo.dom.getBH(b) + ludo.dom.getPH(b) + ludo.dom.getMH(b) + ludo.dom.getBH(c) + ludo.dom.getPH(c) + ludo.dom.getMH(c)
		};
		config.height += this.getTotalHeightOfTitleAndStatusBar();
		this.resize(config);
	},
	getUnRenderedChildren:function () {
		return this.unRenderedChildren;
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
	   canvas.adopt(new ludo.canvas.Node('line', { x1:100, y1:100, x2:200, y2:200, "class":paint }));
	 */
	getCanvas:function(){
		if(this.canvas === undefined){
			this.canvas = new ludo.canvas.Canvas({
				renderTo:this
			});
		}
		return this.canvas;
	}
});

ludo.factory.registerClass('View', ludo.View);