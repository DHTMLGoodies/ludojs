/**
 * Base class for ludo.remote.HTML and ludo.remote.JSON
 * @namespace ludo.remote
 * @class ludo.remote.Base
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

		this.remoteData = undefined;

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
	 * @function getUrl
	 * @param {String} service
	 * @param {Array} args
	 * @return {String}
	 * @protected
	 */
	getUrl:function (service, args) {
		var ret = this.url !== undefined ? this.url : ludo.config.getUrl();
		if (ludo.config.hasModRewriteUrls()) {
			ret = ludo.config.getDocumentRoot() + this.getServicePath(service, args);
		} else {
			ret = this.url !== undefined ? ludo.util.isFunction(this.url) ? this.url.call() : this.url : ludo.config.getUrl();
		}
		return ret;
	},
	/**
	 * @function getServicePath
	 * @param {String} service
	 * @param {Array} args
	 * @return {String}
	 * @protected
	 */
	getServicePath:function (service, args) {
		var parts = [this.resource];
		if (args && args.length)parts.push(args.join('/'));
		if (service)parts.push(service);
		return parts.join('/');
	},
	/**
	 * @function getDataForRequest
	 * @param {String} service
	 * @param {Array} args
	 * @param {Object} data
	 * @optional
	 * @param {Object} additionalData
	 * @optional
	 * @return {Object}
	 * @protected
	 */
	getDataForRequest:function (service, args, data, additionalData) {
		var ret = {
			data:data
		};
		if (additionalData) {
			if (ludo.util.isObject(additionalData)) {
				ret = Object.merge(additionalData, ret);
			}
		}
		if (!ludo.config.hasModRewriteUrls() && this.resource) {
			ret.request = this.getServicePath(service, args);
		}

		var injected = ludo.remoteInject.get(this.resource, service);
		if(injected){
			ret.data = ret.data ? Object.merge(ret.data, injected) : injected;
		}

		return ret;
	},
	/**
	 * Return "code" property of last received server response.
	 * @function getResponseCode
	 * @return {String|undefined}
	 */
	getResponseCode:function () {
		return this.remoteData && this.remoteData.code ? this.remoteData.code : 0;
	},
	/**
	 * Return response message
	 * @function getResponseMessage
	 * @return {String|undefined}
	 */
	getResponseMessage:function () {
		return this.remoteData && this.remoteData.message ? this.remoteData.message : undefined;
	},

	/**
	 * Return name of resource
	 * @function getResource
	 * @return {String}
	 */
	getResource:function(){
		return this.resource;
	},

	sendBroadCast:function(service){
		ludo.remoteBroadcaster.broadcast(this, service);
	}
});