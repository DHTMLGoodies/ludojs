/**
 * LudoJS class for remote JSON queries. Remote queries in ludoJS uses a REST-like API where you have
 * resources, arguments, service and data. An example of resource is Person and City. Example of
 * services are "load", "save". Arguments are arguments used when instantiating the resource on the
 * server, example: Person with id 1. The "data" property is used for data which should be sent to
 * the service on the server. Example: For Person with id equals 1, save these data.
 * @namespace remote
 * @class JSON
 * @extends Events
 */
ludo.remote.JSON = new Class({
    Extends:Events,
    method:'post',
    JSON:undefined,

    /**
     * Name of resource to request, example: "Person"
     * @config {String} resource
     */
    resource:undefined,
    /**
     * Optional url to use for the query instead of global set url.
     * @config {String} url
     * optional
     */
    url:undefined,
    /**
     * @constructor
     * @param {Object} config
     */
    initialize:function (config) {
		config = config || {};
        if (config.listeners !== undefined) {
            this.addEvents(config.listeners);
        }
        this.method = config.method || this.method;
        if (config.resource !== undefined) this.resource = config.resource;
        if (config.url !== undefined) this.url = config.url;
    },

    /**
     Send request to the server
     @method send
     @param {String} service
     @param {Array} resourceArguments
     @optional
     @param {Object} serviceArguments
     @optional
     @example
        ludo.config.setUrl('/controller.php');
        var req = new ludo.remote.JSON({
            resource : 'Person'
        });
        req.send('load', 1);

     Will trigger the following data to be sent to controller.php:

     @example
     {
         request:"Person/1/load"
     }
     If you have the mod_rewrite module enabled and activated on your web server, you may use code like this:
     @example
	 	ludo.config.enableModRewriteUrls();
        ludo.config.setDocumentRoot('/');
        var req = new ludo.remote.JSON({
            resource : 'Person'
        });
        req.send('load', 1);

     which will send a request to the following url:
     @example:
        http://<your web server url>/Person/1/load
     The query will not contain any POST data.

     Here's another example for saving data(mod rewrite deactivated)
     @example
	     ludo.config.setUrl('/controller.php');
         var req = new ludo.remote.JSON({
            resource : 'Person'
        });
         req.send('save', 1, {
            "firstname": "John",
            "lastname": "Johnson"
         });

     which will send the following POST data to "controller.php":

     @example
        {
            "request": "Person/1/save",
            "data": {
                "firstname": "John",
                "lastname": McCarthy"
            }
        }
     When mod_rewrite is enabled, the request will be sent to the url /Person/1/save and POST data will contain

        {
            "data": {
                "firstname": "John",
                "lastname": "McCarthy"
            }
        }
     i.e. without any "request" data in the post variable since it's already defined in the url.
     @param {Object} additionalData
     @optional
     */
    send:function (service, resourceArguments, serviceArguments, additionalData) {
        if (resourceArguments && !ludo.util.isArray(resourceArguments))resourceArguments = [resourceArguments];

        ludo.remoteBroadcaster.clear(this, service);
        // TODO escape slashes in resourceArguments and implement replacement in LudoDBRequestHandler
        // TODO the events here should be fired for the components sending the request.
        var req = new Request.JSON({
            url:this.getUrl(service, resourceArguments),
            method:this.method,
            data:this.getDataForRequest(service, resourceArguments, serviceArguments, additionalData),
            onSuccess:function (json) {
                this.JSON = json;
                if (json.success || json.success === undefined) {
                    this.fireEvent('success', this);
                } else {
                    this.fireEvent('failure', this);
                }
                this.sendBroadCast(service);
            }.bind(this),
            onError:function (text, error) {
                this.JSON = { "code": 500, "message": error };
                this.fireEvent('servererror', this);
                this.sendBroadCast(service);
            }.bind(this)
        });
        req.send();
    },

    sendBroadCast:function(service){
        ludo.remoteBroadcaster.broadcast(this, service);
    },
    /**
     * Return url for the request
     * @method getUrl
     * @param {String} service
     * @param {Array} arguments
     * @return {String}
     * @private
     */
    getUrl:function (service, arguments) {
        var ret = this.url !== undefined ? this.url : ludo.config.getUrl();
        if (ludo.config.hasModRewriteUrls()) {
            ret = ludo.config.getDocumentRoot() + this.getServicePath(service, arguments);
        }else{
            ret = this.url !== undefined ? this.url : ludo.config.getUrl();
        }
        return ret;
    },
    /**
     * @method getServicePath
     * @param {String} service
     * @param {Array} arguments
     * @return {String}
     * @private
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
     * @private
     */
    getDataForRequest:function (service, arguments, data, additionalData) {
        var ret = {
            data:data
        };
        if(additionalData){
            if(ludo.util.isObject(additionalData)){
                ret = Object.merge(additionalData, ret);
            }
        }
        if (!ludo.config.hasModRewriteUrls() && this.resource) {
            ret.request = this.getServicePath(service, arguments);
        }
        return ret;
    },
    /**
     * Return JSON response data from last request.
     * @method getResponseData
     * @return {Object|undefined}
     */
    getResponseData:function () {
        return this.JSON.response ? this.JSON.response.data ? this.JSON.response.data : this.JSON.response : this.JSON.data;
    },
    /**
     * Return entire server response of last request.
     * @method getResponse
     * @return {Object|undefined}
     */
    getResponse:function () {
        return this.JSON;
    },
    /**
     * Return "code" property of last received server response.
     * @method getResponseCode
     * @return {String|undefined}
     */
    getResponseCode:function () {
        return this.JSON && this.JSON.code ? this.JSON.code : undefined;
    },
    /**
     * Return response message
     * @method getResponseMessage
     * @return {String|undefined}
     */
    getResponseMessage:function () {
        return this.JSON && this.JSON.message ? this.JSON.message : undefined;
    },

    getResource:function(){
        return this.resource;
    },

    setResource:function(resource){
        this.resource = resource;
    }
});
