/**
 * Class for remote data source.
 * @namespace dataSource
 * @class HTML
 * @augments dataSource.Base
 */
ludo.dataSource.HTML = new Class({
	Extends:ludo.dataSource.Base,
	type:'dataSource.HTML',

	getSourceType:function () {
		return 'HTML';
	},

	/**
	 * Reload data from server
	 * Components using this data-source will be automatically updated
	 * @function load
	 * @return void
	 */
	load:function () {
		this.parent();
		this.sendRequest(this.service, this.arguments, this.getPostData());

	},

	loadComplete:function (html) {
		this.parent();
		this.data = html;
		this.fireEvent('load', this.data);
	},

	_request:undefined,
	requestHandler:function () {
		if (this._request === undefined) {
			this._request = new ludo.remote.HTML({
				shim:this.shim,
				url:this.url,
				resource:this.resource,
				listeners:{
					"beforeload":function (request) {
						this.fireEvent("beforeload", request);
					},
					"success":function (request) {
						this.loadComplete(request.getResponseData(), request.getResponse());
					}.bind(this),
					"error":function (request) {
						/**
						 * Server error event. Fired when the server didn't handle the request
						 * @event servererror
						 * @param {String} error text
						 * @param {String} error message
						 */
						this.fireEvent('servererror', [request.getResponseMessage(), request.getResponseCode()]);
					}.bind(this)
				}
			});

		}
		return this._request;
	}
});