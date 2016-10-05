TestCase("MessageTest", {

    "test should get correct resources to assign events to": function(){
        // given
        var message = new ludo.remote.Message({
            "listenTo": "Person.*"
        });
        // when
        var resources = message.getResources();
        // then
        assertNotUndefined(resources.Person);
        assertEquals([], resources.Person);

    },

    "test should get correct resources to assign events to when assigning multiple": function(){
        // given
        var message = new ludo.remote.Message({
            "listenTo": ["Person.*","City.read","City.save"]
        });
        // when
        var resources = message.getResources();
        // then
        assertNotUndefined(resources.Person);
        assertEquals([], resources.Person);
        assertNotUndefined(resources.City);
        assertEquals(['read','save'], resources.City);

    },


    "test should be able to display messages when events are broadcasted": function(){
        // given
        var message = new ludo.remote.Message({
            "listenTo": "Person.*"
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


	"test should be able to define listen to user slashes": function(){
     // given
     var message = new ludo.remote.Message({
         "listenTo": "Person/*"
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

    "test should be able to listen to multiple resources": function(){
        // given
        var message = new ludo.remote.Message({
            "listenTo": ["Person.*","City.*"]
        });
        ludo.remoteBroadcaster.broadcast(
            this.getRemoteMock({
                "message": "My message 2",
                "code": 200,
                "resource": "City"
            })
        );

        // then
        assertEquals("My message 2", this.getInnerText(message.getBody()));
    },

    getInnerText:function(el){
        return el.html().replace(/<\/[^>]+?>/g,'');
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