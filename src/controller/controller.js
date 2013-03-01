/**
 * Base class for controllers
 *
 * A controller is by default controller for all components in the same namespace where
 * the useController attribute is set to true. (namespace is
 * determined by component's "type" attribute)
 *
 * You can use the "applyTo" attribute to override this default  applyTo is
 * an array referring to the "module" and "submodule" property of components.
 *
 * example:
 * @example
 *  applyTo:["login", "register"]
 *
 * will set the controller as controller for all components in modules "login" and "register"
 *
 * When creating a new controller, you should extend this class and
 * implement an addView method which takes component as only argument
 * Example:
 *
 * @example
 *  addView:function(view){
 *      view.addEvent('someEvent', this.methodName.bind(this));
 *  }
 *
 * This methods add events to the component.
 *
 * To let the component listen to controller events, implement the addController method
 * for the component(it's defined in ludo.Core)
 *
 * @namespace controller
 * @class controller.Controller
 * @extends Core
 */

ludo.controller.Controller = new Class({
	Extends:ludo.Core,
	type:'controller.Controller',
	/**
	 * Apply controller to components in these modules.
	 * By default a controller will be set as controller for all component
	 * within the same namespace (name space is determined by parsing "type" attribute),
	 * Example:
	 *
	 * You have created a Image Crop module within ludo.app.crop. You have these components there
	 *
	 * ludo.crop.GUI ( View component with type set to "crop.GUI")
	 * ludo.crop.Coordinates (View component with type set to "crop.Coordinates")
	 * ludo.crop.Controller (Controller with type set to "crop.Controller")
	 *
	 * The controller will in this example be set as controller for all components within
	 * the "ludo.crop" namespace.
	 *
	 * (if useController for the component is set to true)
	 * This property is used to override the default
	 * @property applyTo
	 * @type Array
	 * @default undefined
	 */
	applyTo:undefined,
	id:undefined,
	components:[],
	controller:undefined,
	useController:false,

	/**
	 List of events which will be automatically broadcasted,i.e. re-fired by the controller

	 @property broadcast
	 @type Object
	 @example
	 	broadcast:{
			'ns.Component' : ['eventOne',{'viewEventName':'controllerEventName}],
			'ns.ComponentTwo' : ['send','receive']
		}
	 In this example, the controller will listen to "eventOne" and "viewEventName"  of view of "type"
	 ns.Component and re-fire them so that other views can listen to them. The "viewEventName" will
	 be re-fired as a "controllerEventName".
	 */
	broadcast:undefined,

	ludoConfig:function (config) {
		config = config || {};
        config.controller = undefined;
        config.useController = false;

		this.parent(config);
		if (config.broadcast !== undefined)this.broadcast = config.broadcast;
		ludo.controllerManager.registerController(this);
		if (this['addView'] == undefined) {
			alert('You need to implement an addView method for the controller (' + this.type + ')');
		}
	},

	addBroadcastFor:function (component) {
		if (this.broadcast && this.broadcast[component.type] !== undefined) {
			var ev = this.broadcast[component.type];
			for (var i = 0; i < ev.length; i++) {
				var eventNames = this.getBroadcastEventNames(ev[i]);
				component.addEvent(eventNames.component, this.getBroadcastFn(eventNames.controller).bind(this));
			}
		}
	},

	getBroadcastFn:function (eventName) {
		return function () {
			this.fireEvent(eventName, arguments);
		}
	},

	getBroadcastEventNames:function (event) {
		if (typeof event == 'object') {
			for (var key in event) {
				if (event.hasOwnProperty(key)) {
					return { component:key, controller:event[key] };
				}
			}
		}
		return { component:event, controller:event };
	},

	shouldBeControllerFor:function (component) {
		if(component === this)return false;
		if (!this.applyTo) {
			return this.isInSameNamespaceAs(component);
		}

		var key = this.getModuleKeyFor(component);
		if (this.isAppliedDirectlyToModule(key)) {
			return true;
		}
		return this.isAppliedIndirectlyToModule(key);
	},

	getModuleKeyFor:function (component) {
		return component.module + (component.submodule ? '.' + component.submodule : '');
	},

	isAppliedDirectlyToModule:function (moduleKey) {
		return (this.applyTo.indexOf(moduleKey) === 0);
	},

	isAppliedIndirectlyToModule:function (moduleKey) {
		for (var i = 0; i < this.applyTo.length; i++) {
			if (moduleKey.indexOf(this.applyTo[i]) === 0) {
				return true;
			}
		}
		return false;
	},

	isInSameNamespaceAs:function (component) {
		return this.getNamespace() == component.getNamespace();
	}
});

ludo.getController = function (controller) {
	if (controller.substr) {
		controller = ludo.get(controller);
	}
	return controller;
};