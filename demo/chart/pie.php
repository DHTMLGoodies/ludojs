<?php
$sub = true;
$pageTitle = 'Pie Chart - ludoJS';
require_once("../includes/demo-header.php");
?>
<body>
<script type="text/javascript" src="../../src/canvas/canvas.js"></script>
<script type="text/javascript" src="../../src/canvas/node.js"></script>
<script type="text/javascript" src="../../src/canvas/named-node.js"></script>
<script type="text/javascript" src="../../src/canvas/rect.js"></script>
<script type="text/javascript" src="../../src/canvas/path.js"></script>
<script type="text/javascript" src="../../src/canvas/engine.js"></script>
<script type="text/javascript" src="../../src/canvas/effect.js"></script>
<script type="text/javascript" src="../../src/canvas/event-manager.js"></script>
<script type="text/javascript" src="../../src/chart/base.js"></script>
<script type="text/javascript" src="../../src/chart/pie.js"></script>
<script type="text/javascript" src="../../src/chart/item.js"></script>
<script type="text/javascript" src="../../src/chart/tooltip.js"></script>
<script type="text/javascript" src="../../src/chart/pie-slice.js"></script>
<script type="text/javascript" src="../../src/chart/data-provider.js"></script>
<script type="text/javascript" class="source-code">

    var provider = new ludo.chart.DataProvider({


    });

    var w = new ludo.Window({
        title : 'Pie chart - development playground',
        layout:{
            width:500,
            height:400,
            left:20,
            top:20,
            type:'tab'
        },
        css:{
            'background-color' : '#fff',
            'border-top' : 0
        },
        children:[
            {
                title : 'Chart',
                type:'chart.Pie',
                animate:true,
                tooltip:{
                    css:{
                        'fill' : '#f2f2f2',
                        'stroke' : 'red'
                    }
                },
                data : [
                    { label : 'John', value : 100, color: '#000088' },
                    { label : 'Jane', value : 245 },
                    { label : 'Martin', value : 37 },
                    { label : 'Mary', value : 99 }
                ]
            },
            {
                type : 'SourceCodePreview'
            }
        ]
    });


</script>
</body>
</html>