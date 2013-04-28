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
<script type="text/javascript">

    var provider = new ludo.chart.DataProvider({


    });

    var w = new ludo.Window({
        title : 'Pie chart - development playground',
        layout:{
            width:500,
            height:400,
            left:20,
            top:20
        },
        css:{
            'background-color' : '#fff'
        },
        children:[
            {
                type:'chart.Pie',
                tooltip:{
                    css:{
                        'fill' : '#f2f2f2',
                        'stroke' : 'red'
                    }
                },
                data : [
                    { label : 'Katrine', value : 100, color: '#000088' },
                    { label : 'Alf Magne', value : 245 },
                    { label : 'Frode', value : 37 },
                    { label : 'Birgitte', value : 99 }
                ]
            }
        ]
    });


</script>
</body>
</html>