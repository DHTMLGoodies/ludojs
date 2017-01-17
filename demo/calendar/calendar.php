<?php
$sub = true;
$pageTitle = 'Calendar demo';
require_once("../includes/demo-header.php");
?>

<style type="text/css">

    .calendar-day-cell{
        float:left;

    }

</style>

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
        {
            sundayFirst:true,
            type:'calendar.Calendar',
            name:'title',
            minDate:'1971-01-01',
            date:'2017-01-16'
        }
    ]
});
</script>
</body>
</html>