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

    setQueryParam:function (param, value) {
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