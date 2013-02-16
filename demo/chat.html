<?php
$pageTitle = 'Chat using NodeJS and ludoJS';
require_once("includes/demo-header.php");
?>
<body>


<h1>Server code:</h1>

<div class="source-code-preview ah">
    var io = require('socket.io').listen(1337, "127.0.0.1");

    io.sockets.on('connection',
        function (socket) {
            socket.on('sayhello', function (person) {
            socket.emit('hello', { message:'Hello ' + person.name, success:true });
        });

        socket.on('chat', function (query) {
            socket.broadcast.emit('getmessage', { message:'Person A says:' + query.q.message, success:true });
            socket.emit('getmessage', { message:'Person A says:' + query.q.message, success:true });
        });
    });
</div>
<h1>Client code:</h1>
<script type="text/javascript" class="source-code">
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
        left:50, top:20,
        width:410, height:390,
        title:'Chat application',
        layout:{
            type:'linear',
            orientation:'vertical'
        },
        children:[
            {
                type:'chat.Panel'
            },
            {
                type:'chat.TextPanel'
            }
        ]
    });
</script>
</body>
</html>