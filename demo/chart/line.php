<?php
$sub = true;
$pageTitle = 'Line Chart - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">

    // Static month array
    var months = ["January","February", "March", "April","May","June","July","August","September","October","November","December"];

    var dataSource = new ludo.chart.DataSource({
        url : '../data/climate.json',
        childKey:'monthlyAvg',
        // Return text label for chart data.
        textOf:function(record, caller){
            if(caller.type == 'chart.Tooltip'){
                return '<p><b>{parent.city}</b> ({parent.country})<br>' + months[record.__index] + '<br>Low: {record.low} °C<br>High: {record.high} °C<br>Avg: '
                    + (record.low + (record.high - record.low)/ 2) + '°C</p>';
            }
            if(caller.type == 'chart.LabelListItem'){
                return record.city;
            }
            return record.month;
        },

        // Return chart value for chart data. The data source doesn't know our data, so
        // this tells the data source where to get the value.
        valueOf:function(record){
            return record.low + (record.high - record.low)/2;
        },
        
        shouldInheritColor:function(record, caller){
            return record.rainfall != undefined;
        },

        /** Return texts for chart Text views chart.Text */
        getText:function(caller){
            switch(caller.id){
                case 'labelsLeft': return "Average Temperature (°C)";
                case "labelsTop": return "City Temperature"
            }
            return "";
        },

        max:function(){ // Function returning max value for the y axis of the line chart
            return this.maxVal + 15 - (this.maxVal % 5);
        },

        min:function(){ // Function returning min value for the y axis
            return this.minVal - 5 + ((5 - this.minVal) % 5);
        },

        valueForDisplay:function(value, caller){
            if(caller.type == 'chart.ChartValues')return value + '°C'
            return value;
        },
        // Function returning increments for lines and labels
        increments:function(minVal, maxVal, caller){
            return 5;
        },

        strokeOf:function(record, caller){
            return '#424242';
        }


    });
    var d = new Date();
    var w = new ludo.FramedView({
        title:'Line Chart',
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
                                type:'chart.Text',
                                styling:{
                                    fill : '#aeb0b0',
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
                                id:'labelsRight',
                                type:'chart.LabelList',
                                layout:{
                                    alignParentRight:true,
                                    width:180,
                                    height:'matchParent'
                                },
                                textStyles:{
                                    'fill': ludo.$C('text'),
                                    'font-size':'14px',
                                    'font-weight' : 'normal'
                                }
                            },
                            {
                                id:'labelsTop',
                                type:'chart.Text',
                                anchor:[0.5,0.5],
                                styling:{
                                    'fill': '#aeb0b0',
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
                                id:'barValues',
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
                                    'fill': '#aeb0b0',
                                    'font-size' : '12px'
                                }
                            },
                            {
                                id:'barLabels',
                                type:'chart.ChartLabels',
                                // Static labels instead of getting them from the data source.
                                data:["Jan","Feb", "Mar", "Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
                                layout:{
                                    alignParentBottom:true,
                                    leftOf:'labelsRight',
                                    rightOf:'barValues',
                                    height:30
                                },
                                styling:{
                                    'fill': '#aeb0b0',
                                    'font-size' : '12px'
                                }
                            },
                            {
                                name : 'bar',
                                id:'bar',
                                type:'chart.Line',
                                showDots:true,
                                stacked:true,
                                animate:true,
                                orientation:'horizontal',
                                bgColor:'#424242',
                                layout:{
                                    rightOf:'barValues',
                                    leftOf:'labelsRight',
                                    below:'labelsTop',
                                    above:'barLabels'
                                },
                                lineStyles:{
                                    'stroke-width' : 2
                                },
                                bgLines:{
                                    stroke: '#535353'
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
                                        textStyles:{
                                            'font-size':'12px',
                                            'fill': '#aeb0b0'
                                        },
                                        boxStyles:{
                                            'fill': '#222',
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