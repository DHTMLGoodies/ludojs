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
        this.sendRequest(this.service, this.arguments, this.getPostData())
    },

    /**
     * Send a new request
     * @method sendRequest
     * @param {String} service
     * @param {Array} arguments
     * @optional
     * @param {Object} data
     * @optional
     */
    sendRequest:function(service, arguments, data){
        this.arguments = arguments;
        this.beforeLoad();
        this.requestHandler().send(service, arguments, data);
    },

    _request:undefined,
	requestHandler:function(){
        if(this._request === undefined){
            this._request = new ludo.remote.JSON({
                url:this.url,
                resource: this.resource,
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

    loadComplete:function (data) {
		this.parent();
        this.data = data;
        this.fireEvent('parsedata');
        this.fireEvent('load', [this.data]);
    },

    getPostData:function(){
        return this.postData;
    }
});

ludo.factory.registerClass('dataSource.JSON', ludo.dataSource.JSON);