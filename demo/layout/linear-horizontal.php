<?php
$sub = true;
$pageTitle = 'Linear layout';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/base.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/effect/drag.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/resizer.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear-horizontal.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear-vertical.js"></script>
<script type="text/javascript" class="source-code">
    var w = new ludo.Window({
        left:50, top:50,
        title:'Linear layout',
        width:700, height:600,
        layout:{
            type:'linear',
            orientation:'horizontal'
        },
        children:[
            {
                html : 'A',
                layout:{
                    width:200,
                    resizable:true
                }
            },
            {
                html : 'B, weight: 1',
                weight:1
            },
            {
                html : 'C',
                layout:{
                    width:150,
                    resizable:true
                }
            }
        ],
        buttonBar:[
            { type:'form.Button', value:'OK' }
        ]
    });
</script>
</body>
</html>