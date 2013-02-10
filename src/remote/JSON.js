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
    errorText:undefined,
    errorCode:undefined,
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
     @param {Array} arguments
     @optional
     @param {Object} data
     @optional
     @example
        ludo.remote.setGlobalUrl('/controller.php');
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
        ludo.remote.modRewrite(true);
        ludo.remote.setGlobalUrl('/');
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
         ludo.remote.setGlobalUrl('/controller.php');
         var req = new ludo.remote.JSON({
                resource : 'Person'
            });
         req.send('save', 1, {
            "firstname": "John",
            "lastname": "McCarthy"
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
     */
    send:function (service, arguments, data) {
        if (!ludo.util.isArray(arguments))arguments = [arguments];
        var req = new Request.JSON({
            url:this.getUrl(service, arguments),
            method:this.method,
            data:this.getDataForRequest(service, arguments, data),
            onSuccess:function (json) {
                this.JSON = json;
                if (json.success || json.success === undefined) {
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

    getUrl:function (service, arguments) {
        var ret = this.url !== undefined ? this.url : ludo.remote.globalUrl;
        if (ludo.remote.modRewriteEnabled) {
            ret += this.getServicePath(service, arguments);
        }
        return ret;
    },

    getServicePath:function (service, arguments) {
        var parts = [this.resource];
        if (arguments)parts.push(arguments.join('/'));
        if (service)parts.push(service);

        return parts.join('/');
    },

    getDataForRequest:function (service, arguments, data) {
        var ret = {
            data:data
        };
        if (!ludo.remote.modRewriteEnabled) {
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
        return this.JSON.data;
    },
    /**
     * Return entire server response of last request.
     * @method getResponse
     * @return {Object|undefined}
     */
    getResponse:function () {
        return this.JSON;
    },

    getErrorText:function () {
        return this.errorText;
    },
    getErrorCode:function () {
        return this.errorCode;
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
    }
});
ludo.remote.modRewriteEnabled = false;
ludo.remote.globalUrl = undefined;
ludo.remote.modRewrite = function (enabled) {
    ludo.remote.modRewriteEnabled = enabled ? true : false;
};

ludo.remote.setGlobalUrl = function (url) {
    ludo.remote.globalUrl = url;
};