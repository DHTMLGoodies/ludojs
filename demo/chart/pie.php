<?php
$sub = true;
$pageTitle = 'Pie Chart - ludoJS';
require_once("../includes/demo-header.php");
?>
<body>

<script type="text/javascript">

var w = new ludo.Window({
    layout:{
        width:500,
        height:400,
        left:20,
        top:20
    },
    children:[
        {
            type:'chart.Pie'
        }
    ]

});
</script>
</body>
</html>