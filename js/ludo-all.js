/**
ludoJS - Javascript framework
Copyright (C) 2012-2013 ludoludo.com

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * @module ludo
 * @main ludo
 */
if (!window.ludo)window.ludo = {};
ludo.form = {
    validator:{}
};
ludo.dashboard = {};
ludo.dialog = {};
ludo.remote = {};
ludo.tree = {};
ludo.model = {};
ludo.tpl = {};
ludo.video = {};
ludo.storage = {};
ludo.grid = {};
ludo.effect = {};
ludo.paging = {};
ludo.calendar = {};
ludo.layout = {};
ludo.progress = {};
ludo.dataSource = {};
ludo.controller = {};
ludo.card = {};
ludo.canvas = {};
ludo.svg = {};
ludo.socket = {};
ludo.menu = {};
ludo.view = {};
ludo.audio = {};

if (Browser.ie) {
    try {
        document.execCommand("BackgroundImageCache", false, true);
    } catch (e) {
    }
}

ludo.SINGLETONS = {};

ludo.CmpMgrClass = new Class({
    Extends:Events,
    components:{},
    formElements:{},
    /**
     * Reference to current active component
     * @property object activeComponent
     * @private
     */
    activeComponent:undefined,
    /**
     * Reference to currently selected button
     * @property object activeButton
     * @private
     */
    activeButton:undefined,
    /** Array of available buttons for a component. Used for tab navigation
     * @property array availableButtons
     * @private
     */
    availableButtons:undefined,

    initialize:function () {
        document.id(document.documentElement).addEvent('keypress', this.autoSubmit.bind(this));
    },

    autoSubmit:function (e) {
        if (e.key == 'enter') {
            if (e.target.tagName.toLowerCase() !== 'textarea') {
                if (this.activeButton) {
                    this.activeButton.click();
                }
            }
        }
        if (e.key == 'tab') {
            var tag = e.target.tagName.toLowerCase();
            if (tag !== 'input' && tag !== 'textarea') {
                this.selectNextButton();
            }
        }
    },
    registerComponent:function (component) {
        this.components[component.id] = component;
        if (component.buttonBar || component.buttons) {
            component.addEvent('activate', this.selectFirstButton.bind(this));
            component.addEvent('hide', this.clearButtons.bind(this));
        }
        if (component.singleton && component.type) {
            ludo.SINGLETONS[component.type] = component;
        }
    },

    selectFirstButton:function (cmp) {
        if (cmp.isHidden() || !cmp.getButtons) {
            return;
        }

        this.activeComponent = cmp;
        if (this.activeButton) {
            this.activeButton.deSelect();
        }
        this.activeButton = undefined;

        var buttons = this.availableButtons = cmp.getButtons();
        var i;
        for (i = 0; i < buttons.length; i++) {
            if (!buttons[i].isHidden() && buttons[i].selected) {
                this.activeButton = buttons[i];
                buttons[i].select();
                return;
            }
        }

        for (i = 0; i < buttons.length; i++) {
            if (!buttons[i].isHidden() && buttons[i].type == 'form.SubmitButton') {
                this.activeButton = buttons[i];
                buttons[i].select();
                return;
            }
        }
        for (i = 0; i < buttons.length; i++) {
            if (!buttons[i].isHidden() && buttons[i].type == 'form.CancelButton') {
                this.activeButton = buttons[i];
                buttons[i].select();
                return;
            }
        }
    },

    selectNextButton:function () {
        if (this.activeButton) {
            this.activeButton.deSelect();
        }

        var index = this.availableButtons.indexOf(this.activeButton);
        index++;
        if (index >= this.availableButtons.length) {
            index = 0;
        }
        this.activeButton = this.availableButtons[index];
        this.activeButton.select();
    },

    clearButtons:function (cmp) {
        if (this.activeComponent && this.activeComponent.getId() == cmp.getId()) {
            this.activeComponent = undefined;
            this.activeButton = undefined;
            this.activeButton = undefined;
        }
    },

    deleteComponent:function (component) {
        this.clearButtons(component);
        delete this.components[component.getId()];
    },

    get:function (id) {
        return this.components[id];
    },

    zIndex:1,
    getNewZIndex:function () {
        this.zIndex++;
        return this.zIndex;
    },

    newComponent:function (cmpConfig, parentComponent) {
		console.log('old code');
        cmpConfig = cmpConfig || {};
        if (!this.isConfigObject(cmpConfig)) {
            if (parentComponent) {
                if (cmpConfig.getParent() && cmpConfig.getParent().removeChild) {
                    cmpConfig.getParent().removeChild(cmpConfig);
                }
                cmpConfig.setParentComponent(parentComponent);
            }
            return cmpConfig;
        } else {
            if (parentComponent) {
                cmpConfig.els = cmpConfig.els || {};
                if (!cmpConfig.els.parent && parentComponent.getEl())cmpConfig.els.parent = parentComponent.getEl();
                cmpConfig.parentComponent = parentComponent;
            }
            var ret;
            var cmpType = this.getViewType(cmpConfig, parentComponent);
            if (cmpType.countNameSpaces > 1) {
                var tokens = cmpConfig.type.split(/\./g);
                var ns = tokens.join('.');
                ret = eval('new window.ludo.' + ns + '(cmpConfig)');
                if (!ret.type)ret.type = ns;
                return ret;
            }
            else if (cmpType.nameSpace) {
                if (!window.ludo[cmpType.nameSpace][cmpType.componentType] && parentComponent) {
                    parentComponent.log('Class ludo.' + cmpType.nameSpace + '.' + cmpType.componentType + ' does not exists');
                }
                ret = new window.ludo[cmpType.nameSpace][cmpType.componentType](cmpConfig);
                if (!ret.type)ret.type = cmpType.nameSpace;
                return ret;
            } else {
                if (!window.ludo[cmpType.componentType] && parentComponent) {
                    parentComponent.log('Cannot create object of type ' + cmpType.componentType);
                }
                return new window.ludo[cmpType.componentType](cmpConfig);
            }
        }
    },

    getViewType:function (config, parentComponent) {
        var cmpType = '';
        var nameSpace = '';
        if (config.type) {
            cmpType = config.type;
        }
        else if (config.cType) {
            cmpType = config.cType;
        } else {
            cmpType = parentComponent.cType;
        }
        var countNS = 0;
        if (cmpType.indexOf('.') >= 0) {
            var tokens = cmpType.split(/\./g);
            nameSpace = tokens[0];
            cmpType = tokens[1];
            countNS = tokens.length - 1;
        }
        return {
            nameSpace:nameSpace,
            componentType:cmpType,
            countNameSpaces:countNS
        }
    },

    isConfigObject:function (obj) {
        return obj && obj.initialize ? false : true;
    }
});

ludo.CmpMgr = new ludo.CmpMgrClass();

ludo.getView = function (id) {
    return ludo.CmpMgr.get(id);
};

ludo.get = function (id) {
    return ludo.CmpMgr.get(id);
};

ludo._new = function (config) {
    if (config.type && ludo.SINGLETONS[config.type]) {
        return ludo.SINGLETONS[config.type];
    }
    return ludo.factory.create(config);
};


ludo.FormMgrClass = new Class({
    formElements:{},
    elementArray:[],
    posArray:{},
    forms:{},

    add:function (item) {
        var name = item.getName();
        if (!this.formElements[name]) {
            this.formElements[name] = item;
            this.elementArray.push(item);
            this.posArray[item.getId()] = this.elementArray.length - 1;
        }

        item.addEvent('focus', this.setFocus.bind(this));
        item.addEvent('click', this.setFocus.bind(this));

    },

    getNext:function (formComponent) {
        if (this.posArray[formComponent.getId()]) {
            var index = this.posArray[formComponent.getId()];
            if (index < this.elementArray.length - 1) {
                return this.elementArray[index + 1];
            }
        }
        return null;
    },

    get:function (name) {
        return this.formElements[name] ? this.formElements[name] : null;
    },

    currentFocusedElement:undefined,

    setFocus:function (value, component) {
        if (component.isFormElement() && component !== this.currentFocusedElement) {
			if(this.currentFocusedElement && this.currentFocusedElement.hasFocus()){
				this.currentFocusedElement.blur();
			}
            this.currentFocusedElement = component;
        }
    }

});
ludo.Form = new ludo.FormMgrClass();


ludo.Effect = new Class({
	Extends: Events,
	inProgress:false,

	initialize:function(){
		if(Browser.ie){
			document.id(document.documentElement).addEvent('selectstart', this.cancelSelection.bind(this));

		}
	},

	fireEvents:function(){
		this.fireEvent('start');
		this.fireEvent('end');
	},

	start:function(){
		this.fireEvent('start');
		this.inProgress = true;
		this.disableSelection();
	},

	end:function(){
		this.fireEvent('end');
		this.inProgress = false;
		this.enableSelection();
	},

	disableSelection:function(){
		ludo.dom.addClass(document.body, 'ludo-unselectable');
	},

	enableSelection:function(){
		document.body.removeClass('ludo-unselectable');
	},

	cancelSelection:function(){
		return !(this.inProgress);
	}

});

ludo.EffectObject = new ludo.Effect();
/**
 Words used by ludo JS. You can change words by creating a new ludo.language Object,
 @module language
 @type {Object}
 @example
 	ludo.language = Object.merge(ludo.language,{
 		... Your own config
 	});
 */
ludo.language = {
	'columns' : 'Columns'
};
ludo.storage.LocalStorage = new Class({
	supported:false,
	initialize:function(){
		this.supported = typeof(Storage)!=="undefined";
	},

	save:function(key,value){
		if(!this.supported)return;

		var type = 'simple';
		if(this.isObject(value)){
			value = JSON.encode(value);
			type = 'object';
		}
		localStorage[key] = value;
		localStorage[this.getTypeKey(key)] = type;
	},

	get:function(key){
		if(!this.supported)return;

		var type = this.getType(key);
		if(type==='object'){
			return JSON.decode(localStorage[key]);
		}
		return localStorage[key];
	},

	isObject:function(value){
		return typeof(value) == 'object';
	},

	getTypeKey:function(key){
		return key + '___type';
	},

	getType:function(key){
		key = this.getTypeKey(key);
		if(localStorage[key]!==undefined){
			return localStorage[key];
		}
		return 'simple';
	},

	clearLocalStore:function(){
		localStorage.clear();
	}
});

ludo.localStorage = undefined;
ludo.getLocalStorage = function(){
	if(!ludo.localStorage)ludo.localStorage = new ludo.storage.LocalStorage();
	return ludo.localStorage;
};


/**
 * Internal class designed to create ludoJS class instances.
 * The global ludo.factory is an instance of this class
 * @class ObjectFactory
 */
ludo.ObjectFactory = new Class({
	namespaces:[],
	classReferences : {},

	/**
	 Creates an instance of a class by "type" attribute
	 @method create
	 @param {Object} config
	 @return {ludo.Core} object
	 */
	create:function(config){
		if(this.isClass(config))return config;
		config.type = config.type || 'View';

		if(this.classReferences[config.type] !== undefined){
			return new this.classReferences[config.type](config);
		}
		var ludoJsObj = this.getInNamespace('ludo', config);
		if(ludoJsObj)return ludoJsObj;
		for(var i=0;i<this.namespaces.length;i++){
			var obj = this.getInNamespace(this.namespaces[i], config);
			if(obj)return obj;
		}
		ludo.util.log('Could not find class ' + config.type);
		return undefined;
	},

	/**
	 Register a class for quick lookup. First argument is the value of the type attribute you want
	 to support. It is not required to call this for each class you create. The alternative is to
	 register a namespace by calling ludo.factory.registerNamespace('MyApp'). However, if you have a lot of
	 classes, it will increase performance by registering your classes. ludoJS will then know it instantly
	 and doesn't have to traverse the name space tree to find it.
	 @method registerClass
	 @param {String} typeName
	 @param {ludo.Core} classReference
	 @example
	 	MyApp = {};
	 	MyApp.MyView = new Class({
	 		Extends: ludo.View,
	 		type: 'MyApp.MyView'
	 	});
	 	ludo.factory.register('MyApp.MyView', MyApp.MyView);
		...
	 	...
	 	new ludo.View({
	 		...
	 		children:[{
	 			type:'MyApp.MyView' // ludoJS now knows how to find this class
			}]
		});


	 */
	registerClass:function(typeName, classReference){
		this.classReferences[typeName] = classReference;
	},

	/**
	 Method used to create global name space for your web applications.
	 This methods makes ludoJS aware of the namespace and register a global variable
	 window[ns] for it if it does not exists. It makes it possible for ludoJS to find
	 classes by type attribute.
	 @method ludo.factory.createNamespace
	 @param {String} ns
	 @example
	 	ludo.factory.createNamespace('MyApp');
	 	...
	 	...
	 	MyApp.MyClass = new Class({
	 		Extends: ludo.View,
			type : 'MyApp.MyClass'
	 	});

	 	var view = new ludo.View({
	 		children:[{
	 			type : 'MyApp.MyClass'
			}]
	 	});

	 Notice that "Namespace" is used as prefix in type attribute in the last snippet. For
	 standard ludoJS components, you could write type:"View". For views in your namespaces,
	 you should always use the syntax "Namespace.ClassName"
	 */
	createNamespace:function(ns){
		if(window[ns] === undefined)window[ns] = {};
		if(this.namespaces.indexOf(ns) === -1)this.namespaces.push(ns);
	},

	getInNamespace:function(ns, config){
		var type = config.type.split(/\./g);
		if(type[0] === ns)type.shift();
		var obj = window[ns];
		for(var i=0;i<type.length;i++){
			if(obj[type[i]] !== undefined){
				obj = obj[type[i]];
			}else{
				return undefined;
			}
		}
		return new obj(config);
	},

	isClass:function(obj){
		return obj && obj.initialize !== undefined;
	}
});
ludo.factory = new ludo.ObjectFactory();
/*
* User specific config properties for ludoJS
*/

LUDOJS_CONFIG = {
    url : '/ludojs/api/demo/controller.php',
    socket : {
        url : 'http://your-node-js-server-url:8080/'
    },

    fileupload : {
        url : '/ludojs/api/demo/controller.php'
    },

	mod_rewrite : false
};
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

    // TODO refactor this to use only this.url or global url.
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
		if (window.LUDOJS_CONFIG && LUDOJS_CONFIG.url) {
			return LUDOJS_CONFIG.url;
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
ludo.Movable = new Class({
    Extends : Events,
    sources : {},
    targets : {},
    records : {},
    components : {},
    els : {
        shim : null,
        insertionMarker : null
    },
    dragProperties : {
        el : null,
        waiting : null,
        countSources : 0,
        mouseOverCol : null,
        originalMousePos : {
            x : null,
            y : null
        },
        originalElPos : {
            x : null,
            y : null
        },
        jsObjects : {
            source : {
                item : null,
                column : null
            },
            target : {
                item : null,
                column : null,
                pos : null
            }
        }
    },
    id : null,
    delay : 1,
    
    initialize : function() {
        this.createElements();
        this.id = String.uniqueID();

        document.body.addEvent('mouseup', this.stopMove.bind(this));
        document.body.addEvent('mousemove', this.mouseMove.bind(this));
    },



    addSource : function(obj) {
        var handle = obj.handle || null;
        var record = obj.record || null;
        var component = obj.component || null;
        var el = obj.el || component.getEl();

        if(el.hasClass('ludo-movable')){
            return;
        }
        if(!el.id){
            el.id = 'ludo-movable-' + String.uniqueID();
        }
        if(this.sources[el.id]){
            console.log(el.id);
            console.log('Error: ' + el.id + ' has duplicates');
        }
        
        if(record){
            this.records[el.id] = record;
        }
        if(component){
            this.components[el.id] = component;
        }
        this.sources[el.id] = obj.el || obj.component;
        ludo.dom.addClass(el, 'ludo-movable');
        if(handle){
            var handleObj = el.getElements(handle)[0];
            try{
                handleObj.addEvent('mousedown', this.startMove.bind(this));
            }catch(e){
                console.log(obj);
            }
            ludo.dom.addClass(handleObj, 'ludo-movable-handle');
            handleObj.setStyle('cursor','move');
        }else{
            el.addEvent('mousedown', this.startMove.bind(this));
        }

    },

    addTarget : function(obj){

        var record = obj.record || null;
        var component = obj.component || null;
        var el = obj.el || component.getEl();

        if(!el.id){
            el.id = 'ludo-movable-target-' + String.uniqueID();
        }
        this.targets[el.id] = obj.el || obj.component;
        if(record){
            this.records[el.id] = record;
        }
        if(component){
            this.components[el.id] = component;
        }
        el.addEvent('mousemove', this.mouseMoveOnTarget.bind(this));
        el.addEvent('mouseover', this.mouseOverTarget.bind(this));
        ludo.dom.addClass(el, 'ludo-movable-target');
    },

    mouseOverTarget : function() {

    },

    mouseMoveOnTarget : function() {

    },
    setWidthOfShimAndInsertionPoint : function(width) {
        this.els.shim.setStyle('width', width);
        this.els.insertionMarker.setStyles({
            width : width,
            display : ''
        });
    },
    getTargetElementFromEvent : function(e){
        var el = e.target;
        if(!el.hasClass('ludo-movable-target')){
            el = el.getParent('.ludo-movable-target');
        }
        return el;
    },

    placeInsertionMarker : function() {

    },

    createElements : function() {
        this.createShim();
        this.createInsertionMarker();
    },

    createShim : function() {
        var el = this.els.shim = new Element('div');
        ludo.dom.addClass(el, 'ludo-rich-view-shim');
        el.setStyle('display','none');
        document.body.adopt(el);
    },

    createInsertionMarker : function() {
        var el = this.els.insertionMarker = new Element('div');
        el.setStyle('display','none');
        document.body.adopt(el);
    },

    stopMove : function() {
        if(this.dragProperties.waiting || this.dragProperties.mode){
            this.fireEvent('stop');
        }
        if(this.dragProperties.waiting){
            clearTimeout(this.dragProperties.waiting);
        }
        if(this.dragProperties.mode){
            this.dragProperties.mode = null;
            this.dragProperties.el.setStyle('display', '');
            this.els.shim.setStyle('display','none');
            this.els.insertionMarker.setStyle('display','none');
            this.fireEvent('drop', [this, this.getSourceItem(), this.getTargetItem()]);
        }
    },

    startMove : function(e) {

        this.fireEvent('start');
        this.dragProperties.el = e.target;
        if(!this.dragProperties.el.hasClass('ludo-movable')){
            this.dragProperties.el = this.dragProperties.el.getParent('.ludo-movable');
        }
        var coordinates = this.dragProperties.el.getCoordinates();
        this.els.shim.setStyle('display','none');
        this.resizeShim(coordinates);

        this.dragProperties.mouseOverCol = null;
        this.dragProperties.jsObjects.target = {
            column : null,
            item : null
        };

        this.setHeightOfInsertionMarker();


        this.dragProperties.jsObjects.source = {
            item : this.sources[this.dragProperties.el.id],
            column : this.sources[this.dragProperties.el.id].getParent ? this.sources[this.dragProperties.el.id].getParent() : null
        };

        this.dragProperties.originalElPos = {
            x : coordinates.left,
            y : coordinates.top
        };
        this.dragProperties.originalMousePos = {
            x : e.page.x,
            y : e.page.y
        };
        if(this.hasDelay()){
            this.dragProperties.waiting = this.startMoveAfterDelay.delay(this.delay * 1000, this);
        }else{
            this.hideSourceAndShowShim();
        }
        return false;
    },

    setHeightOfInsertionMarker : function(){
        var size = this.dragProperties.el.getSize();
        this.els.insertionMarker.setStyle('height', size.y);
    },

    resizeShim : function(coordinates){
        this.els.shim.setStyles({
            left : coordinates.left,
            top : coordinates.top + 30,
            width : coordinates.width,
            height : coordinates.height
        });
    },

    hasDelay : function() {
        return this.delay > 0;
    },

    showShim : function() {
        this.els.shim.setStyle('display', '');
    },

    startMoveAfterDelay : function() {
        if(this.dragProperties.waiting){
            this.hideSourceAndShowShim();
        }
    },

    hideSourceAndShowShim : function() {
        this.dragProperties.el.setStyle('display', 'none');
        this.dragProperties.mode = 'move';
        this.showShim();
        this.setInitialInsertionPoint();
        this.placeInsertionMarker();
    },

    mouseMove : function(e) {
        if(this.dragProperties.mode == 'move'){
            this.els.shim.setStyles({
                left : this.dragProperties.originalElPos.x + e.page.x - this.dragProperties.originalMousePos.x,
                top : this.dragProperties.originalElPos.y + e.page.y - this.dragProperties.originalMousePos.y + 30
            });
            return false;
        }
        return undefined;
    },

    setInitialInsertionPoint : function() {
        
    },
    isActive : function() {
        return this.dragProperties.mode ? true : false;
    },

    getSourceColumn : function() {
        return this.dragProperties.jsObjects.source.column;
    },
    getSourceItem : function() {
        return this.dragProperties.jsObjects.source.item;
    },
    getTargetColumn : function() {
        return this.dragProperties.jsObjects.target.column;
    },
    getTargetItem : function() {
        return this.dragProperties.jsObjects.target.item;
    },
    getTargetPosition : function() {
        return this.dragProperties.jsObjects.target.pos;
    },

    getSourceRecord : function(){
        return this.records[this.dragProperties.jsObjects.source.item.id];
    },
    getTargetRecord : function(){
        if(!this.dragProperties.jsObjects.target.item){
            return null;
        }
        return this.records[this.dragProperties.jsObjects.target.item.id];
    },

    getSourceComponent : function(){
        return this.components[this.dragProperties.jsObjects.source.item.id];
    },

    getTargetView : function(){
        if(!this.dragProperties.jsObjects.target.item){
            return null;
        }
        return this.components[this.dragProperties.jsObjects.target.item.id];
    }
});
/**
 * Class for JSON request proxy. When using a proxy for an URL, Ajax requests to this
 * URL will be queued for some time before sending them all in one go.
 *
 * Instead of having one post "request" array, you will now have a post "requests"(plural)
 * array sent to the server where each item in the array is a "request" object.
 *
 * @namespace remote
 * @class Proxy
 *
 */

ludo.remote.proxies = {};

ludo.remote.Proxy = new Class({
	Extends:Events,
	type:'remote.Proxy',
	/**
	 * How long to wait(in seconds) before sending queue of requests to the server.
	 * @attribute delay
	 * @type {Number}
	 * @default .2
	 *
	 */
	delay:.2,
	requests:[],
	onSuccessFns:{},
	url:undefined,

	initialize:function (config) {
		ludo.remote.proxies[config.url] = this;
		this.url = config.url;
		if (config.delay !== undefined)this.delay = config.delay;
	},

	addRequest:function (requestId, config) {
		if (this.hasRequest(requestId)) {
			this.send();
		}
		this.requests.push({
			id:requestId,
			data:config.data
		});
		this.onSuccessFns[requestId] = config.onSuccess;
		if (this.requests.length === 1) {
			this.send.delay(this.delay * 1000, this);
		}
	},

	hasRequest:function (requestId) {
		for (var i = 0; i < this.requests.length; i++) {
			if (this.requests[i].id == requestId)return true;
		}
		return false;
	},

	send:function () {
		/**
		 * Event fired when progress bar is finished
		 * @event send
		 * @param {Array} requests
		 */
		this.fireEvent('send', this.requests);

		var req = new Request.JSON(this.getRequestConfig());
		req.send();
		this.requests = [];
	},

	getRequestConfig:function () {
		return {
			url:this.url,
			method:'post',
			noCache:true,
			data:{
				requests:this.requests
			},
			onSuccess:this.receiveResponse.bind(this)
		};
	},

	receiveResponse:function (json) {
		json = json.response || json;
		for (var i = 0; i < json.data.length; i++) {
			var r = json.data[i];
			if (r.id && this.onSuccessFns[r.id] !== undefined) {
				this.onSuccessFns[r.id].call(undefined, r);
			}
		}
	}
});


ludo.remote.getProxy = function (url) {
	return ludo.remote.proxies[url];
};

ludo.remote.deleteProxy = function (url) {
	ludo.remote.proxies[url] = undefined;
};

ludo.remote.deleteProxies = function () {
	ludo.remote.proxies = {};
};
/**
 Create a new proxy for an url
 @method ludo.remote.createProxy
 @param {String} url
 @param {Object} config
 @example
 	new ludo.remote.createProxy('controller.php',{delay : .3 });
 This creates a ludo.remote.Proxy object for the "controller.php" url.
 */
ludo.remote.createProxy = function (url, config) {
	if (!ludo.remote.getProxy(url)) {
		config = config || {};
		if (config.type === undefined)config.type = 'remote.Proxy';
		config.url = url;
		return ludo._new(config);
	} else {
		return ludo.remote.getProxy(url);
	}
};
/**
 * LudoJS class for remote JSON queries. Remote queries in ludoJS uses a REST-like API where you have
 * resources, arguments, service and data. An example of resource is Person and City. Example of
 * services are "load", "save". Arguments are arguments used when instantiating the resource on the
 * server, example: Person with id 1. The "data" property is used for data which should be sent to
 * the service on the server. Example: For Person with id equals 1, save these data.
 * @namespace remote
 * @class JSON
 * @extends Events
 */
ludo.remote.JSON = new Class({
    Extends:Events,
    method:'post',
    JSON:undefined,
    errorText:undefined,
    errorCode:undefined,
    /**
     * Name of resource to request, example: "Person"
     * @config {String} resource
     */
    resource:undefined,
    /**
     * Optional url to use for the query instead of global set url.
     * @config {String} url
     * optional
     */
    url:undefined,
    /**
     * @constructor
     * @param {Object} config
     */
    initialize:function (config) {
        if (config.listeners !== undefined) {
            this.addEvents(config.listeners);
        }
        this.method = config.method || this.method;
        if (config.resource !== undefined) this.resource = config.resource;
        if (config.url !== undefined) this.url = config.url;
    },

    /**
     Send request to the server
     @method send
     @param {String} service
     @param {Array} arguments
     @optional
     @param {Object} data
     @optional
     @example
	 	LUDOJS_CONFIG.url = '/controller.php';
        var req = new ludo.remote.JSON({
            resource : 'Person'
        });
        req.send('load', 1);

     Will trigger the following data to be sent to controller.php:

     @example
        {
            request:"Person/1/load"
        }
     If you have the mod_rewrite module enabled and activated on your web server, you may use code like this:
     @example
	 	LUDOJS_CONFIG.mod_rewrite = true;
	 	LUDOJS_CONFIG.url = '/';
        var req = new ludo.remote.JSON({
            resource : 'Person'
        });
        req.send('load', 1);

     which will send a request to the following url:
     @example:
        http://<your web server url>/Person/1/load
     The query will not contain any POST data.

     Here's another example for saving data(mod rewrite deactivated)
     @example
	     LUDOJS_CONFIG.url = '/controller.php';
         var req = new ludo.remote.JSON({
                resource : 'Person'
            });
         req.send('save', 1, {
            "firstname": "John",
            "lastname": "McCarthy"
         });

     which will send the following POST data to "controller.php":

     @example
        {
            "request": "Person/1/save",
            "data": {
                "firstname": "John",
                "lastname": McCarthy"
            }
        }
     When mod_rewrite is enabled, the request will be sent to the url /Person/1/save and POST data will contain

        {
            "data": {
                "firstname": "John",
                "lastname": "McCarthy"
            }
        }
     i.e. without any "request" data in the post variable since it's already defined in the url.
     */
    send:function (service, arguments, data) {
        if (!ludo.util.isArray(arguments))arguments = [arguments];
        var req = new Request.JSON({
            url:this.getUrl(service, arguments),
            method:this.method,
            data:this.getDataForRequest(service, arguments, data),
            onSuccess:function (json) {
                this.JSON = json;
                if (json.success || json.success === undefined) {
                    this.fireEvent('success', this);
                } else {
                    this.fireEvent('failure', this);
                }
            }.bind(this),
            onError:function (text, error) {
                this.errorText = text;
                this.errorCode = error;
                this.fireEvent('servererror', this);
            }.bind(this)
        });
        req.send();
    },
    /**
     * Return url for the request
     * @method getUrl
     * @param {String} service
     * @param {Array} arguments
     * @return {String}
     * @private
     */
    getUrl:function (service, arguments) {
        var ret = this.url !== undefined ? this.url : LUDOJS_CONFIG.url;
        if (LUDOJS_CONFIG.mod_rewrite) {
            ret += this.getServicePath(service, arguments);
        }
        return ret;
    },
    /**
     * @method getServicePath
     * @param {String} service
     * @param {Array} arguments
     * @return {String}
     * @private
     */
    getServicePath:function (service, arguments) {
        var parts = [this.resource];
        if (arguments)parts.push(arguments.join('/'));
        if (service)parts.push(service);

        return parts.join('/');
    },
    /**
     * @method getDataForRequest
     * @param {String} service
     * @param {Array} arguments
     * @param {Object} data
     * @optional
     * @return {Object}
     * @private
     */
    getDataForRequest:function (service, arguments, data) {
        var ret = {
            data:data
        };
        if (!LUDOJS_CONFIG.mod_rewrite && this.resource) {
            ret.request = this.getServicePath(service, arguments);
        }
        return ret;
    },
    /**
     * Return JSON response data from last request.
     * @method getResponseData
     * @return {Object|undefined}
     */
    getResponseData:function () {
        return this.JSON.response ? this.JSON.response.data : this.JSON.data;
    },
    /**
     * Return entire server response of last request.
     * @method getResponse
     * @return {Object|undefined}
     */
    getResponse:function () {
        return this.JSON;
    },

    /**
     * Return error text from last failed server request
     * @method getErrorText
     * @return {String}
     */
    getErrorText:function () {
        return this.errorText;
    },
    /**
     * Return error code from last failed server request
     * @method getErrorCode
     * @return {String}
     */
    getErrorCode:function () {
        return this.errorCode;
    },
    /**
     * Return "code" property of last received server response.
     * @method getResponseCode
     * @return {String|undefined}
     */
    getResponseCode:function () {
        return this.JSON && this.JSON.code ? this.JSON.code : undefined;
    },
    /**
     * Return response message
     * @method getResponseMessage
     * @return {String|undefined}
     */
    getResponseMessage:function () {
        return this.JSON && this.JSON.message ? this.JSON.message : undefined;
    }
});

/**
 * JSON Content compiler. This component will return compiled JSON for a view. It will
 * be created on demand by a ludo.View. If you want to create your own parser, extend this
 * class and
 * @namespace tpl
 * @class Parser
 * @extends Core
 */
ludo.tpl.Parser = new Class({
    Extends:ludo.Core,
    type:'tpl.Parser',
    singleton:true,

    /**
     * Get compiled string
	 * @method getCompiled
     * @param {Object} json
     * @param {String} tpl
     */
    getCompiled:function (json, tpl) {

        var records = json.data ? json.data : json;
        if (!this.isArray(records)) {
            records = [records];
        }
        var html = '';
        for (var i = 0; i < records.length; i++) {
            var content = tpl;
            var prop;
            for (prop in records[i]) {
                if (records[i].hasOwnProperty(prop)) {
                    var value = this.getTplValue(prop, records[i][prop]);
                    value = value ? value : '';
                    var reg = new RegExp('{' + prop + '}', 'g');
                    content = content.replace(reg, value);
                }
            }
            html = html + content;
        }
        return html;
    },

    getTplValue:function (key, value) {
        return value;
    }
});
ludo.color = {};

ludo.color.Color = new Class({

    rgbColors:function (a, b, c) {
        if (a.substr !== undefined) {
            return this.rgbObject(a);
        }
        if (a.h !== undefined) {
            return this.hsvToRGB(a.h, a.s, a.v);
        }
    },
    rgbObject:function (rgbColor) {
        rgbColor = rgbColor.replace('#', '');
        return {
            r:rgbColor.substr(0, 2).toInt(16),
            g:rgbColor.substr(2, 2).toInt(16),
            b:rgbColor.substr(4, 2).toInt(16)
        };
    },
    rgbCode:function (a, b, c) {
        if (b === undefined) {
            if (a.r !== undefined) {
                b = a.g;
                c = a.b;
                a = a.r;
            }
            else if (a.h !== undefined) {
                var color = this.hsvToRGB(a.h, a.s, a.v);
                a = color.r;
                b = color.g;
                c = color.b;
            }
        }
        return this.toRGB(a, b, c);
    },
    toRGB:function (r, g, b) {
        r = Math.round(r).toString(16);
        g = Math.round(g).toString(16);
        b = Math.round(b).toString(16);
        if (r.length === 1)r = ['0', r].join('');
        if (g.length === 1)g = ['0', g].join('');
        if (b.length === 1)b = ['0', b].join('');
        return ['#', r, g, b].join('').toUpperCase();
    },
    toRGBFromObject:function (color) {
        return this.toRGB(color.r, color.g, color.b);
    },
    toHSV:function (color) {
        if (color.r === undefined)color = this.rgbObject(color);
        return this.toHSVFromRGB(color.r, color.g, color.b);
    },
    toHSVFromRGBCode:function (rgbColor) {
        var color = this.rgbObject(rgbColor);
        return this.toHSVFromRGB(color.r, color.g, color.b);
    },

    toHSVFromRGB:function (r, g, b) {
        r = r / 255;
        g = g / 255;
        b = b / 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return {
            h:h * 360,
            s:s * 100,
            v:max * 100
        };
    },

    hsvToRGBCode:function (h, s, v) {
		if(s===undefined){
			s = h.s;v = h.v;h= h.h;
		}
        return this.toRGB(this.hsvToRGB(h, s, v));
    },
    hsvToRGB:function (h, s, v) {
        if (s === undefined) {
            s = h.s;
            v = h.v;
            h = h.h;
        }
        h /= 360;
        s /= 100;
        v /= 100;

        var r, g, b;

        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
        return{
            r:r * 255,
            g:g * 255,
            b:b * 255
        };
    },

    hslToRgb:function (h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return { r:r * 255, g:g * 255, b:b * 255 }
    }
});


/**
 * Factory class for layout managers
 * @namespace layout
 * @class Factory
 */
ludo.layout.Factory = new Class({

    /**
     * Returns layout manager, a layout.Base or subclass
	 * @method getManager
     * @param {ludo.View} view
     * @return {ludo.layout.Base} manager
     */
	getManager:function(view){
		return new ludo.layout[this.getLayoutClass(view)](view);
	},

    /**
     * Returns correct name of layout class
     * @method getLayoutClass
     * @param {ludo.View} view
     * @return {String} className
     * @private
     */
	getLayoutClass:function(view){
		if(!view.layout || !view.layout.type)return 'Base';

		switch(view.layout.type.toLowerCase()){
			case 'relative':
				return 'Relative';
			case 'fill':
				return 'Fill';
			case 'card':
				return 'Card';
			case 'grid':
				return 'Grid';
			case 'tabs':
			case 'tab':
				return 'Tab';
			case 'column':
			case 'cols':
				return 'LinearHorizontal';
			case 'popup':
				return 'Popup';
			case 'rows':
			case 'row':
				return 'LinearVertical';
			case 'linear':
				return ['Linear', (view.layout.orientation && view.layout.orientation.toLowerCase()=='horizontal') ? 'Horizontal' : 'Vertical'].join('');
			default:
				return 'Base';
		}
	},

    /**
     * Returns valid layout configuration for a view
     * @method getValidLayoutObject
     * @param {ludo.View} view
     * @param {Object} config
     * @return {Object}
     * @private
     */
	getValidLayoutObject:function(view, config){
		var ret;
		if(view.layout === undefined && config.layout === undefined && view.weight === undefined && config.weight === undefined && config.left===undefined)return {};
		if(config.layout !== undefined){
			if(view.layout !== undefined)config.layout = this.getMergedLayout(view.layout, config.layout);
			ret = config.layout;
		}else{
			ret = view.layout || { type : 'Base' };
		}

		if (typeof ret === 'string') {
			ret = { type:ret }
		}

		if(ret.width === undefined)ret.width = config.width || view.width;
		if(ret.height === undefined)ret.height = config.height || view.height;
		if(ret.weight === undefined)ret.weight = config.weight || view.weight;
		if(ret.type === undefined)ret.type = 'Base';
		return ret;
	},
    /**
     * Returned merged layout object, i.e. layout defind on HTML page merged
     * with internal layout defined in class
     * @method getMergedLayout
     * @param {Object} layout
     * @param {Object} mergeWith
     * @return {Object}
     * @private
     */
	getMergedLayout:function(layout, mergeWith){
		for(var key in mergeWith){
			if(mergeWith.hasOwnProperty(key)){
				layout[key] = mergeWith[key];
			}
		}
		return layout;
	}
});

ludo.layoutFactory = new ludo.layout.Factory();
ludo.layout.Resizer = new Class({
	Extends:ludo.Core,
	layout:{},
	orientation:undefined,
	view:undefined,
	dd:undefined,
	pos:undefined,
	isActive:false,
	hidden:false,

	ludoConfig:function (config) {
		this.parent(config);
		this.orientation = config.orientation;
		this.view = config.view;
		this.layout = config.layout;
		this.pos = config.pos;
		this.createDOM(config.renderTo);
		this.addViewEvents();
		this.createDragable();
	},

	createDOM:function(renderTo){
		this.el = new Element('div');
		this.el.addEvent('mouseenter', this.enterResizer.bind(this));
		this.el.addEvent('mouseleave', this.leaveResizer.bind(this));
		ludo.dom.addClass(this.el, 'ludo-resize-handle');
		ludo.dom.addClass(this.el, 'ludo-resize-handle-' + ((this.orientation === 'horizontal') ? 'col' : 'row'));
		ludo.dom.addClass(this.el, 'ludo-layout-resize-' + ((this.orientation === 'horizontal') ? 'col' : 'row'));
		this.el.style.cursor = this.orientation === 'horizontal' ? 'w-resize' : 's-resize';
		this.el.style.zIndex = 100000;

		renderTo.appendChild(this.el);

	},

	enterResizer:function(){
		if(!this.isActive){
			this.el.style.zIndex = parseInt(this.el.style.zIndex) + 1;
			ludo.dom.addClass(this.el, 'ludo-resize-handle-active');
		}
	},

	leaveResizer:function(){
		if(!this.isActive){
			this.el.style.zIndex = parseInt(this.el.style.zIndex) - 1;
			ludo.dom.removeClass(this.el, 'ludo-resize-handle-active');
		}
	},
	createDragable:function(){
		this.dd = new ludo.effect.Drag({
			directions : this.orientation == 'horizontal' ? 'X' : 'Y'
		});
		this.dd.addEvent('before', this.beforeDrag.bind(this));
		this.dd.addEvent('end', this.endDrag.bind(this));
		this.dd.add(this.el);
	},

	beforeDrag:function(){
		this.dd.setMinX(30);
		this.isActive = true;
		ludo.dom.removeClass(this.el, 'ludo-resize-handle-active');
		ludo.dom.addClass(this.el, 'ludo-resize-handle-active');
		this.fireEvent('before', [this, this.view]);
	},

	setMinWidth:function(x){
		if(this.pos === 'left'){
			var el = this.view.getEl();
			this.dd.setMaxX(el.offsetLeft + el.offsetWidth - x);
		}else{
			this.dd.setMinX(this.view.getEl().offsetLeft + x);
		}
	},

	setMaxWidth:function(x){
		var el = this.view.getEl();
		if(this.pos === 'right'){
			this.dd.setMaxX(el.offsetLeft + x);
		}else{
			var pos = 0;
			if(this.layout.affectedSibling){
				pos = this.layout.affectedSibling.getEl().offsetLeft + 10;
			}
			this.dd.setMinX(Math.max(pos, el.offsetLeft + el.offsetWidth - x));
		}
	},

	setMinHeight:function(y){
		if(this.pos === 'above'){
			var el = this.view.getEl();
			this.dd.setMaxY(el.offsetTop + el.offsetHeight - y);
		}else{
			this.dd.setMinY(this.view.getEl().offsetTop + y);
		}

	},

	setMaxHeight:function(y){
		var el = this.view.getEl();
		if(this.pos === 'below'){
			this.dd.setMaxY(el.offsetTop + y);
		}else{
			var pos = 10;
			if(this.layout.affectedSibling){
				pos = this.layout.affectedSibling.getEl().offsetTop + 10;
			}
			this.dd.setMinY(Math.max(pos, el.offsetTop + el.offsetHeight - y));
		}
	},

	endDrag:function(dragged, dd){
		ludo.dom.removeClass(this.el, 'ludo-resize-handle-over');
		ludo.dom.removeClass(this.el, 'ludo-resize-handle-active');
		var change = this.orientation === 'horizontal' ? dd.getDraggedX() : dd.getDraggedY();
		if(this.pos === 'left' || this.pos === 'above'){
			change *= -1;
		}
		this.fireEvent('resize', change);
		this.isActive = false;
	},

	getEl:function(){
		return this.el;
	},

	addViewEvents:function () {
		this.view.addEvent('maximize', this.show.bind(this));
		this.view.addEvent('expand', this.show.bind(this));
		this.view.addEvent('minimize', this.hide.bind(this));
		this.view.addEvent('collapse', this.hide.bind(this));
		this.view.addEvent('hide', this.hide.bind(this));
		this.view.addEvent('show', this.show.bind(this));
	},

	show:function(){
		this.el.style.display = '';
		this.hidden = false;
	},

	hide:function(){
		this.hidden = true;
		this.el.style.display = 'none';
	},

	getWidth:function(){
		return this.hidden ? 0 : 5;
	},

	getHeight:function(){
		return this.hidden ? 0 : 5;
	},

	resize:function(config){
		this.el.style.left = '';
		this.el.style.top = '';
		this.el.style.right = '';
		this.el.style.bottom = '';

		if(config.width !== undefined && config.width > 0)this.el.style.width = config.width + 'px';
		if(config.height !== undefined && config.height > 0)this.el.style.height = config.height + 'px';
		if(config.left !== undefined)this.el.style.left = config.left + 'px';
		if(config.top !== undefined)this.el.style.top = config.top + 'px';
		if(config.bottom !== undefined)this.el.style.bottom = config.bottom + 'px';
		if(config.right !== undefined)this.el.style.right = config.right + 'px';
	},

	getParent:function(){

	},
	setParentComponent:function(){

	},
	isVisible:function(){
		return !this.hidden;
	},
	isHidden:function(){
		return this.hidden;
	}
});
ludo.canvas.Engine = new Class({
	/**
	 * Transformation cache
	 * @property tCache
	 * @type {Object}
	 * @private
	 */
	tCache:{},
	tCacheStrings:{},

	/**
	 * Updates a property of a SVG DOM node
	 * @method set
	 * @param {HTMLElement} el
	 * @param {String} key
	 * @param {String} value
	 */
	set:function (el, key, value) {
		if (key.substring(0, 6) == "xlink:") {
            if(value['id']!==undefined)value = '#' + value.getId();
			el.setAttributeNS("http://www.w3.org/1999/xlink", key.substring(6), value);
		} else {
            if(value['id']!==undefined)value = 'url(#' + value.getId() + ')';
			el.setAttribute(key, value);
		}
	},
	/**
	 * Returns property value of a SVG DOM node
	 * @method get
	 * @param {HTMLElement} el
	 * @param {String} key
	 */
	get:function (el, key) {
		if (key.substring(0, 6) == "xlink:") {
			return el.getAttributeNS("http://www.w3.org/1999/xlink", key.substring(6));
		} else {
			return el.getAttribute(key);
		}
	},

	text:function (el, text) {
		el.textContent = text;
	},

	show:function (el) {
		el.setAttribute('display', '');
	},

	hide:function (el) {
		el.setAttribute('display', 'none');
	},

	moveTo:function (el, x, y) {
		el.setAttribute('x', x);
		el.setAttribute('y', y);
	},

	toBack:function (el) {
		if (Browser.ie) this._toBack.delay(20, this, el); else this._toBack(el);
	},
	_toBack:function (el) {
		el.parentNode.insertBefore(el, el.parentNode.firstChild);
	},

	toFront:function (el) {
		if (Browser.ie)this._toFront.delay(20, this, el); else this._toFront(el);
	},
	_toFront:function (el) {
		el.parentNode.appendChild(el);
	},

	rotate:function (el, rotation) {
		this.setTransformation(el, 'rotate', rotation);
	},

	skewX:function (el, degrees) {
		this.getTransformObject(el);
		el.transform.baseVal.getItem(0).setSkewX(degrees);
	},

	skewY:function (el, degrees) {
		this.getTransformObject(el);
		el.transform.baseVal.getItem(0).setSkewY(degrees);
	},

	getOrigin:function (el) {
		return {
			x:this.getWidth(el) / 2,
			y:this.getHeight(el) / 2
		}
	},
	cache:{

	},
	translate:function(el, x, y){
		this.setTransformation(el, 'translate', x + ' ' + y);

		// this.applyTransformationToMatrix(el, 'translate', x, y);
	},

	getCurrentCache:function(el, key){
		return this.cache[el.id]!==undefined && this.cache[el.id][key]!==undefined ? this.cache[el.id][key] : [0,0];
	},

	scale:function(el, width, height){
		if(height === undefined)height = width;
		this.setTransformation(el, 'scale', width + ' ' + height);

		// if(height === undefined)height = width;
		// this.applyTransformationToMatrix(el, 'scale', width, height);
	},

	applyTransformationToMatrix:function(el, transformation, x, y){
		var t = this.getTransformObject(el);
		var c = this.getCurrentCache(el, transformation);
		if(y!==undefined){
			t.setMatrix(t.matrix[transformation](x - c[0], y - c[1]));
		}else{
			t.setMatrix(t.matrix[transformation](x - c[0]));
		}
		if(this.cache[el.id]=== undefined)this.cache[el.id] = {};
		if(transformation === 'scale'){
			x--;y--;
		}
		this.cache[el.id][transformation] = [x,y];
	},

	setTransformMatrix:function(el, a,b,c,d,e,f){
		this.getTransformObject(el).setMatrix(a,b,c,d,e,f);
	},

	getTransformObject:function(el){
		if(el.transform.baseVal.numberOfItems ==0){
			var owner, dynamicSvg = false;
			if(el.ownerSVGElement){
				owner = el.ownerSVGElement;
			}else{
				owner = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
				dynamicSvg = true;
			}
			var t = owner.createSVGTransform();
			el.transform.baseVal.appendItem(t);
			if(dynamicSvg)delete owner;
		}
		return el.transform.baseVal.getItem(0);
	},

	setTransformation:function (el, transformation, value) {
		var id = this.get(el, 'id');
		this.buildTransformationCacheIfNotExists(el, id);
		this.updateTransformationCache(id, transformation, value);
		this.set(el, 'transform', this.getTransformationAsText(id));
	},

	updateTransformationCache:function (id, transformation, value) {
		value = value.toString();
		if (isNaN(value)) {
			value = value.replace(/,/g, ' ');
			value = value.replace(/\s+/g, ' ');
		}
		var values = value.split(/\s/g);
		this.tCache[id][transformation] = {
			values:values,
			readable:this.getValidReturn(transformation, values)
		};
		this.tCacheStrings[id] = undefined;
	},

	clearTransformation:function (el) {
		if (Browser.ie) {
			el.setAttribute('transform', null);
		} else {
			el.removeAttribute('transform');
		}
		this.clearTransformationCache(el);
	},

	clearTransformationCache:function(el){
		this.tCache[this.get(el, 'id')] = undefined;
	},

	getTransformation:function (el, key) {
		var id = this.get(el, 'id');
		this.buildTransformationCacheIfNotExists(el, id);
		return this.tCache[id][key] ? this.tCache[id][key].readable : undefined;
	},

	buildTransformationCacheIfNotExists:function (el, id) {
		if (!this.hasTransformationCache(id)) {
			this.buildTransformationCache(el, id);
		}
	},

	getTransformationValues:function (el, key) {
		var ret = [];
		key = key.toLowerCase();
		var t = (this.get(el, 'transform') || '').toLowerCase();
		var pos = t.indexOf(key);
		if (pos >= 0) {
			t = t.substr(pos);
			var start = t.indexOf('(') + 1;
			var end = t.indexOf(')');
			var translate = t.substring(start, end);
			translate = translate.replace(/,/g, ' ');
			translate = translate.replace(/\s+/g, ' ');
			return translate.split(/[,\s]/g);
		}
		return ret;
	},

	/**
	 * @method hasTransformationCache
	 * @private
	 * @param {Number} id
	 * @return {Boolean}
	 */
	hasTransformationCache:function (id) {
		return this.tCache[id] !== undefined;
	},

	getValidReturn:function (transformation, values) {
		var ret = {};
		switch (transformation) {
			case 'skewX':
			case 'skewY':
				ret = values[0];
				break;
			case 'rotate':
				ret.degrees = values[0];
				ret.cx = values[1] ? values[1] : 0;
				ret.cy = values[2] ? values[2] : 0;
				break;
			default:
				ret.x = parseFloat(values[0]);
				ret.y = values[1] ? parseFloat(values[1]) : ret.x;

		}
		return ret;
	},

	/**
	 * @method buildTransformationCache
	 * @private
	 * @param {HTMLElement} el
	 * @param {String} id
	 */
	buildTransformationCache:function (el, id) {
		id = id || this.get(el, 'id');

		this.tCache[id] = {};
		var keys = this.getTransformationKeys(el);
		for (var i = 0; i < keys.length; i++) {

			var values = this.getTransformationValues(el, keys[i]);
			this.tCache[id][keys[i]] = {
				values:values,
				readable:this.getValidReturn(keys[i], values)
			};
		}
	},

	getTransformationKeys:function (el) {
		var ret = [];
		var t = this.get(el, 'transform') || '';
		var tokens = t.split(/\(/g);
		for (var i = 0; i < tokens.length-1; i++) {
			ret.push(tokens[i].replace(/[^a-z]/gi, ''));
		}
		return ret;
	},

	getTCache:function (el) {
		return this.tCache[this.get(el, 'id')];
	},

	getTransformationAsText:function(id){
		if(this.tCacheStrings[id] === undefined && this.tCache[id]!==undefined){
			this.buildCacheString(id);
		}
		return this.tCacheStrings[id];
	},

	buildCacheString:function(id){
		this.tCacheStrings[id] = '';
		var keys = Object.keys(this.tCache[id]);
		for(var i=0;i<keys.length;i++){
			this.tCacheStrings[id] += keys[i] + '(' + this.tCache[id][keys[i]].values.join(' ') + ') ';
		}
		this.tCacheStrings[id] = this.tCacheStrings[id].trim();
	},

	setStyle:function(el, key, value){
		el.style[String.camelCase(key)] = value;
	},

	classNameCache:{},
	addClass:function(el, className){
		if(!this.hasClass(el, className)){
			var id = this.getId(el);
			this.classNameCache[id].push(className);
			this.updateNodeClassNameById(el, id);
		}
		var cls = el.getAttribute('class');
		if(cls){
			cls = cls.split(/\s/g);
			if(cls.indexOf(className)>=0)return;
            cls.push(className);
            this.set(el, 'class', cls.join(' '));
		}else{
			this.set(el, 'class', className);
		}
	},

	hasClass:function(el, className){
		var id = this.getId(el);
		if(!this.classNameCache[id]){
			var cls = el.getAttribute('class');
			if(cls){
				this.classNameCache[id] = cls.split(/\s/g);
			}else{
				this.classNameCache[id] = [];
			}
		}
		return this.classNameCache[id].indexOf(className)>=0;
	},

	removeClass:function(el, className){
		if(this.hasClass(el, className)){
			var id = this.getId(el);
			this.classNameCache[id].erase(className);
			this.updateNodeClassNameById(el, id);
		}
	},

	updateNodeClassNameById:function(el, id){
		this.set(el, 'class', this.classNameCache[id].join(' '));
	},

	getId:function(el){
		if(!el.getAttribute('id')){
			el.setAttribute('id', String.uniqueID());
		}
		return el.getAttribute('id');
	}

});
ludo.canvasEngine = new ludo.canvas.Engine();
/**
 * @module Canvas
 */

/**
 Factory for new svg DOM nodes
 @namespace canvas
 @class Node
 @constructor
 @param {String} tag
 @param {Object} properties
 @optional
 @param {String} text
 @optional
 @example
 var paint = new ludo.canvas.Paint({
		'stroke-color' : '#000'
 	});
 var node = new ludo.canvas.Node('rect', { id:'myRect', x:20,y:20,width:100,height:100 , "class": paint, filter:filter });

 or
 @example
 var node = new ludo.canvas.Node('title', {}, 'My title' );

 */
ludo.canvas.Node = new Class({
	Extends:Events,
	el:undefined,
	tagName:undefined,

	/**
	 * Id of node
	 * @config {String} id
	 */
	id:undefined,

	initialize:function (tagName, properties, text) {

		properties = properties || {};
		properties.id = this.id = properties.id || 'ludo-svg-node-' + String.uniqueID();
		if (tagName !== undefined)this.tagName = tagName;
		this.createNode(this.tagName, properties);
		if (text !== undefined) {
			ludo.canvasEngine.text(this.el, text);
		}
	},

	createNode:function (el, properties) {
		if (properties !== undefined) {
			if (typeof el == "string") {
				el = this.createNode(el);
			}
			Object.each(properties, function (value, key) {
				if (value['getUrl'] !== undefined) {
					value = value.getUrl();
				}
				if (key.substring(0, 6) == "xlink:") {
					el.setAttributeNS("http://www.w3.org/1999/xlink", key.substring(6), value);
				} else {
					el.setAttribute(key, value);
				}
			});
		} else {
			el = document.createElementNS("http://www.w3.org/2000/svg", el);
		}

		this.el = el;
		el.style && (el.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
		return el;
	},

	getEl:function () {
		return this.el;
	},

	addEvent:function (event, fn) {
		console.log(event);
		switch (event.toLowerCase()) {
			case 'mouseenter':
				ludo.canvasEventManager.addMouseEnter(this, fn);
				break;
			case 'mouseleave':
				ludo.canvasEventManager.addMouseLeave(this, fn);
				break;
			default:
				this._addEvent(event, this.getDOMEventFn(event, fn), this.el);
		}
	},
	/**
	 * Add event to DOM element
	 * el is optional, default this.el
	 * @method _addEvent
	 * @param {String} ev
	 * @param {Function} fn
	 * @param {Object} el
	 * @private
	 */
	_addEvent:(function () {
		if (document.addEventListener) {
			return function (ev, fn, el) {
				if (el == undefined)el = this.el;
				el.addEventListener(ev, fn, false);
			}
		} else {
			return function (ev, fn, el) {
				if (el == undefined)el = this.el;
				el.attachEvent("on" + ev, fn);
			}
		}
	})(),
	getDOMEventFn:function (eventName, fn) {
		return  function (e) {
			e = e || window.event;

			var target = e.target || e.srcElement;
			while (target && target.nodeType == 3) target = target.parentNode;
			target = target['correspondingUseElement'] || target;
			e = {
				target:target,
				page:{
					x:(e.pageX != null) ? e.pageX : e.clientX + document.scrollLeft,
					y:(e.pageY != null) ? e.pageY : e.clientY + document.scrollTop
				},
				client:{
					x:(e.pageX != null) ? e.pageX - window.pageXOffset : e.clientX,
					y:(e.pageY != null) ? e.pageY - window.pageYOffset : e.clientY
				},
				event:e
			};
			if (fn) {
				fn.call(this, e, this, fn);
			}
			return false;
		}.bind(this);
	},

	/**
	 * Adopt a new node
	 * @method adopt
	 * @param {canvas.Element|canvas.Node} node node
	 * @return {canvas.Node} parent
	 */
	adopt:function (node) {
		this.el.appendChild(node.getEl());
		node.parentNode = this;
		return this;
	},

	getParent:function () {
		return this.parentNode;
	},

	set:function (key, value) {
		ludo.canvasEngine.set(this.el, key, value);
	},

	get:function (key) {
		return ludo.canvasEngine.get(this.el, key);
	},

	getTransformation:function (key) {
		return ludo.canvasEngine.getTransformation(this.el, key);
	},

	setTransformation:function (key, value) {
		ludo.canvasEngine.setTransformation(this.el, key, value);
	},

	translate:function (x, y) {
		ludo.canvasEngine.setTransformation(this.el, 'translate', x + ' ' + y);
	},

	getTranslate:function () {
		return ludo.canvasEngine.getTransformation(this.el, 'translate');
	},

	/**
	 * Apply filter to node
	 * @method applyFilter
	 * @param {canvas.Filter} filter
	 */
	applyFilter:function (filter) {
		this.set('filter', filter.getUrl());
	},
	/**
	 * Apply mask to node
	 * @method addMask
	 * @param {canvas.Node} mask
	 */
	applyMask:function (mask) {
		this.set('filter', mask.getUrl());
	},
	/**
	 Create url reference
	 @method url
	 @param {String} key
	 @param {canvas.Node|String} to
	 @example
	 node.url('filter', filterObj); // sets node property filter="url(#&lt;filterObj->id>)"
	 node.url('mask', 'MyMask'); // sets node property mask="url(#MyMask)"
	 */
	url:function (key, to) {
		this.set(key, to['getUrl'] !== undefined ? to.getUrl() : 'url(#' + to + ')');
	},

	href:function (url) {
		ludo.canvasEngine.set(this.el, 'xlink:href', url);
	},
	/**
	 * Update text content of node
	 * @method text
	 * @param {String} text
	 */
	text:function (text) {
		ludo.canvasEngine.text(this.el, text);
	},
	/**
	 Adds a new child DOM node
	 @method add
	 @param {String} tagName
	 @param {Object} properties
	 @param {String} text content
	 @optional
	 @return {ludo.canvas.Node} added node
	 @example
	 var filter = new ludo.canvas.Filter();
	 filter.add('feGaussianBlur', { 'stdDeviation' : 2, result:'blur'  });
	 */
	add:function (tagName, properties, text) {
		var node = new ludo.canvas.Node(tagName, properties, text);
		this.adopt(node);
		return node;
	},

	setStyle:function (key, value) {
		ludo.canvasEngine.setStyle(this.el, key, value);
	},

	/**
	 * Add css class to SVG node
	 * @method addClass
	 * @param {String} className
	 */
	addClass:function (className) {
		ludo.canvasEngine.addClass(this.el, className);
	},
	/**
	 Returns true if svg node has given css class name
	 @method hasClass
	 @param {String} className
	 @return {Boolean}
	 @example
	 var node = new ludo.canvas.Node('rect', { id:'myId2'});
	 ludo.dom.addClass(node, 'myClass');
	 alert(node.hasClass('myClass'));
	 */
	hasClass:function (className) {
		return ludo.canvasEngine.hasClass(this.el, className);
	},
	/**
	 Remove css class name from css Node
	 @method removeClass
	 @param {String} className
	 @example
	 var node = new ludo.canvas.Node('rect', { id:'myId2'});
	 ludo.dom.addClass(node, 'myClass');
	 ludo.dom.addClass(node, 'secondClass');
	 node.removeClass('myClass');
	 */
	removeClass:function (className) {
		ludo.canvasEngine.removeClass(this.el, className);
	},

	getId:function () {
		return this.id;
	},

	getUrl:function () {
		return 'url(#' + this.id + ')';
	},
	/**
	 * Returns bounding box of el as an object with x,y, width and height.
	 * @method getBBox
	 * @return {Object}
	 */
	getBBox:function () {
		return this.el.getBBox();
	},

	/**
	 * The nearest ancestor 'svg' element. Null if the given element is the outermost svg element.
	 * @method getCanvas
	 * @return {ludo.canvas.Node.el} svg
	 */
	getCanvas:function () {
		return this.el.ownerSVGElement;
	},
	/**
	 * The element which established the current viewport. Often, the nearest ancestor ‘svg’ element. Null if the given element is the outermost svg element
	 * @method getViewPort
	 * @return {ludo.canvas.Node.el} svg
	 */
	getViewPort:function () {
		return this.el.viewPortElement;
	},

	scale:function (width, height) {
		ludo.canvasEngine.scale(this.el, width, height);
	},
	setTransformMatrix:function (el, a, b, c, d, e, f) {

		this.setTransformMatrix(this.el, a, b, c, d, e, f);
	}
});



/**
 * Base class for Canvas elements. canvas.Element can be handled as
 * {{#crossLink "canvas.Node"}}{{/crossLink}}, but it extends ludo.Core which
 * make it accessible using ludo.get('id'). The {{#crossLink "canvas.Node"}}{{/crossLink}} object
 * can be accessed using {{#crossLink "canvas.Element/getNode"}}{{/crossLink}}. A canvas.Element
 * object can be adopted to other elements or nodes using the  {{#crossLink "canvas.Element/adopt"}}{{/crossLink}}
 * or  {{#crossLink "canvas.Node/adopt"}}{{/crossLink}} methods.
 * A canvas element contains methods for transformations and other
 * @namespace canvas
 * @class Element
 * @extends ludo.Core
 */
ludo.canvas.Element = new Class({
	Extends:ludo.Core,
	node:undefined,

	/**
	 * Which tag, example: "rect"
	 * @config {String} tag
	 */
	tag:undefined,

	engine:ludo.canvasEngine,
	/**
	 * Properties
	 * @config {Object} p
	 */
	p:undefined,

	/**
	 Attributes applied to DOM node
	 @config attr
	 @type {Object}
	 @default undefined
	 @example
	 	{
			x1:50,y1:50,x2:100,y2:150
		}
	 */
	attr:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.tag !== undefined)this.tag = config.tag;
		if (config.attr !== undefined)this.attr= config.attr;
		this.node = new ludo.canvas.Node(this.tag, this.attr);
	},

	/**
	 * Return canvas node for this element
	 * @method getNode
	 * @return {canvas.Node} node
	 */
	getNode:function(){
		return this.node;
	},

	getEl:function () {
		return this.node.el;
	},

	set:function (key, value) {
		this.engine.set(this.getEl(), key, value);
	},

	/**
	 Returns value of an attribute
	 @method get
	 @param key
	 @return {String} value
	 @example
	 	var element = new ludo.canvas.Element('rect', {
	 		attr:{x1:100,y1:150,x2:200,y2:250}
	 	});
	 	alert(element.get('x1')); // outputs 100
	 */
	get:function (key) {
		return this.engine.get(this.getEl(), key);
	},

	setHtml:function (html) {
		this.engine.setHtml(this.getEl(), html);
	},

	rotate:function (degrees) {
		this.engine.rotate(this.getEl(), degrees);
	},
	toFront:function () {
		this.engine.toFront(this.getEl());
	},
	toBack:function () {
		this.engine.toBack(this.getEl());
	},
	skewX:function (degrees) {
		this.engine.skewX(this.getEl(), degrees);
	},
	skewY:function (degrees) {
		this.engine.skewY(this.getEl(), degrees);
	},

	/**
	 * Adopt element or node
	 * @method adopt
	 * @param {canvas.Element|canvas.Node} node
	 * @return {canvas.Element} parent
	 */
	adopt:function(node){
		this.node.adopt(node);
		return this;
	},

	add:function(tagName, properties, config){
		return this.node.add(tagName,properties, config);
	}
});
/**
 Class used to create canvas(&lt;SVG>) object
 @namespace canvas
 @class Canvas
 @constructor
 @param {Object} config
 @example
 	var canvas = new ludo.canvas.Canvas({
 		renderTo:'idOfDiv'
 	});
 */
ludo.canvas.Canvas = new Class({
	Extends:ludo.canvas.Element,
	tag:'svg',
	defaultProperties:{
		xmlns:'http://www.w3.org/2000/svg',
		version:'1.1'
	},
	renderTo:undefined,
	view:undefined,
	title:undefined,
	description:undefined,

	ludoConfig:function (config) {
		config = config || {};
		config.attr = config.attr || {};
		config.attr = Object.merge(config.attr, this.defaultProperties);
		this.parent(config);

		if (config.renderTo !== undefined)this.renderTo = config.renderTo;
		if (config.title !== undefined)this.title = config.title;
		if (config.description !== undefined)this.description = config.description;

		if(this.title)this.createTitle();
		if(this.description)this.createDescription();

		if (this.renderTo !== undefined) {
			if(this.renderTo.getBody !== undefined){
				this.view = this.renderTo;
				this.view.addEvent('resize', this.fitParent.bind(this));
				this.renderTo = this.view.getBody();
			}else{
				this.renderTo = document.id(this.renderTo);
			}
			this.renderTo.adopt(this.getEl());
			this.setInitialSize(config);
		}
	},

	setInitialSize:function (config) {
		config.width = config.width || this.width;
		config.height = config.height || this.height;
		if (config.width && config.height) {
			this.set('width', config.width);
			this.set('height', config.height);
			this.setViewBox(config.width, config.height);
			this.width = config.width;
			this.height = config.height;
		} else {
			this.fitParent();
			this.renderTo.addEvent('resize', this.fitParent.bind(this));
		}
	},

	fitParent:function(){
		size = this.renderTo.getSize();
		if(size.x === 0 || size.y === 0)return;
		size.x -= (ludo.dom.getPW(this.renderTo) + ludo.dom.getBW(this.renderTo));
		size.y -= (ludo.dom.getPH(this.renderTo) + ludo.dom.getBH(this.renderTo));
		this.set('width', size.x);
		this.set('height', size.y);
		this.setViewBox(size.x, size.y);

		this.node.setStyle('width', size.x + 'px');
		this.node.setStyle('height', size.y + 'px');
		this.width = size.x;
		this.height = size.y;
		this.fireEvent('resize', size);
	},

	getHeight:function(){
		return this.height;
	},

	getWidth:function(){
		return this.width;
	},

	/**
	 * Update view box size
	 * @method setViewBox
	 * @param width
	 * @type {Number}
	 * @param height
	 * @type {Number}
	 * @param x
	 * @type {Number}
	 * @optional
	 * @param y
	 * @type {Number}
	 * @optional
	 */
	setViewBox:function (width, height, x, y) {
		x = x || 0;
		y = y || 0;
		this.set('viewBox', x + ' ' + y + ' ' + width + ' ' + height);
	},

	createTitle:function(){
		this.adopt(new ludo.canvas.Node('title',{}, this.title ));
	},
	createDescription:function(){
		this.adopt(new ludo.canvas.Node('desc', {}, this.description ));
	},
	defsNode:undefined,

	/**
	 * Returns reference to &lt;defs> node
	 * @method getDefs
	 * @return {canvas.Node} defs node
	 */
	getDefs:function(){
		if(this.defsNode === undefined){
			this.defsNode = new ludo.canvas.Node('defs');
			this.adopt(this.defsNode);
		}
		return this.defsNode;
	},

	/**
	 * Adopt node into &lt;defs> tag of canvas
	 * @method adoptDef
	 * @param {canvas.Node|canvas.Element} node
	 * @return {canvas.Node} defs Node
	 */
	adoptDef:function(node){
		return this.getDefs().adopt(node);
	}
});
ludo.layout.TextBox = new Class({
	Extends:ludo.canvas.Canvas,
	rotation:270,
	text:undefined,
	className:undefined,
	width:200, height:200,
	size:{
		x:0, y:0
	},
	x:0, y:0,
	ludoConfig:function (config) {
		this.text = config.text;
		this.rotation = config.rotation;
		this.className = config.className;
		this.renderTo = config.renderTo;
		if (config.x !== undefined)this.x = config.x;
		if (config.y !== undefined)this.y = config.y;

		if (document.createElementNS === undefined) {
			this.createIE8Box(config);
			return;
		}
		this.parent(config);

		this.createStyles();
		this.renderText();
		this.storeSize();
		this.rotate();
		this.resizeCanvas();
	},

	createIE8Box:function () {
		var span = document.createElement('span');
		document.id(this.renderTo).appendChild(span);
		span.innerHTML = this.text;
		this.setIE8Transformation(span);
		return span;
	},

	setIE8Transformation:function (span) {
		var s = span.style;
		s.display = 'block';
		s.visibility = 'hidden';
		s.position = 'absolute';
		span.className = this.className;
		document.body.adopt(span);

		s.fontSize = '12px';
		s.fontWeight = 'normal';
		s.filter = "progid:DXImageTransform.Microsoft.Matrix(" + this.getIE8Transformation() + ", sizingMethod='auto expand')";
		s.height = span.offsetHeight + 'px';
		this.size.x = span.offsetWidth;
		this.size.y = span.offsetHeight;
		if (this.rotation === 90) {
			s.right = '0px';
		}
		s.visibility = 'visible';
		document.id(this.renderTo).appendChild(span);

	},

	deg2radians:Math.PI * 2 / 360,
	getIE8Transformation:function () {
		var rad = this.rotation * this.deg2radians;
		var costheta = Math.cos(rad);
		var sintheta = Math.sin(rad);
		return ['M11=' + costheta, 'M12=' + (sintheta * -1), 'M21=' + sintheta, 'M22=' + costheta].join(',');
	},
	resizeCanvas:function () {
		var size = this.getSize();
		this.setViewBox(size.x, size.y);
		this.set('width', size.x);
		this.set('height', size.y);
	},

	createStyles:function () {
		this.styles = this.getStyles();
		var p = this.paint = new ludo.canvas.Paint(this.styles);
		this.adoptDef(p);
	},

	renderText:function () {
		var el = this.textNode = new ludo.canvas.Node('text', { x:this.x, y:this.y + parseInt(this.styles['font-size']), "class":this.paint});
		el.text(this.text);
		this.adopt(el);
	},

	getStyles:function () {
		var node = new Element('div');
		node.className = this.className;
		node.style.display = 'none';
		document.body.adopt(node);

		var lh = node.getStyle('line-height').replace(/[^0-9]/g, '');
		if (!lh) {
			lh = node.getStyle('font-size');
		}

		var ret = {
			'font-size':node.getStyle('font-size'),
			'font-family':node.getStyle('font-family'),
			'font-weight':node.getStyle('font-weight'),
			'font-style':node.getStyle('font-style'),
			'line-height':lh,
			'fill':node.getStyle('color'),
			'stroke':'none',
			'stroke-opacity':0
		};
		ret['line-height'] = ret['line-height'] || ret['font-size'];
		document.body.removeChild(node);
		return ret;
	},
	storeSize:function () {
		var bbox = this.textNode.el.getBBox();
		this.size = {
			x:bbox.width + bbox.x,
			y:bbox.height + bbox.y
		};
	},
	rotate:function () {
		var x = this.size.x;
		var y = this.size.y;
		var yOffset = (this.size.y - parseInt(this.styles['line-height'])) / 2;
		var transformation = '';
		switch (this.rotation) {
			case 270:
				transformation = 'translate(' + (yOffset * -1) + ' ' + x + ') rotate(' + this.rotation + ')';
				break;
			case 180:
				transformation = 'rotate(' + this.rotation + ' ' + (x / 2) + ' ' + (y / 2) + ')';
				break;
			case 90:
				transformation = 'translate(' + (y - yOffset) + ' ' + 0 + ') rotate(' + this.rotation + ')';
				break;
			case 0:
				transformation = 'translate(0 ' + (yOffset * -1) + ')';

		}
		this.textNode.set('transform', transformation);
	},

	getSize:function () {
		switch (this.rotation) {
			case 270:
			case 90:
				return { x:this.size.y, y:this.size.x };
			default:
				return this.size;

		}
	}
});
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

	measureDiv:undefined,

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
			parentEl.adopt(child.getEl());
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
	}
});
/**
 * Abstract base class for linear layouts
 * @namespace layout
 * @class Linear
 */
ludo.layout.Linear = new Class({
	Extends:ludo.layout.Base,

	onNewChild:function (child) {
		this.parent(child);
		this.updateLayoutObject(child);
		child.addEvent('collapse', this.resize.bind(this));
		child.addEvent('expand', this.resize.bind(this));
		child.addEvent('minimize', this.resize.bind(this));
		child.addEvent('maximize', this.resize.bind(this));
	},

	updateLayoutObject:function (child) {
		child.layout = child.layout || {};
		child.layout.width = child.layout.width || child.width;
		child.layout.height = child.layout.height || child.height;
		child.layout.weight = child.layout.weight || child.weight;
		child.layout.resizable = child.layout.resizable || child.resizable;
		child.layout.minWidth = child.layout.minWidth || child.minWidth;
		child.layout.maxWidth = child.layout.maxWidth || child.maxWidth;
		child.layout.minHeight = child.layout.minHeight || child.minHeight;
		child.layout.maxHeight = child.layout.maxHeight || child.maxHeight;
	},

	isResizable:function (child) {
		return child.layout.resizable ? true : false;
	},

	getWidthOf:function (child) {
		return child.layout.width;
	},

	getHeightOf:function (child) {
		return child.layout.height;
	},

	beforeResize:function (resize, child) {
		if (resize.orientation === 'horizontal') {
			resize.setMinWidth(child.layout.minWidth || 10);
			resize.setMaxWidth(child.layout.maxWidth || this.view.getBody().offsetWidth);
		} else {
			resize.setMinHeight(child.layout.minHeight || 10);
			resize.setMaxHeight(child.layout.maxHeight || this.view.getBody().offsetHeight);
		}
	},

	getResizableFor:function (child, r) {
		var resizeProp = (r === 'left' || r === 'right') ? 'width' : 'height';
		return new ludo.layout.Resizer({
			name:'resizer-' + child.name,
			orientation:(r === 'left' || r === 'right') ? 'horizontal' : 'vertical',
			pos:r,
			renderTo:this.view.getBody(),
			layout:{ width:5,height:5 },
			view:child,
			listeners:{
				'resize':function (change) {
					child.layout[resizeProp] += change;
					this.resize();
				}.bind(this),
				'before':this.beforeResize.bind(this)
			}
		});
	}

});
/**
 * This class arranges child views in a row layout.
 * @namespace layout
 * @class LinearVertical
 *
 */
ludo.layout.LinearHorizontal = new Class({
	Extends:ludo.layout.Linear,

	resize:function () {
		var totalWidth = this.view.getInnerWidthOfBody();
		var height;
		if (this.hasDynamicHeight()) {
			height = 'auto';
		} else {
			height = this.view.getInnerHeightOfBody();
		}

		if (height == 0) {
			return;
		}

		var totalWidthOfItems = 0;
		var totalWeight = 0;
		for (var i = 0; i < this.view.children.length; i++) {
			if (this.view.children[i].isVisible()) {
				if (!this.hasLayoutWeight(this.view.children[i])) {
					var width = this.getWidthOf(this.view.children[i]);
					if (width) {
						totalWidthOfItems += width
					}
				} else {
					totalWeight += this.view.children[i].layout.weight;
				}
			}
		}
		totalWeight = Math.max(1, totalWeight);
		var remainingWidth;
		totalWidth = remainingWidth = totalWidth - totalWidthOfItems;

		var currentLeft = 0;
		for (i = 0; i < this.view.children.length; i++) {
			if (this.view.children[i].isVisible()) {
				var config = { 'height':height, 'left':currentLeft };
				if (this.hasLayoutWeight(this.view.children[i])) {
					if (this.view.children[i].id == this.idLastDynamic) {
						config.width = remainingWidth;
					} else {
						config.width = Math.round(totalWidth * this.view.children[i].layout.weight / totalWeight);
						remainingWidth -= config.width;
					}
				} else {
					config.width = this.getWidthOf(this.view.children[i]);
				}
				this.resizeChild(this.view.children[i], config);
				currentLeft += config.width;
			}
		}

		for (i = 0; i < this.resizables.length; i++) {
			this.resizables[i].colResize();
		}
	},

	resizeChild:function (child, resize) {
		child.layout.width = resize.width;
		child.layout.left = resize.left;
		child.resize(resize);
		child.saveState();
	},

	onNewChild:function (child) {
		this.parent(child);
		child.getEl().style.position = 'absolute';

		if (this.isResizable(child)) {
			var isLastSibling = this.isLastSibling(child);
			var resizer = this.getResizableFor(child, isLastSibling ? 'left' : 'right');
			this.addChild(resizer, child, isLastSibling ? 'before' : 'after');
		}
	},

	hasDynamicHeight:function () {
		return this.view.layout.height && this.view.layout.height == 'dynamic';
	}
});
/**
 * This class arranges child views in a column layout (side by side).
 * @namespace layout
 * @class LinearVertical
 *
 */
ludo.layout.LinearVertical = new Class({
	Extends:ludo.layout.Linear,
	onCreate:function(){
		this.parent();
	},
	resize:function () {

		var componentHeight = this.view.getInnerHeightOfBody();
		if (componentHeight == 0) {
			return;
		}
		var totalHeightOfItems = 0;
		var totalWeight = 0;
		var height;
		var tm = 0;
		for (var i = 0; i < this.view.children.length; i++) {
			if (!this.hasLayoutWeight(this.view.children[i])) {
				if (!this.view.children[i].isHidden()) {
					height = this.getHeightOf(this.view.children[i]);
				} else {
					height = 0;
				}
				if (height) {
					totalHeightOfItems += height
				}
			} else {
				if (!this.view.children[i].isHidden()) {
					totalWeight += this.view.children[i].layout.weight;
				}
			}
		}

		totalWeight = Math.max(1, totalWeight);

        var remainingHeight;
		var stretchHeight = remainingHeight = (componentHeight - totalHeightOfItems);

		var width = ludo.dom.getInnerWidthOf(this.view.getBody());
		// var currentTop = 0;
		for (i = 0; i < this.view.children.length; i++) {
			if(!this.view.children[i].isHidden()){
				var config = { width:width };
				if (this.hasLayoutWeight(this.view.children[i])) {
					if (this.view.children[i].id == this.idLastDynamic) {
						config.height = remainingHeight;
					} else {
						config.height = Math.round(stretchHeight * this.view.children[i].layout.weight / totalWeight);
						remainingHeight -= config.height;
					}
				} else {
					config.height = this.getHeightOf(this.view.children[i]);
				}
				if (config.height < 0) {
					config.height = undefined;
				}
				if(tm > 0){
					config.top = tm;
				}
				if(this.view.children[i].getEl().style.position === 'absolute'){
					tm += this.view.children[i].getHeight();
				}

				this.resizeChild(this.view.children[i], config);
			}
		}
	},
	resizeChild:function (child, resize) {
		child.layout.height = resize.height;
		child.resize(resize);
		child.saveState();
	},

	onNewChild:function (child) {
		this.parent(child);
		if (this.isResizable(child)) {
			var isLastSibling = this.isLastSibling(child);
			var resizer = this.getResizableFor(child, isLastSibling ? 'above' : 'below');
			this.addChild(resizer, child, isLastSibling ? 'before' : 'after');
		}
	}
});
ludo.layout.Card = new Class({
	Extends:ludo.layout.Base,
	visibleCard:undefined,

	animate:false,
	initialAnimate:false,
	animationDuration:.25,
	animateX:true,
	touchConfig:{},

	onCreate:function () {
		this.parent();
		var l = this.view.layout;
		if (l.animate !== undefined)this.animate = l.animate;
		if (l.animationDuration !== undefined)this.animationDuration = l.animationDuration;
		if (l.animateX !== undefined)this.animateX = l.animateX;
		this.initialAnimate = this.animate;

		if (this.animate) {
			this.addEvent('highercard', this.animateHigherCard.bind(this));
			this.addEvent('lowercard', this.animateLowerCard.bind(this));
		}

	},
	addChild:function (child, insertAt, pos) {
		if (!child.layout || !child.layout.visible)child.hidden = true;
		return this.parent(child, insertAt, pos);
	},
	onNewChild:function (child) {
		this.parent(child);
		child.getEl().style.position = 'absolute';
		child.addEvent('show', this.setVisibleCard.bind(this));
		if (this.shouldSetCardVisible(child)) {
			this.visibleCard = child;
			child.show();
		}
		this.addDragEvents(child);
	},

	addDragEvents:function (child) {
		if (ludo.util.isTabletOrMobile()) {
			child.getBody().addEvent('touchstart', this.touchStart.bind(this));
			child.getEventEl().addEvent('touchmove', this.touchMove.bind(this));
			child.getEventEl().addEvent('touchend', this.touchEnd.bind(this));
		} else {
			child.getBody().addEvent('mousedown', this.touchStart.bind(this));
			child.getEventEl().addEvent('mousemove', this.touchMove.bind(this));
			child.getEventEl().addEvent('mouseup', this.touchEnd.bind(this));
		}
	},

	resize:function () {
		if (this.visibleCard === undefined) {
			this.view.children[0].show();
		}
		var height = this.view.getInnerHeightOfBody();
		var width = ludo.dom.getInnerWidthOf(this.view.getBody());
		var card = this.getVisibleCard();
		if (card) {
			card.resize({ height:height, width:width });
		}
	},

	getVisibleCard:function () {
		return this.visibleCard;
	},

	shouldSetCardVisible:function (card) {
		return card.layout && card.layout.visible == true;
	},

	/**
	 * Return reference to previus card of passed card
	 * @method getPreviousCardOf
	 * @param {Object} card.Card
	 * @return card.Card
	 */
	getPreviousCardOf:function (card) {
		var index = this.view.children.indexOf(card);
		if (index > 0) {
			return this.view.children[index - 1];
		}
		return null;
	},

	getNextCardOf:function (card) {
		var index = this.view.children.indexOf(card);
		if (index < this.view.children.length - 1) {
			return this.view.children[index + 1];
		}
		return undefined;
	},

	/**
	 * Show previous card of current visible card
	 * @method showPreviousCard
	 * @param {Boolean} skipAnimation (optional)
	 * @return {Boolean} success
	 */
	showPreviousCard:function (skipAnimation) {
		if (skipAnimation) {
			this.temporaryDisableAnimation();
		}
		if (this.visibleCard) {
			var card = this.getPreviousCardOf(this.visibleCard);
			if (card !== undefined) {
				card.show();
				return true;
			}
		}
		return false;
	},

	/**
	 * Show next card of current visible card
	 * @method showNextCard
	 * @param {Boolean} skipAnimation (optional)
	 * @return {Boolean} success
	 */
	showNextCard:function (skipAnimation) {
		if (skipAnimation) {
			this.temporaryDisableAnimation();
		}
		if (this.visibleCard) {
			var card = this.getNextCardOf(this.visibleCard);
			if (card !== undefined) {
				card.show();
				return true;
			}
		}
		return false;
	},


	temporaryDisableAnimation:function () {
		this.animate = false;
		this.resetAnimation.delay(500, this);
	},

	resetAnimation:function () {
		this.animate = this.initialAnimate;
	},

	setTemporaryZIndexOfVisibleCard:function () {
		var zIndex = ludo.util.getNewZIndex(this.visibleCard);
		this.visibleCard.getEl().style.zIndex = zIndex + 100;
	},

	/**
	 * Show a card with this name
	 * @method showCard
	 * @param {String} name
	 * @return {Boolean} success
	 */
	showCard:function (name) {
		if (this.view.child[name]) {
			this.view.child[name].show();
			return true;
		}
		return false;
	},
	/**
	 * Return true if passed card is last card in deck
	 * @method isLastCard
	 * @param {Object} card.Card
	 * @return Boolean
	 */
	isLastCard:function (card) {
		return this.view.children.indexOf(card) == this.view.children.length - 1;
	},
	/**
	 * Return true if passed card is first card in deck
	 * @method isFirstCard
	 * @param {Object} card.Card
	 * @return {Boolean}
	 */
	isFirstCard:function (card) {
		return this.view.children.indexOf(card) == 0;
	},

	setVisibleCard:function (card) {

		this.removeValidationEvents();

		var indexDiff = 0;
		if (this.visibleCard) {
			var indexOld = this.view.children.indexOf(this.visibleCard);
			var indexNew = this.view.children.indexOf(card);
			indexDiff = indexNew - indexOld;
		}

		this.visibleCard = card;

		this.addValidationEvents();

		if (indexDiff > 0) {
			/**
			 * Event fired when a higher card than current is shown
			 * @event highercard
			 * @param {card.Deck} this deck
			 * @param {card.Card} shown card
			 */
			this.fireEvent('highercard', [this, card]);
		} else if (indexDiff < 0) {
			/**
			 * Event fired when a lower card than current is shown
			 * @event lowercard
			 * @param {card.Deck} this deck
			 * @param {card.Card} shown card
			 */
			this.fireEvent('lowercard', [this, card]);
		}

		/**
		 * Event fired when a card is shown
		 * @event showcard
		 * @param {card.Deck} this deck
		 * @param {card.Card} shown card
		 */
		this.fireEvent('showcard', [this, this.visibleCard]);

		if (this.isLastCard(card)) {
			/**
			 * Event fired when last card of deck is shown
			 * @event lastcard
			 * @param {card.Deck} this card
			 * @param {card.Card} shown card
			 */
			this.fireEvent('lastcard', [this, card]);
		} else {
			/**
			 * Event fired when na card which is not the last card in the deck is shown
			 * @event notlastcard
			 * @param {card.Deck} this card
			 * @param {card.Card} shown card
			 */
			this.fireEvent('notlastcard', [this, card]);
		}
		if (this.isFirstCard(card)) {
			/**
			 * Event fired when first card of deck is shown
			 * @event firstcard
			 * @param {card.Deck} this card
			 * @param {card.Card} shown card
			 */
			this.fireEvent('firstcard', [this, card]);
		}
		else {
			/**
			 * Event fired when a card which is not the first card in the deck is shown
			 * @event notfirstcard
			 * @param {card.Deck} this card
			 * @param {card.Card} shown card
			 */
			this.fireEvent('notfirstcard', [this, card]);
		}
	},

	removeValidationEvents:function () {
		if (this.visibleCard) {
			this.visibleCard.removeEvent('invalid', this.setInvalid);
			this.visibleCard.removeEvent('valid', this.setValid);
		}
	},

	addValidationEvents:function () {
		var manager = this.visibleCard.getFormManager();
		manager.addEvent('invalid', this.setInvalid.bind(this));
		manager.addEvent('valid', this.setValid.bind(this));
		manager.validate();
	},
	setInvalid:function () {
		this.fireEvent('invalid', this);
	},

	setValid:function () {
		this.fireEvent('valid', this);
	},
	/**
	 * Show first card in deck
	 * @method showFirstCard
	 * @return void
	 */
	showFirstCard:function () {
		if (this.view.children.length > 0)this.view.children[0].show();
	},
	/**
	 * Show last card in deck
	 * @method showLastCard
	 * @return void
	 */
	showLastCard:function () {
		if (this.view.children.length > 0)this.view.children[this.view.children.length - 1].show();
	},
	button:{},
	registerButton:function (button) {

		this.button[button.name || button.id] = button;

	},
	getButton:function (ref) {
		return this.button[ref];
	},
	/**
	 * Returns true if form of current card is valid
	 * @method isValid
	 * @public
	 * @return {Boolean}
	 */
	isValid:function () {
		if (this.visibleCard) {
			return this.visibleCard.isFormValid();
		}
		return true;
	},
	/**
	 * Return number of cards in deck
	 * @method getCountCards
	 * @return {Number} count cards
	 */
	getCountCards:function () {
		return this.view.children.length;
	},
	/**
	 * Return index of visible card
	 * @method getIndexOfVisibleCard
	 * @return {Number} card index
	 */
	getIndexOfVisibleCard:function () {
		if (this.visibleCard) {
			return this.view.children.indexOf(this.visibleCard);
		}
		return 0;
	},

	/**
	 * true if first card in deck is shown.
	 * @method isOnFirstCard
	 * @return {Boolean} is on first card
	 */
	isOnFirstCard:function () {
		return this.getIndexOfVisibleCard() == 0;
	},
	/**
	 * true if last card in deck is shown.
	 * @method isOnLastCard
	 * @return {Boolean} is on last card
	 */
	isOnLastCard:function () {
		return this.getIndexOfVisibleCard() == this.view.children.length - 1;
	},

	/**
	 * Returns percentage position of current visible card.
	 * @method getPercentCompleted
	 * @return {Number} percent
	 */
	getPercentCompleted:function () {
		return Math.round((this.getIndexOfVisibleCard() + 1 ) / this.view.children.length * 100);
	},

	animateHigherCard:function () {
		if (!this.animate)return;
		if (this.animateX) {
			this.animateFromRight();
		} else {
			this.animateFromBottom();
		}

	},
	animateLowerCard:function () {
		if (!this.animate)return;
		if (this.animateX) {
			this.animateFromLeft();
		} else {
			this.animateFromTop();
		}
	},

	getAnimationDuration:function () {
		return this.animationDuration * 1000;
	},

	animateFromRight:function () {
		this.animateAlongX(this.visibleCard.getParent().getBody().offsetWidth, 0);
	},

	animateFromLeft:function () {
		this.animateAlongX(this.visibleCard.getParent().getBody().offsetWidth * -1, 0);
	},

	animateFromTop:function () {
		this.animateAlongY(this.visibleCard.getParent().getBody().offsetHeight * -1, 0);
	},

	animateFromBottom:function () {
		this.animateAlongY(this.visibleCard.getParent().getBody().offsetHeight, 0);
	},

	animateAlongX:function (from, to) {
		this.visibleCard.getEl().style.left = from + 'px';
		this.getFx().start({
			'left':[from, to]
		});
	},

	animateAlongY:function (from, to) {
		this.visibleCard.getEl().style.top = from + 'px';
		this.getFx().start({
			'top':[from, to]
		});
	},
	fx:{},

	getFx:function () {
		if (this.fx[this.visibleCard.id] === undefined) {
			this.fx[this.visibleCard.id] = new Fx.Morph(this.visibleCard.getEl(), {
				duration:this.getAnimationDuration()
			});
			this.fx[this.visibleCard.id].addEvent('complete', this.animationComplete.bind(this));
		}
		return this.fx[this.visibleCard.id];
	},

	animationComplete:function (el) {
		el.style.left = '0px';
		el.style.top = '0px';
	},

	touchStart:function (e) {
		if (this.isOnFormElement(e.target))return undefined;
		var isFirstCard = this.isFirstCard(this.visibleCard);
		var isValid = this.visibleCard.isFormValid();
		if (!isValid && isFirstCard) {
			return undefined;
		}

		var isLastCard = this.isLastCard(this.visibleCard);
		this.renderNextAndPreviousCard();
		var animateX = this.shouldAnimateOnXAxis();
		var parentSize = animateX ? this.view.getEl().offsetWidth : this.view.getEl().offsetHeight;
		this.touchConfig = {
			active:true,
			pos:animateX ? e.page.x : e.page.y,
			previousCard:this.getPreviousCardOf(this.visibleCard),
			nextCard:this.getNextCardOf(this.visibleCard),
			animateX:animateX,
			zIndex:this.visibleCard.getEl().getStyle('z-index'),
			max:isFirstCard ? 0 : parentSize,
			min:(isLastCard || !isValid) ? 0 : parentSize * -1,
			previousPos:0
		};
		if (e.target.tagName.toLowerCase() == 'img') {
			return false;
		}
		return false;
	},

	shouldAnimateOnXAxis:function () {
		return this.animateX;
	},

	touchMove:function (e) {
		if (this.touchConfig && this.touchConfig.active) {
			var pos;
			var key;
			if (this.touchConfig.animateX) {
				pos = e.page.x - this.touchConfig.pos;
				key = 'left';
			} else {
				pos = e.page.x - this.touchConfig.pos;
				key = 'top'
			}

			pos = Math.min(pos, this.touchConfig.max);
			pos = Math.max(pos, (this.touchConfig.min));

			this.setZIndexOfOtherCards(pos);
			this.touchConfig.previousPos = pos;
			this.visibleCard.els.container.style[key] = pos + 'px';
			return false;
		}
		return undefined;
	},

	setZIndexOfOtherCards:function (pos) {

		if (pos > 0 && this.touchConfig.previousPos <= 0) {
			if (this.touchConfig.nextCard) {
				this.touchConfig.nextCard.getEl().style.zIndex = (this.touchConfig.zIndex - 3);
			}
			if (this.touchConfig.previousCard) {
				this.touchConfig.previousCard.getEl().style.zIndex = this.touchConfig.zIndex - 1;
			}
		} else if (pos < 0 && this.touchConfig.previousPos >= 0) {
			if (this.touchConfig.nextCard) {
				this.touchConfig.nextCard.getEl().style.zIndex = this.touchConfig.zIndex - 1;
			}
			if (this.touchConfig.previousCard) {
				this.touchConfig.previousCard.getEl().style.zIndex = this.touchConfig.zIndex - 3;
			}
		}
	},

	touchEnd:function () {
		if (this.touchConfig.active) {
			this.touchConfig.active = false;
			var pos = this.touchConfig.previousPos;
			if (pos > 0 && this.touchConfig.max && pos > (this.touchConfig.max / 2)) {
				this.animateToPrevious();
			} else if (pos < 0 && pos < (this.touchConfig.min / 2)) {
				this.animateToNext();
			} else {
				if (this.touchConfig.animateX) {
					this.visibleCard.getEl().style.left = '0px';
				} else {
					this.visibleCard.getEl().style.top = '0px';
				}
			}
		}
	},

	isOnFormElement:function (el) {
		var tag = el.tagName.toLowerCase();
		return tag == 'input' || tag == 'textarea';
	},

	renderNextAndPreviousCard:function () {
		this.setTemporaryZIndexOfVisibleCard();

		var id = this.visibleCard.id;

		this.temporaryDisableAnimation();
		var card;
		var skipEvents = true;
		if (card = this.getPreviousCardOf(ludo.get(id))) {
			card.show(skipEvents);
			//this.view.resizeChildren();
		}
		if (card = this.getNextCardOf(ludo.get(id))) {
			card.show(skipEvents);
		}
		ludo.get(id).show();

	},

	animateToPrevious:function () {
		if (this.touchConfig.animateX) {
			this.animateAlongX(ludo.dom.getNumericStyle(this.visibleCard.getEl(), 'left'), this.view.getEl().offsetWidth);
		} else {
			this.animateAlongY(ludo.dom.getNumericStyle(this.visibleCard.getEl(), 'top'), this.view.getEl().offsetHeight);
		}
		this.showPreviousCard.delay(this.getAnimationDuration(), this, true);
	},

	animateToNext:function () {
		if (this.touchConfig.animateX) {
			this.animateAlongX(ludo.dom.getNumericStyle(this.visibleCard.getEl(), 'left'), this.view.getEl().offsetWidth * -1);
		} else {
			this.animateAlongX(ludo.dom.getNumericStyle(this.visibleCard.getEl(), 'top'), this.view.getEl().offsetHeight * -1);
		}
		this.showNextCard.delay(this.getAnimationDuration(), this, true);
	}
});

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
/**
 * @namespace layout
 * @class Renderer
 */
ludo.layout.Renderer = new Class({
	// TODO Support top and left resize of center aligned dialogs
	rendering:{},
	view:undefined,
	options:['width', 'height',
		'rightOf', 'leftOf', 'below', 'above',
		'alignLeft', 'alignRight', 'alignTop', 'alignBottom',
		'sameHeightAs', 'sameWidthAs',
		'offsetWidth','offsetHeight',
		'centerIn',
		'left','top',
		'offsetX', 'offsetY'],
	fn:undefined,
	viewport:{
		x:0, y:0, width:0, height:0
	},
	coordinates:{
		left:undefined,
		right:undefined,
		above:undefined,
		below:undefined,
		width:undefined,
		height:undefined
	},
	lastCoordinates:{},

	initialize:function (config) {
		this.view = config.view;
		this.rendering = this.view.layout || {};
		this.fixReferences();
		this.setDefaultProperties();
		this.view.addEvent('show', this.resize.bind(this));
		this.resize();
		this.addResizeEvent();
	},

	fixReferences:function () {
		var el;
		var hasReferences = false;
		if(this.rendering.x){
			this.rendering.left = this.rendering.x;
			this.rendering.x = undefined;
		}
		if(this.rendering.y){
			this.rendering.top = this.rendering.y;
			this.rendering.y = undefined;
		}
		for (var i = 0; i < this.options.length; i++) {
			var key = this.options[i];
			switch (key) {
				case 'offsetX':
				case 'offsetY':
				case 'width':
				case 'height':
				case 'left':
				case 'top':
					break;
				default:
					el = undefined;
					if (this.view.layout[key] !== undefined) {
						hasReferences = true;
						var val = this.view.layout[key];

						if (typeof val === 'string') {
							var view;
							if(val === 'parent'){
								view = this.view.getParent();
							}else{
								view = ludo.get(val);
							}
							if (view) {
								el = view.getEl();
								view.addEvent('resize', this.clearFn.bind(this));
							} else {
								el = document.id(val);
							}
						} else {
							if (val.getEl !== undefined) {
								el = val.getEl();
								val.addEvent('resize', this.clearFn.bind(this));
							} else {
								el = document.id(val);
							}
						}
						if (el)this.view.layout[key] = el; else this.view.layout[key] = undefined;
					}
			}
		}
		if (hasReferences)this.view.getEl().style.position = 'absolute';
	},

	setDefaultProperties:function () {
		this.rendering.width = this.rendering.width || 'matchParent';
		this.rendering.height = this.rendering.height || 'matchParent';
	},

	addResizeEvent:function () {
		var node = this.view.getEl().parentNode;
		if (!node || !node.tagName)return;
		if (node.tagName.toLowerCase() !== 'body') {
			node = document.id(node);
		} else {
			node = window;
		}
		node.addEvent('resize', this.resize.bind(this));
	},

	buildResizeFn:function () {
		var parent = this.view.getEl().parentNode;
		if (!parent)this.fn = function () {
		};
		var fns = [];
		for (var i = 0; i < this.options.length; i++) {
			if (this.rendering[this.options[i]] !== undefined) {
				fns.push(this.getFnFor(this.options[i], this.rendering[this.options[i]]));
			}
		}
		this.fn = function () {
			for (i = 0; i < fns.length; i++) {
				fns[i].call(this, this.view, this);
			}
		}
	},

	getFnFor:function (option, value) {
		var c = this.coordinates;

		switch (option) {
			case 'height':
				if (value === 'matchParent') {
					return function (view, renderer) {
						c.height = renderer.viewport.height;
					}
				}
				if (value === 'wrap') {
					var s = ludo.dom.getWrappedSizeOfView(this.view);
					return function () {
						c.height = s.y;
					}
				}
				if (value.indexOf !== undefined && value.indexOf('%') > 0) {
					value = parseInt(value);
					return function (view, renderer) {
						c.height = (renderer.viewport.height * value / 100)
					}
				}
				return function () {
					c.height = this.rendering[option];
				}.bind(this);
			case 'width':
				if (value === 'matchParent') {
					return function (view, renderer) {
						c.width = renderer.viewport.width;
					}
				}
				if (value === 'wrap') {
					var size = ludo.dom.getWrappedSizeOfView(this.view);
					return function () {
						c.width = size.x;
					}
				}
				if (value.indexOf !== undefined && value.indexOf('%') > 0) {
					value = parseInt(value);
					return function (view, renderer) {
						c.width = (renderer.viewport.width * value / 100)
					}
				}
				return function () {
					c.width = this.rendering[option];
				};
			case 'rightOf':
				return function () {
					c.left = value.getPosition().x + value.offsetWidth;
				};
			case 'leftOf':
				return function () {
					c.right = value.getPosition().x + value.offsetWidth;
				};
			case 'above':
				return function () {
					c.top = value.getPosition().y - c.height;
				};
			case 'below':
				return function () {
					c.top = value.getPosition().y + value.offsetHeight;
				};
			case 'alignLeft':
				return function () {
					c.left = value.getPosition().x;
				};
			case 'alignTop':
				return function () {
					c.top = value.getPosition().y;
				};
			case 'alignRight':
				return function () {
					c.left = value.getPosition().x + value.offsetWidth - c.width;
				};
			case 'alignBottom':
				return function () {
					c.top = value.getPosition().y + value.offsetHeight - c.height;
				};
			case 'offsetX' :
				return function () {
					c.left = c.left ? c.left + value : value;
				};
			case 'offsetY':
				return function () {
					c.top = c.top ? c.top + value : value;
				};
			case 'sameHeightAs':
				return function () {
					c.height = value.offsetHeight;
				};
			case 'offsetWidth' :
				return function () {
					c.width = c.width + value;
				};
			case 'offsetHeight':
				return function () {
					c.height = c.height + value;
				};
			case 'centerIn':
				return function () {
					var pos = value.getPosition();
					c.top = (pos.y + value.offsetHeight) / 2 - (c.height / 2);
					c.left = (pos.x + value.offsetWidth) / 2 - (c.width / 2);
				};
			case 'centerHorizontalIn':
				return function () {
					c.left = (value.getPosition().x + value.offsetWidth) / 2 - (c.width / 2);
				};
			case 'centerVerticalIn':
				return function () {
					c.top = (value.getPosition().y + value.offsetHeight) / 2 - (c.height / 2);
				};
			case 'sameWidthAs':
				return function () {
					c.width = value.offsetWidth;
				};
			case 'x':
			case 'left':
				return function () {
					c.left = this.rendering[option];
				};
			case 'y':
			case 'top':
				return function () {
					c.top = this.rendering[option];
				};
			default:
				return function () {
				};
		}
	},

	posKeys:['left', 'right', 'top', 'bottom'],

	clearFn:function () {
		this.fn = undefined;
	},

	resize:function () {
		if (this.view.isHidden())return;
		if (this.fn === undefined)this.buildResizeFn();
		this.setViewport();

		this.fn.call(this);

		var c = this.coordinates;
		this.view.resize(c);

		for (var i = 0; i < this.posKeys.length; i++) {
			var k = this.posKeys[i];
			if (this.coordinates[k] !== undefined && this.coordinates[k] !== this.lastCoordinates[k])this.view.getEl().style[k] = c[k] + 'px';
		}
		this.lastCoordinates = Object.clone(c);
	},

	setViewport:function () {
		var el = this.view.getEl().parentNode;
		if (!el)return;
		this.viewport.width = el.offsetWidth - ludo.dom.getPW(el) - ludo.dom.getBW(el);
		this.viewport.height = el.offsetHeight - ludo.dom.getPH(el) - ludo.dom.getBH(el);
	},

	getMinWidth:function () {
		return this.rendering.minWidth || 5;
	},

	getMinHeight:function () {
		return this.rendering.minHeight || 5;
	},

	getMaxHeight:function () {
		return this.rendering.maxHeight || 5000;
	},

	getMaxWidth:function () {
		return this.rendering.maxWidth || 5000;
	},

	setPosition:function (x, y) {
		if (x !== undefined && x >= 0) {
			this.coordinates.x = this.view.layout.left = x;
		}
		if (y !== undefined && y >= 0) {
			this.coordinates.y = this.view.layout.top = y;
		}
		this.resize();
	},

	setSize:function (config) {
		if (config.left)this.coordinates.x = this.rendering.left = config.left;
		if (config.top)this.coordinates.y = this.rendering.top = config.top;
		if (config.width)this.view.layout.width = this.coordinates.width = config.width;
		if (config.height)this.view.layout.height = this.coordinates.height = config.height;
		this.resize();
	},

	getPosition:function () {
		return {
			x:this.coordinates.left,
			y:this.coordinates.top
		};
	}
});
/**
* Base class for data sources
 * @namespace dataSource
 * @class Base
*/
ludo.dataSource.Base = new Class({
    Extends:ludo.Core,
    /**
     * Accept only one data-source of this type. You also need to specify the
     * "type" property which will be used as key in the global SINGELTON cache
     * By using singletons, you don't have to do multiple requests to the server
     * @attribute singleton
	 * @type {Boolean}
     */
    singleton:false,
    // TODO show show to set global url.
    /**
     * Remote url. If not set, global url will be used
     * @attribute url
	 * @type String
     * @optional
     */
    url:undefined,
    /**
     * Remote postData sent with request, example:
     * postData: { getUsers: 1 }
     * @attribute object postData
     */
    postData:{},

    data:undefined,

    /**
     * Load data from external source on creation
     * @attribute autoload
	 * @type {Boolean}
     * @default true
     */
    autoload : true,
    /**
     * Name of resource to request on the server
     * @config resource
	 * @type String
     * @default ''
     */
    resource : '',
    /**
     * Name of service to request on the server
     * @config service
	 * @type String
     * @default ''
     */
    service : '',
    /**
     Array of arguments to send to resource on server
     @config arguments
     @type Array
     @default ''
     Here are some examples:

     Create a data source for server resource "Person", service name "load" and id : "1". You will then set these config properties:

     @example
        "resource": "Person",
        "service": "load",
        "arguments": [1]
     */
    arguments: undefined,

	inLoadMode : false,

	ludoConfig:function (config) {
        this.parent(config);
        if (config.url !== undefined)this.url = config.url;
        if (config.postData !== undefined)this.postData = config.postData;
        if (config.autoload !== undefined)this.autoload = config.autoload;
        if (config.resource !== undefined)this.resource = config.resource;
        if (config.service !== undefined)this.service = config.service;
    },

	ludoEvents:function(){
		if (this.autoload)this.load();
	},
    /**
     * Has data loaded from server
     * @method hasData
     * @return {Boolean}
     */
    hasData:function () {
        return (this.data !== undefined);
    },
    /**
     * Return data loaded from server
     * @method getData
     * @return object data from server, example: { success:true, data:[]}
     */
    getData:function () {
        return this.data;
    },

    setPostParam:function (param, value) {
        this.postData[param] = value;
    },

    /**
     * Return data-source type(HTML or JSON)
     * @method getSourceType
     * @return string source type
     */
    getSourceType:function () {
        return 'JSON';
    },

    load:function(){
		this.inLoadMode = true;
        this.fireEvent('beforeload');
    },
	loadComplete:function(){
		this.inLoadMode = false;
	},

	isLoading:function(){
		return this.inLoadMode;
	}
});
/**
 * Class for remote data source.
 * @namespace dataSource
 * @class JSON
 * @extends dataSource.Base
 */
ludo.dataSource.JSON = new Class({
    Extends:ludo.dataSource.Base,
    type:'dataSource.JSON',

    /**
     * Reload data from server
     * Components using this data-source will be automatically updated
     * @method load
     * @return void
     */
    load:function () {
        this.parent();
        this.sendRequest(this.service, this.arguments, this.getPostData())
    },

    /**
     * Send a new request
     * @method sendRequest
     * @param {String} service
     * @param {Array} arguments
     * @optional
     * @param {Object} data
     * @optional
     */
    sendRequest:function(service, arguments, data){
        this.request().send(service, arguments, data);
    },

    _request:undefined,
    request:function(){
        if(this._request === undefined){
            this._request = new ludo.remote.JSON({
                url:this.url,
                resource: this.resource,
                listeners:{
                    "success":function (request) {
                        this.loadComplete(request.getResponseData(), request.getResponse());
                    }.bind(this),
                    "failure":function (request) {
                        /**
                         * Event fired when success parameter in response from server is false
                         * @event failure
                         * @param {Object} JSON response from server. Error message should be in the "message" property
                         * @param {Object} ludo.model.Model
                         *
                         */
                        this.fireEvent('failure', [request.getResponse(), this]);
                    }.bind(this),
                    "error":function (request) {
                        /**
                         * Server error event. Fired when the server didn't handle the request
                         * @event servererror
                         * @param {String} error text
                         * @param {String} error message
                         */
                        this.fireEvent('servererror', [request.getErrorText(), request.getErrorCode()]);
                    }.bind(this)
                }
            });

        }
        return this._request;
    },

    loadComplete:function (data,json) {
		this.parent();
        this.data = data;
        this.fireEvent('parsedata');
        this.fireEvent('load', json);
    },

    getPostData:function(){
        return this.postData;
    }
});

ludo.factory.registerClass('dataSource.JSON', ludo.dataSource.JSON);
/**
 * Class/Object with DOM utility methods.
 * @class ludo.dom
 *
 */
ludo.dom = {
	cache:{
		PW:{}, PH:{},
		BW:{}, BH:{},
		MW:{}, MH:{}
	},
	/**
	 * Return Margin width (left and right) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @method getMW
	 * @param {Object} el
	 */
	getMW:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.MW[el.id] === undefined) {
			ludo.dom.cache.MW[el.id] = ludo.dom.getNumericStyle(el, 'margin-left') + ludo.dom.getNumericStyle(el, 'margin-right')
		}
		return ludo.dom.cache.MW[el.id];
	},

	/**
	 * Return Border width (left and right) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @method getBW
	 * @param {Object} el DOMElement or id of DOMElement
	 */
	getBW:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.BW[el.id] === undefined) {
			ludo.dom.cache.BW[el.id] = ludo.dom.getNumericStyle(el, 'border-left-width') + ludo.dom.getNumericStyle(el, 'border-right-width');
		}
		return ludo.dom.cache.BW[el.id];
	},
	/**
	 * Return Padding Width (left and right) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @method getPW
	 * @param {Object} el
	 */
	getPW:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.PW[el.id] === undefined) {
			ludo.dom.cache.PW[el.id] = ludo.dom.getNumericStyle(el, 'padding-left') + ludo.dom.getNumericStyle(el, 'padding-right');
		}
		return ludo.dom.cache.PW[el.id];

	},
	/**
	 * Return Margin height (top and bottom) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @method getMH
	 * @param {Object} el
	 */
	getMH:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.MH[el.id] === undefined) {
			ludo.dom.cache.MH[el.id] = ludo.dom.getNumericStyle(el, 'margin-top') + ludo.dom.getNumericStyle(el, 'margin-bottom')
		}
		return ludo.dom.cache.MH[el.id];

	},
	/**
	 * Return Border height (top and bottom) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @method getBH
	 * @param {Object} el
	 */
	getBH:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.BH[el.id] === undefined) {
			ludo.dom.cache.BH[el.id] = ludo.dom.getNumericStyle(el, 'border-top-width') + ludo.dom.getNumericStyle(el, 'border-bottom-width');
		}
		return ludo.dom.cache.BH[el.id];
	},
	/**
	 * Return Padding height (top and bottom) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @method getPH
	 * @param {Object} el DOMElement or id of DOMElement
	 */
	getPH:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.PH[el.id] === undefined) {
			ludo.dom.cache.PH[el.id] = ludo.dom.getNumericStyle(el, 'padding-top') + ludo.dom.getNumericStyle(el, 'padding-bottom');
		}
		return ludo.dom.cache.PH[el.id];
	},
	getMBPW:function (el) {
		return ludo.dom.getPW(el) + ludo.dom.getMW(el) + ludo.dom.getBW(el);
	},
	getMBPH:function (el) {
		return ludo.dom.getPH(el) + ludo.dom.getMH(el) + ludo.dom.getBH(el);
	},

	/**
	 * Return margin+border+padding width of elOne MINUS margin+border+padding width of elTwo
	 * @method getMBPWDiff
	 * @param elOne
	 * @param elTwo
	 * @return {Number}
	 */
	getMBPWDiff:function (elOne, elTwo) {
		return ludo.dom.getMBPW(elOne) - ludo.dom.getMBPW(elTwo);
	},
	/**
	 * Return margin+border+padding height of elOne MINUS margin+border+padding height of elTwo
	 * @method getMBPHDiff
	 * @param elOne
	 * @param elTwo
	 * @return {Number}
	 */
	getMBPHDiff:function (elOne, elTwo) {
		return ludo.dom.getMBPH(elOne) - ludo.dom.getMBPH(elTwo);
	},


	/**
	 * @method clearCacheStyles
	 * Clear cached padding,border and margins.
	 */
	clearCache:function () {
		ludo.dom.cache = {
			PW:{}, PH:{},
			BW:{}, BH:{},
			MW:{}, MH:{}
		};
	},

	/**
	 * Return numeric style value,
	 * @method getNumericStyle
	 * @private
	 * @param {Object} el
	 * @param {String} style
	 */
	getNumericStyle:function (el, style) {
		if (!el || !style || !el.getStyle)return 0;
		var val = el.getStyle(style);
		return val ? parseInt(val) : 0;
	},

	isInFamilies:function (el, ids) {
		for (var i = 0; i < ids.length; i++) {
			if (ludo.dom.isInFamily(el, ids[i]))return true;
		}
		return false;
	},

	isInFamily:function (el, id) {
		if (el.id === id)return true;
		return el.getParent('#' + id);

	},

	addClass:function (el, className) {
		if (!this.hasClass(el, className)) {
			el.className = el.className ? el.className + ' ' + className : className;
		}
	},

	hasClass:function (el, className) {
		return el.className ? el.className.split(/\s/g).indexOf(className) > -1 : false;
	},

	removeClass:function (el, className) {
		el.className = el.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
	},

	getParent:function (el, selector) {
		el = el.parentNode;
		while (el && !ludo.dom.hasClass(el, selector))el = el.parentNode;
		return el;
	},

	scrollIntoView:function (domNode, view) {
		var c = view.getEl();
		var el = view.getBody();
		var viewHeight = c.offsetHeight - ludo.dom.getPH(c) - ludo.dom.getBH(c) - ludo.dom.getMBPH(el);

		var pos = domNode.getPosition(el).y;
		var scrollTop = c.scrollTop;

		var pxBeneathBottomEdge = (pos + 20) - (scrollTop + viewHeight);
		var pxAboveTopEdge = scrollTop - pos;
		if (pxBeneathBottomEdge > 0) {
			el.scrollTop += pxBeneathBottomEdge;
		}
		if (pxAboveTopEdge > 0) {
			el.scrollTop -= pxAboveTopEdge;
		}
	},

	getInnerWidthOf:function (el) {
		if (el.style.width && el.style.width.indexOf('%') == -1) {
			return ludo.dom.getNumericStyle(el, 'width');
		}
		return el.offsetWidth - ludo.dom.getPW(el) - ludo.dom.getBW(el);
	},

	getInnerHeightOf:function (el) {
		if (el.style.height && el.style.height.indexOf('%') == -1) {
			return ludo.dom.getNumericStyle(el, 'height');
		}
		return el.offsetHeight - ludo.dom.getPH(el) - ludo.dom.getBH(el);
	},

	getTotalWidthOf:function (el) {
		return el.offsetWidth + ludo.dom.getMW(el);
	},

	getWrappedSizeOfView:function (view) {
		var el = view.getEl();
		var b = view.getBody();
		b.style.position = 'absolute';

		var width = b.offsetWidth;
		b.style.position = 'relative';
		var height = b.offsetHeight;

		return {
			x:width + ludo.dom.getMBPW(b) + ludo.dom.getMBPW(el),
			y:height + ludo.dom.getMBPH(b) + ludo.dom.getMBPH(el) + view.getTotalHeightOfTitleAndStatusBar() + 2
		}
	},

	/**
	 * Return measured width of a View
	 * @method getMeasuredWidth
	 * @param {ludo.View} view
	 * @return {Number}
	 */
	getMeasuredWidth:function (view) {
		var el = view.getBody();
		var size = el.measure(function () {
			return this.getSize();
		});
		return size.x + ludo.dom.getMW(el);
	}
};
ludo.util = {
	type:function (o) {
		return !!o && Object.prototype.toString.call(o).match(/(\w+)\]/)[1];
	},

	isArray:function (obj) {
		return typeof(obj) == 'object' && (obj instanceof Array);
	},

	isObject:function (obj) {
		return typeof(obj) == 'object';
	},

	isString:function (obj) {
		return typeof(obj) == 'string';
	},

	isFunction:function (obj) {
		return typeof(obj) === 'function';
	},

	tabletOrMobile:undefined,

	isTabletOrMobile:function () {
		if (ludo.util.tabletOrMobile === undefined) {
			ludo.util.tabletOrMobile = this.isIpad() || this.isIphone() || this.isAndroid();
		}
		return ludo.util.tabletOrMobile;
	},

	isIpad:function () {
		return navigator.platform.indexOf('iPad') >= 0;
	},

	isIphone:function () {
		return navigator.platform.indexOf('iPhone') >= 0;
	},

	isAndroid:function () {
		return Browser.Platform['android'] ? true : false;
	},

	cancelEvent:function () {
		return false;
	},

	log:function (what) {
		if (window['console']) {
			console.log(what);
		}
	},

	getNewZIndex:function (view) {
		var ret = ludo.CmpMgr.getNewZIndex();
		if (view.els.parent == document.body) {
			ret += 10000;
		}
		if (view.alwaysInFront) {
			ret += 400000;
		}
		return ret;
	},
	
	disposeView:function(view){
		if (view.getParent()) {
			view.getParent().removeChild(view);
		}
		var initialItemCount = view.children.length;
		for (var i = initialItemCount - 1; i >= 0; i--) {
			view.children[i].dispose();
		}
		for (var name in view.els) {
			if (view.els.hasOwnProperty(name)) {
				if (view.els[name] && view.els[name].tagName && name != 'parent') {
					view.els[name].dispose();
				}
			}
		}
		view.getEl().dispose();

		ludo.CmpMgr.deleteComponent(view);
		if(view.layoutManager)delete view.layoutManager;
		delete view.els;

	}
};
ludo.view.Loader = new Class({
	Extends: Events,
	txt : 'Loading content...',
	view:undefined,
	el:undefined,

	initialize:function(config){
		this.view = config.view;
		if(config.txt !== undefined)this.txt = config.txt;
		this.addDataSourceEvents();
	},

	addDataSourceEvents:function(){
		var dsConfig = this.view.dataSource;
		if(dsConfig){
			var ds = this.view.getDataSource();
			ds.addEvent('beforeload', this.show.bind(this));
			ds.addEvent('load', this.hide.bind(this));
			if(ds.isLoading())this.show();
		}
	},

	getEl:function(){
		if(this.el === undefined){
			this.el = new Element('div');
			ludo.dom.addClass(this.el, 'ludo-component-pleasewait');
			this.el.set('html', this.txt);
			this.view.getEl().appendChild(this.el);
			this.el.style.display = 'none';
		}
		return this.el;
	},

	show:function(txt){
		if(txt !== undefined){
			this.el.set('html', txt);
		}
		this.getEl().style.display = '';
	},

	hide:function(){
		this.getEl().style.display = 'none';
	}
});
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

	setPosition:function (pos) {
		if (pos.left !== undefined && pos.left >= 0) {
			this.getEl().setStyle('left', pos.left);
		}
		if (pos.top !== undefined && pos.top >= 0) {
			this.getEl().setStyle('top', pos.top);
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
			this.fireEvent('dispose', this);
			ludo.util.disposeView(this);
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
ludo.layout.TabStrip = new Class({
	Extends:ludo.View,
	type:'layout.TabStrip',
	tabPos:'left',
	lm:undefined,
	tabs:{},
	currentPos:-1,
	activeTab:undefined,
	currentZIndex:3,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.tabPos !== undefined)this.tabPos = config.tabPos;
		this.lm = config.lm;
	},
	ludoEvents:function () {
		this.parent();
		this.lm.addEvent('addChild', this.registerChild.bind(this));
		this.lm.addEvent('showChild', this.activateTabFor.bind(this));
		this.lm.addEvent('removeChild', this.removeTabFor.bind(this));
	},

	registerChild:function (child) {
		if (!this.lm.isTabStrip(child)) {
			this.createTabFor(child);
		}
	},

	resizeTabs:function(){
		this.currentPos = -1;
		for(var key in this.tabs){
			var node = this.tabs[key];
			node.style[this.getPosAttribute()] = this.currentPos + 'px';
			this.increaseCurrentPos(node);
		}
	},

	createTabFor:function (child) {
		var node;
		if (this.tabPos === 'top' || this.tabPos == 'bottom') {
			node = this.getPlainTabFor(child);
		} else {
			node = this.getSVGTabFor(child);
		}

		node.addEvent('click', child.show.bind(child, false));
		this.getBody().adopt(node);
		if(child.layout.closable){
			this.addCloseButton(node, child);
		}
		node.style[this.getPosAttribute()] = this.currentPos + 'px';
		node.className = 'ludo-tab-strip-tab ludo-tab-strip-tab-' + this.tabPos;
		this.tabs[child.getId()] = node;
		this.increaseCurrentPos(node);
		if (!child.isHidden())this.activateTabFor(child);
	},

	addCloseButton:function(node, child){
		var el = new Element('div');
		el.className = 'ludo-tab-close ludo-tab-close-' + this.tabPos;
		el.addEvent('mouseenter', this.enterCloseButton.bind(this));
		el.addEvent('mouseleave', this.leaveCloseButton.bind(this));
		el.id = 'tab-close-' + child.id;
		el.addEvent('click', this.removeChild.bind(this));
		node.appendChild(el);
		var p;
		switch(this.tabPos){
			case 'top':
			case 'bottom':
				p = node.getStyle('padding-right');
				node.style.paddingRight = (parseInt(p) + el.offsetWidth) + 'px';
				break;
			case 'right':
				p = node.getStyle('padding-right');
				node.style.paddingBottom = (parseInt(p) + el.offsetHeight) + 'px';
				break;
			case 'left':
				p = node.getStyle('padding-right');
				node.style.paddingTop = (parseInt(p) + el.offsetHeight) + 'px';
				break;
		}
	},

	removeChild:function(e){
		var id = e.target.id.replace('tab-close-', '');
		ludo.get(id).dispose();
		return false;
	},

	removeTabFor:function(child){
		this.tabs[child.getId()].dispose();
		delete this.tabs[child.getId()];
		this.resizeTabs();
	},

	enterCloseButton:function(e){
		e.target.addClass('ludo-tab-close-' + this.tabPos + '-over');
	},

	leaveCloseButton:function(e){
		e.target.removeClass('ludo-tab-close-' + this.tabPos + '-over');
	},

	getPosAttribute:function () {
		if (this.posAttribute === undefined) {
			switch (this.tabPos) {
				case 'top':
				case 'bottom':
					this.posAttribute = 'left';
					break;
				case 'left':
				case 'right':
					this.posAttribute = 'top';
					break;
			}
		}
		return this.posAttribute;
	},

	increaseCurrentPos:function (node) {
		if (this.tabPos === 'top' || this.tabPos === 'bottom') {
			this.currentPos += node.offsetWidth + ludo.dom.getMW(node);
		} else {
			this.currentPos += node.offsetHeight + ludo.dom.getMH(node);
		}
		this.currentPos--;
	},

	getPlainTabFor:function (child) {

		var el = new Element('div');
		el.className = 'ludo-tab-strip-tab ludo-tab-strip-tab-' + this.tabPos;
		this.getBody().adopt(el);
		el.innerHTML = '<div class="ludo-tab-strip-tab-bg-first"></div><div class="ludo-tab-strip-tab-bg-last"></div>';
		var span = document.createElement('span');
		span.innerHTML = this.getTitleFor(child);
		el.appendChild(span);
		return el;
	},

	getSVGTabFor:function (child) {
		var el = new Element('div');
		this.getBody().adopt(el);
		el.innerHTML = '<div class="ludo-tab-strip-tab-bg-first"></div><div class="ludo-tab-strip-tab-bg-last">';
		var svgEl = document.createElement('div');
		el.adopt(svgEl);
		var box = new ludo.layout.TextBox({
			renderTo:svgEl,
			width:100,height:100,
			className:'ludo-tab-strip-tab-txt-svg',
			text:this.getTitleFor(child),
			rotation:this.getRotation()
		});
		var size = box.getSize();
		svgEl.style.width = size.x + 'px';
		svgEl.style.height = size.y + 'px';

		return el;
	},

	getRotation:function(){
		if(this.rotation=== undefined){
			switch(this.tabPos){
				case 'left' : this.rotation = 270; break;
				case 'right' : this.rotation = 90; break;
				case 'bottom' : this.rotation = 180; break;
				default : this.rotation = 0; break;
			}
		}
		return this.rotation;
	},

	getTitleFor:function(child){
		return (child.layout.title || child.getTitle());
	},

	activateTabFor:function (child) {
		if (this.activeTab !== undefined) {
			ludo.dom.removeClass(this.activeTab, 'ludo-tab-strip-tab-active');
		}
		if (this.tabs[child.id] !== undefined) {
			ludo.dom.addClass(this.tabs[child.id], 'ludo-tab-strip-tab-active');
			this.activeTab = this.tabs[child.id];
			this.activeTab.style.zIndex = this.currentZIndex;
			this.currentZIndex++;
		}
	},

	ludoDOM:function () {
		this.parent();
		ludo.dom.addClass(this.getEl(), 'ludo-tab-strip');
		ludo.dom.addClass(this.getEl(), 'ludo-tab-strip-' + this.tabPos);

		var el = document.createElement('div');
		ludo.dom.addClass(el, 'ludo-tab-strip-line');
		this.getBody().adopt(el);
	},

	getTabFor:function (child) {
		return this.tabs[child.id]
	},

	getChangedViewport:function () {
		var value;
		if (this.tabPos === 'top' || this.tabPos === 'bottom') {
			value = this.getEl().offsetHeight + ludo.dom.getMH(this.getEl());
		} else {
			value = this.getEl().offsetWidth + ludo.dom.getMW(this.getEl());
		}
		return {
			key:this.tabPos, value:value
		};
	},
	getCount:function () {
		return Object.keys(this.tabs).length;
	}
});
ludo.layout.Tab = new Class({
	Extends:ludo.layout.Relative,
	visibleChild:undefined,
	tabStrip:undefined,

	onCreate:function () {
		this.parent();
		this.addChild(this.getTabStrip());
		this.updateViewport(this.tabStrip.getChangedViewport());
	},

	addChild:function (child, insertAt, pos) {
		if (!this.isTabStrip(child) && (!child.layout || !child.layout.visible))child.hidden = true;
		return this.parent(child, insertAt, pos);
	},

	onNewChild:function (child) {
		if (!this.isTabStrip(child)) {
			if(!child.isHidden()){
				this.setVisibleChild(child);
			}
			var l = child.layout;
			l.alignParentLeft = true;
			l.alignParentTop = true;
			l.fillRight = true;
			l.fillDown = true;


		}
		this.parent(child);
	},

	setTemporarySize:function(){

	},

	addChildEvents:function(child){
		if(!this.isTabStrip(child)){
			child.addEvent('show', this.showTab.bind(this));
			child.addEvent('beforeDispose', this.onChildDispose.bind(this));
		}
	},

	getTabPosition:function () {
		return this.view.layout.tabs || 'top';
	},
	getTabStrip:function () {
		if (this.tabStrip === undefined) {
			this.tabStrip = new ludo.layout.TabStrip({
				lm : this,
				parentComponent:this.view,
				tabPos:this.getTabPosition(),
				renderTo:this.view.getBody(),
				layout:this.getTabStripLayout()
			});
		}
		return this.tabStrip;
	},

	setVisibleChild:function(child){
		if(this.visibleChild)this.visibleChild.hide();
		this.visibleChild = child;
		this.fireEvent('showChild', child);
	},

	showTab:function(child){
		if(child !== this.visibleChild){
			this.setVisibleChild(child);
			this.resize();
		}

	},

	resize:function(){
		if(this.visibleChild === undefined){
			if(this.view.children.length>1)this.view.children[1].show();
		}else{
			if (this.children === undefined) {
				this.prepareResize();
			}
			this.tabStrip.layoutResizeFn.call(this.visibleChild, this);
			this.visibleChild.layoutResizeFn.call(this.visibleChild, this);
		}
	},

	getTabStripLayout:function () {
		switch (this.getTabPosition()) {
			case 'top':
				return {
					absTop:true,
					absLeft:true,
					absWidth:true
				};
			case 'left':
				return {
					absTop:true,
					absLeft:true,
					absHeight:true
				};
			case 'right':
				return {
					absTop:true,
					absRight:true,
					absHeight:true
				};
			case 'bottom':
				return {
					absBottom:true,
					absLeft:true,
					absWidth:true
				};
		}
	},

	isTabStrip:function (view) {
		return view.type === 'layout.TabStrip';
	},

	onChildDispose:function(child){
		if(this.visibleChild && this.visibleChild.id === child.id){
			var i = this.view.children.indexOf(this.visibleChild);
			if(i>1){
				this.view.children[i-1].show();
			}else{
				if(this.view.children.length>2){
					this.view.children[i+1].show();
				}
			}
		}

		this.fireEvent('removeChild', child);
	}
});
ludo.layout.Fill = new Class({
	Extends:ludo.layout.Base,

	resize:function () {
		var height = this.view.getInnerHeightOfBody();
		if (height <= 0)return;
		for (var i = 0; i < this.view.children.length; i++) {
			this.view.children[i].resize({ height:height });
		}
	}
});
/**
 * Arrange child views in a grid layout
 * @namespace layout
 * @class Grid
 */
ludo.layout.Grid = new Class({
	Extends:ludo.layout.Base,
    /**
     * Number of columns
     * @config {Number} columns
     * @default 5
     */
	columns:5,
    /**
     * Number of rows
     * @config {Number} rows
     * @default 5
     */
	rows:5,

	onCreate:function () {
		var l = this.view.layout;
		if (l.columns !== undefined)this.columns = l.columns;
		if (l.rows !== undefined)this.rows = l.rows;
	},

	resize:function () {
		this.storeCellSize();
		var pos = 0;
		var colspan;
		for (var i = 0; i < this.view.children.length; i++) {
			var c = this.view.children[i];
			colspan = c.layout && c.layout.colspan ? c.layout.colspan : 1;
			this.view.children[i].resize({
				width:this.cellSize.x * colspan,
				height:this.cellSize.y,
				left:this.cellSize.x * (pos % this.columns),
				top:this.cellSize.y * (Math.floor(pos / this.columns) % this.rows)
			});
			pos += colspan;
		}
	},

	storeCellSize:function () {
		this.cellSize = {
			x:this.getAvailWidth() / this.columns,
			y:this.getAvailHeight() / this.rows
		}
	},

	getCellSize:function () {
		return this.cellSize;
	},

	onNewChild:function (child) {
		child.getEl().style.position = 'absolute';
	}
});
/**
 * Class handling popup layout defined by setting layout.type to "popup". The popup layout model
 * does not render it's children inside the "body" of it's parent. Instead, it's rendered as direct
 * children of document.body(&lt;body>). Layout properties are used to measure size and
 * position. One example of use is a combo box which displays a child view below a button or input box.
 * See {{#crossLink "layout.LayoutSpec"}}{{/crossLink}} for the available position and
 * sizing properties available to children inside a popup layout.
 * @namespace layout
 * @class Popup
 *
 */
ludo.layout.Popup = new Class({
	Extends:ludo.layout.Base,
	visibleChild:undefined,
	addChild:function (child, insertAt, pos) {
		if (!child.layout || !child.layout.visible)child.hidden = true;
		return this.parent(child, insertAt, pos);
	},

	onNewChild:function (child) {
		if (!child.isHidden()) {
			this.setVisibleChild(child);
		}
		child.getEl().style.position = 'absolute';
		child.addEvent('show', this.setVisibleChild.bind(this));
		this.parent(child);
	},

	setVisibleChild:function (child) {
		if (this.visibleChild && this.shouldToggle())this.visibleChild.hide();
		this.visibleChild = child;
		this.fireEvent('showChild', child);
	},

	getParentForNewChild:function () {
		return document.body;
	},

	shouldToggle:function(){
		return this.view.layout.toggle;
	},

	resize:function(){
		var c = this.view.children;
		for(var i=0;i< c.length;i++){
			if(!c[i].isHidden())c[i].getLayoutManager().getRenderer().resize();
		}
	}
});
ludo.layout.CollapseBar = new Class({
	Extends: ludo.View,
	orientation : undefined,
	position : undefined,
	views:[],
	viewportCoordinates:{},
	buttons:{},
	currentPos:0,

	ludoConfig:function(config){
		this.parent(config);
		this.position = config.position || 'left';
		this.setLayout();
	},

	ludoDOM:function(){
		this.parent();
		ludo.dom.addClass(this.getEl(), 'ludo-collapse-bar');
		ludo.dom.addClass(this.getEl(), 'ludo-collapse-bar-' + this.orientation);
		ludo.dom.addClass(this.getEl(), 'ludo-collapse-bar-' + this.position);
	},

	setLayout:function(){
		// this.position = layout.collapseBar || 'left';
		this.orientation = (this.position === 'left' || this.position === 'right') ? 'vertical' : 'horizontal';
		this.layout = {};
		switch(this.position){
			case 'left':
				this.layout.absLeft = true;
				this.layout.alignParentTop = true;
				this.layout.fillDown = true;
				this.layout.width = 25;
				break;
			case 'right':
				this.layout.absRight = true;
				this.layout.alignParentTop = true;
				this.layout.fillDown = true;
				this.layout.width = 25;
				break;
			case 'top':
				this.layout.absTop = true;
				this.layout.absLeft = true;
				this.layout.absWidth = true;
				this.layout.height = 25;
				break;
			case 'bottom':
				this.layout.absBottom = true;
				this.layout.absLeft = true;
				this.layout.absWidth = true;
				this.layout.height = 25;
				break;
		}
	},

	getChangedViewport:function(){
		var value = 0;
		if(!this.isHidden()){
			switch(this.position){
				case 'left':
				case 'right':
					value = this.layout.width;
					break;
				case 'top':
				case 'bottom':
					value = this.layout.height;
					break;

			}
		}
		return {
			key:this.position,value:value
		}
	},

	addView:function(view){
		this.views.push(view);
		this.addButton(view);
	},

	addButton:function(view){
		var button = this.buttons[view.id] = new Element('div');
		button.id = 'button-' + view.id;
		button.addEvent('mouseenter', this.enterButton.bind(this));
		button.addEvent('mouseleave', this.leaveButton.bind(this));
		button.addEvent('click', this.toggleView.bind(this));
		this.getBody().adopt(button);
		button.innerHTML = '<div class="collapse-bar-button-bg-first"></div><div class="collapse-bar-button-bg-last"></div>';
		button.className = 'collapse-bar-button collapse-bar-button-' + this.position;

		var svgNode = new ludo.layout.TextBox({
			renderTo:button,
			text:view.title,
			rotation:this.getRotation(),
			className:'ludo-view-collapsed-title'
		});

		var size = svgNode.getSize();
		button.style.width = size.x + 'px';
		button.style.height = size.y + 'px';

		if(this.position === 'top' || this.position === 'bottom'){
			button.style.left = this.currentPos + 'px';
			this.currentPos += size.x + ludo.dom.getMBPW(button);
		}else{
			button.style.top = this.currentPos + 'px';
			this.currentPos += size.y  + ludo.dom.getMBPH(button);
		}

		if(!view.isHidden()){
			this.activateButton(view);
		}

		view.addEvent('show', this.activateButton.bind(this));
		view.addEvent('hide', this.deactivateButton.bind(this));
	},

	getRotation:function(){
		switch(this.position){
			case 'left' : return 270;
			case 'right' : return 90;
			default:return 0;
		}
	},

	toggleView:function(e){
		var button = this.getButtonByDom(e.target);
		var id = button.id.replace('button-', '');
		var view = ludo.get(id);
		if(view.isHidden())view.show();else view.hide();
	},

	enterButton:function(e){
		this.getButtonByDom(e.target).addClass('collapse-bar-button-over');
	},

	leaveButton:function(e){
		this.getButtonByDom(e.target).removeClass('collapse-bar-button-over');
	},

	activateButton:function(view){
		if(view.getParent().isHidden())view.getParent().show();
		this.buttons[view.id].addClass('collapse-bar-button-active');

	},

	toggleParent:function(view){
		if(this.allHidden(view)){
			view.getParent().hide();
		}
	},

	allHidden:function(view){
		var parent = view.getParent();
		for(var i=0;i<parent.children.length;i++){
			if(parent.children[i].isHidden() || !parent.children[i].title){

			}else{
				return false;
			}
		}
		return true;
	},

	deactivateButton:function(view){
		this.buttons[view.id].removeClass('collapse-bar-button-active');
		this.toggleParent.delay(50, this, view);

	},

	getButtonByDom:function(el){
		while(el.tagName.toLowerCase() === 'svg' || el.tagName.toLowerCase() === 'text' || !ludo.dom.hasClass(el, 'collapse-bar-button')){
			el = el.parentNode;
		}
		return el;
	},
	getViews:function(){
		return this.views;
	}
});
/**
 Class for providing short messages and feedback in a small popup.
 Notifications automatically disappear after a timeout. Positioning
 of notification can be configured using the layout object.

 @class Notification
 @extends View
 @constructor
 @param {Object} config
 @example
 	new ludo.Notification({
 		html : 'Your e-mail has been sent',
 		duration:4
	});
 */
ludo.Notification = new Class({
	Extends:ludo.View,
	alwaysInFront:true,
	/**
	 * Seconds before notification is automatically hidden
	 * @config {Number} duration
	 * @default 3
	 */
	duration:3,

	/**
	 * Use an effect when notification is shown
	 * Possible values: fade, slide
	 * @config {String} effect
	 * @default undefined
	 */
	showEffect:undefined,
	/**
	 * Use an effect when notification is hidden
	 * Possible values: fade, slide
	 * @config {String} effect
	 * @default undefined
	 */
	hideEffect:undefined,
	/**
	 * Effect used for both show and hide. Individual effects can be set by
	 * defining showEffect and hideEffect
	 * Possible values: fade, slide
	 * @config {String} effect
	 * @default 'fade'
	 */
	effect:'fade',
	/**
	 * Duration of animation effect
	 * @config {Number} effectDuration
	 * @default 1
	 */
	effectDuration:1,

	/**
	 * true to dispose/erase notification on hide
	 * @config {Boolean} autoDispose
	 * @default false
	 */
	autoDispose:false,

	ludoConfig:function (config) {
		config.renderTo = config.renderTo || document.body;
		if (config.autoDispose !== undefined)this.autoDispose = config.autoDispose;
		if (config.showEffect !== undefined)this.showEffect = config.showEffect;
		if (config.hideEffect !== undefined)this.hideEffect = config.hideEffect;
		if (config.effect !== undefined)this.effect = config.effect;
		this.showEffect = this.showEffect || this.effect;
		this.hideEffect = this.hideEffect || this.effect;
		if (config.effectDuration !== undefined)this.effectDuration = config.effectDuration;
		if (!config.layout && !this.layout) {
			config.layout = {
				centerIn:config.renderTo
			}
		}
		this.parent(config);
	},

	ludoEvents:function(){
		this.parent();
		if(this.autoDispose){
			this.addEvent('hide', this.dispose.bind(this));
		}
	},

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-notification');
	},

	ludoRendered:function () {
		if (!this.layout.width || !this.layout.height) {
			var size = ludo.dom.getWrappedSizeOfView(this);
			if (!this.layout.width)this.layout.width = size.x;
			if (!this.layout.height)this.layout.height = size.y;
		}
		this.parent();
		this.show();
	},

	hide:function () {
		if (this.hideEffect) {
			var effect = new ludo.effect.Effect();
			effect[this.getEndEffectFn()](
				this.getEl(),
				this.effectDuration,
				this.onHideComplete.bind(this),
				this.getLayoutManager().getRenderer().getPosition()
			);
		} else {
			this.parent();
		}
	},

	show:function () {
		if (this.showEffect) {
			var effect = new ludo.effect.Effect();
			effect[this.getStartEffectFn()](
				this.getEl(),
				this.effectDuration,
				this.autoHide.bind(this),
				this.getLayoutManager().getRenderer().getPosition()
			);
		}
		this.parent();
	},

	getStartEffectFn:function () {
		switch (this.showEffect) {
			case 'fade':
				return 'fadeIn';
			default:
				return this.showEffect;
		}
	},

	getEndEffectFn:function () {
		switch (this.hideEffect) {
			case 'fade':
				return 'fadeOut';
			default:
				return this.hideEffect;
		}
	},

	autoHide:function () {
		this.hide.delay(this.duration * 1000, this);
	},

	onHideComplete:function () {
		this.getEl().style.display = 'none';
		this.fireEvent('hide', this);
	}
});
/**
 Class for nodeJS communication. You configure nodeJS communication by passing a {{#crossLink "View/socket"}}socket{{/crossLink}} object to
 a {{#crossLink "View"}}{{/crossLink}}, example: socket:{ url:'http://127.0.0.1:1337' }. You can get a reference to this class by calling
 {{#crossLink "View/getSocket"}}{{/crossLink}}
 @namespace socket
 @class Socket
 @extends Core
 @constructor
 @param {Object} config
 @example
 	// Server side code:
	 var io = require('socket.io').listen(1337, "127.0.0.1");

	 io.sockets.on('connection', function (socket, request) {
		 socket.on('sayhello', function (person) {
			 socket.emit('hello', { message:'Hello ' + person.name, success:true });
		 });

		 socket.on('chat', function (request) {
			 socket.broadcast.emit('getmessage', { message:'Person A says: ' + request.message, success:true });
			 socket.emit('getmessage', { message:'Person A says: ' + request.message, success:true });
		 });
	 });
 Client side code:
 @example
	 ludo.chat = {};
	  ludo.chat.Panel = new Class({
		  Extends:ludo.View,
		  type:'chat.Panel',
		  weight:1,
		  css:{
			  'background-color':'#FFF',
			  'overflow-y':'auto'
		  },
		  socket:{
			  url:'http://127.0.0.1:1337'
		  },

		  ludoEvents:function () {
			  this.getSocket().on('getmessage', this.appendMessage.bind(this));
		  },

		  appendMessage:function (msg) {
			  var html = this.getBody().get('html');
			  html = html + '>' + msg.message + '<br>';
			  this.getBody().set('html', html);
		  }
	  });

	  ludo.chat.TextPanel = new Class({
		  Extends:ludo.View,
		  layout:'cols',
		  height:30,
		  css:{
			  'margin-top':3
		  },
		  children:[
			  {
				  type:'form.Text',
				  weight:1,
				  name:'text'
			  },
			  {
				  type:'form.Button', value:'Send',
				  name:'send',
				  width:80
			  }
		  ],
		  socket:{
			  url:'http://127.0.0.1:1337',
			  emitEvents:['chat']
		  },

		  ludoEvents:function () {
			  this.parent();
			  this.child['send'].addEvent('click', this.sendMessage.bind(this))
		  },
		  sendMessage:function () {
			  if (this.child['text'].getValue().length > 0) {
				  this.fireEvent('chat', { message:this.child['text'].getValue()});
				  this.child['text'].setValue('');
			  }
		  }
	  });

	  new ludo.Window({
		  id:'myWindow',
		  minWidth:100, minHeight:100,
		  left:50, top:50,
		  width:410, height:490,
		  title:'Chat application',
		  layout:'rows',
		  children:[
			  {
				  type:'chat.Panel'
			  },
			  {
				  type:'chat.TextPanel'
			  }
		  ]
	  });
 */
ludo.socket.Socket = new Class({
	Extends:ludo.Core,
	type:'socket.Socket',

	/**
	 * Socket http url, example: http://localhost:1337
	 * URL can also be defined in LUDOJS_CONFIG.socket
	 * @config url
	 * @type String
	 * @default undefined
	 */
	url:undefined,

	socket:undefined,

	/**
	 * Reference to parent component
	 * @property {Object} component
	 */
	component:undefined,

	/**
	 Array of view/component events to emit to server. When this event is fired, it will be emitted
	 to the server automatically.
	 @config emitEvents
	 @type {Array}
	 @default undefined
	 @example
	 	new ludo.View({
	 		...
	 		socket:{
	 			url:'http://127.0.0.1:1337',
	 			emitEvents:['chat'] // emit the "chat" event
	 		}
	 specifies that the "chat" event should be sent to NodeJS on the server.
	 @example
	 	this.fireEvent('chat', { message:this.child['text'].getValue()});

	 will cause { message:this.child['text'].getValue()} to be sent to the server where you can pick it up with code like this
	 @example
	 	socket.on('chat', function (data) {
	 		console.log(data.message);
		}

	 */
	emitEvents:undefined,


	ludoConfig:function (config) {
		this.parent(config);
		if (config.url !== undefined)this.url = config.url;
		if (config.component !== undefined) this.component = config.component;
		if (config.emitEvents !== undefined)this.emitEvents = config.emitEvents;
		if (!this.hasIoSocketLibrary() || !this.hasIoSocketLibraryForThisUrl()) {
			this.loadLib();
		}
		if (this.emitEvents)this.assignComponentEvents();
	},

	assignComponentEvents:function () {
		for (var i = 0; i < this.emitEvents.length; i++) {
			this.component.addEvent(this.emitEvents[i], this.getEventFn(this.emitEvents[i]).bind(this));
		}
	},

	getEventFn:function (event) {
		return function (obj) {
			this.emit(event, obj);
		}
	},

	getUrl:function () {
		var url = this.url;
		if (!url && window.LUDOJS_CONFIG !== undefined) {
			url = LUDOJS_CONFIG.socket;
		}
		if (url)url = url.trim();
		return url;
	},

	loadLib:function () {
		var url = this.getUrl();
		if (url !== undefined) {
			if (ludo.socket.libLoaded === undefined) {
				ludo.socket.libLoaded = {};
			}
			if (ludo.socket.libLoaded[url] === undefined) {
				if (url !== undefined) {
					ludo.socket.libLoaded[url] = true;
					Asset.javascript(url + '/socket.io/socket.io.js');
				}
			}
		}
	},

	/**
	Add socket event
	@method on
	@param {String} event
	@param {Function} fn
	@example
		this.getSocket().on('eventName', this.myMethod.bind(this));
	This is an example of how to add a socket event from a View. It will execute the "myMethod" method when
	socket event "eventName" is fired.
	*/
	on:function (event, fn) {
		if (!this.hasIoSocketLibrary()) {
			this.on.delay(50, this, [event, fn]);
			return;
		}
		this.getSocket().on(event, fn);
	},
	/**
	Emit socket event
	@method emit
	@param {String} event
	@param {Object} query
	@example
		{
			q: { query },
			m: 'module',
			s: 'submodule',
			c: 'command/event name'
		}

	 "c" will be set to your passed event name
	 "q" will be set to your passed query object
	 "m" will be set to module name of the view(if any)
	 "s" will be set to sub module name of the view(if any)
	 */
	emit:function (event, query) {
		if (!this.hasIoSocketLibrary()) {
			this.emit.delay(50, this, [event, query]);
			return;
		}
		this.getSocket().emit(event, this.getObjectToEmit(event, query));
	},

	getObjectToEmit:function (event, obj) {
		return {
			m:this.getModule(),
			s:this.getSubModule(),
			c:event,
			q:obj
		}
	},

	hasIoSocketLibrary:function () {
		return window['io'] !== undefined;
	},

	hasIoSocketLibraryForThisUrl:function () {
		return ludo.socket.libLoaded === undefined || ludo.socket.libLoaded[this.getUrl()] == undefined;
	},

	getSocket:function () {
		if (this.socket === undefined) {
			if (ludo.socket.socketCache === undefined) {
				ludo.socket.socketCache = {};
			}
			var url = this.getUrl();
			if (ludo.socket.socketCache[url] === undefined) {
				ludo.socket.socketCache[url] = window['io'].connect(url);
			}
			this.socket = ludo.socket.socketCache[url];
		}

		return this.socket;
	}
});
/***
 * Make component or DOM elements resizable
 * @module effect
 * @class Resize
 * @namespace effect
 * @extends Core
 */
ludo.effect.Resize = new Class({
    Extends:ludo.Core,
    /**
     * Use shim
     * @attribute {Boolean} useShim
     */
    useShim:true,
    component:undefined,
    els:{
        shim:undefined,
        applyTo:undefined,
        handle:{}
    },
    /**
     * min x position
     * @attribute {Number} minX
     * @default undefined
     */
    minX:undefined,
    /**
     * max x position
     * @attribute {Number} maxX
     * @default undefined
     */
    maxX:undefined,
    /**
     * minimum width
     * @attribute {Number} minWidth
     * @default undefined
     */
    minWidth:undefined,
    /**
     * Maximum width
     * @attribute {Number} maxWidth
     * @default undefined
     */
    maxWidth:undefined,
    /**
     * min y position
     * @attribute {Number} minY
     * @default undefined
     */
    minY:undefined,
    /**
     * max x position
     * @attribute {Number} maxY
     * @default undefined
     */
    maxY:undefined,
    /**
     * minimum height
     * @attribute {Number} minHeight
     * @default undefined
     */
    minHeight:undefined,
    /**
     * max height
     * @attribute {Number} maxHeight
     * @default undefined
     */
    maxHeight:undefined,

    /**
     * Preserve aspect ratio while resizing
     * @attribute {Boolean} preserveAspectRatio
     * @default false
     */
    preserveAspectRatio:false,

    aspectRatio:undefined,

    resizeKeys:{
        'e':['width'],
        's':['height'],
        'w':['left', 'width'],
        'n':['top', 'height'],
        'nw':['top', 'left', 'height', 'width'],
        'ne':['top', 'width', 'height'],
        'se':['width', 'height'],
        'sw':['left', 'height', 'width']
    },

    aspectRatioKeys:undefined,

    dragProperties:{
        active:false
    },

    xRegions:[
        ['w', 'nw', 'sw'],
        ['e', 'ne', 'se']
    ],
    yRegions:[
        ['n', 'nw', 'ne'],
        ['s', 'sw', 'se']
    ],

    aspectRatioMinMaxSet:false,

    ludoConfig:function (config) {
        if (config.useShim !== undefined)this.useShim = config.useShim;
        if (config.component !== undefined) {
            this.component = config.component;
            this.els.applyTo = this.component.getEl();
        } else {
            this.els.applyTo = config.applyTo;
        }
        if (config.minX !== undefined)this.minX = config.minX;
        if (config.minY !== undefined)this.minY = config.minY;
        if (config.maxX !== undefined)this.maxX = config.maxX;
        if (config.maxY !== undefined)this.maxY = config.maxY;
        if (config.minWidth !== undefined)this.minWidth = config.minWidth;
        if (config.maxWidth !== undefined)this.maxWidth = config.maxWidth;
        if (config.minHeight !== undefined)this.minHeight = config.minHeight;
        if (config.maxHeight !== undefined)this.maxHeight = config.maxHeight;
        if (config.preserveAspectRatio !== undefined)this.preserveAspectRatio = config.preserveAspectRatio;
        if (config.listeners !== undefined)this.addEvents(config.listeners);


        this.addDragEvents();
        this.setDisplayPropertyOfEl.delay(100, this);
    },

    setDisplayPropertyOfEl:function () {
        var display = this.getEl().getStyle('display');
        if (display !== 'absolute' && display !== 'relative') {
			if(Browser.ie && Browser.version < 9)return;
            this.getEl().style.display = 'relative';
        }
    },

    addDragEvents:function () {
        document.body.addEvent(this.getDragEndEvent(), this.stopResize.bind(this));
        document.body.addEvent(this.getDragMoveEvent(), this.resize.bind(this));
    },

    /**
     * Add resize handle to a region. A region can be
     * nw,n,ne,e,se,s,sw or w.
	 *
	 * A new DOM element will be created for the resize handle and injected into
	 * the resized DOM element.
     *
     * Second parameter cssClass is optional.
     * @method addHandle
     * @param {String} region
     * @param {String} cssClass
     * @return void
     */

    addHandle:function (region, cssClass) {
        var el = this.els.handle[region] = new Element('div');
        ludo.dom.addClass(el, 'ludo-component-resize-el');
        el.addClass(this.getCssFor(region));
        if (cssClass !== undefined)el.addClass(cssClass);
        el.set('html', '<span></span>');
        el.style.cursor = region + '-resize';
        el.setProperty('region', region);
        el.addEvent(this.getDragStartEvent(), this.startResize.bind(this));
        this.els.applyTo.adopt(el);
    },

    startResize:function (e) {
        var region = e.target.getProperty('region');
        /**
         * Fired when starting resize
         * @event start
         * @param string region
         */
        this.fireEvent('start', region);

		ludo.EffectObject.start();

        this.dragProperties = {
            active:true,
            region:region,
            start:{ x:e.page.x, y:e.page.y },
            current:{x:e.page.x, y:e.page.y },
            el:this.getShimCoordinates(),
            minWidth:this.minWidth,
            maxWidth:this.maxWidth,
            minHeight:this.minHeight,
            maxHeight:this.maxHeight,
            area:this.getScalingFactors(),
            preserveAspectRatio: this.preserveAspectRatio ? this.preserveAspectRatio : e.shift ? true : false
        };
        if (this.preserveAspectRatio || e.shift) {
            this.setMinAndMax();
        }
        this.dragProperties.minX = this.getDragMinX();
        this.dragProperties.maxX = this.getDragMaxX();
        this.dragProperties.minY = this.getDragMinY();
        this.dragProperties.maxY = this.getDragMaxY();

        this.setBodyCursor();
        if (this.useShim) {
            this.showShim();
        }
        if(this.shouldUseTouchEvents())return false;
    },

    /**
     * Set min and max width/height based on aspect ratio
     * @method setMinAndMax
     * @private
     */
    setMinAndMax:function () {
        var ratio = this.getAspectRatio();
        var d = this.dragProperties;
        if (ratio === 0)return;
        var minWidth, maxWidth, minHeight, maxHeight;

        if (this.maxWidth !== undefined)maxHeight = this.maxWidth / ratio;
        if (this.minWidth !== undefined)minHeight = this.minWidth / ratio;
        if (this.maxHeight !== undefined)maxWidth = this.maxHeight * ratio;
        if (this.minHeight !== undefined)minWidth = this.minHeight * ratio;

        var coords = this.getEl().getPosition();
        var absMaxWidth = this.getBodyWidth() - coords.x;
        var absMaxHeight = this.getBodyHeight() - coords.y;

        d.minWidth = Math.max(minWidth || 0, this.minWidth || 0);
        d.maxWidth = Math.min(maxWidth || absMaxWidth, this.maxWidth || absMaxWidth);
        d.minHeight = Math.max(minHeight || 0, this.minHeight || 0);
        d.maxHeight = Math.min(maxHeight || absMaxHeight, this.maxHeight || absMaxHeight);

        if (d.maxWidth / ratio > d.maxHeight)d.maxWidth = d.maxHeight * ratio;
        if (d.maxHeight * ratio > d.maxWidth)d.maxHeight = d.maxWidth / ratio;
    },

    getDragMinX:function () {
        var ret, d = this.dragProperties, r = d.region;
        if (d.maxWidth !== undefined && this.xRegions[0].indexOf(r) >= 0) {
            ret = d.el.left + d.el.width - d.maxWidth;
        } else if (d.minWidth !== undefined && this.xRegions[1].indexOf(r) >= 0) {
            ret = d.el.left + d.minWidth;
        }
        if (this.minX !== undefined) {
            if (ret == undefined)ret = this.minX; else ret = Math.max(ret, this.minX);
        }
        return ret;
    },

    getDragMaxX:function () {
        var ret, d = this.dragProperties, r = d.region;
        if (d.minWidth !== undefined && this.xRegions[0].indexOf(r) >= 0) {
            ret = d.el.left + d.el.width - d.minWidth;
        } else if (d.maxWidth !== undefined && this.xRegions[1].indexOf(r) >= 0) {
            ret = d.el.left + d.maxWidth;
        }
        if (this.maxX !== undefined) {
            if (ret == undefined)ret = this.maxX; else ret = Math.min(ret, this.maxX);
        }
        return ret;
    },

    getDragMinY:function () {
        var ret, d = this.dragProperties, r = d.region;
        if (d.maxHeight !== undefined && this.yRegions[0].indexOf(r) >= 0) {
            ret = d.el.top + d.el.height - d.maxHeight;
        } else if (d.minHeight !== undefined && this.yRegions[1].indexOf(r) >= 0) {
            ret = d.el.top + d.minHeight;
        }
        if (this.minY !== undefined) {
            if (ret == undefined)ret = this.minY; else ret = Math.max(ret, this.minY);
        }
        return ret;
    },

    getDragMaxY:function () {
        var ret, d = this.dragProperties, r = d.region;
        if (d.minHeight !== undefined && this.yRegions[0].indexOf(r) >= 0) {
            ret = d.el.top + d.el.height - d.minHeight;
        } else if (d.maxHeight !== undefined && this.yRegions[1].indexOf(r) >= 0) {
            ret = d.el.top + d.maxHeight;
        }
        if (this.maxY !== undefined) {
            if (ret == undefined)ret = this.maxY; else ret = Math.min(ret, this.maxY);
        }
        return ret;
    },

    setBodyCursor:function () {
        document.body.style.cursor = this.dragProperties.region + '-resize';
    },

    revertBodyCursor:function () {
        document.body.style.cursor = 'default';
    },

    resize:function (e) {
        if (this.dragProperties.active) {
            this.dragProperties.current = this.getCurrentCoordinates(e);
            var coordinates = this.getCoordinates();
            /**
             * Fired during resize. CSS coordinates are passed as parameter to this event.
             * @event resize
             * @param {Object} coordinates
             */
            this.fireEvent('resize', coordinates);

            if (this.useShim) {
                this.els.shim.setStyles(coordinates);
            } else {
                this.getEl().setStyles(coordinates);
            }
        }
    },

    getCurrentCoordinates:function (e) {
        var ret = {x:e.page.x, y:e.page.y };
        var d = this.dragProperties;
        if(d.preserveAspectRatio && d.region.length === 2)return ret;
        if (d.minX !== undefined && ret.x < d.minX)ret.x = d.minX;
        if (d.maxX !== undefined && ret.x > d.maxX)ret.x = d.maxX;
        if (d.minY !== undefined && ret.y < d.minY)ret.y = d.minY;
        if (d.maxY !== undefined && ret.y > d.maxY)ret.y = d.maxY;
        return ret;
    },

    /**
     * Returns coordinates for current drag operation,
     * example: {left:100,top:100,width:500,height:400}
     * @method getCoordinates
     * @return {Object}
     */
    getCoordinates:function () {
        var d = this.dragProperties;
        var keys = this.resizeKeys[d.region];
        var ret = {};

        if (!d.preserveAspectRatio || d.region.length === 1) {
            for (var i = 0; i < keys.length; i++) {
                ret[keys[i]] = this.getCoordinate(keys[i]);
            }
        }

        if (d.preserveAspectRatio) {
            switch (d.region) {
                case 'e':
                case 'w':
                    ret.height = ret.width / this.aspectRatio;
                    break;
                case 'n':
                case 's':
                    ret.width = ret.height * this.aspectRatio;
                    break;
                default:
                    var scaleFactor = this.getScaleFactor();
                    ret.width = d.el.width * scaleFactor;
                    ret.height = d.el.height * scaleFactor;
                    if(d.region == 'ne' || d.region =='nw'){
                        ret.top = d.el.top + d.el.height - ret.height;
                    }
                    if(d.region == 'nw' || d.region == 'sw'){
                        ret.left = d.el.left + d.el.width - ret.width;
                    }
                    ret.width += this.getBWOfShim();
                    ret.height += this.getBHOfShim();
                    break;
            }
        }
        return ret;
    },

    getScaleFactor:function () {
        var d = this.dragProperties;
        var r = d.region;
        var factor;

        var offsetX = (d.current.x - d.start.x) * d.area.xFactor / d.area.sum;
        var offsetY = (d.current.y - d.start.y) * d.area.yFactor / d.area.sum;
        switch (r) {
            case 'se':
                factor = 1 + offsetX + offsetY;
                break;
            case 'ne':
                factor = 1 + offsetX + offsetY * -1;
                break;
            case 'nw':
                factor = 1 + offsetX * -1 + offsetY * -1;
                break;
            case 'sw':
                factor = 1 + offsetX * -1 + offsetY;
                break;


        }
        if (d.minWidth) {
            factor = Math.max(factor, d.minWidth / d.el.width);
        }
        if (d.minHeight) {
            factor = Math.max(factor, d.minHeight / d.el.height);
        }
        if (d.maxWidth) {
            factor = Math.min(factor, d.maxWidth / d.el.width);
        }
        if (d.maxHeight) {
            factor = Math.min(factor, d.maxHeight / d.el.height);
        }
        return factor;

    },

    getCoordinate:function (key) {
        var r = this.dragProperties.region;
        var d = this.dragProperties;
        switch (key) {
            case 'width':
                if (r == 'e' || r == 'ne' || r == 'se') {
                    return d.el.width - d.start.x + d.current.x + this.getBWOfShim();
                } else {
                    return d.el.width + d.start.x - d.current.x + this.getBWOfShim();
                }
                break;
            case 'height':
                if (r == 's' || r == 'sw' || r == 'se') {
                    return d.el.height - d.start.y + d.current.y + this.getBHOfShim();
                } else {
                    return d.el.height + d.start.y - d.current.y + this.getBHOfShim();
                }
            case 'top':
                if (r == 'n' || r == 'nw' || r == 'ne') {
                    return d.el.top - d.start.y + d.current.y;
                } else {
                    return d.el.top + d.start.y - d.current.y;
                }
            case 'left':
                if (r == 'w' || r == 'nw' || r == 'sw') {
                    return d.el.left - d.start.x + d.current.x;
                } else {
                    return d.el.left + d.start.x - d.current.x;
                }
        }
    },

    getBWOfShim:function () {
        if (this.useShim) {
            return ludo.dom.getBW(this.getShim());
        }
        return 0;
    },

    getBHOfShim:function () {
        if (this.useShim) {
            return ludo.dom.getBH(this.getShim());
        }
        return 0;
    },

    stopResize:function () {
        if (this.dragProperties.active) {
            this.dragProperties.active = false;
            /**
             * Fired when resize is complete.
             * CSS coordinates are passed as parameter to this event.
             * @event stop
             * @param {Object} coordinates
             */
            this.fireEvent('stop', this.getCoordinates());
			ludo.EffectObject.end();
            this.revertBodyCursor();
            if (this.useShim) {
                this.hideShim();
            }
        }
    },

    getCssFor:function (region) {
        return 'ludo-component-resize-region-' + region;
    },

    showShim:function () {
        var shim = this.getShim();
        var coords = this.getShimCoordinates();
        shim.setStyles({
            display:'',
            left:coords.left,
            top:coords.top,
            width:coords.width,
            height:coords.height
        });
    },

    hideShim:function () {
        this.getShim().style.display = 'none';
    },

    getShimCoordinates:function () {
        var coords = this.getEl().getCoordinates();
        if (this.useShim) {
            var shim = this.getShim();
            coords.width -= ludo.dom.getBW(shim);
            coords.height -= ludo.dom.getBH(shim);
        }
        return coords;
    },

    getShim:function () {
        if (!this.els.shim) {
            var el = this.els.shim = new Element('div');
            ludo.dom.addClass(el, 'ludo-shim-resize');
            el.setStyles({
                position:'absolute',
                'z-index':50000
            });
            document.body.adopt(el);
        }

        return this.els.shim;
    },
    getEl:function () {
        return this.els.applyTo;
    },

    hideAllHandles:function () {
        this.setHandleDisplay('none');
    },
    showAllHandles:function () {
        this.setHandleDisplay('');
    },

    setHandleDisplay:function (display) {
        for (var key in this.els.handle) {
            if (this.els.handle.hasOwnProperty(key)) {
                this.els.handle[key].style.display = display;
            }
        }
    },

    getAspectRatio:function () {
        if (this.aspectRatio === undefined) {
            var size = this.getEl().getSize();
            this.aspectRatio = size.x / size.y;
        }
        return this.aspectRatio;
    },

    getBodyWidth:function () {
        return document.documentElement.offsetWidth;
    },
    getBodyHeight:function () {
        return document.documentElement.offsetHeight;
    },

    getScalingFactors:function () {
        var size = this.getEl().getSize();
        return {
            xFactor:size.x / size.y,
            yFactor:size.y / size.x,
            sum:size.x + size.y
        };
    }
});
/**
 * Base class for animations
 * @namespace effect
 * @class Effect
 */
ludo.effect.Effect = new Class({
	Extends: ludo.Core,
	fps:33,
	/**
	 Fly/Slide DOM node to a position
	 @method fly
	 @param {Object} config
	 @example
	 	<div id="myDiv" style="position:absolute;width:100px;height:100px;border:1px solid #000;background-color:#DEF;left:50px;top:50px"></div>
		<script type="text/javascript">
		 new ludo.effect.Effect().fly({
			el: 'myDiv',
			duration:.5,
			to:{ x:500, y: 300 },
			 onComplete:function(){
				 new ludo.effect.Effect().fly({
					el: 'myDiv',
					duration:1,
					to:{ x:600, y: 50 }
				 });
			 }
		 });
	 	</script>
	 Which will first move "myDiv" to position 500x300 on the screen, then to 600x50.
	 */
	fly:function(config){

		config.el = document.id(config.el);
		config.duration = config.duration || .2;
		if(config.from == undefined){
			config.from = config.el.getPosition();
		}
		var fx = this.getFx(config.el, config.duration, config.onComplete);
		fx.start({
			left : [config.from.x, config.to.x],
			top : [config.from.y, config.to.y]
		});
	},

	/**
	 Fly/Slide DOM node from current location to given x and y coordinats in given seconds.
	 @method flyTo
	 @param {HTMLElement} el
	 @param {Number} x
	 @param {Number} y
	 @param {Number} seconds
	 @example

	 You may also use this method like this:
	 @example
	 	<div id="myDiv" style="position:absolute;width:100px;height:100px;border:1px solid #000;background-color:#DEF;left:50px;top:50px"></div>
		<script type="text/javascript">
	 	new ludo.effect.Effect().flyTo('myDiv', 500, 300, .5);
	 	</script>
	 Which slides "myDiv" to position 500x300 in 0.5 seconds.
	 */
	flyTo:function(el, x, y, seconds){
		this.fly({
			el:el,
			to:{x : x, y: y},
			duration: seconds
		});
	},

	getFx:function (el, duration, onComplete) {
		duration*=1000;
		var fx = new Fx.Morph(el, {
			duration:duration
		});
		fx.addEvent('complete', this.animationComplete.bind(this, [onComplete, el]));
		return fx;
	},

	animationComplete:function(onComplete, el){
		/**
		 * Fired when animation is completed
		 * @event animationComplete
		 * @param {effect.Drag} this
		 */
		this.fireEvent('animationComplete', this);

		if(onComplete !== undefined){
			onComplete.call(this, el);
		}
	},

	fadeOut:function(el, duration, callback){
		var stops = this.getStops(duration);
		var stopIncrement = 100 / stops * -1;
		this.execute({
			el:el,
			index:0,
			stops:stops,
			styles:[
				{ key: 'opacity', currentValue: 100, change: stopIncrement }
			],
			callback : callback,
			unit:''
		})
	},

	slideIn:function(el, duration, callback, to){
		to = to || el.getPosition();
		var from = {
			x: to.x,
			y : el.parentNode.offsetWidth + el.offsetHeight
		};
		this.slide(el,from, to, duration, callback);
	},

	slideOut:function(el, duration, callback, from){
		from = from || el.getPosition();
		var to = {
			x: from.x,
			y : el.parentNode.offsetHeight + el.offsetHeight
		};
		this.slide(el, from, to, duration, callback);
	},

	slide:function(el, from, to, duration, callback){
		var stops = this.getStops(duration);
		var styles = [];
		if(from.x !== to.x){
			el.style.left = from.x + 'px';
			styles.push({
				key : 'left',
				currentValue:from.x,
				change: (to.x - from.x) / stops
			});
		}
		if(from.y !== to.y){
			el.style.top = from.y + 'px';
			styles.push({
				key : 'top',
				currentValue:from.y,
				change: (to.y - from.y) / stops
			});
		}
		this.execute({
			el:el,
			index:0,
			stops:stops,
			styles:styles,
			callback : callback,
			unit:'px'
		});
		this.show(el);
	},

	fadeIn:function(el, duration, callback){
		var stops = this.getStops(duration);
		var stopIncrement = 100 / stops;
		this.execute({
			el:el,
			index:0,
			stops:stops,
			styles:[
				{ key: 'opacity', currentValue: 0, change: stopIncrement }
			],
			callback : callback,
			unit:''
		});
		this.show(el);
	},

	show:function(el){
		if(el.style.visibility==='hidden')el.style.visibility='visible';
	},

	getStops:function(duration){
		return duration * this.fps;
	},

	execute:function(config){
		var el = config.el;
		for(var i=0;i<config.styles.length;i++){
			var s = config.styles[i];
			s.currentValue += s.change;
			switch(s.key){
				case 'opacity':
					el.style.opacity = (s.currentValue / 100);
					el.style.filter = ['alpha(opacity=', s.currentValue,')'].join('');
					break;
				default:
					el.style[s.key] = s.currentValue + config.unit;
			}
			config.index ++;

			if(config.index < config.stops){
				this.execute.delay(this.fps, this, config);
			}else{
				if(config.callback)config.callback.apply(this);
			}
		}
	}
});


/**
 Specification of a draggable node objects sent to {{#crossLink "effect.Drag/add"}}{{/crossLink}}. You will
 never create objects of this class.
 @namespace effect
 @class DraggableNode
 @type {Object|String}
 */
ludo.effect.DraggableNode = new Class({
	/**
	 id of node. This attribute is optional
	 @property id
	 @type {String}
	 @default undefined
	 @optional
	 @example
	 	var dragDrop = new ludo.effect.Drag();
	 	var el = new Element('div');
	 	dragDrop.add({
	 		id: 'myId',
			el : el
	 	});
	 	var ref = dragDrop.getById('myId');
	 Or you can use this code which does the same:
	 @example
	 	var dragDrop = new ludo.effect.Drag();
	 	var el = new Element('div');
	 	el.id = 'myId';
	 	dragDrop.add(el);
	 	var ref = dragDrop.getById('myId');
	 Id's are only important if you need to access nodes later using {{#crossLink "effect.Drag/getById"}}{{/crossLink}}
	 */
	id: undefined,

	/**
	 * Reference to dragable DOM node
	 * @property el
	 * @default undefined
	 * @type {String|HTMLDivElement}
	 */
	el:undefined,
	/**
	 * Reference to handle for dragging. el will only be draggable by dragging the handle.
	 * @property handle
	 * @type {String|HTMLDivElement}
	 * @default undefined
	 * @optional
	 */
	handle:undefined,

	/**
	 * Minimum x position. This is an optional argument. If not set, you will use the params
	 * set when creating the ludo.effect.Drag component if any.
	 * @property minX
	 * @type {Number}
	 * @default undefined
	 * @optional
	 */
	minX:undefined,
	/**
	 * Maximum x position. This is an optional argument. If not set, you will use the params
	 * set when creating the ludo.effect.Drag component if any.
	 * @property maxX
	 * @type {Number}
	 * @default undefined
	 * @optional
	 */
	maxX:undefined,
	/**
	 * Minimum x position. This is an optional argument. If not set, you will use the params
	 * set when creating the ludo.effect.Drag component if any.
	 * @property minY
	 * @type {Number}
	 * @default undefined
	 * @optional
	 */
	minY:undefined,
	/**
	 * Maximum y position. This is an optional argument. If not set, you will use the params
	 * set when creating the ludo.effect.Drag component if any.
	 * @property maxY
	 * @type {Number}
	 * @default undefined
	 * @optional
	 */
	maxY:undefined,
	/**
	 Allow dragging in these directions. This is an optional argument. If not set, you will use the params
	 set when creating the ludo.effect.Drag component if any.
	 @property directions
	 @type {String}
	 @default 'XY'
	 @optional
	 @example
	 	directions:'XY'	//
	 	..
	 	directions:'X' // Only allow dragging along x-axis
	 	..
	 	directions:'Y' // Only allow dragging along y-axis
	 */
	directions:undefined
});
/**
@namespace effect
@class Drag
@extends effect.Effect
@description Class for dragging DOM elements.
@constructor
@param {Object} config
@example
	<style type="text/css">
	.ludo-shim {
		 border: 15px solid #AAA;
		 background-color: #DEF;
		 margin: 5;
		 opacity: .5;
		 border-radius: 5px;
	}
	.draggable{
		width:150px;
		z-index:1000;
		height:150px;
		border-radius:5px;
		border:1px solid #555;
		background-color:#DEF
	}
	</style>
	<div id="draggable" class="draggable">
		I am draggable
	</div>
	<script type="text/javascript">
	 var d = new ludo.effect.Drag({
		useShim:true,
		 listeners:{
			 endDrag:function(dragged, dragEffect){
				 dragEffect.getEl().setStyles({
					 left : dragEffect.getX(),
					 top: dragEffect.getY()
				 });
			 },
			 drag:function(pos, dragEffect){
				 dragEffect.setShimText(dragEffect.getX() + 'x' + dragEffect.getY());
			 }
		 }
	 });
	d.add('draggable'); // "draggable" is the id of the div
 	</script>

*/
ludo.effect.Drag = new Class({
	Extends:ludo.effect.Effect,

	/**
	 * Reference to drag handle (Optional). If not set, "el" will be used
	 * @config handle
	 * @type Object|String
	 * @default undefined
	 */
	handle:undefined,
	/**
	 * Reference to DOM element to be dragged
	 * @config el
	 * @type Object|String
	 * @default undefined
	 */
	el:undefined,

	/**
	 * Minimum x position
	 * @config minX
	 * @type {Number}
	 * @default undefined
	 */
	minX:undefined,
	/**
	 * Minimum y position
	 * @config minY
	 * @type {Number}
	 * @default undefined
	 */
	minY:undefined,

	/**
	 * Maximum x position
	 * @config maxX
	 * @type {Number}
	 * @default undefined
	 */
	maxX:undefined,
	/**
	 * config y position
	 * @attribute maxY
	 * @type {Number}
	 * @default undefined
	 */
	maxY:undefined,

	/**
	 * minPos and maxPos can be used instead of minX,maxX,minY and maxY if
	 * you only accept dragging along x-axis or y-axis
	 * @config {Number} minPos
	 * @default undefined
	 */
	minPos:undefined,
	/**
	 * @config maxPos
	 * @type {Number}
	 * @default undefined
	 */
	maxPos:undefined,
	/**
	 * Accept dragging in these directions
	 * @config dragX
	 * @type String
	 * @default XY
	 */
	directions:'XY',

	/**
	 * Unit used while dragging
	 * @config unit, example : "px", "%"
	 * @default px
	 */
	unit:'px',

	dragProcess:{
		active:false
	},

	/**
	 * Delay in seconds from mouse down to start drag. If mouse is released within this interval,
	 * the drag will be cancelled.
	 * @config delay
	 * @type {Number}
	 * @default 0
	 */
	delay:0,

	startTime:undefined,
	inDelayMode:false,

	els:{},

	/**
	 * True to use dynamically created shim while dragging. When true,
	 * the original DOM element will not be dragged.
	 * @config useShim
	 * @type {Boolean}
	 * @default false
	 */
	useShim:false,

	/**
	 * True to automatically hide shim after drag is finished
	 * @config autohideShim
	 * @type {Boolean}
	 * @default true
	 */
	autoHideShim:true,

	/**
	 CSS classes to add to shim
	 @config shimCls
	 @type Array
	 @default undefined
	 @example
		 shimCls:['myShim','myShim-2']
	 which will results in this shim :
	 @example
	 	<div class="ludo-shim myShim myShim-2">
	 */
	shimCls:undefined,

	/**
	 * While dragging, always show dragged element this amount of pixels below mouse cursor.
	 * @config mouseYOffset
	 * @type {Number} pixels
	 * @default undefined
	 */
	mouseYOffset:undefined,

	/**
	 * While dragging, always show dragged element this amount of pixels right of mouse cursor.
	 * @config mouseXOffset
	 * @type {Number} pixels
	 * @default undefined
	 */
	mouseXOffset:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.el !== undefined) {
			this.add({
				el:config.el,
				handle:config.handle
			})
		}
		if (config.useShim !== undefined)this.useShim = config.useShim;
		if (config.autoHideShim !== undefined)this.autoHideShim = config.autoHideShim;
		if (config.directions !== undefined)this.directions = config.directions;
		if (config.delay !== undefined)this.delay = config.delay;
		if (config.minX !== undefined)this.minX = config.minX;
		if (config.maxX !== undefined)this.maxX = config.maxX;
		if (config.minY !== undefined)this.minY = config.minY;
		if (config.maxY !== undefined)this.maxY = config.maxY;
		if (config.minPos !== undefined)this.minPos = config.minPos;
		if (config.maxPos !== undefined)this.maxPos = config.maxPos;
		if (config.unit !== undefined)this.unit = config.unit;
		if (config.shimCls !== undefined)this.shimCls = config.shimCls;
		if (config.mouseYOffset !== undefined)this.mouseYOffset = config.mouseYOffset;
		if (config.mouseXOffset !== undefined)this.mouseXOffset = config.mouseXOffset;
	},

	ludoEvents:function () {
		this.parent();
		this.getEventEl().addEvent(this.getDragMoveEvent(), this.drag.bind(this));
		this.getEventEl().addEvent(this.getDragEndEvent(), this.endDrag.bind(this));
		if (this.useShim) {
			this.addEvent('start', this.showShim.bind(this));
			if(this.autoHideShim)this.addEvent('end', this.hideShim.bind(this));
		}
	},

	/**
	 Add draggable object
	 @method add
	 @param {effect.DraggableNode|String|HTMLDivElement} node
	 @return {effect.DraggableNode}
	 @example
	 	dragObject.add({
			el: 'myDiv',
			handle : 'myHandle'
		});
	 handle is optional.

	 @example
	 	dragObject.add('idOfMyDiv');

	 You can also add custom properties:

	 @example
	 	dragobject.add({
	 		id:'myReference',
			el: 'myDiv',
			column: 'city'
		});
	 	...
	 	...
	 	dragobject.addEvent('before', beforeDrag);
		 ...
		 ...
	 	function beforeDrag(dragged){
	 		console.log(dragged.el);
	 		console.log(dragged.column);
	 	}
	 */
	add:function (node) {
		node = this.getValidNode(node);
		var el = document.id(node.el);
		this.setPositioning(el);
		var handle;
		if (node.handle !== undefined) {
			handle = document.id(node.handle);
		} else {
			handle = el;
		}
		handle.id = handle.id || 'ludo-' + String.uniqueID();
		ludo.dom.addClass(handle, 'ludo-drag');
		handle.addEvent(this.getDragStartEvent(), this.startDrag.bind(this));
		handle.setProperty('forId', node.id);
		this.els[node.id] = Object.merge(node, {
			el:document.id(el),
			handle:handle
		});
		return this.els[node.id];
	},

	/**
	 * Remove node
	 * @method remove
	 * @param {String} id
	 * @return {Boolean} success
	 */
	remove:function(id){
		if(this.els[id]!==undefined){
			var el = document.id(this.els[id].handle);
			el.removeEvent(this.getDragStartEvent(), this.startDrag.bind(this));
			this.els[id] = undefined;
			return true;
		}
		return false;
	},

	removeAll:function(){
		var keys = Object.keys(this.els);
		for(var i=0;i<keys.length;i++){
			this.remove(keys[i]);
		}
		this.els = {};
	},

	getValidNode:function(node){
		if (!this.isElConfigObject(node)) {
			node = {
				el:document.id(node)
			};
		}
		if(typeof node.el === 'string'){
			node.el = document.id(node.el);
		}
		node.id = node.id || node.el.id || 'ludo-' + String.uniqueID();
		if (!node.el.id)node.el.id = node.id;
		node.el.setProperty('forId', node.id);
		return node;
	},

	isElConfigObject:function (config) {
		return config.el !== undefined || config.handle !== undefined;
	},

	setPositioning:function(el){
		var pos = el.getStyle('position');
		if (!this.useShim){
			if(pos && pos === 'relative'){

			}
			el.style.position = 'absolute';
		}else{

			if(!pos || (pos!='relative' && pos!='absolute')){
				el.style.position = 'relative';
			}
		}
	},

	getById:function(id){
		return this.els[id];
	},

	getIdByEvent:function (e) {
		var el = e.target;
		if (!el.hasClass('ludo-drag')) {
			el = el.getParent('.ludo-drag');
		}
		return el.getProperty('forId');
	},

	/**
	 * Returns reference to dragged object, i.e. object added in constructor or
	 * by use of add method
	 * @method getDragged
	 * @return {Object}
	 */
	getDragged:function(){
		return this.els[this.dragProcess.dragged];
	},

	/**
	 * Returns reference to draggable DOM node
	 * @method getEl
	 * @return {Object} DOMNode
	 */
	getEl:function () {
		return this.els[this.dragProcess.dragged].el;
	},

	getShimOrEl:function () {
		return this.useShim ? this.getShim() : this.getEl();
	},

	getSizeOf:function(el){
		return el.getSize !== undefined ? el.getSize() : { x: 0, y: 0 };
	},

	getPositionOf:function(el){
		return el.getPosition();
	},

	setDragCoordinates:function(){
		this.coordinatesToDrag = {
			x : 'x', y:'y'
		};
	},
	startDrag:function (e) {
		var id = this.getIdByEvent(e);

		var el = this.getById(id).el;
		var size = this.getSizeOf(el);
		var pos;
		if(this.useShim){
			pos = el.getPosition();
		}else{
			var parent = this.getPositionedParent(el);
			if(parent){
				pos = el.getPosition(parent);
			}else{
				pos = this.getPositionOf(el);
			}
		}

		var x = pos.x;
		var y = pos.y;
		this.dragProcess = {
			active:true,
			dragged:id,
			currentX:x,
			currentY:y,
			elX:x,
			elY:y,
			width:size.x,
			height:size.y,
			mouseX:e.page.x,
			mouseY:e.page.y
		};

		this.dragProcess.el = this.getShimOrEl();
		/**
		 * Event fired before drag
		 * @event {effect.DraggableNode}
		 * @param {Object} object to be dragged
		 * @param {ludo.effect.Drag} component
		 * @param {Object} pos(x and y)
		 */
		this.fireEvent('before', [this.els[id], this, {x:x,y:y}]);

		if(!this.isActive()){
			return;
		}

		this.dragProcess.minX = this.getMinX();
		this.dragProcess.maxX = this.getMaxX();
		this.dragProcess.minY = this.getMinY();
		this.dragProcess.maxY = this.getMaxY();
		this.dragProcess.dragX = this.canDragAlongX();
		this.dragProcess.dragY = this.canDragAlongY();

		if (this.delay) {
			this.setActiveAfterDelay();
		} else {
			/**
			 * Event fired before dragging
			 * @event start
			 * @param {effect.DraggableNode} object to be dragged.
			 * @param {ludo.effect.Drag} component
			 * @param {Object} pos(x and y)
			 */
			this.fireEvent('start', [this.els[id], this, {x:x,y:y}]);

			ludo.EffectObject.start();
		}

		return false;
	},

	getPositionedParent:function(el){
		var parent = el.parentNode;
		while(parent){
			var pos = parent.getStyle('position');
			if (pos === 'relative' || pos === 'absolute')return parent;
			parent = parent.getParent();
		}
		return undefined;
	},

	/**
	 Cancel drag. This method is designed to be called from an event handler
	 attached to the "beforeDrag" event.
	 @method cancelDrag
	 @example
	 	// Here, dd is a {{#crossLink "effect.Drag"}}{{/crossLink}} object
	 	dd.addEvent('before', function(draggable, dd, pos){
	 		if(pos.x > 1000 || pos.y > 500){
	 			dd.cancelDrag();
			}
	 	});
	 In this example, dragging will be cancelled when the x position of the mouse
	 is greater than 1000 or if the y position is greater than 500. Another more
	 useful example is this:
	 @example
		 dd.addEvent('before', function(draggable, dd){
		 	if(!this.isDraggable(draggable)){
		 		dd.cancelDrag()
		 	}
		});
	 Here, we assume that we have an isDraggable method which returns true or false
	 for whether the given node is draggable or not. "draggable" in this example
	 is one of the {{#crossLink "effect.DraggableNode"}}{{/crossLink}} objects added
	 using the {{#crossLink "effect.Drag/add"}}{{/crossLink}} method.
	 */

	cancelDrag:function () {
		this.dragProcess.active = false;
		this.dragProcess.el = undefined;
		ludo.EffectObject.end();
	},

	getShimFor:function (el) {
		return el;
	},

	setActiveAfterDelay:function () {
		this.inDelayMode = true;
		this.dragProcess.active = false;
		this.startIfMouseNotReleased.delay(this.delay * 1000, this);
	},

	startIfMouseNotReleased:function () {
		if (this.inDelayMode) {
			this.dragProcess.active = true;
			this.inDelayMode = false;
			this.fireEvent('start', [this.getDragged(), this, {x:this.getX(),y:this.getY()}]);
			ludo.EffectObject.start();
		}
	},

	drag:function (e) {
		if (this.dragProcess.active && this.dragProcess.el) {
			var pos = {
				x:undefined,
				y:undefined
			};
			if (this.dragProcess.dragX) {
				pos.x = this.getXDrag(e);
			}

			if (this.dragProcess.dragY) {
				pos.y = this.getYDrag(e);
			}

			this.move(pos);

			/**
			 * Event fired while dragging. Sends position, example {x:100,y:50}
			 * and reference to effect.Drag as arguments
			 * @event drag
			 * @param {Object} x and y
			 * @param {effect.Drag} this
			 */
			this.fireEvent('drag', [pos, this.els[this.dragProcess.dragged], this]);
			if (this.shouldUseTouchEvents())return false;

		}
		return undefined;
	},

	move:function (pos) {
		if (pos.x !== undefined) {
			this.dragProcess.currentX = pos.x;
			this.dragProcess.el.style.left = pos.x + this.unit;
		}
		if (pos.y !== undefined) {
			this.dragProcess.currentY = pos.y;
			this.dragProcess.el.style.top = pos.y + this.unit;
		}
	},

	/**
	 * Return current x pos
	 * @method getX
	 * @return {Number} x
	 */
	getX:function(){
		return this.dragProcess.currentX;
	},
	/**
	 * Return current y pos
	 * @method getY
	 * @return {Number} y
	 */
	getY:function(){
		return this.dragProcess.currentY;
	},

	getXDrag:function (e) {
		var posX;
		if(this.mouseXOffset !== undefined){
			posX = e.page.x + this.mouseXOffset;
		}else{
			posX = e.page.x - this.dragProcess.mouseX + this.dragProcess.elX;
		}

		if (posX < this.dragProcess.minX) {
			posX = this.dragProcess.minX;
		}
		if (posX > this.dragProcess.maxX) {
			posX = this.dragProcess.maxX;
		}
		return posX;
	},

	getYDrag:function (e) {
		var posY;
		if(this.mouseYOffset !== undefined){
			posY = e.page.y + this.mouseYOffset;
		}else{
			posY = e.page.y - this.dragProcess.mouseY + this.dragProcess.elY;
		}

		if (posY < this.dragProcess.minY) {
			posY = this.dragProcess.minY;
		}
		if (posY > this.dragProcess.maxY) {
			posY = this.dragProcess.maxY;
		}
		return posY;
	},

	endDrag:function () {
		if (this.dragProcess.active) {
			this.cancelDrag();
			/**
			 * Event fired on drag end
			 * @event end
			 * @param {effect.DraggableNode} dragged
			 * @param {ludo.effect.Drag} this
			 * @param {Object} x and y
			 */
			this.fireEvent('end', [
				this.getDragged(),
				this,
				{
					x:this.getX(),
					y:this.getY()
				}
			]);

		}
		if (this.inDelayMode)this.inDelayMode = false;

	},

	/**
	 * Set new max X pos
	 * @method setMaxX
	 * @param {Number} x
	 */
	setMaxX:function (x) {
		this.maxX = x;
	},
	/**
	 * Set new min X pos
	 * @method setMinX
	 * @param {Number} x
	 */
	setMinX:function (x) {
		this.minX = x;
	},
	/**
	 * Set new min Y pos
	 * @method setMinY
	 * @param {Number} y
	 */
	setMinY:function (y) {
		this.minY = y;
	},
	/**
	 * Set new max Y pos
	 * @method setMaxY
	 * @param {Number} y
	 */
	setMaxY:function (y) {
		this.maxY = y;
	},
	/**
	 * Set new min pos
	 * @method setMinPos
	 * @param {Number} pos
	 */
	setMinPos:function (pos) {
		this.minPos = pos;
	},
	/**
	 * Set new max pos
	 * @method setMaxPos
	 * @param {Number} pos
	 */
	setMaxPos:function (pos) {
		this.maxPos = pos;
	},

	getMaxX:function () {
		var maxX = this.getConfigProperty('maxX');
		if (maxX !== undefined)return maxX;
		if (this.maxPos !== undefined)return this.maxPos;
		return 100000;
	},

	getMaxY:function () {
		var maxY = this.getConfigProperty('maxY');
		if (maxY !== undefined)return maxY;
		if (this.maxPos !== undefined)return this.maxPos;
		return 100000;
	},

	getMinX:function () {
		var minX = this.getConfigProperty('minX');
		if (minX !== undefined)return minX;
		return this.minPos;
	},

	getMinY:function () {
		var dragged = this.getDragged();
		if(dragged && dragged.minY!==undefined)return dragged.minY;
		if (this.minY !== undefined)return this.minY;
		return this.minPos;
	},
	/**
	 * Return amount dragged in x direction
	 * @method getDraggedX
	 * @return {Number} x
	 */
	getDraggedX:function(){
		return this.getX() - this.dragProcess.elX;
	},
	/**
	 * Return amount dragged in y direction
	 * @method getDraggedY
	 * @return {Number} y
	 */
	getDraggedY:function(){
		return this.getY() - this.dragProcess.elY;
	},

	canDragAlongX:function () {
		return this.getConfigProperty('directions').indexOf('X') >= 0;
	},
	canDragAlongY:function () {
		return this.getConfigProperty('directions').indexOf('Y') >= 0;
	},

	getConfigProperty:function(property){
		var dragged = this.getDragged();
		return dragged && dragged[property] !== undefined ? dragged[property] : this[property];
	},

	/**
	 * Returns width of dragged element
	 * @method getHeight
	 * @return {Number}
	 */
	getWidth:function () {
		return this.dragProcess.width;
	},

	/**
	 * Returns height of dragged element
	 * @method getHeight
	 * @return {Number}
	 */
	getHeight:function () {
		return this.dragProcess.height;
	},
	/**
	 * Returns current left position of dragged
	 * @method getLeft
	 * @return {Number}
	 */
	getLeft:function () {
		return this.dragProcess.currentX;
	},

	/**
	 * Returns current top/y position of dragged.
	 * @method getTop
	 * @return {Number}
	 */
	getTop:function () {
		return this.dragProcess.currentY;
	},

	/**
	 * Returns reference to DOM element of shim
	 * @method getShim
	 * @return {HTMLDivElement} shim
	 */
	getShim:function () {
		if (this.shim === undefined) {
			this.shim = new Element('div');
			ludo.dom.addClass(this.shim, 'ludo-shim');
			this.shim.setStyles({
				position:'absolute',
				'z-index':50000,
				display:'none'
			});
			document.body.adopt(this.shim);

			if (this.shimCls !== undefined) {
				for (var i = 0; i < this.shimCls.length; i++) {
					this.shim.addClass(this.shimCls[i]);
				}
			}
			/**
			 * Event fired when shim is created
			 * @event createShim
			 * @param {HTMLDivElement} shim
			 */
			this.fireEvent('createShim', this.shim);
		}
		return this.shim;
	},

	/**
	 * Show shim
	 * @method showShim
	 */
	showShim:function () {
		this.getShim().setStyles({
			display:'',
			left:this.getShimX(),
			top:this.getShimY(),
			width:this.getWidth() + this.getShimWidthDiff(),
			height:this.getHeight() + this.getShimHeightDiff()
		});

		this.fireEvent('showShim', [this.getShim(), this]);
	},

	getShimY:function(){
		if(this.mouseYOffset!==undefined){
			return this.dragProcess.mouseY + this.mouseYOffset;
		}else{
			return this.getTop() + ludo.dom.getMH(this.getEl()) - ludo.dom.getMW(this.shim);
		}
	},

	getShimX:function(){
		if(this.mouseXOffset!==undefined){
			return this.dragProcess.mouseX + this.mouseXOffset;
		}else{
			return this.getLeft() + ludo.dom.getMW(this.getEl()) - ludo.dom.getMW(this.shim);
		}
	},

	getShimWidthDiff:function(){
		var e = this.getEl();
		var s = this.shim;
		return ludo.dom.getMW(e) - ludo.dom.getBW(s) - ludo.dom.getPW(s) - ludo.dom.getMW(s);
	},
	getShimHeightDiff:function(){
		var e = this.getEl();
		var s = this.shim;
		return ludo.dom.getMH(e) - ludo.dom.getBH(s) - ludo.dom.getPH(s) - ludo.dom.getMH(s);
	},

	/**
	 * Hide shim
	 * @method hideShim
	 */
	hideShim:function () {
		this.getShim().style.display = 'none';
	},

	/**
	 * Set text content of shim
	 * @method setShimText
	 * @param {String} text
	 */
	setShimText:function (text) {
		this.getShim().set('html', text);
	},

	/**
	 * Fly/Slide dragged element back to it's original position
	 * @method flyBack
	 */
	flyBack:function (duration) {
		this.fly({
			el: this.getShimOrEl(),
			duration: duration,
			from:{ x: this.getLeft(), y : this.getTop() },
			to:{ x: this.getStartX(), y : this.getStartY() },
			onComplete : this.flyBackComplete.bind(this)
		});
	},

	/**
	 * Fly/Slide dragged element to position of shim. This will only
	 * work when useShim is set to true.
	 * @method flyToShim
	 * @param {Number} duration in seconds(default = .2)
	 */
	flyToShim:function(duration){
		this.fly({
			el: this.getEl(),
			duration: duration,
			from:{ x: this.getStartX(), y : this.getStartY() },
			to:{ x: this.getLeft(), y : this.getTop() },
			onComplete : this.flyToShimComplete.bind(this)
		});
	},

	getStartX:function () {
		return this.dragProcess.elX;
	},

	getStartY:function () {
		return this.dragProcess.elY;
	},



	flyBackComplete:function(){
		/**
		 * Event fired after flyBack animation is complete
		 * @event flyBack
		 * @param {effect.Drag} this
		 * @param {HTMLElement} dom node
		 */
		this.fireEvent('flyBack', [this, this.getShimOrEl()]);
	},

	flyToShimComplete:function(){
		/**
		 * Event fired after flyToShim animation is complete
		 * @event flyBack
		 * @param {effect.Drag} this
		 * @param {HTMLElement} dom node
		 */
		this.fireEvent('flyToShim', [this, this.getEl()]);
	},

	isActive:function(){
		return this.dragProcess.active;
	}
});
/**
 * Class used to create button bars at bottom of components.
 * This class is instantiated automatically
 * @namespace view
 * @class ButtonBar
 * @extends View
 */
ludo.view.ButtonBar = new Class({
    Extends:ludo.View,
    type : 'ButtonBar',
    layout:{
        type:'linear',
		orientation:'horizontal',
		width:'matchParent'
    },
    align:'right',
    cls:'ludo-component-button-container',
    overflow:'hidden',
    component:undefined,

    ludoConfig:function (config) {
        if (config.align !== undefined)this.align = config.align;

        this.component = config.component;
        config.children = this.getValidChildren(config.children);
        if (this.align == 'right') {
            config.children = this.getItemsWithSpacer(config.children);
        }else{
            config.children[0].containerCss = config.children[0].containerCss || {};
            if(!config.children[0].containerCss['margin-left']){
                config.children[0].containerCss['margin-left'] = 2
            }
        }
		//
        this.parent(config);
    },
    ludoDOM:function () {
        this.parent();
        this.getBody().addClass('ludo-content-buttons');
    },

    ludoRendered:function () {
        this.parent();
		this.component.addEvent('resize', this.resizeRenderer.bind(this));
    },

	resizeRenderer:function(){
		this.getLayoutManager().getRenderer().resize();
	},

    getValidChildren:function (children) {
        for (var i = 0; i < children.length; i++) {
            if (children[i].value && !children[i].type) {
                children[i].type = 'form.Button'
            }
        }
        return children;
    },

    getButtons:function () {
        var ret = [];
        for (var i = 0; i < this.children.length; i++) {

            if (this.children[i].isButton && this.children[i].isButton()) {
                ret.push(this.children[i]);
            }
        }
        return ret;
    },

    getButton:function (key) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].id == key) {
                return this.children[i];
            }
            if (this.children[i].name == key) {
                return this.children[i];
            }
            if (this.children[i].getValue && this.children[i].getValue().toLowerCase() == key.toLowerCase()) {
                return this.children[i];
            }
        }
		return undefined;
    },



	resize:function(config){
		this.parent(config);
	},

    getItemsWithSpacer:function (children) {
        for (var i = children.length; i > 0; i--) {
            children[i] = children[i - 1];
        }
        children[0] = {
            layout: { weight:1 },
            containerCss:{ 'background-color':'transparent' },
            css:{ 'background-color':'transparent'}
        };
        return children;
    },
    /**
     * Returns the component where the button bar is placed
	 * @method getView
     * @return {Object} ludo Component
     * @private
     */
    getView : function(){
        return this.component;
    }
});
ludo.view.StatusBar = new Class({
    Extends: ludo.Core,

    text:undefined,
    icon:undefined,

    el:undefined,
    textEl:undefined,
    iconEl:undefined,

    hidden:false,

    ludoConfig:function(config){
        this.parent(config);
        this.text = config.text;
        this.icon = config.icon;
        this.createDOM();
    },

    createDOM:function(){
        var el = this.el = new Element('div');
        ludo.dom.addClass(el, 'ludo-component-statusbar');

        var statusIcon = this.iconEl = new Element('div');
        ludo.dom.addClass(statusIcon, 'ludo-component-statusbar-icon');
        if (this.icon) {
            statusIcon.setStyle('background-image', 'url(' + this.icon + ')');
        } else {
            statusIcon.setStyle('display', 'none');
        }
        el.adopt(statusIcon);

        var statusText = this.textEl = new Element('div');
        ludo.dom.addClass(statusText, 'ludo-component-statusbar-text');
        if (this.text) {
            statusText.set('html', this.text);
        }
        el.adopt(statusText);
    },

    getEl:function(){
        return this.el;
    },

    hideIcon:function(){
        this.iconEl.style.visibility = 'hidden';
    },

    setText:function(text){
        this.textEl.set('html', text);
    },

    showIcon:function(icon){
        this.iconEl.setStyle('display', '');
        if (icon !== undefined) {
            this.iconEl.setStyle('background-image', 'url(' + icon + ')');
        }
    },
    hide:function(){
        this.el.style.display='none';
        this.hidden = true;
    },

    getHeight:function(){
        var ret = this.el.getSize();
        if (ret.y == 0) {
            ret.y = 1;
        } else {
            ret.y += ludo.dom.getMH(this.el);
        }
        return ret.y;
    }
});
ludo.view.TitleBar = new Class({
    Extends:ludo.Core,
    view:undefined,
    els:{
        el:undefined,
        icon:undefined,
        title:undefined,
        buttons:{},
        buttonArray:[]
    },

    ludoConfig:function (config) {
        this.parent(config);
        this.view = config.view;
        this.createDOM();
        this.createEvents();
        this.setSizeOfButtonContainer.delay(20, this);
    },

    createDOM:function () {
        var el = this.els.el = new Element('div');
        if (this.view.boldTitle) {
            ludo.dom.addClass(el, 'ludo-rich-view-titlebar');
        } else {
            ludo.dom.addClass(el, 'ludo-component-titlebar');
        }

        var left = 0;
        if (this.view.icon) {
            this.createIconDOM();
            left += parseInt(this.els.icon.getStyle('width').replace(/[^0-9]/g, ''));
        }
        this.createTitleDOM();
        el.adopt(this.getButtonContainer());
		this.resizeButtonContainer.delay(20, this);
        this.els.title.style.left = left + 'px';
        el.addEvent('selectstart', ludo.util.cancelEvent);
    },

    createIconDOM:function () {
        var icon = this.els.icon = document.createElement('div');
        ludo.dom.addClass(icon, 'ludo-rich-view-titlebar-icon');
		icon.style.backgroundImage = 'url(' + this.view.icon + ')';
        this.els.el.appendChild(icon);
    },

	setTitle:function(title){
		this.els.title.innerHTML = title;
	},

    createTitleDOM:function () {
        var title = this.els.title = document.createElement('div');
		title.className = 'ludo-rich-view-titlebar-title';
        this.els.el.appendChild(title);
		this.setTitle(this.view.title);
    },
    createEvents:function () {
        this.addEvent('minimize', this.showMaximize.bind(this));
        this.addEvent('maximize', this.showMinimize.bind(this));
    },

    showMaximize:function () {
        this.els.buttons.maximize.style.display = '';
        this.els.buttons.minimize.style.display = 'none';
    },

    showMinimize:function () {
        this.els.buttons.maximize.style.display = 'none';
        this.els.buttons.minimize.style.display = '';
    },

    cancelTextSelection:function () {
        return false;
    },

    getButtonContainer:function () {
        var el = this.els.controls = document.createElement('div');
		el.className = 'ludo-title-bar-button-container';
        el.style.cursor = 'default';

        var le = document.createElement('div');
		le.className = 'ludo-title-bar-button-container-left-edge';
		le.style.cssText = "position:absolute;z-index:1;left:0;top:0;width:55%;height:100%;background-repeat:no-repeat;background-position:top left";
        el.appendChild(le);

        var re = document.createElement('div');
		re.className = 'ludo-title-bar-button-container-right-edge';
		re.style.cssText = 'position:absolute;z-index:1;right:0;top:0;width:55%;height:100%;background-repeat:no-repeat;background-position:top right';
        el.appendChild(re);

        if (this.view.isMinimizable()) {
            el.appendChild(this.getButton('minimize'));
            var max = this.getButton('maximize');
            max.style.display = 'none';
            el.appendChild(max);
        }
        if (this.view.isCollapsible()) {
            if (this.shouldShowCollapseButton()) {
                var button = this.getButton('collapse', 'collapse');
				var direction = this.getCollapseButtonDirection();
    			ludo.dom.addClass(button, 'ludo-title-bar-button-collapse-' + direction);
                el.appendChild(button);
            }
        }
        if (this.view.isClosable()) {
            el.appendChild(this.getButton('close', 'close'));
        }
        this.addBorderToButtons();
        return el;
    },

    shouldShowCollapseButton:function () {
        var parent = this.view.getParent();
		return parent.layout && parent.layout.type ? parent.layout.type ==='linear' || parent.layout.type=='relative' : false;
    },

    resizeButtonContainer:function () {
        this.els.controls.style.width = this.getWidthOfButtons() + 'px';
    },

    getButton:function (buttonType) {
        var b = this.els.buttons[buttonType] = new Element('div');
        b.id = 'ludo-title-bar-button-' + String.uniqueID();
		b.className = 'ludo-title-bar-button ludo-title-bar-button-' + buttonType;
        b.addEvent('click', this.buttonClick.bind(this));
        b.addEvent('mouseenter', this.enterButton.bind(this));
        b.addEvent('mouseleave', this.leaveButton.bind(this));
        b.setProperty('title', buttonType.capitalize());
        b.setProperty('buttonType', buttonType);
        this.els.buttonArray.push(b);
        return b;
    },

    addBorderToButtons:function () {
        var firstFound = false;
        for (var i = 0; i < this.els.buttonArray.length; i++) {
            if (this.els.buttonArray[i].style.display == 'none') {
                continue;
            }
            this.els.buttonArray[i].removeClass('ludo-title-bar-button-with-border');
            if (firstFound)this.els.buttonArray[i].addClass('ludo-title-bar-button-with-border');
            firstFound = true;
        }
    },

    enterButton:function (e) {
        var el = e.target;
        var type = el.getProperty('buttonType');
        ludo.dom.addClass(el, 'ludo-title-bar-button-' + type + '-over');
    },

    leaveButton:function (e) {
        var el = e.target;
        el.removeClass('ludo-title-bar-button-' + el.getProperty('buttonType') + '-over');
    },

    buttonClick:function (e) {
        var event = e.target.getProperty('buttonType');
        this.leaveButton(e);
        this.addBorderToButtons();
        this.resizeButtonContainer();
        this.fireEvent(event);
    },

    getWidthOfButtons:function () {
        var ret = 0;
        var els = this.els.buttonArray;
        for (var i = 0, count = els.length; i < count; i++) {
            if (els[i].style.display == 'none')continue;
            var width = ludo.dom.getNumericStyle(els[i], 'width') + ludo.dom.getBW(els[i]) + ludo.dom.getPW(els[i]) + ludo.dom.getMW(els[i]);
            if (!isNaN(width) && width) {
                ret += width;
            } else {
                ret += els[i].offsetWidth;
            }
        }
        return ret ? ret : els.length * 10;
    },

    getEl:function () {
        return this.els.el;
    },

    setSizeOfButtonContainer:function () {
        if (this.els.controls) {
            var width = this.getWidthOfButtons();
            this.els.controls.style.width = width + 'px';
            this.els.controls.style.display = width > 0 ? '' : 'none';
        }
        if (this.icon) {
            this.els.title.setStyle('left', document.id(this.els.icon).getStyle('width'));
        }
    },

    hide:function () {
        this.els.el.style.display = 'none';
    },

    getWidthOfIconAndButtons:function () {
		var ret = this.view.icon ? this.els.icon.offsetWidth : 0;
        return ret + this.els.controls.offsetWidth;
    },

    resizeDOM:function () {
        this.els.title.style.width = (this.view.width - this.getWidthOfIconAndButtons()) + 'px';
    },

    height:undefined,
    getHeight:function () {
        if (this.height === undefined) {
            var el = this.els.el;
            this.height = parseInt(el.getStyle('height').replace('px', ''));
            this.height += ludo.dom.getMH(el) + ludo.dom.getBH(el) + ludo.dom.getPH(el);
        }
        return this.height;
    },

    getCollapseButtonDirection:function () {
        var c = this.view;
		if(ludo.util.isString(this.view.layout.collapsible)){
			return this.view.layout.collapsible;
		}
		var parent = c.getParent();
        if (parent && parent.layout && parent.layout.type === 'linear' && parent.layout.orientation === 'horizontal') {
            return parent.getIndexOf(this) === 0 ? 'left' : 'right';
        } else {
            return parent.getIndexOf(this) === 0 ? 'top' : 'bottom';
        }
    }
});
/**
 * Rich Component
 * @class FramedView
 * @extends View
 */
ludo.FramedView = new Class({
	Extends:ludo.View,
	type:'FramedView',
	layout:{
		type:'fill',
		minWidth:100,
		minHeight:100
	},
	minimized:false,

	/**
	 * Title of component. A title is only useful for FramedView's or when the component is collapsible.
	 * @attribute {String} title
	 */
	title:'',


	movable:false,
	/**
	 * Is component minimizable. When set to true, a minimize button will appear on the title bar of the component
	 * @attribute minimizable
	 * @type {Boolean}
	 */
	minimizable:true,

	resizable:false,
	fullScreen:false,
	/**
	 * Is component closable. When set to true, a close button will appear on the title bar of the component
	 * @attribute closable
	 * @type {Boolean}
	 * @default false
	 */
	closable:false,
	/**
	 * Is component collapsible. When set to true, a collapse button will appear on the title bar of the component
	 * @attribute collapsible
	 * @type {Boolean}
	 * @default false
	 */
	collapsible:false,

	width:null,
	height:200,

	preserveAspectRatio:false,
	/**
	 * Path to icon to be placed on the title bar
	 * @attribute icon
	 */
	icon:null,
	/**
	 * Initial display of status bar
	 * @attribute {Boolean} statusBar
	 * @default false
	 */
	statusBar:false,
	/**
	 * Initial text of status bar
	 * @attribute statusText
	 * @type String
	 * @default '' (empty string)
	 */
	statusText:'',
	/**
	 * Path to icon on status bar
	 * @attribute statusIcon
	 * @type String
	 * @default undefined
	 */
	statusIcon:undefined,

	/**
	 * Show or hide title bar
	 * @attribute titleBar
	 * @type {Boolean}
	 * @default true
	 */
	titleBar:true,
	/**
	 * Bold title bar. True to give the component a window type title bar, false to give it a smaller title bar
	 * @attribute boldTitle
	 * @type {Boolean}
	 * @default true
	 */
	boldTitle:true,
	hasMenu:false,

	buttons:[],
	/**
	 Button bar object. Components to be placed on the button bar.
	 @attribute buttonBar
	 @type Object
	 @example
	 	buttonBar : {
			align : 'left',
			children : [{ type: form.Button, value: 'Send' }]
		}
	 */
	buttonBar:undefined,
	/**
	 Initially collapse component
	 @attribute collapsed
	 @type {Boolean}
	 @default false
	 */
	collapsed:false,
	menuConfig:null,
	menuObj:null,

	column:null,

	state:{
		isMinimized:false,
		isCollapsed:false,
		isFullScreen:false
	},

	ludoConfig:function (config) {
		this.parent(config);
		this.hasMenu = config.hasMenu || this.hasMenu;
		if (config.menuConfig !== undefined)this.menuConfig = config.menuConfig;
		if (config.icon !== undefined) this.icon = config.icon;
		if (config.statusIcon !== undefined)this.statusIcon = config.statusIcon;
		if (config.statusText !== undefined)this.statusText = config.statusText;
		if (config.statusBar !== undefined)this.statusBar = config.statusBar;
		if (config.titleBar !== undefined)this.titleBar = config.titleBar;
		if (config.collapsible !== undefined)this.collapsible = config.collapsible;

		if (config.menuConfig !== undefined)this.menuConfig = config.menuConfig;
		if (config.buttons !== undefined) {
			config.buttonBar = {
				children:config.buttons
			}
		}
		if (config.buttonBar !== undefined) this.buttonBar = config.buttonBar;
		if (this.buttonBar !== undefined && !this.buttonBar.children) {
			this.buttonBar = { children:this.buttonBar };
		}
		if (config.collapsed !== undefined)this.collapsed = config.collapsed;
		if (config.boldTitle !== undefined)this.boldTitle = config.boldTitle;
		if (config.minimized !== undefined) this.minimized = config.minimized;
	},

	ludoDOM:function () {
		this.parent();
		var el = this.els.container;
		ludo.dom.addClass(el, 'ludo-rich-view');

		if (this.titleBar)this.getTitleBarEl().inject(this.getBody(), 'before');

		var body = this.getBody();
		ludo.dom.addClass(body, 'ludo-rich-view-body');

		if (this.buttonBar) {
			this.getButtonBar()
		} else {
			ludo.dom.addClass(el, 'ludo-component-no-buttonbar')
		}
		if (this.statusBar)el.adopt(this.getStatusBar());

		var parent = this.getParent();
		if (!parent && this.isResizable()) {
			this.getResizer().addHandle('s');
		}
	},


	ludoRendered:function () {
		this.parent();
		if (this.minimized) {
			this.minimize();
		}
	},

	resizer:undefined,
	getResizer:function () {
		if (this.resizer === undefined) {
			var r = this.getLayoutManager().getRenderer();
			this.resizer = new ludo.effect.Resize({
				component:this,
				preserveAspectRatio:this.layout.preserveAspectRatio,
				minWidth:r.getMinWidth(),
				minHeight:r.getMinHeight(),
				maxHeight:r.getMaxHeight(),
				maxWidth:r.getMaxWidth(),
				listeners:{

					stop:r.setSize.bind(r)
				}
			});
			this.resizer.addEvent('stop', this.saveState.bind(this));
		}
		return this.resizer;
	},
	/**
	 * Set status bar text
	 * @method setStatusText
	 * @param text
	 * @return void
	 */
	setStatusText:function (text) {
		this.getStatusBar().setText(text);
	},
	/**
	 * Clear status bar text
	 * @method clearStatusText
	 * @return void
	 */
	clearStatusText:function () {
		this.getStatusBar().setText('');
	},
	/**
	 * Set new title
	 * @method setTitle
	 * @param {String} title
	 */
	setTitle:function (title) {
		this.parent(title);
		if(this.titleBarObj)this.titleBarObj.setTitle(title);
	},

	autoSize:function () {
		this.resize({ width:this.els.container.getSize().x  });
	},

	isParentCollapsed:function () {
		var parent = this.getParent();
		return (parent && parent.state.isCollapsed);
	},

	resizeDOM:function () {
		if (this.isParentCollapsed()) {
			return;
		}
		if (this.state.isCollapsed) {
			this.collapsedObj.resize();
			return;
		}
		if (!this.autoHeight) {
			var height = this.getHeight();
			height -= ludo.dom.getMBPH(this.els.container);
			height -= ludo.dom.getMBPH(this.els.body);
			height -= this.getTotalHeightOfTitleAndStatusBar();
			if (height < 0) {
				return;
			}
			this.els.body.style.height = height + 'px';
			this.cachedInnerHeight = height;
		}

		if (this.buttonBarComponent) {
			this.buttonBarComponent.resize();
		}
		if (this.titleBarObj && this.width && this.width > 30) {
			this.titleBarObj.resizeDOM();
		}
	},

	totalHeightOfTitleAndStatusBar:undefined,
	getTotalHeightOfTitleAndStatusBar:function () {
		if (this.isHidden())return 0;
		if (!this.totalHeightOfTitleAndStatusBar) {
			this.totalHeightOfTitleAndStatusBar = this.getHeightOfTitleBar() + this.getHeightOfStatusBar() + this.getHeightOfButtonBar();
		}

		return this.totalHeightOfTitleAndStatusBar;
	},

	heightOfTabContainer:undefined,
	getHeightOfTabContainer:function () {
		if (this.heightOfTabContainer === undefined) {
			this.heightOfTabContainer = this.els.tabContainer.offsetHeight;
		}
		return this.heightOfTabContainer;
	},

	heightOfButtonBar:undefined,
	getHeightOfButtonBar:function () {
		if (!this.buttonBar)return 0;
		if (this.heightOfButtonBar === undefined) {
			this.heightOfButtonBar = this.els.buttonBar.el.offsetHeight + ludo.dom.getMH(this.els.buttonBar.el);
		}
		return this.heightOfButtonBar;
	},

	getHeightOfTitleBar:function () {
		if (!this.titleBar)return 0;
		return this.titleBarObj.getHeight();
	},

	getHeightOfStatusBar:function () {
		if (!this.statusBarObj)return 0;
		return this.statusBarObj.getHeight();
	},

	getTitleBar:function(){
		if (this.titleBarObj === undefined) {
			this.titleBarObj = ludo._new({
				type:'view.TitleBar',
				view:this,
				listeners:{
					close:this.close.bind(this),
					minimize:this.minimize.bind(this),
					maximize:this.maximize.bind(this),
					collapse:this.hide.bind(this)
				}
			});

			if (this.isMovable() && !this.getParent()) {
				this.drag = new ludo.effect.Drag({
					handle:this.titleBarObj.getEl(),
					el:this.getEl(),
					listeners:{
						start:this.increaseZIndex.bind(this),
						end:this.stopMove.bind(this)
					}
				});
				this.titleBarObj.getEl().style.cursor = 'move';
			}
		}
		return this.titleBarObj;
	},

	getTitleBarEl:function () {
		return this.getTitleBar().getEl();
	},

	getElForCollapsedState:function () {
		if (this.collapsedObj === undefined) {
			this.collapsedObj = new ludo.view.Collapsed({
				component:this,
				listeners:{
					expand:this.expand.bind(this)
				}
			});
		}
		return this.collapsedObj.getEl();
	},

	isCollapsed:function () {
		return this.state.isCollapsed;
	},

	getWidth:function () {
		if (this.isCollapsed()) {
			return this.collapsedObj.getSize();
		} else {
			return this.parent();
		}
	},

	getHeight:function () {
		if (this.isMinimized()) {
			return this.getHeightOfTitleBar();
		}
		else if (this.isCollapsed()) {
			return this.collapsedObj.getSize();
		} else {
			return this.parent();
		}
	},
	/**
	 * Collapse component
	 * @method collapse
	 * @return void
	 */
	collapse:function () {
		this.state.isCollapsed = true;
		this.getEl().style.display = 'none';
		this.collapsedObj.show();
		/**
		 * Fired when a component is collapsed
		 * @event collapse
		 * @param Component this
		 */
		this.fireEvent('collapse', [this, this.collapsedObj.getSizeConfig()]);
	},
	/**
	 * Expand collapsed component
	 * @method expand
	 * @return void
	 */
	expand:function () {
		this.state.isCollapsed = false;
		this.getEl().style.display = '';
		this.collapsedObj.hide();
		this.getParent().resizeChildren();
		/**
		 * Fired when a collapsed component is expanded.
		 * @event expand
		 * @param {Object} this component
		 */
		this.fireEvent('expand', this);
	},

	close:function () {
		this.hide();
		this.fireEvent('close', this);
	},

	isMinimized:function () {
		return this.state.isMinimized;
	},

	/**
	 * Maximize component
	 * @method maximize
	 * @return void
	 */
	maximize:function () {
		this.state.isMinimized = false;
		if (this.hidden) {
			return;
		}
		if (this.autoHeight) {
			this.getEl().style.height = 'auto';
		} else {
			this.resize({
				height:this.height
			});
		}
		this.els.body.style.visibility = 'visible';
		this.showResizeHandles();
		/**
		 * Fired when a component is maximized
		 * @event maximize
		 * @param component this
		 */
		this.fireEvent('maximize', this);
	},

	showResizeHandles:function () {
		if (this.isResizable()) {
			this.getResizer().showAllHandles();
		}
	},

	hideResizeHandles:function () {
		if (this.isResizable()) {
			this.getResizer().hideAllHandles();
		}
	},

	/**
	 * Minimize component
	 * @method minimize
	 * @return void
	 */
	minimize:function () {
		this.state.isMinimized = true;
		if (this.hidden) {
			return;
		}
		var height = this.height;
		var newHeight = this.getHeightOfTitleBar();
		this.els.container.setStyle('height', this.getHeightOfTitleBar());
		this.els.body.style.visibility = 'hidden';
		this.hideResizeHandles();

		this.height = height;
		/**
		 * @event minimize
		 * @param Component this
		 */
		this.fireEvent('minimize', [this, { height: newHeight }]);
	},

	getHtml:function () {
		return this.els.body.get('html');
	},

	getButtonBar:function () {
		if (!this.els.buttonBar) {
			this.els.buttonBar = this.els.buttonBar || {};
			var el = this.els.buttonBar.el = document.createElement('div');
			this.els.container.appendChild(el);
			el.className = 'ludo-component-buttonbar';
			ludo.dom.addClass(this.getEl(), 'ludo-component-with-buttonbar');
			this.buttonBar.renderTo = el;
			this.buttonBar.component = this;
			this.buttonBarComponent = new ludo.view.ButtonBar(this.buttonBar);
		}
		return this.els.buttonBar.el;
	},

	getButton:function (key) {
		return this.getButtonByKey(key);
	},
	/**
	 * Hide a button on the button bar
	 * @method hideButton
	 * @param id of button
	 * @return {Boolean} success
	 */
	hideButton:function (id) {
		var button = this.getButtonByKey(id);
		if (button) {
			button.hide();
			return true;
		}
		return false;
	},
	/**
	 * Show a button on the button bar
	 * @method showButton
	 * @param id of button
	 * @return {Boolean} success
	 */
	showButton:function (id) {
		var button = this.getButtonByKey(id);
		if (button) {
			button.show();
			return true;
		}
		return false;
	},

	getButtons:function () {
		if (this.buttonBarComponent) {
			return this.buttonBarComponent.getButtons();
		}
		return [];
	},
	/**
	 * Disable a button on the button bar
	 * @method disableButton
	 * @param id
	 * @return {Boolean} success
	 */
	disableButton:function (id) {
		var button = this.getButtonByKey(id);
		if (button) {
			button.disable();
			return true;
		}
		return false;
	},
	/**
	 * Enable a button on the button bar
	 * @method enableButton
	 * @param id
	 * @return {Boolean} success
	 */
	enableButton:function (id) {
		var button = this.getButtonByKey(id);
		if (button) {
			button.enable();
			return true;
		}
		return false;
	},

	getButtonByKey:function (key) {
		if (this.buttonBarComponent) {
			return this.buttonBarComponent.getButton(key);
		}
		for (var i = 0; i < this.buttons.length; i++) {
			if (this.buttons[i].getId() === key || this.buttons[i].getValue() == key || this.buttons[i].getName() == key) {
				return this.buttons[i];
			}
		}
		return null;
	},

	getStatusBar:function () {
		if (this.statusBarObj == undefined) {
			this.statusBarObj = ludo._new({
				type:'view.StatusBar',
				text:this.statusText,
				icon:this.statusIcon
			})
		}
		return this.statusBarObj.getEl();
	},
	/**
	 * Is component resizable
	 * @method isResizable
	 * @return {Boolean}
	 */
	isResizable:function () {
		return this.resizable;
	},
	stopMove:function (el, drag) {
		this.getLayoutManager().getRenderer().setPosition(drag.getX(), drag.getY());
		/*
		this.setPosition({
			left:drag.getX(),
			top:drag.getY()
		});
		*/
		/**
		 * Event fired after moving Component
		 * @event stopmove
		 * @param {Object} Component
		 */
		this.fireEvent('stopmove', this);
	}
});
/**
 * A component rendered to document.body and filling up entire screen
 * @class Application
 * @extends FramedView
 */
ludo.Application = new Class({
    Extends:ludo.View,
    type:'Application',
	layout:{
		width:'matchParent',
		height:'matchParent'
	},

    ludoConfig:function (config) {
        config.renderTo = document.body;
        this.parent(config);
		this.setBorderStyles();
    },

    ludoRendered:function () {
        this.parent();
        this.getEl().addClass('ludo-application');
        this.getBody().addClass('ludo-application-content');
    },

    setBorderStyles:function () {
        var styles = {
            width:'100%',
            height:'100%',
            overflow:'hidden',
            margin:0,
            padding:0,
            border:0
        };
        document.body.setStyles(styles);
        document.id(document.documentElement).setStyles(styles);
    }
});
/**
@class Window
@extends FramedView
@description Class for floating window
@constructor
@param {Object} config
@example
	new ludo.Window({
	   width:500,height:500,
	   left:100,top:100,
	   layout:'cols',
	   children:[{
		   	layout:{
		   		weight:1
			},
		   html : 'Panel 1'
	   },{
		   	layout:{
		   		weight:1
			},
		   	html: 'Panel 2'
	   }]
	});
 */
ludo.Window = new Class({
    Extends:ludo.FramedView,
    type:'Window',
    cssSignature:'ludo-window',

	/**
	 * True to make the window movable
	 * @attribute movable
	 * @type {Boolean}
	 * @default true
	 */
	movable:true,
	resizable:true,
	closable:true,

    /**
     * Top position of window
     * @attribute {Number} top
     * @default undefined
     */
    top:undefined,
    /**
     * Left position of window
     * @attribute {Number} left
     * @default undefined
     */
    left:undefined,
    /**
     * Width of window
     * @attribute {Number} width
     * @default 300
     */
    width:300,
    /**
     * Height of window
     * @attribute {Number} height
     * @default 200
     */
    height:200,
    /**
     * When set to true, resize handle will be added
     * to the top ludo of the window. This can be useful to turn off when you're extending the ludo.Window component
     * to create custom components where top position should be fixed.
     * @attribute {Boolean} resizeTop
     * @default true
     */
    resizeTop:true,
    /**
     * When set to true, resize handle will be added
     * to the left ludo of the window. This can be useful to turn off when you're extending the ludo.Window component
     * to create custom components where left position should be fixed.
     * @attribute {Boolean} resizeLeft
     * @default true
     */
    resizeLeft:true,

    /**
     * Hide content of window while moving/dragging the window
     * @attribute {Boolean} hideBodyOnMove
     * @default false
     */
    hideBodyOnMove:false,

    /**
     * Preserve aspect ratio when resizing
     * @attribute {Boolean} preserveAspectRatio
     * @default false
     */
    preserveAspectRatio:false,

	statefulProperties:['layout'],

    ludoConfig:function (config) {
		config = config || {};
		config.left = config.left || config.x;
		config.top = config.top || config.y;

		config.renderTo = document.body;
		if (config.left !== undefined)this.layout.left = config.left;
		if (config.top !== undefined) this.layout.top = config.top;

		this.parent(config);

        if (config.resizeTop !== undefined)this.resizeTop = config.resizeTop;
        if (config.resizeLeft !== undefined)this.resizeLeft = config.resizeLeft;
        if (config.hideBodyOnMove !== undefined)this.hideBodyOnMove = config.hideBodyOnMove;
        if (config.preserveAspectRatio !== undefined)this.preserveAspectRatio = config.preserveAspectRatio;

    },

    ludoEvents:function () {
        this.parent();
        if (this.hideBodyOnMove) {
            this.addEvent('startmove', this.hideBody.bind(this));
            this.addEvent('stopmove', this.showBody.bind(this));
        }
		this.addEvent('stopmove', this.saveState.bind(this));
    },

    hideBody:function () {
        this.getBody().style.display = 'none';
        this.els.buttonBar.el.style.display = 'none';
    },

    showBody:function () {
        this.getBody().style.display = '';
        this.els.buttonBar.el.style.display = '';
    },

    ludoRendered:function () {
        this.parent();
        ludo.dom.addClass(this.getEl(), 'ludo-window');
        this.focusFirstFormField();
        this.fireEvent('activate', this);
    },

    ludoDOM:function () {
        this.parent();
        if (this.isResizable()) {
            var r = this.getResizer();
            if (this.resizeTop) {
                if (this.resizeLeft) {
                    r.addHandle('nw');
                }
                r.addHandle('n');
                r.addHandle('ne');
            }

            if (this.resizeLeft) {
                r.addHandle('w');
                r.addHandle('sw');
            }
            r.addHandle('e');
            r.addHandle('se');
        }
    },

    show:function () {
		this.parent();
        this.focusFirstFormField();
    },

    focusFirstFormField:function () {
        var els = this.getBody().getElements('input');
        for (var i = 0, count = els.length; i < count; i++) {
            if (els[i].type && els[i].type.toLowerCase() === 'text') {
                els[i].focus();
                return;
            }
        }
        var el = this.getBody().getElement('textarea');
        if (el) {
            el.focus();
        }
    },

    isUsingShimForResize:function () {
        return true;
    },
    /**
     * Show window at x and y position
     * @method showAt
     * @param {Number} x
     * @param {Number} y
     * @return void
     */
    showAt:function (x, y) {
        this.setPosition({
            left:x,
            top:y
        });
        this.show();
    },

    /**
     * Show window centered on screen
     * @method showCentered
     * @return void
     */
    showCentered:function () {
        var bodySize = document.body.getSize();
        var x = Math.round((bodySize.x / 2) - (this.getWidth() / 2));
        var y = Math.round((bodySize.y / 2) - (this.getHeight() / 2));
        this.showAt(x, y);
    },

    /**
     * Equivalent to method show
     * @method open
     * @return void
     */
    open:function () {
        this.show();
    }

});
/**
 * @class Accordion
 * @extends FramedView
 * @description Accordion component
 */
ludo.Accordion = new Class({
	Extends:ludo.FramedView,
	type:'Accordion',

	closable:false,
	fullScreen:false,
	minimizable:true,
	resizable:false,

	heightBeforeMinimize:undefined,
	slideInProgress:false,
	fx:null,
	fxContent:null,
	minimized:false,
	titleBar:true,

	ludoConfig:function (config) {
		if (!config.height) {
			config.height = 'auto';
		}

		this.parent(config);
	},

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-accordion');
	},
	ludoRendered:function () {
		this.fx = new Fx.Morph(this.getEl(), {
			duration:100
		});
		this.fxContent = new Fx.Morph(this.getBody(), {
			duration:100
		});
		this.fx.addEvent('complete', this.animationComplete.bind(this));

		var titleBar = this.getTitleBarEl();
		titleBar.addEvent('click', this.toggleExpandCollapse.bind(this));
		this.parent();
	},
	toggleExpandCollapse:function () {
		if (this.state.isMinimized) {
			this.maximize();
		} else {
			this.minimize();
		}
	},
	/**
	 * Maximize accordion component
	 * @method maximmize
	 * @return void
	 */
	maximize:function () {
		if (this.slideInProgress)return;
		this.slideInProgress = true;
		this.state.isMinimized = false;

		this.showAllHandles();

		this.fx.start({
			'height':[this.getHeightOfTitleBar(), this.heightBeforeMinimize]
		});
		this.fxContent.start({
			'margin-top':[this.getBody().getStyle('margin-top'), 0]
		});
		this.cssMaxMinButton();
	},
	/**
	 * Minimize accordion component
	 * @method minimize
	 * @return void
	 */
	minimize:function () {
		if (this.slideInProgress)return;
		this.heightBeforeMinimize = this.getEl().getSize().y - ludo.dom.getBH(this.getEl()) - ludo.dom.getPH(this.getEl());
		this.slideInProgress = true;

		this.state.isMinimized = true;
		this.hideResizeHandles();

		this.fx.start({
			'height':[this.heightBeforeMinimize, this.getHeightOfTitleBar()]
		});

		this.fxContent.start({
			'margin-top':[ 0, (this.heightBeforeMinimize - this.getHeightOfTitleBar()) * -1 ]
		});
		this.cssMaxMinButton();

	},

	animationComplete:function () {
		this.slideInProgress = false;
	}

});
/**
 Specification of a drop point node sent to {{#crossLink "effect.DragDrop/addDropTarget"}}{{/crossLink}}.
 You may add your own properties in addition to the ones below.
 @namespace effect
 @class DropPoint
 @constructor
 @param {Object} config
 @example
 	var dd = new ludo.effect.DragDrop();
 	var el = new Element('div');
 	dd.addDropTarget({
 		id:'myDropPoint',
 		el:el,
 		name:'John Doe'
	});
 	var el = new Element('div');
	dd.addDropTarget({
		id:'myDropPoint',
		el:el,
		name:'Jane Doe'
	});
 	dd.addEvent('enterDropTarget', function(node, dd){
 		if(node.name === 'John Doe'){
 			dd.setInvalid(); // Triggers an invalidDropTarget event
 		}
 	});
 */
ludo.effect.DropPoint = new Class({
	/**
	 id of node. This attribute is optional
	 @property id
	 @type {String}
	 @default undefined
	 @optional
	 */
	id:undefined,

	/**
	 * Reference to dragable DOM node
	 * @property el
	 * @default undefined
	 * @type {String|HTMLDivElement}
	 */
	el:undefined
});
/**
 * effect.Drag with support for drop events.
 * @namespace effect
 * @class DragDrop
 * @extends effect.Drag
 */
ludo.effect.DragDrop = new Class({
	Extends:ludo.effect.Drag,
	useShim:false,
	currentDropPoint:undefined,
	onValidDropPoint:undefined,

	/**
	 Capture regions when moving over drop points
	 @config Boolean captureRegions
	 @default false
	 @example
	 	captureRegions:true
	 */
	captureRegions:false,

	/**
	 * While dragging, always show dragged element this amount of pixels below mouse cursor.
	 * @config mouseYOffset
	 * @type {Number} pixels
	 * @default undefined
	 */
	mouseYOffset:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.captureRegions !== undefined)this.captureRegions = config.captureRegions;

	},

	ludoEvents:function () {
		this.parent();
		this.addEvent('start', this.setStartProperties.bind(this));
		this.addEvent('end', this.drop.bind(this));
	},

	getDropIdByEvent:function (e) {
		var el = e.target;
		if (!el.hasClass('ludo-drop')) {
			el = el.getParent('.ludo-drop');
		}
		return el.getProperty('forId');
	},

	/**
	 * Remove node
	 * @method remove
	 * @param {String} id
	 * @return {Boolean} success
	 */
	remove:function (id) {
		if (this.els[id] !== undefined) {
			var el = document.id(this.els[id].el);
			el.removeEvent('mouseenter', this.enterDropTarget.bind(this));
			el.removeEvent('mouseleave', this.leaveDropTarget.bind(this));
			return this.parent(id);
		}
		return false;
	},

	/**
	 * Create new drop point.
	 * @method addDropTarget
	 * @param {effect.DropPoint} node
	 * @return {effect.DropPoint} node
	 */
	addDropTarget:function (node) {
		node = this.getValidNode(node);
		ludo.dom.addClass(node.el, 'ludo-drop');
		node.el.addEvent('mouseenter', this.enterDropTarget.bind(this));
		node.el.addEvent('mouseleave', this.leaveDropTarget.bind(this));

		var captureRegions = node.captureRegions !== undefined ? node.captureRegions : this.captureRegions;
		if (captureRegions) {
			node.el.addEvent('mousemove', this.captureRegion.bind(this));
		}

		node = this.els[node.id] = Object.merge(node, {
			el:node.el,
			captureRegions:captureRegions
		});

		return node;
	},

	enterDropTarget:function (e) {
		if (this.isActive()) {
			this.setCurrentDropPoint(e);
			this.onValidDropPoint = true;
			/**
			 Enter drop point event. This event is fired when dragging is active
			 and mouse enters a drop point
			 @event enterDropTarget
			 @param {effect.DraggableNode} node
			 @param {effect.DropPoint} node
			 @param {effect.DragDrop} this
			 @param {HTMLElement} target
			 */
			this.fireEvent('enterDropTarget', this.getDropEventArguments(e));

			if (this.onValidDropPoint) {
				if (this.shouldCaptureRegionsFor(this.currentDropPoint)) {
					this.setMidPoint();
				}
				/**
				 Enters valid drop point.
				 @event validDropTarget
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('validDropTarget', this.getDropEventArguments(e));
			} else {
				/**
				 Enters invalid drop point.
				 @event invalidDropTarget
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('invalidDropTarget', this.getDropEventArguments(e));
			}
			return false;
		}
		return undefined;
	},

	setCurrentDropPoint:function (e) {
		this.currentDropPoint = this.getById(this.getDropIdByEvent(e));
	},

	leaveDropTarget:function (e) {
		if (this.isActive() && this.currentDropPoint) {
			this.fireEvent('leaveDropTarget', this.getDropEventArguments(e));
			this.onValidDropPoint = false;
			this.currentDropPoint = undefined;
		}
	},

	getDropEventArguments:function (e) {
		return [this.getDragged(), this.currentDropPoint, this, e.target];
	},

	/**
	 Set drop point invalid. This method is usually used in connection with a listener
	 for the enterDropTarget event
	 @method setInvalid
	 @example
	 	dd.addEvent('enterDropTarget', function(node, dd){
			 if(node.name === 'John Doe'){
				 dd.setInvalid(); // Triggers an invalidDropTarget event
			 }
		 });
	 */
	setInvalid:function () {
		this.onValidDropPoint = false;
	},

	getCurrentDropPoint:function () {
		return this.currentDropPoint;
	},

	drop:function (e) {
		/**
		 drop event caused by mouseup on valid drop point.
		 @event drop
		 @param {effect.DraggableNode} dragged node
		 @param {effect.DropPoint} drop target
		 @param {effect.DragDrop} this
		 @param {HTMLElement} target
		 */
		if (this.onValidDropPoint)this.fireEvent('drop', this.getDropEventArguments(e));
	},

	setStartProperties:function () {
		this.onValidDropPoint = false;
	},

	shouldCaptureRegionsFor:function (node) {
		return this.els[node.id].captureRegions === true;
	},

	getDropPointCoordinates:function () {
		if (this.currentDropPoint) {
			return this.currentDropPoint.el.getCoordinates();
		}
		return undefined;
	},

	previousRegions:{
		h:undefined,
		v:undefined
	},

	captureRegion:function (e) {
		if (this.isActive() && this.onValidDropPoint && this.shouldCaptureRegionsFor(this.currentDropPoint)) {
			var midPoint = this.midPoint;
			if (e.page.y < midPoint.y && this.previousRegions.v !== 'n') {
				/**
				 Enter north region of a drop point
				 @event north
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('north', this.getDropEventArguments(e));
				this.previousRegions.v = 'n';
			} else if (e.page.y >= midPoint.y && this.previousRegions.v !== 's') {
				/**
				 Enter south region of a drop point
				 @event south
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('south', this.getDropEventArguments(e));
				this.previousRegions.v = 's';
			}
			if (e.page.x < midPoint.x && this.previousRegions.h !== 'w') {
				/**
				 Enter west region of a drop point
				 @event west
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('west', this.getDropEventArguments(e));
				this.previousRegions.h = 'w';
			} else if (e.page.x >= midPoint.x && this.previousRegions.h !== 'e') {
				/**
				 Enter east region of a drop point
				 @event east
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('east', this.getDropEventArguments(e));
				this.previousRegions.h = 'e';
			}

		}
	},

	midPoint:undefined,
	setMidPoint:function () {
		var coords = this.getDropPointCoordinates();
		this.midPoint = {
			x:coords.left + (coords.width / 2),
			y:coords.top + (coords.height / 2)
		};
		this.previousRegions = {
			h:undefined,
			v:undefined
		};
	}
});
/**
 * Class responsible for moving columns using drag and drop.
 * An instance of this class is automatically created by the grid. It is
 * rarely nescessary to create your own instances of this class
 * @namespace grid
 * @class ColumnMove
 */
ludo.grid.ColumnMove = new Class({
	Extends:ludo.effect.DragDrop,
	gridHeader:undefined,
	columnManager:undefined,

	shimCls:['ludo-grid-movable-shim'],
	insertionMarker:undefined,

	arrowHeight:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		this.gridHeader = config.gridHeader;
		this.columnManager = config.columnManager;
	},

	ludoEvents:function(){
		this.parent();
		this.addEvent('createShim', this.setZIndex.bind(this));
	},

	setZIndex:function(shim){
		shim.setStyle('z-index', 50000);
	},

	getMarker:function () {
		if (this.insertionMarker === undefined) {
			var el = this.insertionMarker = new Element('div');
			ludo.dom.addClass(el, 'ludo-grid-movable-insertion-marker');
			el.setStyle('display', 'none');
			document.body.adopt(el);
			var b = new Element('div');
			ludo.dom.addClass(b, 'ludo-grid-movable-insertion-marker-bottom');
			el.adopt(b);
		}
		return this.insertionMarker;
	},

	hideMarker:function(){
		this.getMarker().style.display='none';
	},

	showMarkerAt:function(cell, pos){
		var coordinates = cell.getCoordinates();
		this.getMarker().setStyle('display','');
		this.getMarker().setStyles({
			left : coordinates.left  + (pos=='after' ? coordinates.width : 0),
			top : coordinates.top - this.getArrowHeight(),
			height: coordinates.height
		});
	},

	setMarkerHeight:function(height){
		this.getMarker().setStyle('height', height + (this.getArrowHeight() * 2));
	},

	getArrowHeight:function(){
		if(!this.arrowHeight){
			this.arrowHeight = this.getMarker().getElement('.ludo-grid-movable-insertion-marker-bottom').getSize().y;
		}
		return this.arrowHeight;
	}
});
/**
 * Internal class used to parse search into a function
 * @namespace dataSource
 * @class SearchParser
 */
ludo.dataSource.SearchParser = new Class({

	searches:undefined,

	parsedSearch:{
		items:[]
	},
	branches:[],

	compiled:undefined,

	getSearchFn:function(searches){
		this.parse(searches);
		this.compiled = this.parsedSearch;
		this.compiled = this.compile(Object.clone(this.parsedSearch));
		return this.compiled;
	},

	clear:function(){
		this.parsedSearch = {
			items:[]
		};
		this.branches = [];
	},

	parse:function (searches) {
		this.clear();
		this.branches.push(this.parsedSearch);
		for (var i = 0; i < searches.length; i++) {
			if (this.isBranchStart(searches[i])) {
				var branch = {
					items:[]
				};
				this.appendToCurrentBranch(branch);
				this.branches.push(branch);
			}
			else if (this.isBranchEnd(searches[i])) {
				this.setOperatorIfEmpty();
				if (this.branches.length > 1)this.branches.pop();
			}
			else if (this.isOperator(searches[i])) {
				if (!this.hasOperator()) {
					this.setOperator(searches[i]);
				} else if (this.shouldCreateBranchOfPrevious(searches[i])) {
					this.createBranchOfPrevious();
					this.setOperator(searches[i]);
				} else if (this.shouldCreateNewBranch(searches[i])) {
					var newBranch = {
						operator:searches[i],
						items:[]
					};
					newBranch.items.push(this.branches[this.branches.length - 1].items.pop());
					this.appendToCurrentBranch(newBranch);
					this.branches.push(newBranch);
				}

			} else {
				this.appendToCurrentBranch(searches[i]);
			}
		}
		this.setOperatorIfEmpty();

	},

	compile:function(branch){
		var ib = this.getIndexOfInnerBranch(branch);
		var counter = 0;
		while(ib >=0 && counter < 100){
			branch.items[ib] = { fn : this.compile(branch.items[ib]) };
			counter++;
			ib = this.getIndexOfInnerBranch(branch);
		}

		if(branch.operator === '&'){
			return this.getAndFn(branch);
		}else{
			return this.getOrFn(branch);
		}
	},

	getAndFn:function(branch){
		var items = branch.items;
		return function(record){
			for(var i=0;i<items.length;i++){
				if (items[i].txt !== undefined) {
					if (record.searchIndex.indexOf(items[i].txt) === -1) {
						return false;
					}
				} else if (items[i].fn !== undefined) {
					if (!items[i].fn.call(this, record))return false;
				}
			}
			return true;
		}
	},

	getOrFn:function(branch){
		var items = branch.items;
		return function(record){
			for(var i=0;i<items.length;i++){
				if (items[i].txt !== undefined) {
					if (record.searchIndex.indexOf(items[i].txt) > -1) {
						return true;
					}
				} else if (items[i].fn !== undefined) {
					if (items[i].fn.call(this, record))return true;
				}
			}
			return false;
		}
	},

	getIndexOfInnerBranch:function(branch){
		for(var i=0;i<branch.items.length;i++){
			if(branch.items[i].operator !== undefined)return i;
		}
		return -1;
	},

	setOperatorIfEmpty:function () {
		var br = this.branches[this.branches.length - 1];
		br.operator = br.operator || '&';
	},

	isBranchStart:function (operator) {
		return operator === '(';
	},

	isBranchEnd:function (operator) {
		return operator === ')';
	},

	shouldCreateBranchOfPrevious:function (operator) {
		return operator === '|' && this.getCurrentOperator() === '&';
	},

	createBranchOfPrevious:function () {
		var br = this.branches[this.branches.length - 1];
		var newBranch = {
			operator:br.operator,
			items:br.items
		};
		br.operator = undefined;
		br.items = [newBranch];
	},

	shouldCreateNewBranch:function (operator) {
		return operator === '&' && this.isDifferentOperator(operator);
	},

	appendToCurrentBranch:function (search) {
		this.branches[this.branches.length - 1].items.push(search);
	},

	isOperator:function (token) {
		return token === '|' || token === '&';
	},

	hasOperator:function () {
		return this.branches[this.branches.length - 1].operator !== undefined;
	},

	isDifferentOperator:function (operator) {
		return operator !== this.getCurrentOperator();
	},

	getCurrentOperator:function () {
		return this.branches[this.branches.length - 1].operator;
	},

	setOperator:function (operator) {
		this.branches[this.branches.length - 1].operator = operator;
	},

	log:function (what) {
		if (typeof what == 'object')what = JSON.encode(what);
		console.log(what);
	}
});
/**
 Class created dynamically by dataSource.Collection.
 It is used to search and filter data in a collection.
 @namespace dataSource
 @class CollectionSearch
 @extends Core
 */
ludo.dataSource.CollectionSearch = new Class({
	Extends:ludo.Core,
	dataSource:undefined,
	searchResult:undefined,
	searchIndexCreated:false,
	/**
	 Delay in seconds between call to search and execution of search.
	 A delay is useful when using text fields to search.
	 @config delay
	 @type {Number}
	 @default 0
	 @example
	 	delay:0
	 */
	delay:0,
	searches:undefined,
	searchBranches:undefined,
	searchFn:undefined,
	currentBranch:undefined,
	/**
	 Columns in datasource to index for search
	 @config index
	 @type Array
	 */
	index:undefined,

	searchParser:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		this.dataSource = config.dataSource;
		if (config.index !== undefined)this.index = config.index;
		if (config.delay !== undefined)this.delay = config.delay;
		this.searchParser = new ludo.dataSource.SearchParser();
		this.clear();
	},

	ludoEvents:function () {
		this.parent();
		this.dataSource.addEvent('update', this.clearSearchIndex.bind(this));
	},
	/**
	 * execute a text search
	 * @method Search
	 * @param {String} search
	 */
	search:function (search) {
		if (!search && this.searches.length == 0)return;
		this.clear();
		this.where(search);
		this.endBranch();
		var delay = this.getSearchDelay();
		if (delay === 0) {
			this.executeSearch(this.searches[0].txt);
		} else {
			this.executeSearch.delay(delay * 1000, this, this.searches[0].txt);
		}
	},

	executeSearch:function (searchTerm) {
		if (searchTerm == this.searches[0].txt) {
			this.execute();
		}
	},

	/**
	 Clear all search terms and search functions
	 @method clear
	 @chainable
	 @return {dataSource.CollectionSearch} this
	 */
	clear:function () {
		this.searches = [];
		return this;
	},

	/**
	 * Delete search terms/functions and dispose search result. This method will fire a deleteSearch event which
	 * {{#crossLink "dataSource.Collection"}}{{/crossLink}} listens to. It will trigger an update of
	 * views using the {{#crossLink "dataSource.Collection"}}{{/crossLink}} object as dataSource.
	 * @method deleteSearch
	 */
	deleteSearch:function () {
		/**
		 * Search executed without any search terms
		 * @event deleteSearch
		 */
		this.fireEvent('deleteSearch');
		this.searchResult = undefined;
		this.clear();
	},
	/**
	 Start building a new search
	 @method where
	 @param {String|Function} search
	 @return {dataSource.CollectionSearch} this
	 @chainable
	 @example
		 var searcher = ludo.get('idOfDataSearch').getSearcher();
		 searcher.where('Portugal').or('Norway').execute();
	 will find all records where the search index matches 'Portugal' or 'Norway' (case insensitive).
	 By default, the entire record is indexed. Custom indexes can be created by defining
	 index using the "index" constructor attribute.
	 @example
	 	searcher.where(function(record){
	 		return parseInt(record.price) < 100
	 	});
	 is example of a function search. On {{#crossLink "dataSource.Collection/execute"}}{{/crossLink}} this
	 function will be called for each record. It should return true if match is found, false otherwise.
	 The function above will return true for all records where the value of record.price is less than 100.
	 */
	where:function (search) {
		this.clear();
		this.appendSearch(Array.from(arguments));
		return this;
	},

	/**
	 OR search
	 @method or
	 @param {String|Function} search
	 @return {dataSource.CollectionSearch} this
	 @chainable
	 @example
		 var searcher = myDataSource.getSearcher();
		 var populationFn = function(record){
					return record.population > 1000000 ? true: false;
				}
		 searcher.where('Europe').or(populationFn).execute();

	 Finds all records where 'Europe' is in the text or population is greater than 1
	 million.
	 */
	or:function (search) {
		this.appendOperator('|');
		this.appendSearch(Array.from(arguments));
		return this;
	},

	appendSearch:function (args) {
		this.preCondition(args);
		var search = this.getActualArgument(args);

		if (typeof search === 'function') {
			searchObject = { fn:search };
		} else {
			searchObject = { txt:search.toLowerCase() };
		}
		this.searches.push(searchObject);
		this.postCondition(args);
	},

	/**
	 AND search
	 @method and
	 @param {String|Function} search
	 @return {dataSource.CollectionSearch} this
	 @chainable
	 @example
		 var searcher = myDataSource.getSearcher();
		 var populationFn = function(record){
					return record.population > 1000000 ? true: false;
				}
		 searcher.where('Europe').and(populationFn).execute();
	 Finds all records where 'Europe' is in the text and population is greater than 1
	 million.
	 */
	and:function (search) {
		this.appendOperator('&');
		this.appendSearch(Array.from(arguments));
		return this;
	},

	preCondition:function (args) {
		if (args.length == 2 && args[0] === '(') {
			this.branch();
		}
	},

	postCondition:function (args) {
		if (args.length == 2 && args[1] === ')') {
			this.endBranch();
		}
	},

	getActualArgument:function (args) {
		if (args.length === 2) {
			if (args[0] == ')' || args[0] == '(') {
				return args[1];
			}
			return args[0];
		}
		return args[0];
	},


	/**
	 * Search for match in one of the items
	 * @method withIn
	 * @param {Array} searches
	 * @chainable
	 * @return {dataSource.CollectionSearch} this
	 */
	withIn:function (searches) {
		for (var i = 0; i < searches.length; i++) {
			this.or(searches[i]);
		}
		return this;
	},

	/**
	 * Start grouping search items together
	 * @method branch
	 * @chainable
	 * @return {dataSource.CollectionSearch} this
	 */
	branch:function () {
		this.appendOperator('(');
		return this;
	},
	/**
	 * Close group of search items.
	 * @method branch
	 * @chainable
	 * @return {endBranch.CollectionSearch} this
	 */
	endBranch:function () {
		this.appendOperator(')');
		return this;
	},

	appendOperator:function (operator) {
		if (operator != '(' && this.searches.length == 0)return;
		if (operator === '|' && this.searches.getLast() === '(')return;
		this.searches.push(operator);
	},
	/**
	 Execute a search based on current search terms
	 @method execute
	 @chainable
	 @return {dataSource.CollectionSearch} this
	 @example
		 // Assumes that ludo.get('collection') returns a {{#crossLink "dataSource.Collection"}}{{/crossLink}} object
		 var searcher = ludo.get('collection').getSearcher();
		 searcher.clear();
		 searcher.where('Oslo').or('Moscow');
		 searcher.execute();
	 */
	execute:function () {
		if (!this.searchIndexCreated) {
			this.createSearchIndex();
		}
		if (!this.hasSearchTokens()) {
			this.deleteSearch();
		} else {
			this.searchResult = [];
			this.compileSearch();
			var data = this.getDataFromSource();
			for (var i = 0; i < data.length; i++) {
				if (this.isMatchingSearch(data[i])) {
					this.searchResult.push(data[i]);
				}
			}
		}
		/**
		 * Search executed
		 * @event search
		 */
		this.fireEvent('search');
		return this;
	},

	isMatchingSearch:function (record) {
		return this.searchFn.call(this, record);
	},

	compileSearch:function () {
		this.searchFn = this.searchParser.getSearchFn(this.searches);
	},

	/**
	 * Returns true if search terms or search functions exists.
	 * @method hasSearchTokens
	 * @return {Boolean}
	 */
	hasSearchTokens:function () {
		return this.hasContentInFirstSearch() || this.searches.length > 1;
	},

	hasContentInFirstSearch:function () {
		if (this.searches.length === 0)return false;
		var s = this.searches[0];
		return (this.isArray(s) || s.fn !== undefined || (s.txt !== undefined && s.txt.length > 0));
	},

	/**
	 * Returns true when<br>
	 *     - zero or more records are found in search result<br>
	 * Returns false when<br>
	 *  - search result is undefined because no search has been executed or search has been deleted.
	 * @method hasData
	 * @return {Boolean}
	 */
	hasData:function () {
		return this.searchResult !== undefined;
	},

	getData:function () {
		return this.searchResult;
	},

	getDataFromSource:function () {
		return this.dataSource.data;
	},

	getSearchDelay:function () {
		return this.delay || 0;
	},

	clearSearchIndex:function () {
		this.searchIndexCreated = false;
	},

	createSearchIndex:function () {
		var keys = this.getSearchIndexKeys();
		var index;
		var data = this.getDataFromSource();
		for (var i = 0; i < data.length; i++) {
			index = [];
			for (var j = 0; j < keys.length; j++) {
				if (data[i][keys[j]]) {
					index.push((data[i][keys[j]] + '').toLowerCase());
				}
			}
			data[i].searchIndex = index.join(' ');
		}
		this.searchIndexCreated = true;
	},

	getSearchIndexKeys:function () {
		if (this.index !== undefined) {
			return this.index;
		}
		var data = this.getDataFromSource();
		if (data.length > 0) {
			var record = Object.clone(data[0]);
			var ret = [];
			for (var key in record) {
				if (record.hasOwnProperty(key)) {
					ret.push(key);
				}
			}
			return ret;
		}
		return ['NA'];
	},

	/**
	 * Returns number of records in search result
	 * @method getCount
	 * @return {Number}
	 */
	getCount:function () {
		return this.searchResult ? this.searchResult.length : 0;
	},

	searchToString:function () {
		return this.hasData() ? this.searchTokens[0] : '';
	}
});
/**
 * Class representing a record in {{#crossLink "dataSource.Collection"}}{{/crossLink}}
 * Instances of this class are created from {{#crossLink "dataSource.Collection/getRecord"}}{{/crossLink}}
 * When you update a record
 * @namespace dataSource
 * @class Record
 */
ludo.dataSource.Record = new Class({
	Extends:Events,
	record:undefined,
	collection:undefined,

	initialize:function (record, collection) {
		this.record = record;
		this.collection = collection;
	},

	/**
	 * Update property of record
	 * @method set
	 * @param {String} key
	 * @param {String|Number|Object} value
	 * @return {dataSource.Record}
	 */
	set:function (key, value) {
		this.fireEvent('beforeUpdate', this.record);
		this.record[key] = value;
		this.fireEvent('update', this.record);
		return this;
	},

	/**
	 Return value of key
	 @method get
	 @param {String} key
	 @return {String|Number|Object} value
	 */
	get:function (key) {
		return this.record[key];
	},
	/**
	 Update multiple properties
	 @method setProperties
	 @param {Object} properties
	 @return {dataSource.Record|undefined}
	 @example
	 var collection = new ludo.dataSource.Collection({
	 		idField:'id'
		});
	 collection.getRecord(100).setProperties({ country:'Norway', capital:'Oslo' });
	 will set country to "Norway" and capital to "Oslo" for record where "id" is equal to 100. If you're not sure
	 that the record exists, you should use code like this:
	 @example
	 var rec = collection.getRecord(100);
	 if(rec)rec.setProperties({ country:'Norway', capital:'Oslo' });

	 */
	setProperties:function (properties) {
		this.fireEvent('beforeUpdate', this.record);
		for (var key in properties) {
			if (properties.hasOwnProperty(key)) {
				this.record[key] = properties[key];
			}
		}
		this.fireEvent('update', [this.record,undefined, 'update']);
		return this;
	},

	addChild:function (record) {
		record = this.getPlainRecord(record);
		this.record.children = this.record.children || [];
		this.record.children.push(record);
		if (record.parentUid) {
			var parent = this.collection.getRecord(record.parentUid);
			if (parent)parent.removeChild(record);
		}
		this.fireEvent('addChild', [record, this.record, 'addChild']);
		return this;
	},

	getParent:function () {
		return this.collection.getRecord(this.record.parentUid);
	},

	isRecordObject:function (rec) {
		return rec.initialize !== undefined && rec.record !== undefined;
	},

	getChildren:function () {
		return this.record.children;
	},

	removeChild:function (record) {
		record = this.getPlainRecord(record);
		var index = this.record.children.indexOf(record);
		if (index >= 0) {
			this.record.children.splice(index, 1);
			this.fireEvent('removeChild', [record, this.record, 'removeChild']);
		}
	},

	getPlainRecord:function (record) {
		return this.isRecordObject(record) ? record.record : record;
	},

	insertBefore:function (record, before) {
		if (this.inject(record, before)) {
			this.fireEvent('insertBefore', [record, before, 'insertBefore']);
		}
	},

	insertAfter:function (record, after) {
		if (this.inject(record, after, 1)) {
			this.fireEvent('insertAfter', [record, after, 'insertAfter']);
		}
	},

	inject:function (record, sibling, offset) {
		offset = offset || 0;
		record = this.getPlainRecord(record);
		sibling = this.getPlainRecord(sibling);
		if (record === sibling)return false;
		if (record.parentUid) {
			var parent = this.collection.getRecord(record.parentUid);
			if (parent){
				if(this.isMyChild(record)){
					this.record.children.splice(this.getChildIndex(record), 1);
				}else{
					parent.removeChild(record);
				}
			}
		}
		var index = this.record.children.indexOf(sibling);
		if (index !== -1) {
			this.record.children.splice(index + offset, 0, record);
			return true;
		}
		return false;
	},

	getChildIndex:function (record) {
		return this.record.children ? this.record.children.indexOf(this.getPlainRecord(record)) : -1;
	},

	isMyChild:function (record) {
		return this.record.children && this.record.children.indexOf(this.getPlainRecord(record)) !== -1;
	},

	getUID:function(){
		return this.record.uid;
	},

	getData:function(){
		return this.record;
	},

	dispose:function(){
		this.fireEvent('dispose', this.record);
		delete this.record;
	}
});
/**
 Data source collection
 @namespace dataSource
 @class Collection
 @extends dataSource.JSON
 @constructor
 @param {Object} config
 @example
 	dataSource:{
		url:'data-source/grid.php',
		id:'myDataSource',
		paging:{
			size:12,
			pageQuery:false,
			cache:false,
			cacheTimeout:1000
		},
		searchConfig:{
			index:['capital', 'country']
		},
		listeners:{
			select:function (record) {
				console.log(record);
			}
		}
	}
 */
ludo.dataSource.Collection = new Class({
	Extends:ludo.dataSource.JSON,
	/**
	 custom sort functions, which should return -1 if record a is smaller than
	 record b and 1 if record b is larger than record a.
	 @config {Function} sortFn
	 @default {}
	 @example
	 	sortFn:{
			'population':{
				'asc' : function(a,b){
					return parseInt(a.population) < parseInt(b.population) ? -1 : 1
				},
				'desc' : function(a,b){
					return parseInt(a.population) > parseInt(b.population) ? -1 : 1
				}
			}
	 	}
	 */
	sortFn:{},

	selectedRecords:[],

	/**
	 * Primary key for records
	 * @config {String} primaryKey
	 * @default "id"
     * @optional
	 */
	primaryKey:'id',

	/**
	 Use paging, i.e. only load a number of records from the server
	 @attribute {Object} paging
	 @example
	 	paging:{
		 	size:10, // Number of rows per page
		  	pageQuery:true, // Load only records per page from server, i.e. new request per page
		  	cache : true, // Store pages in cache, i.e no request if data for page is in cache,
		  	cacheTimeout:30 // Optional time in second before cache is considered out of date, i.e. new server request
		}

	 */
	paging:undefined,

	dataCache:{},

	sortedBy:{
		column:undefined,
		order:undefined
	},
	/**
	 Configuration object for {{#crossLink "dataSource.CollectionSearch"}}{{/crossLink}}. This is
	 the class which searchs and filters data in the collection.
	 @config searchConfig
	 @type Object
	 @example
	 	searchConfig:{
	 		index:['city','country'],
	 		delay:.5
	 	}
	 which makes the record keys/columns "city" and "country" searchable. It waits .5 seconds
	 before the search is executed. This is useful when searching large collections and you
	 want to delay the search until the user has finished entering into a search box.
	 */
	searchConfig:undefined,

	statefulProperties:['sortedBy', 'paging'],

	index:undefined,

	searcherType:'dataSource.CollectionSearch',

	uidMap:{},

	ludoConfig:function (config) {
		this.parent(config);

		if (config.searchConfig !== undefined)this.searchConfig = config.searchConfig;
		if (config.sortFn !== undefined)this.sortFn = config.sortFn;
		if (config.primaryKey !== undefined)this.primaryKey = config.primaryKey;
		if (this.primaryKey && !ludo.util.isArray(this.primaryKey))this.primaryKey = [this.primaryKey];

		if (config.paging !== undefined) {
			this.paging = config.paging;
			this.paging.offset = config.paging.offset || 0;
			this.paging.initialOffset = this.paging.offset;
			if (this.paging.initialOffset !== undefined) {
				this.fireEvent('page', (this.paging.initialOffset / this.paging.size) + 1);
			}
			if (this.isCacheEnabled()) {
				this.addEvent('load', this.populateCache.bind(this));
			}
		}

		if (config.sortedBy !== undefined)this.sortedBy = config.sortedBy;

		this.addEvent('parsedata', this.createIndex.bind(this));
	},

	/**
	 * Returns 1) If search is specified: number of records in search result, or 2) number of records in entire collection.
	 * @method getCount
	 * @return {Number} count
	 */
	getCount:function () {
		if (this.paging && this.paging.rows)return this.paging.rows;
		if (this.searcher && this.searcher.hasData())return this.searcher.getCount();
		return this.data ? this.data.length : 0;
	},

	isCacheEnabled:function () {
		return this.paging && this.paging['pageQuery'] && this.paging.cache;
	},

	/**
	 * Resort data-source
	 * @method sort
	 * @return void
	 */

	sort:function () {
		if (this.sortedBy.column && this.sortedBy.order) {
			this.sortBy(this.sortedBy.column, this.sortedBy.order);
		}
	},

	/**
	 Set sorted by column
	 @method by
	 @param {String} column
	 @return {dataSource.Collection} this
	 @example
	 	collection.by('country').ascending().sort();
	 or
	 @example
	 	collection.by('country').sort();
	 */
	by:function(column){
		this.sortedBy.column = column;
		this.sortedBy.order = this.getSortOrderFor(column);
		return this;
	},
	/**
	 Set sort order to ascending
	 @method ascending
	 @return {dataSource.Collection} this
	 @example
	 	collection.by('country').ascending().sort();
	 */
	ascending:function(){
		this.sortedBy.order = 'asc';
		return this;
	},
	/**
	 Set sort order to descending
	 @method descending
	 @return {dataSource.Collection} this
	 @example
	 	collection.by('country').descending().sort();
	 */
	descending:function(){
		this.sortedBy.order = 'desc';
		return this;
	},

	/**
	 Sort by column and order

	 The second argument(order) is optional
	 @method sortBy
	 @param {String} column
	 @param {String} order
     @optional
	 @return {dataSource.Collection} this
	 @example
	 	grid.getDataSource().sortBy('firstname', 'desc');
	 which also can be written as
	 @example
	 	grid.getDataSource().by('firstname').descending().sort();
	 */
	sortBy:function (column, order) {
		if (order === undefined) {
			order = this.getSortOrderFor(column);
		}

		this.sortedBy = {
			column:column,
			order:order
		};

		if (this.paging) {
			this.paging.offset = this.paging.initialOffset || 0;
			this.fireEvent('page', Math.round(this.paging.offset / this.paging.size) + 1);
		}

		if (this.shouldSortOnServer()) {
			this.loadOrGetFromCache();
		} else {
			var data = this._getData();
			data.sort(this.getSortFnFor(column, order));
			this.fireEvent('change');
		}
		/**
		 * Event fired when a data has been sorted,
		 * param example: { column:'country',order:'asc' }
		 * @event sort
		 * @param {Object} sortedBy
		 */
		this.fireEvent('sort', this.sortedBy);

		this.fireEvent('state');

		return this;
	},

	/**
	 * Return current sorted by column
	 * @method getSortedBy
	 * @return {String} column
	 */
	getSortedBy:function () {
		return this.sortedBy.column;
	},
	/**
	 * Return current sort order (asc|desc)
	 * @method getSortOrder
	 * @return {String} order
	 */
	getSortOrder:function () {
		return this.sortedBy.order;
	},

	shouldSortOnServer:function () {
		return this.paging && this.paging.pageQuery;
	},

	getSortFnFor:function (column, order) {
		if (this.sortFn[column] !== undefined) {
			return this.sortFn[column][order];
		}
		if (order === 'asc') {
			return function (a, b) {
				return a[column] + '_' + a[this.primaryKey] < b[column] + '_' + b[this.primaryKey] ? -1 : 1
			};
		} else {
			return function (a, b) {
				return a[column] + '_' + a[this.primaryKey] < b[column] + '_' +  b[this.primaryKey] ? 1 : -1
			};
		}
	},

	getSortOrderFor:function (column) {
		if (this.sortedBy.column === column) {
			return this.sortedBy.order === 'asc' ? 'desc' : 'asc';
		}
		return 'asc';
	},

	/**
	 * Add a record to data-source
	 * @method addRecord
	 * @param record
	 */
	addRecord:function (record) {
		this.data.push(record);
		/**
		 * Event fired when a record is added to the collection
		 * @event add
		 * @param {Object} record
		 */
		this.fireEvent('add', record);
	},

	/**
	 * Returns plain object for a record from search. To get a
	 * {{#crossLink "dataSource.Record"}}{{/crossLink}} object
	 * use {{#crossLink "dataSource.Collection/getRecord"}}{{/crossLink}}
	 *
	 * collection.find({ capital : 'Oslo' });
	 *
	 * @method findRecord
	 * @param {Object} search
	 * @return {Object} record
	 */
	findRecord:function (search) {
		if (!this.data)return undefined;
		if(search.getUID !== undefined)search = search.getUID();
		if(search.uid !== undefined)search = search.uid;
		var rec = this.getById(search);
		if(rec)return rec;
		for (var i = 0; i < this.data.length; i++) {
			if (this.isRecordMatchingSearch(this.data[i], search)) {
				return this.data[i];
			}
		}
		return undefined;
	},

	isRecordMatchingSearch:function (record, search) {
		for (var key in search) {
			if (search.hasOwnProperty(key)) {
				if (record[key] !== search[key]) {
					return false;
				}
			}
		}
		return true;
	},

	/**
	 * Find specific records, example:
	 * var records = collection.findRecords({ country:'Norway'});
	 * @method findRecords
	 * @param {Object} search
	 * @return {Array} records
	 */
	findRecords:function (search) {
		var ret = [];
		for (var i = 0; i < this.data.length; i++) {
			if (this.isRecordMatchingSearch(this.data[i], search)) {
				ret.push(this.data[i]);
			}
		}
		return ret;
	},

	/**
	 * Select a specific record
	 * @method selectRecord
	 * @param {Object} search
	 * @return {Object|undefined} record
	 */
	selectRecord:function (search) {
		var rec = this.findRecord(search);
		if (rec) {
			this._setSelectedRecord(rec);
			return rec;
		}
		return undefined;
	},


	/**
	 * Select a collection of records
	 * @method selectRecords
	 * @param {Object} search
	 * @return {Array} records
	 */
	selectRecords:function (search) {
		this.selectedRecords = this.findRecords(search);
		for (var i = 0; i < this.selectedRecords.length; i++) {
			this.fireEvent('select', this.selectedRecords[i]);
		}
		return this.selectedRecords;
	},

	/**
	 * Select a specific record by index
	 * @method selectRecordIndex
	 * @param {number} index
	 */
	selectRecordIndex:function (index) {
		var data = this._getData();
		if (data.length && index >= 0 && index < data.length) {
			var rec = data[index];
			this._setSelectedRecord(rec);
			return rec;
		}
		return undefined;
	},

	_getData:function () {
		if (this.hasSearchResult())return this.searcher.getData();
		return this.data;
	},

	getRecordByIndex:function (index) {
		if (this.data.length && index >= 0 && index < this.data.length) {
			return this.data[index];
		}
		return undefined;
	},

	/**
	 * Select previous record. If no record is currently selected, first record will be selected
	 * @method previous
	 * @return {Object} record
	 */
	previous:function () {
		var rec = this.getPreviousOf(this.getSelectedRecord());
		if (rec) {
			this._setSelectedRecord(rec);
		}
		return rec;
	},

	/**
	 * Returns previous record of given record
	 * @method getPreviousOf
	 * @param {Object} record
	 * @return {Object} previous record
	 */
	getPreviousOf:function (record) {
		var data = this._getData();
		var previous;
		if (record) {
			var index = data.indexOf(record);
			if (index > 0) {
				previous = data[index - 1];
			} else {
				previous = undefined;
			}
		} else {
			if (data.length > 0) {
				previous = data[0];
			}
		}
		return previous;
	},

	/**
	 * Select next record. If no record is currently selected, first record will be selected
	 * @method next
	 * @return {Object} record
	 */
	next:function () {
		var rec = this.getNextOf(this.getSelectedRecord());
		if (rec) {
			this._setSelectedRecord(rec);
		}
		return rec;
	},
	/**
	 * Returns next record of given record.
	 * @method getNextOf
	 * @param {Object} record
	 * @return {Object} next record
	 */
	getNextOf:function (record) {
		var data = this._getData();
		var next;
		if (record) {
			var index = data.indexOf(record);
			if (index < data.length - 1) {
				next = data[index + 1];
			} else {
				next = undefined;
			}
		} else {
			if (data.length > 0) {
				next = data[0];
			}
		}
		return next;
	},

	_setSelectedRecord:function (rec) {
		if (this.selectedRecords.length) {
			/**
			 * Event fired when a record is selected
			 * @event deselect
			 * @param {Object} record
			 */
			this.fireEvent('deselect', this.selectedRecords[0]);
		}
		this.selectedRecords = [rec];
		/**
		 Event fired when a record is selected
		 @event select
		 @param {Object} record
		 @example
		 	...
		 	listeners:{
		 		'select' : function(record){
		 			console.log(record);
		 		}
		 	}
		 */
		this.fireEvent('select', Object.clone(rec));
	},

	/**
	 * Return selected record
	 * @method getSelectedRecord
	 * @return {Object} record
	 */
	getSelectedRecord:function () {
		if (this.selectedRecords.length > 0) {
			return this.selectedRecords[0];
		}
		return undefined;
	},

	/**
	 * Return selected records
	 * @method getSelectedRecords
	 * @return {Array} records
	 */
	getSelectedRecords:function () {
		return this.selectedRecords;
	},

	/**
	 Delete records matching search,
	 @method deleteRecords
	 @param {Object} search
	 @example
	 	grid.getDataSource().deleteRecords({ country: 'Norway' });
	 will delete all records from collection where country is equal to "Norway". A delete event
	 will be fired for each deleted record.
	 */
	deleteRecords:function (search) {
		var records = this.findRecords(search);
		for (var i = 0; i < records.length; i++) {
			this.data.erase(records[i]);
			this.fireEvent('delete', records[i]);
		}
	},
	/**
	 Delete a single record. Deletes first match when
	 multiple matches found.
	 @method deleteRecord
	 @param {Object} search
	 @example
	 	grid.getDataSource().deleteRecord({ country: 'Norway' });
	 Will delete first found record where country is equal to Norway. It will fire a
	 delete event if a record is found and deleted.
	 */
	deleteRecord:function (search) {
		var rec = this.findRecord(search);
		if (rec) {
			this.data.erase(rec);
			/**
			 * Event fired when a record is deleted
			 * @event delete
			 * @param {Object} record
			 */
			this.fireEvent('delete', rec);
		}
	},

	/**
	 Select records from current selected record to record matching search,
	 @method selectTo
	 @param {Object} search
	 @example
	 	collection.selectRecord({ country: 'Norway' });
	 	collection.selectTo({country: 'Denmark'});
	 	var selectedRecords = collection.getSelectedRecords();
	 */
	selectTo:function (search) {
		var selected = this.getSelectedRecord();
		if (!selected) {
			this.selectRecord(search);
			return;
		}
		var rec = this.findRecord(search);
		if (rec) {
			this.selectedRecords = [];
			var index = this.data.indexOf(rec);
			var indexSelected = this.data.indexOf(selected);
			var i;
			if (index > indexSelected) {
				for (i = indexSelected; i <= index; i++) {
					this.selectedRecords.push(this.data[i]);
					this.fireEvent('select', this.data[i]);
				}
			} else {
				for (i = indexSelected; i >= index; i--) {
					this.selectedRecords.push(this.data[i]);
					this.fireEvent('select', this.data[i]);
				}
			}
		}
	},

	/**
	 * Update a record
	 * @method updateRecord
	 * @param {Object} search
	 * @param {Object} updates
	 * @return {dataSource.Record} record
	 */
	updateRecord:function (search, updates) {
		var rec = this.getRecord(search);
		if (rec) {
			rec.setProperties(updates);
		}
		return rec;
	},

	getPostData:function () {
		if (!this.paging) {
			return this.parent();
		}
		var ret = this.postData || {};
		ret._paging = {
			size:this.paging.size,
			offset:this.paging.offset
		};
		ret._sort = this.sortedBy;
		return ret;
	},
	/**
	 * When paging is enabled, go to previous page.
	 * fire nextPage event
	 * @method nextPage
	 */
	previousPage:function () {
		if (!this.paging || this.isOnFirstPage())return;
		this.paging.offset -= this.paging.size;
		/**
		 * Event fired when moving to previous page
		 * @event previousPage
		 */
		this.onPageChange('previousPage');
	},

	/**
	 * When paging is enabled, go to next page
	 * fire nextPage event
	 * @method nextPage
	 */
	nextPage:function () {
		if (!this.paging || this.isOnLastPage())return;
		this.paging.offset += this.paging.size;
		/**
		 * Event fired when moving to next page
		 * @event nextPage
		 */
		this.onPageChange('nextPage');
	},

	lastPage:function () {
		if (!this.paging || this.isOnLastPage())return;
		var count = this.getCount();
		this.paging.offset = count - count % this.paging.size;
		this.onPageChange('lastPage');
	},

	firstPage:function () {
		if (!this.paging || this.isOnFirstPage())return;
		this.paging.offset = 0;
		/**
		 * Event fired when moving to first page
		 * @event firstPage
		 */
		this.onPageChange('firstPage');
	},

	isOnFirstPage:function () {
		if (!this.paging)return true;
		return this.paging.offset === undefined || this.paging.offset === 0;
	},

	isOnLastPage:function () {
		return this.paging.size + this.paging.offset > this.getCount();
	},

	onPageChange:function (event) {
		if (this.paging['pageQuery']) {
			this.loadOrGetFromCache();
		}
		this.fireEvent('change');
		this.fireEvent(event);
		this.firePageEvents();
	},

	loadOrGetFromCache:function () {
		if (this.isDataInCache()) {
			this.data = this.dataCache[this.getCacheKey()].data;
			this.fireEvent('change');
		} else {
			this.load();
		}
	},

	populateCache:function () {
		if (this.isCacheEnabled()) {
			this.dataCache[this.getCacheKey()] = {
				data:this.data,
				time:new Date().getTime()
			}
		}
	},

	isDataInCache:function () {
		return this.dataCache[this.getCacheKey()] !== undefined && !this.isCacheOutOfDate();
	},

	isCacheOutOfDate:function () {
		if (!this.paging.cacheTimeout)return false;

		var created = this.dataCache[this.getCacheKey()].time;
		return created + (this.paging.cacheTimeout * 1000) < (new Date().getTime());
	},

	getCacheKey:function () {
		var keys = [
			'key', this.paging.offset, this.sortedBy.column, this.sortedBy.order
		];
		if (this.searcher !== undefined && this.searcher.hasData())keys.push(this.searcher.searchToString());
		return keys.join('|');
	},

	firePageEvents:function (skipState) {
		if (this.isOnLastPage()) {
			/**
			 * Event fired when moving to last page
			 * @event lastPage
			 */
			this.fireEvent('lastPage');
		} else {
			/**
			 * Event fired when moving to a different page than last page
			 * @event notLastPage
			 */
			this.fireEvent('notLastPage');
		}

		if (this.isOnFirstPage()) {
			this.fireEvent('firstPage');

		} else {
			/**
			 * Event fired when moving to a different page than last page
			 * @event notFirstPage
			 */
			this.fireEvent('notFirstPage');
		}

		/**
		 * Event fired when moving to a page
		 * @event page
		 * @param {Number} page number
		 */
		this.fireEvent('page', this.getPageNumber());
		if (skipState === undefined)this.fireEvent('state');
	},

	/**
	 * Go to a specific page
	 * @method toPage
	 * @param {Number} pageNumber
	 * @return {Boolean} success
	 */
	toPage:function (pageNumber) {
		if (pageNumber > 0 && pageNumber <= this.getPageCount() && !this.isOnPage(pageNumber)) {
			this.paging.offset = (pageNumber - 1) * this.paging.size;
			/**
			 * Event fired when moving to a specific page
			 * @event toPage
			 */
			this.onPageChange('toPage');
			return true;
		}
		return false;
	},

	/**
	 * True if on given page
	 * @method isOnPage
	 * @param {Number} pageNumber
	 * @return {Boolean}
	 */
	isOnPage:function (pageNumber) {
		return pageNumber == this.getPageNumber();
	},

	/**
	 * Return current page number
	 * @method getPageNumber
	 * @return {Number} page
	 */
	getPageNumber:function () {
		if (!this.paging)return 1;
		return Math.floor(this.paging.offset / this.paging.size) + 1;
	},

	/**
	 * Return number of pages
	 * @method getPageCount
	 * @return {Number}
	 */
	getPageCount:function () {
		if (!this.paging)return 1;
		return Math.ceil(this.getCount() / this.paging.size);
	},

	getData:function () {
		if (this.hasSearchResult()){
			if (this.paging && this.paging.size) {
				return this.getDataForPage(this.searcher.getData());
			}
			return this.searcher.getData();
		}
		if (!this.paging || this.paging.pageQuery) {
			return this.parent();
		}
		return this.getDataForPage(this.data);
	},

	getDataForPage:function (data) {
		if (!data || data.length == 0)return [];
		var offset = this.paging.initialOffset || this.paging.offset;
		if (offset > data.length) {
			this.toPage(this.getPageCount());
			offset = (this.getPageCount() - 1) * this.paging.size;
		}
		this.resetInitialOffset.delay(200, this);
		return data.slice(offset, Math.min(data.length, offset + this.paging.size));
	},

	resetInitialOffset:function () {
		this.paging.initialOffset = undefined;
	},

	loadComplete:function (data, json) {
		// TODO refactor this
		if (this.paging && json.rows)this.paging.rows = json.rows;
		if (this.paging && json.response && json.response.rows)this.paging.rows = json.response.rows;
		this.parent(data, json);

		this.fireEvent('count', this.data.length);
		if (this.shouldSortAfterLoad()) {
			this.sort();
		} else {
			this.fireEvent('change');
		}
		if (this.paging !== undefined) {
			this.firePageEvents(true);
		}
	},

	createIndex:function () {
		this.index = {};
		this.indexBranch(this.data);
	},

	indexBranch:function(branch, parent){
		for (var i = 0; i < branch.length; i++) {
			this.indexRecord(branch[i], parent);
			if(branch[i].children && branch[i].children.length)this.indexBranch(branch[i].children, branch[i]);
		}
	},

	indexRecord:function(record, parent){
		if(parent)record.parentUid = parent.uid;
		var pk = this.getPrimaryKeyIndexFor(record);
		if(pk)this.index[pk] = record;
		record.uid = ['uid_', String.uniqueID()].join('');
		this.index[record.uid] = record;
	},

	shouldSortAfterLoad:function(){
		if(this.paging && this.paging.pageQuery)return false;
		return this.sortedBy !== undefined && this.sortedBy.column && this.sortedBy.order;
	},

	/**
	 Filter collection based on given search term. To filter on multiple search terms, you should
	 get a reference to the {{#crossLink "dataSource.CollectionSearch"}}{{/crossLink}} object and
	 use the available {{#crossLink "dataSource.CollectionSearch"}}{{/crossLink}} methods to add
	 multiple search terms.
	 @method Search
	 @param {String} search
	 @example
	 	ludo.get('myCollection').search('New York');
	 	// or with the {{#crossLink "dataSource.CollectionSearch/add"}}{{/crossLink}} method
	 	var searcher = ludo.get('myCollection').getSearcher();
	 	searcher.where('New York').execute();
	 	searcher.execute();
	 */
	search:function (search) {
		this.getSearcher().search(search);
	},

	afterSearch:function(){
		var searcher = this.getSearcher();
		this.fireEvent('count', searcher.hasData() ? searcher.getCount() : this.getCount());
		if (this.paging !== undefined) {
			this.paging.offset = 0;
			this.firePageEvents(true);
			this.fireEvent('pageCount', this.getPageCount());
		}
		this.fireEvent('change');
	},

	searcher:undefined,
	/**
	 * Returns a {{#crossLink "dataSource.CollectionSearch"}}{{/crossLink}} object which
	 * you can use to filter a collection.
	 * @method getSearcher
	 * @return {dataSource.CollectionSearch}
	 */
	getSearcher:function () {
		if (this.searcher === undefined) {
			this.searchConfig = this.searchConfig || {};
			var config = Object.merge({
				type:this.searcherType,
				dataSource:this
			}, this.searchConfig);
			this.searcher = ludo._new(config);
			this.addSearcherEvents();
		}
		return this.searcher;
	},

	addSearcherEvents:function(){
		this.searcher.addEvent('search', this.afterSearch.bind(this));
		this.searcher.addEvent('deleteSearch', this.afterSearch.bind(this));
	},

	hasSearchResult:function(){
		return this.searcher !== undefined && this.searcher.hasData();
	},
	/**
	 Return record by id or undefined if not found. Records are indexed by id. This method
	 gives you quick access to a record by it's id. The method returns a reference to the
	 actual record. You can use Object.clone(record) to create a copy of it in case you
	 want to update the record but not make those changes to the collection.
	 @method getById
	 @param {String|Number|Object} id
	 @return {Object} record
	 @example
	 	var collection = new ludo.dataSource.Collection({
	 		url : 'get-countries.php',
	 		primaryKey:'country'
	 	});
	 	var record = collection.getById('Japan'); // Returns record for Japan if it exists.
	 You can also define multiple keys as id
	 @example
		 var collection = new ludo.dataSource.Collection({
			url : 'get-countries.php',
			primaryKey:['id', 'country']
		 });
	   	 var record = collection.getById({ id:1, country:'Japan' });
	 This is especially useful when you have a {{#crossLink "dataSource.TreeCollection"}}{{/crossLink}}
	 where child nodes may have same numeric id as it's parent.
	 @example
	 	{ id:1, type:'country', title : 'Japan',
	 	 	children:[ { id:1, type:'city', title:'Tokyo }]
	 By setting primaryKey to ['id', 'type'] will make it possible to distinguish between countries and cities.
	 */
	getById:function(id){
		if(this.index[id] !== undefined){
			return this.index[id];
		}
		if(this.primaryKey.length===1){
			return this.index[id];
		}else{
			var key = [];
			for(var i=0;i<this.primaryKey.length;i++){
				key.push(id[this.primaryKey[i]]);
			}
			return this.index[key.join('')];
		}
	},

	recordObjects:{},

	/**
	 Returns {{#crossLink "dataSource.Record"}}{{/crossLink}} object for a record.
	 If you want to update a record, you should
	 first get a reference to {{#crossLink "dataSource.Record"}}{{/crossLink}} and then call one
	 of it's methods.
	 @method getRecord
	 @param {String|Object} search
	 @return {dataSource.Record}
	 @example
		 var collection = new ludo.dataSource.Collection({
			url : 'get-countries.php',
			primaryKey:'country'
		 });
	 	 collection.getRecord('Japan').set('capital', 'tokyo');
	 */
	getRecord:function(search){
		var rec = this.findRecord(search);
		if(rec){
			var id = rec.uid;
			if(this.recordObjects[id] === undefined){
				this.recordObjects[id] = new ludo.dataSource.Record(rec, this);
				this.addRecordEvents(this.recordObjects[id]);
			}
			return this.recordObjects[id];
		}
		return undefined;
	},

	addRecordEvents:function(record){
		record.addEvent('update', this.onRecordUpdate.bind(this));
		record.addEvent('dispose', this.onRecordDispose.bind(this));
	},

	onRecordUpdate:function(record){
		this.indexRecord(record);
		this.fireEvent('update', record);
	},

	onRecordDispose:function(record){
		var branch = this.getBranchFor(record);
		if(branch){
			var index = branch.indexOf(record);
			if(index !== -1){
				branch.splice(index,1);
			}
			this.removeFromIndex(record);
			this.fireEvent('dispose', record);
		}
	},

	getBranchFor:function(record){
		if(record.parentUid){
			var parent = this.findRecord(record.parentUid);
			return parent ? parent.children : undefined;
		}else{
			return this.data;
		}
	},

	removeFromIndex:function(record){
		this.recordObjects[record.uid] = undefined;
		this.index[record.uid] = undefined;
		var pk = this.getPrimaryKeyIndexFor(record);
		if(pk)this.index[pk] = undefined;
	},

	getPrimaryKeyIndexFor:function(record){
		if(this.primaryKey){
			var key = [];
			for(var j=0;j<this.primaryKey.length;j++){
				key.push(record[this.primaryKey[j]]);
			}
			return key.join('');
		}
		return undefined;
	}
});

ludo.factory.registerClass('dataSource.Collection', ludo.dataSource.Collection);
ludo.Scroller = new Class({
    Extends : Events,
    els : {
        applyTo : null,
        el : null,
        elInner : null,
        parent : null
    },
    
    active : 0,
    wheelSize : 5,
    type : 'horizontal',
    currentSize : 0,
    
    initialize : function(config){
        this.type = config.type || this.type;    
        if(config.applyTo){
            this.setApplyTo(config.applyTo);

        }
        this.els.parent = config.parent ? document.id(config.parent) : null;
        if(config.mouseWheelSizeCls){
            this.determineMouseWheelSize(config.mouseWheelSizeCls);
        }
        this.createElements();
        this.createEvents();
    },

    setApplyTo : function(applyTo){

        if(instanceOf(applyTo, Array)){
            this.els.applyTo = applyTo;
        }else{
            this.els.applyTo = [applyTo];
        }

    },

    determineMouseWheelSize : function(cls){
        var el = new Element('div');
        el.addClass(cls);
        el.setStyle('visibility', 'hidden');
        document.body.adopt(el);
        this.wheelSize = el.getSize().y;
        if(!this.wheelSize){
            this.wheelSize = 25;
        }
        el.destroy();
    },

    createElements : function(){
        this.els.el = new Element('div');
        ludo.dom.addClass(this.els.el, 'ludo-scroller');
        ludo.dom.addClass(this.els.el, 'ludo-scroller-' + this.type);
        this.els.el.setStyles({
            'position' : 'relative',
            'z-index' : 1000,
            'overflow' : 'hidden'
        });

        if(this.type == 'horizontal'){
            this.els.el.setStyles({
                'overflow-x' : 'auto',
                'width' : '100%',
                'height' : Browser.ie ? '21px' : '17px'
            });
        }else{
            this.els.el.setStyles({
                'overflow-y' : 'auto',
                'height' : '100%',
                'width' : Browser.ie ? '21px' : '17px',
                'right' : '0px',
                'top' : '0px',
                'position' : 'absolute'
            });
        }

        this.els.el.addEvent('scroll', this.performScroll.bind(this));
        
        this.els.elInner = new Element('div');
        this.els.elInner.setStyle('position', 'relative');
        this.els.elInner.set('html', '&nbsp;');

        this.els.el.adopt(this.els.elInner);
    },

    createEvents : function() {
        this.els.elInner.addEvent('resize', this.toggle.bind(this));
        if(this.type == 'vertical'){
            for(var i=0; i< this.els.applyTo.length;i++){
                this.els.applyTo[i].addEvent('mousewheel', this.eventScroll.bind(this));
            }
        }
        document.id(window).addEvent('resize', this.resize.bind(this));
    },

    resize : function() {
        if(this.type == 'horizontal'){
            this.els.el.setStyle('width', this.els.parent.getSize().x);
        } else{
            var size = this.els.parent.getSize().y;
            if(size == 0){
                return;
            }
           this.els.el.setStyle('height', size);
        }

        this.toggle();
    },

    getEl : function(){
        return this.els.el;
    },

    setContentSize : function(size) {
        if(this.type == 'horizontal'){
            this.currentSize = size || this.getWidthOfScrollableElements();
            this.els.elInner.setStyle('width', this.currentSize);
        }else{
            this.currentSize = size || this.getHeightOfScrollableElements();
            if(this.currentSize <= 0){
                var el = this.els.applyTo.getChildren('.ludo-grid-data-column');
                if(el.length){
                    this.currentSize = el[0].getSize().y;
                }
            }
            this.els.elInner.setStyle('height', this.currentSize);
        }

        if(this.currentSize <= 0){
            this.setContentSize.delay(1000, this);
        }


        this.resize();
        this.toggle();
    },

    getWidthOfScrollableElements : function() {
        var ret = 0;
        for(var i=0;i<this.els.applyTo.length;i++){
            ret += this.els.applyTo[i].getSize().x;
        }
        return ret;
    },

    getHeightOfScrollableElements : function() {
        var ret = 0;
        for(var i=0;i<this.els.applyTo.length;i++){
            ret += this.els.applyTo[i].getSize().y;
        }
        return ret;
    },

    eventScroll : function(e){
        this.els.el.scrollTop -= (e.wheel * this.wheelSize);
        return false;
    },
    
    performScroll : function(){
        if(this.type == 'horizontal'){
            this.scrollTo(this.els.el.scrollLeft);
        }else{
            this.scrollTo(this.els.el.scrollTop);
        }
    },

    scrollBy : function(val){
        if(this.type == 'horizontal'){
            this.els.el.scrollLeft += val;
            this.scrollTo(this.els.el.scrollLeft);
        }else{
            this.els.el.scrollTop += val;
            this.scrollTo(this.els.el.scrollTop);
        }



    },

    scrollTo : function(val){
        var i;
        if(this.type == 'horizontal'){
            for(i=0;i<this.els.applyTo.length;i++){
                this.els.applyTo[i].style.left = (val *-1) + 'px';
            }
        }else{
            for(i=0;i<this.els.applyTo.length;i++){
                this.els.applyTo[i].style.top = (val *-1) + 'px';
            }
        }
        this.fireEvent('scroll', this);
    },

    getHeight : function() {
        if(!this.active){
            return 0;
        }

        return this.els.el.getSize().y
    },

    getWidth : function() {
        if(!this.active){
            return 0;
        }
        return this.els.el.getSize().x
    },

    toggle : function() {
        if(this.shouldShowScrollbar()){
            this.show();
        } else {
            this.hide();
        }
    },

    shouldShowScrollbar : function() {
        var size;
        if(this.type == 'horizontal'){
            size = this.getParentEl().getSize().x;
        } else{
            size = this.getParentEl().getSize().y;
        }
        return this.currentSize > size && size > 0;
    },

    getParentEl : function() {
        return this.els.parent ? this.els.parent : this.els.el;
    },

    show : function() {
        this.active = true;
        this.els.el.setStyle('display', '');
    },

    hide : function() {
        this.active = false;
        this.scrollTo(0);
        this.els.el.setStyle('display', 'none');
    }
});
/**
 Private class used by grid.Grid to render headers
 @namespace grid
 @class GridHeader
 @private
 */
ludo.grid.GridHeader = new Class({
	Extends:ludo.Core,
	columnManager:undefined,
	grid:undefined,
	cells:{},
	cellHeight:undefined,
	spacing:{},
	headerMenu:false,

	ludoConfig:function (config) {
		this.parent(config);
		this.columnManager = config.columnManager;
		this.headerMenu = config.headerMenu;
		this.grid = config.grid;

		this.measureCellHeight();
		this.createDOM();
	},

	ludoEvents:function () {
		this.parent();
		this.columnManager.addEvent('resize', this.renderColumns.bind(this));
		this.columnManager.addEvent('stretch', this.renderColumns.bind(this));
		this.columnManager.addEvent('movecolumn', this.renderColumns.bind(this));
		this.columnManager.addEvent('hidecolumn', this.renderColumns.bind(this));
		this.columnManager.addEvent('showcolumn', this.renderColumns.bind(this));
		this.grid.addEvent('render', this.renderColumns.bind(this));
		this.grid.getDataSource().addEvent('sort', this.updateSortArrow.bind(this));
	},

	createDOM:function () {

		this.el = new Element('div');
		ludo.dom.addClass(this.el, 'ludo-header');
		ludo.dom.addClass(this.el, 'testing');
		this.el.inject(this.grid.getBody().getFirst(), 'before');

		var countRows = this.columnManager.getCountRows();
		this.el.setStyle('height', this.cellHeight * countRows + ludo.dom.getMBPH(this.el));
		this.renderColumns();
	},

	renderColumns:function () {
		var countRows = this.columnManager.getCountRows();
		for (var i = 0; i < countRows; i++) {
			var columns = this.columnManager.getColumnsInRow(i);
			var left = 0;
			for (var j = 0; j < columns.length; j++) {
				var width = this.columnManager.getWidthOf(columns[j]);
				if (i == this.columnManager.getStartRowOf(columns[j])) {

					var cell = this.getCell(columns[j]);
					cell.setStyle('display', '');
					cell.setStyle('left', left);
					cell.setStyle('top', i * this.cellHeight);
					var height = (this.columnManager.getRowSpanOf(columns[j]) * this.cellHeight) - this.spacing.height;
					var spacing = (j==columns.length-1) ? this.spacing.width / 2 : this.spacing.width;
					cell.setStyle('width', width - spacing);
					cell.setStyle('height', height);
					cell.setStyle('line-height', height);

					this.resizeCellBackgrounds(columns[j]);

					cell.removeClass('last-header-cell');
					if (j == columns.length - 1) {
						ludo.dom.addClass(cell, 'last-header-cell');
					}
				}
				left += width;
			}
		}
		this.hideHiddenColumns();
	},

	hideHiddenColumns:function () {
		var hiddenColumns = this.columnManager.getHiddenColumns();
		for (var i = 0; i < hiddenColumns.length; i++) {
			if (this.cellExists(hiddenColumns[i])) {
				this.cells[hiddenColumns[i]].style.display = 'none';
			}
		}
	},

	cellExists:function (col) {
		return this.cells[col] !== undefined;
	},

	measureCellHeight:function () {
		if(this.grid.isHidden())return;
		var el = new Element('div');
		ludo.dom.addClass(el, 'ludo-grid-header-cell');
		this.grid.getBody().adopt(el);
		this.cellHeight = el.getSize().y + ludo.dom.getMH(el);

		this.spacing = {
			width:ludo.dom.getMBPW(el),
			height:ludo.dom.getMBPH(el)
		};
		el.dispose();
	},

	menuButtons:{},

	getCell:function (col) {
		if (this.cells[col]) {
			return this.cells[col];
		}
		var el = this.cells[col] = new Element('div');
		el.setProperty('col', col);
		ludo.dom.addClass(el, 'ludo-grid-header-cell');
		ludo.dom.addClass(el, 'ludo-header-' + this.columnManager.getHeaderAlignmentOf(col));

		var span = new Element('span');
		ludo.dom.addClass(span, 'ludo-cell-text');
		el.adopt(span);

		this.createTopAndBottomBackgrounds(col);
		this.addDOMForDropTargets(el, col);

		if (this.columnManager.isSortable(col)) {
			el.addEvent('click', this.sortByDOM.bind(this));
		}
		el.addEvent('mouseover', this.mouseoverHeader.bind(this));
		el.addEvent('mouseout', this.mouseoutHeader.bind(this));

		if (this.headerMenu) {
			this.menuButtons[col] = new ludo.menu.Button({
				renderTo:el,
				id:this.getMenuButtonId(col),
				menu:this.getMenu(col),
				listeners:{
					beforeShow:this.validateButtonDisplay.bind(this)
				}
			});
		}
		el.getElement('span').set('html', this.columnManager.getHeadingFor(col));
		this.el.adopt(el);

		this.getMovable().add({
			el:el,
			column:col
		});
		return el;
	},

	validateButtonDisplay:function (button) {
		if (this.columnMove && this.columnMove.isActive()) {
			button.cancelShow();
		}
	},
	cellBg:{},

	createTopAndBottomBackgrounds:function (col) {
		var top = new Element('div');
		ludo.dom.addClass(top, 'ludo-grid-header-cell-top');
		this.cells[col].adopt(top);
		var bottom = new Element('div');
		ludo.dom.addClass(bottom, 'ludo-grid-header-cell-bottom');
		this.cells[col].adopt(bottom);
		this.cellBg[col] = {
			top:top,
			bottom:bottom
		};
	},

	resizeCellBackgrounds:function (col) {
		var totalHeight = this.columnManager.getRowSpanOf(col) * this.cellHeight;
		totalHeight -= this.spacing.height;
		var height = Math.round(totalHeight) / 2;
		this.cellBg[col].top.setStyle('height', height);
		height = totalHeight - height;
		this.cellBg[col].bottom.setStyle('height', height);
	},

	getMenu:function (col) {
		return {
			singleton:true,
			id:this.getMenuId(),
			type:'menu.Menu',
			direction:'vertical',
			children:this.getColumnMenu(col)
		};
	},

	getColumnMenu:function (forColumn) {
		var ret = [];
		var columnKeys = this.columnManager.getLeafKeys();
		for (var i = 0; i < columnKeys.length; i++) {
			ret.push({
				type:'form.Checkbox',
				disabled:!(this.columnManager.isRemovable(columnKeys[i])),
				checked:this.columnManager.isVisible(columnKeys[i]),
				label:this.columnManager.getHeadingFor(columnKeys[i]),
				action:columnKeys[i],
				listeners:{
					change:this.getColumnToggleFn(columnKeys[i], forColumn)
				}
			});
		}
		return ret;
	},

	getColumnToggleFn:function (column, forColumn) {
		return function (checked) {
			if (checked) {
				this.columnManager.showColumn(column);
			} else {
				this.columnManager.hideColumn(column);
			}
			ludo.get(this.getMenuButtonId(forColumn)).hideMenu();
		}.bind(this);
	},

	getMenuId:function () {
		return 'header-menu-' + this.getId();
	},

	getMenuButtonId:function (column) {
		return this.getMenuId() + '-' + column;
	},


	mouseoverHeader:function (e) {
		var col = this.getColByDOM(e.target);
		if (!this.grid.colResizeHandler.isActive() && !this.grid.isColumnDragActive() && this.columnManager.isSortable(col)) {
			this.cells[col].addClass('ludo-grid-header-cell-over');
		}
	},

	mouseoutHeader:function (e) {
		if (!this.grid.colResizeHandler.isActive()) {
			var col = this.getColByDOM(e.target);
			if (!col)return;
			this.cells[col].removeClass('ludo-grid-header-cell-over');
		}
	},

	getColByDOM:function (el) {
		var ret = el.getProperty('col');
		if (!ret && ret != '0') {
			ret = el.getParent().getProperty('col');
		}
		return ret;
	},

	getHeight:function () {
		if (this.cachedHeight === undefined) {
			this.cachedHeight = this.columnManager.getCountRows() * this.cellHeight;
			this.cachedHeight += ludo.dom.getMBPH(this.el);
		}
		return this.cachedHeight;

	},

	getEl:function () {
		return this.el;
	},

	sortByDOM:function (e) {
		var col = this.getColByDOM(e.target);
		this.grid.getDataSource().sortBy(col);
	},

	addDOMForDropTargets:function (parent, column) {
		var left = new Element('div');
		left.setStyles({
			position:'absolute',
			'z-index':15,
			left:'0px', top:'0px',
			width:'50%', height:'100%'
		});

		parent.adopt(left);
		var right = new Element('div');
		right.setStyles({
			position:'absolute',
			'z-index':15,
			right:'0px', top:'0px',
			width:'50%', height:'100%'
		});
		parent.adopt(right);

		this.getMovable().addDropTarget({
			el:left,
			column:column,
			position:'before'
		});
		this.getMovable().addDropTarget({
			el:right,
			column:column,
			position:'after'
		});
	},

	columnMove:undefined,
	getMovable:function () {
		if (this.columnMove === undefined) {
			this.columnMove = new ludo.grid.ColumnMove({
				useShim:true,
				delay:.5,
				mouseYOffset:15,
				mouseXOffset:15,
				listeners:{
					before:this.validateMove.bind(this),
					start:this.grid.hideResizeHandles.bind(this.grid),
					end:this.grid.showResizeHandles.bind(this.grid),
					enterDropTarget:this.validateDrop.bind(this),
					leaveDropTarget:this.leaveDropTarget.bind(this),
					showShim:this.setColumnTextOnMove.bind(this),
					drop:this.moveColumn.bind(this)
				}
			});
		}
		return this.columnMove;
	},

	setColumnTextOnMove:function (shim, dd) {
		var column = dd.getDragged().column;
		shim.set('html', this.columnManager.getHeadingFor(column));
		shim.setStyle('line-height', shim.style.height);
	},

	validateMove:function (dragged, dd) {
		if (!this.columnManager.isMovable(dragged.column)) {
			dd.cancelDrag();
		}
	},
	validateDrop:function (dragged, dropPoint) {
		var cm = this.columnManager;
		if (cm.canBeMovedTo(dragged.column, dropPoint.column, dropPoint.position)) {
			var m = this.getMovable();
			m.showMarkerAt(this.getCell(dropPoint.column), dropPoint.position);
			var height = (cm.getChildDepthOf(dropPoint.column) + cm.getRowSpanOf(dropPoint.column)) * this.cellHeight;
			m.setMarkerHeight(height);
		}
	},

	leaveDropTarget:function () {
		this.getMovable().hideMarker();
	},

	moveColumn:function (dragged, droppedAt) {
		if (droppedAt.position == 'before') {
			this.columnManager.insertColumnBefore(dragged.column, droppedAt.column);
		} else {
			this.columnManager.insertColumnAfter(dragged.column, droppedAt.column);
		}
		this.getMovable().hideMarker();
	},

	clearSortClassNameFromHeaders:function () {
		var keys = this.columnManager.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			if (this.cells[keys[i]] !== undefined) {
				var el = this.cells[keys[i]].getElements('span')[0];
				el.removeClass('ludo-cell-text-sort-asc');
				el.removeClass('ludo-cell-text-sort-desc');
			}
		}
	},

	updateSortArrow:function (sortedBy) {
		this.clearSortClassNameFromHeaders();
		var headerCell = this.cells[sortedBy.column];
		if (headerCell) {
			headerCell.getElements('span')[0].addClass('ludo-cell-text-sort-' + sortedBy.order);
		}
	}
});
ludo.ColResize = new Class({
    Extends:ludo.Core,
    component:undefined,
    resizeHandles:{},
    resizeProperties:{},
    minPos:0,
    maxPos:10000,

    ludoConfig:function (config) {
        this.parent(config);
        this.component = config.component;
        this.createEvents();
    },

    createEvents:function () {
        this.getEventEl().addEvent(this.getDragMoveEvent(), this.moveColResizeHandle.bind(this));
        this.getEventEl().addEvent(this.getDragEndEvent(), this.stopColResize.bind(this));
    },

    setPos:function (index, pos) {
        this.resizeHandles[index].setStyle('left', pos);
    },

    hideHandle:function (index) {
        this.resizeHandles[index].style.display = 'none';
    },
    showHandle:function (index) {
        this.resizeHandles[index].style.display = '';
    },

    hideAllHandles:function () {
        for (var key in this.resizeHandles){
            if(this.resizeHandles.hasOwnProperty(key)){
                this.hideHandle(key);
            }
        }
    },
    showAllHandles:function () {
        for (var key in this.resizeHandles){
            if(this.resizeHandles.hasOwnProperty(key)){
                this.showHandle(key);
            }
        }
    },

    getHandle:function (key, isVisible) {

        var el = new Element('div');
        ludo.dom.addClass(el, 'ludo-column-resize-handle');
        el.setStyles({
            'top':0,
            'position':'absolute',
            'height':'100%',
            'cursor':'col-resize',
            'z-index':15000,
            display:isVisible ? '' : 'none'
        });
        el.setProperty('col-reference', key);
        if (this.shouldUseTouchEvents()) {
            el.addEvent('touchstart', this.startColResize.bind(this));
        } else {
            el.addEvent('mousedown', this.startColResize.bind(this));
            el.addEvent('mouseenter', this.mouseOverResizeHandle.bind(this));
            el.addEvent('mouseleave', this.mouseOutResizeHandle.bind(this));
        }
        this.resizeHandles[key] = el;
        return el;
    },

    startColResize:function (e) {
        var columnName = e.target.getProperty('col-reference');
        this.fireEvent('startresize', columnName);
        ludo.dom.addClass(e.target, 'ludo-resize-handle-active');
        var offset = this.getLeftOffsetOfColResizeHandle();

        var r = this.resizeProperties;
        r.min = this.getMinPos() - offset;
        r.max = this.getMaxPos() - offset;

        r.mouseX = this.resizeProperties.currentX = e.page.x;
        r.elX = parseInt(e.target.getStyle('left').replace('px', ''));
        r.currentX = this.resizeProperties.elX;

        r.active = true;
        r.el = e.target;
        r.index = columnName;

        return false;
    },

    getLeftOffsetOfColResizeHandle:function () {
        if (!this.resizeHandles[0]) {
            return 3;
        }
        if (!this.handleOffset) {
            var offset = Math.ceil(this.resizeHandles[0].getSize().x / 2);
            if (offset > 0) {
                this.handleOffset = offset;
            } else {
                return 3;
            }
        }
        return this.handleOffset;
    },

    moveColResizeHandle:function (e) {
        if (this.resizeProperties.active) {
            var pos = this.resizeProperties.elX - this.resizeProperties.mouseX + e.page.x;
            pos = Math.max(pos, this.resizeProperties.min);
            pos = Math.min(pos, this.resizeProperties.max);
            this.resizeProperties.el.setStyle('left', pos);

            this.resizeProperties.currentX = pos;
            return false;
        }
    },

    stopColResize:function () {
        if (this.resizeProperties.active) {
            this.resizeProperties.active = false;
            this.resizeProperties.el.removeClass('ludo-resize-handle-active');
            var change = this.resizeProperties.currentX - this.resizeProperties.elX;
            this.fireEvent('resize', [this.resizeProperties.index, change]);
            return false;
        }
    },

    getMinPos:function () {
        return this.minPos;
    },
    getMaxPos:function () {
        return this.maxPos;
    },

    setMinPos:function (pos) {
        this.minPos = pos;
    },

    setMaxPos:function (pos) {
        this.maxPos = pos;
    },

    mouseOverResizeHandle:function (e) {
        ludo.dom.addClass(e.target, 'ludo-grid-resize-handle-over');
    },
    mouseOutResizeHandle:function (e) {
        e.target.removeClass('ludo-grid-resize-handle-over');
    },

    isActive:function(){
        return this.resizeProperties.active;
    }
});
/**
 Column manager for grids. Grids will listen to events fired by this component. A column manager is usually created by
 sending a "columnManager" config object to the constructor of a grid.Grid view.
 @namespace grid
 @class ColumnManager
 @extends Core
 @constructor
 @param {Object} config
 @example
 columnManager:{
		columns:{
			'country':{
				heading:'Country',
				removable:false,
				sortable:true,
				movable:true,
				width:200,
				renderer:function (val) {
					return '<span style="color:blue">' + val + '</span>';
				}
			},
			'capital':{
				heading:'Capital',
				sortable:true,
				removable:true,
				movable:true,
				width:150
			},
			population:{
				heading:'Population',
				movable:true,
				removable:true
			}
		}
	}
 Is example of a ColumnManager config object sent to a grid. It defines three columns, "country", "capital" and "population". These names
 corresponds to keys in the data sets. How to configure columns is specified in {{#crossLink "grid.Column"}}{{/crossLink}}
 */
ludo.grid.ColumnManager = new Class({
	Extends:ludo.Core,
	type:'grid.ColumnManager',
	/**
	 * Always fill view, i.e. dynamically increase with of last visible column when
	 * total width of visible columns is less than width of the Grid.
	 * @config fill
	 * @type {Boolean}
	 * @default true
	 */
	fill:true,

	/**
	 * Configuration of columns
	 * @config {Object} columns
	 * @default {}
	 */
	columns:{},

	columnKeys:[],

	statefulProperties:['columns', 'columnKeys'],

	/**
	 * Internal column lookup. Flat version of this.columns
	 * @property {Object} columnLookup
	 * @private
	 */
	columnLookup:{},

	ludoConfig:function (config) {
		this.parent(config);
		if (config.fill !== undefined)this.fill = config.fill;
		if (config.columns !== undefined)this.columns = config.columns;
		this.createColumnLookup();

		if (config.columnKeys !== undefined && this.hasValidColumnKeys(config.columnKeys)) {
			this.columnKeys = config.columnKeys;
		} else {
			this.columnKeys = this.getLeafKeysFromColumns();
		}
	},

	getLeafKeysFromColumns:function (parent) {
		var ret = [];
		parent = parent || this.columns;
		for (var key in parent) {
			if (parent.hasOwnProperty(key)) {
				ret.push(key);
				if (parent[key].columns !== undefined) {
					var keys = this.getLeafKeysFromColumns(parent[key].columns);
					for (var i = 0; i < keys.length; i++) {
						ret.push(keys[i]);
					}
				}
			}
		}
		return ret;
	},

	createColumnLookup:function (parent, groupName) {
		parent = parent || this.columns;
		for (var key in parent) {
			if (parent.hasOwnProperty(key)) {
				this.columnLookup[key] = parent[key];
				this.columnLookup[key].group = groupName;
				if (parent[key].columns !== undefined) {
					this.createColumnLookup(parent[key].columns, key);
				}
			}
		}
	},

	hasValidColumnKeys:function (keys) {
		for (var i = 0; i < keys.length; i++) {
			if (this.columnLookup[keys[i]] === undefined)return false;
		}
		return true;
	},

	hasLastColumnDynamicWidth:function () {
		return this.fill;
	},

	getColumns:function () {
		return this.columns;
	},

	getColumn:function (key) {
		return this.columnLookup[key];
	},

	getLeafKeys:function () {
		var ret = [];
		for (var i = 0; i < this.columnKeys.length; i++) {
			if (this.columnLookup[this.columnKeys[i]].columns === undefined) {
				ret.push(this.columnKeys[i]);
			}
		}
		return ret;
	},

	/**
	 * Returns object of visible columns, example:
	 * {
     country : {
     heading : 'Country'
     },
     population: {
     heading : 'Population'
     }
     }
	 * @method getVisibleColumns
	 * @return {Object} visible columns
	 */
	getVisibleColumns:function () {
		var ret = {};
		var keys = this.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			if (!this.isHidden(key)) {
				ret[key] = this.columnLookup[key];
			}
		}
		return ret;
	},

	getHeadingFor:function (column) {
		return this.getColumnKey(column, 'heading') || '';
	},

	getMinWidthOf:function (column) {
		if (this.isGroup(column)) {
			var children = this.getIdOfChildren(column);
			var ret = 0;
			for (var i = 0; i < children.length; i++) {
				ret += this.getMinWidthOf(children[i]);
			}
			return ret;
		}
		return this.getColumnKey(column, 'minWidth') || 50;
	},

	getMaxWidthOf:function (column) {
		return this.getColumnKey(column, 'maxWidth') || 1000;
	},


	getWidthOf:function (column) {
		var stretchedWidth = this.getStrechedWithOf(column);
		if (stretchedWidth) return stretchedWidth;
		if (this.isGroup(column)) {
			var columns = this.getColumnsInGroup(column);
			var width = 0;
			Object.each(columns, function (value, column) {
				if(!this.isHidden(column))width += this.getWidthOf(column);
			}.bind(this));
			return width;
		} else {
			return this.getColumnKey(column, 'width') || 100;
		}
	},

	isGroup:function (column) {
		return this.columnLookup[column] !== undefined && this.columnLookup[column].columns !== undefined;
	},

	getColumnsInGroup:function (group) {
		return this.columnLookup[group].columns;
	},

	getStrechedWithOf:function (column) {
		return this.getColumnKey(column, 'stretchWidth');
	},

	isRemovable:function (column) {
		return this.getColumnKey(column, 'removable') ? true : false;
	},

	/**
	 * Returns true if column with given id is in a group.
	 * @method isInAGroup
	 * @param {String} column
	 * @return {Boolean} is in a group
	 */
	isInAGroup:function (column) {
		return this.getColumnKey(column, 'group') !== undefined;
	},

	/**
	 * Returns id of parent group
	 * @method getGroupIdOf
	 * @param {String} column
	 * @return {String} group id
	 */
	getGroupIdOf:function (column) {
		return this.getColumnKey(column, 'group');
	},

	/**
	 * Returns parent group object for a column
	 * @method getGroupFor
	 * @param {String} column
	 * @return {grid.Column|undefined} parent
	 */
	getGroupFor:function (column) {
		var id = this.getGroupIdOf(column);
		if (id)return this.columnLookup[id];
		return undefined;
	},

	getChildCount:function (groupId) {
		var group = this.getColumn(groupId);
		if (group.columns !== undefined) {
			return Object.getLength(group.columns);
		}
		return 0;
	},

	getIdOfChildren:function (groupId) {
		var group = this.getColumn(groupId);
		if (group) {
			return Object.keys(group.columns);
		}
		return 0;
	},

	isInSameGroup:function (columnA, columnB) {
		return this.isInAGroup(columnA) && this.getGroupIdOf(columnA) == this.getGroupIdOf(columnB);
	},

	isSortable:function (column) {
		return this.getColumnKey(column, 'sortable') ? true : false;
	},

	isHidden:function (column) {
		var hidden = this.getColumnKey(column, 'hidden');
		if (hidden)return true;
		var parentGroup;
		if (parentGroup = this.getGroupIdOf(column)) {
			return this.isHidden(parentGroup);
		}
		return hidden;
	},
	isVisible:function (column) {
		return !this.isHidden(column);
	},
	/**
	 * Returns true if column with given id is resizable
	 * @method isResizable
	 * @param {String} column
	 * @return {Boolean}
	 */
	isResizable:function (column) {
		var resizable = this.getColumnKey(column, 'resizable') !== false;
		if (resizable && this.hasLastColumnDynamicWidth() && this.isLastVisibleColumn(column)) {
			resizable = false;
		}
		return resizable;
	},
	isMovable:function (column) {
		var parent = this.getGroupIdOf(column);
		if (parent && this.getChildCount(parent) == 1) {
			return false;
		}
		return this.getColumnKey(column, 'movable') || false;
	},

	hasMovableColumns:function () {
		for (var i = 0; i < this.columnKeys.length; i++) {
			if (this.isMovable(this.columnKeys[i]))return true;
		}
		return false;
	},

	getAlignmentOf:function (column) {
		return this.getColumnKey(column, 'align') || 'left';
	},

	getHeaderAlignmentOf:function(column){
		return this.getColumnKey(column, 'headerAlign') || 'left';
	},

	setLeft:function (column, left) {
		this.columnLookup[column].left = left;
	},
	getLeftPosOf:function (column) {
		return this.getColumnKey(column, 'left') || 0;
	},

	getRendererFor:function (column) {
		return this.getColumnKey(column, 'renderer');
	},

	setWidth:function (column, width) {
		this.columnLookup[column].width = width;
	},

	setStretchedWidth:function (width) {
		this.columnLookup[this.getLastVisible()].stretchWidth = width;
		this.fireEvent('stretch');
	},

	clearStretchedWidths:function () {
		for (var i = 0; i < this.columnKeys.length; i++) {
			this.columnLookup[this.columnKeys[i]].stretchWidth = undefined;
		}

	},

	increaseWithFor:function (column, increaseBy) {
		var width = this.getWidthOf(column);
		this.columnLookup[column].width = width + increaseBy;
		this.fireEvent('resize');
		this.fireEvent('state');
	},

	getColumnKey:function (column, key) {
		if (this.columnLookup[column] !== undefined) {
			return this.columnLookup[column][key];
		}
		return null;
	},

	getTotalWidth:function () {
		var cols = this.getVisibleColumns();
		var ret = 0;
		for (var col in cols) {
			if (cols.hasOwnProperty(col)) {
				ret += this.getWidthOf(col);
			}
		}
		return ret;
	},

	getMinPosOf:function (column) {
		return this.getTotalWidthOfPreviousOf(column) + this.getMinWidthOf(column);
	},

	getMaxPosOf:function (column) {
		return this.getTotalWidthOfPreviousOf(column) + this.getMaxWidthOf(column);
	},

	getTotalWidthOfPreviousOf:function (column) {
		var keys = this.getLeafKeys();
		var ret = 0;
		for (var i = 0; i < keys.length; i++) {
			if (keys[i] == column) {
				return ret;
			} else {
				if (!this.isHidden(keys[i])) {
					ret += this.getWidthOf(keys[i]);
				}
			}
		}
		return 0;
	},

	/**
	 * Insert a column before given column
	 * @method insertColumnBefore
	 * @param {String} column id
	 * @param {String} before column id
	 */
	insertColumnBefore:function (column, before) {
		this.moveColumn(column, before, 'before');
	},
	/**
	 * Insert a column after given column
	 * @method insertColumnAfter
	 * @param {String} column id
	 * @param {String} after column id
	 */
	insertColumnAfter:function (column, after) {
		this.moveColumn(column, after, 'after');
	},

	moveColumn:function (column, insertAt, beforeOrAfter) {
		var indexAt = this.getInsertionPoint(insertAt, beforeOrAfter);
		var indexThis = this.columnKeys.indexOf(column);

		if (this.isInAGroup(column) && !this.isInSameGroup(column, insertAt)) {
			this.removeFromGroup(column);
		}
		var i,j;
		var indexes = [indexThis];
		if (this.isGroup(column)) {
			var children = this.getIdOfChildren(column);
			for (i = 0; i < children.length; i++) {
				indexes.push(this.columnKeys.indexOf(children[i]));
			}
		}

		if(this.isInAGroup(insertAt)){
			this.insertIntoSameGroupAs(column,insertAt);
		}

		var ret = [];
		for (i = 0; i < this.columnKeys.length; i++) {
			if (i == indexAt && beforeOrAfter == 'before') {
				for (j = 0; j < indexes.length; j++) {
					ret.push(this.columnKeys[indexes[j]]);
				}
			}
			if (indexes.indexOf(i) == -1) {
				ret.push(this.columnKeys[i]);
			}
			if (i == indexAt && beforeOrAfter == 'after') {
				for (j = 0; j < indexes.length; j++) {
					ret.push(this.columnKeys[indexes[j]]);
				}
			}
		}
		this.columnKeys = ret;

		/**
		 * Fired when a column has been moved
		 * @event movecolumn
		 */
		this.fireEvent('movecolumn', [column, this.columnKeys[indexAt], beforeOrAfter]);
		this.fireEvent('state');
	},

	getInsertionPoint:function(insertAtColumn, pos){
		var ret = this.columnKeys.indexOf(insertAtColumn);
		if (pos === 'after' && this.isGroup(insertAtColumn)){
			var columns = Object.keys(this.getColumnsInGroup(insertAtColumn));
			for(var i=0;i<columns.length;i++){
				ret = Math.max(ret, this.columnKeys.indexOf(columns[i]));
			}
		}
		return ret;
	},

	/**
	 * @method insertIntoSameGroupAs
	 * @param {String} column
	 * @param {String} as
	 * @private
	 */
	insertIntoSameGroupAs:function(column, as){
		var group = this.columnLookup[as].group;
		this.columnLookup[column].group = group;
		this.columnLookup[group].columns[column] = this.columnLookup[column];
		this.clearCache();
	},

	isLastVisibleColumn:function (column) {
		var keys = this.getLeafKeys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var key = keys[i];
			if (!this.isHidden([key])) {
				return key === column;
			}
		}
		return false;
	},

	/**
	 * Remove column from a group
	 * @method removeFromGroup
	 * @param {String} column
	 * @return {Boolean} success
	 */
	removeFromGroup:function (column) {
		var group = this.getGroupFor(column);
		if (group) {
			delete group.columns[column];
			this.getColumn(column).group = undefined;
			this.clearCache();
			return true;
		}
		return false;
	},

	hideColumn:function (column) {
		if (this.columnExists(column) && !this.isHidden(column)) {
			this.columnLookup[column].hidden = true;
			/**
			 * Fired when a column is hidden
			 * @event hidecolumn
			 */
			this.fireEvent('hidecolumn', column);

			this.fireEvent('state');
		}
	},

	columnExists:function (column) {
		return this.columnLookup[column] !== undefined;
	},

	hideAllColumns:function () {
		var keys = this.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			this.columnLookup[keys[i]].hidden = true;
		}
	},

	showColumn:function (column) {
		if (this.columnExists(column) && this.isHidden([column])) {
			this.columnLookup[column].hidden = false;
			/**
			 * Fired when a column is shown
			 * @event showcolumn
			 */
			this.fireEvent('showcolumn', column);

			this.fireEvent('state');
		}
	},

	getIndexOfLastVisible:function () {
		var keys = this.getLeafKeys();
		for (var i = keys.length - 1; i >= 0; i--) {
			if (!this.isHidden(keys[i])) {
				return i;
			}
		}
		return null;
	},

	getLastVisible:function () {
		return this.getLeafKeys()[this.getIndexOfLastVisible()];
	},

	countHeaderRows:undefined,
	getCountRows:function () {
		if (this.countHeaderRows === undefined) {
			var ret = 0;
			var keys = this.getLeafKeys();
			for (var i = 0; i < keys.length; i++) {
				ret = Math.max(ret, this.getStartRowOf(keys[i]));
			}
			this.countHeaderRows = ret + 1;
		}
		return this.countHeaderRows;
	},

	countParentCache:{},
	getStartRowOf:function (column) {
		if (this.countParentCache[column] === undefined) {
			var ret = 0;
			if (this.columnLookup[column].group !== undefined) {
				var col = this.columnLookup[column].group;
				while (col) {
					ret++;
					col = this.columnLookup[col].group;
				}
			}
			this.countParentCache[column] = ret;
		}
		return this.countParentCache[column];
	},
	clearCache:function(){
		this.countParentCache = {};
		this.columnDepthCache = {};
	},

	/**
	 * Return array of column keys for a header row, 0 is first row
	 * @method getColumnsInRow
	 * @param {Number} rowNumber
	 * @return {Array} columns
	 */
	getColumnsInRow:function (rowNumber) {
		var ret = [];
		for(var i=0;i<this.columnKeys.length;i++){
			var col = this.columnKeys[i];
			if(!this.isHidden(this.columnKeys[i])){
				var startRow = this.getStartRowOf(col);
				if(startRow <= rowNumber && !this.isGroup(col)){
					ret.push(col);
				}else{
					if(startRow == rowNumber){
						ret.push(col);
					}
				}
			}
		}
		return ret;

	},

	getRowSpanOf:function(column){
		var countRows = this.getCountRows();
		if(!this.isGroup(column)){
			return countRows - this.getStartRowOf(column);
		}else{
			return countRows - this.getStartRowOf(column) - this.getChildDepthOf(column);
		}
	},

	columnDepthCache:{},
	getChildDepthOf:function(column){
		if(this.columnDepthCache[column] === undefined){
			if(this.isGroup(column)){
				var ret = 0;
				var children = this.getIdOfChildren(column);
				for(var i=0;i<children.length;i++){
					ret = Math.max(ret, this.getChildDepthOf(children[i]));
				}
				ret++;
				this.columnDepthCache[column] = ret;
			}else{
				this.columnDepthCache[column] = 0;
			}
		}
		return this.columnDepthCache[column];
	},

	getHiddenColumns:function(){
		var ret = [];
		for(var i=0;i<this.columnKeys.length;i++){
			if(this.isHidden(this.columnKeys[i])){
				ret.push(this.columnKeys[i]);
			}
		}
		return ret;
	},

	canBeMovedTo:function(column, to){
		return column !== to;
	}
});
ludo.grid.RowManager = new Class({
	Extends: ludo.Core,
	type : 'grid.RowManager',

	/**
	 * A function returning css class for current row as string. Current record
	 * will be passed to function
	 * @config renderer
	 * @type {Function}
	 * @default undefined
	 */
	renderer:undefined,

	ludoConfig:function(config){
		this.parent(config);
		if(config.renderer !== undefined)this.renderer = config.renderer;
	}

});
/**
 @namespace grid
 @class Grid
 @extends View
 @constructor
 @param {Object} config
 @example
	 children:[
	 ..
	 {
		  id:'myGrid',
		  type:'grid.Grid',
		  weight:1,
		  stateful:true,
		  resizable:false,
		  columnManager:{
			  columns:{
				  'country':{
					  heading:'Country',
					  removable:false,
					  sortable:true,
					  movable:true,
					  width:200,
					  renderer:function (val) {
						  return '<span style="color:blue">' + val + '</span>';
					  }
				  },
				  'capital':{
					  heading:'Capital',
					  sortable:true,
					  removable:true,
					  movable:true,
					  width:150
				  },
				  population:{
					  heading:'Population',
					  movable:true,
					  removable:true
				  }
			  }
		  },
		  dataSource:{
			  url:'data-source/grid.php',
			  id:'myDataSource',
			  paging:{
				  size:12,
				  pageQuery:false,
				  cache:false,
				  cacheTimeout:1000
			  },
			  searchConfig:{
				  index:['capital', 'country']
			  },
			  listeners:{
				  select:function (record) {
					  console.log(record)
				  },
				   count:function(countRecords){
					   ludo.get('gridWindowSearchable').setTitle('Grid - capital and population - Stateful (' + countRecords + ' records)');
				   }
			  }
		  }

	  }
 	...
 	]
 Is example of code used to add a grid as child view of another view. You may also create the grid directly using:

 @example
 	new ludo.grid.Grid({...})
 where {...} can be the same code as above. use the "renderTo" config property to specify where you want the grid to be rendered.
 */
ludo.grid.Grid = new Class({
	Extends:ludo.View,
	type:'Grid',

	hasMenu:true,
	colMovable:null,
	menu:true,

	menuConfig:[

	],

	scrollbar:{

	},
	/**
	 * true to highlight record on click
	 * @config highlightRecord
	 * @type {Boolean}
	 */
	highlightRecord:true,

	uniqueId:'',
	activeRecord:{},

	/**
	 * Show menu when mouse over headers
	 * @config headerMenu
	 * @type {Boolean}
	 * @default true
	 */
	headerMenu:true,

	/**
	 * True to highlight rows while moving mouse over them
	 * @config mouseOverEffect
	 * @type {Boolean}
	 * @default true
	 */
	mouseOverEffect:true,

	/**
	 * Column manager config object
	 * @config {grid.ColumnManager} columnManager
	 * @default undefined
	 */
	columnManager:undefined,
	/**
	 * Row manager config object
	 * @config {grid.RowManager} rowManager
	 * @default undefined
	 */
	rowManager:undefined,

	ludoConfig:function (config) {
		this.parent(config);

		if (config.headerMenu !== undefined)this.headerMenu = config.headerMenu;
		if (config.columnManager !== undefined)this.columnManager = config.columnManager;
		if (config.rowManager !== undefined)this.rowManager = config.rowManager;
		if (config.mouseOverEffect !== undefined)this.mouseOverEffect = config.mouseOverEffect;
		if (this.columnManager) {
			if (!this.columnManager.type)this.columnManager.type = 'grid.ColumnManager';
			this.columnManager.stateful = this.stateful;
			this.columnManager.id = this.columnManager.id || this.id + '_cm';
			this.columnManager = ludo._new(this.columnManager);
			this.columnManager.addEvent('hidecolumn', this.refreshData.bind(this));
			this.columnManager.addEvent('showcolumn', this.refreshData.bind(this));
			this.columnManager.addEvent('movecolumn', this.onColumnMove.bind(this));
			this.columnManager.addEvent('resize', this.resizeColumns.bind(this));
		}

		if (this.rowManager) {
			if (!this.rowManager.type)this.rowManager.type = 'grid.RowManager';
			this.rowManager = ludo._new(this.rowManager);
		}
		if (this.stateful && this.dataSource !== undefined && this.isObject(this.dataSource)) {
			this.dataSource.id = this.dataSource.id || this.id + '_ds';
			this.dataSource.stateful = this.stateful;
		}

		this.uniqueId = String.uniqueID();
		if (this.dataSource && !this.dataSource.type)this.dataSource.type = 'dataSource.Collection';
	},

	ludoDOM:function () {
		this.parent();
		ludo.dom.addClass(this.getEl(), 'ludo-grid-Grid');

		var b = this.getBody();
		var t = this.els.dataContainerTop = new Element('div');

		ludo.dom.addClass(t, 'ludo-grid-data-container');
		t.setStyles({
			'overflow':this.shouldUseTouchEvents() ? 'auto' : 'hidden',
			'position':'relative'
		});

		b.adopt(t);
		b.setStyle('overflow', 'visible');

		this.els.dataContainer = new Element('div');
		t.adopt(this.els.dataContainer);

		this.els.dataContainer.setStyle('position', 'relative');
		this.gridHeader = ludo._new({
			type:'grid.GridHeader',
			headerMenu: this.headerMenu,
			columnManager:this.columnManager,
			grid:this
		});
		this.createDataColumnElements();
		this.createScrollbars();
		this.createColResizeHandles();
	},

	ludoEvents:function () {
		this.parent();

		if (this.dataSource) {
			if(this.dataSourceObj && this.dataSourceObj.hasData()){
				this.populateData(this.dataSourceObj.getData());
			}
			var ds = this.getDataSource();
			ds.addEvent('change', this.populateData.bind(this));
			ds.addEvent('select', this.setSelectedRecord.bind(this));
			ds.addEvent('select', this.selectDOMForRecord.bind(this));
			ds.addEvent('deselect', this.deselectDOMForRecord.bind(this));
			ds.addEvent('update', this.showUpdatedRecord.bind(this));
			ds.addEvent('delete', this.removeDOMForRecord.bind(this));
		}
		var b = this.getBody();
		b.addEvent('selectstart', ludo.util.cancelEvent);
		b.addEvent('click', this.cellClick.bind(this));
		b.addEvent('dblclick', this.cellDoubleClick.bind(this));
		if (this.mouseOverEffect) {
			this.els.dataContainer.addEvent('mouseleave', this.mouseLeavesGrid.bind(this));
		}
	},

	ludoRendered:function () {
		this.parent();
		this.ifStretchHideLastResizeHandles();

		if (this.highlightRecord) {
			this.els.dataContainer.setStyle('cursor', 'pointer');
		}

		this.positionVerticalScrollbar.delay(100, this);

		if (this.getParent()) {
			this.getParent().getBody().setStyles({
				'padding':0
			});
			ludo.dom.clearCache();
			this.getParent().resize.delay(100, this.getParent());
		}
	},

	currentOverRecord:undefined,
	mouseoverDisabled:false,

	enterCell:function (el) {
		if (this.mouseoverDisabled)return;
		var record = this.getRecordByDOM(el);
		if (record) {
			if (this.currentOverRecord) {
				this.deselectDOMForRecord(this.currentOverRecord, 'ludo-grid-record-over');
			}
			this.currentOverRecord = record;
			this.selectDOMForRecord(record, 'ludo-grid-record-over');
		}
	},

	mouseLeavesGrid:function () {
		if (this.currentOverRecord) {
			this.deselectDOMForRecord(this.currentOverRecord, 'ludo-grid-record-over');
			this.currentOverRecord = undefined;
		}
	},

	cellClick:function (e) {
		var record = this.getRecordByDOM(e.target);
		if (record) {
			this.getDataSource().selectRecord(record);
			/**
			 * Click on record
			 * @event click
			 * @param Record clicked record
			 * @param Component this
			 * @param {Number} index of record
			 */
			this.fireEvent('click', record);
		}
	},

	setSelectedRecord:function (record) {
		this.fireEvent('selectrecord', record);
		this.highlightActiveRecord();
	},

	highlightActiveRecord:function () {
		if (this.highlightRecord) {
			var selectedRecord = this.getDataSource().getSelectedRecord();
			if (selectedRecord && selectedRecord.id) {
				this.selectDOMForRecord(selectedRecord, 'ludo-active-record');
			}
		}
	},

	selectDOMForRecord:function (record, cls) {
		cls = cls || 'ludo-active-record';
		var cells = this.getDOMCellsForRecord(record);
		for (var key in cells) {
			if (cells.hasOwnProperty(key)) {
				ludo.dom.addClass(cells[key], cls);
			}
		}
	},

	deselectDOMForRecord:function (record, cls) {
		cls = cls || 'ludo-active-record';
		var cells = this.getDOMCellsForRecord(record);
		for (var key in cells) {
			if (cells.hasOwnProperty(key)) {
				cells[key].removeClass(cls);
			}
		}
	},


	showUpdatedRecord:function (record) {
		var cells = this.getDOMCellsForRecord(record);
		var content;
		var renderer;

		for (var key in cells) {
			if (cells.hasOwnProperty(key)) {
				renderer = this.columnManager.getRendererFor(key);
				if (renderer) {
					content = renderer(record[key], record);
				} else {
					content = record[key];
				}
				cells[key].getElement('span').set('html', content);
			}
		}
	},

	removeDOMForRecord:function (record) {
		var cells = this.getDOMCellsForRecord(record);
		for (var key in cells) {
			if (cells.hasOwnProperty(key)) {
				cells[key].dispose();
			}
		}
	},

	getDOMCellsForRecord:function (record) {
		var ret = {};
		var div, divId;
		var keys = this.columnManager.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			var col = this.getBody().getElement('#ludo-grid-column-' + keys[i] + '-' + this.uniqueId);
			divId = 'cell-' + keys[i] + '-' + record.id + '-' + this.uniqueId;
			div = col.getElement('#' + divId);
			if (div) {
				ret[keys[i]] = div;
			}
		}
		return ret;
	},
	/**
	 Select a record.
	 @method selectRecord
	 @param {Object} record
	 @example
	 	grid.selectRecord({ id: 100 } );
	 */
	selectRecord:function (record) {
		if (!record.id) {
			record = { id:record };
		}
		this.getDataSource().selectRecord(record);
	},

	cellDoubleClick:function (e) {
		var record = this.getRecordByDOM(e.target);
		if (record) {
			this.getDataSource().selectRecord(record);
			/**
			 * Double click on record
			 * @event dblclick
			 * @param Record clicked record
			 * @param Component this
			 * @param {Number} index of record
			 */
			this.fireEvent('dblclick', record);
		}
	},

	getRecordByDOM:function (el) {
		el = document.id(el);
		if (!el.hasClass('ludo-grid-data-cell')) {
			el = el.getParent('.ludo-grid-data-cell');
		}
		if (el && el.hasClass('ludo-grid-data-cell')) {
			var uid = el.getProperty('uid');
			return this.getDataSource().findRecord({uid:uid});
		}
		return undefined;
	},

	isColumnDragActive:function () {
		return this.colMovable && this.colMovable.isActive();
	},

	hideResizeHandles:function () {
		this.colResizeHandler.hideAllHandles();
	},

	showResizeHandles:function () {
		this.colResizeHandler.showAllHandles();
		this.ifStretchHideLastResizeHandles();
	},

	resizeChildren:function () {
		this.parent();
		if (this.colResizeHandler && this.columnManager.hasLastColumnDynamicWidth()) {
			this.resizeColumns();
		}
	},

	onColumnMove:function (source, target, pos) {

		if (pos == 'before') {
			this.els.dataColumns[source].inject(this.els.dataColumns[target], 'before');
		} else {
			this.els.dataColumns[source].inject(this.els.dataColumns[target], 'after');
		}
		this.cssColumns();
		this.resizeColumns();

	},

	cssColumns:function () {
		var keys = Object.keys(this.els.dataColumns);
		for (var i = 0; i < keys.length; i++) {
			var c = this.els.dataColumns[keys[i]];
			c.removeClass('ludo-grid-data-last-column');
			c.removeClass('ludo-grid-data-last-column-left');
			c.removeClass('ludo-grid-data-column-left');
			c.removeClass('ludo-grid-data-last-column-center');
			c.removeClass('ludo-grid-data-column-center');
			c.removeClass('ludo-grid-data-last-column-right');
			c.removeClass('ludo-grid-data-column-right');
			ludo.dom.addClass(c, this.getColumnCssClass(keys[i]));
		}
	},

	refreshData:function () {
		if (!this.isRendered)return;
		this.createDataColumnElements();
		this.resizeColumns();
		this.populateData();
		this.showResizeHandles();
	},

	insertJSON:function () {

	},

	addRecord:function (record) {
		this.getDataSource().addRecord(record);
	},

	resizeDOM:function () {
		this.resizeColumns();
		if (!this.autoHeight) {
			var height = this.getHeight();
			height -= ludo.dom.getMBPH(this.els.container);
			height -= ludo.dom.getMBPH(this.els.body);
			height -= this.scrollbar.horizontal.getHeight();
			if (height < 0) {
				return;
			}
			this.els.body.style.height = height + 'px';
			this.cachedInnerHeight = height;
		}

		var contentSize = this.getBody().getSize();
		var contentHeight = contentSize.y;
		if (contentHeight == 0) {
			this.resizeDOM.delay(100, this);
			return;
		}
		this.els.dataContainerTop.setStyle('height', contentHeight - this.gridHeader.getHeight());

		this.scrollbar.vertical.resize();
		this.scrollbar.horizontal.resize();
	},

	createScrollbars:function () {
		this.scrollbar.horizontal = new ludo.Scroller({
			type:'horizontal',
			applyTo:this.getBody(),
			parent:this.getBody()

		});
		this.scrollbar.horizontal.getEl().inject(this.getBody(), 'after');

		this.scrollbar.vertical = new ludo.Scroller({
			type:'vertical',
			applyTo:this.els.dataContainer,
			parent:this.els.dataContainerTop,
			mouseWheelSizeCls:'ludo-grid-data-cell'
		});
		this.getEl().adopt(this.scrollbar.vertical.getEl());
		this.positionVerticalScrollbar();
	},

	positionVerticalScrollbar:function () {
		var top = this.gridHeader.getHeight();
		if (top == 0) {
			this.positionVerticalScrollbar.delay(100, this);
			return;
		}
		this.scrollbar.vertical.getEl().setStyle('top', top);
	},

	getColIndex:function (el) {
		var ret = el.getProperty('col-index');
		if (!ret && ret != '0') {
			ret = el.getParent().getProperty('col-index');
		}
		return ret;
	},

	sortBy:function (key) {
		this.getDataSource().sortBy(key);
	},

	createColResizeHandles:function () {
		this.colResizeHandler = new ludo.ColResize({
			component:this,
			listeners:{
				startresize:this.setResizePos.bind(this),
				resize:this.resizeColumn.bind(this)
			}
		});
		var keys = this.columnManager.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			var el = this.colResizeHandler.getHandle(keys[i], this.columnManager.isResizable(keys[i]));
			this.getBody().adopt(el);
			ludo.dom.addClass(el, 'ludo-grid-resize-handle');
		}
	},

	setResizePos:function (column) {
		this.colResizeHandler.setMinPos(this.columnManager.getMinPosOf(column));
		this.colResizeHandler.setMaxPos(this.columnManager.getMaxPosOf(column));
		this.mouseoverDisabled = true;
		this.mouseLeavesGrid();
	},

	mouseOverResizeHandle:function (e) {
		ludo.dom.addClass(e.target, 'ludo-grid-resize-handle-over');
	},
	mouseOutResizeHandle:function (e) {
		e.target.removeClass('ludo-grid-resize-handle-over');
	},

	resizeColumns:function () {
		this.mouseoverDisabled = false;
		var leftPos = 0;

		this.stretchLastColumn();
		var columns = this.columnManager.getLeafKeys();

		for (var i = 0; i < columns.length; i++) {
			if (this.columnManager.isHidden(columns[i])) {
				this.colResizeHandler.hideHandle(columns[i]);
			} else {
				var width = this.columnManager.getWidthOf(columns[i]);
				this.els.dataColumns[columns[i]].setStyles({
					'left':leftPos,
					'width':(width - ludo.dom.getPW(this.els.dataColumns[columns[i]]) - ludo.dom.getBW(this.els.dataColumns[columns[i]]))
				});

				this.columnManager.setLeft(columns[i], leftPos);

				leftPos += width;

				this.colResizeHandler.setPos(columns[i], leftPos);
				if (this.columnManager.isResizable(columns[i])) {
					this.colResizeHandler.showHandle(columns[i]);
				} else {
					this.colResizeHandler.hideHandle(columns[i]);
				}
			}
		}

		var totalWidth = this.columnManager.getTotalWidth();
		this.els.dataContainerTop.setStyle('width', totalWidth);
		this.scrollbar.horizontal.setContentSize(totalWidth);

	},

	stretchLastColumn:function () {
		if (this.columnManager.hasLastColumnDynamicWidth()) {

			this.columnManager.clearStretchedWidths();

			var totalWidth = this.columnManager.getTotalWidth();
			var viewSize = this.getBody().getCoordinates().width - ludo.dom.getPW(this.getBody()) - ludo.dom.getBW(this.getBody());
			var restSize = viewSize - totalWidth;
			if (restSize <= 0) {
				return;
			}
			var width = this.columnManager.getWidthOf(this.columnManager.getLastVisible()) + restSize;
			this.columnManager.setStretchedWidth(width)
		}
	},

	populateData:function () {
		this.fireEvent('state');
		this.currentOverRecord = undefined;
		this.currentData = this.getDataSource().getData();

		if (Browser.ie) {
			this.populateDataIE();
			return;
		}
		var contentHtml = [];
		var keys = this.columnManager.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			var columnId = 'ludo-grid-column-' + keys[i] + '-' + this.uniqueId;
			if (this.columnManager.isHidden(keys[i])) {
				contentHtml.push('<div id="' + columnId + '" class="ludo-grid-data-column" style="display:none"></div>');
			} else {
				contentHtml.push('<div id="' + columnId + '" col="' + keys[i] + '" class="ludo-grid-data-column ludo-grid-data-column-' + i + ' ' + this.getColumnCssClass(keys[i]) + '">' + this.getHtmlTextForColumn(keys[i]) + '</div>');
			}
		}
		this.els.dataContainer.set('html', contentHtml.join(''));

		var columns = this.els.dataContainer.getChildren('.ludo-grid-data-column');
		this.els.dataColumns = {};
		var count;
		for (i = 0, count = columns.length; i < count; i++) {
			this.els.dataColumns[columns[i].getProperty('col')] = columns[i];
		}

		this.fireEvent('renderdata', [this, this]);
		this.resizeColumns();
		this.resizeVerticalScrollbar();
		this.highlightActiveRecord();
	},

	getColumnCssClass:function (col) {
		var ret;
		if (this.columnManager.isLastVisibleColumn(col)) {
			ret = 'ludo-grid-data-last-column ludo-grid-data-last-column-';
		} else {
			ret = 'ludo-grid-data-column-';
		}
		ret += this.columnManager.getAlignmentOf(col);
		return ret;
	},

	populateDataIE:function () {
		this.els.dataContainer.set('html', '');
		this.createDataColumnElements();
		this.resizeColumns();
		var keys = this.columnManager.getLeafKeys();

		for (var i = 0; i < keys.length; i++) {
			if (this.columnManager.isHidden(keys[i])) {
				this.els.dataColumns[keys[i]].setStyle('display', 'none');
			} else {
				this.els.dataColumns[keys[i]].setStyle('display', '');
				this.els.dataColumns[keys[i]].set('html', this.getHtmlTextForColumn(keys[i]));
			}
		}
		this.resizeVerticalScrollbar();
		this.highlightActiveRecord();
	},

	resizeVerticalScrollbar:function () {
		var column = this.els.dataColumns[this.columnManager.getLastVisible()];
		if (!column) {
			return;
		}
		var height = column.getSize().y;
		if (height === 0) {
			this.resizeVerticalScrollbar.delay(300, this);
		} else {
			this.els.dataContainer.setStyle('height', height);
			this.scrollbar.vertical.setContentSize();
		}
	},

	createDataColumnElements:function () {
		this.els.dataColumns = {};
		var keys = this.columnManager.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			var el = new Element('div');
			ludo.dom.addClass(el, 'ludo-grid-data-column');
			el.setProperty('col', keys[i]);
			ludo.dom.addClass(el, this.getColumnCssClass(i));
			el.id = 'ludo-grid-column-' + keys[i] + '-' + this.uniqueId;
			this.els.dataContainer.adopt(el);
			this.els.dataColumns[keys[i]] = el;
		}
	},

	getHtmlTextForColumn:function (col) {
		var ret = [];
		var rowClasses = ['ludo-grid-data-odd-row', 'ludo-grid-data-even-row'];
		var content;
		var data = this.currentData;
		if (!data)return '';

		var renderer = this.columnManager.getRendererFor(col);

		var rowRenderer = this.rowManager ? this.rowManager.renderer : undefined;
		var rowCls = '';
		for (var i = 0, count = data.length; i < count; i++) {
			content = data[i][col];
			if (renderer) {
				content = renderer(content, data[i]);
			}
			var id = ['cell-' , col , '-' , data[i].id , '-' , this.uniqueId].join('');
			var over = '';
			if (this.mouseOverEffect) {
				over = ' onmouseover="ludo.get(\'' + this.id + '\').enterCell(this)"';
			}

			if (rowRenderer) {
				rowCls = rowRenderer(data[i]);
				if (rowCls)rowCls = ' ' + rowCls;
			}
			ret.push('<div id="' + id + '" ' + over + ' class="ludo-grid-data-cell ' + (rowClasses[i % 2]) + rowCls + '" uid="' + data[i].uid + '"><span class="ludo-grid-data-cell-text">' + content + '</span></div>');
		}
		return ret.join('');
	},

	resizeColumn:function (col, resizedBy) {
		this.columnManager.increaseWithFor(col, resizedBy);
	},

	ifStretchHideLastResizeHandles:function () {
		if (this.columnManager.hasLastColumnDynamicWidth()) {
			this.colResizeHandler.hideHandle(this.columnManager.getLastVisible());
		}
	},

	scrollBy:function (x, y) {
		if (y) {
			this.scrollbar.vertical.scrollBy(y);
		}
		if (x) {
			this.scrollbar.horizontal.scrollBy(x);
		}
	},

	getSelectedRecord:function () {
		return this.getDataSource().getSelectedRecord();
	},
	getColumnManager:function () {
		return this.columnManager;
	}
});
/**
 * @namespace form
 * @class Element
 * @extends View
 * @description Super class for form components.
 */
ludo.form.Element = new Class({
	Extends:ludo.View,
	label:'',
	value:'',
	remote:{
		isJSON:true
	},

	onLoadMessage:'',

	autoHeight:true,
	/**
	 * Width of label
	 * @attribute labelWidth
	 * @default 100
	 */
	labelWidth:100,
	/**
	 * "name" is inherited from ludo.View. It will also be set as name of input element
	 * @attribute name
	 * @type string
	 * @default undefined
	 */
	name:undefined,
	/**
	 * Width of input element
	 * @attribute fieldWidth
	 * @type int
	 * @default undefined
	 */
	fieldWidth:undefined,
	data:null,
	/**
	 * Custom class name to apply to input element
	 * @attribute formCls
	 * @type string
	 * @default undefined
	 */
	formCls:undefined,
	/**
	 * Custom CSS rules to apply to input element
	 * @attribute formCss
	 * @type Object, example: { border : '1px solid #000' }
	 * @default undefined
	 */
	formCss:undefined,
	elementId:undefined,
	/**
	 * Let input field use all remaining space of the component
	 * @attribute stretchField
	 * @type {Boolean}
	 * @default true
	 */
	stretchField:true,
	fieldConfig:{},

	/**
	 * On focus, auto select text of input field.
	 * @attribute selectOnFocus
	 * @type {Boolean}
	 * @default false
	 */
	selectOnFocus:false,

	/**
	 * Is a value required for this field
	 * @attribute required
	 * @type {Boolean}
	 * @default false
	 */
	required:false,
	dirtyFlag:false,
	initialValue:undefined,
	constructorValue:undefined,
	/**
	 * Is form element ready for setValue. For combo boxes and select boxes it may
	 * not be ready until available values has been loaded remotely
	 * @property isReady
	 * @type {Boolean}
	 * @private
	 */
	isReady:true,
	overflow:'hidden',

	/**
	 * Will not validate unless value is the same as value of the form element with this id
	 * Example of use: Password and Repeat password. It's sufficient to specify "twin" for one of
	 * the views.
	 * @property twin
	 * @type String
	 * @default undefined
	 */
	twin:undefined,

	/**
	 * Link with a form component with this id. Value of these components will always be the same
	 * Update one and the other component will be updated automatically. It's sufficient
	 * to specify linkWith for one of the two views.
	 * @property linkWith
	 * @type String
	 * @default undefined
	 */
	linkWith:undefined,

	/**
	 * When using stateful:true, value will be preserved to next visit.
	 * @property statefulProperties
	 * @type Array
	 * @default ['value']
	 */
	statefulProperties:['value'],

	/**
	 Object of class form.validator.* or a plain validator function
	 When set the isValid method of the validator will be called after standard validation is complete
	 and form element is valid.
	 @property validator
	 @type Object
	 @example
	 	validator : { type : 'form.validator.Md5', value : 'MD5 hash of something' }
	 In order to validate this field, the MD5 of form field value must match form.validator.Md5.value
	 @example
	 	validator:function(value){
	 		return value === 'Valid value';
	 	}
	 is example of simple function used as validator.
	 */
	validator:undefined,
	validatorFn:undefined,

	ludoConfig:function (config) {

		this.parent(config);

		this.label = config.label || this.label;
		this.formCss = config.formCss || this.formCss;

		var defaultConfig = this.getInheritedFormConfig();
		this.labelWidth = defaultConfig.labelWidth || this.labelWidth;
		this.fieldWidth = defaultConfig.fieldWidth || this.fieldWidth;
		this.formCls = defaultConfig.formCls || this.formCls;
		this.formCss = defaultConfig.formCss || this.formCss;
		this.elementId = defaultConfig.elementId || this.elementId;
		if (defaultConfig.height && config.height === undefined) {
			this.height = defaultConfig.height;
			this.autoHeight = false;
		}
		if(config.validator !== undefined)this.validator = config.validator;
		if (this.validator !== undefined) {
			this.createValidator();
		}
		if (config.stretchField !== undefined)this.stretchField = config.stretchField;
		if (config.required !== undefined)this.required = config.required;
		if (config.selectOnFocus !== undefined) this.selectOnFocus = config.selectOnFocus;
		if (config.required !== undefined) this.required = config.required;
		if (config.twin !== undefined) this.twin = config.twin;
		if (config.disabled !== undefined) this.disabled = config.disabled;

		if (config.linkWith !== undefined) {
			this.setLinkWith(config.linkWith);
		}

		this.labelWidth = config.labelWidth || this.labelWidth;
		this.fieldWidth = config.fieldWidth || this.fieldWidth;

		this.elementId = config.elementId || this.elementId;
		this.value = config.value || this.value;
		this.initialValue = this.constructorValue = this.value;
		if (!this.name) {
			this.name = 'ludo-form-el-' + String.uniqueID();
		}
		this.data = config.data || null;

		config.fieldConfig = config.fieldConfig || {};
		this.fieldConfig.value = config.fieldConfig.value || 'value';
		this.fieldConfig.text = config.fieldConfig.text || 'text';

		if (this.dataSource) {
			this.isReady = false;
			this.getDataSource().addEvent('load', this.setReady.bind(this));
		}

		ludo.Form.add(this);
	},

	createValidator:function(){
		if(ludo.util.isFunction(this.validator)){
			this.validatorFn = this.validator;
		}else{
			this.validator.applyTo = this;
			this.validator = ludo._new(this.validator);
			this.validatorFn = this.validator.isValid;
		}
	},

	ludoEvents:function () {
		this.parent();

		var formEl = this.getFormEl();

		if (formEl) {
			formEl.addEvent('keydown', this.keyDown.bind(this));
			formEl.addEvent('keypress', this.keyPress.bind(this));
			formEl.addEvent('keyup', this.keyUp.bind(this));
			formEl.addEvent('focus', this.focus.bind(this));
			formEl.addEvent('change', this.change.bind(this));
			formEl.addEvent('blur', this.blur.bind(this));
		}
		if (this.data) {
			this.populate(this.data);
		}
		if (this.selectOnFocus) {
			formEl.addEvent('focus', this.selectText.bind(this));
		}
	},

	ludoRendered:function () {
		this.parent();

		if (this.getFormEl()) {
			this.getFormEl().setProperty('name', this.getName());
		}
		if(this.disabled)this.disable();

		if (this.value && this.els.formEl) {
			this.els.formEl.set('value', this.value);
		}
		this.validate();
		var parentFormManager = this.getParentFormManager();
		if (parentFormManager) {
			parentFormManager.registerFormElement(this);
		}
		if (this.linkWith) {
			this.setLinkWithOfOther();
		}
	},
	/**
	 * Disable form element
	 * @method disable
	 * @return void
	 */
	disable:function () {
		this.getFormEl().setProperty('disabled', '1');
		ludo.dom.addClass(this.els.label, 'ludo-form-label-disabled');
	},
	/**
	 * Enable form element
	 * @method enable
	 * @return void
	 */
	enable:function () {
		this.getFormEl().removeProperty('disabled');
		this.els.label.removeClass('ludo-form-label-disabled');
	},

	getInheritedFormConfig:function () {
		var cmp = this.getParent();
		if (cmp) {
			return cmp.formConfig || {};
		}
		return {};
	},

	selectText:function () {
		this.getFormEl().select();
	},

	ludoDOM:function () {
		this.parent();
	},

	ludoCSS:function () {
		this.parent();
		this.getEl().addClass('ludo-form-element');
		if (this.els.formEl) {
			if (this.fieldWidth && this.getFormEl()) {
				this.els.formEl.setStyle('width', this.fieldWidth - ludo.dom.getPW(this.getFormEl()) - ludo.dom.getBW(this.getFormEl()));
			}
			if (this.formCls) {
				this.els.formEl.addClass(this.formCls);
			}
			if (this.elementId) {
				this.els.formEl.id = this.elementId;
			}
			if (this.formCss) {
				this.els.formEl.setStyles(this.formCss);
			}
		}
	},

	getFormElId:function () {
		if (!this.elementId) {
			this.elementId = 'ludo-form-el-' + String.uniqueID();
		}
		return this.elementId;
	},

	getWidth:function () {
		var ret = this.parent();
		if (!ret) {
			ret = this.fieldWidth;
			if (this.label) {
				ret += this.labelWidth;
			}
			ret += 2;

		}
		return ret;
	},

	keyUp:function (e) {
		/**
		 * key up event
		 * @event key_up
		 * @param key
		 * @param value of form field
		 * @param Component this
		 */
		this.fireEvent('key_up', [ e.key, this.getValue(), this ]);
	},

	keyDown:function (e) {
		/**
		 * key down event
		 * @event key_down
		 * @param key
		 * @param value of form field
		 * @param Component this
		 */
		this.fireEvent('key_down', [ e.key, this.getValue(), this ]);
	},

	keyPress:function (e) {
		/**
		 * key press event
		 * @event key_press
		 * @param key
		 * @param value of form field
		 * @param Component this
		 */
		this.fireEvent('key_press', [ e.key, this.getValue(), this ]);
	},

	focus:function () {
		this._focus = true;
		this.clearInvalid();
		/**
		 * On focus event
		 * @event focus
		 * @param value of form field
		 * @param Component this
		 */
		this.fireEvent('focus', [ this.getValue(), this ]);
	},
	change:function () {
		if (this.els.formEl) {
			this.setValue(this.els.formEl.get('value'));
		}

		/**
		 * On change event. This event is fired when value is changed manually
		 * by the user via GUI. The "change" event is followed by a
		 * "valueChange" event.
		 * When value is changed using the setValue method
		 * only the "valueChange" event is fired.
		 *
		 * @event change
		 * @param value of form field
		 * @param Component this
		 */
		if(this.wasValid)this.fireEvent('change', [ this.getValue(), this ]);
	},

	blur:function () {
		this._focus = false;
		this.validate();

		if(this.getFormEl())this.value = this.getFormEl().value;
		if (this.getValue() !== this.initialValue) {
			/**
			 * @event dirty
			 * @description event fired on blur when value is different from it's original value
			 * @param {String} value
			 * @param {Object} ludo.form.* component
			 */
			this.setDirty();
			this.fireEvent('dirty', [this.getValue(), this]);
		} else {
			/**
			 * @event clean
			 * @description event fired on blur when value is equal to original/start value
			 * @param {String} value
			 * @param {Object} ludo.form.* component
			 */
			this.setClean();
			this.fireEvent('clean', [this.getValue(), this]);
		}
		/**
		 * On blur event
		 * @event blur
		 * @param value of form field
		 * @param Component this
		 */
		this.fireEvent('blur', [ this.getValue(), this ]);
	},

	hasFocus:function () {
		return this._focus;
	},
	insertJSON:function (json) {
		this.populate(json.data);
	},
	populate:function () {

	},
	getLabel:function () {
		return this.label;
	},
	/**
	 * Return current value
	 * @method getValue
	 * @return string
	 */
	getValue:function () {
		return this.value;
	},
	/**
	 * Set new value
	 * @method setValue
	 * @param value
	 * @return void
	 */
	setValue:function (value) {
		if (!this.isReady) {
			this.setValue.delay(50, this, value);
			return;
		}

		if (value == this.value) {
			return;
		}
		if (this.els.formEl && this.els.formEl.value !== value) {
			this.els.formEl.set('value', value);
		}

		this.value = value;

		this.validate();

		if(this.wasValid){
			/**
			 * This event is fired whenever current value is changed, either
			 * manually by user or by calling setValue. When the value is changed
			 * manually by user via GUI, the "change" event is fired first, then
			 * "valueChange" afterwards.
			 * @event valueChange
			 * @param {Object|String|Number} value
			 * @param {form.Element} form component
			 */
			this.fireEvent('valueChange', [value, this]);
			if(this.stateful)this.fireEvent('state');
			if (this.linkWith)this.updateLinked();
		}
	},

	/**
	 * Get reference to input element
	 * @method getFormEl
	 * @return DOMElement
	 */
	getFormEl:function () {
		return this.els.formEl;
	},
	/**
	 * Is form input valid
	 * @method isValid
	 * @return {Boolean}
	 */
	isValid:function () {
		if (this.twin) {
			var cmp = ludo.get(this.twin);
			if (cmp && this.getValue() !== cmp.getValue()) {
				return false;
			}
		}
		if (this.validatorFn) {
			return this.validatorFn.call(this.validator, this.getValue());
			// return this.validator.isValid(this.getValue());
		}
		return true;
	},

	clearInvalid:function () {
		var el = this.getFormEl();
		if (el) {
			el.removeClass('ludo-form-el-invalid');
		}
	},

	wasValid:true,

	validate:function () {
		this.clearInvalid();
		if (this.isValid()) {
			this.wasValid = true;
			/**
			 * Event fired when value of form component is valid. This is fired on blur
			 * @event valid
			 * @param {String} value
			 * @param {Object} component
			 */
			this.fireEvent('valid', [this.getValue(), this]);
		} else {
			this.wasValid = false;
			/**
			 * Event fired when value of form component is valid. This is fired on blur
			 * @event invalid
			 * @param {String} value
			 * @param {Object} component
			 */
			this.fireEvent('invalid', [this.getValue(), this]);
		}
	},

	isFormElement:function () {
		return true;
	},

	/**
	 * Returns initial value sent to constructor
	 * @method getInitialValue
	 * @return string initial value
	 */
	getInitialValue:function () {
		return this.initialValue;
	},

	/**
	 * Reset / Roll back to last committed value. It could be the value stored by last commit method call
	 * or if the original value/default value of this field.
	 * @method reset
	 * @return void
	 */
	reset:function () {
		this.setValue(this.initialValue);
	},

	/**
	 * Reset value back to the original value sent(constructor value)
	 * @method clear
	 * @return void
	 */
	clear:function () {
		this.setValue(this.constructorValue);
	},

	/**
	 * Update initial value to current value. These actions will always trigger a commit<br>
	 * - Form or Model submission
	 * - Fetching new record for a ludo.model.Model
	 * @method commit
	 * @return void
	 */
	commit:function () {
		this.initialValue = this.value;
	},
	/**
	 * Returns true if current value is different from original value
	 * @method isDirty
	 * @return {Boolean} isDirty
	 */
	isDirty:function () {
		return this.dirtyFlag;
	},

	setDirty:function () {
		this.dirtyFlag = true;
		this.getEl().addClass('ludo-form-el-dirty');
	},

	setClean:function () {
		this.dirtyFlag = false;
		this.getEl().removeClass('ludo-form-el-dirty');
	},

	setReady:function () {
		this.isReady = true;
	},

	updateLinked:function () {
		var cmp = ludo.get(this.linkWith);
		var val = this.value;
		if (cmp.value !== val) {
			cmp.setValue(val);
		}
	},

	setLinkWith:function (linkWith) {
		this.linkWith = linkWith;
		this.addEvent('valueChange', this.updateLinked.bind(this));
	},

	setLinkWithOfOther:function (attempts) {
		attempts = attempts || 0;
		var cmp = ludo.get(this.linkWith);
		if (cmp && !cmp.linkWith) {
			if (!this.getValue())this.setValue(cmp.value);
			cmp.setLinkWith(this.id);
		} else {
			if (attempts < 100) {
				this.setLinkWithOfOther.delay(50, this, attempts + 1);
			}
		}
	}
});
/**
 * Button component
 * @namespace form
 * @class Button
 * @extends form.Element
 *
 */
ludo.form.Button = new Class({
    Extends:ludo.form.Element,
    type:'form.Button',
    defaultSubmit:false,
    inputType:'submit',
    cssSignature:'ludo-form-button',
    name:'',
    /**
     * Text of button
     * @attribute {String} value
     */
    value:'',
    els:{
        el:null,
        txt:null
    },
    component:null,

    menu:undefined,

    /**
     * Toggle button
     * @attribute {Boolean} toggle
     * @default false
     */
    toggle:false,

    /**
     * Assign button to a toggleGroup
     * Example:
     * var buttonLeft = new ludo.form.Button({
     * value : 'left',
     * toggle:true,
     * toggleGroup:'alignment'
     * });
     *
     * var buttonCenter = new ludo.form.Button({
     * value : 'center',
     * toggle:true,
     * toggleGroup:'alignment'
     * });
     *
     * which creates a singleton ludo.form.ToggleGroup instance and
     * assign each button to it.
     *
     * When using a toggle group, only one button can be turned on. The toggle
     * group will automatically turn off the other button.
     *
     * You can create your own ludo.form.ToggleGroup by extending
     * ludo.form.ToggleGroup and set the toggleGroup property to an
     * object:
     *
     * var buttonLeft = new ludo.form.Button({
     *  value: 'left',
     *  toggle:true,
     *  toggleGroup:{
     *      type : 'ludo.myapp.form.MyToggleGroup'
     *  }
     *
     * });
     *
     * @attribute {Object} toggleGroup
     * @default undefined
     */
    toggleGroup:undefined,

    /**
     * Disable button when form of parent component is invalid
     * @attribute {Boolean} disableOnInvalid
     * @default false
     */
    disableOnInvalid:false,

    /**
     * True to initially disable button
     * @attribute {Boolean} disabled
     * @default false
     */
    disabled:false,
    /**
     * Is this button by default selected
     * When parent component is displayed, it will call select() method for first selected button. If no buttons
     * have config param selected set to true, it will select first SubmitButton.
     * @attribute {Boolean} selected
     * @default false
     */
    selected:false,

    overflow:'hidden',
    autoHeight:false,

    /**
     * Path to button icon
     * @attribute {String} icon
     * @default undefined
     */
    icon:undefined,

    active:false,

    ludoConfig:function (config) {
        var val = config.value || this.value;
        config.width = config.width || this.width || Math.max(val.length * 10, 80);
        config.weight = undefined;
        this.parent(config);

        if (config.menu !== undefined)this.menu = config.menu;
        if (config.icon !== undefined)this.icon = config.icon;
        if (config.toggle !== undefined)this.toggle = config.toggle;
        if (config.disableOnInvalid !== undefined)this.disableOnInvalid = config.disableOnInvalid;
        this.defaultSubmit = config.defaultSubmit || false;
        this.disabled = config.disabled || this.disabled;
        if (config.selected !== undefined) this.selected = config.selected;

        if (config.toggleGroup !== undefined) {
            if (ludo.util.type(config.toggleGroup) === 'String') {
                config.toggleGroup = {
                    type:'form.ToggleGroup',
                    id:'toggleGroup-' + config.toggleGroup
                };
            }
            config.toggleGroup.singleton = true;
            this.toggleGroup = ludo._new(config.toggleGroup);
            this.toggleGroup.addButton(this);
        }
    },


    ludoDOM:function () {
        this.parent();

        this.getEl().style.display = this.isHidden() ? 'none' : 'block';

        this.addLeftEdge();
        this.addRightEdge();

        this.addLabel();

        if (this.icon) {
            this.addIcon();
        }

        var b = this.getBody();

        // b.style.height = this.buttonHeight + 'px';
        b.setStyle('padding-left', 0);
        this.getEl().addEvent('selectstart', ludo.util.cancelEvent);
    },

    ludoEvents:function () {
        this.parent();
        var el = this.getBody();

        el.addEvent('click', this.click.bind(this));
        el.addEvent('mouseenter', this.mouseOver.bind(this));
        el.addEvent('mouseleave', this.mouseOut.bind(this));
        el.addEvent('mousedown', this.mouseDown.bind(this));
        document.body.addEvent('mouseup', this.mouseUp.bind(this));
        if (this.defaultSubmit) {
            document.id(window).addEvent('keypress', this.keyPress.bind(this));
        }
    },

    ludoRendered:function () {
        this.parent();
        if (this.disabled) {
            this.disable();
        }
        if (this.toggle && this.active) {
            this.getBody().addClass('ludo-form-button-pressed');
        }

        this.component = this.getParentComponent();

        if(this.component && this.disableOnInvalid){
            this.component.getFormManager().addEvent('valid', this.enable.bind(this));
            this.component.getFormManager().addEvent('invalid', this.disable.bind(this));
        }
    },

    addLabel:function () {
        var txt = this.els.txt = new Element('div');
        ludo.dom.addClass(txt, 'ludo-form-button-value');
        txt.setStyles({
            'width':'100%',
            'position':'absolute',
            'left':this.icon ? '25px' : '0px',
            'text-align':this.icon ? 'left' : 'center',
            'z-index':7
        });
        txt.set('html', this.value);
        this.getBody().adopt(txt);
    },

    addIcon:function () {
        var el = this.els.icon = new Element('div');
        el.setStyles({
            position:'absolute',
            width:'25px',
            'z-index':8,
            left:0,
            top:0,
            height:'100%',
            'background-image':'url(' + this.icon + ')',
            'background-repeat':'no-repeat',
            'background-position':'center center'
        });
        el.inject(this.els.txt, 'before');
    },

    setIcon:function(src){
        if(!this.els.icon){
            this.addIcon();
        }
        this.icon = src;
        this.els.icon.setStyle('background-image', 'url(' + src + ')');
    },

    addLeftEdge:function () {
        var bg = this.els.buttonLeftludo = new Element('div');
        ludo.dom.addClass(bg, 'ludo-form-button-bg-left');
        bg.setStyles({
            position:'absolute',
            'left':0,
            'z-index':5
        });
        this.getBody().adopt(bg);
    },

    addRightEdge:function () {
        var bg = new Element('div');
        ludo.dom.addClass(bg, 'ludo-form-button-bg-right');
        bg.setStyles({
            position:'absolute',
            'right':0,
            'z-index':6
        });
        this.getBody().adopt(bg);
    },

    disable:function () {
        this.disabled = true;
        if (this.els.body) {
            ludo.dom.addClass(this.els.body, 'ludo-form-button-disabled');
            this.els.body.removeClass('ludo-form-button-over');
            this.els.body.removeClass('ludo-form-button-down');
        }
    },

    enable:function () {
        this.disabled = false;
        if (this.els.body) {
            this.els.body.removeClass('ludo-form-button-disabled');
        }
    },

    isDisabled:function () {
        return this.disabled;
    },

    setValue:function (value) {
        this.value = value;
        this.els.txt.set('html', value);
    },
    getValue:function () {
        return this.value;
    },

    mouseOver:function () {
        if (!this.isDisabled()) {
            this.getBody().addClass('ludo-form-button-over');
            this.fireEvent('mouseover', this);
        }
    },
    mouseOut:function () {
        if (!this.isDisabled()) {
            this.getBody().removeClass('ludo-form-button-over');
            this.fireEvent('mouseout', this);
        }

    },
    mouseDown:function () {
        if (!this.isDisabled()) {
            this.getBody().addClass('ludo-form-button-down');
            this.fireEvent('mousedown', this);
        }
    },
    mouseUp:function () {
        if (!this.isDisabled()) {
            this.getBody().removeClass('ludo-form-button-down');
            this.fireEvent('mouseup', this);
        }
    },

    clickAfterDelay:function () {
        this.click.delay(10, this);
    },
    /**
     * Trigger click on button
     * @method click
     * @return {undefined|Boolean}
     */
    click:function () {
        this.focus();
        if (!this.isDisabled()) {
            this.getEl().focus();
            /**
             * Click on button event
             * @event click
             * @param {String} value, i.e. label of button
             * @param Component this
             */
            this.fireEvent('click', [this.getValue(), this]);

            if (this.toggle) {
                if (!this.active) {
                    this.turnOn();
                } else {
                    this.turnOff();
                }
            }
			return false;
        }
    },
    getName:function () {
        return this.name;
    },
    defaultBeforeClickEvent:function () {
        return true;
    },

    isButton:function () {
        return true
    },
    resizeDOM:function () {
        /* No DOM resize for buttons */
    },

    validate:function () {
        /* Don't do anything for buttons */
    },

    getParentComponent:function () {
        var parent = this.getParent();
        if (parent && parent.type.indexOf('ButtonBar') >= 0) {
            return parent.getView();
        }
        return parent;
    },

    select:function () {
        this.getBody().addClass('ludo-form-button-selected');
    },

    deSelect:function () {
        this.getBody().removeClass('ludo-form-button-selected');
    },

    turnOn:function () {
        this.active = true;
        /**
         * Turn toggle button on
         * @event on
         * @param {String} value, i.e. label of button
         * @param Component this
         */
        this.fireEvent('on', [this.getValue(), this]);
        this.getBody().addClass('ludo-form-button-pressed');
    },

    turnOff:function () {
        this.active = false;
        /**
         * Turn toggle button off
         * @event off
         * @param {String} value, i.e. label of button
         * @param Component this
         */
        this.fireEvent('off', [this.getValue(), this]);
        this.getBody().removeClass('ludo-form-button-pressed');
    },

    /**
     * Return instance of ludo.form.ToggleGroup
     * @method getToggleGroup
     * @return {Object} ludo.form.ToggleGroup
     */
    getToggleGroup:function () {
        return this.toggleGroup;
    },

    isActive:function () {
        return this.active;
    }
});
/**
 * Special Button for card.Deck component
 * @namespace card
 * @class Button
 * @extends form.Button
 */
ludo.card.Button = new Class({
    Extends:ludo.form.Button,
    type:'card.Button',

    component:undefined,
    /**
     * Automatically hide button instead of disabling it. This will happen on
     * first cards for previous buttons and on last card for next and finish buttons.
     * @attribute autoHide
     * @type {Boolean}
     * @default false
     */
    autoHide:false,

    /**
     * Apply button to a specific view with this id. This view has to have layout type set to "card".
     * @attribute applyTo
     * @type String
     * @default undefined
     */
    applyTo : undefined,

    ludoConfig:function (config) {
        this.parent(config);
        if (config.autoHide !== undefined)this.autoHide = config.autoHide;
        if (config.applyTo !== undefined){
            this.component = ludo.get(config.applyTo);
        }else{
            this.component = this.getParentComponent();
        }

		if(this.component)this.component.getLayoutManager().registerButton(this);
        this.addButtonEvents();
    },

    getParentComponent:function () {
        var cmp = this.parent();
        if (cmp.layout === undefined || (cmp.layout.type!=='card')) {
            for (var i = 0; i < cmp.children.length; i++) {
                if (cmp.children[i].layout && cmp.children[i].layout.type==='card') {
                    return cmp.children[i];
                }
            }
        }
        return cmp.layout && cmp.layout.type === 'card' ? cmp : undefined;
    }
});
/**
 * Special Button for card.Deck component
 * This button will automatically be disabled when a form is invalid, and automatically enabled when it's valid.
 * A form consists of all form elements of parent component, including form elements of child components.
 * When clicked, it will submit the form of card.Deck.
 *
 * A ludo.card.FinishButton will only be visible when last card in the deck is shown.
 *
 * @namespace card
 * @class FinishButton
 * @extends card.Button
 */
ludo.card.FinishButton = new Class({
    Extends:ludo.card.Button,
    type:'card.FinishButton',
    value:'Finish',
    hidden:true,

    addButtonEvents:function(){
		var lm;
        if (this.component) {
			var lm = this.component.getLayoutManager();
            lm.addEvent('valid', this.enable.bind(this));
            lm.addEvent('invalid', this.disable.bind(this));
			this.component.addEvent('beforesubmit', this.disable.bind(this));

            lm.addEvent('lastcard', this.show.bind(this));
            lm.addEvent('notlastcard', this.hide.bind(this));

            if(!lm.isValid()){
                this.disabled = true;
            }
        }
        this.addEvent('click', this.submit.bind(this));

        if(lm && lm.isOnLastCard()){
            this.show();
        }
    },

    enable:function(){
        if(this.component.getLayoutManager().isValid()){
            this.parent();
        }
    },

    submit:function () {
        if (this.component) {
            this.component.submit();
        }
    }
});
/**
 * Special Button for card.Deck used to navigate to next card.
 * This button will automatically be disabled when a form is invalid, and automatically enabled when it's valid.
 * A form consists of all form elements of parent component, including form elements of child components.
 * When clicked, next card will be shown
 *
 * @namespace card
 * @class NextButton
 * @extends card.Button
 */
ludo.card.NextButton = new Class({
	Extends:ludo.card.Button,
	type:'card.NextButton',
	value:'Next',

	addButtonEvents:function () {
		if (this.component) {
			var lm = this.component.getLayoutManager();
			lm.addEvent('valid', this.enable.bind(this));
			lm.addEvent('invalid', this.disable.bind(this));
			if (!lm.isValid()) {
				this.disable();
			}
			if (this.autoHide) {
				if (lm.isOnLastCard())this.hide(); else this.show();
				lm.addEvent('lastcard', this.hide.bind(this));
				lm.addEvent('notlastcard', this.show.bind(this));
			} else {
				if (lm.isOnLastCard())this.disable(); else this.enable();
				lm.addEvent('lastcard', this.disable.bind(this));
				lm.addEvent('notlastcard', this.enable.bind(this));
			}
		}

		this.addEvent('click', this.nextCard.bind(this));
	},

	enable:function () {
		if (this.component.getLayoutManager().isValid()) {
			this.parent();
		}
	},

	nextCard:function () {
		if (this.component) {
			this.component.getLayoutManager().showNextCard();
		}
	}
});
/**
 *
 * @namespace card
 * @class PreviousButton
 * @extends card.Button
 * @description Special Button for card.Deck component for navigation to previous card.
 * On click, this button will show previous card.
 * The button will be automatically disabled when first card in deck is shown.
 * When clicked, next card will be shown
 */
ludo.card.PreviousButton = new Class({
	Extends:ludo.card.Button,
	type:'card.PreviousButton',
	value:'Previous',
	disabled:true,

	addButtonEvents:function () {
		this.addEvent('click', this.showPreviousCard.bind(this));
		if (this.component) {
			var lm = this.component.getLayoutManager();
			if (this.autoHide) {
				if(!lm.isOnFirstCard())this.show(); else this.hide();
				lm.addEvent('firstcard', this.hide.bind(this));
				lm.addEvent('notfirstcard', this.show.bind(this));
			} else {
				if(!lm.isOnFirstCard())this.enable(); else this.disable();
				lm.addEvent('firstcard', this.disable.bind(this));
				lm.addEvent('notfirstcard', this.enable.bind(this));
			}
		}
	},

	showPreviousCard:function () {
		if (this.component) {
			this.component.getLayoutManager().showPreviousCard();
		}
	}
});
/**
 * Data source for progress bars
 * @namespace progress
 * @class DataSource
 * @extends dataSource.JSON
 */
ludo.progress.DataSource = new Class({
    Extends:ludo.dataSource.JSON,
    type:'progress.DataSource',
    singleton:true,
    autoload:false,
    progressId:undefined,
    stopped : false,
    pollFrequence : 1,
    /**
     * Reference to parent component of status bar
     * @property object Component
     */
    component:undefined,
    requestId:'getProgress',

    ludoConfig:function(config){
        this.parent(config);
        if(config.pollFrequence !== undefined)this.pollFrequence = config.pollFrequence;
        this.component = config.component;
        this.component.addEvent('beforesubmit', this.startProgress.bind(this));
    },

    startProgress:function(){
        this.stopped = false;
        this.fireEvent('start');
        this.load.delay(1000, this);
    },

    loadComplete:function (json) {
        this.fireEvent('load', json);

        if(json.data.percent<100 && !this.stopped){
            this.load.delay(this.pollFrequence * 1000, this);
        }else{
            if(json.data.percent>=100){
                this.finish();
            }
        }
    },

    getNewProgressBarId:function(){
        this.progressId = undefined;
        return this.getProgressId();
    },

    getProgressId:function(){
        if(!this.progressId){
            this.progressId = 'ludo-progress-' + String.uniqueID();
            this.setPostParam('progressBarId', this.getProgressId());
        }

        return this.progressId;
    },

    stop:function(){
        this.stopped = true;
        this.fireEvent('stop');
    },

    proceed : function(){
        this.stopped = false;
        this.load();
    },

    finish:function(){
        this.stopped = true;
        this.progressId = undefined;
        this.fireEvent('finish');
    }
});
/**
 * Super class for all progress bar views
 * @namespace progress
 * @class Base
 * @extends View
 */
ludo.progress.Base = new Class({
    Extends:ludo.View,
    component:undefined,
    pollFrequence:1,
    url:undefined,

    /**
     * Hide progress bar on finish
     * @attribute {Boolean} hideOnFinish
     */
    hideOnFinish:true,

    ludoConfig:function (config) {
        this.parent(config);
        if (config.component !== undefined)this.component = config.component;
        if (config.pollFrequence !== undefined)this.pollFrequence = config.pollFrequence;
        if (config.hideOnFinish !== undefined)this.hideOnFinish = config.hideOnFinish;

        if (!this.component) {
            this.component = this.getParent();
        }
        this.dataSource = {
            url:this.getUrl(),
            type:'progress.DataSource',
            pollFrequence:this.pollFrequence,
            component:this.component
        };

        this.component.addEvent('beforesubmit', this.show.bind(this));

        this.getDataSource().addEvent('load', this.insertJSON.bind(this));
        this.getDataSource().addEvent('start', this.start.bind(this));
        if (this.hideOnFinish) {
            this.getDataSource().addEvent('finish', this.hideAfterDelay.bind(this));
        }
        this.getDataSource().addEvent('finish', this.finishEvent.bind(this));
    },

    start:function(){
        this.insertJSON({text:'',percent:0});
    },

    hideAfterDelay:function(){
        this.hide.delay(1000, this);
    },

    getProgressBarId:function () {
        return this.getDataSource().getProgressId();
    },

    stop:function () {
        this.getDataSource().stop();
    },

    proceed:function(){
        this.getDataSource().proceed();
    },
    /**
     * Finish progress bar manually
     * @method finish
     */
    finish:function () {
        this.getDataSource().finish();
    },

    finishEvent:function(){
        /**
         * Event fired when progress bar is finished
         * @event render
         * @param Component this
         */
        this.fireEvent('finish');
    }
});
/**
 * Progress bar class
 * @namespace progress
 * @class Bar
 * @extends progress.Base
 */
ludo.progress.Bar = new Class({
    Extends:ludo.progress.Base,
    type:'ProgressBar',
    width:300,
    height:35,
    progressBarWidth:0,
    currentPercent:0,
    stopped:false,
    hidden:true,
    fx:undefined,

    ludoConfig:function (config) {
        this.parent(config);
    },

    ludoRendered:function () {
        this.parent();

        this.createBackgroundForProgressBar();
        this.createMovablePartOfProgressBar();
        this.createTextElement();

        this.autoSetProgressWidth();
    },
    createBackgroundForProgressBar:function () {
        var el = this.els.progressBg = new Element('div');
        ludo.dom.addClass(el, 'ludo-Progress-Bar-Bg');
        this.getBody().adopt(el);

        var left = this.els.progressBgRight = new Element('div');
        ludo.dom.addClass(left, 'ludo-Progress-Bar-Bg-Left');
        el.adopt(left);

        var right = this.els.progressBgRight = new Element('div');
        ludo.dom.addClass(right, 'ludo-Progress-Bar-Bg-Right');
        el.adopt(right);
    },

    createMovablePartOfProgressBar:function () {
        var el = this.els.progress = new Element('div');
        ludo.dom.addClass(el, 'ludo-Progress-Bar');
        this.els.progressBg.adopt(el);
        this.els.progress.setStyle('width', '0px');

        var left = this.els.progressLeft = new Element('div');
        ludo.dom.addClass(left, 'ludo-Progress-Bar-Left');
        el.adopt(left);

        var right = this.els.progressRight = new Element('div');
        ludo.dom.addClass(right, 'ludo-Progress-Bar-Right');
        el.adopt(right);
    },

    createTextElement:function () {
        var percent = this.els.percent = new Element('div');
        ludo.dom.addClass(percent, 'ludo-Progress-Bar-Percent');
        this.els.progressBg.adopt(percent);
    },


    resizeDOM:function () {
        this.parent();
        if (this.els.progressBg) {
            this.autoSetProgressWidth();
        }
    },

    insertJSON:function (json) {
        var data = json.data ? json.data : json;
        this.setPercent(data.percent);
    },

    startProgress:function () {
        this.parent();
        this.stopped = false;
        this.setPercent(0);
        this.els.progress.style.width = '0px';
        this.currentPercent = 0;
    },

    finish:function () {
        this.parent();
        this.setPercent(100);
    },

    autoSetProgressWidth:function () {
        if (!this.isVisible()) {
            return;
        }
        var width = parseInt(this.getBody().getStyle('width').replace('px', ''));
        width -= ludo.dom.getMW(this.els.progressBg);
        this.setProgressBarWidth(width);
        this.setPercent(this.currentPercent);
    },

    setProgressBarWidth:function (width) {
        if (isNaN(width)) {
            return;
        }
        this.progressBarWidth = width;
        this.els.progressBg.setStyle('width', width);

        this.progressBarWidth = width;
    },

    setPercent:function (percent) {
        if(percent == this.currentPercent)return;
        this.getFx().start({
            width: [this.currentPercent, percent]
        });
        this.currentPercent = percent;
        //this.els.progress.style.width = size + 'px';
        this.els.percent.innerHTML = percent + '%';
    },

    getCurrentPercent:function () {
        return this.currentPercent;
    },

    animate:function () {
        if (this.currentPercent < 100) {
            this.currentPercent++;
            this.setPercent(this.currentPercent);
            this.animate.delay(50, this);
        }
    },

    getFx:function () {
        if (this.fx === undefined) {
            this.fx = new Fx.Morph(this.els.progress, {
                duration:100,
                unit : '%'
            });

        }
        return this.fx;
    }
});
/**
 * Progress bar for cards in a deck. percentage will be position of current curd
 * relative to number of cards
 * @namespace card
 * @class ProgressBar
 * @extends progress.Bar
 */
ludo.card.ProgressBar = new Class({
    Extends: ludo.progress.Bar,
    hidden:false,
	applyTo:undefined,
    ludoConfig:function(config){
        this.parent(config);
		if(config.applyTo!==undefined)this.applyTo = config.applyTo;
        this.component = this.getParentComponent();
		if(this.component)this.component.getLayoutManager().registerButton(this);
    },
    ludoEvents:function(){
        this.parent();
        this.component.getLayoutManager().addEvent('showcard', this.setCardPercent.bind(this))
    },
    ludoRendered:function(){
        this.parent();
        this.setCardPercent();
    },
    setCardPercent:function(){
        this.setPercent(this.component.getLayoutManager().getPercentCompleted());
    },
    getParentComponent:function () {
		if(this.applyTo)return ludo.get(this.applyTo);
        var cmp = this.getParent();
        if (cmp.type.indexOf('ButtonBar') >= 0) {
            cmp = cmp.getView();
        }
        if (!cmp.layout || cmp.layout.type!=='card') {
            for (var i = 0; i < cmp.children.length; i++) {
                if (cmp.children[i].layout.type === 'card') {
                    return cmp.children[i];
                }
            }
        }
        return cmp;
    },

    getProgressBarId:function(){
        return undefined;
    }
});
/**
 * Base class for calendar related classes
 * @namespace calendar
 * @module calendar
 * @class Base
 */
ludo.calendar.Base = new Class({
    Extends: ludo.View,
    months : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    monthsLong:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    days:['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    headerWeek : 'Week',


    ludoConfig:function(config){
        this.parent(config);
        this.date = new Date();
    },
    setDate:function (date) {
        this.date = date;
    },
    getDate:function(){
        return this.date;
    },

    sendSetDateEvent:function(){
        this.fireEvent('setdate', [this.date, this]);
    },

    setValue:function(){

    }
});

/**
 * @namespace calendar
 * @class Calendar
 * @extends calendar.Base
 * @type {Class}
 */
ludo.calendar.Calendar = new Class({
    Extends:ludo.calendar.Base,
    layout:{
		type:'linear',
		orientation:'vertical'
	},

    value:undefined,
    children:[
        { type:'calendar.NavBar', name:'info'},
        // { type:'calendar.MonthYearSelector', name:'monthyear'},
        { type:'calendar.Days', name:'days'},
        // { type:'calendar.YearSelector', name:'year'},
        { type:'calendar.Today', name:'today'}
    ],
    /**
     * @attribute inputFormat
     * @type String
     * @default Y-m-d
     */
    inputFormat:'Y-m-d',

    /**
     * Initial date, example: '2012-02-28', "date" is alias to "value"
     * @attribute date
     * @type String
     */
    date:undefined,

    /**
     * minimum valid date, eg. '2011-01-01'
     * @attribute {String} minDate
     */
    minDate:undefined,
    /**
     * maximum valid date, eg. '2013-01-01'
     * @attribute maxDate
     * @type String
     */
    maxDate:undefined,

    ludoConfig:function (config) {
        this.parent(config);
        if (config.inputFormat !== undefined)this.inputFormat = config.inputFormat;
        if(config.value !== undefined)config.date = config.value;
        if (config.date !== undefined) {
            this.date = Date.parse(config.date);
        } else {
            this.date = new Date();
        }
        this.value = this.date;
        if (config.minDate !== undefined)this.minDate = config.minDate;
        if (config.maxDate !== undefined)this.maxDate = config.maxDate;

        if (this.minDate)this.minDate = Date.parse(this.minDate);
        if (this.maxDate)this.maxDate = Date.parse(this.maxDate);
    },

    /**
     * Set year (4 digits)
     * @method setYear
     * @param {Number} year
     *
     */
    setYear:function (year) {
        this.date.set('year', year);
        this.setDate(this.date);
    },

    setDate:function(date, sentByComponent){
        this.date = date;
        for(var i=0;i<this.children.length;i++){
            if(!sentByComponent || this.children[i].id!==sentByComponent.id){
                this.children[i].setDate(this.date);
            }
        }
    },

    /**
     * Returns selected date as Date object
     * @method getDate
     * @return {Object} selected date
     */
    getDate : function(){
        return this.value;
    },
    /**
     * Returns selected date
     * @method getValue
     * @return {String} selected date
     */
    getValue:function(){
        return this.value.format(this.inputFormat);
    },
    /**
     * Set new current date
	 * @method setValue
     * @param Date new date
     */
    setValue:function(date){
        this.value = date;
        this.fireEvent('change', [this.getValue(), this]);
    },

    /**
     * Set current month
	 * @method setMonth
     * @param {Number} month (1-12)
	 * @return void
     */
    setMonth:function (month) {
        month = month - 1;
        this.date.set('month', month);
        this.setDate(this.date);
    },

    ludoRendered:function () {
        this.parent();
        for(var i=0;i<this.children.length;i++){
            this.children[i].setDate(this.date);
            this.children[i].setValue(this.date);
            this.children[i].addEvent('setdate', this.setDate.bind(this));
            this.children[i].addEvent('change', this.setValue.bind(this));
        }
		this.getLayoutManager().resize();
    }
});
/**
 * Class used to display days in a month
 * @namespace calendar
 * @class Days
 * @extends calendar.Base
 */
ludo.calendar.Days = new Class({
    Extends:ludo.calendar.Base,
    layout:{
		weight:1
	},
    date:undefined,
    colWidthFirst:16,
    colWidthRest:12,
    showWeeks:true,
    sundayFirst:false,
    overflow:'hidden',
    week:undefined,
    /**
     * selected date
     * @property object value
     */
    value:undefined,
    touchData:{
        enabled:false
    },

    ludoRendered:function () {
        this.parent();
        this.createCalendarHeader();
        this.createCalendarView();
    },
    ludoDOM:function () {
        this.parent();
        this.getBody().addClass('ludo-calendar-view');
    },
    ludoEvents:function () {
        this.parent();
        if (this.shouldUseTouchEvents()) {
            var el = this.getBody();
            el.addEvent('touchstart', this.touchStart.bind(this));
            this.getEventEl().addEvent('touchmove', this.touchMove.bind(this));
            this.getEventEl().addEvent('touchend', this.touchEnd.bind(this));
        }
    },


    touchStart:function (e) {
        this.touchData = {
            enabled:true,
            x1:e.page.x, x2:e.page.x,
            y1:e.page.y, y2:e.page.y
        };

        if(e.target.tagName.toLowerCase() == 'window'){
            return false;
        }
    },
    touchMove:function (e) {
        if (this.touchData.enabled) {
            this.touchData.x2 = e.page.x;
            this.touchData.y2 = e.page.y;

            var left = this.touchData.x2 - this.touchData.x1;
            var top = this.touchData.y2 - this.touchData.y1;

            if (Math.abs(left) > Math.abs(top)) {
                if (left > 100)left = 100;
                if (left < -100) left = -100;
                this.els.monthView.style.left = left + 'px';
                this.els.monthView.style.top = '0px';
            } else {
                if (top > 100)top = 100;
                if (top < -100) top = -100;
                this.els.monthView.style.top = top + 'px';
                this.els.monthView.style.left = '0px';
            }
            return false;
        }
    },
    touchEnd:function () {
        if (this.touchData.enabled) {
            this.touchData.enabled = false;
            var diffX = this.touchData.x2 - this.touchData.x1;
            var diffY = this.touchData.y2 - this.touchData.y1;

            var absX = Math.abs(diffX);
            var absY = Math.abs(diffY);

            if (absX > 100 || absY > 100) {
                if (absX > absY) {
                    if (diffX > 0) {
                        this.date.decrement('month', 1);
                    } else {
                        this.date.increment('month', 1);
                    }
                } else {
                    if (diffY > 0) {
                        this.date.decrement('year', 1);
                    } else {
                        this.date.increment('year', 1);
                    }
                }
                this.sendSetDateEvent();
                this.showMonth();
            }
            this.els.monthView.style.left = '0px';
            this.els.monthView.style.top = '0px';
        }

    },
    createCalendarHeader:function () {
        var el = this.els.daysHeader = new Element('div');
        ludo.dom.addClass(el, 'ludo-calendar-header');
        this.getBody().adopt(el);

        var html = ['<table cellpadding="0" cellspacing="0" border="0" width="100%">'];
        html.push(this.getColGroup().join(''));
        html.push('<tr>');
        var headers = this.getTextForHeader();
        for (var i = 0; i < headers.length; i++) {
            html.push('<td>' + headers[i] + '</td>');
        }
        html.push('</tr>');
        html.push('</table>');
        el.set('html', html.join(''));
    },

    resizeDOM:function () {
        if (!this.els.daysContainer) {
            this.resizeDOM.delay(10, this);
            return;
        }
        this.parent();
        var b = this.getBody();
        var h = this.els.daysHeader;
        var size = b.getSize();

        var height = size.y - ludo.dom.getBH(b) - ludo.dom.getPH(b);
        height -= h.getSize().y;
        height += ludo.dom.getMH(h);

        var c = this.els.daysContainer;
        height -= (ludo.dom.getMH(c) + ludo.dom.getPH(c) + ludo.dom.getBH(c));
        c.style.height = height + 'px';
    },

    getColGroup:function () {
        var html = [];
        html.push('<colgroup>');
        html.push('<col width="' + this.colWidthFirst + '%">');
        for (var i = 0; i < 7; i++) {
            html.push('<col width="' + this.colWidthRest + '%">');
        }
        html.push('</colgroup>');
        return html;
    },

    getTextForHeader:function () {
        var ret = [this.headerWeek];
        if (this.sundayFirst) {
            ret.push(this.days[this.days.length - 1]);
            ret = ret.append(this.days.slice(0, this.days.length - 1));

        } else {
            ret = ret.append(this.days);
        }
        return ret;
    },

    createCalendarView:function () {
        var el = this.els.daysContainer = new Element('div');
        ludo.dom.addClass(el, 'ludo-calendar-container-days');
        el.setStyles({
            position:'relative',
            width:'100%',
            overflow:'hidden',
            left:0,
            top:0
        });
        el.addEvent('mousemove', this.mouseOverDays.bind(this));
        el.addEvent('mouseleave', this.removeClsFromMouseOverDay.bind(this));
        this.getBody().adopt(el);
    },
    showMonth:function () {
        if (this.els.monthView) {
            this.els.monthView.dispose();
        }

        var el = this.els.monthView = new Element('div');
        el.addEvent('click', this.selectDay.bind(this));
        ludo.dom.addClass(el, 'ludo-calendar-body-days');
        el.style.height = '100%';
        this.resizeMonthView();
        el.style.position = 'absolute';

        this.els.daysContainer.adopt(el);

        var html = ['<table cellpadding="0" cellspacing="0" border="0" width="100%" style="height:100%">'];
        html.push(this.getColGroup().join(''));

        var days = this.getDaysForView();
        var cls = '';

        var selectedDay = 0;
        if (this.isDisplayingMonthForCurrentValue()) {
            selectedDay = this.value.get('date');
        }
        var today = 0;
        if (this.isDisplayingTodaysMonth()) {
            today = new Date().get('date');
        }
        var thisMonthStarted = false;
        var nextMonthStarted = false;
        for (var i = 0; i < days.length; i++) {
            cls = '';
            if (i % 8 == 0) {
                if (i)html.push('</tr>');
                html.push('<tr>');
                cls = 'calendar-week';
            } else {
                if (days[i] == 1 && thisMonthStarted)nextMonthStarted = true;
                if (days[i] == 1)thisMonthStarted = true;
                cls = 'calendar-day';
                if (!thisMonthStarted || nextMonthStarted) {
                    cls = cls + ' calendar-day-inactive';
                } else {
                    if (this.sundayFirst && (i - 1) % 8 == 0) {
                        cls = cls + ' calendar-sunday';
                    }
                    if (!this.sundayFirst && (i + 1) % 8 == 0) {
                        cls = cls + ' calendar-sunday';
                    }
                    if (days[i] == selectedDay) {
                        cls = cls + ' calendar-day-selected';
                    }
                    if (days[i] == today) {
                        cls = cls + ' calendar-day-today';
                    }
                    cls = cls + ' calendar-day-' + days[i];
                }
            }

            html.push('<td');
            html.push(' class="' + cls + '"');
            html.push('>' + days[i] + '</td>')
        }

        html.push('</table>');
        el.set('html', html.join(''));
        this.resizeMonthView.delay(20, this);

    },

    mouseOverDays:function (e) {
        var el = e.target;
        this.removeClsFromMouseOverDay();
        if (!el.hasClass('calendar-day') || el.hasClass('calendar-day-inactive')) {
            return;
        }
        ludo.dom.addClass(el, 'calendar-day-mouse-over');
        this.els.mouseOverDay = el;
    },

    removeClsFromMouseOverDay:function () {
        if (this.els.mouseOverDay) {
            this.els.mouseOverDay.removeClass('calendar-day-mouse-over');
            this.els.mouseOverDay = undefined;
        }
    },

    isDisplayingMonthForCurrentValue:function () {
        if (!this.value) {
            return;
        }
        return this.value.get('month') == this.date.get('month') && this.value.get('year') == this.date.get('year');
    },
    isDisplayingTodaysMonth:function () {
        var today = new Date();
        return today.get('month') == this.date.get('month') && today.get('year') == this.date.get('year');
    },
    resizeMonthView:function () {
        this.els.monthView.style.width = '100%';
    },

    getDaysForView:function () {
        var ret = [];
        var thisMonth = this.date.clone();
        thisMonth.setDate('1');

        var lastMonth = thisMonth.clone().decrement('day', 1);
        var daysInMonth = thisMonth.getLastDayOfMonth();

        var dayOfWeek = thisMonth.getUTCDay();

        if (this.sundayFirst) {
            dayOfWeek++;
            if (dayOfWeek > 6)dayOfWeek = 0;
        }
        var i;
        if (dayOfWeek > 0 || daysInMonth < 31) {
            this.setStartWeek(lastMonth.get('week'));
            var daysInLastMonth = lastMonth.getLastDayOfMonth();
            var count = dayOfWeek || 7;
            ret.push(this.getNextWeek());
            for (i = count - 1; i > 0; i--) {
                ret.push(daysInLastMonth - i);
            }
            if (ret.length % 8 == 0) {
                ret.push(this.getNextWeek());
            }
        } else {
            this.setStartWeek(thisMonth.get('week'));
            ret.push(this.getNextWeek());
        }

        for (i = 1; i <= daysInMonth; i++) {
            ret.push(i);
            if (ret.length % 8 == 0) {
                ret.push(this.getNextWeek());
            }
        }
        var len = ret.length;
        for (i = ret.length; i < 48; i++) {

            if (ret.length < 48) {
                if (ret.length % 8 == 0) {
                    ret.push(this.getNextWeek());
                }
                ret.push(i - len + 1);
            }
        }
        return ret;
    },

    selectDay:function (e) {
        var el = e.target;
        if (!el.hasClass('calendar-day')) {
            el = el.getParent('.calendar-day');
            if (!el)return;
        }
        if (el.hasClass('calendar-day-inactive')) {
            return;
        }
        this.removeClsFromSelectedDay();

        ludo.dom.addClass(el, 'calendar-day-selected');
        this.value = this.date.clone();
        this.value.set('date', el.get('html'));
        this.fireEvent('change', [this.value, this]);
    },

    removeClsFromSelectedDay:function () {
        if (this.els.monthView && this.isDisplayingMonthForCurrentValue()) {
            var el = this.els.monthView.getElement('.calendar-day-' + this.value.get('date'));
            if (el)el.removeClass('calendar-day-selected');
        }
    },

    addClsForSelectedDay:function () {
        if (this.els.monthView && this.isDisplayingMonthForCurrentValue()) {
            var el = this.els.monthView.getElement('.calendar-day-' + this.value.get('date'));
            if (el)ludo.dom.addClass(el, 'calendar-day-selected');
        }
    },

    setStartWeek:function (week) {
        this.week = week;
    },

    getNextWeek:function () {
        var ret = this.week;
        this.week++;
        if (this.week > 50 && this.date.get('month') == 0) {
            this.week = 1;
        } else if (this.week > 53) {
            this.week = 1;
        }
        return ret;
    },
    /**
     * Set currently viewed month
	 * @method setDate
     * @param {Object} date
	 * @return void
     */
    setDate:function (date) {
        this.date = date;
        this.showMonth();
    },
    /**
     * Set selected date
	 * @method setValue
     * @param Date
     */
    setValue:function (date) {
        this.removeClsFromSelectedDay();
        this.value = date.clone();
        this.addClsForSelectedDay();
    }
});
/**
 * Displays nav-buttons for previous month and year to the left, a calendar.MonthYearSelector in the center and buttons for next month and next year to the right.
 * @namespace calendar
 * @class NavBar
 * @extends calendar.Base
 */
ludo.calendar.NavBar = new Class({
    Extends:ludo.calendar.Base,
    type:'calendar.NavBar',
    height:20,
    date:undefined,
    layout:'cols',
    cls:'ludo-calendar-info-panel',

    children:[
        { type:'form.TinyButton', value:'<<', name:'previousyear', width:25},
        { type:'form.TinyButton', value:'<', name:'previous', width:25},
        { weight:1, name:'info', type:'calendar.MonthYearSelector' },
        { type:'form.TinyButton', name:'next', value:'>', width:25 },
        { type:'form.TinyButton', name:'nextyear', value:'>>', width:25 }
    ],

    ludoRendered:function () {
        this.parent();
        this.child['previous'].addEvent('click', this.goToPreviousMonth.bind(this));
        this.child['next'].addEvent('click', this.goToNextMonth.bind(this));
        this.child['nextyear'].addEvent('click', this.goToNextYear.bind(this));
        this.child['previousyear'].addEvent('click', this.goToPreviousYear.bind(this));
    },
    goToPreviousMonth:function () {
        this.setDate(this.date.decrement('month', 1));
        this.sendSetDateEvent();
    },
    goToNextMonth:function () {
        this.setDate(this.date.increment('month', 1));
        this.sendSetDateEvent();
    },

    goToPreviousYear:function () {
        this.setDate(this.date.decrement('year', 1));
        this.sendSetDateEvent();
    },

    goToNextYear:function () {
        this.setDate(this.date.increment('year', 1));
        this.sendSetDateEvent();
    },


    setDate:function (date) {
        this.date = date;
        this.showDate();
        this.child['info'].setDate(date);
    },

    sendDate:function (date) {
        this.date = date;
        this.sendSetDateEvent();
    },

    showDate:function () {
        this.child['info'].addEvent('setdate', this.sendDate.bind(this));
    }
});
/**
 * Super class for year and month-selectors
 * @namespace calendar
 * @class Selector
 * @extends calendar.Base
 */
ludo.calendar.Selector = new Class({
    Extends:ludo.calendar.Base,
    height:25,
    date:undefined,
    minDate:undefined,
    maxDate:undefined,

    minDisplayedYear:undefined,
    maxDisplayedYear:undefined,
    fx:undefined,
    offsetOptions:13,
    calCls:'ludo-calendar-year-container',

    ludoConfig:function (config) {
        this.parent(config);
        this.els.options = [];
    },

    ludoRendered:function () {
        this.parent();
        this.createOptionsContainer();
        this.fx = new Fx.Tween(this.els.calendarContainer, {
            duration:200
        });
        this.renderOptions();
        this.autoResize();
    },

    createOptionsContainer:function () {
        var el = this.els.calendarContainer = new Element('div');
        el.addClass(this.calCls);
        el.setStyles({
            position:'absolute', width:'3000px', left:0, top:0
        });
        this.getBody().adopt(el);
    },
    autoResize:function () {
        var height = this.els.calendarContainer.getSize().y;
        height += ludo.dom.getMH(this.els.calendarContainer);
        var b = this.getBody();
        var c = this.getEl();
        height += ludo.dom.getBH(b) + ludo.dom.getMH(b) + ludo.dom.getPH(b);
        height += ludo.dom.getBH(c) + ludo.dom.getMH(c) + ludo.dom.getPH(c);
        this.height = height;

    },

    resizeDOM:function () {
        this.parent();
        if (this.els.activeOption) {
            this.animateDomToCenter(this.els.activeOption);
        }
    },

    removeOptions:function () {
        for (var i = 0; i < this.els.options.length; i++) {
            this.els.options[i].dispose();
        }
        this.els.options = [];
    },

    centerDom:function (domEl) {
        domEl.getParent().style.marginLeft = this.getCenterPos(domEl) + 'px';
    },

    animateDomToCenter:function (domEl) {
        if(domEl && domEl.getParent()){
            this.fx.start('margin-left', domEl.getParent().style.marginLeft, this.getCenterPos(domEl));
        }
    },

    getCenterPos:function (domEl) {
        var bodyWidth = this.getBody().clientWidth;
        var offset = domEl.offsetLeft;
        var elWidth = domEl.getSize().x;
        var left = bodyWidth / 2 - offset - elWidth / 2;
        return Math.round(left);
    },

    setMinDate:function (date) {
        this.minDate = date;
    },

    setMaxDate:function (date) {
        this.maxDate = date;
    }
});
/**
 * Class used to select month for a calendar.
 * @namespace calendar
 * @class MonthSelector
 * @extends calendar.Base
 * @type {Class}
 */
ludo.calendar.MonthSelector = new Class({
    Extends: ludo.calendar.Base,
    height:25,


    ludoRendered:function(){
        this.parent();
        this.createMonthContainer();
        this.renderMonths();
        this.autoResize();
    },
    autoResize:function(){
        var height = this.els.monthContainer.getSize().y;
        height += ludo.dom.getMH(this.els.monthContainer);
        var b = this.getBody();
        var c = this.getEl();
        height += ludo.dom.getBH(b) + ludo.dom.getMH(b) + ludo.dom.getPH(b);
        height += ludo.dom.getBH(c) + ludo.dom.getMH(c) + ludo.dom.getPH(c);
        this.height = height;

    },
    createMonthTooltip:function(){
        var el = this.els.monthTip = new Element('div');
        el.setStyles({
            'position' : 'absolute',
            display:'none'
        });
        ludo.dom.addClass(el, 'ludo-calendar-month-tip');
        ludo.dom.addClass(el, 'ludo-calendar-month');
        el.addEvent('click', this.clickMonth.bind(this));
        this.els.monthContainer.adopt(el);
    },

    createMonthContainer:function(){
        var el = this.els.monthContainer = new Element('div');
        ludo.dom.addClass(el, 'ludo-calendar-month-container');
        el.setStyles({
            position:'absolute', width : '3000px', left:0,top:0
        });
        this.getBody().adopt(el);
    },

    renderMonths:function(){
        this.els.monthContainer.set('html', '');
        this.createMonthTooltip();
        var month = this.date.get('month');

        for(var i=0;i<this.months.length;i++){
            var el = new Element('div');
            ludo.dom.addClass(el, 'ludo-calendar-month');
            el.setProperty('month', i);
            this.els.monthContainer.adopt(el);

            if(i==month){
                ludo.dom.addClass(el, 'ludo-calendar-month-selected');
                el.set('html', '<span>' + this.months[i] + '</span>');
                el.addEvent('mouseenter', this.hideTooltip.bind(this));
            }else{
                el.addEvent('mouseenter', this.showTooltip.bind(this));

                el.setProperty('title', this.months[i]);
                ludo.dom.addClass(el, 'ludo-calendar-month-inactive');
            }
            el.addEvent('click', this.clickMonth.bind(this));
        }
        this.els.monthContainer.addEvent('mouseleave', this.hideTooltip.bind(this));
    },

    clickMonth:function(e){
        var el = this.getMonthEl(e.target);
        this.setMonth(el.getProperty('month'));
        this.sendSetDateEvent();

    },

    setDate:function(date){
        this.parent(date);
        this.renderMonths();
    },
    showTooltip:function(e){
        var el = this.getMonthEl(e.target);
        this.els.monthTip.setProperty('month', el.getProperty('month'));
        var month = this.months[el.getProperty('month')];
        this.els.monthTip.set('html', month);
        this.els.monthTip.style.left = Math.max(0, el.offsetLeft) + 'px';
        this.els.monthTip.style.display = '';

    },
    hideTooltip:function(){
        this.els.monthTip.style.display='none';
    },
    getMonthEl:function(dom){
        if(!dom.hasClass('ludo-calendar-month'))dom = dom.getParent('.ludo-calendar-month');
        return dom;
    }
});
/**
 * Display "Today" button inside a calendar. When clicked, date of calendar will be set to today's date.
 * @namespace calendar
 * @class Today
 * @extends calendar.Base
 */
ludo.calendar.Today = new Class({
    Extends:ludo.calendar.Base,
    layout : 'cols',
    height:25,
    css:{
        'margin-top' : 2
    },
    children : [{ weight:1 }, { name:'today', type:'form.Button', value : 'Today'}, { weight:1 }],

    ludoRendered:function(){
        this.parent();
        this.child['today'].addEvent('click', this.setToday.bind(this));
    },

    setDate:function(){
        // this.date is always todays date which is set in ludoConfig
    },
    setToday:function(){
        this.date = new Date();
        this.sendSetDateEvent();
    }

});
/**
 * Class used to display years in a calendar
 * @namespace calendar
 * @class YearSelector
 * @extends calendar.Selector
 */
ludo.calendar.YearSelector = new Class({
    Extends:ludo.calendar.Selector,
    minDisplayedYear:undefined,
    maxDisplayedYear:undefined,

    resizeDOM:function () {
        this.parent();
        if (this.els.activeOption) {
            this.animateDomToCenter(this.els.activeOption);
        }
    },

    renderOptions:function () {
        this.removeOptions();
        this.els.activeOption = undefined;
        var year = this.date.get('year');
        for (var i = year - this.offsetOptions; i < year + this.offsetOptions; i++) {
            var el = this.getDomForAYear(i);
            this.els.calendarContainer.adopt(el);
            this.els.options.push(el);
        }
        this.setMinAndMaxDisplayed();

    },

    setMinAndMaxDisplayed:function () {
        this.minDisplayedYear = this.date.clone().decrement('year', this.offsetOptions).get('year');
        this.maxDisplayedYear = this.date.clone().increment('year', this.offsetOptions).get('year');
    },

    getDomForAYear:function (year) {
        var el = new Element('div');
        el.set('html', '<span>' + year + '</span>');
        el.setProperty('year', year);
        ludo.dom.addClass(el, 'ludo-calendar-year');
        if (year == this.date.get('year')) {
            ludo.dom.addClass(el, 'ludo-calendar-year-selected');
            this.els.activeOption = el;
        }
        el.addEvent('click', this.clickYear.bind(this));
        return el;
    },

    clickYear:function (e) {
        var el = e.target;
        if (!el.hasClass('ludo-calendar-year'))el = el.getParent('.ludo-calendar-year');
        this.date.set('year', el.getProperty('year'));
        this.setDate(this.date);
        this.sendSetDateEvent();
    },

    setDate:function (date) {
        this.date = date;
        this.addAndRemoveOptions();
        if (this.els.activeOption) {
            this.centerDom(this.els.activeOption);
            this.els.activeOption.removeClass('ludo-calendar-year-selected');
        }
        this.els.activeOption = this.getDomElForCurrentYear();
        if (this.els.activeOption) {
            ludo.dom.addClass(this.els.activeOption, 'ludo-calendar-year-selected');
            this.animateDomToCenter.delay(20, this, this.els.activeOption);
        }
    },

    addAndRemoveOptions:function () {
        var year = this.date.get('year');
        var median = Math.round((this.maxDisplayedYear + this.minDisplayedYear) / 2);
        if (year < this.minDisplayedYear || year > this.maxDisplayedYear) {
            this.renderOptions();
        }
        else if (year < median) {
            this.insertYearsBefore(median - year);
        } else if (year > median) {
            this.insertYearsAfter(year - median);
        }

        this.setMinAndMaxDisplayed();
    },
    insertYearsBefore:function (count) {
        var els = [];
        for (var i = count; i > 0; i--) {
            var year = this.minDisplayedYear - i;
            var el = this.getDomForAYear(year);
            el.inject(this.els.options[0], 'before');
            els.push(el);
            this.els.options[this.els.options.length - 1].dispose();
            this.els.options.length--;
        }
        this.els.options = els.append(this.els.options);
    },
    insertYearsAfter:function (count) {
        for (var i = 1; i <= count; i++) {
            var year = this.maxDisplayedYear + i;
            var el = this.getDomForAYear(year);
            this.els.calendarContainer.adopt(el);
            this.els.options.push(el);
            this.els.options[i - 1].dispose();
        }
        this.els.options = this.els.options.slice(count);
    },

    getDomElForCurrentYear:function () {
        var year = this.date.get('year');
        for (var i = 0; i < this.els.options.length; i++) {
            if (this.els.options[i].getProperty('year') == year) {
                return this.els.options[i];
            }
        }
    }
});
/**
* Class used to select month and year for a calendar.
* @namespace calendar
* @class MonthYearSelector
* @extends calendar.Selector
*/
ludo.calendar.MonthYearSelector = new Class({
    Extends:ludo.calendar.Selector,
    height:25,
    minDisplayed:undefined,
    maxDisplayed:undefined,
    fx:undefined,
    date:undefined,
    calCls : 'ludo-calendar-month-year-container',

    renderOptions:function () {
        this.removeOptions();
        this.els.activeOption = undefined;
        for (var i = this.offsetOptions*-1; i <= this.offsetOptions; i++) {
            var el = this.getDomForAMonth(i);
            this.els.calendarContainer.adopt(el);
            this.els.options.push(el);
        }
        this.setMinAndMaxDisplayed();
    },

    setMinAndMaxDisplayed:function () {
        var d = this.date.clone();
        this.minDisplayed = d.decrement('month', this.offsetOptions);
        d = this.date.clone();
        this.maxDisplayed = d.increment('month', this.offsetOptions);
    },

    getDomForAMonth:function (monthFromCurrent) {
        var d = this.date.clone().increment('month', monthFromCurrent);
        var txt = this.months[d.get('month')];
        var el = new Element('div');

        el.setProperties({
            'year' : d.get('year'), 'month' : d.get('month')
        });
        ludo.dom.addClass(el, 'ludo-calendar-month-year');
        if (monthFromCurrent == 0) {
            ludo.dom.addClass(el, 'ludo-calendar-month-year-selected');
            this.els.activeOption = el;
        }
        el.set('html', '<span>' + txt + '</span>');
        el.addEvent('click', this.clickMonth.bind(this));
        return el;
    },

    clickMonth:function (e) {
        var el = e.target;
        if (!el.hasClass('ludo-calendar-month-year'))el = el.getParent('.ludo-calendar-month-year');

        this.setMonthAndYear(el.getProperty('month'), el.getProperty('year'));
        this.sendSetDateEvent();

    },

    setMonthAndYear:function(month, year){
        this.date.set('month', month);
        this.date.set('year', year);
        this.refreshView();
    },

    setDate:function(date){
        this.parent(date);
        this.refreshView();
    },

    refreshView:function () {
        this.addAndRemoveOptions();
        if (this.els.activeOption) {
            this.centerDom(this.els.activeOption);
            this.els.activeOption.set('html', this.months[this.els.activeOption.getProperty('month')]);
            this.els.activeOption.removeClass('ludo-calendar-month-year-selected');
        }
        this.els.activeOption = this.getNewActiveOption();
        this.populateActiveMonth();
        this.animateDomToCenter.delay(20, this, this.els.activeOption);
    },

    populateActiveMonth:function() {
        ludo.dom.addClass(this.els.activeOption, 'ludo-calendar-month-year-selected');
        this.els.activeOption.set('html', this.months[this.date.get('month')] + ', ' + this.date.get('year'));

    },

    addAndRemoveOptions:function () {
        var min = this.date.clone().decrement('month', this.offsetOptions);
        var max = this.date.clone().increment('month', this.offsetOptions);
        if(max < this.minDisplayed || min > this.maxDisplayed){
            this.renderOptions();
        }else{
            var diff = this.date.diff(this.minDisplayed, 'month') + this.offsetOptions;
            if(diff > 0){
                this.insertMonthBefore(diff);
            }else{
                this.insertMonthAfter(diff*-1);
            }
        }
        this.setMinAndMaxDisplayed();
    },
    insertMonthBefore:function (count) {
        var els = [];
        for (var i = 0; i<count;i++) {
            var monthsFromCurrent = i - this.offsetOptions;
            var el = this.getDomForAMonth(monthsFromCurrent);
            el.inject(this.els.options[0], 'before');
            els.push(el);
            this.els.options[this.els.options.length - 1].dispose();
            this.els.options.length--;
        }
        this.els.options = els.append(this.els.options);
    },
    insertMonthAfter:function (count) {
        for (var i = count; i > 0; i--) {
            var monthsFromCurrent = this.offsetOptions - i + 1;
            var el = this.getDomForAMonth(monthsFromCurrent);
            this.els.calendarContainer.adopt(el);
            this.els.options.push(el);
            this.els.options[i - 1].dispose();
        }
        this.els.options = this.els.options.slice(count);
    },

    getNewActiveOption:function () {
        var year = this.date.get('year'), month = this.date.get('month');
        for (var i = 0; i < this.els.options.length; i++) {
            if (this.els.options[i].getProperty('year') == year && this.els.options[i].getProperty('month') == month) {
                return this.els.options[i];
            }
        }
    }
});
/**
 ludo Model. A Model should be passed to a ludo.View object using the config.model property
 A Model creates dynamic getters and setters. Updates made to the model will be done to form components
 which have the same name as a column in the model.

 @namespace model
 @class Model
 @example
 model:{
	 type:'model.Model',
	 name:'user',
	 columns:['firstname', 'lastname', 'email','timezone','locale'],
	 autoLoad:true
	}
 This is an example of a model config sent to a component.
 */
ludo.model.Model = new Class({
	Extends:Events,
	type:'model.Model',

	/**
	 * @attribute {String} model name
	 * @description Name of model
	 * @default undefined
	 */
	name:undefined,
	/**
	 * Column specifications
	 @attribute columns
	 @type Array
	 @default undefined
	 @example
	 ['firstname','lastname', { name:'age', defaultValue:20 }]
	 */
	columns:undefined,
	columnKeys:[],
	currentRecord:{},

	progressBar:undefined,
	formComponents:{},
	views:[],

	/**
	 * URL for save and load. If not set, it will use the URL of nearest component.
	 * @attribute url
	 * @param url
	 * @type String
	 * @default undefined
	 */
	url:undefined,

	/**
	 * Event listeners, example : listeners :{ submit : doSomething(); }, submitfail : doSomethingElse()}
	 * @attribute Object listeners
	 * @default undefined
	 */
	listeners:undefined,
	/**
	 * Initial record id
	 * @attribute {String} recordId
	 * @default undefined
	 */
	recordId:undefined,

	/**
	 * Send initial server request even if no id is set. The model will then be populated from server with default data
	 * @attribute {Boolean} autoLoad
	 */
	autoLoad:false,

	initialize:function (config) {
		if (config.name !== undefined)this.name = config.name;
		if (config.columns !== undefined)this.columns = config.columns;
		if (config.recordId !== undefined)this.recordId = config.recordId;
		if (config.id !== undefined)this.id = config.id;
		ludo.CmpMgr.registerComponent(this);

		this._validateColumns();

		if (config.listeners) {
			this.listeners = config.listeners;
		}
		if (config.url)this.url = config.url;
		this.createSettersAndGetters();
		if (this.listeners) {
			this.addEvents(this.listeners);
		}
		if (config.id || config.autoLoad) {
			this.load(config.id);
		}
	},

	_setUrl:function (url) {
		this.url = url;
	},

	_validateColumns:function () {
		var ret = {};
		for (var i = 0; i < this.columns.length; i++) {
			var obj = {};
			var name;
			if (!this.columns[i].name) {
				obj.name = name = this.columns[i];
				obj.defaultValue = '';
			} else {
				obj.name = name = this.columns[i].name;
				obj.defaultValue = this.columns[i].defaultValue || '';
			}
			ret[name] = obj;
			this.columnKeys.push(name);
		}
		this.columns = ret;
	},

	_getDefaultValue:function (column) {
		if (this.columns[column]) {
			return this.columns[column].defaultValue;
		}
		return undefined;
	},

	createSettersAndGetters:function () {
		for (var i = 0; i < this.columnKeys.length; i++) {
			this.createSetterFor(this.columnKeys[i]);
			this.createGetterFor(this.columnKeys[i]);
		}
	},

	createSetterFor:function (columnName) {
		var fn = 'set' + columnName.substr(0, 1).toUpperCase() + columnName.substr(1);
		this[fn] = function (value) {
			this._setRecordValue(columnName, value);
			this.updateViews();
			return value;
		}.bind(this)
	},

	createGetterFor:function (columnName) {
		var fn = 'get' + columnName.substr(0, 1).toUpperCase() + columnName.substr(1);
		this[fn] = function () {
			return this.getRecordProperty(columnName)
		}.bind(this)
	},

	getColumnName:function (column) {
		if (column.name) {
			return column.name;
		}
		return column;
	},

	_setRecordValue:function (property, value) {
		if (this.currentRecord) {
			this.currentRecord[property] = value;
			if (this.formComponents[property]) {
				for (var i = 0; i < this.formComponents[property].length; i++) {
					this.formComponents[property][i].setValue(value);
				}
			}
			this.fireEvent('change', [value, this]);
			this.fireEvent('update', this.currentRecord);
		}
	},

	getRecordProperty:function (property) {
		if (this.currentRecord) {
			return this.currentRecord[property];
		}
		return '';
	},
	/**
	 Load remote record from server
	 Query sent looks like this: { getModelRecord:1, recordId:recordId, modelName:this.name }
	 Response should be in this format:
	 { success: true|false, message : "on error message", data : { id:100,firstname:'John',...} }
	 @method load
	 @param {String} recordId

	 Example of query:
	 @example
	 request:{
	 		"request": "model/100/read"
	 	}
	 Example of expected response
	 @example
         {
            "success":true,
            "message":"",
            "code": 200,
            "data":{
                "id":100,
                "lastname":"Doe",
                "firstname":"John",
                "address":"My street 27",
                "zipcode":"4330",
                "city":"Springfield",
                "phone":"+00 12 23 23 43",
                "email":"john.doe@example-domain.com",
                "picture":"john.psd"
            }
         }

	 */
	load:function (recordId) {
		if (!this.recordId || (!this.url && !LUDOJS_CONFIG.url)) {
			return;
		}

		this.loadRequest().send("load", recordId);
	},

    _loadRequest:undefined,
    loadRequest:function(){
        if(this._loadRequest === undefined){
            this._loadRequest = new  ludo.remote.JSON({
                url:this.url,
                listeners:{
                    "success":function (request) {
                        this.populate(recordId, request.getResponseData());
                    }.bind(this),
                    "failure":function (request) {
                        /**
                         * success parameter in response from server returned false
                         * @event loadfail
                         * @param {Object} JSON from server
                         * @param {Object} ludo.model
                         */
                        this.fireEvent('loadfail', [request.getResponse(), this]);
                    }.bind(this)
                }
            });
        }
        return this._loadRequest;
    },

	populate:function (recordId, record) {
		this.recordId = recordId;
		for (var prop in record) {
			if (record.hasOwnProperty(prop)) {
				this._setRecordValue(prop, record[prop]);
			}
		}
		/**
		 * Event fired when record has been successfully loaded from server
		 * @event load
		 * @param {Object} Returned record
		 * @param {Object} ludo.model
		 */
		this.fireEvent('load', [this.currentRecord, this]);
		this.commitFormFields();
		this.updateViews();
	},

	registerProgressBar:function (cmp) {
		this.progressBar = cmp;
	},
	/**
	 * Register ludo.View object. if name of component is the same
	 * as column name in model, it will add change event to the component and
	 * update it's value to current model value. This method is called
	 * by ludo.form.Manager
	 * @method registerFormComponent
	 * @param {Object} formComponent
	 * @private
	 */
	registerFormComponent:function (formComponent) {

		var name = formComponent.getName();
		if (this.columnKeys.indexOf(name) >= 0) {
			if (!this.formComponents[name]) {
				this.formComponents[name] = [];
			}
			this.formComponents[name].push(formComponent);
			formComponent.addEvent('valueChange', this.updateByForm.bind(this));
			formComponent.setValue(this.getRecordProperty(name));
			formComponent.commit();
		}
	},
	registerView:function (view) {
		this.views.push(view);
		view.insertJSON({ data:this.currentRecord });
	},

	updateViews:function () {
		for (var i = 0, len = this.views.length; i < len; i++) {
			this.views[i].insertJSON({ data:this.currentRecord });
		}
	},

	updateByForm:function (value, formComponent) {
		this._setRecordValue(formComponent.getName(), value);
		this.updateViews();

	},

	hasColumn:function (key) {
		return this.columnKeys.indexOf(key) >= 0;
	},

	/**
	 example: { freeText : 'Notes' }
	 @method save
	 @param {Object} formData
	 Save model data to server. The server request will look like this:
	 @example
		 {
		 	   "request": "Person/100/save",
			   "data": { "id:100","firstname":"Jane","lastname":"Doe" }
		 }

	 Response from server should be in this format
	 @example
	 	{
		   "success" : true,
		   "message" : "A message in case of error",
		   "response" : {
		   		"id": "100"
		   }
	   }


	 "message" is used for eventual error messages.
	 "code" is optional and may be used for internal error handling.
	 "response" is an array of updated model values. In most cases, this would be empty or undefined. Here's a use case of when
	 it might be useful:

	 - You have a View with one file upload element named "image_file"
	 - In that component, you also have a component used for preview of existing image file
	 i.e. children :
	 @example
	 	[{ type: 'form.File', label : 'New image', name : 'image_file' }, { tpl : '&lt;img src="{preview}">' }]
	 - On click on Submit, you send the newly uploaded image file to the server and use some Image Conversion software(example: ImageMagick)
	 to generate a new "preview".
	 - Now, you want to update the view with this new preview, so you send it back in the "updates" array:
	 @example
	 	"response" : [{ preview : 'images/new-file.jpg' }]

	 */
	save:function (formData) {
		formData = formData || {};
		var data = {};
		for (var key in formData) {
			if (formData.hasOwnProperty(key) && !this.hasColumn(key)) {
				data[key] = formData[key];
			}
		}

		this.fireEvent('beforesubmit', this);
        this.request().send("save", this.recordId, data);

	},
    _request:undefined,
    request:function(){
        if(this._request === undefined){
            this._request = new ludo.remote.JSON({
                url:this.url,
                resource:this.name,
                listeners:{
                    "success":function (request) {
                        var updates = request.getResponseData();
                        if (updates) {
                            this.handleModelUpdates(updates);
                        }
                        /**
                         * event fired when model is saved
                         * @event success
                         * @param {Object} JSON response from server
                         * @param {Object} ludo.model.Model
                         */
                        this.fireEvent('success', [request.getResponse(), this]);
                        this.commitFormFields();
                    }.bind(this),
                    "failure":function (request) {
                        /**
                         * Event fired when success parameter in response from server is false
                         * @event failure
                         * @param {Object} JSON response from server. Error message should be in the "message" property
                         * @param {Object} ludo.model.Model
                         *
                         */
                        this.fireEvent('failure', [request.getResponse(), this]);
                    }.bind(this),
                    "error":function (request) {
                        /**
                         * Server error event. Fired when the server didn't handle the request
                         * @event servererror
                         * @param {String} error text
                         * @param {String} error message
                         */
                        this.fireEvent('servererror', [request.getErrorText(), request.getErrorCode()]);
                    }.bind(this)
                }
            });
        }
        return this._request;
    },

	getSubmitData:function (data) {
		return {
			id:'saveModelRecord',
			progressBarId:this.getProgressBarId(),
			data:{
				recordId:this.recordId,
				modelName:this.name,
				record:this.currentRecord,
				formData:data
			}
		};
	},

	getProgressBarId:function () {
		if (this.progressBar) {
			return this.progressBar.getProgressBarId();
		}
		return undefined;
	},

	handleModelUpdates:function (updates) {
		for (var column in updates) {
			if (updates.hasOwnProperty(column)) {
				this._setRecordValue(column, updates[column]);
			}
		}
	},

	/**
	 * Commit all form fields, i.e. update initial value to current value
	 * @method commitFormFields
	 * @return void
	 */
	commitFormFields:function () {
		for (var name in this.formComponents) {
			if (this.formComponents.hasOwnProperty(name)) {
				var cmps = this.formComponents[name];
				for (var i = 0; i < cmps.length; i++) {
					cmps[i].commit();
				}
			}
		}
	},
	/**
	 * New record with default values. Form elements will be updated
	 * automatically.
	 * @method newRecord
	 * @return void
	 */
	newRecord:function () {
		for (var column in this.columns) {
			if (this.columns.hasOwnProperty(column)) {
				this._setRecordValue(column, this.columns[column].defaultValue);
			}
		}
		this.commitFormFields();
		this.updateViews();
	},

	fill:function (data) {
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				this.currentRecord[key] = data[key];
			}
		}
		this.fireEvent('update', this.currentRecord);
	}
});

ludo.menu.MenuHandler = new Class({
    items:{},
    menus:[],
    initialItems:[],
    itemPrepared:false,
    isActive:true,
    alwaysActive:true,

    addChild:function (item, menu, parentMenuItem) {
        if (parentMenuItem && parentMenuItem.menuDirection === 'horizontal') {
            this.isActive = false;
            this.alwaysActive = false;
        }
        this.initialItems.push({
            id:item.getId(),
            label : item.label,
            menu:menu ? [menu.getId()] : null,
            parent:parentMenuItem ? parentMenuItem.getId() : null
        });
        item.addEvent('click', this.hideMenus.bind(this));


    },

    toggleActive:function (menuItem) {
        if (this.alwaysActive) {
            return;
        }
        this.isActive = !this.isActive;
        if (this.isActive) {
            this.showMenu(menuItem);
        } else {
            this.hideMenus();
        }
    },

    prepareItems:function () {
        for (var i = this.initialItems.length - 1; i >= 0; i--) {
            var item = this.initialItems[i];
            item.menu = item.menu || [];
            this.items[item.id] = {
                label:ludo.get(item.id).label,
                menus:this.getParentMenus(item.parent).concat(item.menu),
                item:item.id
            };

            this.menus = this.menus.concat(this.items[item.id].menus);
        }
        this.itemPrepared = true;

        document.id(document.documentElement).addEvent('click', this.autoHideMenus.bind(this));
    },

    getParentMenus:function (item) {
        if (item && this.items[item]) {
            return this.items[item].menus || [];
        }
        return [];
    },

    showMenu:function (menuItem) {
        if (!this.isActive) {
            return;
        }
        if (!this.itemPrepared) {
            this.prepareItems();
        }
        this.hideMenus();
        var menus = this.items[menuItem.getId()].menus;

        for (var i = 0; i < menus.length; i++) {
            ludo.getView(menus[i]).show();
        }
    },

    hideMenus:function () {
        for (var i = 0; i < this.menus.length; i++) {
            ludo.getView(this.menus[i]).hide();
        }
    },

    autoHideMenus:function (e) {
        if (this.isActive) {
            var el = e.target;
            if (el.className.indexOf('ludo-menu-item') >= 0) {
                return;
            }
            if (!el.getParent('.ludo-menu')) {
                this.hideMenus();
                this.setInactive();
            }
        }
    },

    setInactive:function () {
        if (!this.alwaysActive) {
            this.isActive = false;
        }
    }
});
/**
 * Class for menu items. MenuItems are created dynamically from config object(children of ludo.menu.Menu or ludo.menu.Context)
 * @namespace menu
 * @class MenuItem
 * @extends View
 */
ludo.menu.MenuItem = new Class({

	Extends:ludo.View,
	type:'menu.MenuItem',
	menu:null,
	subMenu:null,
	menuItems:[],
	spacer:undefined,
	/**
	 Path to menu item icon or text placed in the icon placeholder. If icon contains one
	 or more periods(.) it will be consider an image. Otherwise, config.icon will be displayed
	 as plain text
	 @Attribute icon
	 @type String
	 @default undefined
	 @example
	 	icon: 'my-icon.jpg'
	 Sets icon to my-icon.jpg
	 @example
	 	icon : '!'
	 sets icon to the character "!", i.e. text
	 */
	icon:undefined,
	expandSubMenuOnClick:true,
	menuDirection:'horizontal',
	/**
	 * Initially disable the menu item
	 * @attribute {Boolean} disabled
	 * @default false
	 */
	disabled:false,
	menuHandler:undefined,
	parentMenuItem:undefined,
	value:undefined,
	/**
	 * Text for menu item
	 * @attribute label
	 * @type String
	 * @default '' empty string
	 */
	label:'',
	/**
	 * Useful property if you want to apply only one click event for the menu
	 * and then determine which menu item was clicked. example:
	 *
	 * switch(menuItem.action){
     *
     *
     *
     * }
	 *
	 * @Attribute {String} action
	 * @type String
	 * @default undefined
	 */
	action:undefined,
	record:undefined,

	ludoConfig:function (config) {
		if (config.children) {
			this.menuItems = config.children;
			config.children = [];
		}
		this.menuDirection = config.menuDirection || this.menuDirection;
		config.html = config.html || config.label;
		this.icon = config.icon || this.icon;
		this.record = config.record || this.record;
		this.value = config.value || this.value;
		this.label = config.label || this.label;
		this.action = config.action || this.action;
		if (config.disabled !== undefined) {
			this.disabled = config.disabled;
		}
		if (config.html === '|') {
			this.spacer = true;
		}
		if (this.label && !this.html) {
			this.html = this.label;
		}
		this.parent(config);
	},

	ludoEvents:function () {
		this.parent();
		if (!this.isSpacer()) {
			this.getEl().addEvent('click', this.click.bind(this));
			this.getEl().addEvent('mouseenter', this.mouseOver.bind(this));
			this.getEl().addEvent('mouseleave', this.mouseOut.bind(this));
		}
	},

	ludoDOM:function () {
		this.parent();
		this.createMenu();
		this.registerMenuHandler();

		this.getEl().addClass('ludo-menu-item');
		this.getBody().setStyle('cursor', 'pointer');

		if (this.isSpacer()) {
			if (this.menuDirection === 'horizontal') {
				this.getEl().setStyle('width', 1);
			}
			this.getEl().addClass('ludo-menu-item-spacer-' + this.getParent().getDirection());
		}

		if (this.getParent()) {
			this.getEl().addClass('ludo-menu-item-' + this.getParent().getDirection());
		}

		if (this.icon) {
			this.createIcon();
		}

		if (this.disabled) {
			this.disable();
		}
	},

	getLabel:function () {
		return this.label;
	},

	getRecord:function () {
		return this.record;
	},
	registerMenuHandler:function () {
		var rootMenuComponent = this.getRootMenuComponent();
		if (rootMenuComponent) {
			this.menuHandler = rootMenuComponent.getMenuHandler();
			if (this.menuHandler) {
				this.menuHandler.addChild(this, this.menu, this.getParentMenuItem());
			}
		}
	},

	ludoRendered:function () {
		this.parent();
		if (this.isSpacer()) {
			this.getBody().setStyle('visibility', 'hidden');
		}
		this.parentMenuItem = this.getParentMenuItem();
	},

	click:function () {
		if (this.disabled) {
			return;
		}
		this.getEl().addClass('ludo-menu-item-down');
		this.fireEvent('click', this);
		var rootMenu = this.getRootMenuComponent();
		if (rootMenu) {
			rootMenu.click(this);
		}
		if (!this.parentMenuItem) {
			this.menuHandler.toggleActive(this);
		}
	},
	select:function () {
		this.getEl().addClass('ludo-menu-item-selected');
	},

	deselect:function () {
		this.getEl().removeClass('ludo-menu-item-selected');
	},

	/**
	 * Disable menu item
	 * @method disable
	 * @return void
	 */
	disable:function () {
		this.disabled = true;
		this.getEl().addClass('ludo-menu-item-disabled');
	},

	/**
	 * Return disable state of menu item
	 * @method isDisabled
	 * @return {Boolean} disabled
	 */
	isDisabled:function () {
		return this.disabled;
	},

	/**
	 * Enable menu item
	 * @method enable
	 * @return void
	 */
	enable:function () {
		this.disabled = false;
		this.getEl().removeClass('ludo-menu-item-disabled');
	},

	createIcon:function () {
		var el = this.els.icon = new Element('div');
		ludo.dom.addClass(el, 'ludo-menu-item-icon');
		el.setStyles({
			'background-position':'top center',
			'background-repeat':'no-repeat',
			'position':'absolute',
			'text-align':'center',
			'left':0,
			'top':0,
			'height':'100%'
		});
		if (this.icon.indexOf('.') >= 0) {
			el.setStyle('background-image', 'url(' + this.icon + ')');
		} else {
			el.set('html', this.icon);
		}
		this.getEl().adopt(el);
	},

	mouseOver:function () {
		if (this.disabled) {
			return;
		}
		this.getEl().addClass('ludo-menu-item-over');
		this.showMenu();
	},

	mouseOut:function () {
		if (this.disabled) {
			return;
		}
		this.getEl().removeClass('ludo-menu-item-over');
		this.getEl().removeClass('ludo-menu-item-down');
	},
	createMenu:function () {

		if (this.menuItems.length === 0) {
			return;
		}
		this.menu = new ludo.menu.Menu({
			els:{
				parent:document.body
			},
			direction:'vertical',
			children:this.menuItems,
			parentMenuItem:this
		});
		this.menu.hide();

		var el = this.els.expand = new Element('div');
		ludo.dom.addClass(el, 'ludo-menu-item-expand');
		ludo.dom.addClass(el, 'ludo-menu-item-' + this.menuDirection + '-expand');
		this.getEl().adopt(el);

	},

	getMeasuredWidth:function () {
		if (this.isSpacer()) {
			return ludo.dom.getTotalWidthOf(this.getEl());
		}
		return this.parent();
	},

	isSpacer:function () {
		return this.spacer;
	},

	showMenu:function () {
		this.menuHandler.showMenu(this);
	},

	getMenuDirection:function () {
		return this.menuDirection;
	},

	getRootMenuComponent:function () {
		var el;
		if (el = this.getParent()) {
			if (el.isMenu !== undefined) {
				if (el.parentMenuItem) {
					return el.parentMenuItem.getRootMenuComponent();
				}
				return el;
			}
			return this;
		}
	},

	getParentMenuItem:function () {
		var el;
		if (el = this.getParent()) {
			if (el.isMenu) {
				if (el.parentMenuItem) {
					return el.parentMenuItem;
				}
			}
		}
		return null;
	}
});
/**
 * Menu class
 * @namespace menu
 * @class Menu
 * @extends View
 */
ludo.menu.Menu = new Class({

    Extends : ludo.View,
    type : 'menu.Menu',
    cType : 'menu.MenuItem',
    /**
     * Direction of menu, "horizontal" or "vertical"
     * @property direction
     * @type String
     * @default horizontal
     */
    direction : 'horizontal',
    layout : { type : 'cols',width:'wrap' },
    menuItems : [],
    parentMenuItem : undefined,
    menuHandler : undefined,
    selectedRecord : undefined,
    selectedMenuItem : undefined,

    ludoConfig : function(config){
        this.menuItems = config.children;
        config.children = [];
        this.direction = config.direction || this.direction;
        this.parentMenuItem = config.parentMenuItem || this.parentMenuItem;
        if(this.direction === 'vertical'){
            config.height = 'auto';
			this.layout.type = 'rows';
        }

        this.parent(config);
    },

    ludoDOM : function(){
        this.parent();
        this.getEl().addClass('ludo-menu-' + this.direction);
        this.getEl().addClass('ludo-menu');
    },

    ludoRendered : function() {
        this.parent();
        if(!this.menuItems){
            return;
        }
        if(this.direction == 'horizontal'){
            var height = this.getInnerHeightOfBody();
        }
        var lm = this.getLayoutManager();
        var i;
        for(i=0;i<this.menuItems.length;i++){
            var item = this.getMenuItemConfigObject(this.menuItems[i]);

            item = lm.getNewComponent(item);
            this.menuItems[i] = item;
            this.getBody().adopt(item.getEl());

            if(this.direction == 'horizontal'){
                item.resize({ height : height, width : item.width ? item.width : undefined });
            }
        }
        if(this.direction === 'horizontal'){
            for(i=0;i<this.menuItems.length;i++){
                this.menuItems[i].getEl().setStyle('position', 'absolute');
            }
        }
        if(this.parentMenuItem){
            this.getEl().setStyle('position', 'absolute');
        }
        if(this.direction == 'horizontal'){
            this.resizeMenuItems.delay(100, this);
        }
        this.positionMenuItems();
    },

    resizeMenuItems : function() {
        var height = this.getInnerHeightOfBody();
        for(var i=0;i<this.menuItems.length;i++){
            this.menuItems[i].resize({ height : height });
        }
    },

    selectRecord : function(recordToSelect){
        if(this.selectedMenuItem){
            this.selectedMenuItem.deselect();
        }
        for(var i=0;i<this.menuItems.length;i++){
            var record = this.menuItems[i].getRecord();
            if(record){
                if(record.type && record.type == recordToSelect.type && record.id === recordToSelect.id){
                    this.menuItems[i].select();
                    this.selectedMenuItem = this.menuItems[i];
                }
            }
        }
    },

    getMenuItemConfigObject : function(obj){
        if(obj.substr){
            obj = {
                html : obj,
                type : 'menu.MenuItem'
            }
        }
        obj.menuDirection = this.direction;
        return obj;
    },

    positionMenuItems : function(){
        ludo.dom.clearCache();
        if(this.direction == 'horizontal'){
            var left = 0;
            for(var i=0;i<this.menuItems.length;i++){
                this.menuItems[i].getEl().setStyle('left', left);
                var width = ludo.dom.getMeasuredWidth(this.menuItems[i]);
                width += ludo.dom.getMBPW(this.menuItems[i].getEl());
                left += width;
            }
        }
    },

    getDirection : function(){
        return this.direction;
    },
    alignWithMenuItem : function(){
        if(!this.parentMenuItem){
            return;
        }
        var menuDirection = this.parentMenuItem.getMenuDirection();
        var coords = this.parentMenuItem.getEl().getCoordinates();
        var styles;
        if(menuDirection === 'horizontal'){
            styles = {
                left : coords.left,
                top : coords.top + coords.height
            }
        }else{
            var x = coords.left + coords.width;
            if(this.isEnoughSpaceToTheRight(x)){
            styles = {
                left : x,
                top : coords.top
            }
            }else{
                styles = {
                    left : coords.left - this.getEl().getSize().x,
                    top : coords.top
                }
            }
        }

        this.getEl().setStyles(styles);
    },

    isEnoughSpaceToTheRight : function(x) {
        return x + this.getEl().getSize().x <= document.body.clientWidth;
    },

    getMenuHandler : function(){
        if(!this.menuHandler){
            this.menuHandler = new ludo.menu.MenuHandler();
        }
        return this.menuHandler;
    },

    show:function(){
        this.parent();
        this.alignWithMenuItem();
    },
    addCoreEvents : function(){

    },

    click : function(menuItem){
        /**
         * Event fired when menu item is clicked
         * @event click
         * @param {Object} ludo.menu.MenuItem
         * @param {Object} ludo.menu.Menu
         */
        this.fireEvent('click', [menuItem, this]);
    },

    isMenu:function(){
        return true;
    }


});



/**
 * Context menu class. You can create one or more context menus for a component by using the
 * ludo.View.contextMenu config array,
 * example:
 * new ludo.Window({<br>
 *  contextMenu:[{<br>
 *      selector : '.my-selector',<br>
 *      children:[{label:'Menu Item 1'},{label:'Menu item 2'}],<br>
 *      listeners:{<br>
 *          click : function(menuItem, menu){<br>
 *              // Do something<br>
 *          }<br>
 *      }<br>
 *<br>
 *  }]<br>
 *
 * });
 * @namespace menu
 * @class Context
 * @extends menu.Menu
 */
ludo.menu.Context = new Class({
	Extends:ludo.menu.Menu,
	type:'menu.ContextMenu',
	direction:'vertical',
	/**
	 Show context menu only for DOM nodes matching a CSS selector. The context menu will also
	 be shown if a match is found in one of the parent DOM elements.
	 @attribute selector
	 @type String
	 @default undefined
	 @example
	 	selector : '.selected-records'
	 */
	selector:undefined,
	component:undefined,
	layout:{
		width:'wrap'
	},

	/**
	 Show context menu only for records of a specific type. The component creating the context
	 menu has to have a getRecordByDOM method in order for this to work. These methods are already
	 implemented for tree.Tree and grid.Grid

	 @attribute recordType
	 @type String
	 @default undefined
	 @example
	 	recordType : 'city'
	 */
	recordType:undefined,

	ludoConfig:function (config) {
		config.els = config.els || {};
		config.els.parent = document.body;
		this.parent(config);
		this.selector = config.selector || this.selector;
		this.recordType = config.recordType || this.recordType;
		this.component = config.component;
	},

	ludoDOM:function () {
		this.parent();
		this.getEl().style.position = 'absolute';
	},
	ludoEvents:function () {
		this.parent();
		document.id(document.documentElement).addEvent('click', this.hideAfterDelay.bind(this));
	},

	hideAfterDelay:function () {
		if (!this.isHidden()) {
			this.hide.delay(50, this);
		}
	},

	ludoRendered:function () {
		this.parent();
		this.hide();
	},

	/**
	 * when recordType property is defined, this will return the selected record of parent component,
	 * example: record in a tree
	 * @method getSelectedRecord
	 * @return object record
	 */
	getSelectedRecord:function () {
		return this.selectedRecord;
	},

	show:function (e) {
		if (this.selector) {
			var domEl = this.getValidDomElement(e.target);
			if (!domEl) {
				return;
			}
			this.fireEvent('selectorclick', domEl);
		}
		if (this.recordType) {
			var rec = this.component.getRecordByDOM(e.target);
			if (!rec || rec.type !== this.recordType) {
				return;
			}
			this.selectedRecord = rec;
		}
		this.parent();
		if (!this.getParent()) {
			var el = this.getEl();
			var pos = this.getXAndYPos(e);
			el.style.left = pos.x + 'px';
			el.style.top = pos.y + 'px';
		}
		return false;
	},

	getXAndYPos:function (e) {
		var ret = {
			x:e.page.x,
			y:e.page.y
		};
		var clientWidth = document.body.clientWidth;
		var ludo = ret.x + this.getEl().getSize().x;

		if (ludo > clientWidth) {
			ret.x -= (ludo - clientWidth);
		}
		return ret;
	},

	getValidDomElement:function (el) {
		if (!this.selector) {
			return true;
		}
		var selector = this.selector.replace(/[\.#]/g, '');
		if (el.hasClass(selector) || el.id == selector) {
			return el;
		}
		var parent = el.getParent(this.selector);
		if (parent) {
			return parent;
		}
		return false;
	}
});
/**
 * @namespace menu
 * @class DropDown
 * @extends menu.Menu
 *
 */
ludo.menu.DropDown = new Class({
    Extends:ludo.menu.Menu,
    type:'menu.DropDown',
    pos:'below',

    ludoConfig:function (config) {
        config.els = { parent:document.body };
        this.parent(config);
        if (config.applyTo !== undefined)this.applyTo = config.applyTo;
        if (config.pos !== undefined)this.pos = config.pos;
    },

    ludoDOM:function () {
        this.parent();
        this.getEl().style.position = 'absolute';
    },
    ludoEvents:function () {
        this.parent();
        document.id(document.documentElement).addEvent('click', this.hideAfterDelay.bind(this));
    },

    hideAfterDelay:function () {
        if (!this.isHidden()) {
            this.hide.delay(50, this);
        }
    },

    show:function () {
        this.parent();
        var el = this.getEl();
        var pos = this.getXAndYPos();
        el.style.left = pos.x + 'px';
        el.style.top = pos.y + 'px';
    },

    getXAndYPos:function () {
        var coords = this.applyTo.getEl().getCoordinates();
        var ret = {
            x:coords.left,
            y:coords.top + coords.height
        };
        switch (this.pos) {
            case 'right':
                ret.x = coords.left + coords.width;
                ret.y = coords.top;
                break;
            default:
        }
        return ret;
    },

    toggle:function(){
        if(this.isHidden()){
            this.show();
        }else{
            this.hide();
        }
    }
});
/**
 Menu button arrow which you can apply to DOM Element to have a menu drop down
 below it.
 @namespace menu
 @class Button
 @extends Core
 */
ludo.menu.Button = new Class({
	Extends: ludo.Core,
	width:15,

	/**
	 * Render button to this element
	 * @attribute renderTo
	 * @type {String}|DOMElement
	 * @default undefined
	 */
	renderTo:undefined,

	/**
	 * Button always visible. When false, it will be visible when mouse enters
	 * parent DOM element and hidden when it leaves it
	 * @attribute alwaysVisible
	 * @type {Boolean}
	 * default false
	 */
	alwaysVisible:false,

	/**
	 * Position button in this region. Valid values : 'nw','ne','sw' and 'se'
	 * @attribute region
	 * @type String
	 * @default 'ne'
	 */
	region : 'ne',

	el:undefined,

	/**
	 * Configuration object for the object to show on click on button
	 * @attribute menu
	 * @type {View}
	 * @default undefined
	 */
	menu:undefined,

	menuCreated:false,

	ludoConfig:function(config){
		this.parent(config);
		if(config.alwaysVisible!==undefined)this.alwaysVisible = config.alwaysVisible;
		if(config.region!==undefined)this.region = config.region;
		if(config.renderTo!==undefined)this.renderTo = config.renderTo;
		if(config.menu!==undefined)this.menu = config.menu;


	},

	ludoEvents:function(){
		this.parent();
		this.ludoDOM();
		this.createButtonEvents();
	},

	ludoDOM:function(){
		var el = this.el = new Element('div');
		el.id = 'ludo-menu-button-' + String.uniqueID();
		ludo.dom.addClass(el, 'ludo-menu-button');
		document.id(this.renderTo).adopt(el);
		el.setStyles({
			position : 'absolute',
			height : '100%'
		});
		this.createButtonEl();
		this.positionButton();

	},

	createButtonEvents:function(){
		this.buttonEl.addEvent('click', this.showMenu.bind(this));
		ludo.EffectObject.addEvent('start', this.hideMenu.bind(this));
		if(!this.alwaysVisible){
			var el = document.id(this.renderTo);
			el.addEvent('mouseenter', this.show.bind(this));
			el.addEvent('mouseleave', this.hide.bind(this));
			this.hide();
		}else{
			this.show();
		}
	},

	createButtonEl:function(){
		var el = this.buttonEl = new Element('div');
		ludo.dom.addClass(el, 'ludo-menu-button-arrow');
		this.getEl().adopt(el);
	},

	positionButton:function(){
		var e = this.getEl();
		var r = this.region;
		if(r == 'ne' || r == 'se')e.setStyle('right', 0);
		if(r == 'nw' || r == 'sw')e.setStyle('left', 0);
		if(r == 'se' || r == 'sw')e.setStyle('bottom', 0);
		if(r == 'ne' || r == 'nw')e.setStyle('top', 0);
	},

	getEl:function(){
		return this.el;
	},



	showMenu:function(e){
		e.stop();
		if(!this.menuCreated){
			this.createMenuView();
		}
		if(this.menu._button && this.menu._button !== this.id){
			var el = ludo.get(this.menu._button);
			if(el)el.hideButton();
		}

		this.menu._button = this.id;
		this.menu.show();

		this.positionMenu();
		this.fireEvent('show', this);
	},

	/**
	 This method should be called from function added as event handler to "beforeShow"
	 @method cancelShow
	 @example
	 	button.addEvent('beforeShow', function(button){
	 		if(!this.isOkToShowButton()){
	 			button.cancel();
	 		}
	 	});
	 */
	cancelShow:function(){
		this.okToShowButton = false;
	},

	hideMenu:function(){
		if(this.menu.hide !== undefined)this.menu.hide();
		this.hide();
	},

	createMenuView:function(){
		if(this.menu.id){
			var menu = ludo.get(this.menu.id);
			if(menu)this.menu = menu;
		}

		if(this.menu.getEl === undefined){
			this.menu.renderTo = document.body;
			this.menu.type = this.menu.type || 'View';
			this.menu.hidden = true;
			this.menu = ludo._new(this.menu);
			this.menu._button = this.getEl().id;
			document.body.addEvent('mouseup', this.autoHideMenu.bind(this));
		}else{
			document.body.adopt(this.menu.getEl());
		}

		this.menu.addEvent('show', this.showIf.bind(this));
		this.menu.addEvent('hide', this.hideButton.bind(this));
		this.menu.getEl().style.position = 'absolute';
		this.menu.getEl().addClass('ludo-menu-button-menu');
	},

	positionMenu:function(){
		if(!this.menu){
			return;
		}
		var pos = this.el.getCoordinates();
		this.menu.resize({
			left:pos.left,
			top:pos.top + pos.height
		});
	},

	showIf:function(){
		if(this.menu._button === this.id){
			this.show();
		}
	},

	okToShowButton:false,

	show:function(){
		this.okToShowButton = true;
		/**
		 * Event fired before button is shown. You can use this event and call
		 * the cancel method if there are situations where you don't always want to show the button
		 * @event beforeShow
		 * @param {menu.Button} this
		 */
		this.fireEvent('beforeShow', this);

		if(this.okToShowButton){
			this.buttonEl.style.display='';
			ludo.dom.addClass(this.el, 'ludo-menu-button-active');
		}
	},

	hide:function(){
		if(this.menu === undefined || this.menu.isHidden === undefined || this.menu.isHidden()){
			this.hideButton();
		}else if(this.menu._button !== this.id){
			this.hideButton();
		}
	},

	hideButton:function(){
		this.buttonEl.style.display='none';
		this.el.removeClass('ludo-menu-button-active');
	},
	getMenuView:function(){
		return this.menu;
	},

	autoHideMenu:function(e){
		if(this.menu && this.menu.hidden)return;
		if(!ludo.dom.isInFamilies(e.target, [this.el.id, this.menu.getEl().id])){
			this.hideMenu();
			this.hideButton();
		}
	}
});
/**
 * Displays a tree
 * Possible features: filtering, drag and droptild
 * @namespace tree
 * @class Tree
 * @extends View
 */
ludo.tree.Tree = new Class({
    Extends:ludo.View,
    type:'tree.Tree',
    /**
     * Keys to use as primary key for records. If you show different types of nodes, example continent, country, city
     * you may have records with the same "id". primaryKey let you specify keys to use as a combined primary key
     * example: ["id","type"]. If no keys are set, "id" will be used.
     * @attribute {Array} primaryKey
     * @default []
     */
    primaryKey:[],

    treeConfig:{
        defaultValues:{}
    },

    rootRecord:{
        id:'ludo-tree-root-node-' + String.uniqueID(),
        title:'Root',
        type:'root',
        hidden:true
    },

    recordConfig:{
        'root':{
            dd:{
                drag:false,
                drop:true,
                siblings:false,
                children:true,
                newChild:'top'
            }
        }
    },
    selectedRecord:undefined,

    modificationStorage:[],

    dd:{},
    searchConfig:null,
    filterObj:null,
    /**
     * Initial records, example
     * [ {id:1, title: 'Document', type: 'document' , children: [{ id:2, title: 'Chapter 1', type: 'chapter'},{ id:3, title: 'Chapter 2', type: 'chapter'}] }
     * In most cases, you will want to pull this from the server. Response from server should be { success: true, data : [ { tree nodes structure above } ]}
     * @attribute {Array} data
     */
    data:[],

    recordMap:{},

    nodeTpl:'<span>{title}</span>',


    search:false,


    tplFields:{},
    /**
     * Show lines between nodes
     * @attribute {Boolean} showLines
     * @default true
     *
     */
    showLines:true,


    /**
     * Initially expand tree to this depth
     * @attribute {Number} expandDepth
     */
    expandDepth:0,


    /**
     * Auto scroll node into view when calling the selectRecord method
     * @attribute {Boolean} autoScrollNode
     * @default true
     */
    autoScrollNode:false,
    /**
     * Auto expand tree to selected node when calling selectRecord method
     * @attribute {Boolean} autoExpand
     * @default true
     */
    autoExpand:true,
    selectedNode:null,
    hiddenNodes:{},
    /**
     * Object of class ludo.tree.Modifications. Store modified, updated and removed records
     * @property object modificationManager
     */
    modificationManager:undefined,

    ludoConfig:function (config) {
        this.parent(config);
        this.data = config.data || this.data;
        this.nodeTpl = config.nodeTpl || this.nodeTpl;

        if (config.recordConfig !== undefined)this.recordConfig = Object.merge(this.recordConfig, config.recordConfig);
        if (config.showLines !== undefined)this.showLines = config.showLines;
        if (config.autoScrollNode !== undefined)this.autoScrollNode = config.autoScrollNode;
        if (config.expandDepth !== undefined)this.expandDepth = config.expandDepth;

        config.treeConfig = config.treeConfig || {};
        config.dd = config.dd || {};

        this.search = config.search || this.search;

        if (config.rootRecord !== undefined) {
            this.rootRecord = config.rootRecord;
            this.rootRecord.id = this.rootRecord.id || 'ludo-tree-root-node-' + String.uniqueID();
            this.rootRecord.type = this.rootRecord.type || 'root';
        }
        if (config.primaryKey !== undefined)this.primaryKey = config.primaryKey;
        if (config.treeConfig.defaultValues !== undefined)this.treeConfig.defaultValues = config.treeConfig.defaultValues;

        this.dd = config.dd || this.dd;

        if (this.search) {
            this.searchConfig = config.searchConfig;
            this.filterObj = new ludo.tree.Filter({
                data:this.data,
                component:this
            });
        }
    },

    ludoRendered:function () {
        if (this.data.length) {
            this.insertJSON({ data:this.data });
        }
        if (!this.showLines) {
            this.getEl().addClass('ludo-tree-no-lines');
        }
    },

    ludoDOM:function () {
        this.parent();
        this.els.nodes = [];
        this.els.expand = [];
        this.els.childContainers = [];
    },

    ludoEvents:function () {
        this.parent();

        if ((this.dd.drag || this.dd.drop) && !this.dd.obj) {
            this.dd.obj = new ludo.tree.DragDrop();
        }

        this.addEvent('remove', this.removeRecord.bind(this));
        this.addEvent('add', this.addRecord.bind(this));

        this.getBody().addEvent('click', this.recordClick.bind(this));
        this.getBody().addEvent('dblclick', this.recordDblClick.bind(this));
        this.getBody().addEvent('click', this.expandByDom.bind(this));
        this.getBody().addEvent('contextmenu', this.showContextMenu.bind(this));
        this.getBody().addEvent('click', this.toggleExpandCollapse.bind(this));
        if (Browser.ie) {
            this.getBody().addEvent('selectstart', this.cancelSelection.bind(this));
        }
    },

    load:function () {
        this.clearView();
        this.parent();
    },

    clearView:function () {
        this.els.nodes = [];
        this.getBody().set('html', '');
        this.getModificationManager().clearDirtyStorage();
    },

    filter:function (searchString) {
        this.filterObj.filter(searchString);
    },

    removeRecord:function (record) {
        if (this.dd['removeDragged'] === false) {
            return;
        }
        this.removeDomForRecord(record);
        var parentRecord = this.getParentRecord(record);
        this.getModificationManager().storeRemovedRecord(record, parentRecord);
        parentRecord.children.erase(record);
        this.showHideExpandElement(parentRecord);
        this.updateSearchIndex();

        this.setNewCssForDomNodes(record);
    },

    removeDomForRecord:function (record) {
        this.setChildDomNodesToUndefined(record);
        var id = this.getUniqueRecordId(record);
        var node = this.getDomNode(record);
        if (node) {
            this.getDomNode(record).dispose();
            this.els.childContainers[id].dispose();
            this.els.nodes[id] = undefined;
            this.els.childContainers[id] = undefined;
        }
    },

    setChildDomNodesToUndefined:function (record) {
        if (record.children && record.children.length) {
            for (var i = 0; i < record.children.length; i++) {
                this.els.nodes[this.getUniqueRecordId(record.children[i])] = undefined;
                this.setChildDomNodesToUndefined(record.children[i]);
            }
        }
    },
    /**
     * Method called by ludo.tree.
	 * @method addRecord
     * @param {Object} record
     */
    addRecord:function (record) {
        obj.record.unique = undefined;
        if (obj.pos == 'sibling') {
            this.addSibling(obj.record, obj.targetRecord);
        } else {
            this.addChild(obj.record, obj.targetRecord);
        }
    },

    updateSearchIndex:function () {
        if (this.search) {
            this.filterObj.setData(this.data.children ? this.data.children : this.data);
        }
    },

    isRecordChildOf:function (record, parentRecord) {
        var primaryKey = this.getPrimaryKey(record);
        for (var i = 0; i < parentRecord.children.length; i++) {
            var child = parentRecord.children[i];
            if (this.getPrimaryKey(child) == primaryKey) {
                return true;
            }
        }
        return false;
    },

    addSibling:function (record, sibling) {
        var id = this.getUniqueRecordId(sibling);
        var parentRecord = this.recordMap[id].parent;

        if (this.isRecordChildOf(record, parentRecord)) {
            return;
        }

        var index = parentRecord.children.indexOf(sibling) + 1;

        var count = parentRecord.children.length;
        for (var i = count; i > index; i--) {
            parentRecord.children[i] = parentRecord.children[i - 1];
        }
        parentRecord.children[index] = record;

        var node = this.createNode(record, parentRecord);
        node.setStyle('display', '');

        node.inject(this.els.nodes[id], 'after');

        this.getModificationManager().storeAddedRecord(record, sibling, 'sibling');

        this.setNewCssForDomNodes(record);
        this.updateSearchIndex();
    },

    addChild:function (record, parentRecord) {
        if (this.isRecordChildOf(record, parentRecord)) {
            return;
        }
        this.renderChildNodes(parentRecord);
        parentRecord.children = parentRecord.children || [];

        if (!this.shouldDropChildOnTop(parentRecord)) {
            this.addSibling(record, parentRecord.children[parentRecord.children.length - 1]);
            return;
        }

        record.children = record.children || [];
        var count = parentRecord.children.length;
        for (var i = count; i > 0; i--) {
            parentRecord.children[i] = parentRecord.children[i - 1];
        }

        var sibling;
        if (parentRecord.children.length > 0) {
            sibling = parentRecord.children[0];
        }

        parentRecord.children[0] = record;

        var node = this.createNode(record, parentRecord);
        node.setStyle('display', '');

        if (sibling) {
            var id = this.getUniqueRecordId(sibling);
            node.inject(this.els.nodes[id], 'before');
        } else {
            this.renderChildNodes(parentRecord);
        }

        this.setNewCssForDomNodes(record);
        this.showHideExpandElement(parentRecord);
        this.getModificationManager().storeAddedRecord(record, parentRecord, 'child');
        this.expandNode(parentRecord);
        this.updateSearchIndex();
    },

    getModifiedRecords:function () {
        return this.getModificationManager().getModifications();
    },

    getModificationManager:function () {
        if (!this.modificationManager) {
            this.modificationManager = new ludo.tree.Modifications({ tree:this });
        }
        return this.modificationManager;
    },

    insertJSON:function (json) {
        this.clearView();
        var data = json.data ? json.data : json;
        if (data.length > 0 && data[0]['rootNode']) {
            this.rootRecord = data[0];
            json.data = data[0].children;
        }
        this.data = this.rootRecord;
        this.data.children = data;
        this.updateSearchIndex();
        this.render();

        if (this.expandDepth) {
            this.expandSome(null, this.expandDepth);
        }
    },

    render:function () {
        this.createNode(this.rootRecord);
        if (this.rootRecord.hidden || !this.rootRecord.title) {
            var id = this.getUniqueRecordId(this.rootRecord);
            this.els.nodes[id].getElements('.ludo-tree-node-plain').setStyle('display', 'none');

        }
        this.renderChildNodes(this.data);
        this.fireEvent('render', this);
    },

    renderChildNodes:function (record) {
        var records = record.children;
        var lastChildIndex = records.length - 1;
        for (var i = 0; i < records.length; i++) {
            this.createNode(records[i], record, (i == lastChildIndex));
        }
    },

    createNode:function (record, parentRecord, isLastChild) {
        var id = this.getUniqueRecordId(record);
        this.recordMap[id] = {
            record:record,
            parent:parentRecord || undefined
        };

        if (!this.els.nodes[id]) {
            var el = this.els.nodes[id] = new Element('div');
            el.className = 'ludo-tree-node';

            var nodeText = [];
            nodeText.push('<div class="ludo-tree-node-plain" id="' + id + '">');
            nodeText.push('<span');
            if (this.isSelectable(record)) {
                nodeText.push(' class="ludo-tree-node-selectable"');
            }
            nodeText.push(' id="' + id + '"');
            nodeText.push('>');
            nodeText.push(this.getNodeText(record));
            nodeText.push('</span>');

            nodeText.push('<div style="position:absolute" class="ludo-tree-node-expand" id="' + id + '"></div>');

            el.innerHTML = nodeText.join('');
			if(this.els.expand === undefined)this.els.expand = {};
			if(this.els.childContainers === undefined)this.els.childContainers = {};
            this.els.expand[id] = el.getElement('.ludo-tree-node-expand');
            this.els.childContainers[id] = el.getElement('.ludo-tree-node-container');

            if (parentRecord) {
                this.els.childContainers[this.getUniqueRecordId(parentRecord)].appendChild(el);
            } else {
                this.getBody().appendChild(el);
                ludo.dom.addClass(el, 'ludo-tree-node-root');
            }

            if (isLastChild) {
                ludo.dom.addClass(el, 'ludo-tree-node-last-sibling');
            }

            if (record['leaf'] || !record.children || record.children.length == 0) {
                this.els.expand[id].style.display = 'none';
            }

            var container = this.els.childContainers[id] = new Element('div');
            container.className = 'ludo-tree-node-container';
            el.appendChild(container);

            if (this.isRecordDragable(record)) {
                this.dd.obj.addSource({ el:el.getElement('.ludo-tree-node-plain'), record:record, component:this });
            }

            if (this.isRecordDropTarget(record)) {
                this.dd.obj.addTarget({ el:el.getElement('span'), record:record, component:this, config:this.getDragDropConfigFor(record) });
            }
        }
        return this.els.nodes[id];
    },

    cancelSelection:function () {
        return false;
    },

    showContextMenu:function (e) {
        var el = e.target;

        var record = this.getRecordByDOM(el);
        if (!record) {
            return;
        }
        var menuConfig = this.getContextMenuConfig(record);
        if (menuConfig.length == 0) {
            return;
        }

        this.selectRecord(record);

        var menu = this.getContextMenu();
        menu.setNewMenuConfig(menuConfig);
        menu.positionAt(e.page.x, e.page.y);
        menu.show();
        return false;
    },

    getContextMenu:function () {
        if (!this.contextMenu) {
            this.contextMenu = new ludo.DashboardItemMenu({});
        }
        return this.contextMenu;
    },

    getContextMenuConfig:function (record) {
        var ret = [];
        if (this.recordConfig[record.type]) {
            var menuConfig = this.recordConfig[record.type].contextMenu;
            ret = menuConfig || ret;
        }
        return ret;
    },

    isSelectable:function (record) {
        var ret = this.getRecordConfig(record, 'selectable');
        if (ret === undefined) {
            ret = true;
        }
        return ret;
    },

    selectRecord:function (record) {
        record = this.findRecord(record);
        if (record) {
            this.selectedRecord = record;
            if (!this.isRendered(record)) {
                var path = this.getPathToRecord(record);
                for (var i = 0; i < path.length; i++) {
                    this.renderChildNodes(path[i]);
                    this.expandNode(path[i]);
                }
            }
            var domNode = this.getDomNode(record);
            this.setSelectedNode(domNode);
            if (this.autoScrollNode) {
                ludo.dom.scrollIntoView(domNode, this);
            }
            if (this.autoExpand) {
                this.expandToRecord(record);
            }
            this.fireEvent('selectrecord', record);
            return record;
        }
    },
    getSelectedRecord:function () {
        return this.selectedRecord;
    },
    getPathToRecord:function (record) {
        var id = this.getUniqueRecordId(record);
        if (!this.recordMap[id]) {
            this.buildRecordMap();
        }
        var ret = [];
        while (record = this.getParentRecord(record)) {
            ret.push(record);
        }
        return ret.reverse();
    },

    buildRecordMap:function (parentRecord, children) {
        children = children || this.data.children;
        for (var i = 0; i < children.length; i++) {
            var record = children[i];
            var id = this.getUniqueRecordId(record);
            this.recordMap[id] = {
                record:record,
                parent:parentRecord || undefined
            };
            if (record.children && record.children.length) {
                this.buildRecordMap(record, record.children);
            }
        }
    },

    findRecord:function (search, children) {
        if (!children && this.isRootNode(search)) {
            return this.rootRecord;
        }
        var rec = null;
        children = children || this.data.children;
        if (children) {
            for (var i = 0; i < children.length; i++) {
                var record = children[i];
                if (this.recordMatchesSearch(record, search)) {
                    return record;
                }
                if (record.children && record.children.length > 0) {
                    rec = this.findRecord(search, record.children);
                    if (rec) {
                        return rec;
                    }
                }
            }
        }
        return rec;
    },

    recordMatchesSearch:function (record, search) {
        if (record.unique && search.unique) {
            return record.unique == search.unique;
        }
        for (var type in search) {
            if (search.hasOwnProperty(type)) {
                if (!record[type] || record[type] != search[type]) {
                    return false;
                }
            }
        }
        return true;
    },
    /**
     * Update CSS of branch after moving or removing a record from the tree(Drag and Drop)
     * @method setNewCssForDomNodes
     * @param {Object} record
     * @private
     */
    setNewCssForDomNodes:function (record) {
        var parentRecord = this.getParentRecord(record);
        var domNode;
        if (parentRecord && parentRecord.children && parentRecord.children.length > 0) {
            for (var i = 0; i < parentRecord.children.length - 1; i++) {
                domNode = this.getDomNode(parentRecord.children[i]);
                if (domNode) {
                    domNode.removeClass('ludo-tree-node-last-sibling')
                }
            }
            domNode = this.getDomNode(this.getLastChildRecord(parentRecord));
            if (domNode) {
                ludo.dom.addClass(domNode, 'ludo-tree-node-last-sibling')
            }
        }
    },

    getDomNode:function (record) {
        var domId = this.getUniqueRecordId(record);
        return this.els.nodes[domId] ? this.els.nodes[domId] : undefined;
    },

    getLastChildRecord:function (record) {
        if (record.children && record.children.length) {
            return record.children[record.children.length - 1];
        }
    },

    setRecordProperty:function (record, property, newValue) {
        record = this.findRecord(record);
        if (record) {
            record[property] = newValue;
        }
        this.updateDOMOfRecord(record);
        this.getModificationManager().storeUpdatedRecord(record);
    },

    updateDOMOfRecord:function (record) {
        var id = this.getUniqueRecordId(record);
        if (this.els.nodes[id]) {
            var textEl = this.els.nodes[id].getElements('span')[0];
            textEl.set('html', this.getNodeText(record));
        }
    },

    recordDblClick:function (e) {
        var el = this.getSelectableDomNode(e.target);
        if (!el)return;
        this.fireEvent('dblclick', [this.recordMap[el.getProperty('id')].record, e]);
    },
    recordClick:function (e) {
        var el = this.getSelectableDomNode(e.target);
        if (!el)return;
        this.setSelectedNode(el);
        this.selectedRecord = this.recordMap[el.getProperty('id')].record;
        this.fireEvent('click', [this.recordMap[el.getProperty('id')].record, e]);
        this.fireEvent('selectrecord', [this.recordMap[el.getProperty('id')].record, e]);
        return false;
    },

    getSelectableDomNode:function (el) {
        if (el.hasClass('ludo-tree-node-expand')) {
            return null;
        }
        if (!el.hasClass('ludo-tree-node-plain')) {
            el = el.getParent('.ludo-tree-node-plain');
        }
        if (!el || !el.getElement('.ludo-tree-node-selectable'))return null;
        return el;
    },

    setSelectedNode:function (node) {
        if (!node.hasClass('ludo-tree-node-plain')) {
            node = node.getFirst('.ludo-tree-node-plain');
        }
        if (this.selectedNode && this.selectedNode.tagName) {
            this.selectedNode.removeClass('ludo-tree-selected-node');
        }
        ludo.dom.addClass(node, 'ludo-tree-selected-node');
        this.selectedNode = node;
    },

    getNodeText:function (record) {
        var tplFields = this.getTplFields(record);
        var ret = this.getNodeTemplate(record);
        for (var i = 0, count = tplFields.length; i < count; i++) {
            var field = tplFields[i];
            ret = ret.replace('{' + field + '}', record[field] ? record[field] : this.getDefaultValue(record, field));
        }
        if (!this.isRootNode(record)) {
            ret = '<span class="ludo-tree-node-spacer"></span>' + ret;
        }
        return ret;
    },
	/**
	Return record fields/columns for the node template, example ['title','description'] from {title} {description}
	@method getTplFields
	@param {Object} record
	@return array
	@private
	*/
    getTplFields:function (record) {
        if (!this.tplFields[record.type]) {
            var tpl = this.getNodeTemplate(record);
            var matches = tpl.match(/{([^}]+)}/g);
            for (var i = 0; i < matches.length; i++) {
                matches[i] = matches[i].replace(/[{}]/g, '');
            }
            this.tplFields[record.type] = matches;
        }
        return this.tplFields[record.type];
    },

    getNodeTemplate:function (record) {
        if (this.recordConfig[record.type] && this.recordConfig[record.type].nodeTpl) {
            return this.recordConfig[record.type].nodeTpl;
        }
        return this.nodeTpl;
    },

    getDefaultValue:function (record, field) {
        var values = this.getRecordConfig(record, 'defaults');
        if (!values || !values[field]) {
            return this.treeConfig.defaultValues[field] ? this.treeConfig.defaultValues[field] : '';
        }
        return values[field];
    },

    isRecordDragable:function (record) {
        return this.isDragDropFeatureEnabled(record, 'drag');
    },

    isRecordDropTarget:function (record) {
        return this.isDragDropFeatureEnabled(record, 'drop');
    },

    shouldDropChildOnTop:function (record) {
        var dd = this.getDragDropConfigFor(record);
        if (!dd || !dd['newChild'])return true;
        return dd['newChild'] == 'top';
    },

    isDragDropFeatureEnabled:function (record, feature) {
        if (!this.dd[feature]) {
            return false;
        }
        if (!record.type) {
            return true;
        }
        var dd = this.getDragDropConfigFor(record);
        if (!dd)return false;
        if (dd[feature] !== undefined) {
            return dd[feature];
        }
        return true;
    },

    getDragDropConfigFor:function (record) {
        return this.getRecordConfig(record, 'dd');
    },

    getRemoteConfigFor:function (record) {
        var ret = this.getRecordConfig(record, 'remote');
        if (ret && !ret.url) {
            ret.url = this.getUrl();
        }
        return ret;
    },

    getRecordConfig:function (record, key) {
        if (!record.type || !this.recordConfig[record.type] || this.recordConfig[record.type][key] === undefined) {
            return undefined;
        }
        return this.recordConfig[record.type][key];
    },

    getNewExpandDOMElement:function (record, id) {
        id = id || this.getUniqueRecordId(record);
        var el = this.els.expand[id] = new Element('div');
        el.style.position = 'absolute';
        el.className = 'ludo-tree-node-expand';
        el.setProperty('record', id);
        return el;
    },

    toggleExpandCollapse:function (e) {
        if (!e.target.hasClass('ludo-tree-node-expand')) {
            return;
        }
        var dom = this.getExpandElAndChildByDomNode(e.target);
        var el = dom.expand, child = dom.child;
        if (el.hasClass('ludo-tree-node-collapse')) {
            el.removeClass('ludo-tree-node-collapse');
            child.setStyle('display', 'none');
        } else {
            var record = this.recordMap[el.getProperty('id')].record;
            this.expandNode(record);
        }
    },

    expandByDom:function (e) {
        if (e.target.tagName.toLowerCase() !== 'span')return;
        var dom = this.getExpandElAndChildByDomNode(e.target);
        if (!dom.expand.hasClass('ludo-tree-node-collapse')) {
            var record = this.recordMap[dom.expand.getProperty('id')].record;
            this.expandNode(record);
        }
    },

    getExpandElAndChildByDomNode:function (domNode) {
        if (!domNode.hasClass('ludo-tree-node-expand')) {
            domNode = domNode.getParent('.ludo-tree-node').getElement('.ludo-tree-node-expand');
        }
        var child = domNode.getParent('.ludo-tree-node').getFirst('.ludo-tree-node-container');
        return {
            expand:domNode,
            child:child
        };
    },

    expandButNotLoad:function (record) {
        this.expandNode(record, true);
    },

    expandToRecord:function (record) {
        var parent = this.getParentRecord(record);
        while (parent) {
            this.expandNode(parent, true);
            parent = this.getParentRecord(parent);
        }
    },
    /**
     * @method expandAll
     * @description expand entire tree or branch from parentRecord
     * @param {Object} parentRecord (optional)
     */
    expandAll:function (parentRecord) {
        this.expandSome(parentRecord, 100);
    },

    /**
     * Expand a record
     * @method expandSome
     * @param {Object} parentRecord (optional - if not set, tree will be expanded from root)
     * @param {Number} depth How deep to expand, 1 will only expand direct children
     *
     */
    expandSome:function (parentRecord, depth, currentDepth) {
        parentRecord = parentRecord || this.data;
        if (!parentRecord || !parentRecord.children) {
            return;
        }

        currentDepth = currentDepth || 0;
        currentDepth++;

        for (var i = 0; i < parentRecord.children.length; i++) {
            var record = parentRecord.children[i];
            this.expandNode(record);
            if (record.children && record.children.length > 0 && currentDepth < depth) {
                this.expandSome(record, depth, currentDepth + 1);
            }
        }
    },

    expandNode:function (record, skipRemote) {
        var id = this.getUniqueRecordId(record);
        this.els.expand[id].addClass('ludo-tree-node-collapse');
        this.els.childContainers[id].style.display = '';

        if (!skipRemote && this.shouldLoadChildrenRemotely(record)) {
            this.loadChildNodes(record);
        } else if (record.children && record.children.length && !this.isRendered(record.children[0])) {
            this.renderChildNodes(record);
        }
    },

    loadChildNodes:function (record) {
        var remoteConfig = this.getRemoteConfigFor(record);

		new ludo.remote.JSON({
			url: remoteConfig.url,
			data : Object.merge(remoteConfig.data, { record:record }),
			listeners:{
				"success": function(request){
					record.children = request.getResponseData();
					this.renderChildNodes(record);
					this.remoteLoadedNodes[this.getUniqueRecordId(record)] = true;
					this.showHideExpandElement(record);
				}.bind(this)
			}
		});
    },

    isRendered:function (record) {
        var id = record.unique || this.getUniqueRecordId(record);
        return this.els.nodes[id] && this.els.nodes[id].tagName ? true : false;
    },

    showHideExpandElement:function (record, id) {
        id = id || this.getUniqueRecordId(record);
        if (this.isRootNode(record)) {
            this.els.expand[id].style.display = 'none';
            return;
        }
        if (this.shouldLoadChildrenRemotely(record)) {
            this.els.expand[id].style.display = '';
        }
        else if (record['leaf'] || !record.children || record.children.length == 0) {
            this.els.expand[id].style.display = 'none';
        } else {
            this.els.expand[id].style.display = '';
        }
    },

    isRootNode:function (record) {
        if (this.rootRecord) {
            return record.id == this.rootRecord.id;
        }
        return false;
    },

    remoteLoadedNodes:{},
    shouldLoadChildrenRemotely:function (record) {
        if (record['leaf']) {
            return false;
        }
        var id = this.getUniqueRecordId(record);

        if (this.remoteLoadedNodes[id] || (record.children && record.children.length > 0)) {
            return false;
        }

        return this.getRemoteConfigFor(record) ? true : false;
    },

    uniqueCache:{},
    uniqueCounter:0,
    getUniqueRecordId:function (record) {
        if (!record.unique) {
            this.uniqueCounter++;
            record.unique = ['U', this.id, '-', this.uniqueCounter].join('');
        }
        return record.unique;
    },

    getPrimaryKey:function (record) {
        if (!this.primaryKey.length) {
            return record.id;
        }
        var ret = '';
        for (var i = 0; i < this.primaryKey.length; i++) {
            var field = this.primaryKey[i];
            ret += record[field] ? record[field] : '';
        }
        return ret;
    },

    getParentRecord:function (record) {
        var id = this.getUniqueRecordId(record);
        if (!this.recordMap[id]) {
            this.buildRecordMap();
        }
        return this.recordMap[id].parent;
    },

    showNode:function (record) {
        var id = record.unique || this.getUniqueRecordId(record);
        if (!this.hiddenNodes[id]) {
            return;
        }
        var node = this.els.nodes[id];
        if (node) {
            node.style.display = '';
            this.hiddenNodes[id] = false;
        }
    },

    hideNode:function (record) {
        var id = record.unique || this.getUniqueRecordId(record);
        if (this.hiddenNodes[id])return;
        this.els.nodes[id].style.display = 'none';
        this.hiddenNodes[id] = true;
    },

    showChildren:function (record) {
        if (record.children && record.children.length) {
            for (var i = 0; i < record.children.length; i++) {
                this.showNode(record.children[i]);
            }
        }
    },

    showBranch:function (record) {
        if (record.children && record.children.length) {
            for (var i = 0; i < record.children.length; i++) {
                this.showNode(record.children[i]);
                this.showBranch(record.children[i]);
            }
        }
    },
    /**
     * Return record from dom element
     * This method has to be implemented for components using context menu which only should be shown for specific records
     * @method getRecordByDOM
     * @param {Object} el (DOM element)
     * @private
     */
    getRecordByDOM:function (el) {
        if (!el.hasClass('ludo-tree-node-plain')) {
            el = el.getParent('.ludo-tree-node-plain');
        }
        if (!el) {
            return null;
        }
        return this.recordMap[el.getProperty('id')].record;
    }
});
/**
 * This class stores modified records in a tree
 * @namespace tree
 * @class Modifications
 */
ludo.tree.Modifications = new Class({

    modifications:[],
    tree:undefined,

    initialize:function(config){
        this.tree = config.tree;
    },

    getModifications:function () {
        return this.modifications;
    },

    storeUpdatedRecord:function (record) {
        var obj = {
            record:this.getRecordClone(record),
            action:'update'
        };
        this.modifications.push(obj);
    },

    storeRemovedRecord:function (record, parentRecord) {
        var obj = {
            record:this.getRecordClone(record),
            parent:this.getRecordClone(parentRecord),
            action:'remove'
        };
        this.modifications.push(obj);
    },

    storeAddedRecord:function (record, referenceRecord, position) {
        var obj = {
            record:this.getRecordClone(record),
            action:'add'
        };
        if (position == 'sibling') {
            obj.sibling = this.getRecordClone(referenceRecord);
            obj.parent = this.getRecordClone(this.tree.getParentRecord(record))
        } else {
            obj.parent = this.getRecordClone(referenceRecord);
        }
        this.modifications.push(obj);
    },

    getRecordClone:function (record) {
        var ret = Object.clone(record);
        ret.children = undefined;
        return ret;
    },

    clearDirtyStorage:function(){
        this.modifications = [];
    }

});
ludo.tree.DragDrop = new Class({
    Extends : ludo.Movable,
    delay : 0.5,
    dropConfigs : {},
    dropPositionValidator : undefined,
    dropValidator : undefined,

    initialize : function(config) {
        this.parent(config);

        config = config || {};
        if(config.dropValidator !== undefined){
            this.dropValidator = config.dropValidator;
        }
        if(config.dropPositionValidator !== undefined){
            this.dropPositionValidator = config.dropPositionValidator;
        }

        ludo.dom.addClass(this.els.shim, 'ludo-tree-movable-shim');
        ludo.dom.addClass(this.els.insertionMarker, 'ludo-tree-insertion-marker');
        document.body.adopt(this.els.insertionMarker);

    },

    hideSourceAndShowShim : function() {
        this.parent();
        this.els.shim.set('html', this.dragProperties.el.get('html'));
        this.els.shim.set('html', this.getSourceRecord().title);
    },

    resizeShim : function(){

    },

    mouseOverTarget : function(e) {
        if(this.dragProperties.mode == 'move'){
            var el = this.getTargetElementFromEvent(e);
            var success = true;
            if(this.dropValidator !== undefined){
                success = this.dropValidator.call(this,this.getSourceRecord(), this.records[el.id]);
            }
            if(success){
                this.dragProperties.jsObjects.target.item = el;
            }else{
                this.dragProperties.jsObjects.target.item = undefined;
            }
        }
    },

    mouseMoveOnTarget : function(e){
        if(this.dragProperties.jsObjects.target.item){
            this.dragProperties.jsObjects.target.pos = this.getInjectionPos(e);
            this.placeInsertionMarker();
        }

    },

    getInjectionPos : function(e){
        if(!this.dragProperties.jsObjects.target.item){
            return undefined;
        }

        if(this.dropPositionValidator){
            var pos = this.dropPositionValidator.call(this, this.getSourceRecord(), this.getTargetRecord());
            if(pos){
                return pos;
            }
        }
        
        var dropConfig = this.getDropConfig();
        if(dropConfig.children !== undefined && !dropConfig.children){
            return 'sibling';
        }
        if(dropConfig.siblings !== undefined && !dropConfig.siblings){
            return 'child';
        }

        var elCoordinates = this.getDOMCoordinatesFromCache(this.dragProperties.jsObjects.target.item);
        if(e.page.x <= elCoordinates.left+20){
            return 'sibling';
        }
        return 'child';
    },

    setHeightOfInsertionMarker : function(){

    },

    startMove : function(e){
        this.parent(e);
        this.positionShimAtMouseCursor(e);
        return false;

    },

    mouseMove : function(e) {
        if(this.dragProperties.mode == 'move'){
            this.positionShimAtMouseCursor(e);
            return false;
        }
		return undefined;
    },

    positionShimAtMouseCursor : function(e){
        this.els.shim.setStyles({
            left : e.page.x,
            top : e.page.y + 20
        });
    },

    addTarget : function(obj){
        this.parent(obj);
        if(obj.config){
            this.dropConfigs[obj.el.id] = obj.config;
        }
    },


    stopMove : function(e){
        if(this.dragProperties.mode){
            this.posCache = {};
            var sourceComponent = this.getSourceComponent();
            var targetView = this.getTargetView();

            if(sourceComponent && targetView){
                            
                var sourceRecord = this.getSourceRecord();
                sourceRecord = Object.clone(sourceRecord);

                sourceComponent.fireEvent('remove', this.getSourceRecord());
                var eventObj = {
                    record : sourceRecord,
                    targetRecord : this.getTargetRecord(),
                    pos : this.getTargetPosition()
                };
                targetView.fireEvent('add', eventObj  );
            }

        }
        this.parent(e);
    },

    placeInsertionMarker : function() {
        if(this.dragProperties.mode && this.dragProperties.jsObjects.target.item){
            if(this.dragProperties.jsObjects.target.pos == 'sibling'){
                ludo.dom.addClass(this.els.insertionMarker, 'ludo-tree-insertion-marker-sibling');
            }else{
                this.els.insertionMarker.removeClass('ludo-tree-insertion-marker-sibling');
            }

            var coords = this.getDOMCoordinatesFromCache(this.dragProperties.jsObjects.target.item);
            this.els.insertionMarker.setStyles({
                left : coords.left,
                top : coords.top + coords.height,
                display : ''
            });
        }
    },

    createInsertionMarker : function() {
        var el = this.els.insertionMarker = new Element('div');
        el.setStyle('display','none');
        document.body.adopt(el);
    },


    posCache : {},
    getDOMCoordinatesFromCache : function(el){
        if(!this.posCache[el.id]){
            this.posCache[el.id] = el.getFirst().getCoordinates();
        }
        return this.posCache[el.id];
    },
    
    getDropConfig : function() {
        var config = this.dropConfigs[this.dragProperties.jsObjects.target.item.id];
        return config ? config : {};

    }
});
/**
 * @namespace tree
 * @class Filter
 */

ludo.tree.Filter = new Class({
    data : [],
    component : null,
    timeStamp:0,
    currentSearchValue:'',

    initialize : function(config) {
        this.data = config.data;
        this.component = config.component;
    },

    setData : function(data){
        this.data = data;
        this.prepareDataForSearch();
    },

    filter : function(searchString){
        searchString = searchString.toLowerCase();
        this.filterRecords(searchString, this.data);
    },

    filterRecords : function(searchString, records){

        for(var i=0;i<records.length;i++){
            if(!searchString || this.hasRecordMatch(searchString, records[i])){
                if(!searchString){
                    this.component.showNode(records[i]);

                    this.component.showBranch(records[i]);
                }
            }else if(this.hasBranchMatch(searchString, records[i])){
                this.component.showNode(records[i]);
                this.component.expandButNotLoad(records[i]);
                if(records[i].children && records[i].children.length){
                    this.filterRecords(searchString, records[i].children);
                }
            }else{
                this.component.hideNode(records[i]);
            }
        }
    },

    hasRecordMatch : function(searchString, record){
        return record.text.indexOf(searchString)>=0;
    },

    hasBranchMatch : function(searchString, record){
        return record.branchText.indexOf(searchString)>=0;
    },

    prepareDataForSearch : function(){
        for(var i=0;i<this.data.length;i++){
            this.data[i].branchText = this.data[i].text = this.getSearchText(this.data[i]);
            if(this.data[i].children){
                this.setBranchText(this.data[i].children, [this.data[i]]);
            }
        }
    },

    setBranchText : function(children, parentNodes){
        for(var i=0;i<children.length;i++){
            children[i].branchText = '';
            var filterText = this.getSearchText(children[i]);
            children[i].branchText = filterText;
            children[i].text = filterText;

            for(var j=0;j<parentNodes.length;j++){
				parentNodes[j].branchText = [parentNodes[j].branchText, filterText].join('');
            }

            if(children[i].children){
                this.setBranchText(children[i].children, parentNodes.concat([children[i]]));
            }
        }
    },

    getSearchText  :function(record){
        if(record && record.title){
            return record.title.toLowerCase();
        }
        return '';
    }
});
/**
 * Class for remote data source.
 * @namespace dataSource
 * @class HTML
 * @extends dataSource.Base
 */
ludo.dataSource.HTML = new Class({
    Extends:ludo.dataSource.Base,
    type:'dataSource.HTML',


    getSourceType:function () {
        return 'HTML';
    },

    /**
     * Reload data from server
     * Components using this data-source will be automatically updated
     * @method load
     * @return void
     */
    load:function () {
        this.parent();
        this.Request(this.requestId, { onSuccess:this.loadComplete, data:this.postData });
    },

    loadComplete:function (html) {
		this.parent();
        this.data = html;
        this.fireEvent('load', this.data);
    }
});
/**
 * This class connects view modules and controllers
 * @namespace controller
 * @class Manager
 * @extends Core
 */
ludo.controller.Manager = new Class({
    Extends: ludo.Core,

    controllers : [],
    components : [],

    registerController:function(controller){
        this.controllers.push(controller);
        for(var i=0;i<this.components.length;i++){
            var c = this.components[i];
            if(controller.shouldBeControllerFor(c)){
                this.assignControllerTo(controller,c);
            }
        }
    },

    registerComponent:function(component){
        if(!component.hasController()){
            this.components.push(component);
            var controller = this.getControllerFor(component);
            if(controller){
                this.assignControllerTo(controller,component);
            }
        }
    },

    getControllerFor:function(component){
        for(var i=0;i<this.controllers.length;i++){
            if(this.controllers[i].shouldBeControllerFor(component)){
                return this.controllers[i];
            }
        }
    },

    assignSpecificControllerFor:function(controller, component){
        if (typeof controller === "string") {
            controller = ludo.get(controller);
            if(controller){
                this.assignControllerTo(controller,component);
            }
            return;
        }
        controller = ludo._new(controller);
        this.assignControllerTo(controller,component);
    },

    assignControllerTo:function(controller, component){
        component.setController(controller);
        controller.addBroadcastFor(component);
        controller.addView(component);
    }
});

ludo.controllerManager = new ludo.controller.Manager();
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
		if (config !== undefined) {
			config.controller = undefined;
			config.useController = false;
		}
		this.parent(config);
		if (config.broadcast !== undefined)this.broadcast = config.broadcast;
		ludo.controllerManager.registerController(this);
		if (this['addView'] == undefined) {
			alert('You need to implement an addView method for the controller (' + this.type + ')');
		}
	},

	addBroadcastFor:function (component) {
		if (this.broadcast === undefined)return;
		if (this.broadcast[component.type] !== undefined) {
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
/**
 * Component used to display text for a progress bar, example
 * Step 1 of 10
 * @namespace progress
 * @class Text
 * @extends progress.Base
 */
ludo.progress.Text = new Class({
    Extends:ludo.progress.Base,
    type:'progress.Text',
    width:300,
    height:30,
    stopped:false,
    hidden:true,

    /**
     * Template for text content, example {text}.
     * @property tpl
     * @type String
     */
    tpl : '{text}'
});
/**
 * Base class for all form elements with label
 * @namespace form
 * @class LabelElement
 * @extends form.Element
 */
ludo.form.LabelElement = new Class({
    Extends:ludo.form.Element,

    fieldTpl:['<table cellpadding="0" cellspacing="0" border="0" width="100%">',
        '<tbody>',
        '<tr class="input-row">',
        '<td class="label-cell"><label></label></td>',
        '<td class="input-cell"></td>',
        '<td class="suffix-cell" style="display:none"></td>',
        '<td class="help-cell" style="display:none"></td>',
        '</tr>',
        '</tbody>',
        '</table>'
    ],

    labelSuffix:':',

    ludoDOM:function () {
        this.parent();
        this.getBody().set('html', this.fieldTpl.join(''));
        this.addInput();
        this.addLabel();
        this.setWidthOfLabel();
    },

    addLabel:function () {
        if (this.label) {
            this.getLabelDOM().set('html', this.label + this.labelSuffix);
            this.els.label.setProperty('for', this.getFormElId());
        }

    },

    setWidthOfLabel:function () {
        this.getLabelDOM().getParent().setStyle('width', this.labelWidth);
    },

    getLabelDOM:function () {
        if (this.els.label === undefined) {
            this.els.label = this.getInputRow().getElements('label')[0];
        }
        return this.els.label;
    },

    addInput:function () {
        if (!this.inputTag) {
            return;
        }
        this.els.formEl = new Element(this.inputTag);
        if (this.inputType) {
            this.els.formEl.setProperty('type', this.inputType);
        }
        if (this.maxLength) {
            this.els.formEl.setProperty('maxlength', this.maxLength);
        }
		if(this.fieldWidth)this.els.formEl.style.width = this.fieldWidth + 'px';
        this.els.formEl.id = this.getFormElId();

        this.getInputCell().adopt(this.els.formEl);
    },

    getInputCell:function () {
        if (this.els.cellInput === undefined) {
            this.els.cellInput = this.getInputRow().getElement('.input-cell');
        }
        return this.els.cellInput;
    },

    getInputRow:function () {
        if (this.els.inputRow === undefined) {
            this.els.inputRow = this.getBody().getElement('.input-row');
        }
        return this.els.inputRow;
    },

    resizeDOM:function () {
        this.parent();
        if (this.stretchField && this.els.formEl) {
            var width = this.getWidth();
            if (!isNaN(width) && width > 0) {
                width -= (ludo.dom.getMBPW(this.getEl()) + ludo.dom.getMBPW(this.getBody()));
            } else {
                var parent = this.getParent();
                if (parent && parent.layout.type !== 'linear' && parent.layout.orientation !== 'horizontal') {
                    width = parent.getWidth();
                    width -= (ludo.dom.getMBPW(parent.getEl()) + ludo.dom.getMBPW(parent.getBody()));
                    width -= (ludo.dom.getMBPW(this.getEl()) + ludo.dom.getMBPW(this.getBody()));
                } else {
                    var c = this.els.container;
                    width = c.offsetWidth - ludo.dom.getMBPW(this.els.body) - ludo.dom.getPW(c) - ludo.dom.getBW(c);
                }
            }
            if (this.label)width -= this.labelWidth;
            width -= 10;
            if (width > 0 && !isNaN(width)) {
                this.formFieldWidth = width;
                this.getFormEl().style.width = width + 'px';
            }
        }
    }
});
/**
 * @namespace form
 * @class ToggleGroup
 * @extends Core
 */
ludo.form.ToggleGroup = new Class({
    Extends:ludo.Core,
    type:'form.ToggleGroup',
    singleton:true,
    buttons:[],
    activeButton:undefined,

    ludoConfig:function (config) {
        this.parent(config);
    },

    addButton:function (button) {
        this.buttons.push(button);
        button.addEvent('on', this.buttonClickEvent.bind(this));
        button.addEvent('off', this.buttonClickEvent.bind(this));
        if (button.isActive()) {
            this.buttonClick(button);
        }
    },

    buttonClickEvent:function (value, button) {
        this.buttonClick(button);
    },

    buttonClick:function (button) {
        if (this.activeButton && this.activeButton.isActive()) {
            this.activeButton.turnOff();
        }
        if (button.isActive()) {
            this.activeButton = button;
            /**
             * Turn toggle button on
             * @event on
             * @param {String} value, i.e. label of button
             * @param Component this
             */
            this.fireEvent('on', [button.getValue(), button]);
        } else {
            this.activeButton = undefined;
            /**
             * Turn toggle button off
             * @event off
             * @param {String} value, i.e. label of button
             * @param Component this
             */
            this.fireEvent('off', [button.getValue(), button]);
        }
    },
    /**
     * Turn a button in the toggle group on
	 * @method turnOn
     * @param button
     */
    turnOn:function (button) {
        if (button = this.getButton(button)) {
            button.turnOn();
        }
    },
    /**
     * Turn a button in the toggle group on
	 * @method turnOff
     * @param button
     */
    turnOff:function (button) {
        if (button = this.getButton(button)) {
            button.turnOff();
        }
    },

    getButton:function (button) {
        if (ludo.util.type(button) === 'String') {
            for (var i = 0; i < this.buttons.length; i++) {
                if (this.buttons[i].getValue() == button) {
                    return this.buttons[i];
                }
            }
        }
        return button;
    }
});
/**
 * Small button
 * @namespace form
 * @class TinbyButton
 */
ludo.form.TinyButton = new Class({
    Extends: ludo.form.Button,
    type:'form.TinyButton',
    width:20,
    buttonHeight:15,

    ludoConfig:function (config) {

        if(config.width == undefined){

            if(config.value){
                config.width = config.value.length*10;
            }else{
                config.width = 20;
            }
            config.width = Math.max(config.width, 20);
        }

        this.parent(config);
    },

    ludoDOM:function () {
        this.parent();
        this.getEl().addClass('ludo-form-tinybutton');
        this.getBody().addClass('ludo-form-tiny-button');
        this.getBody().setStyle('padding-left', 0);
        this.els.txt.style.height = '15px';
    },

    addIcon:function(){
        this.parent();
        this.els.icon.style.width = '100%';
    },
    
    disab2le:function () {
        this.disabled = true;
        ludo.dom.addClass(this.els.body, 'ludo-form-tiny-button-disabled');
        this.els.body.removeClass('ludo-form-tiny-button-over');
        this.els.body.removeClass('ludo-form-tiny-button-down');
        this.els.body.removeClass('ludo-form-tiny-button-selected');
    },

    enab2le:function () {
        this.disabled = false;
        this.els.body.removeClass('ludo-form-tiny-button-disabled');
    }
    
});
/**
 * Utility class for form Management. Instance of this class is created on demand
 * by ludo.View.getFormManager().
 * @namespace form
 * @class Manager
 * @extends Core
 */
ludo.form.Manager = new Class({
	Extends:ludo.Core,
	component:null,
	formComponents:[],
	fileUploadComponents:[],
	progressBar:undefined,
	invalidIds:[],
	dirtyIds:[],
	form:{
		method:'post'
	},
	model:undefined,

	ludoConfig:function (config) {
		this.component = config.component;
		if (config.form !== undefined) {
			this.form = config.form;
		}

		if (this.form && this.form.url) {
			this.url = this.form.url;
		}
		this.id = String.uniqueID();
		if (config.model !== undefined) {
			if (config.model.type === undefined) {
				config.model.type = 'model.Model';
			}
			this.model = ludo._new(config.model);
			if (this.model.url == undefined) {
				this.model._setUrl(this.getUrl());
			}
			this.model.addEvent('success', function (json) {
				this.fireEvent('success', json);
				this.fireEvent('clean');
			}.bind(this));
			this.model.addEvent('failure', function (json) {
				this.fireEvent('failure', json);
			}.bind(this));
			this.model.addEvent('servererror', function (text, error) {
				this.fireEvent('servererror', [text, error]);
			}.bind(this))
		}
		if (config.listeners !== undefined) {
			this.addEvents(config.listeners);
		}
		this.getFormElements();
	},

	/**
	 * Get all form elements, storage them in an array and add valid and invalid events to them
	 * @method getFormElements
	 * @private
	 */
	getFormElements:function () {
		if (!this.component.isRendered) {
			this.getFormElements.delay(100, this);
			return;
		}

		var children = this.component.getAllChildren();
		children.push(this.component);

		var c;
		for (var i = 0, len = children.length; i < len; i++) {
			c = children[i];

			if (c.getProgressBarId !== undefined) {
				this.registerProgressBar(c);
				if (this.model) {
					this.model.registerProgressBar(c);
				}
			}
			else if (c.isFormElement()) {
				this.registerFormElement(c);
			} else if (c.tpl && this.model) {
				this.model.registerView(c);
			}
		}

		this.fireEvent((this.invalidIds.length == 0) ? 'valid' : 'invalid');
		this.fireEvent((this.dirtyIds.length == 0) ? 'clean' : 'dirty');
	},

	registerFormElement:function (c) {
		if (this.formComponents.indexOf(c) >= 0) {
			return;
		}

		if (c.isFileUploadComponent) {
			this.fileUploadComponents.push(c);
		}
		this.formComponents.push(c);

		c.addEvent('valid', this.onValidFormElement.bind(this));
		c.addEvent('invalid', this.onInvalidFormElement.bind(this));
		c.addEvent('dirty', this.onDirtyFormElement.bind(this));
		c.addEvent('clean', this.onCleanFormElement.bind(this));

		if (!c.isValid()) {
			this.invalidIds.push(c.getId());
		}

		if (c.isDirty()) {
			this.dirtyIds.push(c.getId());
		}

		if (this.model) {
			this.model.registerFormComponent(c);
		}

	},

	registerProgressBar:function (component) {
		if (!this.progressBar) {
			this.progressBar = component;
		}
	},

	onDirtyFormElement:function (value, formComponent) {
		var elId = formComponent.getId();
		if (this.dirtyIds.indexOf(elId) == -1) {
			this.dirtyIds.push(elId);
		}
		/**
		 * @event dirty
		 * @description Fired when value of one or more form components are different from their original start value
		 * @param {Object} formComponent
		 */
		this.fireEvent('dirty', formComponent);
	},

	onCleanFormElement:function (value, formComponent) {
		this.dirtyIds.erase(formComponent.getId());

		if (this.dirtyIds.length == 0) {
			/**
			 * @event clean
			 * @description Fired when value of all components are equal to their original start value
			 */
			this.fireEvent('clean');
		}
	},

	/**
	 * One form element is valid. Fire valid event if all form elements are valid
	 * @method onValidFormElement
	 * @private
	 * @param {String} value
	 * @param {object } formComponent
	 */

	onValidFormElement:function (value, formComponent) {
		this.invalidIds.erase(formComponent.getId());
		if (this.invalidIds.length == 0) {
			/**
			 * @event valid
			 * @param {Object} form.Manager
			 * @description form.SubmitButton listens to this event which is fired
			 * when all form elements inside a component are valid. The submit button will
			 * be enabled automatically when this event is fired.
			 */
			this.fireEvent('valid', this);

		}
	},
	/**
	 * Set component invalid when a form element inside it is invalid
	 *
	 * @method onInvalidFormElement
	 * @private
	 * @param {String} value
	 * @param {Object} formComponent
	 */
	onInvalidFormElement:function (value, formComponent) {

		var elId = formComponent.getId();
		if (this.invalidIds.indexOf(elId) == -1) {
			this.invalidIds.push(elId);
		}
		/**
		 * @event invalid
		 * @param {Object} form.Manager
		 * @description form.SubmitButton listens to this event which is fired
		 * when one or more form elements inside a component is invalid. The submit
		 * button will be disabled automatically when this event is fired.
		 */
		this.fireEvent('invalid', this);
	},
	/**
	 * Validate form and fire "invalid" or "valid" event
	 * @method validate
	 * @return void
	 */
	validate:function () {
		if (this.invalidIds.length > 0) {
			this.fireEvent('invalid', this);
		} else {
			this.fireEvent('valid', this);
		}
	},
	/**
	 * @method isValid
	 * @private
	 * @description Returns true when form is valid.
	 */
	isValid:function () {
		return this.invalidIds.length === 0;
	},
	/**
	 * @method getValues
	 * @private
	 * @description Return array of values of all form elements inside this component. The format is [{name:value},{name:value}]
	 */
	getValues:function () {

		var ret = {};
		for (var i = 0; i < this.formComponents.length; i++) {
			var el = this.formComponents[i];
			ret[el.getName()] = el.getValue();
		}

		return ret;
	},

	/**
	 * Submit form to server. The ludo.View.submit() method calls this
	 * @method submit
	 * @private
	 */
	submit:function () {
		/**
		 * Event fired before form is submitted
		 * @event startSubmit
		 */
		var el;
		if (el = this.getUnfinishedFileUploadComponent()) {
			el.upload();
			return;
		}
		this.component.fireEvent('beforesubmit');
		if (this.model) {
			this.model.save(this.getValues());
		}
		else {
			this.save();
		}
	},

	getUnfinishedFileUploadComponent:function () {
		for (var i = 0; i < this.fileUploadComponents.length; i++) {
			if (this.fileUploadComponents[i].hasFileToUpload()) {
				this.fileUploadComponents[i].addEvent('submit', this.submit.bind(this));
				return this.fileUploadComponents[i];
			}
		}
		return undefined;
	},

	save:function () {
		var url = this.getUrl();
		if (url) {
			this.fireEvent('invalid');
            this.request().send('save', undefined, {
                "progressBarId":this.getProgressBarId(),
                "data" : this.getValues()
            });
		}
	},
    _request:undefined,
    request:function(){
        if(this._request === undefined){
            this._request = new ludo.remote.JSON({
                url:this.url,
                resource : 'Form',
                method:this.form.method ? this.form.method : 'post',
                listeners:{
                    "success":function (request) {
                        this.commitFormElements();
                        /**
                         * Event fired after a form has been saved successfully.
                         * To add listeners, use <br>
                         * ludo.View.getFormManager().addEvent('success', fn);
                         * @event success
                         * @param {Object} JSON response from server
                         */
                        this.fireEvent('success', [request.getResponse(), this.component]);

                        this.fireEvent('clean');
                    }.bind(this),
                    "failure":function (request) {
                        /**
                         * Event fired after form submission when success parameter in response is false.
                         * To add listeners, use <br>
                         * ludo.View.getFormManager().addEvent('failure', fn);<br>
                         * @event failure
                         * @param {Object} JSON response from server
                         * @param {Object} Component
                         */
                        this.fireEvent('failure', [request.getResponse(), this.component]);
                    }.bind(this),
                    "error":function (request) {
                        /**
                         * Server error event. Fired when the server didn't handle the request
                         * @event servererror
                         * @param {String} error text
                         * @param {String} error message
                         */
                        this.fireEvent('servererror', [request.getErrorText(), request.getErrorCode()]);
                        this.fireEvent('valid', this);
                    }.bind(this)
                }
            });
        }
        return this._request;
    },

	getProgressBarId:function () {
		return this.progressBar ? this.progressBar.getProgressBarId() : undefined;
	},

	commitFormElements:function () {
		for (var i = 0; i < this.formComponents.length; i++) {
			this.formComponents[i].commit();
		}
	},

	reset:function () {
		for (var i = 0; i < this.formComponents.length; i++) {
			this.formComponents[i].reset();
		}
		this.dirtyIds = [];
		this.fireEvent('clean');
		this.fireEvent('reset');
	},

	clear:function () {
		for (var i = 0; i < this.formComponents.length; i++) {
			this.formComponents[i].clear();
		}
		this.dirtyIds = [];
		this.fireEvent('clean');
		this.fireEvent('clear');
	},

	/**
	 * @method isDirty
	 * @private
	 * @description Returns true if one or more form elements of component have value different from it' original
	 */
	isDirty:function () {
		return this.dirtyIds.length > 0;
	},

	/**
	 * Returns reference to ludo.model.Model object
	 * @method getModel
	 * @private
	 */
	getModel:function () {
		return this.model;
	}
});
/**
 * Special Button for form submission.
 * This button will automatically be disabled when a form is invalid, and automatically enabled when it's valid.
 * A form consists of all form elements of parent component, including form elements of child components.
 * @namespace form
 * @class SubmitButton
 * @extends form.Button
 */
ludo.form.SubmitButton = new Class({
	Extends:ludo.form.Button,
	type:'form.SubmitButton',
	value:'Submit',
	component:undefined,
	disableOnInvalid:true,

	ludoRendered:function () {
		this.parent();
		this.component = this.getParentComponent();
		var manager = this.component.getFormManager();
		if (this.component) {
			manager.addEvent('valid', this.enable.bind(this));
			manager.addEvent('invalid', this.disable.bind(this));
		}
		if(!manager.isValid()){
			this.disable();
		}
		this.addEvent('click', this.submit.bind(this));
	},

	submit:function () {
		if (this.component) {
			this.component.submit();
		}
	}
});
/**
 * Cancel button. This is a pre-configured ludo.form.Button which will close/hide parent component on click.
 * Default value of this button is "Cancel".
 * @namespace form
 * @class CancelButton
 * @extends form.Button
 */
ludo.form.CancelButton = new Class({
    Extends:ludo.form.Button,
    type:'form.CancelButton',
    /**
     * @attribute value
     * @description Default value of button
     * @default 'Cancel'
     */
    value:'Cancel',

    component:undefined,

    ludoRendered:function () {
        this.parent();
        this.component = this.getParentComponent();
        this.addEvent('click', this.hideComponent.bind(this));
    },

    hideComponent:function () {
        if (this.component) {
            this.component.hide();
        }
    }
});
/**
 * Special Button used to reset all form fields of component back to it's original state.
 * This button will automatically be disabled when the form is "clean", and disabled when it's "dirty".
 * @namespace form
 * @class ResetButton
 * @extends form.Button
 */
ludo.form.ResetButton = new Class({
    Extends:ludo.form.Button,
    type:'form.ResetButton',
    /**
     * Value of button
     * @attribute {String} value
     * @default 'Reset'
     */
    value:'Reset',

    component:undefined,

    ludoRendered:function () {
        this.parent();
        this.component = this.getParentComponent();
        var manager = this.component.getFormManager();
        if (this.component) {
            manager.addEvent('dirty', this.enable.bind(this));
            manager.addEvent('clean', this.disable.bind(this));
        }

        if(!manager.isDirty()){
            this.disable();
        }
        this.addEvent('click', this.reset.bind(this));
    },

    reset:function () {
        if (this.component) {
            this.component.reset();
        }
    }
});
/**
 * @namespace form
 * @class Combo
 * @extends form.Element
 */
ludo.form.Combo = new Class({
    Extends:ludo.form.Element,
    type:'form.Combo',
    direction:'horizontal',
    height:25,
    labelWidth:0,
    comboMenu:undefined,
    menuItems:null,
    showOnClick:true,
    records : [],
    selectedRecord:undefined,
    remote : {
        isJSON: true
    },

    /**
     * Records for the drop down,<br>
     * example: [{ id: 1, title: 'Record One', id: 2, title: 'Record two' }]<br>
     * The combo can also be populated remotely by specifying remote properties, example:<br>
     * remote:{<br>
     *    url:'my-url.php',<br>
     *    data:{<br>
     *        getRecords:1<br>
     *    }<br>
     *}<br>
     *<br>
     *The response should return structure like this:<br>
     *{ success : true, data: [{ id: 1, title: 'Record One', id: 2, title: 'Record two' }] }
     * @attribute {Array} data
     * @default undefined
     */
    data : undefined,

    getMenuDirection:function () {
        return 'vertical'
    },

    ludoDOM:function () {
        this.parent();
        var el = this.els.arrow = new Element('div');
        ludo.dom.addClass(el, 'ludo-combo-arrow');
        this.getEl().adopt(el);

        el = this.getEl();
        this.getBody().style.cursor = 'pointer';

        el.style.position = 'relative';
        el.style.overflow = 'visible';
        ludo.dom.addClass(el, 'ludo-combo');

    },
    ludoEvents:function () {
        this.parent();
        this.getBody().addEvent('click', this.toggleMenu.bind(this));
        this.getEventEl().addEvent('resize', this.positionMenu.bind(this));
        this.getEventEl().addEvent('click', this.autoHide.bind(this));
    },
    ludoRendered:function () {
        this.parent();
        var el = this.getEl();
        this.getBody().style.lineHeight = (this.getHeight() - ludo.dom.getPH(el) - ludo.dom.getBH(el)) + 'px';
    },

    autoHide : function(e){
        if(!e.target.hasClass('ludo-combo') && !e.target.getParent('.ludo-combo')){
            this.menu.hide.delay(100, this.menu);
        }
    },
    insertJSON:function (json) {
        this.records = json.data;
        this.data = json.data;

        this.menuItemsToRecords(this.records);
        this.addListenersToMenuItems(this.records);
        this.createMenu();

        this.selectRecord(this.records[0]);
    },

    menuItemsToRecords:function (records) {
        this.menuItems = [];
        for (var i = 0; i < records.length; i++) {
            this.menuItems.push({
                label:records[i].title,
                record:records[i]
            });
        }
    },
    addListenersToMenuItems:function () {
        for (var i = 0; i < this.menuItems.length; i++) {
            var el = this.menuItems[i];
            if (el !== '|') {
                if (!el.listeners) {
                    el.listeners = {};
                }
                el.listeners.click = this.menuClick.bind(this);
            }
        }
    },
    /**
     * Return value, i.e. id of selected record
     * @method getValue
     * @return string value
     */
    getValue:function () {
        if (this.selectedRecord) {
            return this.selectedRecord.id;
        }
        return null;
    },
    /**
     * Return selected record
     * @method getSelectedRecord
     * @return {Object} selected record
     */
    getSelectedRecord:function () {
        return this.selectedRecord;
    },

    menuClick:function (obj) {
        this.selectRecord(obj.getRecord());
        this.menu.hide();
        /**
         * @event change
         * @param {Object} selected record
         * @param Component this
         */
        this.fireEvent('change', [ this.selectedRecord, this ]);
    },

    selectRecord:function (record) {
        this.selectedRecord = record;
        this.setHtml(this.selectedRecord.title);
        this.menu.selectRecord(record);
    },

    setValue : function(value){
        for(var i=0;i<this.records.length;i++){
            if(this.records[i].id && this.records[i].id === value){
                this.selectRecord(this.records[i]);
            }
        }
    },

    toggleMenu:function () {
        if (this.menu.isVisible()) {
            this.menu.hide();
        } else {
            this.menu.show();
            this.positionMenu();
        }
    },

    positionMenu:function () {
        var el = this.menu.getEl();
        var coordinates = this.getEl().getCoordinates();
        el.style.top = (coordinates.top + coordinates.height) + 'px';
        el.style.left = coordinates.left + 'px';
    },

    createMenu:function () {
        this.menu = new ludo.Menu({
            cls:'ludo-combo-menu',
            els:{
                parent:document.body
            },
            direction:'vertical',
            width:this.getWidth(),
            children:this.menuItems

        });
        this.menu.getEl().setStyles({
            position:'absolute',
            width:200
        });
        this.menu.hide();
    }

});

/**
 * @namespace form
 * @class ComboTree
 * @description A "combo" where you select value from a tree. id of clicked tree node will be set as
 * value.
 * @extends form.Element
 */
ludo.form.ComboTree = new Class({
    Extends:ludo.form.Element,
    type:'form.ComboTree',
    /**
     * Configuration for tree panel. It can be a new config for ludo.tree.Tree or
     * a simple reference to your own pre-configured tree, example:
     * { width: 500, height: 500, type: 'myApp.tree.Folders'
     * 'myApp.tree.Folders' will here be  class named ludo.myApp.tree.Folders
     * This is an example of a custom made ludo.tree.Tree:<br>
     * ludo.chess.view.folder.Tree = new Class({<br>
     Extends:ludo.tree.Tree,<br>
     module:'folder.tree',<br>
     remote:{<br>
     url:window.ludo.chess.URL,<br>
     data:{<br>
     getFolders:1<br>
     }<br>
     },<br>
     nodeTpl:'<img src="' + window.ludo.chess.ROOT + 'images/{icon}"><span>{title}</span>',<br><br>

     recordConfig:{<br>
     'folder':{<br>
     selectable:false,<br>
     defaults:{<br>
     icon:'folder.png'<br>
     }<br>
     },<br>
     'database':{<br>
     selectable:true,<br>
     defaults:{<br>
     icon:'database.png'<br>
     }<br>
     }<br>
     },<br><br>

     treeConfig:{<br>
     defaultValues:{<br>
     icon:'folder.png'<br>
     }<br>
     },<br>
     <br>
     ludoEvents:function () {<br>
     this.parent();<br>
     this.addEvent('selectrecord', this.selectDatabase.bind(this));<br>
     },<br>
     <br>
     selectDatabase:function (record) {<br>
     this.fireEvent('selectdatabase', record);<br>
     }<br>
     });
     * @attribute treeConfig
	 * @type Object
     * @default undefined
     */
    treeConfig:undefined,

    /**
     * Text to display in combo when no value is selected
     * @attribute emptyText
	 * @type String
     * @default '' (empty string);
     */
    emptyText:'',

    width:400,
    height:26,
    /**
     *
     * @attribute Object inputConfig
     *
     */
    inputConfig:{
        fieldWidth:440,
        labelWidth:1,
        width:350
    },
    selectedRecord:undefined,
    layout:{
        type:'cols'
    },
    treePanel:undefined,
    input:undefined,
    searchable:false,
    timeStamp:0,
    currentSearchValue:'',

    ludoConfig:function (config) {
        this.parent(config);
        if (config.searchable !== undefined) this.searchable = config.searchable;
        this.inputConfig = config.inputConfig || this.inputConfig;
        this.treeConfig = config.treeConfig;
        if (this.treeConfig.type === undefined)this.treeConfig.type = 'tree.Tree';
        this.inputConfig.type = 'form.Text';
        this.inputConfig.stretchField = true;
        if (config.emptyText !== undefined)this.emptyText = config.emptyText;
    },

    ludoEvents:function () {
        this.parent();
        document.body.addEvent('mousedown', this.autoHide.bind(this));
    },

    ludoDOM:function () {


        if (this.label) {
            this.addChild({
                html:'<label>' + this.label + ':</label>',
                width:this.labelWidth
            });
        }

        this.viewField = this.addChild({
            type:'form.ComboField',
            weight:1
        });
        this.viewField.addEvent('click', this.showTree.bind(this));

        this.input = this.addChild(this.inputConfig);
        this.input.addEvent('focus', this.showTree.bind(this));
        this.input.addEvent('focus', this.selectInputText.bind(this));
        this.input.addEvent('blur', this.blurInput.bind(this));
        this.input.addEvent('key_up', this.filter.bind(this));
        this.input.addEvent('key_down', this.keyDown.bind(this));
        this.input.hide();

        this.treePanel = new ludo.Window({
            cls:'ludo-Filter-Tree-Window',
            width:this.treeConfig.width,
            resizeTop:false,
            resizeLeft:false,
            minWidth:this.fieldWidth,
            height:this.treeConfig.height,
            titleBar:false,
            els:{
                parent:document.body
            },
            layout:'fill',
            children:[this.treeConfig]
        });
        this.treePanel.hide();
        this.treePanel.addEvent('beforeresize', this.setBusy.bind(this));
        this.treePanel.addEvent('afterresize', this.setNotBusy.bind(this));

        this.treePanel.children[0].addEvent('selectrecord', this.receiveSelectedRecord.bind(this));

        this.parent();

        this.getEl().addClass('ludo-filter-tree');

        this.resize.delay(100, this);

        this.resizeChildren();
    },

    ludoRendered:function () {
        this.parent();
        if (this.emptyText) {
            this.setViewValue(this.emptyText);
        }
    },

    busyWithResize:false,

    setBusy:function () {
        this.busyWithResize = true;
    },

    setNotBusy:function () {
        this.setNotBusyAfterDelay.delay(500, this);
    },

    setNotBusyAfterDelay:function () {
        this.busyWithResize = false;
    },

    arrowClick:function () {
        if (this.treePanel.isHidden()) {
            this.selectInputText();
            this.showTree();
        } else {
            this.hideTree();
        }
    },

    selectInputText:function () {
        this.input.getFormEl().select();
    },
    blurInput:function () {
        this.input.getFormEl().removeClass('ludo-filter-tree-input-active');
    },

    autoHide:function (e) {
        if (this.busyWithResize) {
            return;
        }
        if (!this.treePanel.isVisible()) {
            return;
        }
        var el = e.target;

        if (el.id == this.input.getFormEl().id || el.hasClass('ludo-shim-resize')) {
            return;
        }
        var viewField = this.viewField.getEl();
        if (el.id == viewField.id || el.getParent('#' + viewField.id)) {
            return;
        }
        if (el.getParent('.ludo-shim-resize')) {
            return;
        }
        if (!el.getParent('#' + this.input.getFormEl().id) && !el.getParent('#' + this.treePanel.id)) {
            this.hideTree();
        }
    },

    hideTree:function () {
        this.treePanel.hide();
        if (this.searchable) {
            this.input.hide();
            this.viewField.show();
        }
    },

    keyDown:function (key) {
        if (key === 'esc' || key == 'tab') {
            this.hideTree();
        }
    },

    filter:function (key) {
        if (key === 'esc') {
            return;
        }
        this.treePanel.show();

        var val = this.input.getValue();
        if (val == this.currentSearchValue) {
            return;
        }
        var d = new Date();
        this.timeStamp = d.getTime();

        this.filterAfterDelay(this.input.getValue());
        this.currentSearchValue = val;
    },

    filterAfterDelay:function (val) {
        var d = new Date();
        if (d.getTime() - this.timeStamp < 200) {
            this.filterAfterDelay.delay(100, this, val);
            return;
        }
        this.timeStamp = d.getTime();
        if (val == this.input.getValue()) {
            this.treePanel.children[0].filter(this.input.getValue());
        }
    },

    showTree:function () {

        if (this.searchable) {
            this.viewField.hide();
            this.input.show();
            this.input.getFormEl().addClass('ludo-filter-tree-input-active');
            this.input.getFormEl().focus();
        }

        this.treePanel.show();
        this.positionTree();
        this.resizeChildren();
    },

    setViewValue:function (value) {
        this.input.setValue(value);
        this.viewField.setViewValue(value);
    },

    positionTree:function () {
        var el;
        if (this.searchable) {
            el = this.input.getEl();

        } else {
            el = this.viewField.getEl();
        }
        var pos = el.getCoordinates();
        this.treePanel.setPosition({
            left:pos.left,
            top:pos.top + el.getSize().y
        });
    },

    getFormEl:function () {
          return this.input.getFormEl();
    },

    selectRecord:function (record) {
        this.treePanel.children[0].selectRecord(record);
    },

    receiveSelectedRecord:function (record) {
        this.setValue(record.id);
        this.setViewValue(record.title);
        this.fireEvent('selectrecord', [this, record]);
        this.hideTree.delay(100, this);
    },

    /**
     * Return id of selected record
     * @method getValue
     * @return {String} id (tree.selectedRecord.id);
     */
    getValue:function () {
        return this.value;
    },

    /**
     * Return selected record
     * @method getSelectedRecord
     * @return object record
     */
    getSelectedRecord:function () {
        return this.treePanel.children[0].getSelectedRecord();
    },

    getParentRecord:function (record) {
        return this.treePanel.children[0].getParentRecord(record);
    }
});

ludo.form.ComboField = new Class({
    Extends:ludo.View,
    cls:'ludo-Filter-Tree-Combo-Field',

    ludoEvents:function () {
        this.parent();
        this.getBody().addEvent('click', this.clickEvent.bind(this));
    },

    clickEvent:function () {
        this.fireEvent('click');
    },

    setViewValue:function (value) {
        this.els.valueField.set('html', value);
    },

    ludoDOM:function () {
        this.parent();
        var el = new Element('div');
        ludo.dom.addClass(el, 'ludo-Filter-Tree-Field-Arrow');
        this.getBody().adopt(el);

        var left = new Element('div');
        ludo.dom.addClass(left, 'ludo-Filter-Tree-Bg-Left');
        this.getBody().adopt(left);
        var right = new Element('div');
        ludo.dom.addClass(right, 'ludo-Filter-Tree-Bg-Right');
        this.getBody().adopt(right);

        var valueField = this.els.valueField = new Element('div');
        ludo.dom.addClass(valueField, 'ludo-Filter-Tree-Combo-Value');
        this.getBody().adopt(valueField);
    }
});
ludo.form.Hidden = new Class({
    Extends: ludo.form.Element,
    type : 'form.Hidden',
    labelWidth : 0,
    defaultValue : '',
    hidden: true,

    ludoDOM : function() {
        this.parent();
        this.els.formEl = new Element('input');
        this.els.formEl.setProperty('type', 'hidden');
        this.els.formEl.id = this.getFormElId();
        this.getBody().adopt(this.els.formEl);
    },

    ludoRendered : function(){
        this.parent();
        this.hide();
    },
    getHeight : function(){
        return 0;
    },
    getWidth : function(){
        return 0;
    }
});
/**
 * @namespace form
 * @class Text
 * @description Form input text
 * @extends form.LabelElement
 *
 */
ludo.form.Text = new Class({
	Extends:ludo.form.LabelElement,
	type:'form.Text',
	labelWidth:100,
	defaultValue:'',
	/**
	 * Max length of input field
	 * @attribute maxLength
	 * @type int
	 * @default undefined
	 */
	maxLength:undefined,

	/**
	 * Minimum length of value. invalid event will be fired when
	 * value is too short. The value will be trimmed before checking size
	 * @attribute minLength
	 * @type {Number}
	 * @default undefined
	 */
	minLength:undefined,

	/**
	 * When true, capitalize first letter automatically
	 * @attribute {Boolean} ucFirst
	 * @default false
	 */
	ucFirst:false,

	/**
	 When true, capitalize first letter of every word while typing
	 Note! ucWords is not an option for ludo.form.Textarea
	 @attribute {Boolean} ucWords
	 @default false
	 */
	ucWords:false,

	inputType:'text',
	inputTag:'input',

	/**
	 Regular expression used for validation
	 @attribute regex
	 @type String
	 @default undefined
	 @example
	 	regex:'[0-9]
	 This will only validate numbers
	 */
	regex:undefined,

	/**
	 Regular expression flag used when regex is defined
	 @attribute {String} regexFlags
	 @default 'gi'
	 @example
	 	regexFlags:'gi';
	 For global case-insensitive search
	 */

	regexFlags:'gi',

	/**
	Run RegEx validation on key strokes. Only keys matching "regex" will be added to the text field.
	@property validateKeyStrokes
	@type {Boolean}
	@default false
	*/
	validateKeyStrokes:false,

	/**
	 * current pixel width of form element
	 * @property int
	 * @private
	 */
	formFieldWidth:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		this.defaultValue = config.defaultValue || this.defaultValue;
		this.maxLength = config.maxLength || this.maxLength;
		if (config.regex !== undefined) this.regex = config.regex;
		if (config.regexFlags !== undefined) this.regexFlags = config.regexFlags;
		if (config.minLength !== undefined) this.minLength = config.minLength;
		if (config.validateKeyStrokes !== undefined) this.validateKeyStrokes = config.validateKeyStrokes;
		if (config.ucFirst !== undefined) this.ucFirst = config.ucFirst;
		if (config.ucWords !== undefined) this.ucWords = config.ucWords;
	},

	ludoEvents:function () {
		this.parent();
		var el = this.getFormEl();
		if (this.validateKeyStrokes) {
			el.addEvent('keydown', this.validateKey.bind(this));
		}
		if (this.ucFirst || this.ucWords) {
			el.addEvent('keyup', this.upperCaseWords.bind(this));
		}
		this.getFormEl().addEvent('keyup', this.sendKeyEvent.bind(this));
	},

	sendKeyEvent:function(){
		/**
		 * Event fired when a key is pressed
		 * @event key
		 * @param {String} value
		 */
		this.fireEvent('key', this.els.formEl.value);
	},

	validateKey:function (e) {
		if (e.control || e.alt) {
			return;
		}

		if (this.regex && e.key && e.key.length == 1) {
			var reg = new RegExp(this.regex);
			if (!reg.test(e.key)) {
				return false;
			}
		}
	},
	/**
	 * Return width of form field in pixels
	 * @method getFieldWidth
	 * @return {Number} width
	 */
	getFieldWidth:function () {
		return this.formFieldWidth;
	},
	/**
	 * Focus form element
	 * @method focus
	 * @return void
	 */
	focus:function () {
		this.parent();
		this.getFormEl().focus();
	},
	/**
	 * Returns true if current value is valid
	 * A value is invalid when
	 * - required is true and trimmed length of value is 0
	 * - length of value is greater than 0 but less than this.minLength
	 * - length of value is greater than 0 but does not match this.regex (Regular expression).
	 * @method isValid
	 * @return {Boolean} valid
	 */
	isValid:function () {
		var valid = this.parent();
		if (!valid)return false;
		var val = this.getFormEl().get('value').trim();

		if (this.minLength && val.length < this.minLength) {
			return false;
		}
		if (val.length == 0) {
			return !this.required;
		}
		if (this.maxLength && val.length > this.maxLength) {
			return false;
		}
		if (this.regex) {
			var regEx = new RegExp(this.regex, this.regexFlags);
			return regEx.test(this.getValue());
		}
		return true;
	},

	validate:function () {
		this.parent();
		if (!this.isValid() && !this._focus) {
			this.getFormEl().addClass('ludo-form-el-invalid');
		}
	},
	keyUp:function (e) {
		this.parent(e);
		this.validate();
	},

	upperCaseWords:function (e) {
		if (this.ucFirst || this.ucWords) {
			if (e.control || e.alt || this.hasSelection())return;
			var val = this.getFormEl().get('value');
			if (val.length == 0) {
				return;
			}
			if (this.ucWords && val.length > 1) {
				var tokens = val.split(/\s/g);
				for (var i = 0; i < tokens.length; i++) {
					if (tokens[i].length == 1) {
						tokens[i] = tokens[i].toUpperCase();
					} else {
						tokens[i] = tokens[i].substr(0, 1).toUpperCase() + tokens[i].substr(1);
					}
				}
				this.getFormEl().set('value', tokens.join(' '));
			}
			else {
				val = val.substr(0, 1).toUpperCase() + val.substr(1);
				this.getFormEl().set('value', val);
			}
		}
	},

	hasSelection:function () {
		var start = this.getSelectionStart();
		var end = this.getSelectionEnd();
		return end > start;
	},

	getSelectionStart:function () {
		if (this.els.formEl.createTextRange) {
			var r = document.selection.createRange().duplicate();
			r.moveEnd('character', this.els.formEl.value.length);
			if (r.text == '') return this.els.formEl.value.length;
			return this.els.formEl.value.lastIndexOf(r.text);
		} else return this.els.formEl.selectionStart;
	},

	getSelectionEnd:function () {
		if (this.els.formEl.createTextRange) {
			var r = document.selection.createRange().duplicate();
			r.moveStart('character', -this.els.formEl.value.length);
			return r.text.length;
		} else return this.els.formEl.selectionEnd;
	}

});

/**
 * Text Area field
 * @namespace form
 * @class Textarea
 * @extends form.Element
 */
ludo.form.Textarea = new Class({
    Extends:ludo.form.Text,
    type:'form.Textarea',
    inputType:undefined,
    inputTag:'textarea',
    autoHeight:false,
    overflow:'hidden',

    ludoConfig:function (config) {
        this.parent(config);
        this.ucWords = false;
    },

    resizeDOM:function () {
        this.parent();
        if (this.layout && this.layout.weight) {
            if (!this.label) {
                var w = this.getInnerWidthOfBody();
                if (w <= 0)return;
                this.els.formEl.setStyle('width', this.getInnerWidthOfBody() + 'px');
            }
            var parentComponent = this.getParent();
            var height;
            if ((parentComponent && parentComponent.layout.type === 'fill')) {
                height = parentComponent.getInnerHeightOfBody();
            } else {
                height = this.getHeight();

            }
            var c = this.getEl();
            var e = this.getBody();
            var f = this.els.formEl;

            height -= ( ludo.dom.getMH(c) + ludo.dom.getPH(c) + ludo.dom.getBH(c));
            height -= ( ludo.dom.getMH(e) + ludo.dom.getPH(e) + ludo.dom.getBH(e));
            height -= ( ludo.dom.getMH(f) + ludo.dom.getPH(f) + ludo.dom.getBH(f));

            height -= 1;
            if (height > 0) {
                this.els.formEl.setStyle('height', height);
            }
        }
    }
});
/**
 * Read only field, used for display only
 * @namespace form
 * @class DisplayField
 * @extends form.Text
 */
ludo.form.DisplayField = new Class({
	Extends:ludo.form.LabelElement,
	type:'form.DisplayField',
	inputTag:'span',
	inputType:'',

	/** Custom tpl for the display field
	 @attribute tpl
	 @type String
	 @default ''
	 @example
	 	tpl:'<a href="mailto:{value}">{value}</a>'
	 {value} will in this example be replaced by value of DisplayField.
	 */
	tpl:'',
	setValue:function (value) {
		if (!value) {
			this.getFormEl().set('html', '');
			return;
		}
		this.setTextContent(value);
	},

	ludoRendered:function(){
		this.parent();
		this.setTextContent(this.value);
	},

	setTextContent:function(value){
		if (this.tpl) {
			this.getFormEl().set('html', this.getTplParser().getCompiled({ value:value }));
		} else {
			this.getFormEl().set('html', value ? value : '');

		}
	},

	isValid:function () {
		return true;
	},

	getValue:function () {
		return this.value;
	}

});
/**
 * Class for checkbox form elements
 * @namespace form
 * @class Checkbox
 * @extends form.LabelElement
 */
ludo.form.Checkbox = new Class({
    Extends:ludo.form.LabelElement,
    type:'form.Checkbox',
    inputType:'checkbox',
    stretchField:false,
    labelWidth:undefined,
    /**
     * Image to be displayed above the checkbox-/radio button
     * @attribute image (Path to image).
     * @type string
     * @default null
     */
    image:null,
    /**
     * Initial state
     * @attribute {Boolean} checked
     * @type {Boolean}
     * @default false
     */
    checked:false,
    height:undefined,
    labelSuffix : '',

    fieldTpl:['<table cellpadding="0" cellspacing="0" border="0" width="100%">',
        '<tbody>',
        '<tr class="checkbox-image-row" style="display:none">',
        '<td colspan="2" class="input-image"></td>',
        '</tr>',
        '<tr class="input-row">',
        '<td class="input-cell" width="30"></td>',
        '<td><label></label></td>',
        '<td class="suffix-cell" style="display:none"></td>',
        '</tr>',
        '</tbody>',
        '</table>'
    ],

    ludoConfig:function (config) {
        this.parent(config);
        this.inputType = config.inputType || this.inputType;
        this.image = config.image || this.image;
        this.checked = config.checked || this.checked;
        if (!this.value)this.value = '1';
    },

    ludoDOM:function () {
        this.parent();
        if (this.image) {
            this.addRadioImage();
        }
    },

    addInput:function () {
        var id = this.getFormElId();
        var radio;
        if (Browser.ie && Browser.version < 9) {
            radio = document.createElement('<input type="' + this.inputType + '" name="' + this.getName() + '" value="' + this.value + '" id="' + id + '">');
            this.getInputCell().adopt(radio);
            this.els.formEl = document.id(radio);
        } else {
            radio = this.els.formEl = new Element('input');
            this.getInputCell().adopt(radio);
            radio.setProperties({
                'type':this.inputType,
                'name':this.getName(),
                'value':this.value,
                'id':id
            });
        }
        this.els.formEl.addEvent('click', this.toggleImage.bind(this));
        if (this.checked) {
            this.getFormEl().checked = true;
            this.toggleImage();
        }
    },

    addRadioImage:function () {
        var div = this.els.radioImageDiv = new Element('div');

        var radioDivInner = new Element('div');
        ludo.dom.addClass(radioDivInner, 'ludo-radio-image-inner');
        radioDivInner.setStyles({
            'width':'100%',
            'height':'100%',
            'background-repeat':'no-repeat',
            'background-position':'center center',
            'background-image':'url(' + this.image + ')'
        });

        div.adopt(radioDivInner);
        ludo.dom.addClass(div, 'ludo-radio-image');
        div.addEvent('click', this.clickOnImage.bind(this));
        this.getImageCell().adopt(div);
        this.getBody().getElement('.checkbox-image-row').style.display = '';
    },

    getImageCell:function () {
        if (this.els.imageCell === undefined) {
            this.els.imageCell = this.getBody().getElement('.input-image');
        }
        return this.els.imageCell;
    },

    setWidthOfLabel:function () {

    },

    clickOnImage:function () {
        if (this.inputType === 'checkbox') {
            this.setChecked(!this.getFormEl().checked)
        } else {
            this.check();
        }
    },
    /**
     * Return true if checkbox is checked, false otherwise
     * @method isChecked
     * @return {Boolean} checked
     */
    isChecked:function () {
        return this.getFormEl().getProperty('checked');
    },
    /**
     * Set checkbox to checked
     * @method check
     * @return void
     */
    check:function () {
        if (!this.isChecked()) {
            this.setChecked(true);
        }
    },
    /**
     * Uncheck checkbox
     * @method uncheck
     * @return void
     */
    uncheck:function () {
        if (this.isChecked()) {
            this.setChecked(false);
        }
    },

    focus:function () {

    },

    blur:function () {

    },

    getValue:function () {
        if (this.isChecked()) {
            return this.getFormEl().get('value');
        }
        return '';
    },
    /**
     * Set checkbox to checked or unchecked
     * @method setChecked
     * @param {Boolean} checked
     */
    setChecked:function (checked) {
        if(checked){
            this.getFormEl().setProperty('checked', '1');
        }else{
            this.getFormEl().removeProperty('checked');
        }

        this.fireEvent('change', [this.getValue(), this]);
        this.toggleImage();
    },

    toggleImage:function () {
        if (this.els.radioImageDiv) {
            if (this.isChecked()) {
                ludo.dom.addClass(this.els.radioImageDiv, 'ludo-radio-image-checked');
            } else {
                this.els.radioImageDiv.removeClass('ludo-radio-image-checked');
            }
        }
    }
});
/**
 * @namespace form
 * @class Radio
 * @extends form.Checkbox
 */
ludo.form.Radio = new Class({
    Extends : ludo.form.Checkbox,
    type : 'form.Radio',
    inputType : 'radio'
});
/*
 Javascript MD5 library - version 0.4

 Coded (2011) by Luigi Galli - LG@4e71.org - http://faultylabs.com

 Thanks to: Roberto Viola

 The below code is PUBLIC DOMAIN - NO WARRANTY!

 Changelog:
            Version 0.4   - 2011-06-19
            + added compact version (md5_compact_min.js), this is a slower but smaller version
              (more than 4KB lighter before stripping/minification)
            + added preliminary support for Typed Arrays (see:
              https://developer.mozilla.org/en/JavaScript_typed_arrays and
              http://www.khronos.org/registry/typedarray/specs/latest/)
              MD5() now accepts input data as ArrayBuffer, Float32Array, Float64Array,
              Int16Array, Int32Array, Int8Array, Uint16Array, Uint32Array or Uint8Array
            - moved unit tests to md5_test.js
            - minor refactoring

            Version 0.3.* - 2011-06-##
            - Internal dev versions

            Version 0.2 - 2011-05-22
            ** FIXED: serious integer overflow problems which could cause a wrong MD5 hash being returned

            Version 0.1 - 2011
            -Initial version
*/

if (typeof faultylabs == 'undefined') {
    faultylabs = {}
}

/*
   MD5()

    Computes the MD5 hash for the given input data

    input :  data as String - (Assumes Unicode code points are encoded as UTF-8. If you
                               attempt to digest Unicode strings using other encodings
                               you will get incorrect results!)

             data as array of characters - (Assumes Unicode code points are encoded as UTF-8. If you
                              attempt to digest Unicode strings using other encodings
                              you will get incorrect results!)

             data as array of bytes (plain javascript array of integer numbers)

             data as ArrayBuffer (see: https://developer.mozilla.org/en/JavaScript_typed_arrays)

             data as Float32Array, Float64Array, Int16Array, Int32Array, Int8Array, Uint16Array, Uint32Array or Uint8Array (see: https://developer.mozilla.org/en/JavaScript_typed_arrays)

             (DataView is not supported yet)

   output: MD5 hash (as Hex Uppercase String)
*/

faultylabs.MD5 = function(data) {

    // convert number to (unsigned) 32 bit hex, zero filled string
    function to_zerofilled_hex(n) {
        var t1 = (n >>> 0).toString(16)
        return "00000000".substr(0, 8 - t1.length) + t1
    }

    // convert array of chars to array of bytes
    function chars_to_bytes(ac) {
        var retval = []
        for (var i = 0; i < ac.length; i++) {
            retval = retval.concat(str_to_bytes(ac[i]))
        }
        return retval
    }


    // convert a 64 bit unsigned number to array of bytes. Little endian
    function int64_to_bytes(num) {
        var retval = []
        for (var i = 0; i < 8; i++) {
            retval.push(num & 0xFF)
            num = num >>> 8
        }
        return retval
    }

    //  32 bit left-rotation
    function rol(num, places) {
        return ((num << places) & 0xFFFFFFFF) | (num >>> (32 - places))
    }

    // The 4 MD5 functions
    function fF(b, c, d) {
        return (b & c) | (~b & d)
    }

    function fG(b, c, d) {
        return (d & b) | (~d & c)
    }

    function fH(b, c, d) {
        return b ^ c ^ d
    }

    function fI(b, c, d) {
        return c ^ (b | ~d)
    }

    // pick 4 bytes at specified offset. Little-endian is assumed
    function bytes_to_int32(arr, off) {
        return (arr[off + 3] << 24) | (arr[off + 2] << 16) | (arr[off + 1] << 8) | (arr[off])
    }

    /*
    Conver string to array of bytes in UTF-8 encoding
    See:
    http://www.dangrossman.info/2007/05/25/handling-utf-8-in-javascript-php-and-non-utf8-databases/
    http://stackoverflow.com/questions/1240408/reading-bytes-from-a-javascript-string
    How about a String.getBytes(<ENCODING>) for Javascript!? Isn't it time to add it?
    */
    function str_to_bytes(str) {
        var retval = [ ]
        for (var i = 0; i < str.length; i++)
            if (str.charCodeAt(i) <= 0x7F) {
                retval.push(str.charCodeAt(i))
            } else {
                var tmp = encodeURIComponent(str.charAt(i)).substr(1).split('%')
                for (var j = 0; j < tmp.length; j++) {
                    retval.push(parseInt(tmp[j], 0x10))
                }
            }
        return retval
    }


    // convert the 4 32-bit buffers to a 128 bit hex string. (Little-endian is assumed)
    function int128le_to_hex(a, b, c, d) {
        var ra = ""
        var t = 0
        var ta = 0
        for (var i = 3; i >= 0; i--) {
            ta = arguments[i]
            t = (ta & 0xFF)
            ta = ta >>> 8
            t = t << 8
            t = t | (ta & 0xFF)
            ta = ta >>> 8
            t = t << 8
            t = t | (ta & 0xFF)
            ta = ta >>> 8
            t = t << 8
            t = t | ta
            ra = ra + to_zerofilled_hex(t)
        }
        return ra
    }

    // conversion from typed byte array to plain javascript array
    function typed_to_plain(tarr) {
        var retval = new Array(tarr.length)
        for (var i = 0; i < tarr.length; i++) {
            retval[i] = tarr[i]
        }
        return retval
    }

    // check input data type and perform conversions if needed
    var databytes = null
    // String
    var type_mismatch = null
    if (typeof data == 'string') {
        // convert string to array bytes
        databytes = str_to_bytes(data)
    } else if (data.constructor == Array) {
        if (data.length === 0) {
            // if it's empty, just assume array of bytes
            databytes = data
        } else if (typeof data[0] == 'string') {
            databytes = chars_to_bytes(data)
        } else if (typeof data[0] == 'number') {
            databytes = data
        } else {
            type_mismatch = typeof data[0]
        }
    } else if (typeof ArrayBuffer != 'undefined') {
        if (data instanceof ArrayBuffer) {
            databytes = typed_to_plain(new Uint8Array(data))
        } else if ((data instanceof Uint8Array) || (data instanceof Int8Array)) {
            databytes = typed_to_plain(data)
        } else if ((data instanceof Uint32Array) || (data instanceof Int32Array) ||
               (data instanceof Uint16Array) || (data instanceof Int16Array) ||
               (data instanceof Float32Array) || (data instanceof Float64Array)
         ) {
            databytes = typed_to_plain(new Uint8Array(data.buffer))
        } else {
            type_mismatch = typeof data
        }
    } else {
        type_mismatch = typeof data
    }

    if (type_mismatch) {
        alert('MD5 type mismatch, cannot process ' + type_mismatch)
    }

    function _add(n1, n2) {
        return 0x0FFFFFFFF & (n1 + n2)
    }


    return do_digest()

    function do_digest() {

        // function update partial state for each run
        function updateRun(nf, sin32, dw32, b32) {
            var temp = d
            d = c
            c = b
            //b = b + rol(a + (nf + (sin32 + dw32)), b32)
            b = _add(b,
                rol(
                    _add(a,
                        _add(nf, _add(sin32, dw32))
                    ), b32
                )
            )
            a = temp
        }

        // save original length
        var org_len = databytes.length

        // first append the "1" + 7x "0"
        databytes.push(0x80)

        // determine required amount of padding
        var tail = databytes.length % 64
        // no room for msg length?
        if (tail > 56) {
            // pad to next 512 bit block
            for (var i = 0; i < (64 - tail); i++) {
                databytes.push(0x0)
            }
            tail = databytes.length % 64
        }
        for (i = 0; i < (56 - tail); i++) {
            databytes.push(0x0)
        }
        // message length in bits mod 512 should now be 448
        // append 64 bit, little-endian original msg length (in *bits*!)
        databytes = databytes.concat(int64_to_bytes(org_len * 8))

        // initialize 4x32 bit state
        var h0 = 0x67452301
        var h1 = 0xEFCDAB89
        var h2 = 0x98BADCFE
        var h3 = 0x10325476

        // temp buffers
        var a = 0, b = 0, c = 0, d = 0

        // Digest message
        for (i = 0; i < databytes.length / 64; i++) {
            // initialize run
            a = h0
            b = h1
            c = h2
            d = h3

            var ptr = i * 64

            // do 64 runs
            updateRun(fF(b, c, d), 0xd76aa478, bytes_to_int32(databytes, ptr), 7)
            updateRun(fF(b, c, d), 0xe8c7b756, bytes_to_int32(databytes, ptr + 4), 12)
            updateRun(fF(b, c, d), 0x242070db, bytes_to_int32(databytes, ptr + 8), 17)
            updateRun(fF(b, c, d), 0xc1bdceee, bytes_to_int32(databytes, ptr + 12), 22)
            updateRun(fF(b, c, d), 0xf57c0faf, bytes_to_int32(databytes, ptr + 16), 7)
            updateRun(fF(b, c, d), 0x4787c62a, bytes_to_int32(databytes, ptr + 20), 12)
            updateRun(fF(b, c, d), 0xa8304613, bytes_to_int32(databytes, ptr + 24), 17)
            updateRun(fF(b, c, d), 0xfd469501, bytes_to_int32(databytes, ptr + 28), 22)
            updateRun(fF(b, c, d), 0x698098d8, bytes_to_int32(databytes, ptr + 32), 7)
            updateRun(fF(b, c, d), 0x8b44f7af, bytes_to_int32(databytes, ptr + 36), 12)
            updateRun(fF(b, c, d), 0xffff5bb1, bytes_to_int32(databytes, ptr + 40), 17)
            updateRun(fF(b, c, d), 0x895cd7be, bytes_to_int32(databytes, ptr + 44), 22)
            updateRun(fF(b, c, d), 0x6b901122, bytes_to_int32(databytes, ptr + 48), 7)
            updateRun(fF(b, c, d), 0xfd987193, bytes_to_int32(databytes, ptr + 52), 12)
            updateRun(fF(b, c, d), 0xa679438e, bytes_to_int32(databytes, ptr + 56), 17)
            updateRun(fF(b, c, d), 0x49b40821, bytes_to_int32(databytes, ptr + 60), 22)
            updateRun(fG(b, c, d), 0xf61e2562, bytes_to_int32(databytes, ptr + 4), 5)
            updateRun(fG(b, c, d), 0xc040b340, bytes_to_int32(databytes, ptr + 24), 9)
            updateRun(fG(b, c, d), 0x265e5a51, bytes_to_int32(databytes, ptr + 44), 14)
            updateRun(fG(b, c, d), 0xe9b6c7aa, bytes_to_int32(databytes, ptr), 20)
            updateRun(fG(b, c, d), 0xd62f105d, bytes_to_int32(databytes, ptr + 20), 5)
            updateRun(fG(b, c, d), 0x2441453, bytes_to_int32(databytes, ptr + 40), 9)
            updateRun(fG(b, c, d), 0xd8a1e681, bytes_to_int32(databytes, ptr + 60), 14)
            updateRun(fG(b, c, d), 0xe7d3fbc8, bytes_to_int32(databytes, ptr + 16), 20)
            updateRun(fG(b, c, d), 0x21e1cde6, bytes_to_int32(databytes, ptr + 36), 5)
            updateRun(fG(b, c, d), 0xc33707d6, bytes_to_int32(databytes, ptr + 56), 9)
            updateRun(fG(b, c, d), 0xf4d50d87, bytes_to_int32(databytes, ptr + 12), 14)
            updateRun(fG(b, c, d), 0x455a14ed, bytes_to_int32(databytes, ptr + 32), 20)
            updateRun(fG(b, c, d), 0xa9e3e905, bytes_to_int32(databytes, ptr + 52), 5)
            updateRun(fG(b, c, d), 0xfcefa3f8, bytes_to_int32(databytes, ptr + 8), 9)
            updateRun(fG(b, c, d), 0x676f02d9, bytes_to_int32(databytes, ptr + 28), 14)
            updateRun(fG(b, c, d), 0x8d2a4c8a, bytes_to_int32(databytes, ptr + 48), 20)
            updateRun(fH(b, c, d), 0xfffa3942, bytes_to_int32(databytes, ptr + 20), 4)
            updateRun(fH(b, c, d), 0x8771f681, bytes_to_int32(databytes, ptr + 32), 11)
            updateRun(fH(b, c, d), 0x6d9d6122, bytes_to_int32(databytes, ptr + 44), 16)
            updateRun(fH(b, c, d), 0xfde5380c, bytes_to_int32(databytes, ptr + 56), 23)
            updateRun(fH(b, c, d), 0xa4beea44, bytes_to_int32(databytes, ptr + 4), 4)
            updateRun(fH(b, c, d), 0x4bdecfa9, bytes_to_int32(databytes, ptr + 16), 11)
            updateRun(fH(b, c, d), 0xf6bb4b60, bytes_to_int32(databytes, ptr + 28), 16)
            updateRun(fH(b, c, d), 0xbebfbc70, bytes_to_int32(databytes, ptr + 40), 23)
            updateRun(fH(b, c, d), 0x289b7ec6, bytes_to_int32(databytes, ptr + 52), 4)
            updateRun(fH(b, c, d), 0xeaa127fa, bytes_to_int32(databytes, ptr), 11)
            updateRun(fH(b, c, d), 0xd4ef3085, bytes_to_int32(databytes, ptr + 12), 16)
            updateRun(fH(b, c, d), 0x4881d05, bytes_to_int32(databytes, ptr + 24), 23)
            updateRun(fH(b, c, d), 0xd9d4d039, bytes_to_int32(databytes, ptr + 36), 4)
            updateRun(fH(b, c, d), 0xe6db99e5, bytes_to_int32(databytes, ptr + 48), 11)
            updateRun(fH(b, c, d), 0x1fa27cf8, bytes_to_int32(databytes, ptr + 60), 16)
            updateRun(fH(b, c, d), 0xc4ac5665, bytes_to_int32(databytes, ptr + 8), 23)
            updateRun(fI(b, c, d), 0xf4292244, bytes_to_int32(databytes, ptr), 6)
            updateRun(fI(b, c, d), 0x432aff97, bytes_to_int32(databytes, ptr + 28), 10)
            updateRun(fI(b, c, d), 0xab9423a7, bytes_to_int32(databytes, ptr + 56), 15)
            updateRun(fI(b, c, d), 0xfc93a039, bytes_to_int32(databytes, ptr + 20), 21)
            updateRun(fI(b, c, d), 0x655b59c3, bytes_to_int32(databytes, ptr + 48), 6)
            updateRun(fI(b, c, d), 0x8f0ccc92, bytes_to_int32(databytes, ptr + 12), 10)
            updateRun(fI(b, c, d), 0xffeff47d, bytes_to_int32(databytes, ptr + 40), 15)
            updateRun(fI(b, c, d), 0x85845dd1, bytes_to_int32(databytes, ptr + 4), 21)
            updateRun(fI(b, c, d), 0x6fa87e4f, bytes_to_int32(databytes, ptr + 32), 6)
            updateRun(fI(b, c, d), 0xfe2ce6e0, bytes_to_int32(databytes, ptr + 60), 10)
            updateRun(fI(b, c, d), 0xa3014314, bytes_to_int32(databytes, ptr + 24), 15)
            updateRun(fI(b, c, d), 0x4e0811a1, bytes_to_int32(databytes, ptr + 52), 21)
            updateRun(fI(b, c, d), 0xf7537e82, bytes_to_int32(databytes, ptr + 16), 6)
            updateRun(fI(b, c, d), 0xbd3af235, bytes_to_int32(databytes, ptr + 44), 10)
            updateRun(fI(b, c, d), 0x2ad7d2bb, bytes_to_int32(databytes, ptr + 8), 15)
            updateRun(fI(b, c, d), 0xeb86d391, bytes_to_int32(databytes, ptr + 36), 21)

            // update buffers
            h0 = _add(h0, a)
            h1 = _add(h1, b)
            h2 = _add(h2, c)
            h3 = _add(h3, d)
        }
        // Done! Convert buffers to 128 bit (LE)
        return int128le_to_hex(h3, h2, h1, h0).toUpperCase()
    }


}
/**
 Password field
 @namespace form
 @class Password
 @extends form.Text
 @constructor
 @description Form component for passwords.
 @param {Object} config
 @example
 	...
 	children:[
 		{type:'form.password',label:'Password',name:'password',md5:true },
 		{type:'form.password',label:'Repeat password',name:'password_repeated',md5:true }
 	]
 	...
 */
ludo.form.Password = new Class({
	Extends:ludo.form.Text,
	type:'form.Password',
	inputType:'password',

	/**
	 * Convert password to md5 hash
	 * getValue method will then return an md5 version of the password
	 * @attribute {Boolean} md5
	 */
	md5:false,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.md5 !== undefined)this.md5 = config.md5;
	},

	getValue:function () {
		var val = this.parent();
		if (val.length && this.md5) {
			return faultylabs.MD5(val);
		}
		return val;
	},

	reset:function () {
		this.setValue('');
	}

});

/**
 * @namespace form
 * @class Number
 * @description A customized text input only allowing numeric characters
 * @extends form.Text
 */
ludo.form.Number = new Class({
    Extends:ludo.form.Text,
    type:'form.Number',
    regex:'[0-9]',
    validateKeyStrokes:true,
    formCss:{
        'text-align':'right'
    },
    /**
     * Stretch is default set to false for numbers
     * @attribute {Boolean} stretchField
     */
    stretchField:false,

    /**
     * Disable changing values using mousewheel
     * @attribute {Boolean} disableWheel
     * @default false
     */
    disableWheel:false,

    /**
     * Reverse wheel, i.e. down for larger value, up  for smaller
     * @attribute {Boolean} reverseWheel
     * @default false
     */
    reverseWheel:false,

    /**
     * Minimum value
     * @attribute {Number} minValue
     * @default undefined
     */
    minValue:undefined,

    /**
     * Maximum value
     * @attribute {Number} maxValue
     * @default undefined
     */
    maxValue:undefined,

    /**
     * Amount to increment/decrement when using mousewheel while pressing shift-key
     * @attribute {Number} shiftIncrement
     * @default 10
     */
    shiftIncrement:10,

    ludoConfig:function (config) {
        this.parent(config);
        if (config.minValue !== undefined)this.minValue = parseInt(config.minValue);
        if (config.maxValue !== undefined)this.maxValue = parseInt(config.maxValue);
        if (config.disableWheel !== undefined)this.disableWheel = config.disableWheel;
        if (config.shiftIncrement !== undefined)this.shiftIncrement = config.shiftIncrement;
        if (config.reverseWheel !== undefined)this.reverseWheel = config.reverseWheel;
    },

    ludoEvents:function () {
        this.parent();
        if (!this.disableWheel) {
            this.getFormEl().addEvent('mousewheel', this._mouseWheel.bind(this));
        }

    },
    blur:function(){
        var value = this.getFormEl().value;
        if(!this.isValid(value)){
            if (this.minValue!==undefined && parseInt(value) < this.minValue) {
                value = this.minValue;
            }
            if (this.maxValue!==undefined && parseInt(value) > this.maxValue) {
                value = this.maxValue;
            }
            this.setValue(value);
        }
        this.parent();
    },

    _mouseWheel:function (e) {
        this.incrementBy(e.wheel > 0 ? Math.ceil(e.wheel) : Math.floor(e.wheel), e.shift);	// Math.ceil because of a mystery error in either firefox or mootools
        return false;
    },
    /**
     * Increment value by
	 * @method incrementBy
     * @param {Number} value
     * @param {Boolean} shift
     */
    incrementBy:function (value, shift) {
        if(this.reverseWheel)value = value * -1;
        value = parseInt(this.value) + (shift ? value * this.shiftIncrement : value);

        if(this.isValid(value)){
            this.setValue(value);
			this.fireEvent('change', [ value, this ]);
        }
    },

    isValid:function (value) {
        value = value != undefined ? value : this.value;
        var valid = this.parent();
        if (!valid)return;

        if (this.minValue!==undefined && parseInt(value) < this.minValue) {
            return false;
        }
        return !(this.maxValue && parseInt(value) > this.maxValue);

    }
});
/**
 * @namespace form
 * @class Email
 * @description A customized text field with validation of e-mail addrses
 * @extends form.Text
 */
ludo.form.Email = new Class({
    Extends:ludo.form.Text,
    type:'form.Email',
    regex:'^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)$',
    validateKeyStrokes:false
});
/**
 * Special form component used for Numbers. It will display control buttons
 * to the right of the input fields and you will be able to increment and decrement by
 * using the mouse wheel or by "nudging" the label.
 * @namespace form
 * @class Spinner
 * @extends form.Number
 */
ludo.form.Spinner = new Class({
    Extends:ludo.form.Number,
    type:'form.Spinner',
    inputTag:'input',
    inputType:'text',
    stretchField:false,
    regex:undefined,
    /**
     * Minimum value
     * @attribute maxValue
     * @type int
     * @default 0
     */
    maxValue:100,
    /**
     * Minimum value
     * @attribute {Number} minValue
     * @default 0
     */
    minValue:0,
    /**
     * amount of increment by click on arrow buttons or by rolling mouse wheel
     * @attribute increment
     * @type int
     * @default 1
     */
    increment:1,

    spinnerConfig:{
        /**
         * Number of decimals
         * @attribute decimals
         * @type int
         * @default 0
         */
        decimals:0
    },

    ludoConfig:function (config) {
        this.parent(config);
        if(config.increment !== undefined)this.increment = config.increment;
    },

    mode:{},

    ludoRendered:function () {
        this.parent();
        this.createSpinnerElements();
        if (!this.fieldWidth) {
            this.getFormEl().setStyle('width', (this.maxValue + '').length * 15);
        }
        this._setStyles();
        this._createEvents();
        this._clearMode();
        this.setSpinnerValue(this.value);
        this._setContainerSize();
    },

    createSpinnerElements:function () {
        this.createSpinnerContainer();
        var input = this.getFormEl();
        input.setProperty('maxlength', (this.maxValue + '').length);
        ludo.dom.addClass(input, 'ludo-spinbox-input');

        this.els.arrowsContainer = this._createContainer({
            cls:'ludo-spinbox-arrows-container',
            renderTo:this.els.spinnerContainer
        });

        this.els.upArrow = this._createContainer({
            cls:'ludo-spinbox-arrow-up',
            renderTo:this.els.arrowsContainer
        });
        this.els.downArrow = this._createContainer({
            cls:'ludo-spinbox-arrow-down',
            renderTo:this.els.arrowsContainer
        });

        this.els.arrowSeparator = this._createContainer({
            cls:'ludo-spinbox-arrow-separator',
            renderTo:this.els.arrowsContainer
        });
    },

    _clearMode:function () {
        this.mode = {
            name:false,
            modeElement:null,
            shiftKey:false,
            timeout:false
        }
    },

    createSpinnerContainer:function () {
        var el = this.els.spinnerContainer = new Element('div');
        this.getFormEl().getParent().adopt(el);
        el.adopt(this.getFormEl());
        ludo.dom.addClass(el, 'ludo-spinbox-container')
    },

    _createContainer:function (config) {
        config = $merge({
            tag:'div',
            cls:''
        }, config);

        var el = new Element(config.tag);
        el.addClass(config.cls);

        if (config.renderTo) {
            config.renderTo.adopt(el);
        }
        return el;
    },

    _setStyles:function () {
        this.els.spinnerContainer.setStyles({
            position:'relative'
        });
        this.getFormEl().setStyles({
            border:'0px'
        });
        this.els.arrowsContainer.setStyles({
            position:'absolute',
            top:'0px',
            height:'100%',
            right:'0px'
        });
        this.els.upArrow.setStyles({
            'position':'absolute',
            'background-repeat':'no-repeat',
            'background-position':'center center',
            'height':' 50%',
            'top':'0px'
        });
        this.els.downArrow.setStyles({
            'position':'absolute',
            'background-repeat':'no-repeat',
            'background-position':'center center',
            'height':'50%',
            'bottom':'0px'
        });
        this.els.arrowSeparator.setStyles({
            'position':'absolute',
            'top':'50%'
        });

        this.els.spinnerContainer.setStyles({ width:this.fieldWidth });
    },
    _initNudge:function (e) {
        this._startMode({
            name:'nudge',
            x:e.page.x,
            initValue:parseInt(this.getValue()),
            labelWidth:this.els.label.getSize().x
        });
        return false;
    },
    _nudge:function (e) {
        if (this.mode.name == 'nudge') {
            var movement = e.page.x - this.mode.x;
            var multiply = (this.maxValue - this.minValue) / this.mode.labelWidth;
            var value = this.mode.initValue + (movement * multiply);

            if (this.increment > 1) {
                value = Math.round(value);
                if (value > 0 && (value % this.increment)) {

                    value = value - (value % this.increment) + this.increment;
                    if (value > this.maxValue) {
                        value = this.maxValue;
                    }
                }
            }
            this.setSpinnerValue(value);

            var currentValue = this.getValue();
            if (currentValue == this.maxValue || currentValue == this.minValue) {
                this._initNudge(e);
            }
        }
    },
    _setContainerSize:function () {
        var width = this.getFormEl().getSize().x;
        if (!width)return;

        if (this.stretchField) {
            width -= 11;
        }
        this.els.spinnerContainer.setStyle('width', width);
    },
    _createEvents:function () {
        if (!this.disableWheel) {
            this.getFormEl().addEvent('mousewheel', this._mouseWheel.bind(this));
        }
        this.getFormEl().addEvent('keydown', this._validateKeyStroke.bind(this));
        this.els.upArrow.addEvent('mouseover', this._arrowMouseOver.bind(this));
        this.els.downArrow.addEvent('mouseover', this._arrowMouseOver.bind(this));
        this.els.upArrow.addEvent('mouseout', this._arrowMouseOut.bind(this));
        this.els.downArrow.addEvent('mouseout', this._arrowMouseOut.bind(this));
        this.els.upArrow.addEvent('mousedown', this._arrowMouseDown.bind(this));
        this.els.downArrow.addEvent('mousedown', this._arrowMouseDown.bind(this));
        this.els.upArrow.addEvent('mouseup', this._arrowMouseUp.bind(this));
        this.els.downArrow.addEvent('mouseup', this._arrowMouseUp.bind(this));
        Window.getDocument().addEvent('mouseup', this._clearMode.bind(this));

        if (this.els.label) {
            this.els.label.setStyle('cursor', 'w-resize');
            document.id(this.els.label).addEvents({
                'mousedown':this._initNudge.bind(this),
                'selectstart':function () {
                    return false;
                }
            });
            Window.getDocument().addEvent('mousemove', this._nudge.bind(this));
        }
    },
    _arrowMode:function () {
        if (this.mode.name) {
            switch (this.mode.modeElement) {
                case this.els.upArrow:
                    this.incrementBy(1, this.mode.shiftKey);
                    break;
                case this.els.downArrow:
                    this.incrementBy(-1, this.mode.shiftKey);
                    break;
                default:
            }
            this.mode.timeout = Math.max(Math.round(this.mode.timeout * 0.8), 15);
            setTimeout(this._arrowMode.bind(this), this.mode.timeout);
        }
    },
    _startMode:function (modeConfig) {
        this.mode = modeConfig;
        switch (this.mode.name) {
            case 'mousedown':
                this._arrowMode();
                break;
            default:
        }
    },
    _arrowMouseDown:function (e) {
        ludo.dom.addClass(e.target, 'ludo-spinbox-arrow-downeffect');
        this._startMode({
            name:'mousedown',
            modeElement:e.target,
            shiftKey:e.shift,
            timeout:400
        });
    },
    _arrowMouseUp:function (e) {
        e.target.removeClass('ludo-spinbox-arrow-downeffect');
    },
    _arrowMouseOver:function (e) {
        ludo.dom.addClass(e.target, 'ludo-spinbox-arrow-overeffect');
    },
    _arrowMouseOut:function (e) {
        e.target.removeClass('ludo-spinbox-arrow-overeffect');
    },
    incrementBy:function (value, shiftKey) {
        value = value * (shiftKey ? this.shiftIncrement : this.increment);
        this.setSpinnerValue(parseInt(this.getValue()) + value);
    },
    validateSpinnerValue:function (value) {
        value = value || 0;
        if (value < this.minValue)value = this.minValue;
        if (value > this.maxValue)value = this.maxValue;
        return parseInt(value);
    },
    setSpinnerValue:function (value) {
        this.value = this.validateSpinnerValue(value).toFixed(this.spinnerConfig.decimals);
        this.getFormEl().value = this.value;
        /**
         * Change event fired when value is changed
         * @event change
         * @param value
         * @param Component this
         */
        this.fireEvent('change', value, this);
    },

    _validateKeyStroke:function (e) {
        if (!this.spinnerConfig['disableArrowKeys']) {
            if (e.key == 'up') {
                this.incrementBy(1, e.shift);
                return false;
            }
            if (e.key == 'down') {
                this.incrementBy(-1, e.shift);
                return false;
            }
        }

        if (e.key == 'backspace' || e.key == 'delete' || e.key == 'tab') {
            return true;
        }

        if (this.minValue < 0 && this.html.el.value.indexOf('-') == -1 && e.key == '-') {
            return true;
        }
        if (this.spinnerConfig.decimals && (e.code == 190 || e.code == 46) && this.html.el.value.indexOf('.') == -1) {
            return true; // Some strange things are going on with mootools here. e.key is "delete" when the user types in a period sign
        }
        if (Event.Keys.hasOwnProperty(e.key)) {
            return true;
        }

        var regExp = new RegExp('[0-9]');
        return regExp.test(e.key);
    },

    resizeDOM:function () {
        this.parent();
        if (this.stretchField) {
            this._setContainerSize();
        }
    }
});
/**
 * Select box (&lt;select>)
 * A select box can be populated from the server. The server should respond with data in the following format:
 * { success : true, data: [{ value:'1','text': 'Display text' }, { value:'2', 'text': 'Display text'} ]}
 * You can use different keys than "value" and "text" by defining a fieldConfig object.
 * @namespace form
 * @class Select
 * @extends form.Element
 */
ludo.form.Select = new Class({
    Extends:ludo.form.LabelElement,
    type:'form.Select',
    labelWidth:100,
    /**
     * value and text to display when no records has been selected, example: { value:'', text: 'Select country' }
     * @attribute emptyItem
     * @default null
     */
    emptyItem:null,
    /**
     * record keys to use for value and text
     * @attribute fieldConfig
     * @default { value : 'value', text : 'text' }
     */
    fieldConfig:{
        value:'value',
        text:'text'
    },

    inputTag : 'select',
    inputType : '',

    ludoConfig:function (config) {
        this.parent(config);
        if (config.emptyItem !== undefined) {
            this.emptyItem = config.emptyItem;
        }
    },

    populate:function (data) {
        if (this.emptyItem) {
            this.addOption(this.emptyItem.value, this.emptyItem.text);
        }

        if (data.length > 0) {
            if (data[0][this.fieldConfig.value] === undefined) {
                this.fieldConfig.value = 'id';
            }
            if (data[0][this.fieldConfig.text] === undefined) {
                this.fieldConfig.text = 'title';
            }
        }

        for (var i = 0, count = data.length; i < count; i++) {
            this.addOption(data[i][ this.fieldConfig.value ], data[i][ this.fieldConfig.text ]);
        }

        if (this.value) {
            this.setValue(this.value);
        }
    },

    /**
     * Add new option element
     * @method addOption
     * @param {String} value
     * @param {String} text
     */
    addOption:function (value, text) {
        var option = new Element('option');
        option.set('value', value);
        option.set('text', text);

        this.getFormEl().adopt(option);
    }
});
/**
 * @namespace form
 * @class FilterText
 * @extends form.Text
 */
ludo.form.FilterText = new Class({
    Extends:ludo.form.Text,
    type:'form.FilterText',

    /**
     * Suggest selected record.
     * @attribute autoComplete
     * @type {Boolean}
     * @default true
     */
    autoComplete:true,

    /**
     * value and title to display when no records are selected
     * @attribute emptyItem
	 * @type Object
     */
    emptyItem:{
        /**
         * value of empty item
         * @attribute emptyItem.value
         * @type string
         * @default empty string
         */
        value:'',
        /**
         * display value of empty item
         * @attribute emptyItem.title
         * @type string
         * @default empty string
         */
        title:''
    },

    /**
     * When set to true, filtering should be done on the server. When set to false, the script will search initial records sent to constructor using config.data
     * or the records it got from the server during when constructing the component
     * @attribute filterOnServer
     * @type {Boolean}
     * @default false
     */
    filterOnServer:false,
    /**
     * When search for records on the server is enabled or you have sent collection of records to the component on creation using config.data,
     * this property specifies maximum number of filtered records to be displayed below the component. For standard text fields, this property is of no interest.
     * @attribute maxDisplayed
     * @type int
     * @default 10
     */
    maxDisplayed:10,
    /**
     * "id" field of records used for filtering, this will also be the value of the text field. Example:
     * [{ id: 100, Title: 'Norway' }] will return 100 when calling component.getValue()
     * @attribute idField
     * @type string
     * @default "id"
     */
    idField:'id',
    /**
     * name of "display" field when filtering is enabled. This identified the column used in list box below input field,
     * example: displayField set to "firstname" will be display "John" and "Jane" for these records: [{ id:1, firstname: 'John', lastname: 'Doe' }, {id:2, firstname: 'Jane', lastname: 'Doe'} ]
     * @attribute displayField
     * @type string
     * @default "title"
     */
    displayField:'title',
    selectedRecord:undefined,
    timeStamp:0,
    remote:{},

    ludoConfig:function (config) {
        this.filterOnServer = config.filterOnServer || this.filterOnServer;
        if (config.remote) {
            config.remote.isJSON = true;
            this.remote.queryParam = config.remote.queryParam || this.remote.queryParam;
            this.remote.queryParamRecord = config.remote.queryParamRecord || config.remote.queryParamRecord;
        }
        this.emptyItem = config.emptyItem || this.emptyItem;
        this.parent(config);
        if (this.filterOnServer) {
            this.remote.autoLoad = false;
        }
        this.autoComplete = config.autoComplete || this.autoComplete;
    },


    ludoRendered:function () {
        this.parent();

        var cell = this.els.cellInput;

        var size = ludo.dom.getNumericStyle(this.els.formEl, 'width') + ludo.dom.getPW(this.els.formEl) + ludo.dom.getBW(this.els.formEl) + ludo.dom.getMW(this.els.formEl);

        var container = this.els.inputContainer = new Element('div');
        cell.adopt(container);
        container.adopt(this.els.formEl);
        ludo.dom.addClass(container, 'ludo-form-text-autocomplete-container');
        if (!isNaN(size)) {
            container.setStyles({
                'width':size
            });
        }

        this.createFilterComponent();
        this.createHiddenInput();

        this.getFormEl().addClass('ludo-form-text-autocomplete');
        this.getFormEl().setProperty('autocomplete', 'off');

        this.getFormEl().setStyles({
            'background-color':'transparent',
            'z-index':100
        });

        var el = this.els.autoComplete = new Element('input');
        ludo.dom.addClass(el, 'ludo-form-text-autocomplete');
        el.disabled = true;
        el.style.zIndex = 99;
        el.style.color = 'silver';
        el.style.cursor = 'none';
        this.els.inputContainer.adopt(el);

        this.els.formElDiv = new Element('div');
        this.els.hiddenEl = new Element('div');
        this.setRecord(this.getEmptyItem());
    },

    getEmptyItem:function () {
        var ret = {};
        ret[this.idField] = this.emptyItem[this.idField] === undefined ? this.emptyItem.value : this.emptyItem[this.idField];
        ret[this.displayField] = this.emptyItem.title || this.emptyItem.text;
        return ret;
    },

    createHiddenInput:function () {
        var hiddenInput = this.els.hiddenInput = new Element('input');
        hiddenInput.type = 'hidden';
        hiddenInput.value = this.value;
        this.getEl().adopt(hiddenInput);
    },

    getHiddenInput:function () {
        if (this.els.hiddenInput) {
            return this.els.hiddenInput;
        }
        return null;
    },
    /**
     * Return value of text field. On standard text fields the visible value will be returned. Otherwise the id of selected record will be returned
     * @method getValue
     * @return string value
     */
    getValue:function () {
        var hiddenInput = this.getHiddenInput();

        if (hiddenInput) {
            return hiddenInput.get('value');
        }
        return this.parent();
    },

    setAutoCompleteRecord:function (record) {
        this.els.autoComplete.set('value', record[this.displayField]);
    },

    createFilterComponent:function () {
        this.getFormEl().addEvent('keyup', this.filter.bind(this));
        this.getFormEl().addEvent('keydown', this.filterKeyEvents.bind(this));
        this.getFormEl().addEvent('focus', this.hideFilter.bind(this));

        this.getEventEl().addEvent('mousedown', this.autoHideFilter.bind(this));
        this.getFormEl().addEvent('blur', this.chooseSelectedRecord.bind(this));
        if (this.getParent()) {
            this.getParent().addEvent('startmove', this.hideFilter.bind(this));
        }

        this.filterComponent = new ludo.form.TextFilterContainer({
            formComponent:this,
            width:this.getFormEl().getSize().x,
            height:300,
            maxDisplayed:this.maxDisplayed
        });

        this.hideFilter();
    },

    filterKeyEvents:function (e) {
        this.timeStamp = new Date().getTime();
        if (e.key == 'esc') {
            this.clearSelectedRecord();
            this.setRecord(this.getEmptyItem());
            this.filterComponent.hide();
        }
        if (e.key == 'enter' || e.key == 'tab') {
            var rec = this.filterComponent.getSelectedRecord();
            if (rec)this.setRecord(rec);
            this.hideFilter();

            if (e.key === 'enter') {
                var cmp = ludo.Form.getNext(this);
                if (cmp) {
                    cmp.focus();
                }
                return false;
            }
        }

        if (e.key == 'up') {
            this.filterComponent.selectPrevious();
        }
        if (e.key == 'down') {
            this.filterComponent.selectNext();
        }
        return undefined;
    },

    autoHideFilter:function (e) {
        if (e.target.id && e.target.id == this.getFormEl().id) {
            return;
        }
        if (e.target.hasClass('ludo-filter-text-options') || e.target.getParent('.ludo-filter-text-options')) {
            return;
        }
        this.filterComponent.hide();
    },

    filter:function (e) {
        if (e && e.key) {
            if (e.key == 'up' || e.key == 'down' || e.key == 'enter' || e.key == 'esc' || e.key == 'tab')return;
        }
        this.getHiddenInput().set('value', this.getFormEl().value);
        this.filterData(this.getFormEl().value);
    },

    getFieldWidth:function () {
        return this.formFieldWidth + ludo.dom.getBW(this.els.inputContainer) + ludo.dom.getPW(this.els.inputContainer);
    },
    reset:function () {
        this.parent();
        this.filter();
    },

    /**
     * If record is part of data collection in memory(config.data or remotely loaded records), it will be shown,
     * if remote.url is set it will search for request to the server for the record. The query will look like this:
     * { getRecord : { id: 100 } } and it expects response from server in this format:
     *  { success: true, data : { id: 100, title: 'John Doe' } }
     * @method setValue
     * @param {String} value
     */
    setValue:function (value) {
        if (this.remote.url) {
            var obj = {};
            obj[this.idField] = value;
            this.setRecord(obj);
        } else {
            this.parent(value);
        }
    },

    setRecord:function (record) {
        this.selectedRecord = record;
        if (record[this.idField] !== undefined && record[this.displayField] === undefined) {
            this.loadSingleRecordRemote(record);
        } else {
            this.chooseSelectedRecord();
            this.filterComponent.hide();
        }
    },

    loadSingleRecordRemote:function (record) {
        if(!this.remote.url){
            return;
        }
        var remoteConfig = {
            url:this.getUrl(),
            method:'post',
            onSuccess:function (json) {
                var record = json.data;
                if (this.idField && record[this.idField]!==undefined && record[this.displayField]) {
                    this.setRecord(record);
                }
            }.bind(this)
        };
        remoteConfig.params = {};
        remoteConfig.params[this.idField] = record.id;
        remoteConfig.params[this.remote.queryParamRecord] = record;

        this.JSONRequest(remoteConfig);
    },

    chooseSelectedRecord:function () {
        var record = this.getSelectedRecord();
        if (record) {
            var realValue = record[this.displayField];
            if (this.isEmptyRecord(record)) {
                realValue = '';
            }
            this.getFormEl().set('value', realValue);

            this.els.autoComplete.set('value', record[this.displayField]);
            this.getHiddenInput().set('value', record[this.idField]);
        }
    },

    isEmptyRecord:function (record) {
        return record[this.idField].length === 0;
    },

    originalSearch:undefined,
    filterData:function (search) {
        this.originalSearch = search;
        search = search.toLowerCase();

        if (search.length == 0) {
            this.clearSelectedRecord();
            this.setRecord(this.getEmptyItem());
            this.filterComponent.hide();
            return;
        }

        this.clearSelectedRecord();

        if (!this.data && !this.filterOnServer) {
            return;
        }

        if (this.filterOnServer) {
            this.filterRemote(search);
        } else {
            var filteredRecords = this.getFilteredRecords(search);
            if (filteredRecords.length > 0) {
                this.showSuggestionAndPopulateDropDown(search, filteredRecords);
            } else {
                this.clearSelectedRecord();
                this.filterComponent.hide();
            }
        }
    },

    filterRemote:function (search) {
        if (this.filterCache[search]) {
            this.showSuggestionAndPopulateDropDown(search, this.filterCache[search]);
            return;
        }
        var d = new Date();
        if (d.getTime() - this.timeStamp < 500) {
            if (search == this.getFormEl().value.toLowerCase()) {
                this.filterRemote.delay(100, this, [search]);
            }
            return;
        }

        this.filterCache[search] = [];
        if(!this.remote.url){
            return;
        }
        var remoteConfig = {
            url:this.remote.url,
            method:'post',
            onSuccess:function (json) {
                this.filterCache[search] = json.data;
                this.showSuggestionAndPopulateDropDown(search, json.data);
            }.bind(this)
        };
        remoteConfig.params = this.remote.data;
        remoteConfig.params[this.remote.queryParam] = search;
        remoteConfig.params.maxDisplayed = this.maxDisplayed;

        this.JSONRequest(remoteConfig);
    },

    showSuggestionAndPopulateDropDown:function (search, records) {
        if (records.length == 0) {
            this.filterComponent.hide();
            this.clearSelectedRecord();
            return;
        }

        var suggestedRecord = this.getSuggestedRecord(records);
        if (suggestedRecord) {
            this.selectedRecord = suggestedRecord;
            this.els.autoComplete.set('value', suggestedRecord[this.displayField]);
        } else {
            this.clearSelectedRecord();
        }
        this.filterComponent.position();
        this.filterComponent.populate(records);
        this.filterComponent.show();
    },

    getSuggestedRecord:function (records) {
        var len = Math.min(this.maxDisplayed, records.length);
        for (var i = 0; i < len; i++) {
            if (records[i][this.displayField].indexOf(this.originalSearch) == 0) {
                return records[i];
            }
        }
        return null;
    },

    clearSelectedRecord:function () {
        this.els.autoComplete.set('value', '');
        this.selectedRecord = undefined;
    },

    getSelectedRecord:function () {
        return this.selectedRecord;
    },

    filterCache:{},
    getFilteredRecords:function (search) {
        if (!this.filterCache[search]) {
            this.filterCache[search] = [];

            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i].searchString.indexOf(search) >= 0) {
                    this.filterCache[search].push(this.data[i]);
                }
            }
        }

        return this.filterCache[search];
    },

    hideFilter:function () {
        this.filterComponent.hide.delay(200, this.filterComponent);
    },

    resizeDOM:function () {
        this.parent();
        this.els.inputContainer.style.width = this.getFormEl().style.width;
    },

    populate:function (data) {
        this.data = data;
        for (var i = 0; i < data.length; i++) {
            this.data[i].searchString = this.data[i][this.displayField].toLowerCase();
        }
    },

    focus:function () {
        this.parent();
        this.getFormEl().focus();
    }
});

ludo.form.TextFilterContainer = new Class({
    Extends:ludo.View,
    type:'form.TextFilterContainer',
    formComponent:undefined,
    width:500,
    height:300,
    titleBar:false,
    hidden:true,
    maxDisplayed:10,
    tpl:'<div>{title}</div>',
    records:[],
    selectedIndex:undefined,

    containerCss:{
        position:'absolute',
        border:'1px solid #AAA',
        'background-color':'#FFF'
    },
    ludoConfig:function (config) {
        this.formComponent = config.formComponent;
        config.els = config.els || {};
        config.els.parent = document.body;
        this.parent(config);
        this.alwaysInFront = true;
        this.maxDisplayed = config.maxDisplayed;

    },

    ludoRendered:function () {
        this.parent();
        this.resize({
            width:this.width,
            height:this.height
        });

        this.getBody().setStyle('overflow', 'hidden');
        this.getBody().addClass('ludo-filter-text-options');
    },

    keyUp:function(){

    },

    position:function () {
        var pos = this.getFormEl().els.inputContainer.getCoordinates(this.els.parent);
        this.setPosition({
            left:pos.left,
            top:pos.top + pos.height
        });
    },

    getFormEl:function () {
        return this.formComponent;
    },

    populate:function (records) {
        this.records = records;
        this.getBody().set('html', '');


        this.els.recordNodes = [];
        this.selectedIndex = undefined;
        var len = Math.min(records.length, this.maxDisplayed);

        for (var i = 0; i < len; i++) {
            var div = this.els.recordNodes[i] = new Element('div');
            div.setProperty('recordIndex', i);
            div.className = 'ludo-form-autocomplete-suggestion';
            div.set('html', records[i][this.formComponent.displayField]);
            this.getBody().adopt(div);
            div.addEvent('click', this.setRecord.bind(this));
            div.addEvent('mouseenter', this.mouseEnterRecord.bind(this));
            div.addEvent('mouseleave', this.mouseLeaveRecord.bind(this));
        }

        this.autoResize.delay(30, this, len);
    },

    autoResize:function (countRecords) {
        var div = this.getBody().getElement('.ludo-form-autocomplete-suggestion');
        var height = countRecords * this.getHeightOfSuggestionElement(div);
        height += ludo.dom.getMH(this.getEl());
        height += ludo.dom.getMH(this.getBody());
        height += ludo.dom.getBH(this.getBody());
        height += ludo.dom.getPH(this.getBody());


        this.resize({
            width:this.formComponent.getFieldWidth(),
            height:height
        });
    },

    selectNext:function () {
        if (this.records.length === 0) {
            return;
        }
        if (this.selectedIndex === undefined || this.selectedIndex == this.records.length - 1) {
            this.selectedIndex = 0;
        } else {
            this.selectedIndex++;
        }
        this.highlightRecord(this.selectedIndex);
    },
    selectPrevious:function () {
        if (this.records.length === 0) {
            return;
        }
        if (this.selectedIndex === undefined || this.selectedIndex == 0) {
            this.selectedIndex = this.records.length - 1;
        } else {
            this.selectedIndex--;
        }
        this.highlightRecord(this.selectedIndex);

    },
    mouseEnterRecord:function (e) {
        this.selectedIndex = e.target.getProperty('recordIndex');
        this.highlightRecord(this.selectedIndex);
    },

    mouseLeaveRecord:function (e) {
        e.target.removeClass('ludo-form-autocomplete-suggestion-over');
    },

    highlightRecord:function (recordIndex) {
        if (this.highlightedRecord) {
            this.highlightedRecord.removeClass('ludo-form-autocomplete-suggestion-over')
        }
        this.highlightedRecord = this.els.recordNodes[recordIndex];
        ludo.dom.addClass(this.highlightedRecord, 'ludo-form-autocomplete-suggestion-over')
    },

    getSelectedRecord:function () {
        if (this.selectedIndex !== undefined && this.records[this.selectedIndex]) {
            return this.records[this.selectedIndex];
        }
        return undefined;
    },

    setRecord:function (e) {
        var index = e.target.getProperty('recordIndex');
        this.formComponent.setRecord(this.records[index]);
        this.formComponent.hideFilter();
    },

    heightOfSuggestionElement:undefined,

    getHeightOfSuggestionElement:function (el) {
        if (this.heightOfSuggestionElement === undefined) {
            this.heightOfSuggestionElement = el.measure(function () {

                return this.getSize().y;
            });
        }
        return this.heightOfSuggestionElement;
    }
});
/**
 * @namespace form
 * @class RadioGroup
 * @description class for a group of radio buttons. Config for the radio buttons should be passed to the
 * constructor or loaded remotely. Here's an example of format:
 * [{ value: 1, text : 'my radio', image: 'images/my-radio-image.png' }]
 * @extends form.Element
 */
ludo.form.RadioGroup = new Class({
    Extends: ludo.form.Element,
    type : 'form.RadioGroup',
    labelWidth : 100,
    checkboxes : [],
    height : undefined,
    /**
     * record keys to use for value and text of the radio buttons
     * @attribute fieldConfig
     * @default { value : 'value', text : 'text' }
     */
    fieldConfig : {
        value : 'value',
        text : 'text'
    },

    ludoDOM : function() {
        this.parent();
        var table = new Element('table');
        this.getBody().adopt(table);
        var tbody = this.els.tBody = new Element('tbody');
        table.adopt(tbody);
    },

    populate : function(data){
        var row = new Element('tr');
        this.els.tBody.adopt(row);

        for(var i=0;i<data.length;i++){
            var cell = new Element('td');
            row.adopt(cell);

            var radio = new ludo.form.Checkbox({
                inputType : 'radio',
                name : this.getName(),
                value : data[i][this.fieldConfig.value],
                label : data[i][this.fieldConfig.text],
                checked  : data[i].checked ? true : false,
                image : data[i].image ? data[i].image : null,
                listeners : {
                    change : this.valueChange.bind(this)
                }
            });
            this.checkboxes.push(radio);
            cell.adopt(radio.getEl());
        }

        if(data.length > 0){
            var cellHeight = cell.getSize().y;
            if(cellHeight > this.getHeight()){
                this.resize({
                    height : cellHeight
                })
            }
        }

    },

    valueChange : function(){
        for(var i=0;i<this.checkboxes.length;i++){
            this.checkboxes[i].toggleImage();
        }
        /**
         * @event change
         * @description Value has changed
         * @param {String} value
         * @param {Object} this component
         */
        this.fireEvent('change', [ this.getValue(), this ]);
    },

    ludoRendered : function() {
        this.parent();
        if(this.checkboxes.length > 0 && !this.isChecked()){
            this.checkboxes[0].check();
        }
    },

    isChecked : function() {
        for(var i=0;i<this.checkboxes.length;i++){
            if(this.checkboxes[i].isChecked()){
                return true;
            }
        }
        return false;
    },

    disable : function(){
        for(var i=0;i<this.checkboxes.length;i++){
            this.checkboxes[i].disable();
        }
    },

    enable : function(){
        for(var i=0;i<this.checkboxes.length;i++){
            this.checkboxes[i].enable();
        }
    },
    /**
     * Get value of selected radio input
     * @method getValue
     * @return String value
     */
    getValue : function() {
        var radio = this.getCheckedRadio();
        if(radio){
            return radio.getValue();
        }
        return null;
    },
    /**
     * Return reference to selected radio button component
     * @method getCheckedRadio
     * @return {Object} ludo.form.Radio component
     */
    getCheckedRadio : function() {
        for(var i=0;i<this.checkboxes.length;i++){
            if(this.checkboxes[i].isChecked()){
                return this.checkboxes[i];
            }
        }
        return null;
    },
    /**
     * The radio button with the chose value will be checked
     * @method setvalue
     * @param {String} value
     * @return void
     */
    setValue : function(value){
        for(var i=0;i<this.checkboxes.length;i++){
            if(this.checkboxes[i].getFormEl().get('value') == value){
                return this.checkboxes[i].check();
            }
        }
    }


});
/**
 File upload component<br>
 This components submits the file to an iframe. The url of this iframe is by default.<br>
 LUDOJS_CONFIG.fileupload.url. You can override it with remote.url config property.

 The file upload component should be implemented this way:

 1) File is uploaded to the server<br>
 2) You copy the file to a temporary area and save a reference to it in a database<br>
 3) You return the reference to the file, example id of database row(e.g. 1000)<br>
 4) The reference(1000) will be sent back from the server and saved as value of file upload component.<br>

 A PHP implementation of the PHP code of this can be obtained by contacting post[at]dhtmlgoodies.com.

 @namespace form
 @class File
 @extends form.Element
 @constructor
 @param {Object} config
 @example
	 ...
	 children:[{
		 type:'form.File', label:'Pgn File', name:'pgnfile', required:true, labelButton:'Find Pgn file', buttonWidth:100
	 }]
 	 ...
 is example of code used to add a file components as child of a component.

 When the file is uploaded to the server(happens instantly when instantUpload is set to true), the name
 of the file will be sent in POST variable ludo-file-upload-name. The actual file should be available in the
 FILES array sent to the server.

 Example of code sent to server:
 	{
		ludo-file-upload-name : '<name of file>',
		'name-of-file-upload-component' : 'pgnfile'
    }


 Example of PHP Code used to handle the file:

 @example

	 if(isset($_POST['ludo-file-upload-name'])){
		 header('Content-Type: text/html; charset=utf-8');
		 $uploadInfo = FileUpload::uploadFile($_FILES[$_POST['ludo-file-upload-name']]);

		 $data = array('success' => true, 'message' => '', 'data' => $uploadInfo);

		 die(utf8_encode(json_encode($data)));
	 }
 Response from server may look like this:

 @example
	 {
	 	success : true,
	 	value : '100'
	 }

 where success indicates if the upload was successful and value is a reference to the file. When the form with this
 file upload component is later submitted,

 */
ludo.form.File = new Class({
	Extends:ludo.form.LabelElement,
	type:'form.File',

	inputTag:'input',
	inputType:'file',

	/**
	 * Label of "Browse" button
	 * @attribute labelButton
	 * @type String
	 * @default "Browse"
	 */
	labelButton:'Browse',

	/**
	 * Label for "Remove" new file link
	 * @attribute labelRemove
	 * @type String
	 * @default Remove
	 */
	labelRemove:'Remove',
	/**
	 * Label for "Delete" new file link
	 * @attribute {String} labelDelete
	 * @default Delete
	 */
	labelDelete:'Delete',

	/**
	 * Private property for displayed file name. The file upload component is read only. It will only
	 * submit a value if a new file has been selected.
	 * @property valueForDisplay
	 * @private
	 */
	valueForDisplay:'',
	/**
	 * Upload instantly when selecting file. During upload the form component will be flagged
	 * as invalid, i.e. submit button will be disabled during file upload.
	 * @attribute instantUpload
	 * @type {Boolean}
	 * @default true
	 */
	instantUpload:true,

	uploadInProgress:false,

	/**
	 * false when a file has been selected but not uploaded. Happens
	 * when instantUpload is set to false
	 * @property fileUploadComplete
	 * @type {Boolean}
	 */
	fileUploadComplete:true,

	/*
	 * Property used to identify file upload components
	 */
	isFileUploadComponent:true,

	/**
	 * Width of browse button
	 * @attribute buttonWidth
	 * @type {Number}
	 * @default 80
	 */
	buttonWidth:80,

	/**
	 * Comma separated string of valid extensions, example : 'png,gif,bmp'
	 * @attribute accept
	 * @type String
	 */
	accept:undefined,


	ludoConfig:function (config) {
		this.parent(config);
		if (config.instantUpload !== undefined)this.instantUpload = config.instantUpload;
		if (config.labelButton !== undefined)this.labelButton = config.labelButton;
		if (config.labelRemove !== undefined)this.labelRemove = config.labelRemove;
		if (config.labelDelete !== undefined)this.labelDelete = config.labelDelete;
		if (config.buttonWidth !== undefined)this.buttonWidth = config.buttonWidth;
		if (config.accept !== undefined) {
			config.accept = config.accept.toLowerCase();
			this.accept = config.accept.split(/,/g);
		}

		if (config.value) {
			this.valueForDisplay = config.value;
		}
		this.value = '';
	},

	ludoRendered:function () {
		this.parent();

		var cell = new Element('td');
		cell.width = this.buttonWidth;
		cell.style.textAlign = 'right';
		this.els.inputRow.adopt(cell);
		cell.adopt(this.getFormEl());

		var btn = new ludo.form.Button({
			type:'form.Button',
			layout:{
				height:30,
				width:this.buttonWidth
			},
			value:this.labelButton,
			overflow:'hidden',
			renderTo:cell
		});

		var fe = this.getFormEl();
		fe.setStyles({
			opacity:0,
			'-moz-opacity':0,
			height:'100%',
			'position':'absolute',
			'right':0,
			top:0,
			'z-index':100000,
			cursor:'pointer',
			filter:'alpha(opacity=0)'
		});


		fe.addEvent('mouseover', btn.mouseOver.bind(btn));
		fe.addEvent('mouseout', btn.mouseOut.bind(btn));
		fe.addEvent('mousedown', btn.mouseDown.bind(btn));
		fe.addEvent('mouseup', btn.mouseUp.bind(btn));

		fe.addEvent('change', this.selectFile.bind(this));
		btn.getEl().adopt(fe);

		this.createIframe();
		this.createFormElementForComponent();

		if (this.valueForDisplay) {
			this.displayFileName();
		}
	},

	createFormElementForComponent:function () {
		var formEl = this.els.form = new Element('form');
		formEl.target = this.getIframeName();
		formEl.setProperty('method', 'post');
		formEl.setProperty('action', this.getUploadUrl());
		formEl.setProperty('enctype', 'multipart/form-data');
		formEl.setStyles({ margin:0, padding:0, border:0});
		this.getEl().adopt(formEl);
		formEl.adopt(this.getBody());

		this.addElToForm('ludo-file-upload-name',this.getName());
		this.addElToForm('request','FileUpload/save');

	},

	addElToForm:function(name,value){
		var el = new Element('input');
		el.type = 'hidden';
		el.name = name;
		el.value = value;
		this.els.form.adopt(el);
	},

	createIframe:function () {
		var el = this.els.iframe = new Element('iframe');
		el.name = this.iframeName = this.getIframeName();
		el.setStyles({
			width:1, height:1,
			visibility:'hidden',
			position:'absolute'
		});
		this.getEl().adopt(el);
		el.addEvent('load', this.onUploadComplete.bind(this));

	},

	getIframeName:function () {
		return 'iframe-' + this.getId();
	},

	onUploadComplete:function () {
		this.fileUploadComplete = true;

		if (window.frames[this.iframeName].location.href.indexOf('http:') == -1) {
			return;
		}
		try {
			var json = JSON.decode(window.frames[this.iframeName].document.body.innerHTML);
			if (json.success) {
				this.value = json.data.value;
				/**
				 * Event fired after a successful file upload, i.e. no server errors and json.success in
				 * response is true
				 * @event submit
				 * @param {Object} JSON from server (response.data)
				 * @param {Object} ludo.form.file
				 */
				this.fireEvent('submit', [json.data, this]);
			} else {
				/**
				 * Event fired after an unsuccessful file upload because json.success was false
				 * @event submitfail
				 * @param {Object} json from server
				 * @param {Object} ludo.form.file
				 */
				this.fireEvent('submitfail', [json, this]);
			}

			this.fireEvent('valid', ['', this]);
		} catch (e) {

			var html = '';
			try {
				html = window.frames[this.iframeName].document.body.innerHTML;
			} catch (e) {
			}
			/**
			 * Event fired when upload failed
			 * @event fail
			 * @param {Object} Exception
			 * @param {String} response from server
			 * @param {Object} ludo.form.file
			 */
			this.fireEvent('fail', [e, html, this]);

		}

		this.uploadInProgress = false;
		this.displayFileName();
	},

	isValid:function () {
		if (this.required && !this.getValue() && !this.hasFileToUpload()) {
			return false;
		}
		if (!this.hasValidExtension())return false;
		return !this.uploadInProgress;
	},

	hasValidExtension:function () {
		if (!this.hasFileToUpload() || this.accept === undefined) {
			return true;
		}

		return this.accept.indexOf(this.getExtension()) >= 0;

	},

	getExtension:function () {
		var file = this.getValue();
		var tokens = file.split(/\./g);
		var extension = tokens[tokens.length - 1].toLowerCase();
		return extension.toLowerCase();
	},

	getUploadUrl:function () {
		try {
			return window.LUDOJS_CONFIG.fileupload.url;
		} catch (e) {
			var url = this.getUrl();
			if (!url) {
				alert('No url defined for file upload, you should define url property or globally set ludo.appConfig.fileupload.url');
			}
			return url;
		}
	},

	selectFile:function () {
		this.value = this.valueForDisplay = this.getFormEl().get('value');
		this.fileUploadComplete = false;
		this.displayFileName();
		this.setDirty();
		if (this.instantUpload) {
			this.upload();
		}

	},

	displayFileName:function () {

		this.els.cellInput.set('html', '');
		this.els.cellInput.removeClass('ludo-input-file-name-new-file');
		this.els.cellInput.removeClass('ludo-input-file-name-initial');
		this.els.cellInput.removeClass('ludo-input-file-name-not-uploaded');
		if (this.valueForDisplay) {
			var span = new Element('span');
			span.set('html', this.valueForDisplay + ' ');
			this.els.cellInput.adopt(span);

			var deleteLink = new Element('a');
			deleteLink.addEvent('click', this.removeFile.bind(this));
			deleteLink.set('href', '#');
			var html = this.labelRemove;
			if (this.valueForDisplay == this.initialValue) {
				html = this.labelDelete;
				ludo.dom.addClass(this.els.cellInput, 'ludo-input-file-name-initial');
			} else {
				ludo.dom.addClass(this.els.cellInput, 'ludo-input-file-name-new-file');
			}
			if (!this.fileUploadComplete) {
				ludo.dom.addClass(this.els.cellInput, 'ludo-input-file-name-not-uploaded');
			}
			deleteLink.set('html', html);
			this.els.cellInput.adopt(deleteLink);
		}
	},
	resizeDOM:function () {
		/* No DOM resize nescessary for this component */
	},
	upload:function () {
		if (!this.hasValidExtension()) {
			return;
		}
		this.fireEvent('invalid', ['', this]);
		this.uploadInProgress = true;
		this.els.form.submit();
	},

	getValue:function () {
		return this.value;
	},
	/**
	 * setValue for file inputs is display only. File inputs are readonly
	 * @method setValue
	 * @param {Object} value
	 */
	setValue:function (value) {
		this.valueForDisplay = value;
		this.displayFileName();
		this.validate();
	},

	commit:function () {
		this.initialValue = this.valueForDisplay;
		this.displayFileName();
	},

	removeFile:function () {
		if (this.valueForDisplay == this.initialValue) {
			this.valueForDisplay = '';
		} else {
			this.valueForDisplay = this.initialValue;
		}
		this.value = '';
		this.displayFileName();
		this.validate();
		return false;
	},

	hasFileToUpload:function () {
		return !this.fileUploadComplete;
	},

	blur:function () {

	}
});

/**
 * Slider form component
 * @namespace form
 * @class Slider
 * @extends form.LabelElement
 */
ludo.form.Slider = new Class({
    Extends:ludo.form.LabelElement,
    cssSignature:'ludo-form-slider',

    fieldTpl:['<table cellpadding="0" cellspacing="0" border="0" width="100%">',
        '<tbody>',
        '<tr class="input-row">',
        '<td class="label-cell"><label></label></td>',
        '<td class="input-cell"></td>',
        '<td class="suffix-cell" style="display:none"></td>',
        '<td class="help-cell" style="display:none"></td>',
        '</tr>',
        '</tbody>',
        '</table>'
    ],

    /* No input element for slider */
    inputTag:undefined,
    inputType:undefined,

    /**
     * Size of slider background
     * @property sliderSize
	 * @optional
     * @private
     */
    sliderSize:100,

    /**
     * Direction of slider. If not explicit set, it will
     * be set to "horizontal" when width of slide is greater than height of slider,
     * otherwise it will be set to "vertical".
     * @property {String} direction
	 * @type String
     * @default horizontal
	 * @optional
     *
     */
    direction:'horizontal',

    /**
     * Minimum value of slider
     * @attribute {Number} minValue
     * @default 1
     */
    minValue:1,

    /**
     * Maximum value of slider
     * @attribute {Number} maxValue
     * @default 10
     */
    maxValue:10,

    height:undefined,

    /**
     * Revert x-, or y-axis, i.e. minimum value to the right instead of left or at the top instead of bottom
     * @attribute {Boolean} reverse
     * @default false
     */
    reverse:false,


    ludoConfig:function (config) {
        this.parent(config);
        if (config.direction !== undefined) {
            this.direction = config.direction;
            if (this.direction == 'vertical') {
                this.autoHeight = false;
            }
        }
        if (config.minValue !== undefined)this.minValue = config.minValue;
        if (config.maxValue !== undefined)this.maxValue = config.maxValue;
        if (config.reverse !== undefined)this.reverse = config.reverse;
    },

    ludoDOM:function () {
        this.parent();
        this.moveSliderBackgrounds();
    },

    moveSliderBackgrounds:function () {

        var offset = Math.round(this.getHandleSize() / 2);

        var css = ['top', 'bottom'];
        if (this.getDirection() == 'horizontal') {
            css = ['left', 'right'];
        }
        this.els['bgfirst'].style[css[0]] = offset + 'px';
        this.els['bglast'].style[css[1]] = offset + 'px';
    },

    addInput:function () {
        this.parent();

        var el = this.els.slider = new Element('div');
        this.els.slider.addEvent('click', this.sliderClick.bind(this));

        ludo.dom.addClass(el, 'ludo-form-slider-container');
        ludo.dom.addClass(el, 'ludo-form-slider-' + this.getDirection());
        this.getInputCell().adopt(el);

        this.addSliderBg('first');
        this.addSliderBg('last');

        this.createSliderHandle();
    },

    createSliderHandle:function () {
        var handle = this.els.sliderHandle = new Element('div');
        ludo.dom.addClass(handle, 'ludo-form-slider-handle');
        this.els.slider.adopt(handle);

        this.drag = new ludo.effect.Drag(this.getDragConfig());
    },

    addSliderBg:function (pos) {
        var el = this.els['bg' + pos] = new Element('div');
        ludo.dom.addClass(el, 'ludo-form-slider-bg-' + pos);
        this.els.slider.adopt(el);
    },

    getDragConfig:function () {
        return {
            el:this.els.sliderHandle,
            directions:this.getDirection() == 'horizontal' ? 'X' : 'Y',
            listeners:{
                'drag':this.receivePosition.bind(this)
            },
            minPos:0,
            maxPos:this.getSliderSize()
        };
    },

    sliderClick:function (e) {
        if (!e.target.hasClass('ludo-form-slider-handle')) {
            var pos = this.els.slider.getPosition();
            var offset = Math.round(this.getHandleSize() / 2);
            this.receivePosition({
                x:e.page.x - pos.x - offset,
                y:e.page.y - pos.y - offset
            });
        }

    },
    receivePosition:function (pos) {
        this.setValue(this.pixelToValue(this.getDirection() == 'horizontal' ? pos.x : pos.y));
        /**
         * Change event
         * @event change
         * @param value of form field
         * @param Component this
         */
        this.fireEvent('change', [ this.value, this ]);
    },

    pixelToValue:function (px) {
        var min = this.getMinValue();
        var max = this.getMaxValue();
        var sliderSize = this.getSliderSize();
        var ret = Math.round(px / sliderSize * (max - min)) + min;
        if (this.shouldReverseAxis()) {
            ret = max - ret;
        }
        return ret;
    },

    getDirection:function () {
        if (this.direction === undefined) {
            var size = this.getBody().getSize();
            if (size.x >= size.y) {
                this.direction = 'horizontal';
            } else {
                this.direction = 'vertical';
                this.autoHeight = false;
            }
        }
        return this.direction;
    },

    getMinValue:function () {
        return this.minValue;
    },

    getMaxValue:function () {
        return this.maxValue;
    },

    setValue:function (value) {
        if (value > this.getMaxValue()) {
            value = this.getMaxValue();
        } else if (value < this.getMinValue()) {
            value = this.getMinValue();
        }
        this.parent(value);
        this.positionSliderHandle();
    },

    resizeDOM:function () {
        this.parent();
        if (this.direction == 'horizontal') {
            this.sliderSize = this.els.slider.offsetWidth;
        } else {
            this.sliderSize = this.getBody().offsetHeight - ludo.dom.getMH(this.els.slider);
            this.els.slider.style.height = this.getHeight() + 'px';
        }
        this.sliderSize -= this.getHandleSize();
        this.positionSliderHandle();
        this.drag.setMaxPos(this.sliderSize);
    },

    positionSliderHandle:function () {
        this.els.sliderHandle.style[this.handleCssProperty] = this.getHandlePos() + 'px';
    },

    getHandlePos:function () {
        var ret = Math.round((this.value - this.minValue) / (this.maxValue - this.minValue) * this.sliderSize);
        if (this.shouldReverseAxis()) {
            ret = this.sliderSize - ret;
        }
        return ret;
    },
    _shouldReverse:undefined,
    shouldReverseAxis:function () {
        if (this._shouldReverse == undefined) {
            this._shouldReverse = (this.direction == 'horizontal' && this.reverse) || (this.direction == 'vertical' && !this.reverse);
        }
        return this._shouldReverse;
    },

    getSliderSize:function () {
        return this.sliderSize;
    },

    getHandleSize:function () {
        if (this.handleSize === undefined) {
            var cssProperty = 'height';
            this.handleCssProperty = 'top';
            if (this.getDirection() == 'horizontal') {
                cssProperty = 'width';
                this.handleCssProperty = 'left';
            }

            this.handleSize = parseInt(this.els.sliderHandle.getStyle(cssProperty).replace('px', ''));
        }
        return this.handleSize;
    }
});
/**
 * Form field designed to search in dataSource.Collection
 * @namespace form
 * @class SearchField
 * @extends form.Text
 */
ludo.form.SearchField = new Class({
	Extends:ludo.form.Text,
	type:'form.SearchField',

	/**
	 * Collection to search in
	 * @config {dataSource.Collection} searchIn
	 * @default undefined
	 */
	searchIn:undefined,

	/**
	 * Delay in seconds from key press to search is executed.
	 * @config {Number} delay
	 * @default 0
	 */
	delay:0,

	lastValue:undefined,

	/**
	 Custom search fn to execute instead of plain text search
	 @config {Function} searchFn
	 @default undefined
	 @example
	 	searchFn:function(record){
	 		return record.value = this.value && record.active === true
	 	}
	 note that "this" inside the function is a reference to search field.
	 */
	searchFn:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.searchIn !== undefined)this.searchIn = config.searchIn;
		if (config.delay !== undefined)this.delay = config.delay;
		if (config.searchFn !== undefined)this.searchFn = config.searchFn.bind(this);
		this.addEvent('key', this.queue.bind(this));
	},

	queue:function (value) {
		if (this.delay === 0) {
			this.search();
		} else {
			this.lastValue = value;
			this.execute.delay(this.delay * 1000, this, value);
		}
	},

	execute:function (value) {
		if (value !== this.lastValue)return undefined;
		return this.search();
	},

	/**
	 * Executes search in data source
	 * @method search
	 */
	search:function () {
		return this.searchIn.getSearcher().search(this.searchFn ? this.searchFn : this.getValue());
	}
});
/**
 * Base class for form component validators
 * @namespace form.validator
 * @class Base
 * @extends Core
 */
ludo.form.validator.Base = new Class({
	Extends:ludo.Core,

	value:undefined,

	/**
	 * Validator is applied to this component
	 * @attribute object applyTo
	 * @default undefined
	 */
	applyTo:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.value !== undefined)this.value = config.value;
		if (config.applyTo !== undefined)this.applyTo = config.applyTo;
		if (!this.value) {
			this.loadValue();
		}
	},

	/**
	 Loading valid value from server.
	 @method loadValue
	 Request to server example:
	 @example
		{
			getValidatorValueFor:'nameOfView',
		}
	 Response from server example:
	 @example
	 	{ success:true, data : { value : 'valid value} }

	*/
	loadValue:function () {
		new ludo.remote.JSON({
			url:this.getUrl,
			data:{
				"request": ["Md5Validation",this.applyTo.getName(),"read"].join('/'),
				"data": {
					"md5Validation" : true,
					"getValidatorValueFor": this.applyTo.getName()
				}
			},
			"listeners":{
				"success":  function(request){
					this.value = request.getData().value;
					/**
					 * Event fired after validator value has been loaded from server
					 * @event loadValue
					 * @param form.validator.Base this
					 */
					this.fireEvent('loadValue', this);
				}.bind(this)
			}
		});
	},

	isValid:function (value) {
		return value == this.value;
	}
});
/**
 * Md5 validator for form elements
 * When used, the associated form element will be flagged as invalid if MD5(value) doesn't match value of this validator.
 * If no value is sent to the constructor of form.validator.Md5, it will send a request to the server and ask for it.
 * @class Md5
 * @extends form.validator.Base
 *
 */
ludo.form.validator.Md5 = new Class({
    Extends:ludo.form.validator.Base,
    type : 'form.validator.Md5',

    /**
     * MD5 value to validate against. Component will be valid only when
     * md5(formElement.value) matches this value
     * @attribute value
     * @default undefined
     */
    value:undefined,

    isValid : function(value){
        return faultylabs.MD5(value) == this.value;
    }
});
/**
 * Base class, paging buttons for datasource.Collection
 * Assign a paging element to a data source by sending "id" or config object of
 * the source using the dataSource constructor property
 * @namespace paging
 * @class Button
 * @extends form.Button
 */
ludo.paging.Button = new Class({
    Extends: ludo.form.Button,
    type : 'grid.paging.Next',
    width:25,
    buttonCls : '',
	tpl:undefined,
	onLoadMessage:undefined,

    ludoDOM:function(){
        this.parent();
        this.getBody().addClass(this.buttonCls);
    },

    ludoEvents:function(){
        this.parent();
        var ds = this.getDataSource();
        if(ds){
            this.addDataSourceEvents();
        }
    },
    addDataSourceEvents:function(){

    },

	insertJSON:function(){

	}
});
/**
 Button used to navigate to next page in a dataSource.Collection
 @namespace paging
 @class Next
 @extends paging.Button
 @constructor
 @param {Object} config
 @example
 	children:[
 		...
		 {
			 type:'paging.Next',
			 dataSource:'myDataSource'
		 }
 		...
 	}
 where 'myDataSource' is the id of a dataSource.Collection object used by a view.
 */
ludo.paging.Next = new Class({
	Extends:ludo.paging.Button,
	type:'grid.paging.Next',
	buttonCls:'ludo-paging-next',

	addDataSourceEvents:function () {
		this.addEvent('click', this.nextPage.bind(this));
		var ds = this.getDataSource();
		ds.addEvent('lastPage', this.disable.bind(this));
		ds.addEvent('notLastPage', this.enable.bind(this));
	},

	/**
	 * Calls nextPage() method of data source
	 * @method nextPage
	 */
	nextPage:function () {
		this.getDataSource().nextPage();
	}
});
/**
 Button used to navigate to previous page in a dataSource.Collection
 @namespace paging
 @class Last
 @extends paging.Button
 @constructor
 @param {Object} config
 @example
 	children:[
 		...
		 {
			 type:'paging.Previous',
			 dataSource:'myDataSource'
		 }
 		...
 	}
 where 'myDataSource' is the id of a dataSource.Collection object used by a view.
 */
ludo.paging.Previous = new Class({
	Extends:ludo.paging.Button,
	type:'grid.paging.Previous',
	buttonCls:'ludo-paging-previous',

	addDataSourceEvents:function () {
		this.addEvent('click', this.nextPage.bind(this));
		var ds = this.getDataSource();
		ds.addEvent('firstPage', this.disable.bind(this));
		ds.addEvent('notFirstPage', this.enable.bind(this));

		if (ds.isOnFirstPage()) {
			this.disable();
		}
	},

	nextPage:function () {
		this.getDataSource().previousPage();
	}

});
/**
 Button used to navigate to last page in a dataSource.Collection
 @namespace paging
 @class Last
 @extends paging.Button
 @constructor
 @param {Object} config
 @example
 	children:[
 		...
		 {
			 type:'paging.Last',
			 dataSource:'myDataSource'
		 }
 		...
 	}
 where 'myDataSource' is the id of a dataSource.Collection object used by a view.
 */
ludo.paging.Last = new Class({
	Extends:ludo.paging.Button,
	type:'grid.paging.Last',
	buttonCls:'ludo-paging-last',

	addDataSourceEvents:function () {
		this.addEvent('click', this.nextPage.bind(this));
		var ds = this.getDataSource();
		ds.addEvent('lastPage', this.disable.bind(this));
		ds.addEvent('notLastPage', this.enable.bind(this));
	},

	nextPage:function () {
		this.getDataSource().lastPage();
	}
});
/**
 Button used to navigate to first page in a dataSource.Collection
 @namespace paging
 @class First
 @extends paging.Button
 @constructor
 @param {Object} config
 @example
 	children:[
 		...
		 {
			 type:'paging.First',
			 dataSource:'myDataSource'
		 }
 		...
 	}
 where 'myDataSource' is the id of a dataSource.Collection object used by a view.
 */
ludo.paging.First = new Class({
	Extends:ludo.paging.Button,
	type:'grid.paging.First',
	buttonCls:'ludo-paging-first',

	addDataSourceEvents:function () {
		this.addEvent('click', this.firstPage.bind(this));
		var ds = this.getDataSource();
		ds.addEvent('firstPage', this.disable.bind(this));
		ds.addEvent('notFirstPage', this.enable.bind(this));

		if (ds.isOnFirstPage()) {
			this.disable();
		}
	},

	firstPage:function () {
		this.getDataSource().firstPage();
	}

});
/**
 * Text input for navigating to a specific page in a datasource.Collection
 * @namespace paging
 * @class PageInput
 * @extends form.Number
 */
ludo.paging.PageInput = new Class({
    Extends: ludo.form.Number,
    type : 'grid.paging.PageInput',
    width: 35,
    fieldWidth:30,
    minValue : 1,
    reverseWheel:true,

    ludoEvents:function(){
        this.parent();
        var ds = this.getDataSource();
        if(ds){
            ds.addEvent('page', this.setPageNumber.bind(this));
            ds.addEvent('load', this.updateMaxValue.bind(this));
            this.setPageNumber(ds.getPageNumber());
            this.addEvent('change', this.updateDataSourcePageNumber.bind(this));
            this.updateMaxValue();

        }
    },
    setPageNumber:function(number){
        this.value = number;
        this.els.formEl.set('value', number);
    },

    updateDataSourcePageNumber:function(){
        this.getDataSource().toPage(this.getValue());
    },

    updateMaxValue:function(){
        this.maxValue = this.getDataSource().getPageCount();
    },

	insertJSON:function(){

	}
});
/**
 Displays number of pages in a data source
 @class paging.TotalPages
 @extends View
 @constructor
 @param {Object} config
 @example
 children:[
 ...
 {
			  type:'paging.TotalPages',
			  dataSource:'myDataSource'
		  }
 ...
 }
 where 'myDataSource' is the id of a dataSource.Collection object used by a view.
 */
ludo.paging.TotalPages = new Class({
	Extends:ludo.View,
	type:'grid.paging.TotalPages',
	width:25,
	onLoadMessage:'',
	/**
	 * Text template for view. {pages} is replaced by number of pages in data source.
	 * @attribute {String} tpl
	 * @default '/{pages}'
	 */
	tpl:'/{pages}',

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-paging-total-pages');
	},

	ludoEvents:function () {
		this.parent();
		var ds = this.getDataSource();
		if (ds) {
			ds.addEvent('load', this.setPageNumber.bind(this));
			ds.addEvent('pageCount', this.setPageNumber.bind(this));
			this.setPageNumber(ds.getPageNumber());
		}
	},
	setPageNumber:function () {
		this.setHtml(this.tpl.replace('{pages}', this.getDataSource().getPageCount()));
	},

	insertJSON:function () {

	}
});
/**
 A view containing buttons and views for navigating in a dataSource.Collection.
 default children: ['paging.First','paging.Previous','paging.PageInput','paging.TotalPages','paging.Next','paging.Last']
 You can customize which views to show by using the children constructor property.
 @namespace paging
 @class NavBar
 @extends View
 @constructor
 @param {Object} config
 @example
 	children:[
 		{
			type:'grid.Grid',
			columnManager:{
				...
			},
			dataSource:{
				url:'data-source/grid.php',
				id:'myDataSource'
			}

 		},
 		...
 		...
		{
			type:'paging.NavBar',
			dataSource:'myDataSource'
		}
 		...
 	}
 where 'myDataSource' is the id of a dataSource.Collection object used by the Grid above.
 */
ludo.paging.NavBar = new Class({
	Extends:ludo.View,
	type:'paging.NavBar',
	layout:'cols',
	height:25,

	children:[
		{
			type:'paging.First'
		},
		{
			type:'paging.Previous'
		},
		{
			type:'paging.PageInput'
		},
		{
			type:'paging.TotalPages'
		},
		{
			type:'paging.Next'
		},
		{
			type:'paging.Last'
		}
	],

	ludoConfig:function (config) {
		this.parent(config);

		if (config.dataSource) {
			for (var i = 0; i < config.children.length; i++) {
				config.children[i].dataSource = config.dataSource;
			}
			this.dataSource = undefined;
		}
	},

	insertJSON:function(){

	}
});
/**
 * A Panel
 * A Panel is a component where the body element is a &lt;fieldset> with a &lt;legend>
 * @class Panel
 * @extends View
 */
ludo.Panel = new Class({
    Extends : ludo.View,
    tagBody : 'fieldset',

    ludoDOM : function() {
        this.parent();
        this.getEl().addClass('ludo-panel');
        this.els.legend = new Element('legend');
        this.els.body.adopt(this.els.legend);
        this.setTitle(this.title);
        this.getEl().addClass('ludo-panel');
    },

    ludoRendered : function(){
        this.parent();
        this.getBody().setStyle('display','block');
    },
    autoSetHeight : function() {
        this.parent();
        var sizeLegend = this.els.legend.measure(function(){
            return this.getSize();
        });
        this.height += sizeLegend.y;

    },

    getInnerHeightOfBody : function(){
        return this.parent() - this.getHeightOfLegend() - 5;
    },

    heightOfLegend : undefined,
    getHeightOfLegend : function(){
        if(this.heightOfLegend === undefined){
            this.heightOfLegend = this.els.legend.getSize().y;
        }
        return this.heightOfLegend;
    },

    resizeDOM : function(){
        var height = this.getHeight();
        if(height == 0){
            return;
        }

		height -= ludo.dom.getMBPH(this.getBody());
		height -= ludo.dom.getMBPH(this.getEl());

        if(height > 0 && !isNaN(height)){
            this.getBody().style.height = height + 'px';
        }
        
        var width = this.getWidth();
        width -= ludo.dom.getMBPW(this.getBody());
        width -= ludo.dom.getMBPW(this.getEl());

        if(width > 0 && !isNaN(width)){
            this.getBody().style.width = width + 'px';
        }
    },

    setTitle : function(title){
        this.parent(title);
        this.els.legend.set('html', title);
    }
});
/**
 * Anchor Component
 * @class Anchor
 * @extends View
 */
ludo.Anchor = new Class({
    Extends:ludo.View,
    type:'Anchor',
    height:15,
    ludoConfig:function (config) {
        this.parent(config);
        this.anchorText = config.anchorText;
    },

    ludoDOM:function () {
        this.parent();
        this.els.anchor = new Element('a');
        ludo.dom.addClass(this.els.anchor, 'ludo-anchor-text');
        this.els.anchor.set('html', this.html);
        this.els.anchor.setProperty('href', '#');
        this.els.anchor.addEvent('click', this.anchorClick.bind(this));
        this.getBody().adopt(this.els.anchor);
    },

    ludoEvents:function () {
        this.parent();
        this.getBody().addEvent('click', this.anchorClick.bind(this))
    },

    getAnchorTag:function () {
        return this.els.anchor;
    },

    anchorClick:function () {
        /**
         * Click on anchor
         * @event click
         * @param {Object} component
         */
        this.fireEvent('click', this);
        return false;
    }

});
/**
 * Basic dialog class and base class for all other dialogs
 * @namespace dialog
 * @class dialog.Dialog
 * @extends Window
 */
ludo.dialog.Dialog = new Class({
	Extends:ludo.Window,
	type:'dialog.Dialog',
	/**
	 * Show modal version of dialog
	 * @attribute {Boolean} modal
	 * @default true
	 */
	modal:true,
	/**
	 * Auto dispose/erase component on close
	 * @attribute {Boolean} autoDispose
	 * @default true
	 */
	autoDispose:true,
	/**
	 * Auto hide component on button click. If autoDispose is set to true, the component
	 * will be deleted
	 * @attribute {Boolean} autoHideOnBtnClick
	 * @default true
	 */
	autoHideOnBtnClick:true,

	/**
	 * Camelcase string config for buttons.<br>
	 * example: YesNoCancel for three buttons labeled "Yes", "No" and "Cancel"<br>
	 * Example of use: <br>
	 * new ludo.dialog.Dialog({<br>
     *      html : 'Do you want to save your work?',<br>
     *      buttonConfig : 'YesNoCancel'<br>
     *      listeners : {<br>
     *          'yes' : this.saveWork.bind(this),<br>
     *          'no' : this.discardWork.bind(this),<br>
     *          'cancel' : this.hide.bind(this)   <br>
     *      }
     * });
	 * @attribute {String} buttonConfig
	 * @default undefined
	 */
	buttonConfig:undefined,


	movable:true,
	closable:false,
	minimizable:false,
	fullScreen:false,

	ludoConfig:function (config) {

		config.buttonConfig = config.buttonConfig || this.buttonConfig;
		if (config.buttonConfig) {
			var buttons = config.buttonConfig.replace(/([A-Z])/g, ' $1');
			buttons = buttons.trim();
			buttons = buttons.split(/\s/g);
			config.buttons = [];
			for (var i = 0; i < buttons.length; i++) {
				config.buttons.push({
					value:buttons[i]
				});
			}
		}
		this.parent(config);
		if (config.modal !== undefined) this.modal = config.modal;
		if (config.autoDispose !== undefined)this.autoDispose = config.autoDispose;
		if (config.autoHideOnBtnClick !== undefined) this.autoHideOnBtnClick = config.autoHideOnBtnClick;
	},

	ludoDOM:function () {
		this.parent();
		if (this.isModal()) {
			var el = this.els.shim = new Element('div');
			ludo.dom.addClass(el, 'ludo-dialog-shim');
			el.setStyle('display', 'none');
			document.body.adopt(el);
		}
		this.getEl().addClass('ludo-dialog');
	},

	ludoEvents:function () {
		this.parent();
		if (this.isModal()) {
			this.getEventEl().addEvent('resize', this.resizeShim.bind(this));
		}
	},

	ludoRendered:function () {
		this.parent();
		if (!this.isHidden()) {
			this.showShim();
		}
		var buttons = this.getButtons();

		for (var i = 0; i < buttons.length; i++) {
			buttons[i].addEvent('click', this.buttonClick.bind(this));
		}
	},

	isModal:function () {
		return this.modal;
	},
	show:function () {
		this.parent();
		this.showShim();
	},

	hide:function () {
		this.parent();
		this.hideShim();
		if (this.autoDispose) {
			this.dispose.delay(100, this);
		}
	},

	showShim:function () {
		this.center();
		if (this.isModal()) {
			this.els.shim.setStyles({
				display:'',
				'z-index':this.getEl().getStyle('z-index') - 1
			});
			this.resizeShim();
		}
	},

	resizeShim:function () {
		var size = document.body.getSize();
		this.els.shim.style.width = size.x + 'px';
		this.els.shim.style.height = size.y + 'px';
	},

	hideShim:function () {
		if (this.isModal()) {
			this.els.shim.setStyle('display', 'none');
		}
	},

	center:function () {
		var size = document.body.getSize();
		this.setPosition({
			left:Math.round(size.x / 2) - Math.round(this.getWidth() / 2),
			top:Math.round(size.y / 2) - Math.round(this.getHeight() / 2)
		})
	},

	buttonClick:function (value, button) {
		/**
		 * This event is fired when a button is clicked.
		 * The name of the button is lowercase version of button value with white space removed
		 * Example: for a button with value "OK", an "ok" event will be sent.
		 *
		 * @event <lowercase button value>
		 * @param {Object} ludo.View (Parent component of button)
		 */
		this.fireEvent(button.getValue().replace(/\s/g, '').toLowerCase(), this);
		if (this.autoHideOnBtnClick) {
			this.hide();
		}
	}
});
/**
  Standard confirm dialog with default "OK" and "Cancel" buttons
  @namespace dialog
  @class Confirm
  @extends Dialog
  @constructor
  @param {Object} config
  @example
 	new ludo.dialog.Confirm({
 		html : 'Do you want to quit',
 		buttons:[
 			{
 				value:'Yes,'type':'form.Button',width:60
 			},
 			{
 				value:'No,'type':'form.Button',width:60
 			}
 		],
 		listeners:{
 			'yes':this.quit.bind(this)
 		}
 	});
  will create a confirm dialog with two buttons, "Yes" and "No". When click on "Yes", the dialog will be
 closed and disposed and the quit method of the object creating the dialog will be called. On click on "No"
 the dialog will be closed and disposed(it's default behavior on button click) and the nothing else will happen.
 */
ludo.dialog.Confirm = new Class({
    Extends: ludo.dialog.Dialog,
    type : 'dialog.Confirm',


    ludoConfig : function(config){
        if(!config.buttons && !config.buttonConfig && !config.buttonBar){
            config.buttons = [
                {
                    value : 'OK',
                    width : 60,
                    type : 'form.SubmitButton'
                },
                {
                    value : 'Cancel',
                    width : 60
                }
            ]
        }
        this.parent(config);
    }
});


/**
 @namespace dialog
 @class Alert
 @extends Dialog
 @description Alert dialog. This component has by default one button "OK" and will fire an
 "ok" event when this button is clicked
 @constructor
 @param config
 @example
	 new ludo.dialog.Alert(
	 	{ html: 'Well done! You solved this puzzle. Click OK to load next' }
	 	listeners : {
		   'ok' : this.loadNextPuzzle.bind(this)
		  }
	 });
 will display a dialog in default size with a listener attached to the "OK" button. When clicked
 it will call the loadNextPuzzle method of the object creating the alert dialog.
 */
ludo.dialog.Alert = new Class({
	Extends:ludo.dialog.Dialog,
	type:'dialog.Alert',
	buttonConfig:undefined,
	width:300,
	height:150,

	resizable:false,


	ludoConfig:function (config) {
		if (config.substr) {
			config = {
				html:config
			}
		}
		if (!config.buttons) {
			config.buttons = [
				{
					value:'OK',
					width:60
				}
			]
		}
		this.parent(config);
	}
});


/**
 * Dialog with one text field. Default buttons are "OK" and "Cancel"
 * @namespace dialog
 * @class Prompt
 * @extends Dialog
 */
ludo.dialog.Prompt = new Class({
    Extends: ludo.dialog.Dialog,
    type : 'dialog.Prompt',
    input : undefined,
    inputConfig : {},
    
    ludoConfig : function(config){
        if(!config.buttons && !config.buttonConfig && !config.buttonBar){
            config.buttons = [
                {
                    value : 'OK',
                    width : 60,
                    type:'form.SubmitButton'
                },
                {
                    value : 'Cancel',
                    width : 60
                }
            ]
        }
        this.label = config.label || '';
        this.value = config.value || '';
        this.inputConfig = config.inputConfig || {};
        this.parent(config);
    },

    ludoRendered : function(){
        this.parent();
        var inputConfig = Object.merge(this.inputConfig, {
            type : 'form.Text',
            label : this.label,
            value : this.value
        });

        this.input = this.addChild(inputConfig);

        this.input.focus();
    },
    /**
     * Return value of input field
     * @method getValue
     * @return String value
     */
    getValue : function(){
        return this.input.getValue()
    },

    buttonClick : function(value, button){
        /**
         * Event fired on when clicking on dialog button
         * @event lowercase name of button with white space removed
         * @param {String} value of input field
         * @param {Object} ludo.dialog.Prompt
         *
         */
        this.fireEvent(button.value.toLowerCase(), [this.getValue(), this]);
        if (this.autoHideOnBtnClick) {
            this.hide();
        }
    }

});
ludo.dialog.Form = new Class({
    Extends: ludo.dialog.Dialog,
    type : 'dialog.Form',
    input : undefined,
    elements : [],
    labelWidth : 150,

    ludoConfig : function(config){
        if(!config.buttons && !config.buttonConfig && !config.buttonBar){
            config.buttons = [
                {
                    value : 'OK',
                    width : 60
                },
                {
                    value : 'Cancel',
                    width : 60
                }
            ]
        }
        this.labelWidth = config.labelWidth || this.labelWidth;
        this.elements = config.elements || this.elements;
        this.parent(config);
    },

    ludoRendered : function(){
        this.parent();
        this.formCmp = this.addChild({
            type : 'form.Form',
            elements : this.elements
        });
        this.elements = undefined;
    },

    getValues : function(){
        return this.formCmp.getValues();
    },

    buttonClick : function(value){
        this.fireEvent(value.toLowerCase(), [this.getValues()]);
        this.hide();
    }

});
/**
 Base class for Video Player components
 @namespace video
 @class Video
 @extends View
 */
ludo.video.Video = new Class({
	Extends:ludo.View,
	type:'video.Video',
	/**
	 * ID of movie, to show, example an YouTube id
	 * @attribute movieId
	 * @type String
	 * @default undefined
	 */
	movieId:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.movieId) {
			this.movieId = config.movieId;
		}
	},

	setContent:function () {
		var el = this.els.body;

		var obj = new Element('object');
		obj.setProperties({
			'width':'100%',
			'height':'100%'
		});
		el.adopt(obj);

		var param = new Element('param');
		param.setProperties({
			'name':'movie',
			'value':this.getUrl()
		});
		obj.adopt(param);

		var param2 = new Element('param');
		param2.setProperties({
			'name':'wmode',
			'value':'transparent'
		});
		obj.adopt(param2);

		var embed = this.els.embed = new Element('embed');
		embed.setProperties({
			'src':this.getVideoUrl(),
			'type':'application/x-shockwave-flash',
			'wmode':'transparent',
			'width':'100%',
			'height':'100%'
		});
		obj.adopt(embed);
		el.setStyle('overflow', 'hidden');
		return el;
	},
	/**
	 * Load a new movie
	 * @method loadMovie
	 * @param {String} movieId
	 * @return undefined
	 */
	loadMovie:function (movieId) {
		this.movieId = movieId;
		this.els.embed.setProperty('src', this.getVideoUrl());
	}
});
/**
 YouTube video player component
 @namespace video
 @class YouTube
 @extends video.Video
 @constructor
 @param {Object} config
 @example
	 var win = new ludo.Window({
		 left:100, top:50,
		 hideBodyOnMove:true,
		 title:'YouTube Video',
		 aspectRatio:1.6,
		 preserveAspectRatio:true,
		 width:600,
		 layout:'rows',
		 children:[
			 { name:'youtubevideo', weight:1, type:'video.YouTube',movieId:'fPTLa3ylmuw' }
		 ]
	 });
 Shows a YouTube video inside a window.
 */
ludo.video.YouTube = new Class({
	Extends:ludo.video.Video,
	type:'video.YouTube',

	getVideoUrl:function () {
		return 'http://www.youtube.com/v/' + this.movieId;
	}

});
/**
 Goggle Video player component
 @namespace video
 @class GoogleVideo
 @extends video.Video
 */
ludo.video.GoogleVideo = new Class({
    Extends : ludo.video.Video,
    type : 'video.GoogleVideo',

    getVideoUrl:function(){
        return 'http://video.google.com/googleplayer.swf?docid=' + this.movieId;
    }

});
/**
 DailyMotion video player component
 @namespace video
 @class DailyMotion
 @extends video.Video
 */
ludo.video.DailyMotion = new Class({
	Extends:ludo.video.Video,
	type:'video.DailyMotion',

	getVideoUrl:function () {
		return 'http://www.dailymotion.com/swf/' + this.movieId;
	}
});
/**
 Class for styling of SVG DOM nodes
 @namespace canvas
 @class Paint
 @constructor
 @param {Object} config
 @example
 	var canvas = new ludo.canvas.Canvas({
		renderTo:'myDiv'
 	});

 	var paint = new ludo.canvas.Paint({
		'stroke-width' : 5,
		'stroke-opacity' : .5,
		'stroke-color' : '#DEF'
	}, { className : 'MyClass' );
 	canvas.adoptDef(paint); // Appended to &lt;defs> node

 	// create node and set "class" to paint
 	// alternative methods:
 	// paint.applyTo(node); and
 	// node.addClass(paint.getClassName());
	var node = new ludo.canvas.Node('rect', { id:'myId2', 'class' : paint});

 	canvas.adopt(node);

 	// Paint object for all &lt;rect> and &lt;circle> tags:

	var gradient = new ludo.canvas.Gradient({
        id:'myGradient'
    });
    canvas.adopt(gradient);
    gradient.addStop('0%', '#0FF');
    gradient.addStop('100%', '#FFF', 0);
    // New paint object applied to all &lt;rect> and &lt;circle> tags.
 	var paint = new ludo.canvas.Paint({
		'stroke-width' : 5,
		'fill' : gradient,
		'stroke-opacity' : .5,
		'stroke-color' : '#DEF'
	}, { selectors : 'rect, circle' );
 */

ludo.canvas.Paint = new Class({
	Extends:ludo.canvas.Node,
	tagName:'style',
	css:{},
	nodes:[],
	className:undefined,
	tag:undefined,
	cssPrefix : undefined,

	mappings:{
		'color':['stroke-color'],
		'background-color':['fill-color'],
		'opacity':['fill-opacity', 'stroke-opacity']
	},

	initialize:function (css, config) {
		config = config || {};
		this.className = config.className || 'css-' + String.uniqueID();
		this.cssPrefix = config.selectors ? config.selectors : '.' + this.className;
		if(config.selectors)delete config.selectors;
		if(config.className)delete config.className;
		this.parent(this.tagName, config);
		if (css !== undefined)this.setStyles(css);
	},

	setStyles:function (styles) {
		Object.each(styles, function (value, key) {
			this.setStyleProperty(key, value);
		}, this);
		this.updateCssContent();
	},

	/**
	 Update a css style
	 @method setStyle
	 @param {String} style
	 @param {String|Number}value
	 @example
	 	var paint = new ludo.canvas.Paint({
	 		css:{
	 			'stroke-opacity' : 0.5
	 		}
	 	});
	 	canvas.adopt(paint);
	 	paint.setStyle('stroke-opacity', .2);
	 */
	setStyle:function (style, value) {
		this.setStyleProperty(style, value);
		this.updateCssContent();
	},

	updateCssContent:function () {

		var css = JSON.encode(this.css);
		css  = css.replace(/"/g,"");
		css  = css.replace(/,/g,";");
		this.text(this.cssPrefix + css);
	},

	setStyleProperty:function (style, value) {
		value = this.getRealValue(value);
		if (this.mappings[style]) {
			this.setMapped(style, value);
		} else {
			this.css[style] = value;
		}
	},

	setMapped:function (style, value) {
		for (var i = 0; i < this.mappings[style].length; i++) {
			var m = this.mappings[style][i];
			this.css[m] = value;
		}
	},

	/**
	 * Return value of a css style
	 * @method getStyle
	 * @param {String} style
	 * @return {String|Number} value
	 */
	getStyle:function (style) {
		if (this.mappings[style])style = this.mappings[style][0];
		return this.css[style];
	},

	getRealValue:function (value) {
		return value && value.id !== undefined ? 'url(#' + value.id + ')' : value;
	},

	/**
	 * Apply css to a SVG node. This is done by adding CSS class to the node
	 * @method applyTo
	 * @param {canvas.Node} node
	 */
	applyTo:function (node) {
		ludo.canvasEngine.addClass(node.el ? node.el : node, this.className);
	},

	/**
	 * Returns class name of Paint object
	 * @method getClassName
	 * @return {String} className
	 */
	getClassName:function () {
		return this.className;
	},

	getUrl:function(){
		return this.className;
	}
});

/**
 * Super class for canvas.Circle, canvas.Rect +++
 * @namespace canvas
 * @class NamedNode
 */
ludo.canvas.NamedNode = new Class({
	Extends: ludo.canvas.Node,

	initialize:function (attributes, text) {
		this.parent(this.tagName, attributes, text);
	}

});
/**
Class for linear gradients
@namespace canvas
@class Gradient
@extends canvas.NamedNode
@constructor
@param {Object} config
@example
	var gradient = new ludo.canvas.Gradient({
		id:'myGradient'
	});
	gradient.addStop('0%', 'red');
	gradient.addStop('100%', '#FFF', 1);

 */
ludo.canvas.Gradient = new Class({
	Extends:ludo.canvas.NamedNode,
	tagName:'linearGradient',
	stopTags:[],

	/**
	 Add stop point
	 @method addStop
	 @param {String} offset
	 @param {String} stopColor
	 @param {Number} stopOpacity
	 @return {canvas.Stop} stop
	 @example
		 var gradient = new ludo.canvas.Gradient({
			id:'myGradient'
		 });
		 gradient.addStop('0%', 'red');
		 gradient.addStop('100%', '#FFF', 1);
	 	 canvas.adopt(gradient);
	 */
	addStop:function (offset, stopColor, stopOpacity) {
		var attr = {
			offset:offset,
			'stop-color':stopColor
		};
		if (stopOpacity !== undefined) {
			if (stopOpacity > 1)stopOpacity = stopOpacity / 100;
			attr['stop-opacity'] = stopOpacity
		}
		var stopTag = new ludo.canvas.Stop(attr);
		this.adopt(stopTag);
		this.stopTags.push(stopTag);
		return stopTag;
	},

	/**
	 * Get stop node by index
	 * @method getStop
	 * @param {Number} index
	 * @return {canvas.Stop} stop
	 */
	getStop:function (index) {
		return this.stopTags[index];
	}

});
/**
 Class for creating Radial Gradients,
 see: http://www.w3.org/TR/SVG/pservers.html#RadialGradientElement
 @namespace canvas
 @class RadialGradient
 @extends canvas.Gradient
 @example
 	var gradient = new ludo.canvas.RadialGradient({
		cx:400,cy:200,r:300,fx:400,fy:200
	});
 	gradient.addStop('0%', 'red');
 	gradient.addStop('50%', 'blue');
 	gradient.addStop('100%', 'red');
 */
ludo.canvas.RadialGradient = new Class({
	Extends:ludo.canvas.Gradient,
	tagName:'radialGradient',

	initialize:function (config) {
		config = config || {};
		config.gradientUnits = config.gradientUnits || 'userSpaceOnUse';
		this.parent(config);
	},

	setCx:function (value) {
		this.set('cx', value);
	},

	setCy:function (value) {
		this.set('cy', value);
	},

	setR:function (value) {
		this.set('r', value);
	},

	setFx:function (value) {
		this.set('fx', value);
	},

	setFy:function (value) {
		this.set('fy', value);
	}
});
/**
 * Stop tag used by gradients
 * @namespace canvas
 * @class Stop
 * @extends ludo.canvas.Node
 */
ludo.canvas.Stop = new Class({
	Extends: ludo.canvas.Node,

	initialize:function(config){
		this.parent('stop', config);
	},

	/**
	 Set new offset
	 @method setOffset
	 @param {String} offset
	 @example
	 	gradient.getStop(0).setOffset('10%');
	 */
	setOffset:function(offset){
		this.set('offset', offset);
	},
	/**
	 Set new stop color
	 @method setStopColor
	 @param {String} stopColor
	 @example
	 	gradient.getStop(0).setStopColor('#FFFFFF');
	 */
	setStopColor:function(stopColor){
		this.set('stop-color', stopColor);
	},

	/**
	 * Returns value of offset attribute
	 * @method getOffset
	 * @return {String} offset
	 */
	getOffset:function(){
		return this.get('offset');
	},

	/**
	 * Returns value of stop-color attribute
	 * @method getStopColor
	 * @return {String} stop color
	 */
	getStopColor:function(){
		return this.get('stop-color');
	},

	/**
	 * Set new stop opacity(0 = transparent, 1 = full opacity)
	 * @method setStopOpacity
	 * @param {Number} stopOpacity
	 */
	setStopOpacity:function(stopOpacity){
		this.set('stop-opacity', stopOpacity);
	},

	/**
	 * Returns value of stop-opacity property
	 * @method getStopOpacity
	 * @return {Number} stop opacity
	 */
	getStopOpacity:function(){
		return this.get('stop-opacity');
	}
});
/**
 Class for dragging {{#crossLink "canvas/Node"}}{{/crossLink}} elements.
 @namespace canvas
 @class Drag
 @extends effect.Drag
 @constructor
 @param {Object} config, see {{#crossLink "effect/Drag"}}{{/crossLink}}
 @example
    var canvas = new ludo.canvas.Canvas({
    	renderTo:document.body
    });

	var paintThree = new ludo.canvas.Paint({
	  autoUpdate:true,
	  css:{
	  	  'fill' : '#DEF',
		  'stroke':'#888',
		  'stroke-width':'5',
		  cursor:'pointer'
	  }
	});
 	var circle = new ludo.canvas.Circle({cx:280, cy:280, r:85}, { paint:paintThree });
    canvas.adopt(circle);

 	var drag = new ludo.canvas.Drag();
 	drag.add(circle);
*/
ludo.canvas.Drag = new Class({
	Extends:ludo.effect.Drag,

	ludoEvents:function () {
		this.parent();
		this.addEvent('before', this.setStartTranslate.bind(this));
	},

	setStartTranslate:function (node) {
		this.dragProcess.startTranslate = node.el.getTransformation('translate') || {x:0, y:0};
	},

	/**
	 * Add node
	 * @method add
	 * @param {effect.DraggableNode} node
	 * @return {effect.DraggableNode} added node
	 */
	add:function (node) {
		node = this.getValidNode(node);
		if (node.handle === undefined)node.handle = node.el;
		var id = node.el.getEl().id;

		this.els[id] = Object.merge(node, {
			handle:node.handle
		});
		this.els[id].handle.addEvent(this.getDragStartEvent(), this.startDrag.bind(this));
		return this.els[id];
	},

	getValidNode:function (node) {
		if (!this.isElConfigObject(node)) {
			node = {
				el:node
			};
		}
		node.el.set('forId', node.el.getEl().id);
		return node;
	},

	isElConfigObject:function (config) {
		return config.getEl === undefined;
	},

	getPositionedParent:function () {
		return undefined;
	},

	getIdByEvent:function (e) {
		var el = e.target || e.event.srcElement.correspondingUseElement;
		var id = el.id;

		while(!this.els[id] && el.parentNode){
			el = el.parentNode;
			id = el.id;
		}

		return id;
	},
    transformationExists:false,
    startDrag:function(e){
        this.parent(e);
        this.transformationExists = this.hasTransformation();
    },

    hasTransformation:function(){
        //
        var translate = this.els[this.dragProcess.dragged].el.get('transform');
        if(translate){
            var items = translate.split(/\s([a-z])/g);
            if(items.length > 1)return true;
            if(items.length === 0)return false;
            return items[0].split(/\(/g)[0] !== 'translate';
        }
        return false;
    },

	move:function (pos) {
		var node = this.els[this.dragProcess.dragged].el;
		var translate = {
			x:this.dragProcess.startTranslate.x,
			y:this.dragProcess.startTranslate.y
		};

		if (pos.x !== undefined) {
			translate.x = pos.x;
			this.dragProcess.currentX = pos.x;
		}
		if (pos.y !== undefined) {
			translate.y = pos.y;
			this.dragProcess.currentY = pos.y;
		}
		// return node.translate(translate.x, translate.y);
        if(this.transformationExists){
			node.translate(translate.x, translate.y);
            node.setTransformation('translate', translate.x + ' ' + translate.y);
        }else{
            node.el.setAttribute('transform', ['translate(', translate.x, ' ', translate.y, ')'].join('') );
            this.lastTranslate = translate;
        }
	},

    endDrag:function(e){
        if (this.dragProcess.active) {
            if(this.lastTranslate !== undefined){
                var node = this.els[this.dragProcess.dragged].el;
                node.setTransformation('translate', this.lastTranslate.x + ' ' + this.lastTranslate.y);
            }
            this.parent(e);
        }
    },

	getPositionOf:function (node) {
		return node.getTransformation('translate') || {x:0, y:0}
	}
});
ludo.canvas.EventManager = new Class({
	nodes:{},

	currentNodeId:undefined,

	addMouseEnter:function (node, fn) {
		node.addEvent('mouseover', this.getMouseOverFn(fn));
		node.addEvent('mouseout', this.clearCurrent.bind(this, node));
	},

	addMouseLeave:function(node, fn){
		node.addEvent('mouseout', this.getMouseOutFn(fn));
		node.addEvent('mouseout', this.clearCurrent.bind(this, node));
	},

	clearCurrent:function(node){
		if(node.getEl().id === this.currentNodeId)this.currentNodeId = undefined;
	},

	getMouseOverFn:function (fn) {
		return function (e, node) {
			if(fn && !this.isInCurrentBranch(node)){
				this.currentNodeId = node.getEl().id;
				fn.call(node, e, node);
			}
		}.bind(this)
	},

	getMouseOutFn:function (fn) {
		return function (e, node) {
			if(fn && !this.isInCurrentBranch(node)){
				this.currentNodeId = undefined;
				fn.call(node, e, node);
			}
		}.bind(this)
	},

	isInCurrentBranch:function(leaf){
		if(!this.currentNodeId)return false;
		if(leaf.getEl().id === this.currentNodeId)return true;
		leaf = leaf.parentNode;
		while(leaf){
			if(leaf.getEl().id === this.currentNodeId)return true;
			leaf = leaf.parentNode;
		}
		return false;

	}
});
ludo.canvasEventManager = new ludo.canvas.EventManager();
/**
 Class for circle tags. It extends canvas.Node by adding setter and getter methods
 for radius, center x and center y.
 @namespace canvas
 @class Circle
 @extends canvas.Node
 @constructor
 @param {Object} coordinates
 @param {canvas.NodeConfig} config
 @example
	 var circle = new ludo.canvas.Circle(
 		{ cx:100, cy:100, r:200 },
	 	{ paint:paintObject }
 	 );
 */
ludo.canvas.Circle = new Class({
	Extends:ludo.canvas.NamedNode,
	tagName:'circle',

	/**
	 * Set new radius
	 * @method setRadius
	 * @param {Number} radius
	 */
	setRadius:function (radius) {
		this.set('r', radius);
	},

	/**
	 * Return curent radius
	 * @method getRadius
	 * @return {String|Number} radius
	 */
	getRadius:function () {
		return this.el.r.animVal.value;
	},

	/**
	 * Set new center X
	 * @method setCx
	 * @param {Number} x
	 */
	setCx:function (x) {
		this.set('cx', x);
	},
	/**
	 * Return current center X
	 * @method getX
	 * @return {String|Number} cx
	 */
	getCx:function () {
		return this.el.cx.animVal.value;
	},

	/**
	 * Set new center Y
	 * @method setCy
	 * @param {Number} y
	 */
	setCy:function (y) {
		this.set('cy', y);
	},
	/**
	 * Return current center Y
	 * @method getCy
	 * @return {String|Number} cy
	 */
	getCy:function () {
		return this.el.cy.animVal.value;
	},

	/**
	 * Return position on canvas
	 * @method getPosition()
	 * @return {Object} x and y
	 */
	getPosition:function(){
		var translate = this.getTranslate();
		var r = this.getRadius();
		return {
			x: this.getCx() - r + translate.x,
			y: this.getCy() - r + translate.y
		}
	},

	getSize:function(){
		var r = this.getRadius();
		return {
			x: r*2,
			y: r*2
		}
	}
});
/**
 Class for rect tags. It extends canvas.Node by adding setter and getter methods
 for x,y, width, height and rounded corners(rx and ry).
 @namespace canvas
 @class Rect
 @extends canvas.Node
 @constructor
 @param {Object} coordinates
 @param {canvas.NodeConfig} config
 @example
	 var rect = new ludo.canvas.Rect(
 		{ x:100,y:100, width:200,height:100 },
	 	{ paint:paintObject }
 	 );
 */
ludo.canvas.Rect = new Class({
	Extends: ludo.canvas.NamedNode,
	tagName : 'rect',

	/**
	 * Returns value of 'x' attribute. Actual position on canvas may be different due to
	 * translate transformation. Use {{#crossLink "canvas.Rect/getPosition"}}{{/crossLink}} to
	 * get actual position on canvas.
	 * @method getX
	 * @return {Number} x
	 */
	getX:function(){
		return this.el.x.animVal.value;
	},

	/**
	 * Returns value of 'y' attribute.
	 * @method getY
	 * @return {Number} y
	 */
	getY:function(){
		return this.el.y.animVal.value;
	},

	/**
	 * Returns width of rectangle
	 * @method getWidth
	 * @return {Number} width
	 */
	getWidth:function(){
		return this.el.width.animVal.value;
	},

	/**
	 * Returns height of rectangle
	 * @method getWidth
	 * @return {Number} width
	 */
	getHeight:function(){
		return this.el.height.animVal.value;
	},
	/**
	 * Return x-size of rounded corners
	 * @method getRx
	 * @return {Number} rx
	 */
	getRx:function(){
		return this.el.rx.animVal.value;
	},

	/**
	 * Return y-size of rounded corners
	 * @method getRy
	 * @return {Number} ry
	 */
	getRy:function(){
		return this.el.ry.animVal.value;
	},

	/**
	 * Set new x coordinate
	 * @method setX
	 * @param {Number} x
	 */
	setX:function(x){
		this.set('x', x);
	},

	/**
	 * Set new y coordinate
	 * @method setY
	 * @param {Number} y
	 */
	setY:function(y){
		this.set('y', y);
	},

	/**
	 * Set new width
	 * @method setWidth
	 * @param {Number} width
	 */
	setWidth:function(width){
		this.set('width', width);
	},
	/**
	 * Set new height
	 * @method setHeight
	 * @param {Number} height
	 */
	setHeight:function(height){
		this.set('height', height);
	},

	/**
	 * Set new width of rounded corners
	 * @method setRx
	 * @param {Number} rx
	 */
	setRx:function(rx){
		this.set('rx', rx);
	},

	/**
	 * Set new height of rounded corners
	 * @method setRy
	 * @param {Number} ry
	 */
	setRy:function(ry){
		this.set('ry', ry);
	}


});
/**
 Class for drawing polylines.
 @namespace canvas
 @class Polyline
 @extends canvas.NamedNode
 @constructor
 @param {String} points
 @param {canvas.NodeConfig} config
 @example
 	var polyline = new ludo.canvas.Polyline('20,20 40,25 60,40 80,120 120,140 200,180');
 */
ludo.canvas.Polyline = new Class({
	Extends: ludo.canvas.NamedNode,
	tagName : 'polyline',
	pointString : '',
	pointArray : undefined,
	size:undefined,
	position:undefined,

	initialize:function(points, properties){
		properties = properties || {};
		properties.points = points;
		this.parent(properties);
		this.pointString = points;
	},

	/**
	 * Return x and y of a point
	 * @method getPoint
	 * @param {Number} index
	 * @return {Object} x and y
	 */
	getPoint:function(index){
		if(this.pointArray === undefined)this.buildPointArray();
		index *=2;
		if(index > this.pointArray.length-2)return undefined;
		return {
			x : this.pointArray[index],
			y : this.pointArray[index+1]
		}
	},

	/**
	 Set new x and y for one of the points.
	 @method setPoint
	 @param {Number} index
	 @param {Number} x
	 @param {Number} y
	 @example
		 var polyline = new ludo.canvas.Polyline('20,20 40,25 60,40 80,120 120,140 200,180');
	     polyline.setPoint(0,10,5);
	     polyline.setPoint(1,120,40);
	 will change the points to
	 @example
	 	'10,5 120,40 60,40 80,120 120,140 200,180'
	 */
	setPoint:function(index, x, y){
		if(this.pointArray === undefined)this.buildPointArray();
		index *=2;
		if(index > this.pointArray.length-2)return;
		this.pointArray[index] = x;
		this.pointArray[index+1] = y;
		this.set('points', this.pointArray.join(' '));
		this.size = undefined;
		this.position = undefined;
	},

	buildPointArray:function(){
		var points = this.pointString.replace(/,/g,' ');
		points = points.replace(/\s+/g,' ');
		this.pointArray = points.split(/\s/g);
	},
	/**
	 * Get size of polyline (max X - min X) and (max X - min Y)
	 * @method getSize
	 * @return {Object} x and y
	 */
	getSize:function(){
		if(this.size === undefined){
			var minMax = this.getMinAndMax();
			this.size = {
				x : Math.abs(minMax.maxX - minMax.minX),
				y : Math.abs(minMax.maxY - minMax.minY)
			};
		}
		return this.size;
	},
	/**
	 * Get position of polyline, min X and min Y)
	 * @method getPosition
	 * @return {Object} x and y
	 */
	getPosition:function(){
		if(this.position === undefined){
			var minMax = this.getMinAndMax();
			this.position = {
				x : minMax.minX,
				y : minMax.minY
			};
		}
		return this.position;
	},

	getMinAndMax:function(){
		if(this.pointArray === undefined)this.buildPointArray();
		var p = this.pointArray;
		var minX = 10000, maxX = -100000;
		var minY = 10000, maxY = -100000;
		for(var i=0;i< p.length;i+=2){
			minX = Math.min(minX, p[i]);
			maxX = Math.max(maxX, p[i]);
			minY = Math.min(minY, p[i+1]);
			maxY = Math.max(maxY, p[i+1]);
		}
		return {
			minX: minX, minY: minY,
			maxX: maxX, maxY: maxY
		}
	}
});
/**
 Class for drawing polygons.
 @namespace canvas
 @class Polygon
 @extends canvas.Polyline
 @constructor
 @param {String} points
 @param {canvas.NodeConfig} config
 @example
 	var polyline = new ludo.canvas.Polygon('20,20 40,25 60,40 80,120 120,140 200,180');
 */
ludo.canvas.Polygon = new Class({
	Extends: ludo.canvas.Polyline,
	tagName: 'polygon'
});
/**
 Class for drawing ellipses.
 @namespace canvas
 @class Ellipse
 @extends canvas.NamedNode
 @constructor
 @param {Object} coordinates
 @param {canvas.NodeConfig} config
 @example
 	var ellipse = new ludo.canvas.Ellipse({ cx:500, cy:425, rx:250, ry:200 }, { paint: paintObject } );
 */
ludo.canvas.Ellipse = new Class({
	Extends:ludo.canvas.NamedNode,
	tagName:'ellipse',

	/**
	 * Set new x-radius
	 * @method setRadiusX
	 * @param {Number} radius
	 */
	setRadiusX:function (radius) {
		this.set('rx', radius);
	},

	/**
	 * Set new y-radius
	 * @method setRadiusY
	 * @param {Number} radius
	 */
	setRadiusY:function (radius) {
		this.set('ry', radius);
	},

	/**
	 * Return curent radius
	 * @method getRadiusX
	 * @return {String|Number} x-radius
	 */
	getRadiusX:function () {
		return this.el.rx.animVal.value;
	},

	/**
	 * Return curent y-radius
	 * @method getRadiusY
	 * @return {String|Number} y-radius
	 */
	getRadiusY:function () {
		return this.el.ry.animVal.value;
	},

	/**
	 * Set new center X
	 * @method setCx
	 * @param {Number} x
	 */
	setCx:function (x) {
		this.set('cx', x);
	},
	/**
	 * Return current center X
	 * @method getX
	 * @return {String|Number} cx
	 */
	getCx:function () {
		return this.el.cx.animVal.value;
	},

	/**
	 * Set new center Y
	 * @method setCy
	 * @param {Number} y
	 */
	setCy:function (y) {
		this.set('cy', y);
	},
	/**
	 * Return current center Y
	 * @method getCy
	 * @return {String|Number} cy
	 */
	getCy:function () {
		return this.el.cy.animVal.value;
	},

	/**
	 * Return position on canvas
	 * @method getPosition()
	 * @return {Object} x and y
	 */
	getPosition:function () {
		var translate = this.getTranslate();
		return {
			x:this.getCx() - this.getRadiusX() + translate.x,
			y:this.getCy() - this.getRadiusY() + translate.y
		}
	},

	/**
	 Return size of ellipse
	 @method getSize
	 @return {Object} x and y
	 @example
	 	var ellipse = new ludo.canvas.Ellipse({ cx:500, cy:425, rx:250, ry:200 });
	 	var size = ellipse.geSize(); // will return {x: 500, y: 400}
	 which is rx*2 and ry*2

	 */
	getSize:function () {
		return {
			x:this.getRadiusX() * 2,
			y:this.getRadiusY() * 2
		}
	}
});
ludo.canvas.Path = new Class({
	Extends:ludo.canvas.NamedNode,
	tagName:'path',
	pointString:undefined,
	pointArray:undefined,
	size:undefined,
	position:undefined,

	initialize:function (points, properties) {
		properties = properties || {};
		points = this.getValidPointString(points);
		properties.d = points;
		this.parent(properties);
		this.pointString = points;
	},

	getValidPointString:function (points) {
		return points.replace(/([A-Z])/g, '$1 ').trim().replace(/,/g, ' ').replace(/\s+/g, ' ');
	},

	getPoint:function (index) {
		if (this.pointArray === undefined)this.buildPointArray();
		index *= 3;
		return {
			x:this.pointArray[index + 1],
			y:this.pointArray[index + 2]
		};
	},

	setPoint:function (index, x, y) {
		if (this.pointArray === undefined)this.buildPointArray();
		index *= 3;
		if (index < this.pointArray.length - 3) {
			this.pointArray[index + 1] = x;
			this.pointArray[index + 2] = y;
			this.pointString = this.pointArray.join(' ');
			this.set('d', this.pointString);
			this.size = undefined;
			this.position = undefined;
		}
	},

	buildPointArray:function () {
		var points = this.pointString.replace(/,/g, ' ').replace(/\s+/g, ' ');
		this.pointArray = points.split(/([A-Z\s])/g).erase(" ").erase("");
	},
	/**
	 * Get size of polyline (max X - min X) and (max X - min Y)
	 * @method getSize
	 * @return {Object} x and y
	 */
	getSize:function(){
		if(this.size === undefined){
			var minMax = this.getMinAndMax();
			this.size = {
				x : Math.abs(minMax.maxX - minMax.minX),
				y : Math.abs(minMax.maxY - minMax.minY)
			};
		}
		return this.size;
	},

	getPosition:function(){
		if(this.position === undefined){
			var minMax = this.getMinAndMax();
			this.position = {
				x : minMax.minX,
				y : minMax.minY
			};
		}
		return this.position;
	},

	getMinAndMax:function () {
		if (this.pointArray === undefined)this.buildPointArray();
		var p = this.pointArray;
		var minX = 10000, maxX = -100000;
		var minY = 10000, maxY = -100000;
		for (var i = 0; i < p.length - 2; i += 3) {
			minX = Math.min(minX, p[i+1]);
			maxX = Math.max(maxX, p[i+1]);
			minY = Math.min(minY, p[i + 2]);
			maxY = Math.max(maxY, p[i + 2]);
		}
		return {
			minX:minX, minY:minY,
			maxX:maxX, maxY:maxY
		}
	}
});
/**
 Class for SVG filter effects, example Drop Shadow
 Note! Filters will produce raster graphic, not Vector.
 Note! Filters are not supported by IE 9 and lower. (Support is added to IE10).
 Ref: http://caniuse.com/svg-filters
 @namespace canvas
 @class Filter
 @extends canvas.NamedNode
 @constructor
 @param {Object} attributes
 @param {Object} config options
 *
 */
ludo.canvas.Filter = new Class({
	Extends:ludo.canvas.NamedNode,
	tagName:'filter',
	mergeTags:{},
	mergeTagsOrder : [
		'dropShadow', 'SourceGraphic'
	],

	effectNodes:{
		'dropShadow' : ['feGaussianBlur', 'feOffset']
	},
	nodes:{
		'dropShadow' : undefined
	},

	initialize:function(properties){
		properties = properties || {};
		if( properties.x === undefined)  properties.x = '-40%';
		if( properties.y === undefined)  properties.y = '-40%';
		properties.width = properties.width || '180%';
		properties.height = properties.height || '180%';
		this.parent(properties);
	},
	/**
	 Set drop shadow
	 @method setDropShadow
	 @param {Object} properties
	 @example
	 	filter.setDropShadow({
	 		x: 2, y: 2, // Offset
	 		deviation: 2, // blur
	 		color : '#000'
	 	});
	 */
	setDropShadow:function (properties) {
		var nodes = this.getNodesForEffect('dropShadow');
		var blur = nodes['feGaussianBlur'];
		blur.set('in', 'SourceAlpha');
		blur.set('result', 'dropShadowBlur');
		blur.set('stdDeviation', properties.deviation);

		var o = nodes['feOffset'];
		o.set('dx', properties.x || 2);
		o.set('dy', properties.y || 2);
		o.set('in', 'dropShadowBlur');
		o.set('result', 'dropShadow');

	},



	getNodesForEffect:function(effect){
		var n = this.nodes[effect];
		if(n === undefined){
			n = {};
			var keys = this.effectNodes[effect];
			for(var i=0;i<keys.length;i++){
				n[keys[i]] = new ludo.canvas.Node(keys[i]);
				this.adopt(n[keys[i]]);
			}
			this.addFeMergeNode('SourceGraphic');
			this.addFeMergeNode(effect);

		}
		return n;
	},

	updateMergeTag:function () {
		var m = this.getMergeTag();
		var o = this.mergeTagsOrder;
		for(var i=0;i<o.length;i++){
			if(this.mergeTags[o[i]] !== undefined){
				console.log(this.mergeTags[o[i]].getParent());
				console.log(this.mergeTags[o[i]].el.tagName);
				console.log(this.mergeTags[o[i]].el.parentNode);
				ludo.canvasEngine.toFront(this.mergeTags[o[i]].el);
			}
		}
		ludo.canvasEngine.toFront(m.el);
	},
	mergeTag:undefined,
	getMergeTag:function () {
		if (this.mergeTag === undefined) {
			this.mergeTag = new ludo.canvas.Node('feMerge');
			this.adopt(this.mergeTag);

		}
		return this.mergeTag;
	},

	/**
	 * Adds a new feMergeNode DOM node to the feMerge node
	 * @method addFeMergeNode
	 * @param {String} key
	 * @return {canvas.Node} feMergeNode
	 */
	addFeMergeNode:function (key) {
		if (this.mergeTags[key] === undefined) {
			this.mergeTags[key] = new ludo.canvas.Node('feMergeNode', { "in":key });
			this.getMergeTag().adopt(this.mergeTags[key]);
			this.updateMergeTag();
		}
		return this.mergeTags[key];
	}
});
/**
 Class for masking of SVG DOM nodes
 @namespace canvas
 @class Mask
 @constructor
 @param {Object} properties
 @example
	 var mask = new ludo.canvas.Mask({ id : 'Mask' });
	 canvas.adoptDef(mask); // canvas is a ludo.canvas.Canvas object

	 var gr = new ludo.canvas.Gradient({
		 id:'gradient'
	 });
	 gr.addStop('0%', 'white', 0);
	 gr.addStop('100%', 'white', 1);
 	 canvas.adopt(gr);

	 var rect2 = new ludo.canvas.Rect({ x:0,y:0, width:500,height:500, fill:gr });
	 mask.adopt(rect2); // Append rect to mask
	 // create ellipsis with reference to mask
 	 var ellipse = new ludo.canvas.Ellipse({ cx:100, cy:125, rx:50, ry:70,mask:mask });

 */
ludo.canvas.Mask = new Class({
	Extends: ludo.canvas.NamedNode,
	tagName : 'mask'
});
