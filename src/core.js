/**
 * Base class for components and views in ludoJS. This class extends
 * Mootools Events class.
 * @class Core
 */
ludo.Core = new Class({
	Extends:Events,
	id:undefined,
	/**
	 * NB. The config properties listed below are sent to the constructor when creating the component
	 * @attribute name
	 * @type string
	 * When creating children dynamically using config objects(see children) below, you can access a child
	 * by component.child[name] if a name is passed in the config object.
	 */
	name:undefined,

	module:undefined,
	submodule:undefined,
	/**
	 Reference to a specific controller for the component.
	 The default way is to set useController to true and create a controller in
	 the same namespace as your component. Then that controller will be registered as controller
	 for the component.
	 The 'controller' property can be used to override this and assign a specific controller

	 If you create your own controller by extending ludo.controller.Controller,
	 you can control several views by adding events in the addView(component) method.

	 @attribute {Object} controller
	 @example
	 	controller : 'idOfController'
	 @example
	 	controller : { type : 'controller.MyController' }
	 A Controller can also be a singleton.

	 */
	controller:undefined,

	/**
	 * Find controller and register this component to controller
	 * @attribute {Boolean} userController
	 * @default false
	 */
	useController:false,

	/**
	 * Save states from session to session. This can be set to true
	 * for components and views where statefulProperties is defined. The component
	 * also needs an "id".
	 * @attribute stateful
	 * @type {Boolean}
	 * @default false
	 */
	stateful:false,

	/**
	 * Array of stateful properties. These properties will be saved to
	 * local storage when "change" event is fired by the component
	 * @property statefulProperties
	 * @type Array
	 * @default undefined
	 */
	statefulProperties:undefined,

	initialize:function (config) {
		config = config || {};
		this.lifeCycle(config);
	},

	lifeCycle:function(config){
		this.ludoConfig(config);
		this.ludoEvents();
	},

	ludoConfig:function(config){
		if (config.url !== undefined)this.url = config.url;
		if (config.name !== undefined)this.name = config.name;
		if (config.listeners !== undefined)this.addEvents(config.listeners);
		if (config.controller !== undefined)this.controller = config.controller;
		if (this.controller !== undefined)ludo.controllerManager.assignSpecificControllerFor(this.controller, this);
		if (config.module !== undefined)this.module = config.module;
		if (config.submodule !== undefined)this.submodule = config.submodule;
		if (config.useController !== undefined)this.useController = config.useController;
		if (config.stateful !== undefined)this.stateful = config.stateful;
		if (this.module || this.useController)ludo.controllerManager.registerComponent(this);
		this.id = config.id || this.id;

		if (this.stateful && this.statefulProperties !== undefined && this.id) {
			config = this.appendPropertiesFromStore(config);
			this.addEvent('state', this.saveStatefulProperties.bind(this));
		}
		if(!this.id)this.id = 'ludo-' + String.uniqueID();
		ludo.CmpMgr.registerComponent(this);
	},

	ludoEvents:function(){

	},

	appendPropertiesFromStore:function (config) {
		var c = ludo.getLocalStorage().get(this.getKeyForLocalStore());
		if (c !== undefined) {
			var keys = this.statefulProperties;
			for (var i = 0; i < keys.length; i++) {
				config[keys[i]] = c[keys[i]];
			}
		}
		return config;
	},

	saveStatefulProperties:function () {
		var obj = {};
		var keys = this.statefulProperties;
		for (var i = 0; i < keys.length; i++) {
			obj[keys[i]] = this[keys[i]];
		}
		ludo.getLocalStorage().save(this.getKeyForLocalStore(), obj);
	},

	getKeyForLocalStore:function () {
		return 'state_' + this.id;
	},

	/**
	 Return id of component
	 @method getId
	 @return String id
	 */
	getId:function () {
		return this.id;
	},
	/**
	 Get name of component and form element
	 @method getName
	 @return String name
	 */
	getName:function () {
		return this.name;
	},

	/**
	 * Get url for component
	 * @method getUrl
	 * @return string url
	 */
	getUrl:function () {
		if (this.url) {
			return this.url;
		}
		if (this.component) {
			return this.component.getUrl();
		}
		if (this.applyTo) {
			return this.applyTo.getUrl();
		}
		if (this.parentComponent) {
			return this.parentComponent.getUrl();
		}
		if (window.LUDO_APP_CONFIG && LUDO_APP_CONFIG.url) {
			return LUDO_APP_CONFIG.url;
		}
		return undefined;
	},

	isArray:function (obj) {
		return typeof(obj) == 'object' && (obj instanceof Array);
	},

	isObject:function (obj) {
		return typeof(obj) == 'object';
	},

	getEventEl:function () {
		if (Browser.ie) {
			return document.id(document.documentElement);
		}
		return document.id(window);
	},

	/**
	 * Send a JSON request
	 @method JSONRequest
	 @param {String} requestId
	 @param {Object} config
	 @return void
	 */
	JSONRequest:function (requestId, config) {
		var proxy;
		var url = config.url || this.getUrl();
		if (proxy = ludo.remote.getProxy(url)) {
			proxy.addRequest(requestId, config);
			return;
		}
		var request = this.getRequestConfig(requestId, config);
		if(request.url){
			var req = new Request.JSON(request);
			req.send();
		}
	},
	Request:function (requestId, config) {
		var req = new Request(this.getRequestConfig(requestId, config));
		req.send();
	},
	getRequestConfig:function (requestId, config) {
		config.data = config.data || {};
		config.data.requestId = requestId;
		return {
			url:config.url || this.getUrl(),
			method:'post',
			noCache:!this.isCacheEnabled(),
			data:config.data,
			evalScripts:true,
			onSuccess:config.onSuccess.bind(this)
		};
	},

	isCacheEnabled:function () {
		return false
	},

	shouldUseTouchEvents:function () {
		return ludo.util.isTabletOrMobile();
	},

	log:function (txt) {
		if (window.console && console.log && !Browser.ie) {
			console.log(txt);
		}
	},

	getDragStartEvent:function () {
		if (ludo.util.isTabletOrMobile()) {
			return 'touchstart';
		}
		return 'mousedown';
	},

	getDragMoveEvent:function () {
		if (ludo.util.isTabletOrMobile()) {
			return 'touchmove';
		}
		return 'mousemove';
	},

	getDragEndEvent:function () {
		if (ludo.util.isTabletOrMobile()) {
			return 'touchend';
		}
		return 'mouseup';
	},

	isConfigObject:function (obj) {
		return obj.initialize === undefined;
	},

	ns:undefined,

	/**
	 * Returns component type minus class name, example:
	 * type: calendar.View will return "calendar"
	 * @method getNamespace
	 * @return {String} namespace
	 */
	getNamespace:function () {
		if (this.NS == undefined) {
			if (this.type) {
				var tokens = this.type.split(/\./g);
				tokens.pop();
				this.NS = tokens.join('.');
			} else {
				this.NS = '';
			}
		}
		return this.NS;
	},

	hasController:function () {
		return this.controller ? true : false;
	},

	getController:function () {
		return this.controller;
	},

	setController:function (controller) {
		this.controller = controller;
		this.addControllerEvents();
	},

	/**
	 Add events to controller
	 @method addControllerEvents
	 @return void
	 @example
	 this.controller.addEvent('eventname', this.methodName.bind(this));
	 */
	addControllerEvents:function () {

	},

	getModule:function () {
		return this.getInheritedProperty('module');
	},
	getSubModule:function () {
		return this.getInheritedProperty('submodule');
	},

	getInheritedProperty:function (key) {
		if (this[key] !== undefined)return this[key];
		if (this.parentComponent) {
			return this.parentComponent.getInheritedProperty(key);
		}
		return undefined;
	},

	/**
	 Save state for stateful components and views. States are stored in localStorage which
	 is supported by all major browsers(IE from version 8).
	 @method saveState
	 @return void
	 @example
	 	myComponent.saveState();
	 OR
	 @example
	 	this.fireEvent('state');
	 which does the same.
	 */
	saveState:function () {
		this.fireEvent('state');
	}
});