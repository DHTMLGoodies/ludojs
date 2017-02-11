<?php
$sub = true;
require_once("../includes/demo-header.php");
?>


<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/slider.js"></script>
<script type="text/javascript" class="source-code">
    function setColor(obj) {
        if (!ludo.get('green'))return;
        if (!ludo.get('blue'))return;
        var color = 'rgb(' + ludo.get('red').getValue() + ',' + ludo.get('green').getValue() + ',' + ludo.get('blue').getValue() + ')';
        ludo.get('colorPreview').$b().setStyle('background-color', color);
    }
    var w = new ludo.Window({
        width:520, height:300,
        id:'myWindow',
        left:50, top:50,
        layout:{
            type:'relative'
        },
        stateful:true,
        title:'Color picker - stateful',
        children:[
            {
                id:'colorPreview',
                elCss:{
                    'margin':3
                },
                css:{
                    border:'1px solid #92A2B3',
                    'background-color':'#FFF'
                },
                layout:{
                    height:'matchParent',
                    leftOf:'red',
                    fillLeft:true
                }
            },

            {
                type:'form.Slider', stateful:true, minValue:0, maxValue:255, value:'255', id:'red', name:'red', direction:'vertical',
                listeners:{
                    change:setColor
                },
                layout:{
                    width:50,
                    alignLeft:'R',
                    above:'R',
                    fillUp:true
                }
            },
            {
                type:'form.Number', stateful:true, maxLength:3, linkWith:'red', id:'redNumber', value:'255', name:'R', label:'R', fieldWidth:30,
                layout:{
                    leftOf:'green',
                    alignParentBottom:true,
                    width:50,
                    height:30
                }
            } ,
            {
                type:'form.Slider', stateful:true, minValue:0, maxValue:255, value:'195', id:'green', name:'green', direction:'vertical',
                listeners:{
                    change:setColor
                },
                layout:{
                    width:50,
                    alignLeft:'G',
                    above:'G',
                    fillUp:true
                }
            },
            {
                type:'form.Number', stateful:true, maxLength:3, linkWith:'green', id:'greenNumber', value:'195', name:'G', label:'G', fieldWidth:30,
                layout:{
                    alignParentBottom:true,
                    leftOf:'blue',
                    height:30,
                    width:50
                }
            },
            {
                type:'form.Slider', stateful:true, minValue:0, maxValue:255, value:'54', id:'blue', name:'blue', direction:'vertical',
                listeners:{
                    change:setColor
                },
                layout:{
                    width:50,
                    alignParentRight:true,
                    above:'B',
                    fillUp:true
                }
            },
            {
                type:'form.Number', stateful:true, maxLength:3, linkWith:'blue', id:'blueNumber', value:'54', name:'B', label:'B', fieldWidth:30,
                layout:{
                    alignParentBottom:true,
                    alignParentRight:true,
                    width:50,
                    height:30
                }
            }


        ]
    });
    setColor();
</script>
</body>
</html>