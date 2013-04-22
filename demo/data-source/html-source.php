<?php
$sub = true;
$pageTitle = 'Color widgets';
require_once("../includes/demo-header.php");
?>
<body>

<script type="text/javascript">
    var w = new ludo.Window({
        id:'myWindow',
        layout:{
            left:20,top:20,
            width:500,height:400
        },
        css:{
            'background-color' : '#FFF',
            'overflow-y' : 'auto'
        },
        dataSource:{
            type:'dataSource.HTML',
            url : '../resources/articles/with-link.php'
        }

    });

</script>