<?php
$sub = false;
$pageTitle = 'Searchable list';
require_once("includes/demo-header.php");
?>

<body>
<script type="text/javascript" src="../src/tpl/parser.js"></script>
<script type="text/javascript" src="../src/list.js"></script>
<script type="text/javascript" src="../src/data-source/collection.js"></script>
<style type="text/css">
    .ludo-list-item{
        border:1px solid #fff;
        margin:3px;
        margin-bottom:5px;
        padding:3px;
    }
    div.ludo-list-item-highlighted{
        background-color:#f9f9f9;
        border:1px solid #d7d7d7;
    }
    div.ludo-list-item-selected{
        background-color:#f2f2f2;
        border:1px solid #d7d7d7;
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

var dataSource = new ludo.dataSource.Collection({
    url:'resources/grid-data.json',
    id:'myDataSource',
    shim:{
        txt : 'Loading content. Please wait'
    },
    paging:{
        size:7,
        remotePaging:false,
        cache:false,
        cacheTimeout:1000
    },
    searchConfig:{
        index:['capital', 'country'],
        delay:.5
    },
    listeners:{
        count:function (countRecords) {
            ludo.get('gridWindowSearchable').setTitle('List - capital and population (' + countRecords + ' records)');
        }
    }
});

var w = new ludo.Window({
    id:'gridWindowSearchable',

    title:'List - capital and population',

    layout:{
        left:20, top:20,
        width:790, height:430,
        type:'tab'
    },

    titleBar:{
        buttons: [{
            type : 'reload',
            title : 'Reload grid data'
        },'minimize','close'],
        listeners:{
            'reload' : function(){
                ludo.get('myDataSource').load();
            }
        }
    },
    css:{
        'border-bottom':0,
        'border-top' : 0
    },
    children:[
        {
            title : 'List demo',
            layout:{
                type:'linear',
                orientation:'horizontal'
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
                            id:'myList',
                            type:'List',
                            tpl: '<div><strong>Country</strong> : {country} <br><strong>Capital</strong>: {capital}</div> ',
                            weight:1,
                            css:{
                                'background-color' : '#fff',
                                'overflow-y' : 'auto'
                            },
                            containerCss:{
                                'border':0,
                                'border-right':'1px solid #d7d7d7',
                                'border-top':'1px solid #d7d7d7',
                                'border-bottom':'1px solid #d7d7d7'
                            },
                            stateful:false,
                            resizable:false,

                            dataSource:'myDataSource'

                        }
                    ]
                }
            ]
        },
        {
            type : 'SourceCodePreview'
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