<?php
$sub = true;
$pageTitle = 'Canvas Demo - ludoJS';
require_once("../includes/demo-header.php");
?>
<body>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/text-box.js"></script>
<script type="text/javascript">
    var v = new ludo.View({
        renderTo:document.body,
        layout:{
            width:'matchParent',
            height:'matchParent'
        },
        containerCss:{
            'background-color':'#fff'
        }
    });

    var t = new ludo.canvas.TextBox({
        text:'Text <b>coming</b> here<br>Next line',
        width:300, height:20, x:20, y:20

    });

    v.getCanvas().adopt(t);


</script>