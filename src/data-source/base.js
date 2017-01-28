/**
 * @namespace ludo.dataSource
 */

/**
 * Base class for data sources
 *
 * @class ludo.dataSource.Base
 * @augments ludo.Core, 'resource', 'service', 'arguments'
 * @param {String} url URL for the data source
 * @param {Object} postData Data to post with the request, example: postData: { getUsers: ' }
 * @param {Boolean} autoload Load data from server when the datasource is instantiated.
 * @param {Boolean} singleton True to make a data source singleton. This is something you do if you create
 * your own data sources and only want one instance of it. To make this work, your datasource needs to have a
 * type attribute. Example:
 * <code>
 *     myApp.dataSource.Countries = new Class({ type:'datasourceCountries'
 * </code>
 * @param {Function} dataHandler Custom function which receives data from server and returns data in appropriate format for the data source.
 * If this function returns false, it will trigger the fail event.
 *
 */
ludo.dataSource.Base = new Class({
	Extends:ludo.Core,
	singleton:false,
	url:undefined,
	postData:undefined,
	data:undefined,
	autoload:true,
	method:'post',

	inLoadMode:false,
	dataHandler:undefined,
	
	shim:undefined,
	
	__waiting:false,

	__construct:function (config) {
		this.parent(config);
		if(config.data != undefined)this.autoload = false;
		this.setConfigParams(config, ['method', 'url', 'autoload', 'shim','dataHandler']);

		
		this.on('init', this.setWaiting.bind(this));
		this.on('complete', this.setDone.bind(this));
		
		if(this.postData == undefined){
			this.postData = {};
		}
		if(config.postData != undefined){
			this.postData = Object.merge(this.postData, config.postData);
		}

		if(this.dataHandler == undefined){
			this.dataHandler = function(json){
				return jQuery.isArray(json) ? json : json.response != undefined ? json.response : json.data != undefined ? json.data : false;
			}
		}

		if(config.data != undefined){
			this.setData(config.data);
		}
		
	},
	
	setWaiting:function(){
		this.__waiting = true;
	},
	
	setDone:function(){
		this.__waiting = false;	
	},

	isWaitingData:function(){
		return this.__waiting;
	},

	setPostData:function(key, value){
		this.postData[key] = value;
	},

	ludoEvents:function () {
		if (this.autoload)this.load();
	},

	/**
	 * Send a new request
	 * @memberof ludo.dataSource.Base.prototype
	 * @function sendRequest
	 * @param {String} service
	 * @param {Array} arguments
	 * @optional
	 * @param {Object} data
	 * @optional
	 */
	sendRequest:function (data) {
		this.arguments = arguments;
		this.beforeLoad();

		this.fireEvent('init', this);


	},


	setData:function(data){

	},

	/**
	 * Has data loaded from server
	 * @function hasData
	 * @return {Boolean}
	 * @memberof ludo.dataSource.Base.prototype
	 */
	hasData:function () {
		return (this.data !== undefined);
	},
	/**
	 * Return data loaded from server
	 * @function getData
	 * @return {Object|Array}
	 * @memberof ludo.dataSource.Base.prototype
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
	 * @memberof ludo.dataSource.Base.prototype
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
	 * @memberof ludo.dataSource.Base.prototype
	 */
	loadUrl:function (url) {
		this.url = url;
		this._request = undefined;
		this.load();
	},

	parseNewData:function () {
		this.inLoadMode = false;
	},

	isLoading:function () {
		return this.inLoadMode;
	},

	getPostData:function () {
		return this.postData;
	}
});