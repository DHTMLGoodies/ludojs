/**
 * Class for remote data source.
 * @namespace dataSource
 * @class JSON
 * @extends dataSource.Base
 */
ludo.dataSource.JSON = new Class({
    Extends:ludo.dataSource.Base,
    type:'dataSource.JSON',

    /**
     * Reload data from server
     * Components using this data-source will be automatically updated
     * @method load
     * @return void
     */
    load:function () {
        this.parent();

		new ludo.remote.JSON({
			url:this.getUrl(),
			data:{
				"request":this.request,
				"data":this.getQuery()
			},
			listeners:{
				"success":function (request) {
					this.loadComplete(request.getResponseData(), request.getResponse());
				}.bind(this),
				"failure":function (request) {
					/**
					 * Event fired when success parameter in response from server is false
					 * @event failure
					 * @param {Object} JSON response from server. Error message should be in the "message" property
					 * @param {Object} ludo.model.Model
					 *
					 */
					this.fireEvent('failure', [request.getResponse(), this]);
				}.bind(this),
				"error":function (request) {
					/**
					 * Server error event. Fired when the server didn't handle the request
					 * @event servererror
					 * @param {String} error text
					 * @param {String} error message
					 */
					this.fireEvent('servererror', [request.getErrorText(), request.getErrorCode()]);
				}.bind(this)
			}
		});
    },

    loadComplete:function (data,json) {
		this.parent();
        this.data = data;
        this.fireEvent('parsedata');
        this.fireEvent('load', json);
    },

    getQuery:function(){
        return this.query;
    }
});

ludo.factory.registerClass('dataSource.JSON', ludo.dataSource.JSON);