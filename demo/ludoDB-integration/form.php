<?php
$sub = true;
$pageTitle = 'LudoDB Integration example';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" src="../../src/core.js"></script>
<script type="text/javascript" src="../../src/view.js"></script>
<script type="text/javascript" src="../../src/framed-view.js"></script>
<script type="text/javascript" src="../../src/window.js"></script>
<script type="text/javascript" src="../../src/util.js"></script>
<script type="text/javascript" src="../../src/ludo-db/factory.js"></script>
<script type="text/javascript" class="source-code">
    var w = new ludo.Window({
        title:'LudoDB Integration',
        stateful:true,
        layout:{
            'width':500, height:400, left:20,top:20, type:'tabs'
        },
        css:{
            'border-top' : 0
        },
        children:[
            {
                title : 'LudoDB form',
                'layout':{
                    type:'linear',
                    orientation:'vertical'
                },
                'ludoDB':{
                    'resource':'LudoJSPerson',
                    'arguments':1,
                    'url':'../ludoDB/router.php'
                }
            },{
                type:'SourceCodePreview'
            }
        ],
        buttons:[
            { type:'form.SubmitButton', value:'Save' },
            { type:'form.CancelButton', value:'Cancel' }
        ]
    });

</script>
</body>
</html>