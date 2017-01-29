/**
 Class for remote HTML requests.
 @namespace remote
 @class ludo.remote.HTML

 */
ludo.remote.HTML = new Class({
	Extends:ludo.remote.Base,
	HTML:undefined,

	sendToServer:function (service, resourceArguments, serviceArguments, additionalData) {
		jQuery.ajax({
			dataType: "html",
			method: this.method,
			url:this.getUrl(service, resourceArguments),
			async:true,
			cache:false,
			data:this.getDataForRequest(service, resourceArguments, serviceArguments, additionalData),
			success:function(html){
				this.remoteData = html;
				this.fireEvent('success', this);
				this.sendBroadCast(service);
				this.onComplete();
			}.bind(this),

			error:function(xhr, text, error){
				this.remoteData = { "code":500, "message":error };
				this.fireEvent('servererror', this);
				this.sendBroadCast(service);
				this.onComplete();
			}.bind(this)

		});
	},
	/**
	 * Return JSON response data from last request.
	 * @function getResponseData
	 * @return {Object|undefined}
	 * @memberof ludo.remote.HTML.prototype
	 */
	getResponseData:function () {
		return this.remoteData;
	},

	/**
	 * Return entire server response of last request.
	 * @function getResponse
	 * @return {Object|undefined}
	 * @memberof ludo.remote.HTML.prototype
	 */
	getResponse:function () {
		return this.remoteData;
	}
});