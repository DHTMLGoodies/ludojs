/**
 * Class for JSON request proxy. When using a proxy for an URL, Ajax requests to this
 * URL will be queued for some time before sending them all in one go.
 *
 * Instead of having one post "request" array, you will now have a post "requests"(plural)
 * array sent to the server where each item in the array is a "request" object.
 *
 * @namespace remote
 * @class Proxy
 * @deprecated
 *
 */

ludo.remote.proxies = {};

ludo.remote.Proxy = new Class({
	Extends:Events,
	type:'remote.Proxy',
	/**
	 * How long to wait(in seconds) before sending queue of requests to the server.
	 * @attribute delay
	 * @type {Number}
	 * @default .2
	 *
	 */
	delay:.2,
	requests:[],
	onSuccessFns:{},
	url:undefined,

	initialize:function (config) {
		ludo.remote.proxies[config.url] = this;
		this.url = config.url;
		if (config.delay !== undefined)this.delay = config.delay;
	},

	addRequest:function (requestId, config) {
		if (this.hasRequest(requestId)) {
			this.send();
		}
		this.requests.push({
			id:requestId,
			data:config.data
		});
		this.onSuccessFns[requestId] = config.onSuccess;
		if (this.requests.length === 1) {
			this.send.delay(this.delay * 1000, this);
		}
	},

	hasRequest:function (requestId) {
		for (var i = 0; i < this.requests.length; i++) {
			if (this.requests[i].id == requestId)return true;
		}
		return false;
	},

	send:function () {
		/**
		 * Event fired when progress bar is finished
		 * @event send
		 * @param {Array} requests
		 */
		this.fireEvent('send', this.requests);

		var req = new Request.JSON(this.getRequestConfig());
		req.send();
		this.requests = [];
	},

	getRequestConfig:function () {
		return {
			url:this.url,
			method:'post',
			noCache:true,
			data:{
				requests:this.requests
			},
			onSuccess:this.receiveResponse.bind(this)
		};
	},

	receiveResponse:function (json) {
		json = json.response || json;
		for (var i = 0; i < json.data.length; i++) {
			var r = json.data[i];
			if (r.id && this.onSuccessFns[r.id] !== undefined) {
				this.onSuccessFns[r.id].call(undefined, r);
			}
		}
	}
});


ludo.remote.getProxy = function (url) {
	return ludo.remote.proxies[url];
};

ludo.remote.deleteProxy = function (url) {
	ludo.remote.proxies[url] = undefined;
};

ludo.remote.deleteProxies = function () {
	ludo.remote.proxies = {};
};
/**
 Create a new proxy for an url
 @method ludo.remote.createProxy
 @param {String} url
 @param {Object} config
 @example
 	new ludo.remote.createProxy('controller.php',{delay : .3 });
 This creates a ludo.remote.Proxy object for the "controller.php" url.
 */
ludo.remote.createProxy = function (url, config) {
	if (!ludo.remote.getProxy(url)) {
		config = config || {};
		if (config.type === undefined)config.type = 'remote.Proxy';
		config.url = url;
		return ludo._new(config);
	} else {
		return ludo.remote.getProxy(url);
	}
};