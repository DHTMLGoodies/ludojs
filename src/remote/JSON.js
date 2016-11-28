/**
 * LudoJS class for remote JSON queries. Remote queries in ludoJS uses a REST-like API where you have
 * resources, arguments, service and data. An example of resource is Person and City. Example of
 * services are "load", "save". Arguments are arguments used when instantiating the resource on the
 * server, example: Person with id 1. The "data" property is used for data which should be sent to
 * the service on the server. Example: For Person with id equals 1, save these data.
 * @namespace ludo.remote
 * @class ludo.remote.JSON
 * @param {Object} config
 * @param {String} config.url
 */

/**
 * TODO 2016
 * Refactor data source. Create a method which has to be implemented. 
 */
ludo.remote.JSON = new Class({
    Extends:ludo.remote.Base,

    /*
     * Name of resource to request, example: "Person"
     * @config {String} resource
     */
    resource:undefined,

    url:undefined,

    initialize:function (config) {
		this.parent(config);
    },

    /**
     Send request to the server
     @function send
     @memberof ludo.remote.JSON.prototype
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
    sendToServer:function (service, resourceArguments, serviceArguments, additionalData) {

		if(resourceArguments && !ludo.util.isArray(resourceArguments))resourceArguments = [resourceArguments];
        // TODO escape slashes in resourceArguments and implement replacement in LudoDBRequestHandler
        // TODO the events here should be fired for the components sending the request.

		this.fireEvent('start', this);
        this.sendBroadCast(service);


        var payload = this.getDataForRequest(service, resourceArguments, serviceArguments, additionalData);
        if(!service && !resourceArguments){
            payload = payload.data;
        }

        $.ajax({
            url:this.getUrl(service, resourceArguments),
            method:this.method,
            cache:false,
            dataType:'json',
            data:payload,
            success:function (json) {
                this.remoteData = json;
                if ($.type(json) != "array" || json.success || json.success === undefined) {
                    this.fireEvent('success', this);
                } else {
                    this.fireEvent('failure', this);
                }
                this.sendBroadCast(service);
				this.onComplete();
            }.bind(this),
            fail:function (text, error) {
                this.remoteData = { "code": 500, "message": error };
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
     * @memberof ludo.remote.JSON.prototype
     */
    getResponseData:function () {
        if(this.remoteData && $.type(this.remoteData) == "array") return this.remoteData;
		if(!this.remoteData.response && !this.remoteData.data){
            return undefined;
        }
        return this.remoteData.data ? this.remoteData.data : this.remoteData.response.data ? this.remoteData.response.data : this.remoteData.response;
    },

    /**
     * Return entire server response of last request.
     * @function getResponse
     * @return {Object|undefined}
     * @memberof ludo.remote.JSON.prototype
     */
    getResponse:function () {
        return this.remoteData;
    },
    /**
     * Set name of resource
     * @function setResource
     * @param {String} resource
     * @memberof ludo.remote.JSON.prototype
     */
    setResource:function(resource){
        this.resource = resource;
    }
});
