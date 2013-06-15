<?php
$sub = true;
$pageTitle = 'Wizard demo';
require_once("../includes/demo-header.php");
?>
<body>
<script type="text/javascript" src="../../src/progress/base.js"></script>
<script type="text/javascript" src="../../src/progress/bar.js"></script>
<script type="text/javascript" src="../../src/progress/datasource.js"></script>
<script type="text/javascript" src="../../src/remote/broadcaster.js"></script>
<script type="text/javascript" class="source-code">
    var w = new ludo.Window({
        id:'myWindow',
        left:50, top:50,
        width:600, height:320,
        title:'',
        layout:{
            type:'linear',
            orientation:'vertical'
        },
        form:{
            'resource' : 'LudoDBEmpty'
        },
        listeners:{
            'render' : function(view){
                console.log('render');

                ludo.remoteBroadcaster.withResource('LudoDBEmpty').
                        withService('save').on(['start','success'],
                function(arg){
                    var v = ludo.get('messagePanel');
                    var html = v.getBody().innerHTML;
                    html +='<br>';
                    html = html + JSON.encode(arg);
                    v.setHtml(html);

                }.bind(view));
            }.bind(this)
        },
        children:[
            {
                layout:{
                    weight:1
                },
                css:{
                    'background-color' : '#fff'
                },
                id:'messagePanel',
                html:'<strong>Broadcaster events:</strong>'
            },
            {
                type:'form.Hidden', value:'Hidden', name:'hidden'
            }
        ],
        buttonBar:{
            align:'left',
            children:[
                {
                    type:'form.SubmitButton',
                    applyTo:'myWindow'
                }
            ]}
    });
</script>
</body>
</html>