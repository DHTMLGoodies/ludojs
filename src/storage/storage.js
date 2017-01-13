/**
 * Utility for saving data in Browsers local storage.
 * @namespace ludo.storage
 */
/**
 * Class for saving data to local storage(browser cache).
 *
 * ludo.getLocalStorage() returns a singleton for ludo.storage.LocalStorage
 * 
 * @class ludo.storage.LocalStorage
 * @type {Type}
 * @example
 * ludo.getLocalStorage().save('name', 'John');
 * ludo.getLocalStorage().save('myobject', { "a": 1, "b" : 2 ));
 * ludo.getLocalStorage().get('myobject');
 *
 */
ludo.storage.LocalStorage = new Class({
	supported:false,
	initialize:function(){
		this.supported = typeof(Storage)!=="undefined";
	},

	/**
	 * @function save
	 * @param {String} key
	 * @param {String|Number|Array|Object} value
	 * @memberof ludo.storage.LocalStorage.prototype
     */
	save:function(key,value){
		if(!this.supported)return;
		var type = 'simple';
		if(ludo.util.isObject(value) || ludo.util.isArray(value)){
			value = JSON.stringify(value);
			type = 'object';
		}
		localStorage[key] = value;
		localStorage[this.getTypeKey(key)] = type;
	},

	/**
	 * Get value from local storage
	 * @function get
	 * @param {string} key
	 * @param {mixed} defaultValue
	 * @memberof ludo.storage.LocalStorage.prototype
	 * @returns {*}
     */
	get:function(key, defaultValue){
		if(!this.supported)return defaultValue;
		var type = this.getType(key);
		if(type==='object'){
			return JSON.parse(localStorage[key]);
		}
		return localStorage[key] ? localStorage[key] : defaultValue;
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

