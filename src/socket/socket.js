/**
 Class for nodeJS communication. You configure nodeJS communication by passing a {{#crossLink "View/socket"}}socket{{/crossLink}} object to
 a {{#crossLink "View"}}{{/crossLink}}, example: socket:{ url:'http://127.0.0.1:1337' }. You can get a reference to this class by calling
 {{#crossLink "View/getSocket"}}{{/crossLink}}
 @namespace socket
 @class Socket
 @extends Core
 @constructor
 @param {Object} config
 @example
 	// Server side code:
	 var io = require('socket.io').listen(1337, "127.0.0.1");

	 io.sockets.on('connection', function (socket, request) {
		 socket.on('sayhello', function (person) {
			 socket.emit('hello', { message:'Hello ' + person.name, success:true });
		 });

		 socket.on('chat', function (request) {
			 socket.broadcast.emit('getmessage', { message:'Person A says: ' + request.message, success:true });
			 socket.emit('getmessage', { message:'Person A says: ' + request.message, success:true });
		 });
	 });
 Client side code:
 @example
	 ludo.chat = {};
	  ludo.chat.Panel = new Class({
		  Extends:ludo.View,
		  type:'chat.Panel',
		  weight:1,
		  css:{
			  'background-color':'#FFF',
			  'overflow-y':'auto'
		  },
		  socket:{
			  url:'http://127.0.0.1:1337'
		  },

		  ludoEvents:function () {
			  this.getSocket().on('getmessage', this.appendMessage.bind(this));
		  },

		  appendMessage:function (msg) {
			  var html = this.getBody().get('html');
			  html = html + '>' + msg.message + '<br>';
			  this.getBody().set('html', html);
		  }
	  });

	  ludo.chat.TextPanel = new Class({
		  Extends:ludo.View,
		  layout:'cols',
		  height:30,
		  css:{
			  'margin-top':3
		  },
		  children:[
			  {
				  type:'form.Text',
				  weight:1,
				  name:'text'
			  },
			  {
				  type:'form.Button', value:'Send',
				  name:'send',
				  width:80
			  }
		  ],
		  socket:{
			  url:'http://127.0.0.1:1337',
			  emitEvents:['chat']
		  },

		  ludoEvents:function () {
			  this.parent();
			  this.child['send'].addEvent('click', this.sendMessage.bind(this))
		  },
		  sendMessage:function () {
			  if (this.child['text'].getValue().length > 0) {
				  this.fireEvent('chat', { message:this.child['text'].getValue()});
				  this.child['text'].setValue('');
			  }
		  }
	  });

	  new ludo.Window({
		  id:'myWindow',
		  minWidth:100, minHeight:100,
		  left:50, top:50,
		  width:410, height:490,
		  title:'Chat application',
		  layout:'rows',
		  children:[
			  {
				  type:'chat.Panel'
			  },
			  {
				  type:'chat.TextPanel'
			  }
		  ]
	  });
 */
ludo.socket.Socket = new Class({
	Extends:ludo.Core,
	type:'socket.Socket',

	/**
	 * Socket http url, example: http://localhost:1337
	 * URL can also be defined in LUDO_APP_CONFIG.socket
	 * @config url
	 * @type String
	 * @default undefined
	 */
	url:undefined,

	socket:undefined,

	/**
	 * Reference to parent component
	 * @property {Object} component
	 */
	component:undefined,

	/**
	 Array of view/component events to emit to server. When this event is fired, it will be emitted
	 to the server automatically.
	 @config emitEvents
	 @type {Array}
	 @default undefined
	 @example
	 	new ludo.View({
	 		...
	 		socket:{
	 			url:'http://127.0.0.1:1337',
	 			emitEvents:['chat'] // emit the "chat" event
	 		}
	 specifies that the "chat" event should be sent to NodeJS on the server.
	 @example
	 	this.fireEvent('chat', { message:this.child['text'].getValue()});

	 will cause { message:this.child['text'].getValue()} to be sent to the server where you can pick it up with code like this
	 @example
	 	socket.on('chat', function (data) {
	 		console.log(data.message);
		}

	 */
	emitEvents:undefined,


	ludoConfig:function (config) {
		this.parent(config);
		if (config.url !== undefined)this.url = config.url;
		if (config.component !== undefined) this.component = config.component;
		if (config.emitEvents !== undefined)this.emitEvents = config.emitEvents;
		if (!this.hasIoSocketLibrary() || !this.hasIoSocketLibraryForThisUrl()) {
			this.loadLib();
		}
		if (this.emitEvents)this.assignComponentEvents();
	},

	assignComponentEvents:function () {
		for (var i = 0; i < this.emitEvents.length; i++) {
			this.component.addEvent(this.emitEvents[i], this.getEventFn(this.emitEvents[i]).bind(this));
		}
	},

	getEventFn:function (event) {
		return function (obj) {
			this.emit(event, obj);
		}
	},

	getUrl:function () {
		var url = this.url;
		if (!url && window.LUDO_APP_CONFIG !== undefined) {
			url = LUDO_APP_CONFIG.socket;
		}
		if (url)url = url.trim();
		return url;
	},

	loadLib:function () {
		var url = this.getUrl();
		if (url !== undefined) {
			if (ludo.socket.libLoaded === undefined) {
				ludo.socket.libLoaded = {};
			}
			if (ludo.socket.libLoaded[url] === undefined) {
				if (url !== undefined) {
					ludo.socket.libLoaded[url] = true;
					Asset.javascript(url + '/socket.io/socket.io.js');
				}
			}
		}
	},

	/**
	Add socket event
	@method on
	@param {String} event
	@param {Function} fn
	@example
		this.getSocket().on('eventName', this.myMethod.bind(this));
	This is an example of how to add a socket event from a View. It will execute the "myMethod" method when
	socket event "eventName" is fired.
	*/
	on:function (event, fn) {
		if (!this.hasIoSocketLibrary()) {
			this.on.delay(50, this, [event, fn]);
			return;
		}
		this.getSocket().on(event, fn);
	},
	/**
	Emit socket event
	@method emit
	@param {String} event
	@param {Object} query
	@example
		{
			q: { query },
			m: 'module',
			s: 'submodule',
			c: 'command/event name'
		}

	 "c" will be set to your passed event name
	 "q" will be set to your passed query object
	 "m" will be set to module name of the view(if any)
	 "s" will be set to sub module name of the view(if any)
	 */
	emit:function (event, query) {
		if (!this.hasIoSocketLibrary()) {
			this.emit.delay(50, this, [event, query]);
			return;
		}
		this.getSocket().emit(event, this.getObjectToEmit(event, query));
	},

	getObjectToEmit:function (event, obj) {
		return {
			m:this.getModule(),
			s:this.getSubModule(),
			c:event,
			q:obj
		}
	},

	hasIoSocketLibrary:function () {
		return window['io'] !== undefined;
	},

	hasIoSocketLibraryForThisUrl:function () {
		return ludo.socket.libLoaded === undefined || ludo.socket.libLoaded[this.getUrl()] == undefined;
	},

	getSocket:function () {
		if (this.socket === undefined) {
			if (ludo.socket.socketCache === undefined) {
				ludo.socket.socketCache = {};
			}
			var url = this.getUrl();
			if (ludo.socket.socketCache[url] === undefined) {
				ludo.socket.socketCache[url] = window['io'].connect(url);
			}
			this.socket = ludo.socket.socketCache[url];
		}

		return this.socket;
	}
});