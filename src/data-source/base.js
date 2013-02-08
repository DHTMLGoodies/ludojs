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
    /**
     * Remote url
     * @attribute url
	 * @type String
     */
    url:undefined,
    /**
     * Remote query sent with request, example:
     * query: { getUsers: 1 }
     * @attribute object query
     */
    query:{},

    data:undefined,

    /**
     * Load data from external source on creation
     * @attribute autoload
	 * @type {Boolean}
     * @default true
     */
    autoload : true,
    /**
     * key used to identify request sent to server
     * @attribute request
	 * @type String
     * @default ''
     */
    request : '',

	inLoadMode : false,

	ludoConfig:function (config) {
        this.parent(config);
        if (config.url !== undefined)this.url = config.url;
        if (config.query !== undefined)this.query = config.query;
        if (config.autoload !== undefined)this.autoload = config.autoload;
        if (config.request !== undefined)this.request = config.request;

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

    setQueryParam:function (param, value) {
        this.query[param] = value;
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