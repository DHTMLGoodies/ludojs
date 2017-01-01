<?php
$sub = true;
$pageTitle = 'Color Picker using ludo canvas - ludoJS';
require_once("../includes/demo-header.php");
?>
<script type="text/javascript">
    ludo.colorPicker = {};
</script>

<script type="text/javascript" src="color-picker/controller.js"></script>
<script type="text/javascript" src="color-picker/rgb.js"></script>
<script type="text/javascript" src="color-picker/hsv.js"></script>
<script type="text/javascript" src="color-picker/hue-bar.js"></script>
<script type="text/javascript" src="color-picker/picker.js"></script>
<script type="text/javascript" src="color-picker/preview.js"></script>
<script type="text/javascript" src="color-picker/code-panel.js"></script>
<script type="text/javascript" src="color-picker/color-scheme.js"></script>
<style type="text/css">
    .color-scheme-box {
        width: 70px;
        height: 70px;
        margin-top: 5px;
        margin-left: 5px;
        border-radius:2px;
    }
</style>
<style type="text/css">
    .ludo-body, div.ludo-framed-view-body {

    }
    .default-color-scheme-box{
        margin-top:20px;
        text-align:center;
    }

</style>
<script type="text/javascript">

    var win = new ludo.FramedView({
        id:'canvasWindow',
        title:'Color picker created with SVG',
        renderTo:document.body,
        layout:{
            type:'relative',
            //  left:20, top:40,
            width:'matchParent', height:'matchParent',
            minWidth:300, minHeight:400,
        },
        children:[
            {
                type:'colorPicker.Picker',
                name:'Picker',
                layout:{
                    leftOf:'hueBar',
                    fillLeft:true,
                    fillUp:true,
                    above:'scheme'
                }
            },
            {
                type:'colorPicker.HueBar',
                name:'hueBar',
                layout:{
                    width:50,
                    leftOf:'codes',
                    fillUp:true,
                    above:'scheme'
                }
            },
            {
                type:'colorPicker.Codes',
                name:'codes',
                layout:{
                    type:'linear',
                    orientation:'vertical',
                    width:150,
                    alignParentRight:true,
                    fillUp:true,
                    above:'scheme'
                }
            },
            {
                type:'colorPicker.ColorScheme',
                name:'scheme',
                id:'colorScheme',
                layout:{
                    alignParentBottom:true,
                    height:80,
                    alignParentLeft:true,
                    fillRight:true
                }
            }
        ],
        buttonBar:{
            children:[
                { type:'form.Button', value:'Analogous', listeners:{
                    click:function () {
                        ludo.get('colorScheme').generateComplementaryScheme(controller.getHSV());
                    }
                }},
                { type:'form.Button', value:'Triad', listeners:{
                    click:function () {
                        ludo.get('colorScheme').generateTriadScheme(controller.getHSV());
                    }
                }},
                { type:'form.Button', value:'Monochromatic', listeners:{
                    click:function () {
                        ludo.get('colorScheme').generateMonochromaticScheme(controller.getHSV());
                    }
                }},
                { type:'form.Button', value:'Split Complement', listeners:{
                    click:function () {
                        ludo.get('colorScheme').generateSplitComplementary(controller.getHSV());
                    }
                }}
            ]
        }
    });

    controller.setColor('#7799AA');

</script>

</body>
</html>