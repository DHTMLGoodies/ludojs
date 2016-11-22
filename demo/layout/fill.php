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
        title:'Calendar View in fill layout',
        width:700, height:600,
        layout:{
            type:'fill'
        },
        children:[
            {
                type: 'calendar.Calendar'
            }
        ]
    });
</script>
</body>
</html>