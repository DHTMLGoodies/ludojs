<?php
$pageTitle = 'YouTube component demo';
require_once("includes/demo-header.php");
?>
<body>
<script type="text/javascript" class="source-code">
var win = new ludo.Window({
    id:'videowin',
    left:100, top:50,
    hideBodyOnMove:true,
    renderTo:document.body,
    title:'YouTube Video',
    layout:{
        aspectRatio:1.6,
        preserveAspectRatio:true
    },
    width:600,
    children:[
        { name:'youtubevideo', weight:1, type:'video.YouTube',movieId:'fPTLa3ylmuw' }
    ]
});
</script>
<a href="#" onclick="win.child['youtubevideo'].loadMovie('RCxar5s0l6Y');return false">Load another movie</a><br>
<a href="#" onclick="win.child['youtubevideo'].loadMovie('fPTLa3ylmuw');return false">Load first movie</a><br>



</body>
</html>