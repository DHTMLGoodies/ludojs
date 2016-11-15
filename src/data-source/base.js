/**
 * Base class for data sources
 * @namespace dataSource
 * @class ludo.dataSource.Base
 * @augments ludo.Core
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
	 * @type {String}
	 * @optional
	 */
	url:undefined,
	/**
	 * Remote postData sent with request, example:
	 * postData: { getUsers: 1 }
	 * @attribute postData
	 * @type {Object}
	 */
	postData:{},

	data:undefined,

	/**
	 * Load data from external source on creation
	 * @attribute autoload
	 * @type {Boolean}
	 * @default true
	 */
	autoload:true,
	/**
	 * Name of resource to request on the server
	 * @config resource
	 * @type String
	 * @default ''
	 */
	resource:'',
	/**
	 * Name of service to request on the server
	 * @config service
	 * @type String
	 * @default ''
	 */
	service:'',
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
	arguments:undefined,

	inLoadMode:false,

	/**
	 Config of shim to show when content is being loaded form server. This config
	 object supports two properties, "renderTo" and "txt". renderTo is optional
	 and specifies where to render the shim. Default is inside body of parent
	 view.
	 "txt" specifies which text to display inside the shim. "txt" can be
	 either a string or a function returning a string.
	 @config {Object} shim
	 @example
	 	shim:{
			renderTo:ludo.get('myView').getBody(),
			txt : 'Loading content. Please wait'
	 	}
	 renderTo is optional. Example where "txt" is defined as function:
	 @example
	 	shim:{
	 		"txt": function(){
	 			var val = ludo.get('searchField).getValue();
	 			return val.length ? 'Searching for ' + val : 'Searching';
	 		}
	 	}
	 */
	shim:undefined,

	__construct:function (config) {
		this.parent(config);
		this.setConfigParams(config, ['url', 'postData', 'autoload', 'resource', 'service', 'arguments', 'data', 'shim']);

		if (this.arguments && !ludo.util.isArray(this.arguments)) {
			this.arguments = [this.arguments];
		}

	},

	ludoEvents:function () {
		if (this.autoload)this.load();
	},

	/**
	 * Send a new request
	 * @function sendRequest
	 * @param {String} service
	 * @param {Array} arguments
	 * @optional
	 * @param {Object} data
	 * @optional
	 */
	sendRequest:function (service, arguments, data) {
		this.arguments = arguments;
		this.beforeLoad();
		this.requestHandler().send(service, arguments, data);
	},
	/**
	 * Has data loaded from server
	 * @function hasData
	 * @return {Boolean}
	 */
	hasData:function () {
		return (this.data !== undefined);
	},
	/**
	 * Return data loaded from server
	 * @function getData
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
	 * @function getSourceType
	 * @return string source type
	 */
	getSourceType:function () {
		return 'JSON';
	},

	beforeLoad:function () {
		this.inLoadMode = true;
		this.fireEvent('beforeload');
	},

	load:function () {

	},

	/**
	 * Load content from a specific url
	 * @function loadUrl
	 * @param url
	 */
	loadUrl:function (url) {
		this.url = url;
		this._request = undefined;
		this.load();
	},

	loadComplete:function () {
		this.inLoadMode = false;
	},

	isLoading:function () {
		return this.inLoadMode;
	},

	getPostData:function () {
		return this.postData;
	}
});