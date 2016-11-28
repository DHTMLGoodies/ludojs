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
    }
</style>


<h1>Canvas API with Drag And Drop (iPad compatible)</h1>

<script type="text/javascript"><!--
google_ad_client = "ca-pub-0714236485040063";
/* LudoJS */
google_ad_slot = "6617755948";
google_ad_width = 336;
google_ad_height = 280;
//--><!--
</script>
<script type="text/javascript"
        src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>

<style type="text/css">
    .ludo-body, div.ludo-framed-view-body {

    }
    .default-color-scheme-box{
        margin-top:20px;
        text-align:center;
    }

</style>
<script type="text/javascript">

    var win = new ludo.Window({
        id:'canvasWindow',
        minWidth:100, minHeight:100,
        left:200, top:40,
        width:600, height:490,
        title:'Color picker created with SVG',
        layout:{
            type:'relative'
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