<?php
$sub = true;
$pageTitle = 'Pie Chart - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">
    

    var dataSource = new ludo.chart.DataSource({
        url : '../data/pie-chart-data.json',
        textOf:function(record, caller){
            if(caller == undefined)console.trace();
            if(caller && caller.type == 'chart.Tooltip'){
                return record.label + ': '+ record.value  + ' (' + record.__percent + '%)';
            }
            return record.label;
        },

        valueOf:function(record, caller){
            return record.value;
        }

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
                            width:'matchParent',
                            height:'matchParent'
                        },
                        type:'chart.Chart',
                        id:'chart',
                        dataSource:dataSource,
                        children:[
                            {
                                name : 'pie',
                                type:'chart.Pie',
                                id:'pie',
                                highlightSize:7,

                                animate:true,
                                layout:{
                                    leftOf:'labels',
                                    fillLeft:true,
                                    height:'matchParent'
                                },
                                plugins:[
                                    {
                                        type:'chart.PieSliceHighlighted',
                                        size:5
                                    },
                                    {
                                        type:'chart.Tooltip',
                                        tpl:'<p><b>{label}</b> : {percent}%<br>{value} of {sum}',
                                        textStyles:{
                                            'font-size':'12px'
                                        }
                                    }
                                ]
                            },
                            {
                                name:'labels',
                                id:'labels',
                                type:'chart.Labels',
                                textStyles:{
                                    'fill': ludo.$C('text'),
                                    'font-size':'14px',
                                    'font-weight' : 'normal'
                                },
                                layout:{
                                    alignParentRight:true,
                                    width:120,
                                    height:'matchParent'
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