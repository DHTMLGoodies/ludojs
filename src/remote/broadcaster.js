/**
 Singleton class responsible for broadcasting messages from remote requests.
 Instance of this class is available in ludo.remoteBroadcaster
 @namespace remote
 @class Broadcasters
 @example
    ludo.remoteBroadcaster.addEvent('successMessage', function(response){
        if(response.resource === 'Person'){

        }
    });
 */
ludo.remote.Broadcaster = new Class({
    Extends:Events,

    defaultMessages:{},
    /**
     * @method broadcast
     * @param {ludo.remote.JSON} request
     * @param {String} service
     * @private
     */
    broadcast:function (request, service) {
        var code = request.getResponseCode();

        var eventName, eventNameWithService;
        switch (code) {
            case 200:
                eventName = this.getEventName('success', request.getResource());
                eventNameWithService = this.getEventName('success', request.getResource(), service);
                break;
            case 500:
                eventName = this.getEventName('failure', request.getResource());
                eventNameWithService = this.getEventName('failure', request.getResource(), service);
                break;
            default:
                eventName = this.getEventName('serverError', request.getResource());
                eventNameWithService = this.getEventName('serverError', request.getResource(), service);
        }

        var eventObj = {
            "message":request.getResponseMessage(),
            "code":request.getResponseCode(),
            "resource":request.getResource(),
            "service":service
        };
        if(!eventObj.message)eventObj.message = this.getDefaultMessage(eventNameWithService || eventName);
        this.fireEvent(eventName, eventObj);
        if(service){
            this.fireEvent(eventNameWithService, eventObj);
        }
    },

    getDefaultMessage:function(key){
        return this.defaultMessages[key] ? this.defaultMessages[key] : '';
    },

    clear:function(request, service){
        var eventObj = {
            "message":request.getResponseMessage(),
            "code":request.getResponseCode(),
            "resource":request.getResource(),
            "service":service
        };
        var eventName = this.getEventName('clear', eventObj.resource);
        var eventNameWithService = this.getEventName('clear', eventObj.resource, service);

        this.fireEvent(eventName, eventObj);
        if(service){
            this.fireEvent(eventNameWithService, eventObj);
        }
    },

    getEventName:function (eventType, resource, service) {
        resource = resource || '';
        service = service || '';
        return [resource, service, eventType.capitalize(), 'Message'].join('');
    },

    /**
     Listen to events from remote requests. EventType is either
     success, failure or serverError. resource is a name of resource
     specified in the request.
     @method addResourceEvent
     @param {String} eventType
     @param {String} resource
     @param {Function} fn
     @example
        ludo.remoteBroadcaster.addEvent('failure', 'Person', function(response){
            this.getBody().set('html', response.message');
        }.bind(this));
     The event payload is an object in this format:
     @example
        {
            "code": 200,
            "message": "A message",
            "resource": "Which resource",
            "service": "Which service"
        }
     */
    addResourceEvent:function(eventType, resource, fn){
        this.addEvent(this.getEventName(eventType, resource), fn);
    },
    /**
     Listen to remote events from a specific service only.
     @method addResourceEvent
     @param {String} eventType
     @param {String} resource
     @param {String} service
     @param {Function} fn
     @example
     ludo.remoteBroadcaster.addEvent('failure', 'Person', function(response){
            this.getBody().set('html', response.message');
        }.bind(this));
     The event payload is an object in this format:
     @example
     {
         "code": 200,
         "message": "A message",
         "resource": "Which resource",
         "service": "Which service"
     }
     */
    addServiceEvent:function(eventType,resource,service, fn){
        this.addEvent(this.getEventName(eventType, resource, service), fn);
    },

    /**
     Specify default response messages for resource service
     @method setDefaultMessage
     @param {String} message
     @param {String} eventType
     @param {String} resource
     @param {String} service
     @example
        ludo.remoteBroadcaster.setDefaultMessage('You have registered sucessfully', 'success', 'User', 'register');
     */
    setDefaultMessage:function(message, eventType, resource, service){
        this.defaultMessages[this.getEventName(eventType,resource,service)] = message;

    }
});

ludo.remoteBroadcaster = new ludo.remote.Broadcaster();
