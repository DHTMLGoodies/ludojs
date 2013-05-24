<?php
$sub = true;
$pageTitle = 'Slide in layout';
require_once("../includes/demo-header.php");
?>
<body>

<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/slide-in.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/effect/effect.js"></script>

<script type="text/javascript">
    var v = new ludo.Window({
        title:'Slide in layout demo',
        layout:{
            left:10, top:10,
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
                    'border-top':'1px solid #d7d7d7'
                },
                layout:{
                    weight:1,
                    type:'SlideIn'
                },
                children:[
                    {
                        layout:{
                            below:'top',
                            width:200,
                            fillDown:true,
                            type:'Menu',
                            orientation:'vertical',
                            resize:['right']
                        },
                        listeners:{
                            'click':function (item) {
                                if (item.action) {
                                    // load content from url into into main panel
                                    ludo.get('mainPanel').getDataSource().loadUrl('../resources/articles/' + item.action);
                                }
                            }
                        },
                        containerCss:{
                            border:0,
                            'border-right':'1px solid #d7d7d7'
                        },
                        children:[
                            {
                                html:"Front page",
                                hidden:false,
                                action:'front-page.php'
                            },
                            {
                                html:"Pages"
                            },
                            { html:"Page3", action:'page-3.php' }
                        ]
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