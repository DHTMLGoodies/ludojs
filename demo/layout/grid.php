<?php
$sub=true;
$pageTitle = 'Grid layout';
require_once("../includes/demo-header.php");
?>

<style type="text/css">
.customView{
    border:1px solid #000;
    background-color:#FFF;
}
.customView .ludo-body{
    padding:5px;
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
        columns:5,
        rows:5,
        padX:5,padY:5
    },
    children:[
        { html:'layout:{ colspan:2, x:0, y:0 }',cls:'customView', layout:{ colspan:2, x:0, y:0 } },
        { html:'layout: { x: 2, y: 0}',cls:'customView', layout: { x: 2, y: 0} },
        { html:' layout: { x: 0, y: 1}',cls:'customView', layout: { x: 0, y: 1} },
        { html:'layout: { x: 1, y: 1} ',cls:'customView', layout: { x: 1, y: 1} },
        { html:'layout: { x: 1, y: 2}',cls:'customView', layout: { x: 1, y: 2} }
    ],
    buttonBar:[
        { type : 'form.Button', value:'OK' }
    ]
});
</script>
</body>
</html>