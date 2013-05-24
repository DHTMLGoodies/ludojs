<?php
$sub = true;
$pageTitle = 'Popup layout';
require_once("../includes/demo-header.php");
?>
<body>

<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/slide-in.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/effect/effect.js"></script>

<script type="text/javascript">
    var v = new ludo.Window({
        layout:{
            left:10,top:10,
            width:600,
            height:400,
            type:'linear',
            orientation:'vertical'
        },
        children:[
            {
                type:'form.Button',
                value:'Toggle Menu',
                layout:{
                    height:30
                },
                listeners:{
                    'click':function () {
                        ludo.get('slideIn').getLayout().toggle();
                    }
                }
            },
            {
                id:'slideIn',
                css:{
                    'border-top' : '1px solid #d7d7d7'
                },
                layout:{
                    weight:1,
                    type:'SlideIn'
                },
                children:[
                    {
                        hidden:true,
                        html:'Item 1<br>Item 2<br>Item 3',
                        css:{

                            'border-right' : '1px solid #d7d7d7'
                        },
                        layout:{
                            width:300
                        }
                    },
                    {
                        html:'Main view',
                        css:{
                            'background-color':'#fff'
                        }
                    }
                ]
            }

        ]
    })
</script>
</body>
</html>