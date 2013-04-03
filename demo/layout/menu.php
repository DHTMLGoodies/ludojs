<?php
$sub = true;
$pageTitle = 'Menu layout';
require_once("../includes/demo-header.php");
?>
<body>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/base.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/renderer.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear-horizontal.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear-horizontal.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/menu.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/menu-horizontal.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/menu-vertical.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/menu-container.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/renderer.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/view.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/framed-view.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/window.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/menu/item.js"></script>
<script type="text/javascript" class="source-code">
    var w = new ludo.Window({
        title:'Window with menu',
        layout:{
            width:600,
            height:400,
            left:50,
            top:50,
            type:'relative'
        },
        children:[
            {
                name:'top',
                layout:{
                    alignParentTop:true,
                    alignParentLeft:true,
                    fillRight:true,
                    height:20,
                    type:'Menu',
                    orientation:'horizontal'
                },
                containerCss:{
                    'border-bottom' : '1px solid #d7d7d7'
                },
                children:[
                    { html:"File", name:'file',
                        children:[
                            { html:"New project", name:'newproject', children:[
                                'PHP', 'Javascript', 'Java', 'Perl'
                            ] },
                            "Save",
                            {
                                type:'form.Text', label:'Hello', layout:{ width:300, height:25 }
                            },
                            {
                                type:'calendar.Calendar',
                                layout:{
                                    width:'matchParent',
                                    height:200
                                }
                            }
                        ]
                    },
                    { html:'Edit', children:[
                        "Copy", "Cut",
                        { name:'youtubevideo', weight:1, type:'video.YouTube', movieId:'fPTLa3ylmuw',
                            layout:{
                                width:300, height:300} }
                    ]},
                    "View",
                    "Navigate"
                ]
            },
            {
                layout:{
                    below:'top',
                    width:200,
                    fillDown:true,
                    type:'Menu',
                    orientation:'vertical'
                },
                containerCss:{
                    border:0,
                    'border-right' : '1px solid #d7d7d7'
                },
                children:[
                    {
                        html : "Front page", hidden:false
                    }, "Page 2", "Page3"
                ]
            }
        ]

    });
</script>
</body>
</html>