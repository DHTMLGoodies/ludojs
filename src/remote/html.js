/**
 Class for remote HTML requests.
 @namespace remote
 @class HTML
 */
ludo.remote.HTML = new Class({
	Extends:ludo.remote.Base,
	HTML:undefined,

	sendToServer:function (service, resourceArguments, serviceArguments, additionalData) {
		var req = new Request({
			url:this.getUrl(service, resourceArguments),
			method:this.method,
			noCache:true,
			evalScripts:true,
			data:this.getDataForRequest(service, resourceArguments, serviceArguments, additionalData),
			onSuccess:function (html) {
				this.remoteData = html;
				this.fireEvent('success', this);
				this.sendBroadCast(service);
				this.onComplete();
			}.bind(this),
			onError:function (text, error) {
				this.remoteData = { "code":500, "message":error };
				this.fireEvent('servererror', this);
				this.sendBroadCast(service);
				this.onComplete();
			}.bind(this)
		});
		req.send();
	},
	/**
	 * Return JSON response data from last request.
	 * @method getResponseData
	 * @return {Object|undefined}
	 */
	getResponseData:function () {
		return this.remoteData;
	},

	/**
	 * Return entire server response of last request.
	 * @method getResponse
	 * @return {Object|undefined}
	 */
	getResponse:function () {
		return this.remoteData;
	}
});