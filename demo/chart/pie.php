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
<script type="text/javascript" src="../../src/canvas/group.js"></script>
<script type="text/javascript" src="../../src/canvas/rect.js"></script>
<script type="text/javascript" src="../../src/canvas/path.js"></script>
<script type="text/javascript" src="../../src/canvas/engine.js"></script>
<script type="text/javascript" src="../../src/canvas/effect.js"></script>
<script type="text/javascript" src="../../src/canvas/group.js"></script>
<script type="text/javascript" src="../../src/canvas/curtain.js"></script>
<script type="text/javascript" src="../../src/canvas/animation.js"></script>
<script type="text/javascript" src="../../src/canvas/event-manager.js"></script>

<script type="text/javascript" src="../../src/data-source/collection.js"></script>
<script type="text/javascript" src="../../src/chart/add-on.js"></script>
<script type="text/javascript" src="../../src/chart/data-provider.js"></script>
<script type="text/javascript" src="../../src/chart/chart.js"></script>
<script type="text/javascript" src="../../src/chart/base.js"></script>
<script type="text/javascript" src="../../src/chart/pie.js"></script>
<script type="text/javascript" src="../../src/chart/fragment.js"></script>
<script type="text/javascript" src="../../src/chart/pie-slice.js"></script>
<script type="text/javascript" src="../../src/chart/labels.js"></script>
<script type="text/javascript" src="../../src/chart/label.js"></script>
<script type="text/javascript" src="../../src/chart/record.js"></script>
<script type="text/javascript" src="../../src/chart/pie-slice-highlighted.js"></script>

<script type="text/javascript" src="../../src/layout/factory.js"></script>
<script type="text/javascript" src="../../src/layout/relative.js"></script>
<script type="text/javascript" src="../../src/layout/canvas.js"></script>

<script type="text/javascript" src="../../src/layout/canvas.js"></script>
<script type="text/javascript" class="source-code">

    var provider = new ludo.chart.DataProvider({
        data:[
            { label:'John', value:100 },
            { label:'Jane', value:245 },
            { label:'Martin', value:37 },
            { label:'Mary', value:99 },
            { label:'Johnny', value:127 },
            { label:'Catherine', value:55 },
            { label:'Tommy', value:18 }
        ]
    });

    var w = new ludo.Window({
        title:'Pie chart - development playground',
        layout:{
            width:700,
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
                        name : 'form',
                        layout:{
                            alignParentRight:true,
                            width:200,
                            fillDown:true,
                            type:'linear',
                            orientation:'vertical'
                        },
                        form:{
                            listeners:{
                                'change': function(manager){
                                    var data = provider.getData();
                                    var values = manager.getValues();
                                    var i = 0;
                                    var records = provider.getRecords();

                                    for(var key in values){
                                        if(values.hasOwnProperty(key)){
                                            records[i].setValue(parseInt(values[key]));
                                        }
                                        i++;
                                    }

                                }
                            }
                        },
                        children:[
                            { type:'form.Text', minValue:5, required:true, name:'item0', label:'John', value:100, color:'#000088' },
                            { type:'form.Text', minValue:5, required:true, label:'Jane', value:245 },
                            { type:'form.Text', minValue:5, required:true, label:'Martin', value:37 },
                            { type:'form.Text', minValue:5, required:true, label:'Mary', value:99 },
                            { type:'form.Text', minValue:5, required:true, label:'Johnny', value:127 },
                            { type:'form.Text', minValue:5, required:true, label:'Catherine', value:55 },
                            { type:'form.Text', minValue:5, required:true,  label:'Tommy', value:18 }
                        ]
                    },
                    {

                        layout:{
                            top:0,
                            fillLeft:true,
                            fillDown:true,
                            leftOf:'form'
                        },
                        css:{
                            'border-right' : '1px solid #d7d7d7'
                        },
                        type:'chart.Chart',
                        id:'chart',
                        dataProvider:provider,
                        children:[
                            {
                                name : 'pie',
                                type:'chart.Pie',
                                id:'pie',
                                highlightSize:7,
                                animate:true,
                                layout:{
                                    above:'labels',
                                    left:0,
                                    fillRight:true,
                                    fillUp:true
                                },
                                addOns:[
                                    {
                                        type:'chart.PieSliceHighlighted',
                                        styles:{
                                            fill : '#abc'
                                        },
                                        size:5
                                    }
                                ]
                            },
                            {
                                name:'labels',
                                id:'labels',
                                type:'chart.Labels',
                                layout:{
                                    alignParentBottom:true,
                                    height:40,
                                    left:0,
                                    fillRight:true
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