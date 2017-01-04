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
                            'font-size' : '1.1em',
                            'border-right':'1px solid ' + ludo.$C('border')

                        }

                    },
                    {
                        id:'methods',
                        title: 'Methods', // Title for the docking
                        html:'Second view',
                        css:{ // CSS styling for the view
                            padding:5,
                            'font-size' : '1.1em',
                            'overflow-y': 'auto',
                            'border-right':'1px solid ' + ludo.$C('border')
                        }
                    }
                ]
            },
            {
                css:{
                    'border-left':'1px solid ' + ludo.$C('border')
                },
                layout:{
                    type:'tabs',
                    tabs:'top',
                    weight:1
                },
                children:[
                    {
                        'title': 'Docking Layout',
                        css:{
                            padding:5
                        },
                        html:'<h4>You can see an example of the docking layout to the left</h4>' +
                        '<p>Click on one of the tabs(Project, Methods) to see it in action</p>' +
                        '<p>This demo is a combination of docking layout and tab layout.</p>'
                    },
                    {
                        title:'Source Code',
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
            }

        ]
    });
</script>
</body>
</html>