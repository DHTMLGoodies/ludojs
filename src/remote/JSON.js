ludo.remote.JSON = new Class({
	Extends:Events,
	method:'post',
	JSON : undefined,
	errorText : undefined,
	errorCode : undefined,

	initialize:function (config) {
		if (config.listeners !== undefined) {
			this.addEvents(config.listeners);
		}
		this.method = config.method || this.method;
		this.send(config.url, config.data);
	},

	send:function (url, data) {
		var req = new Request.JSON({
			url:url,
			method:this.method,
			data:data,
			onSuccess:function (json) {
				this.JSON = json;
				if (json.success) {
					this.fireEvent('success', this);
				} else {
					this.fireEvent('failure', this);
				}
			}.bind(this),
			onError:function (text, error) {
				this.errorText = text;
				this.errorCode = error;
				this.fireEvent('servererror', this);
			}.bind(this)
		});
		req.send();
	},
	/**
	 * Return JSON response data from last request.
	 * @method getResponseData
	 * @return {Object|undefined}
	 */
	getResponseData: function(){
		return this.JSON.data;
	},
	/**
	 * Return entire server response of last request.
	 * @method getResponse
	 * @return {Object|undefined}
	 */
	getResponse:function(){
		return this.JSON;
	},

	getErrorText:function(){
		return this.errorText;
	},
	getErrorCode:function(){
		return this.errorCode;
	},
	/**
	 * Return "code" property of last received server response.
	 * @method getResponseCode
	 * @return {String|undefined}
	 */
	getResponseCode:function(){
		return this.JSON && this.JSON.code ? this.JSON.code : undefined;
	},
	/**
	 * Return response message
	 * @method getResponseMessage
	 * @return {String|undefined}
	 */
	getResponseMessage:function(){
		return this.JSON && this.JSON.message ? this.JSON.message : undefined;
	}
});