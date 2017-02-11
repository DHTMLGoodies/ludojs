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
    supported: false,
    initialize: function () {
        this.supported = typeof(Storage) !== "undefined";
    },

    /**
     * @function save
     * @param {String} key
     * @param {String|Number|Array|Object} value
     * @memberof ludo.storage.LocalStorage.prototype
     */
    save: function (key, value) {
        if (!this.supported)return;
        var type = 'simple';
        if (jQuery.isPlainObject(value) || jQuery.isArray(value)) {
            value = JSON.stringify(value);
            type = 'object';
        }
        localStorage[key] = value;
        localStorage[this.getTypeKey(key)] = type;
    },

    getNumeric:function(key, defaultValue){
        return this.get(key, defaultValue) / 1;
    },

    /**
     * Get value from local storage
     * @function get
     * @param {string} key
     * @param {string|object|array} defaultValue
     * @memberof ludo.storage.LocalStorage.prototype
     * @returns {*}
     */
    get: function (key, defaultValue) {
        if (!this.supported)return defaultValue;
        var type = this.getType(key);
        if (type === 'object') {
            var ret = JSON.parse(localStorage[key]);
            return ret ? ret : defaultValue;
        }

        var val = localStorage.getItem(key);
        return  val ? val : defaultValue;
    },

    getTypeKey: function (key) {
        return key + '___type';
    },

    getType: function (key) {
        key = this.getTypeKey(key);
        if (localStorage[key] !== undefined) {
            return localStorage[key];
        }
        return 'simple';
    },

    empty: function () {
        localStorage.clear();
    }
});

ludo.localStorage = undefined;
ludo.getLocalStorage = function () {
    if (!ludo.localStorage)ludo.localStorage = new ludo.storage.LocalStorage();
    return ludo.localStorage;
};

