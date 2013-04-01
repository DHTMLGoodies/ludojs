<?php
$sub = true;
$pageTitle = 'Linear layout';
require_once("../includes/demo-header.php");
?>
<body>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/base.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/renderer.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear-horizontal.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear-horizontal.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/menu.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/menu-horizontal.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/menu-vertical.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/menu-container.js"></script>
<script type="text/javascript" class="source-code">
    var w = new ludo.Window({
        title:'Window with menu',
        layout:{
            width:600,
            height:400,
            left:50,
            top:50
        },
        children:[
            {
                layout:{
                    type:'Menu',
                    orientation:'horizontal'
                },
                children:[
                    "File","Edit"
                ]
            }
        ]

    });
</script>
</body>
</html>