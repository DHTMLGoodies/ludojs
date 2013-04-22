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
        this.setConfigParams(config,['url','postData','autoload','resource','service','arguments','data','shim']);
		if(this.arguments && !ludo.util.isArray(this.arguments)){
			this.arguments = [this.arguments];
		}
        if(this.shim){
            new ludo.dataSource.Shim({
                renderTo: this.shim.renderTo,
                dataSource: this,
                txt : this.shim.txt
            });
        }
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

    beforeLoad:function(){
        this.inLoadMode = true;
        this.fireEvent('beforeload');
    },

    load:function(){

    },

    /**
     * Load content from a specific url
     * @method loadUrl
     * @param url
     */
    loadUrl:function(url){
        this.url = url;
        this.load();
    },

	loadComplete:function(){
		this.inLoadMode = false;
	},

	isLoading:function(){
		return this.inLoadMode;
	}
});