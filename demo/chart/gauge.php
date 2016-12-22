<?php
$sub = true;
$pageTitle = 'Gauge - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" src="../../src/svg/canvas.js"></script>
<script type="text/javascript" src="../../src/svg/node.js"></script>
<script type="text/javascript" src="../../src/svg/named-node.js"></script>
<script type="text/javascript" src="../../src/color/color.js"></script>
<script type="text/javascript" src="../../src/svg/group.js"></script>
<script type="text/javascript" src="../../src/svg/rect.js"></script>
<script type="text/javascript" src="../../src/svg/path.js"></script>
<script type="text/javascript" src="../../src/svg/engine.js"></script>
<script type="text/javascript" src="../../src/svg/effect.js"></script>
<script type="text/javascript" src="../../src/svg/group.js"></script>
<script type="text/javascript" src="../../src/svg/curtain.js"></script>
<script type="text/javascript" src="../../src/svg/animation.js"></script>
<script type="text/javascript" src="../../src/svg/event-manager.js"></script>
<script type="text/javascript" src="../../src/svg/text-box.js"></script>

<script type="text/javascript" src="../../src/data-source/collection.js"></script>
<script type="text/javascript" src="../../src/chart/add-on.js"></script>
<script type="text/javascript" src="../../src/chart/data-provider.js"></script>
<script type="text/javascript" src="../../src/chart/chart.js"></script>
<script type="text/javascript" src="../../src/chart/base.js"></script>
<script type="text/javascript" src="../../src/chart/fragment.js"></script>
<script type="text/javascript" src="../../src/chart/gauge.js"></script>
<script type="text/javascript" src="../../src/chart/needle.js"></script>

<script type="text/javascript" src="../../src/layout/factory.js"></script>
<script type="text/javascript" src="../../src/layout/relative.js"></script>
<script type="text/javascript" src="../../src/layout/canvas.js"></script>
<script type="text/javascript" class="source-code">

    var w = new ludo.Window({
        title:'Chart demo - Gauge',
        layout:{
            width:500,
            height:500,
            left:20,
            top:20,
            type:'tab'
        },
        css:{
            'background-color':'#fff',
            'border-top':0
        },
        children:[
            {
                title:'Chart',
                layout:{
                    type:'relative'
                },
                children:[

                    {

                        layout:{
                            top:0,
                            left:0,
                            fillDown:true,
                            fillRight:true
                        },
                        type:'chart.Chart',
                        id:'chart',
                        data:[
                            { label:'CPU', value:80, min:0, max:100 }
                        ],
                        children:[
                            {
                                type:'chart.Gauge',
                                id:'gauge',
                                layout:{
                                    top:0,
                                    left:0,
                                    fillRight:true,
                                    filDown:true
                                }
                            }
                        ]
                    }
                ]
            }
            ,
            {
                type:'SourceCodePreview'
            }
        ]
    });
</script>
</body>
</html>