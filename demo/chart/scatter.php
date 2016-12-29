<?php
$sub = true;
$pageTitle = 'Scatter Chart - ludoJS';
$skin = 'light-gray';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">

    // Static month array

    // creating random data
    var data = [
        {
            "__color": "#1976D2AA",
            "name":"first series",
            "children":[]
        },
        {
            "__color": "#689F38AA",
            "name":"Second series",
            "children":[]
        },
        {
            "__color": "#FFA000AA",
            "name":"Third series",
            "children":[]
        }

    ];

    for(var j=0;j<3;j++){
        for(var i=10;i<125;i++){

            var x = 10 + Math.round(Math.random() * 185);
            var y = 10 + Math.round(Math.random() * 235);

            data[j].children.push([Math.round(x),Math.round(y)]);
        }
    }




    var dataSource = new ludo.chart.ScatterDataSource({
        data:data,
        childKey:'children',
        // Return text label for chart data.
        textOf:function(record, caller){
            if(caller.type == 'chart.Tooltip'){
                return '<p><b>{parent.name}</b><br>XY: {record.x}, {record.y}</p>';
            }
            if(caller.type == 'chart.LabelListItem'){
                return record.city;
            }
            return record.month;
        },

        shouldInheritColor:function(record, caller){
            return true
        },

        max:function(caller){ // Function returning max value for the y axis of the line chart
            console.log(caller);
            return this.maxX()
        },

        min:function(){ // Function returning min value for the y axis
            return 0
        },

        valueForDisplay:function(value, caller){
            return value;
        },
        // Function returning increments for lines and labels
        increments:function(minVal, maxVal, caller){
            return 20;
        },

        strokeOf:function(){
            return '#424242';
        },

        minX: function(){
            return 0;
        },

        minY:function(){
            return 0;
        },

        maxY:function(){
            return 250;
        },

        maxX:function(){

            return 200;
        }


    });
    var d = new Date();
    var w = new ludo.FramedView({
        title:'Scatter Chart',
        layout:{
            width:'matchParent',height:'matchParent',
            type:'tab',
            tabs:'left'
        },
        renderTo:document.body,
        children:[
            {
                title:'Chart',
                layout:{
                    type:'relative'
                },
                css:{
                    'padding-right' : 10
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
                                id:'labelsLeft',
                                text:'Y axis',
                                type:'chart.Text',
                                styling:{
                                    fill : ludo.$C('text'),
                                    'font-size' : '18px'
                                },
                                anchor:[0.5, 0.5],
                                layout: {
                                    width: 50,
                                    bottom:50,
                                    fillUp:true,
                                    alignParentLeft: true
                                },
                                rotate:'left'
                            },
                            {
                                id:'labelsTop',
                                type:'chart.Text',
                                text:'Scatter Chart Example',
                                anchor:[0.5,0.5],
                                styling:{
                                    'fill': ludo.$C('text'),
                                    'font-size' : '20px'
                                },
                                layout:{
                                    rightOf:'labelsLeft',
                                    leftOf:'labelsRight',
                                    alignParentTop:true,
                                    height:50,
                                    alignParentLeft:true
                                }
                            },
                            {
                                id:'yAxisLabels',
                                orientation:'vertical',
                                type:'chart.ChartValues',
                                layout:{
                                    rightOf:'labelsLeft',
                                    below:'labelsTop',
                                    bottom:30,
                                    width:50
                                },
                                padding:4,
                                styling:{
                                    'fill': ludo.$C('text'),
                                    'font-size' : '12px'
                                }
                            },
                            {
                                type:'chart.Ticks',
                                id:'yTicks',
                                axis:'y',
                                vAlign:'right',
                                layout:{
                                    rightOf:'yAxisLabels',
                                    below:'labelsTop',
                                    bottom:40,
                                    width:10
                                },
                                styles:{
                                    stroke: '#666',
                                    'stroke-width': 1
                                }

                            },

                            {
                                id:'xAxisLabels',
                                type:'chart.ChartValues',
                                
                                // Static labels instead of getting them from the data source.
                                layout:{
                                    alignParentBottom:true,
                                    rightOf:'yTicks',
                                    fillRight:true,
                                    height:30
                                },
                                styling:{
                                    'fill': ludo.$C('text'),
                                    'font-size' : '12px'
                                },
                                data:['Bad','Good']
                            },
                            {
                                type:'chart.Ticks',
                                id:'xTicks',
                                axis:'x',
                                vAlign:'top',
                                layout:{
                                    above:'xAxisLabels',
                                    rightOf:'yTicks',
                                    fillRight:true,
                                    height:10
                                },
                                styles:{
                                    stroke: '#666',
                                    'stroke-width': 1
                                }

                            },
                            {
                                type:'chart.BgLines',
                                bgColor:ludo.$C('background'),
                                layout:{
                                    rightOf:'yTicks',
                                    fillRight:true,
                                    below:'labelsTop',
                                    above:'xTicks'
                                },

                                y:{
                                    stroke: '#535353'
                                }
                            },
                            {
                                name : 'bar',
                                id:'bar',
                                type:'chart.Scatter',
                                showDots:true,
                                animate:true,
                                orientation:'horizontal',
                                revealAnim:true,
                                layout:{
                                    rightOf:'yTicks',
                                    fillRight:true,
                                    below:'labelsTop',
                                    above:'xTicks'
                                },
                                lineStyles:{
                                    'stroke-width' : 2
                                },

                                outline:{
                                    'left': {
                                        stroke: '#666',
                                        fill:'none'

                                    },
                                    'bottom':{
                                        stroke: '#666'
                                    },
                                    'top':{
                                        stroke: '#333'
                                    },
                                    'right':{
                                        stroke: '#333'
                                    }
                                },
                                plugins:[
                                    {
                                        type:'chart.Tooltip',
                                        animationDuration:100,
                                        textStyles:{
                                            'font-size':'12px',
                                            'fill': ludo.$C('text')
                                        },
                                        boxStyles:{
                                            'fill': ludo.$C('background2'),
                                            'fill-opacity': 0.9
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                type:'SourceCodePreview'
            }
        ]
    });

    console.log('time to render: ' + (new Date().getTime() - d.getTime()));
</script>
</body>
</html>