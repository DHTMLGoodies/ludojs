<?php
$sub = true;
$pageTitle = 'Workspace sample';
$skin = 'blue';
require_once("../includes/demo-header.php");

?>
<body>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/framed-view.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/tab-strip.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/relative.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/tab.js"></script>
<style type="text/css">
    body, html {
        margin: 0;
        padding: 0;
        height: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>
<script type="text/javascript">
new ludo.View({
    renderTo:document.body,
    layout:{
        height:'matchParent',
        width:'matchParent',
        type:'relative'
    },
    children:[
        {
            id:'menu',
            listeners:{
                'click':function (item) {
                    if (item.html === 'New page') {
                        new ludo.dialog.Prompt({
                            title:'Title of new page',
                            value:'Title of new page',
                            label:'Title',
                            layout:{
                                height:120
                            },
                            formConfig:{
                                labelWidth:50
                            },
                            listeners:{
                                'ok':function (title) {
                                    var page = ludo.get('tabs').addChild({
                                        title:title,
                                        type:'FramedView',
                                        html:'Content',
                                        minimizable:false,
                                        layout:{
                                            'closable':true
                                        },
                                        containerCss:{
                                            'border':0,
                                            'background-color':'#d1e7ff'
                                        },
                                        css:{
                                            'background-color':'#fff',
                                            padding:5,
                                            margin:0
                                        }
                                    });
                                    page.show();
                                }
                            }
                        });

                    }
                    ludo.util.log(item.html);
                }
            },
            layout:{
                type:'menu',
                orientation:'horizontal',
                height:28,
                alignParentTop:true,
                fillRight:true
            },
            containerCss:{
                'border-bottom':'1px solid #a6cbf5',
                'border-top':'1px solid #a6cbf5',
                'margin-top':3
            },
            css:{
                'margin-left':10
            },
            children:[
                '|',
                {
                    html:'File',
                    children:['Open', {
                        html:'Save',
                        icon:' images/disk.gif'
                    }, {
                        html:'Save as',
                        children:[
                            'pdf', 'html', 'svg', { html:'php', children:['class', 'file'] }

                        ]
                    },
                        'New page']
                },
                '|', 'View', '|',
                'Navigate', '|'
            ]

        },
        {
            'id':'buttonBar',
            layout:{
                below:'menu',
                height:58,
                alignParentLeft:true,
                fillRight:true,
                type:'relative'
            },
            containerCss:{
                'padding-top':6,
                'padding-left':3
            },
            children:[
                {
                    html:'<img src="images/previous.png">',
                    id:'firstButton',
                    layout:{
                        alignParentLeft:true,
                        offsetX:3,
                        width:70,
                        height:'matchParent'
                    }
                },
                {
                    html:'<img src="images/next.png">',
                    layout:{
                        alignParentLeft:true,
                        rightOf:'firstButton',
                        width:70,
                        height:'matchParent'
                    }
                }
            ]
        },
        {
            id:'tabs',
            layout:{
                type:'tabs',
                tabs:'bottom',
                below:'buttonBar',
                fillDown:true,
                fillRight:true
            },
            containerCss:{
                'background-color':'#d1e7ff'
            },
            css:{
                margin:5,
                border:'1px solid #a6cbf5',
                'border-bottom':0

            },
            children:[
                {
                    title:'Top title',
                    type:'FramedView',
                    dataSource:{
                        type:'dataSource.HTML',
                        url:'../data-source/articles/front-page.php'
                    },
                    minimizable:false,
                    layout:{
                        'closable':false,
                        title:'Panel 1'
                    },
                    containerCss:{
                        border:0
                    },
                    css:{
                        'background-color':'#FFF',
                        'overflow-y':'auto',
                        margin:0,
                        padding:3
                    }
                },
                {
                    type:'FramedView',
                    title:'Panel 2',
                    minimizable:false,
                    containerCss:{
                        border:0
                    },
                    css:{
                        'background-color':'#FFF',
                        'overflow-y':'auto',
                        margin:0,
                        padding:3
                    },
                    dataSource:{
                        type:'dataSource.HTML',
                        url:'../data-source/articles/article-1.php'
                    },
                    layout:{
                        'closable':true
                    }
                },
                {
                    type:'FramedView',
                    title:'Calendar',
                    minimizable:false,
                    containerCss:{
                        border:0
                    },
                    css:{
                        'overflow-y':'auto',
                        margin:0,
                        'padding-top':3
                    },
                    layout:{
                        'closable':true
                    },
                    children:[
                        {
                            type:'calendar.Calendar'
                        }
                    ]
                },
                {
                    type:'FramedView',
                    layout:{
                        closable:true
                    },
                    title:'YouTube video',
                    minimizable:false,
                    containerCss:{
                        border:0
                    },
                    css:{
                        'overflow-y':'auto',
                        margin:0
                    },
                    children:[
                        {
                            title:'YouTube video',
                            type:'video.YouTube',
                            movieId:'6UJZBLABGsI',
                            html:'Content of child two'
                        }
                    ]
                }
            ]

        }
    ]


});


</script>
</body>
</html>