/**
 Class displaying all messages from remote requests
 @namespace remote
 @class Message
 @extends ludo.View
 @constructor
 @param {Object} config
 @example
 	children:[{
        type:'remote.Message',
        listenTo:["Person", "City.save"]
    }...

 will listen to all services of the "Person" resource and the "save" service of "City".

 */
ludo.remote.Message = new Class({
    // TODO support auto hide
    Extends:ludo.View,
    cls:'ludo-remote-message',

    /**
     Listen to these resources and events
     @config {Array|String} listenTo
     @example
        listenTo:"Person" // listen to all Person events
        listenTo:["Person.save","Person.read", "City"] // listen to "save" and "read" service of "Person" and all services of the "City" resource
     */
    listenTo:[],

    messageTypes:['success', 'failure', 'error'],

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['listenTo']);
        if (!ludo.util.isArray(this.listenTo))this.listenTo = [this.listenTo];
		this.validateListenTo();

    },

	validateListenTo:function(){
		for(var i=0;i<this.listenTo.length;i++){
			this.listenTo[i] = this.listenTo[i].replace(/\//g,'.');
		}
	},

    ludoEvents:function () {
        this.parent();
        var resources = this.getResources();
        for (var resourceName in resources) {
            if (resources.hasOwnProperty(resourceName)) {
                this.addResourceEvent(resourceName, resources[resourceName]);
            }
        }
    },

    getResources:function () {
        var ret = {};
        var resource, service;
        for (var i = 0; i < this.listenTo.length; i++) {
            if (this.listenTo[i].indexOf('.') >= 0) {
                var tokens = this.listenTo[i].split(/\./g);
                if (tokens.length === 2) {
                    service = tokens.pop();
                    resource = tokens[0];
                    service = service != '*' ? service : undefined;
                }
            } else {
                resource = this.listenTo[i];
                service = undefined;
            }

            if (ret[resource] == undefined) {
                ret[resource] = [];
            }
            if (service && ret[resource].indexOf(service) === -1) {
                ret[resource].push(service);
            }
        }
        return ret;
    },

    addResourceEvent:function (resource, service) {
        ludo.remoteBroadcaster.addServiceEvent("clear", resource, service, this.hideMessage.bind(this));
        for (var i = 0; i < this.messageTypes.length; i++) {
            ludo.remoteBroadcaster.addServiceEvent(this.messageTypes[i], resource, service, this.showMessage.bind(this));
        }
    },

    showMessage:function (response) {
        this.show();
        if (response.code && response.code !== 200) {
            this.getEl().addClass('ludo-remote-error-message');
        } else {
            ludo.dom.removeClass(this.getEl(), 'ludo-remote-error-message');
        }
        this.setHtml(response.message);

        /**
         * Event fired when message is shown.
         * @event showMessage
         * @param {remote.Message} this
         */
        this.fireEvent('showMessage', this);
    },

    hideMessage:function () {
        this.setHtml('');
    }
});