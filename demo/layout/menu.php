<?php
$sub = true;
$pageTitle = 'Menu layout';
require_once("../includes/demo-header.php");
?>
<script type="text/javascript" class="source-code">
var w = new ludo.Window({
            title:'Window with menu',
            stateful:true,
            layout:{
                width:700,
                height:450,
                left:20,
                top:20,
                type:'relative'
            },
            css:{
                'border-bottom':0
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
                    elCss:{
                        'border-bottom':'0'
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
                                            layout:{
                                                width:200,
                                                height:200
                                            }
                                        }
                                    ]
                                },
                                {
                                    html:'Select color',
                                    children:[
                                        {
                                            type:'form.Seekbar',
                                            id:'red',
                                            orientation:'horizontal',
                                            layout:{
                                                height:25,
                                                width:200
                                            },
                                            thumbColor:'#D32F2F', // Red color of seekbar thumb
                                            negativeColor:'#D32F2F', // Same red color on the seekbar(below thumb)
                                            minValue:0,maxValue:255,
                                            listeners:{
                                                'change': function(){
                                                    ludo.$('colorPreview').updateColor();
                                                }
                                            }
                                        },
                                        {
                                            type:'form.Seekbar',
                                            id:'green',
                                            orientation:'horizontal',
                                            layout:{
                                                height:25,
                                                width:200
                                            },
                                            thumbColor:'#388E3C',
                                            negativeColor:'#388E3C',
                                            value:100,
                                            minValue:0,maxValue:255,
                                            listeners:{
                                                'change': function(){
                                                    ludo.$('colorPreview').updateColor();
                                                }
                                            }
                                        },
                                        {
                                            type:'form.Seekbar',
                                            id:'blue',
                                            orientation:'horizontal',
                                            layout:{
                                                height:25,
                                                width:200
                                            },
                                            value:45,
                                            thumbColor:'#1976D2',
                                            negativeColor:'#1976D2',
                                            minValue:0,maxValue:255,
                                            listeners:{
                                                'change': function(){
                                                    ludo.$('colorPreview').updateColor();
                                                }
                                            }
                                        },
                                        {
                                            id:'colorPreview',
                                            type:'View',
                                            layout:{
                                                height:200
                                            },
                                            elCss:{
                                                'margin-top': 5
                                            },
                                            updateColor:function(){
                                                if(this.colorUtil == undefined){
                                                    this.colorUtil = new ludo.color.Color();
                                                }
                                                var color = this.colorUtil.rgbCode(
                                                    ludo.get('red').val(), ludo.get('green').val(), ludo.get('blue').val()
                                                );
                                                this.getBody().css('background-color', color);
                                            },
                                            listeners:{
                                                'rendered': function(){
                                                    this.updateColor();
                                                }
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
                    id:'leftMenu',
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
                    elCss:{
                        border:0,
                        'border-top':'1px solid #424242',
                        'border-bottom':'1px solid #424242',
                        'border-right':'1px solid #424242'
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
                        above:'bottom',
                        type:'tabs',
                        tabs:'right'
                    },
                    elCss:{
                        'border-top':'1px solid #424242',
                        'border-left':'1px solid #424242'

                    },
                    children:[
                        {
                            dataSource:{
                                type:'dataSource.HTML',
                                url:'../resources/articles/front-page.php'
                            },
                            title:'Front page',
                            css:{
                                'overflow-y':'auto',
                                padding:5
                            }

                        },
                        {
                            dataSource:{
                                type:'dataSource.HTML',
                                url:'../resources/articles/sport.php'
                            },
                            title:'Sport news',
                            css:{
                                'overflow-y':'auto',
                                padding:5
                            }

                        }
                    ]

                },

                {
                    id:'bottom',
                    elCss:{
                        'border-top':'1px solid #424242',
                        'border-left':'1px solid #424242',
                        'border-bottom':'1px solid #424242'
                    },
                    layout:{
                        type:'Menu',
                        rightOf:'leftMenu',
                        orientation:'horizontal',
                        alignParentBottom:true,
                        fillRight:true,
                        height:20,
                        alignSubMenuV:'above',
                        alignSubMenuH:'rightOrLeftOf'
                    },
                    children:[
                        {
                            html:'Games',
                            children:[
                                { html:'Console games',
                                    children:['XBox 360',
                                        {
                                            html:'Wii U',
                                            children:['NintendoLand', 'Batman Arkham City', 'SuperMario Wii U']
                                        }, 'PlayStation']},
                                'PC Games',
                                'Mac Games',
                                'Mobile games'
                            ]
                        },
                        'Apps',
                        'Utilities'
                    ]
                }
            ]

        })
        ;
</script>
</body>
</html>