<?php
$sub = true;
$pageTitle = 'Docking Layout';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/base.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/renderer.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear-horizontal.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear-vertical.js"></script>
<style type="text/css">
    a{
        color:#600;
    }
</style>
<script type="text/javascript" class="source-code">
    var w = new ludo.Window({
        title:'Docking layout',
        id:'dockingWindow',
        layout:{
            left:50, top:50,
            width:700, height:600,
            type:'linear',
            orientation:'horizontal'
        },
        children:[ // Children for the docking layout view listed below
            {
                id:'dockingLayoutView',
                layout:{
                    type:'docking', // Render children in an docking layout
                    width:200, // initial width
                    resizable:true,  // width can be adjusted by dragging
                    tabs:'left'// Position tabs to the left
                },
                children:[
                    {
                        type:'tree.Tree',
                        id:'tree',
                        title: 'Project',// Title for the docking
                        dataSource:{
                            url:'../resources/tree-data-source.php',
                            requestId:'getTree',
                            dataHandler:function(json){
                                return json.response;
                            },
                            'id' : 'myDataSource'
                        },
                        css:{
                            padding:5,
                            'font-size' : '1.1em'
                        },
                        layout:{

                        }

                    },
                    {
                        id:'methods',
                        title: 'Methods', // Title for the docking
                        html:'Second view',
                        css:{ // CSS styling for the view
                            padding:5,
                            'font-size' : '1.1em',
                            'overflow-y': 'auto'
                        }
                    }
                ]
            },
            {
                id:'sourcecode',
                type:'SourceCodePreview',
                css:{
                    padding:5
                },
                layout:{
                    weight:1
                }
            }
        ]
    });
</script>
</body>
</html>