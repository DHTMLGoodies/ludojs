<?php
$sub = true;
$pageTitle = 'LudoDB Integration example';
require_once("../includes/demo-header.php");
?>
<body>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/view.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/card.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/ludoDB/factory.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/remote/json.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/select.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/effect/resize.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/renderer.js"></script>
<script type="text/javascript">
    var w = new ludo.Window({
        title:'LudoDB Integration',
        layout:{
            'width':500, height:400
        },
        children:[
            {
                'layout':{
                    type:'linear',
                    orientation:'vertical'
                },
                'ludoDB':{
                    'resource':'LudoJSPerson',
                    'id':1,
                    'url':'../ludoDB/router.php'
                }
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