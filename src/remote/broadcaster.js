/**
 Singleton class responsible for broadcasting messages from remote requests.
 Instance of this class is available in ludo.remoteBroadcaster.

 The broadcaster can fire four events:
 start, success, failure and serverError. The example below show you how
 to add listeners to these events.
 @namespace remote
 @class Broadcaster
 @example
    ludo.remoteBroadcaster.withResource('Person').withService('read').on('success', function(){
		// Do something
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

		var type, eventNameWithService;
        switch (code) {
			case 0:
				type = 'start';
				break;
            case 200:
				type = 'success';
                break;
            default:
				type = 'failure';
                break;
        }

		var eventName = this.getEventName(type, request.getResource());

		if(eventName){
			eventNameWithService = this.getEventName(type, request.getResource(), service);
		}else{
            eventName = this.getEventName('serverError', request.getResource());
            eventNameWithService = this.getEventName('serverError', request.getResource(), service);
        }

        var eventObj = {
            "message":request.getResponseMessage(),
            "code":request.getResponseCode(),
            "resource":request.getResource(),
            "service":service
        };
        if (!eventObj.message)eventObj.message = this.getDefaultMessage(eventNameWithService || eventName);
        this.fireEvent(eventName, eventObj);
        if (service) {
            this.fireEvent(eventNameWithService, eventObj);
        }
    },

    getDefaultMessage:function (key) {
        return this.defaultMessages[key] ? this.defaultMessages[key] : '';
    },

    clear:function (request, service) {
        var eventObj = {
            "message":request.getResponseMessage(),
            "code":request.getResponseCode(),
            "resource":request.getResource(),
            "service":service
        };
        var eventName = this.getEventName('clear', eventObj.resource);
        var eventNameWithService = this.getEventName('clear', eventObj.resource, service);

        this.fireEvent(eventName, eventObj);
        if (service) {
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
    addResourceEvent:function (eventType, resource, fn) {
        this.addEvent(this.getEventName(eventType, resource), fn);
    },
    /**
     Listen to remote events from a specific service only.
     @method addResourceEvent
     @param {String} eventType
     @param {String} resource
     @param {Array} services
     @param {Function} fn
     @example
        ludo.remoteBroadcaster.addEvent('failure', 'Person', ['save'], function(response){
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
    addServiceEvent:function (eventType, resource, services, fn) {
        if (!services.length) {
            this.addEvent(this.getEventName(eventType, resource, undefined), fn);
        } else {
            for (var i = 0; i < services.length; i++) {
                this.addEvent(this.getEventName(eventType, resource, services[i]), fn);
            }
        }
    },

    /**
     Specify default response messages for resource service
     @method setDefaultMessage
     @param {String} message
     @param {String} eventType
     @param {String} resource
     @param {String} service
     @example
        ludo.remoteBroadcaster.setDefaultMessage('You have registered successfully', 'success', 'User', 'register');
     */
    setDefaultMessage:function (message, eventType, resource, service) {
        this.defaultMessages[this.getEventName(eventType, resource, service)] = message;
    },

	eventObjToBuild :{},
    /**
     Chained method for adding broadcaster events.
     @method withResourceService
     @param {String} resourceAndService
     @return {remote.Broadcaster}
     @example
     ludo.remoteBroadcaster.withResourceService('Person/save').on('success', function(){
	 		alert('Save success');
	 	});
     */
    withResourceService:function(resourceAndService){
        var tokens = resourceAndService.split(/\//g);
        this.withResource(tokens[0]);
        if(tokens.length == 2)this.withService(tokens[1]);
        return this;
    },

	/**
	 Chained method for adding broadcaster events.
	 @method withResource
	 @param {String} resource
	 @return {remote.Broadcaster}
	 @example
	 	ludo.remoteBroadcaster.withResource('Person').withService('save').on('success', function(){
	 		alert('Save success');
	 	});
	 */
	withResource:function(resource){
		this.eventObjToBuild = {
			resource : resource
		};
		return this;
	},
	/**
	 Chained method for adding broadcaster events.
	 @method withService
	 @param {String} service
	 @return {remote.Broadcaster}
	 @example
	 	ludo.remoteBroadcaster.withResource('Person').withService('read').
            withService('save').on('success', function(){
	 		alert('Save success');
	 	});
	 */
	withService:function(service){
		if(this.eventObjToBuild.service === undefined){
			this.eventObjToBuild.service = [];
		}
		this.eventObjToBuild.service.push(service);
		return this;
	},
	/**
	 Chained method for adding broadcaster events.
	 @method on
	 @param {String} eventName
	 @param {Function} fn
	 @return {remote.Broadcaster}
	 @example
	 	ludo.remoteBroadcaster.withResource('Person').withService('read').on('success', function(){
	 		alert('Save success');
	 	}).on('start', function(){ alert('About to save') });
	 */
	on:function(eventName, fn){
		this.addServiceEvent(eventName, this.eventObjToBuild.resource, this.eventObjToBuild.service, fn);
		return this;
	}
});

ludo.remoteBroadcaster = new ludo.remote.Broadcaster();
