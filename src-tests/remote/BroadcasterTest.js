TestCase("RemoteBroadcasterTest", {


    "test should get correct event names": function(){
        // given
        var b = ludo.remoteBroadcaster;

        // when
        var eventName = b.getEventName('success', 'Person');

        // then
        assertEquals('PersonSuccessMessage', eventName);
    },

    "test mock": function(){
        var mock = this.getRemoteMock({
            resource:'Person',
            code:200,
            message : 'hello'
        });
        assertEquals('Person', mock.getResource());
        assertEquals(200, mock.getResponseCode());
        assertEquals('hello', mock.getResponseMessage());
    },

    "test should be able to add event without knowing the exact event name": function(){
        // given
        var b = ludo.remoteBroadcaster;
        var eventFired = false;

        // when
        b.addResourceEvent('success', 'Person', function(){
            eventFired = true;
        });
        b.broadcast(this.getRemoteMock({
            resource:'Person',
            code:200
        }), "read");

        // then
        assertTrue(eventFired);
    },
    "test should be able to add event specifying service": function(){
        // given
        var b = ludo.remoteBroadcaster;
        var eventFired = false;

        // when
        b.addResourceEvent('success', 'Person', function(){
            eventFired = true;
        }, "read");
        b.broadcast(this.getRemoteMock({
            resource:'Person',
            code:200
        }), "read");

        // then
        assertTrue(eventFired);
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