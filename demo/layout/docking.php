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
        children:[ // Children for the accordion listed below
            {
                id:'dockingLayoutView',
                layout:{
                    type:'docking',
                    width:200,
                    resizable:true, // Render children in an accordion
                    easing: 'swing', // easing for the animation. linear and swing are available. More can be found in jQuery plugins
                    duration: 300, // 1/2 s duration for the animations
                    tabs:'left'
                },
                children:[
                    {
                        type:'tree.Tree',
                        id:'tree',
                        title: 'Project',// Title for the accordion
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
                        title: 'Methods', // Title for the accordion
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
                title: 'Source Code',// Title for the accordion
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