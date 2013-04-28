<?php
$sub = true;
$pageTitle = 'Tab layout';
require_once("../includes/demo-header.php");
?>
<body>
<script type="text/javascript" class="source-code">

    var w = new ludo.Window({
        left:50, top:50,
        title:'Tab layout',
        width:500, height:400,
        layout:{
            type:'tab',
            tabs:'top'
        },
        css:{
            'border-top' : 0
        },
        children:[
            {
                id:'firstTab',
                title:'Tab One',
                html:'Content of child one',
                css:{
                    'background-color':'#FFF',
                    padding:3
                }
            },
            {
                title:'YouTube video',
                type:'video.YouTube',
                movieId:'6UJZBLABGsI',
                html:'Content of child two'
            },
            {
                title:'Calendar',
                type:'calendar.Calendar',
                minDate:'1971-01-01', date:'2012-03-01',
                layout:{
                    visible:true
                }
            },
            {
                title:'Tab Three',
                html:'Content of child three',
                css:{
                    'background-color':'#FFF',
                    padding:3
                },
                layout:{
                    closable:true
                }
            },
            {
                title:'Grid',
                layout:{
                    type:'linear',
                    orientation:'vertical'
                },
                children:[
                    {
                        id:'myGrid',
                        title:'Grid',
                        type:'grid.Grid',
                        layout:{
                            weight:1
                        },
                        stateful:false,
                        columnManager:{
                            id:'colManager',
                            fill:true,
                            columns:{
                                info:{
                                    heading:'Country and Capital',
                                    headerAlign:'center',
                                    columns:{
                                        'country':{
                                            heading:'Country',
                                            removable:false,
                                            sortable:true,
                                            movable:true,
                                            width:200,
                                            renderer:function (val) {
                                                return '<span style="color:blue">' + val + '</span>';
                                            }
                                        },
                                        'capital':{
                                            heading:'Capital',
                                            sortable:true,
                                            removable:true,
                                            movable:true,
                                            width:150
                                        }
                                    }
                                },
                                population:{
                                    heading:'Population',
                                    movable:true,
                                    removable:true
                                }
                            }
                        },
                        dataSource:{
                            url:'../resources/grid-data.json',
                            id:'myDataSource',
                            paging:{
                                size:12,
                                pageQuery:false,
                                cache:false,
                                cacheTimeout:1000
                            },
                            searchConfig:{
                                index:['capital', 'country'],
                                delay:.5
                            }
                        }

                    },
                    {
                        type:'paging.NavBar',
                        height:30,
                        weight:0,
                        dataSource:'myDataSource',
                        containerCss:{
                            'border-top':'1px solid #CCC',
                            'padding-top':2
                        }
                    }
                ]
            }
        ],
        buttonBar:[
            { type:'form.Button', value:'OK' }
        ]
    });
    new ludo.Window({
        title:'Nested tab layouts',
        left:100, top:100, width:500, height:500,
        layout:{
            type:'tab',
            tabs:'right'
        },
        children:[
            {
                title:'Child A', html:'Content of child A', css:{'background-color':'#FFF'}, layout:{ closable: true }
            },
            { title:'Calendar', type:'calendar.Calendar', name:'title', minDate:'1971-01-01', date:'2012-03-01' },
            {
                type:'SourceCodePreview', layout: { 'closable' : false }
            },
            {
                title:'Child C', html:'Content of child C', css:{'background-color':'#FFF'}
            },
            {
                title:'Child D (Tabs bottom)', css:{'background-color':'#FFF'},
                layout:{
                    type:'tab',
                    tabs:'bottom'
                },
                children:[
                    { title:'Sub 1', html:'Sub', css:{'background-color':'#FFF'}, layout:{closable:true}},
                    { title:'Sub 2', html:'Content of sub 2', css:{'background-color':'#FFF'} },
                    { title:'Sub 3', html:'Content of sub 3', css:{'background-color':'#FFF'} }
                ]
            },
            {
                title:'Child E with tabs', css:{'background-color':'#FFF'},
                layout:{
                    type:'tab',
                    tabs:'left'
                },
                children:[
                    { title:'Sub 1', html:'Sub 1', css:{'background-color':'#FFF'} },
                    { title:'Sub 2', html:'Content', css:{'background-color':'#FFF'}, layout:{closable:true} },

                    { title:'Sub 3', html:'Third and last tab', css:{'background-color':'#FFF'} }

                ]
            }

        ]
    });
</script>
</body>
</html>