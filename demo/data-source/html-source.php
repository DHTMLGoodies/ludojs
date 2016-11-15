<?php
$sub = true;
$pageTitle = 'HTML data sources';
require_once("../includes/demo-header.php");
?>


<script type="text/javascript">
    var w = new ludo.Window({
        id:'myWindow',
        title : 'HTML Data sources',
        layout:{
            left:20,top:20,
            width:500,height:400
        },
        css:{
            'background-color' : '#FFF',
            'overflow-y' : 'auto',
            padding:5
        },
        dataSource:{
            type:'dataSource.HTML',
            url : '../resources/articles/with-link.php',
            shim:{
                txt : 'Loading page. Please wait'
            }
        }

    });

</script>