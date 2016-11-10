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
	 @function create
	 @param {Object|ludo.Core} config
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
		try{
			var obj = this.createInstance(config.type, config);
			if(obj!=undefined)return obj;
		}catch(e){

		}
		ludo.util.log('Could not find class ' + config.type);
		return undefined;
	},

	createInstance:function(path, config){
		var tokens = path.split(/\./g);
		var name = tokens.pop();
		var parent = window;
		for(var i=0;i<tokens.length;i++){
			var n = tokens[i];
			if(parent[n] != undefined){
				parent = parent[n];
			}
		}

		if(parent[name] != undefined){
			return new parent[name](config);
		}
		return undefined;
	},

	registerClass:function(typeName, classReference){
		this.classReferences[typeName] = classReference;
	},


	/**
	 Creates alias name to a custom View or class for use in the type attributes.
	 @function createAlias
	 @param {String} typeName
	 @param {ludo.Core} classReference
	 @example
	 ludo.factory.ns('MyApp.view'); // creates window.MyApp.view if undefined

	 // Create new class
	 MyApp.view.MyView = new Class({
	 		Extends: ludo.View
	 });

	 // Create alias name "MyView" which refers to MyApp.view.MyView
	 ludo.factory.createAlias('MyView', MyApp.view.MyView);
	 ...
	 ...
	 new ludo.View({
	 		...
	 		children:[{
	 			type:'MyView' // Alias name used instead of full namespace and class name
			}]
		});
	 */
	createAlias : function(aliasName, classReference){
		this.classReferences[aliasName] = classReference;
	},

	createNamespace:function(ns){
		if(window[ns] === undefined)window[ns] = {};
		if(this.namespaces.indexOf(ns) === -1)this.namespaces.push(ns);
	},


	/**
	 Automatically creates a Javascript namespace if it doesn't exists.
	 This is a convenient method which you let you write
	 <code>
	 ludo.factory.ns('my.namespace');
	 </code>
	 instead of
	 <code>
	 if(window.my == undefined)window.my = {};
	 if(window.my.namespace == undefined)window.my.namespace = {};
	 </code>

	 @function ludo.factory.createNamespace
	 @param {String} ns
	 @example
	 ludo.factory.ns('parent.child.grandchild');
	 ...
	 ...
	 parent.child.grandchild.MyClass = new Class({
	 		Extends: ludo.View,
			type : 'MyApp.MyClass'
	 	});

	 var view = new ludo.View({
	 		children:[{
	 			type : 'parent.child.grandchild.MyClass'
			}]
	 	});
	 */
	ns:function(ns){
		var parent = window;
		var tokens = ns.split(/\./g);
		for(var i=0;i<tokens.length;i++){
			var n = tokens[i];
			if(parent[n] == undefined){
				parent[n] = {};
			}
			parent = parent[n];
		}
	},
	

	getInNamespace:function(ns, config){
		if(jQuery.type(config) == "string"){
			console.trace();
		}
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