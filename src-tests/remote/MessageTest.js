TestCase("MessageTest", {

    "test should be able to display messages when events are broadcasted": function(){
        // given
        var message = new ludo.remote.Message({
            "resource": "Person"
        });
        ludo.remoteBroadcaster.broadcast(
            this.getRemoteMock({
                "message": "My message",
                "code": 200,
                "resource": "Person"
            })
        );

        // then
        assertEquals("My message", this.getInnerText(message.getBody()));
    },

    getInnerText:function(el){
        return el.innerHTML.replace(/<\/[^>]+?>/g,'');
    },

    getRemoteMock:function(config){
        var resource  = config.resource;
        var code = config.code;
        var message = config.message;

        if(window.RemoteMockBr === undefined){
            window.RemoteMockBr = new Class({
                code:undefined,
                message:undefined,
                resource:undefined,
                initialize:function(resource, code, message){
                    this.resource = resource;
                    this.code = code;
                    this.message = message;
                },
                getResponseMessage:function(){
                    return this.message;
                },
                getResponseCode:function(){
                    return this.code;
                },
                getResource:function(){
                    return this.resource;
                }
            })
        }

        return new RemoteMockBr(resource, code, message);
    }


});