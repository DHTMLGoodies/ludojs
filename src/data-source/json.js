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
        if(!this.url && !this.resource)return;
        this.parent();
        this.sendRequest(this.service, this.arguments, this.getPostData());
    },

    _request:undefined,
	requestHandler:function(){
        if(this._request === undefined){
            this._request = new ludo.remote.JSON({
                url:this.url,
                resource: this.resource,
				shim:this.shim,
                listeners:{
                    "beforeload": function(request){
                        this.fireEvent("beforeload", request);
                    },
                    "success":function (request) {
                        this.loadComplete(request.getResponseData(), request.getResponse());
                    }.bind(this),
                    "failure":function (request) {
                        /**
                         * Event fired when success parameter in response from server is false
                         * @event failure
                         * @param {Object} JSON response from server. Error message should be in the "message" property
                         * @param {ludo.dataSource.JSON} this
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
                        this.fireEvent('servererror', [request.getResponseMessage(), request.getResponseCode()]);
                    }.bind(this)
                }
            });

        }
        return this._request;
    },

    /**
     * Update data source with new date and trigger events "parseData",
     * @param {Array} data
     */
    setData:function(data){
        this.loadComplete(data);
    },


    loadComplete:function (data) {
		this.parent();
		var firstLoad = !this.data;
		this.data = data;
        this.fireEvent('parsedata');
        this.fireEvent('load', [this.data, this]);

		if(firstLoad){
			this.fireEvent('firstLoad', [this.data, this]);
		}
    }
});

ludo.factory.registerClass('dataSource.JSON', ludo.dataSource.JSON);