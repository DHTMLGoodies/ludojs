<?php
$sub=true;
$pageTitle = 'Grid layout';
require_once("../includes/demo-header.php");
?>
<body>
<style type="text/css">
.customView{
    border:1px solid #000;
    margin:2px;
    background-color:#FFF;
}
</style>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/base.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/grid.js"></script>
<script type="text/javascript" class="source-code">
var w = new ludo.Window({
    left:50, top:50,
    title:'Grid layout',
    width:700,height:600,
    layout:{
        type:'grid',
        cols:5,
        rows:3
    },
    children:[
        { html:'A (colspan=2)',cls:'customView', layout:{ colspan:2} },
        { html:'B',cls:'customView' },
        { html:'C',cls:'customView' },
        { html:'D',cls:'customView' },
        { html:'E',cls:'customView' },
        { html:'F (colspan=3)',cls:'customView', layout:{ colspan:3} },
        { html:'G',cls:'customView' },
        { html:'H',cls:'customView' },
        { html:'I',cls:'customView' },
        { html:'J',cls:'customView' },
        { html:'K',cls:'customView' },
        { html:'L',cls:'customView' }
    ],
    buttonBar:[
        { type : 'form.Button', value:'OK' }
    ]
});
</script>
</body>
</html>