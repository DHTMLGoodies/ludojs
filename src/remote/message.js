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
        resource:'Person'
    }...
 will show remote messages for all remote requests for for the Person resource.

 */
ludo.remote.Message = new Class({
    Extends: ludo.View,
    cls:'ludo-remote-message',
    /**
     * Listen to remote messages from this resource
     * @config {String} resource
     */
    resource:undefined,
    /**
     * Listen only to remote messages for this service
     * @config {String} service
     * @optional
     */
    service:undefined,
    listenTo:undefined,
    messageTypes:['success','failure','error'],

    ludoConfig:function(config){
        this.parent(config);
        this.resource = config.resource;
        this.service = config.service;
    },

    ludoEvents:function(){
        this.parent();
        ludo.remoteBroadcaster.addServiceEvent("clear", this.resource, this.service, this.hideMessage.bind(this) );
        for(var i=0;i<this.messageTypes.length;i++){
            ludo.remoteBroadcaster.addServiceEvent(this.messageTypes[i], this.resource, this.service, this.showMessage.bind(this));
        }
    },

    showMessage:function(response){
        if(response.code && response.code !== 200){
            ludo.dom.addClass(this.getEl(), 'ludo-remote-error-message');
        }else{
            ludo.dom.removeClass(this.getEl(), 'ludo-remote-error-message');
        }
        this.setHtml(response.message);
    },

    hideMessage:function(){
        this.setHtml('');
    }
});