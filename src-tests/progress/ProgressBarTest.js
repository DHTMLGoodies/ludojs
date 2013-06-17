TestCase("ProgressBarTest", {


    setUp:function(){
        if(window.ludo.progress.DataSourceMock === undefined){
            ludo.progress.DataSourceMock = new Class({
                Extends: ludo.progress.DataSource,
                type:'progress.DataSourceMock',
                load:function(){

                }
            });
        }
    },

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
        assertEquals('read', bar.getDataSource().service);
	},

    "te2st data source should inherit url": function(){
        // given
        var bar = new ludo.progress.Bar({
            renderTo:document.body,
            dataSource:{
                url:'index.php'
            }
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

    "test should send request to LudoDBProgress on start": function(){
        // given
        var bar = new ludo.progress.Bar({
            renderTo:document.body,
            listenTo:'Person/save',
            dataSource:{
                type : 'progress.DataSourceMock'
            }
        });

        var eventFired = false;

        bar.getDataSource().addEvent('start', function(){
            eventFired = true;
        });
        assertEquals('progress.DataSourceMock', bar.getDataSource().type);

        // when
        var req = this.getRemoteMock('Person');
        req.send('save');

        // then
        assertTrue(eventFired);
    },

    "test progress bar id should be sent with listenTo request": function(){
       // given
        new ludo.progress.Bar({
            renderTo:document.body,
            listenTo:'Person/save',
            dataSource:{
                type : 'progress.DataSourceMock'
            }
        });
		var r = this.getRemoteMock('Person');

		// when
		var data = r.getDataForRequest('save');

		// then
		assertNotUndefined(JSON.encode(data), data['LudoDBProgressID']);

    },

    "test progress bar id should ONLY be sent with listenTo request": function(){
       // given
        new ludo.progress.Bar({
            renderTo:document.body,
            listenTo:'Person/save',
            dataSource:{
                type : 'progress.DataSourceMock'
            }
        });
		var r = this.getRemoteMock('Person');

		// when
		var data = r.getDataForRequest('read');

		// then
		assertUndefined(JSON.encode(data), data['_progressId']);

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