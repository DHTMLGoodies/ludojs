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
<script type="text/javascript" src="<?php echo $prefix; ?>../src/menu/context.js"></script>
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
        contextMenu:[
            {
                children:['Item 1','Item 2', 'Item 3']
            }
        ],
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
                                { html : 'PHP', children:['Pear','Dependency Injection','Singleton'] }, 'Javascript', 'Java', 'Perl'
                            ] },
                            "Save",
                            {
                                type:'form.Checkbox', label:'Hello', layout:{ width:250, height:25 }
                            },
                            {
                                type:'calendar.Calendar',
                                containerCss:{
                                    'background-color' : '#FFF',
                                    'border-top' : '1px solid #d7d7d7'
                                },
                                layout:{
                                    width:'matchParent',
                                    height:200
                                }
                            }
                        ]
                    },
                    { html:'Edit', children:[
                        "Copy", "Cut"
                    ]},
                    "View",
                    "Navigate"
                ]
            },
            {
                name:'leftMenu',
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
            },
            {
                layout:{
                    rightOf:'leftMenu',
                    below:'top',
                    fillRight:true,
                    fillDown:true
                },
                containerCss:{
                    'background-color' : '#FFF'
                },
                css:{
                    'overflow-y' : 'auto',
                    padding:5
                },
                dataSource:{
                    type:'dataSource.HTML',
                    url : '../data-source/article.php'
                }
            }
        ]

    });
</script>
</body>
</html>