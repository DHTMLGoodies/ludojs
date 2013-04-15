<?php
$sub = true;
$pageTitle = 'Deck/Card demo';
require_once("../includes/demo-header.php");
?>
<body>
<style type="text/css">
.ludo-color-box{
    width:15px;
    height:15px;
    float:left;
    margin-right:2px;
    margin-top:2px;
    cursor:pointer;
    border:1px solid #000;
}
</style>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/color/boxes.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/color/rgb-slider.js"></script>
<script type="text/javascript">
    new ludo.Window({
        title : 'Color widgets',
        css:{
            'border-top' : 0
        },
        layout:{
            height:400,width:400,
            type:'tabs',
            tabPos:'left'
        },
        children:[
            { type:'color.Boxes', title:'Color boxes' },
            { type:'color.RGBSlider', title : 'RGB slider',value:'#dd55cc' }
        ]
    })
</script>


</body>
</html>