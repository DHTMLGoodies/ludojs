<?php
$sub = true;
$pageTitle = 'Calendar demo';
require_once("../includes/demo-header.php");
?>
<body>

<script type="text/javascript" class="source-code">
var w = new ludo.Window({
    left:50, top:50,
    title:'Calendar',
    width:300, height:270,
    form:{
        url:'server-file-upload-form.php'
    },
    layout:'fill',
    children:[
        { type:'calendar.Calendar', name:'title',minDate:'1971-01-01',date:'2013-02-21' }
    ]
});
</script>
</body>
</html>