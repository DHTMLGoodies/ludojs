/**
 * Base class for components and views in ludoJS. This class extends
 * Mootools Events class.
 * @namepace ludo
 * @class ludo.Core
 * @param {Object} config
 * @param {String} config.name Name
 * @param {Boolean} config.stateful When set to true, properties set in statefulProperties can be saved to the browsers local storage.
 * @param {Array} config.statefulProperties Array of stateful properties.
 */
ludo.Core = new Class({
	Extends:Events,
	id:undefined,

	name:undefined,

	module:undefined,
	submodule:undefined,
	/*
	 Reference to a specific controller for the component.
	 The default way is to set useController to true and create a controller in
	 the same namespace as your component. Then that controller will be registered as controller
	 for the component.
	 The 'controller' property can be used to override this and assign a specific controller
	 @memberof ludo.Core.prototype

	 If you create your own controller by extending ludo.controller.Controller,
	 you can control several views by adding events in the addView(component) method.

	 attribute {Object} controller
	 example
	 	controller : 'idOfController'
	 example
	 	controller : { type : 'controller.MyController' }
	 A Controller can also be a singleton.

	 */
	controller:undefined,

	/*
	 * Find controller and register this component to controller
	 * attribute {Boolean} userController
	 * default false
	 * @memberof ludo.Core.prototype
	 */
	useController:false,


	stateful:false,


	statefulProperties:undefined,


	dependency:{},

    /*
    TODO figure out this
     Array of add-ons config objects
     Add-ons are special components which operates on a view. "parentComponent" is sent
     to the constructor of all add-ons and can be saved for later reference.

     @config plugins
     @type {Array}
	 @memberof ludo.Core.prototype
     @example
        new ludo.View({<br>
		   plugins : [ { type : 'plugins.Sound' }]
	  	 });

     Add event
     @example
        this.getParent().addEvent('someEvent', this.playSound.bind(this));
     Which will cause the plugin to play a sound when "someEvent" is fired by parent component.
     */
    plugins:undefined,

    
	initialize:function (config) {
		config = config || {};
		this.lifeCycle(config);
        this.applyplugins();
	},

	lifeCycle:function(config){
		this.__construct(config);
		this.ludoEvents();
	},

    applyplugins:function(){
        if (this.plugins) {
			jQuery.each(this.plugins, function(i, plugin){
				this.addPlugin(plugin, i);
			}.bind(this));
        }
    },

	addPlugin:function(plugin, i){
		i = i != undefined ? i : this.plugins.length;
		plugin.parentComponent = this;
		this.plugins[i] = this.createDependency('plugins' + i, plugin);
	},
	
	__construct:function(config){
        this.setConfigParams(config, ['url','name','controller','module','submodule','stateful','id','useController','plugins']);

		// TODO new code 2016 - custom functions
		if(config != undefined){
			for(var key in config){
				if(config.hasOwnProperty(key) && $.type(config[key]) == "function" && this[key] == undefined){
					this[key] = config[key].bind(this);
				}
			}
		}

        if (this.stateful && this.statefulProperties && this.id) {
            config = this.appendPropertiesFromStore(config);
            this.addEvent('state', this.saveStatefulProperties.bind(this));
        }
		if (config.listeners !== undefined)this.addEvents(config.listeners);
		if (this.controller !== undefined)ludo.controllerManager.assignSpecificControllerFor(this.controller, this);
        if (this.module || this.useController)ludo.controllerManager.registerComponent(this);
		if(!this.id)this.id = 'ludo-' + String.uniqueID();
		ludo.CmpMgr.registerComponent(this);
	},

    setConfigParams:function(config, keys){
        for(var i=0;i<keys.length;i++){
            if(config[keys[i]] !== undefined)this[keys[i]] = config[keys[i]];
        }
    },

	ludoEvents:function(){},

	appendPropertiesFromStore:function (config) {
		var c = ludo.getLocalStorage().get(this.getKeyForLocalStore());
		if (c) {
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
	 @function getId
	 @return String id
	 @memberof ludo.Core.prototype
	 */
	getId:function () {
		return this.id;
	},
	/**
	 Get name of component and form element
	 @function getName
	 @return String name
	 @memberof ludo.Core.prototype
	 */
	getName:function () {
		return this.name;
	},

    // TODO refactor this to use only this.url or global url.
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
		return undefined;
	},

	getEventEl:function () {
        return Browser['ie'] ? $(document.documentElement) : $(window);
	},

	isConfigObject:function (obj) {
		return obj.initialize === undefined;
	},

	NS:undefined,

	/**
	 * Returns component type minus class name, example:
	 * type: calendar.View will return "calendar"
	 * @function getNamespace
	 * @return {String} namespace
	 * @memberof ludo.Core.prototype
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
	 @function addControllerEvents
	 @return void
	 @memberof ludo.Core.prototype
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
        return this[key] !== undefined ? this[key] : this.parentComponent ? this.parentComponent.getInheritedProperty(key) : undefined;
	},

	/**
	 Save state for stateful components and views. States are stored in localStorage which
	 is supported by all major browsers(IE from version 8).
	 @function saveState
	 @memberof ludo.Core.prototype
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
	},
	
	createDependency:function(key, config){
		this.dependency[key] = ludo.util.isLudoJSConfig(config) ? ludo._new(config) : config;
		return this.dependency[key];
	},

	hasDependency:function(key){
		return this.dependency[key] ? true : false;
	},

	getDependency:function(key, config){
		if(this.dependency[key])return this.dependency[key];
        return this.createDependency(key, config);
	},

	relayEvents:function(obj, events){
		for(var i=0;i<events.length;i++){
			obj.on(events[i], this.getRelayFn(events[i]).bind(this));
		}
	},

	getRelayFn:function(event){
		return function(){
			this.fireEvent.call(this, event, Array.prototype.slice.call(arguments));
		}.bind(this);
	}
});