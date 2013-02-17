TestCase("SocketTest", {

	"test should be able to defined socket events":function () {
		// given
		var c = new ludo.View({
			socket:{
				url:'http://127.0.0.1:1337'
			}
		});

		// when
		var socket = c.getSocket();

		// then
		assertNotUndefined(socket);
		assertEquals('socket.Socket', socket.type);
	},
	"test should return correct socket url":function () {
		// given
		var c = new ludo.View({
			socket:{
				url:'http://127.0.0.1:1337'

			}
		});

		// when
		var socket = c.getSocket();

		// then
		assertEquals('http://127.0.0.1:1337', socket.url);
		assertEquals('http://127.0.0.1:1337', socket.getUrl());
	},
	"test should return url from app config when not defined":function () {
		// given
		var c = new ludo.View({
			socket:{}
		});

        ludo.config.setSocketUrl('http://127.0.0.1:1337');

		// when
		var socket = c.getSocket();

		// then
		assertEquals('http://127.0.0.1:1337', socket.getUrl());

	},
	"test should load library":function () {
		// given
		new ludo.View({
			socket:{}
		});
		// when
		var url = 'http://127.0.0.1:1337/socket.io/socket.io.js';
		// then
		assertTrue(document.documentElement.innerHTML.indexOf(url) >= 0);

	},
	"test should load library only once":function () {
		// given
		new ludo.View({
			socket:{
				url:'http://127.0.0.1:1337'
			}
		});
		new ludo.View({
			socket:{
				url:'http://127.0.0.1:1337'
			}
		});
		// when
		var url = 'http://127.0.0.1:1337/socket.io/socket.io.js';
		url = '"' + url + '"';
		// then
		var index1 = document.documentElement.innerHTML.indexOf(url);
		var index2 = document.documentElement.innerHTML.indexOf(url, index1 + url.length);

		assertEquals(-1, index2);
	},
	"test should find parent component":function () {
		// given
		var c = new ludo.View({
			socket:{
				url:'http://127.0.0.1:1337'
			}
		});

		// then
		assertNotUndefined(c.getSocket().component);

	},
	"test should be able to specify events to emit":function () {
		// given

		ludo.socket.SocketMock = new Class({
			Extends:ludo.socket.Socket,
			emit:function () {
				this.fireEvent('emit');
			}
		});

		var c = new ludo.View({
			socket:{
				url:'http://127.0.0.1:1337',
				type:'socket.SocketMock',
				emitEvents:['send']
			}
		});
		var eventFired = false;

		// when
		c.getSocket().addEvent('emit', function () {
			eventFired = true;
		});
		c.fireEvent('send');

		// then
		assertTrue(eventFired);

	},
	"test should preserve arguments when specifying events to emit":function () {
		// given

		ludo.socket.SocketMock = new Class({
			Extends:ludo.socket.Socket,
			emit:function (event, obj) {
				this.fireEvent('emit', obj);
			}
		});

		var c = new ludo.View({
			socket:{
				url:'http://127.0.0.1:1337',
				type:'socket.SocketMock',
				emitEvents:['send']
			}
		});


		var returnedObj = {};
		// when
		c.getSocket().addEvent('emit', function (obj) {
			returnedObj = obj;
		});
		c.fireEvent('send', {
			name:'John', age:'38'
		});

		// then
		assertEquals('John', returnedObj.name);
		assertEquals('38', returnedObj.age);
	},
	"test should have same socket when two components are using same url":function () {
		// given
		var c1 = new ludo.View({
			socket:{
				url:'http://127.0.0.1:1337'
			}
		});
		var c2 = new ludo.View({
			socket:{
				url:'http://127.0.0.1:1337'
			}
		});

		// then
		assertEquals(c1.getSocket().socket, c2.getSocket().socket);

	}


})
;