<?php
$sub = true;
$pageTitle = 'Searchable grid';
require_once("../includes/demo-header.php");
?>

<body>
<style type="text/css">
    .ludo-grid-movable-shim {
        border: 1px solid #000;
        border-radius: 2px;
    }

    .input-cell input {
        height: 15px;
    }
    .ludo-grid-resize-handle{
        background-color:transparent;
    }
    .ludo-loader-shim{
        position:absolute;
        width:100%;
        height:100%;
        background-color:#EEE;
        opacity:.3;
        filter:alpha(opacity=30);
        left:0;top:0;
        z-index:50;
    }
</style>
<script type="text/javascript" class="source-code skip-copy">

var d = new Date();
var w = new ludo.Window({
    id:'gridWindowSearchable',
    left:50, top:50,
    title:'Grid - capital and population - Stateful',

    layout:{
        width:790, height:390,
        type:'linear',
        orientation:'horizontal'
    },
    stateful:true,
    css:{
        'border-bottom':0
    },
    children:[
        {
            layout:{
                type:'linear',
                orientation:'vertical',
                weight:1
            },
            children:[
                {
                    height:27,
                    labelWidth:50,
                    type:'form.Text',
                    label:'Search',

                    listeners:{
                        key:function (value) {
                            ludo.get('myDataSource').search(value);
                        }
                    }
                },
                {
                    id:'myGrid',
                    type:'grid.Grid',
                    weight:1,
                    containerCss:{
                        'border':0,
                        'border-right':'1px solid #C0C0C0',
                        'border-top':'1px solid #C0C0C0',
                        'border-bottom':'1px solid #C0C0C0'
                    },
                    stateful:false,
                    resizable:false,
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
                        shim:{
                            txt : 'Loading content. Please wait'
                        },
                        paging:{
                            size:12,
                            pageQuery:false,
                            cache:false,
                            cacheTimeout:1000
                        },
                        searchConfig:{
                            index:['capital', 'country'],
                            delay:.5
                        },
                        listeners:{
                            select:function (record) {
                                ludo.get('myModel').setUid(record.uid);
                                ludo.get('myModel').setId(record.id);
                                ludo.get('myModel').setCountry(record.country);
                                ludo.get('myModel').setCapital(record.capital);
                                ludo.get('myModel').setPopulation(record.population);
                            },
                            count:function (countRecords) {
                                ludo.get('gridWindowSearchable').setTitle('Grid - capital and population - Stateful (' + countRecords + ' records)');
                            }
                        }
                    }

                }
            ]
        },
        {

            id:'infoPanel',
            stateful:true,
            layout:{
                width:250,
                resizable:true,
                minWidth:150,
                type:'linear',
                orientation:'vertical'
            },

            type:'FramedView',
            title:'Edit record',
            containerCss:{
                'border':0,
                'border-left':'1px solid #C0C0C0',
                'border-bottom':'1px solid #C0C0C0'
            },
            model:{
                id:'myModel',
                columns:['uid','id', 'country', 'capital', 'population'],
                listeners:{
                    'update':function (record) {
                        if (record.id) {
                            ludo.get('myDataSource').updateRecord(record, record);
                        }
                    }
                }
            },
            children:[
                {
                    label:'Country',
                    type:'form.Text',
                    name:'country'
                },
                {
                    label:'Capital',
                    type:'form.Text',
                    name:'capital'
                },
                {
                    label:'Population',
                    type:'form.Text',
                    name:'population'
                }

            ]
        }


    ],
    buttonBar:{

        height:28,
        align:'left',
        children:[
            {
                type:'paging.First',
                dataSource:'myDataSource'
            },
            {
                type:'paging.Previous',
                dataSource:'myDataSource'
            },
            {
                type:'paging.PageInput',
                dataSource:'myDataSource'
            },
            {
                type:'paging.TotalPages',
                dataSource:'myDataSource'
            },
            {
                type:'paging.Next',
                dataSource:'myDataSource'
            },
            {
                type:'paging.Last',
                dataSource:'myDataSource'
            }
            /* You can also use paging.NavBar to add the children above in one go.
            {
                type:'paging.NavBar',
                dataSource:'myDataSource'
            }
             */

        ]


    }
});
console.log(new Date().getTime() - d.getTime());
</script>

</body>
</html>