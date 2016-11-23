<?php
$sub = true;
$pageTitle = 'Tab layout';
require_once("../includes/demo-header.php");
?>
<link rel="stylesheet" type="text/css" href="../../css-source/layout/tab-strip.css">

<script type="text/javascript" class="source-code">

    var w = new ludo.Window({
        left:50, top:50,
        title:'Tab layout',
        width:500, height:400,
        layout:{
            type:'tab',
            tabs:'top'
        },
        children:[
            {
                id:'firstTab',
                title:'Tab One',
                html:'Content of child one',
                css:{
                    padding:3
                }
            },
            {
                id:'tab2video',
                title:'YouTube video',
                type:'video.YouTube',
                movieId:'6UJZBLABGsI',
                html:'Content of child two'
            },
            {
                id:'tab3cal',
                title:'Calendar',
                type:'calendar.Calendar',
                minDate:'1971-01-01', date:'2012-03-01',
                layout:{
                    visible:true
                }
            },
            {
                id:'tab4',
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
                id:'tab5grid',
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
                                remotePaging:false,
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
                        elCss:{
                            'border-top':'1px solid #CCC',
                            'padding-top':2
                        }
                    }
                ]
            },
            {
                id:'tab6',
                title:"Tab 3",
                html:'Tab 3'
            },
            {
                id:'tab7',
                title:"Tab 4",
                html:'Tab 4'
            },
            {
                id:'tab8',
                title:"Tab 5",
                html:'Tab 5'
            },
            {
                id:'tab9',
                title:"Tab 6",
                html:'Tab 6'
            },
            {
                id:'tab10',
                title:"Tab 7",
                html:'Tab 7'

            },
            {
                id:'tab11',
                title:"Tab 8",
                html:'Tab 8'
            }
        ],
        buttonBar:[
            { type:'form.Button', value:'OK' }
        ]
    });

    /*
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
    */
</script>
</body>
</html>