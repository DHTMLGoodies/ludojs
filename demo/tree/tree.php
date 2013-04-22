<?php
$sub = true;
$pageTitle = 'Tree/Filter demo';
require_once("../includes/demo-header.php");
?>
<body>
<script type="text/javascript" class="source-code">
    function newSubFolder() {

    }
    var ds = new ludo.dataSource.JSON({ url:'../resources/tree-data-source.php', requestId:'getTree','id' : 'myDataSource' });

    var w = new ludo.Window({
        left:250, top:50,
        title:'Tree demo - Random countries and cities',
        width:500, height:370,
        layout:{
            type:'rows'
        },
        children:[
            {
                type:'tree.Tree',
                layout:{
                    weight:1
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