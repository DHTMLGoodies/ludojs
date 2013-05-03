<?php
$sub = true;
$pageTitle = 'Canvas Demo - ludoJS';
require_once("../includes/demo-header.php");
?>
<body>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/node.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/named-node.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/element.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/group.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/text-box.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/curtain.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/animation.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/engine.js"></script>
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
        text:'Normal <b>Bold text</b> Normal<br>Second line',
        width:300, height:20, x:20, y:20

    });

    v.getCanvas().adopt(t);

    t.node.curtain().open('LeftRight');

</script>