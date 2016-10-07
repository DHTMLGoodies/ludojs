TestCase("ControllerTest", {

	setUp:function () {

		if (window.ludo.customNS === undefined) {
			window.ludo.customNS = {};
			window.ludo.customNS2 = {};


			window.ludo.customNS = {};
			window.ludo.customNS2 = {};

			ludo.CustomController = new Class({
				Extends:ludo.controller.Controller,
				type:'customController',
				addView:function () {

				}
			});
		}

		ludo.controllerManager = new ludo.controller.Manager();
		ludo.CmpMgr = new ludo.CmpMgrClass();
	},
	getController:function (forModules, id) {
		forModules = forModules || [];
		var c = new Class({
			Extends:ludo.controller.Controller,
			applyTo:forModules,
			addView:function (component) {

			}
		});
		return new c({
			id:id
		});
	},
	getControllerInNamespace:function (id, config) {
		config = config || {};
		if (!window.ludo.customNS.Controller) {
			window.ludo.customNS.Controller = new Class({
				Extends:ludo.controller.Controller,
				type:'customNS.Controller',
				addView:function () {

				}
			});
		}
		config.id = id;
		return new window.ludo.customNS.Controller(config);
	},
	getComponentInNamespace:function (id, config) {
		config = config || {};
		if (window.ludo.customNS.Component === undefined) {
			window.ludo.customNS.Component = new Class({
				Extends:ludo.View,
				type:'customNS.Component',
				useController:true
			});
		}
		config.id = id;
		return new window.ludo.customNS.Component(config);
	},
	getComponentInDifferentNameSpace:function (id) {
		if (window.ludo.customNS2.Component === undefined) {
			window.ludo.customNS2.Component = new Class({
				Extends:ludo.View,
				type:'customNS2.Component',
				useController:true
			});
		}

		return new window.ludo.customNS2.Component({
			id:id
		});

	},
	createSingletonControllerClass:function (id) {
		if (!ludo.SingletonController) {
			var c = new Class({
				Extends:ludo.controller.Controller,
				id:id,
				type:'SingletonController',
				singleton:true,
				cmp:[],
				addView:function (cmp) {
					this.cmp.push(cmp);
				},
				getComponents:function () {
					return this.cmp;
				}
			});
			ludo.SingletonController = new c({});
		}
	},
	getControllerManager:function () {
		return ludo.controllerManager;
	},
	getComponent:function (module, submodule, config) {
		config = config || {};
		var c = new Class({
			Extends:ludo.View,
			module:module,
			useController:true,
			submodule:submodule
		});
		return new c(config);
	},
	getComponentWithControllerAsClassProperty:function () {
		var c = new Class({
			Extends:ludo.View,
			controller:{
				type:'SingletonController'
			}
		});
		return new c({});

	},
	"test should return correct controller for a component":function () {
		// given
		var controller = this.getController(['module1']);
		var c1 = this.getComponent('module1');

		// when
		var assignedController = ludo.controllerManager.getControllerFor(c1);

		// then
		assertEquals(controller.getId(), assignedController.getId());
		// given
		var c1 = this.getComponent('module1', 'submodule');

		// when
		var assignedController = ludo.controllerManager.getControllerFor(c1);

		// then
		assertEquals(controller.getId(), assignedController.getId());
	},
	"test should assign components to controller created afterwards":function () {
		// given
		var c1 = this.getComponent('module1');
		var controller = this.getController(['module1']);

		// when


		// then
		assertEquals(controller.getId(), c1.getController().getId());

	},
	"test should be able to set controller based on config id":function () {
		// given
		var controller = this.getController(['module1']);
		var controller2 = this.getController(['module1'], 'controller1');

		var c1 = this.getComponent('module1', undefined, { controller:'controller1'});

		// then
		assertEquals(controller2.getId(), c1.getController().getId());
	},
	"test controllers should only register its own applyTo":function () {
		// given
		var controller = this.getController(['module1']);

		// when
		var c1 = this.getComponent('module1');
		var c2 = this.getComponent('module2');

		// then
		assertEquals(controller.getId(), c1.getController().getId());
		assertUndefined(c2.getController());
	},
	"test should be able to separate controllers for separate applyTo":function () {
		// given
		var controller1 = this.getController(['module1']);
		var controller2 = this.getController(['module2']);

		// when
		var c1 = this.getComponent('module1');
		var c2 = this.getComponent('module2');

		// then
		assertEquals(controller1.getId(), c1.getController().getId());
		assertEquals(controller2.getId(), c2.getController().getId());
	},
	"test should call add component event when assigning component to controller":function () {
		var controller = this.getController(['module1']);

		var addedComponents = [];
		controller.addView = function (component) {
			addedComponents.push(component);
		};

		// when
		var c1 = this.getComponent('module1');
		var c2 = this.getComponent('module2');
		var c3 = this.getComponent('module1', 'submodule');

		// then

		assertEquals(2, addedComponents.length);
		assertEquals(c1.getId(), addedComponents[0].getId());
		assertEquals(c3.getId(), addedComponents[1].getId());

	},
	"test should be able to specify config object as controller":function () {
		// given
		var c1 = this.getComponent('module1', 'submodule', {
				controller:{
					type:'CustomController'
				}
			}
		);

		// then
		assertNotUndefined(c1.getController());
	},
	"test should be able to have singleton controllers":function () {
		// given
		this.createSingletonControllerClass('controllerId');

		// when
		var c1 = this.getComponent('module1', 'submodule', {
			controller:{
				type:'SingletonController'
			}
		});

		var c2 = this.getComponent('module2', 'submodule2', {
			controller:{
				type:'SingletonController'
			}
		});
		// then
		assertEquals(c1.getController().getId(), c2.getController().getId());

		assertEquals(2, c1.getController().getComponents().length)
	},
	"test should be able to extend class and have controller config as property":function () {
		// given
		this.createSingletonControllerClass('controllerId');

		// when
		var component = this.getComponentWithControllerAsClassProperty();

		// then
		assertNotUndefined('Controller is undefined', component.getController());
		assertEquals(ludo.SingletonController.getId(), component.getController().getId());
	},
	"test should by default set controller in same name space":function () {
		// given
		var controller = this.getControllerInNamespace('controllerId');
		var component = this.getComponentInNamespace('myComponent');
		var component2 = this.getComponentInDifferentNameSpace('myComponent');

		// then
		assertEquals('controllerId', component.getController().getId());
		assertFalse(controller.shouldBeControllerFor(component2));
		assertUndefined(component2.getController());
	},
	"test should be able to auto broadcast events":function () {
		// given
		var controller = this.getControllerInNamespace('controllerId', {
			broadcast:{
				'customNS.Component':['event1']
			}
		});

		assertNotUndefined('broadcast property is undefined', controller.broadcast);

		var component = this.getComponentInNamespace('myComponent');
		var eventFired = false;

		// when
		controller.addEvent('event1', function () {
			eventFired = true;
		});
		component.fireEvent('event1');

		// then
		assertTrue(eventFired);
	},
	"test should be able to rename broadcasted events":function () {
		// given
		var controller = this.getControllerInNamespace('controllerId', {
			broadcast:{
				'customNS.Component':[
					{ 'event1':'eventTwo' }
				]
			}
		});

		assertNotUndefined('broadcast property is undefined', controller.broadcast);

		var component = this.getComponentInNamespace('myComponent2');
		var eventFired = false;

		// when
		controller.addEvent('eventTwo', function () {
			eventFired = true;
		});
		component.fireEvent('event1');

		// then
		assertTrue(eventFired);
	},
	"test should preserve all arguments when broadcasting events":function () {
		// given
		var controller = this.getControllerInNamespace('controllerId', {
			broadcast:{
				'customNS.Component':['event1']
			}
		});

		var arg1 = 'John';
		var arg2 = 'Doe';
		var arg3 = {
			id:1
		};
		assertNotUndefined('broadcast property is undefined', controller.broadcast);

		var component = this.getComponentInNamespace('myComponent');

		var retA, retB, retC;

		// when
		controller.addEvent('event1', function (a, b, c) {
			retA = a;
			retB = b;
			retC = c;
		});
		component.fireEvent('event1', [arg1, arg2, arg3]);

		// then
		assertEquals('arg 1 is wrong', arg1, retA);
		assertEquals('arg 2 is wrong', arg2, retB);
		assertEquals('arg 3 is wrong', arg3, retC);

	}


})
;