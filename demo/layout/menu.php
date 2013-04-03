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
<script type="text/javascript" src="<?php echo $prefix; ?>../src/menu/item.js"></script>
<script type="text/javascript" class="source-code">
    var w = new ludo.Window({
        title:'Window with menu',
        layout:{
            width:600,
            height:400,
            left:50,
            top:50
        },
        children:[
            {
                layout:{
                    type:'Menu',
                    orientation:'horizontal'
                },
                children:[
                    { html:"File", name:'file',
                        children:[
                            { html : "New project", name : 'newproject', children:[
                                'PHP','Javascript','Java','Perl'
                            ] }, "Save", {
                                type:'form.Text',label:'Hello', layout: { width: 300, height: 25 }
                            }, {
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
            }
        ]

    });
</script>
</body>
</html>