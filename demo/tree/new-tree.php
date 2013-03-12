<?php
$sub = true;
$pageTitle = 'Tree/Filter demo';
require_once("../includes/demo-header.php");
?>
<body>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/search-field.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/search-parser.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/collection.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/collection-search.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/tree-collection-search.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/tree-collection.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/tree/new-tree.js"></script>
<link rel="stylesheet" href="<?php echo $prefix; ?>../css/ludojs-ocean.css" type="text/css">
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
    var ds = new ludo.dataSource.TreeCollection({ url:'../data-source/tree-data-source.php', requestId:'getTree','id' : 'myDataSource' });

    var w = new ludo.Window({
        title:'Tree demo - Random countries and cities (20000 nodes)',
        layout:{
            type:'rows',
            width:500, height:370,
            x:250,y:50
        },
        children:[
            {
                type:'form.SearchField',
                searchIn:ds,
                css:{
                    'border-bottom' : '1px solid #C0C0C0'
                }
            },
            {
                type:'tree.Tree',
                layout:{
                    weight:1
                },
                css:{
                    'background-color' : '#FFF',
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