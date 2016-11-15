<?php
$sub = true;
$pageTitle = 'Grid demo with paging';
require_once("../includes/demo-header.php");
?>
<script type="text/javascript" src="../../src/grid/grid-header.js"></script>

<style type="text/css">
    .input-cell input {
        height: 15px;
    }
</style>

<script type="text/javascript" class="source-code">
    var w = new ludo.Window({
        left:250, top:50,
        title:'Grid - capital and population',
        width:500, height:370,
        layout:'fill',
        children:[
            {
                type:'grid.Grid',
                weight:1,
                resizable:false,
                columnManager:{
                    columns:{
                        'country':{
                            heading:'Country',
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
                            movable:true,
                            width:150
                        },
                        population:{
                            heading:'Population',
                            movable:true
                        }
                    }
                },
                dataSource:{
                    resource:'GridWithPaging',
                    service:'read',
                    id:'myDataSource',
                    shim:{
                        'txt' : 'Loading grid data'
                    },
                    paging:{
                        size:12,
                        remotePaging:true,
                        cache:true,
                        cacheTimeout:1000
                    },
                    listeners:{
                        select:function (record) {

                        }
                    }
                }

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
</script>
</body>
</html>