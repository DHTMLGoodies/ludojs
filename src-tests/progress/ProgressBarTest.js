TestCase("ProgressBarTest", {

    "test should initial be hidden": function(){
        // given
        var bar = new ludo.progress.Bar({
            renderTo:document.body
        });

        // then
        assertTrue(bar.isHidden());
    },

	"test resource should be LudoDBProgress":function () {
        // given
        var bar = new ludo.progress.Bar({
            renderTo:document.body
        });

        // then
        assertEquals('LudoDBProgress', bar.getDataSource().resource);
	},

    "test data source should inherit url": function(){
        // given
        var bar = new ludo.progress.Bar({
            renderTo:document.body,
            url : 'index.php'
        });

        // then
        assertEquals('index.php', bar.getDataSource().url);

    },

	"test should be able to define start listener":function () {
		// given
        var bar = new ludo.progress.Bar({
            renderTo:document.body,
            listenTo:'Person/save'
        });
        var req = this.getRemoteMock('Person');
        req.send('save');

        // then
        assertFalse(bar.isHidden());

	},

	getRemoteMock:function (resource) {

		if (window.JSONMock === undefined) {
			window.JSONMock = new Class({
                Extends: ludo.remote.JSON,
				code:undefined,
				message:undefined,
				resource:undefined,
                eventToFire:'success',

                sendToServer:function (service) {

                    this.fireEvent('start', this);
                    this.fireEvent(this.eventToFire, this);

                    this.sendBroadCast(service);

                    this.remoteData = { "code": 200, "message": 'Message' };
                }
			})
		}

		return new window.JSONMock({
            resource : resource
        });
	}
});