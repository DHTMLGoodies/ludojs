/**
 * Base class for ludo.remote.HTML and ludo.remote.JSON
 * @namespace remote
 * @class Base
 */
ludo.remote.Base = new Class({
	Extends:Events,
	remoteData:undefined,
	method:'post',
	
	initialize:function (config) {
		config = config || {};
		if (config.listeners !== undefined) {
			this.addEvents(config.listeners);
		}
		this.method = config.method || this.method;
		if (config.resource !== undefined) this.resource = config.resource;
		if (config.url !== undefined) this.url = config.url;

		if (config.shim) {
			new ludo.remote.Shim({
				renderTo:config.shim.renderTo,
				remoteObj:this,
				txt:config.shim.txt
			});
		}
	},

	send:function (service, resourceArguments, serviceArguments, additionalData) {
		if (resourceArguments && !ludo.util.isArray(resourceArguments))resourceArguments = [resourceArguments];
		ludo.remoteBroadcaster.clear(this, service);

		this.fireEvent('start');

		this.sendToServer(service, resourceArguments, serviceArguments, additionalData);
	},

	onComplete:function () {
		this.fireEvent('complete', this);
	},
	/**
	 * Return url for the request
	 * @method getUrl
	 * @param {String} service
	 * @param {Array} arguments
	 * @return {String}
	 * @protected
	 */
	getUrl:function (service, arguments) {
		var ret = this.url !== undefined ? this.url : ludo.config.getUrl();
		if (ludo.config.hasModRewriteUrls()) {
			ret = ludo.config.getDocumentRoot() + this.getServicePath(service, arguments);
		} else {
			ret = this.url !== undefined ? ludo.util.isFunction(this.url) ? this.url.call() : this.url : ludo.config.getUrl();
		}
		return ret;
	},
	/**
	 * @method getServicePath
	 * @param {String} service
	 * @param {Array} arguments
	 * @return {String}
	 * @protected
	 */
	getServicePath:function (service, arguments) {
		var parts = [this.resource];
		if (arguments && arguments.length)parts.push(arguments.join('/'));
		if (service)parts.push(service);
		return parts.join('/');
	},
	/**
	 * @method getDataForRequest
	 * @param {String} service
	 * @param {Array} arguments
	 * @param {Object} data
	 * @optional
	 * @param {Object} additionalData
	 * @optional
	 * @return {Object}
	 * @protected
	 */
	getDataForRequest:function (service, arguments, data, additionalData) {
		var ret = {
			data:data
		};
		if (additionalData) {
			if (ludo.util.isObject(additionalData)) {
				ret = Object.merge(additionalData, ret);
			}
		}
		if (!ludo.config.hasModRewriteUrls() && this.resource) {
			ret.request = this.getServicePath(service, arguments);
		}
		return ret;
	},
	/**
	 * Return "code" property of last received server response.
	 * @method getResponseCode
	 * @return {String|undefined}
	 */
	getResponseCode:function () {
		return this.remoteData && this.remoteData.code ? this.remoteData.code : 0;
	},
	/**
	 * Return response message
	 * @method getResponseMessage
	 * @return {String|undefined}
	 */
	getResponseMessage:function () {
		return this.remoteData && this.remoteData.message ? this.remoteData.message : undefined;
	},

	/**
	 * Return name of resource
	 * @method getResource
	 * @return {String}
	 */
	getResource:function(){
		return this.resource;
	},

	sendBroadCast:function(service){
		ludo.remoteBroadcaster.broadcast(this, service);
	}
});