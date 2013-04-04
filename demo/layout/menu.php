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
                        children:['Item 1', 'Item 2', 'Item 3', { html:'Item 4', children:['Item 4.1', 'Item 4.2']}]
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
                            'border-bottom':'1px solid #d7d7d7'
                        },
                        children:[
                            { html:"File", name:'file',
                                children:[
                                    { html:"New project", name:'newproject', children:[
                                        { html:'PHP', children:['Pear', 'Dependency Injection', 'Singleton'] },
                                        'Javascript',
                                        'Java',
                                        'Perl',
                                        {
                                            'html':'Hidden item',
                                            hidden:true,
                                            id:'hiddenItem'
                                        }
                                    ] },
                                    "Save",
                                    {
                                        'label':'Save as', disabled:true
                                    },
                                    {
                                        html:'Select date',
                                        children:[
                                            {
                                                type:'calendar.Calendar',
                                                containerCss:{
                                                    'background-color':'#FFF',
                                                    'border-top':'1px solid #d7d7d7'
                                                },
                                                layout:{
                                                    width:200,
                                                    height:200
                                                }
                                            }
                                        ]
                                    }

                                ]
                            },
                            { html:'Edit', children:[
                                "Copy", "Cut", '|', 'Paste', 'Paste special'
                            ]},
                            {
                                html:"View",
                                children:[
                                    'Live edit', 'Line numbers'
                                ]
                            },
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
                        listeners:{
                            'click':function (item) {
                                if (item.action) {
                                    ludo.get('mainPanel').getDataSource().loadUrl('../data-source/articles/' + item.action);
                                }
                            }
                        },
                        containerCss:{
                            border:0
                        },
                        children:[
                            {
                                html:"Front page",
                                hidden:false,
                                action:'front-page.php'
                            },
                            {
                                html:"Pages",
                                children:[
                                    {
                                        html:'Page 1.1', action:'article-1.php'
                                    },
                                    {
                                        html:'Sport news', action:'sport.php'
                                    }
                                ]
                            },
                            { html:"Page3", action:'page-3.php' }
                        ]
                    },
                    {
                        id:'mainPanel',
                        layout:{
                            rightOf:'leftMenu',
                            below:'top',
                            fillRight:true,
                            fillDown:true
                        },
                        containerCss:{
                            'background-color':'#FFF',
                            'border-left':'1px solid #d7d7d7'

                        },
                        css:{
                            'overflow-y':'auto',
                            padding:5
                        },
                        dataSource:{
                            type:'dataSource.HTML',
                            url:'../data-source/articles/front-page.php'
                        }
                    }
                ]

            })
            ;
</script>
</body>
</html>