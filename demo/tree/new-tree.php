<?php
$sub = true;
$pageTitle = 'Tree/Filter demo';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/search-field.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/search-parser.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/collection.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/collection-search.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/tree-collection-search.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/tree-collection.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/tree/tree.js"></script>
<style type="text/css">
    span.ludo-tree-node-spacer{
        background-image: url('../../images/tree/tree-dots-2.gif');
        background-repeat:repeat-x;
        background-position: left bottom;
        position:absolute;
        left:0;
        top:0;
        width:8px;
        height:9px;
    }
</style>
<script type="text/javascript" class="source-code">
    function newSubFolder() {

    }
    var ds = new ludo.dataSource.TreeCollection(
        {
            url:'../resources/tree-data-source.php',
            requestId:'getTree',
            'id' : 'myDataSource',
            dataHandler:function(json){
                return json.response;
            }
        });

    var w = new ludo.Window({
        title:'Tree demo - Random countries and cities (20000 nodes)',
        layout:{
            type:'linear',
            orientation:'vertical',
            width:500, height:370,
            x:250,y:50
        },
        children:[
            {
                layout:{
                    type:'linear',
                    orientation:'horizontal',
                    height:25
                },
                css:{
                    'padding-left' :2
                },
                children:[
                    {
                        type:'form.Label',
                        label:'Search',
                        labelFor:'searchField',
                        layout:{
                            height:'matchParent',
                            width:50
                        }
                    },
                    {
                        id:'searchField',
                        type:'form.SearchField',
                        searchIn:ds,
                        layout:{
                            'height': 25,
                            weight:1
                        }
                    }
                ]

            },
            {
                type:'tree.Tree',
                layout:{
                    weight:1
                },
                css:{

                    'padding-left' : 3
                },
                id:'myTree',
                contextMenu:[
                    {
                        recordType:'country',
                        children:[
                            { label:'Add city', action:'addcity' },
                            { label:'Delete country', action:'remove'},
                            { label:'Rename country', action:'rename'}
                        ],
                        listeners:{
                            click:function (menuItem, menu) {
                                var selectedRecord = menu.getSelectedRecord();
                                var tree = ludo.get('myTree');
                                switch (menuItem.action) {
                                    case 'remove':
                                        tree.removeRecord(selectedRecord);
                                        break;
                                    case 'addcity':
                                        new ludo.dialog.Prompt({
                                            width:400,
                                            height:100,
                                            label:'Name of city',
                                            listeners:{
                                                'ok':function (nameOfCity) {
                                                    tree.addChild({ title:nameOfCity, type:'city'}, selectedRecord);
                                                }
                                            }
                                        });
                                        break;
                                    case 'rename':
                                        new ludo.dialog.Prompt({
                                            width:400,
                                            height:100,
                                            value:selectedRecord.title,
                                            label:'Name of city',
                                            listeners:{
                                                'ok':function (nameOfCity) {
                                                    tree.addChild({ title:nameOfCity, type:'city'}, selectedRecord);
                                                }
                                            }
                                        });
                                        break;
                                }

                            }
                        }
                    }
                ],
                dd:{
                    drag:true,
                    drop:true
                },
                dataSource:ds,

                recordConfig:{
                    'country':{
                        dd:{
                            drag:true,
                            drop:true
                        }
                    },
                    'city':{
                        dd:{
                            drag:true,
                            drop:true
                        }
                    },
                    'letter':{
                        dd:{
                            drag:true,
                            drop:true
                        }
                    }
                }

            }
        ],
        buttonBar:[
            {
                type:'form.SubmitButton', value:'Submit'
            },
            {
                type:'form.CancelButton', value:'Cancel'
            }
        ]
    });
</script>
</body>
</html>