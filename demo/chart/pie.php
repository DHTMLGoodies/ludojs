<?php
$sub = true;
$pageTitle = 'Pie Chart - ludoJS';
require_once("../includes/demo-header.php");
?>
<body>
<script type="text/javascript" src="../../src/canvas/canvas.js"></script>
<script type="text/javascript" src="../../src/canvas/node.js"></script>
<script type="text/javascript" src="../../src/canvas/named-node.js"></script>
<script type="text/javascript" src="../../src/color/color.js"></script>
<script type="text/javascript" src="../../src/chart/group.js"></script>
<script type="text/javascript" src="../../src/canvas/rect.js"></script>
<script type="text/javascript" src="../../src/canvas/path.js"></script>
<script type="text/javascript" src="../../src/canvas/engine.js"></script>
<script type="text/javascript" src="../../src/canvas/effect.js"></script>
<script type="text/javascript" src="../../src/canvas/event-manager.js"></script>

<script type="text/javascript" src="../../src/chart/data-provider.js"></script>
<script type="text/javascript" src="../../src/chart/chart.js"></script>
<script type="text/javascript" src="../../src/chart/group.js"></script>
<script type="text/javascript" src="../../src/chart/chart-base.js"></script>
<script type="text/javascript" src="../../src/chart/pie.js"></script>
<script type="text/javascript" src="../../src/chart/item.js"></script>
<script type="text/javascript" src="../../src/chart/tooltip.js"></script>
<script type="text/javascript" src="../../src/chart/pie-slice.js"></script>
<script type="text/javascript" src="../../src/layout/factory.js"></script>
<script type="text/javascript" src="../../src/layout/relative.js"></script>
<script type="text/javascript" src="../../src/layout/canvas.js"></script>

<script type="text/javascript" src="../../src/layout/canvas.js"></script>
<script type="text/javascript" class="source-code">

    var w = new ludo.Window({
        title:'Pie chart - development playground',
        layout:{
            width:500,
            height:400,
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
                type:'chart.Chart',

                data:[
                    { label:'John', value:100, color:'#000088' },
                    { label:'Jane', value:245 },
                    { label:'Martin', value:37 },
                    { label:'Mary', value:99 },
                    { label:'Johnny', value:127 },
                    { label:'Catherine', value:55 },
                    { label:'Tommy', value:18 }
                ],
                children:[
                    {
                        name : 'pie',
                        type:'chart.Pie',
                        animate:true,
                        layout:{
                            leftOf:'labels',
                            fillLeft:true,
                            top:0,
                            fillDown:true
                        },
                        tooltip:{
                            css:{
                                'fill':'#fff',
                                'stroke':'#c6c6c6',
                                'fill-opacity':.9
                            }
                        }
                    },
                    {
                        name:'labels',
                        id:'labels',
                        type:'chart.Group',
                        containerCss:{
                            'fill' : '#f00',
                            'stroke-width' : '1',
                            'stroke' : '#0f0'
                        },
                        layout:{
                            width:100,
                            alignParentTop:true,
                            alignParentRight:true,
                            fillDown:true
                        }
                    }
                ]
            },
            {
                type:'SourceCodePreview'
            }
        ]
    });

    var paintTwo = new ludo.canvas.Paint({
        'fill':'orange',
        'stroke':'#D90000',
        'stroke-width':'5',
        'opacity':.8,
        cursor:'pointer'

    });
    /*
    ludo.get('labels').adopt(paintTwo);
    var circle = new ludo.canvas.Circle({cx:50, cy:50, r:45, "class": paintTwo});
    ludo.get('labels').adopt(circle);
    */
</script>
</body>
</html>