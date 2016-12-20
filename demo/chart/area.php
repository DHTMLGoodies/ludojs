<?php
$sub = true;
$pageTitle = 'Line Chart - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">

    var dataSource = new ludo.chart.DataSource({
        url : '../data/apple-stock.json',
        childKey:'history',
        // Return text label for chart data.
        textOf:function(record, caller){
            if(caller.type == 'chart.Tooltip'){
                return '<p><b>{parent.name}</b><br>' + record.date + '<br>Share Price: {record.price}</p>';
            }
            if(caller.type == 'chart.ChartLabels'){
                return (record.__index % 10) == 0 ? record.date.substr(0,5) : undefined;
            }
            return record.date;
        },

        // Return chart value for chart data. The data source doesn't know our data, so
        // this tells the data source where to get the value.
        valueOf:function(record){
            return record.price
        },

        shouldInheritColor:function(record, caller){
            return true;
        },

        /** Return texts for chart Text views chart.Text */
        getText:function(caller){
            switch(caller.id){
                case 'labelsLeft': return "Stock Price";
                case "labelsTop": return "Apple Inc"
            }
            return "";
        },

        max:function(){ // Function returning max value for the y axis of the line chart
            return this.maxVal + 5 - (this.maxVal % 5);
        },

        min:function(){ // Function returning min value for the y axis
            return 100
        },

        valueForDisplay:function(value){
            return value;
        },
        // Function returning increments for lines and labels
        increments:function(){
            return 5;
        },

        sortFn:function(record){
            if(record.name != undefined){
                return function(a, b){
                    return a.__index < b.__index ? 1 : -1;
                }
            }
        },

        dataFor:function(caller, data){
            return caller.type == 'chart.ChartLabels' ? data[0].getChildren() :  data;
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
                                id:'labelsTop',
                                type:'chart.Text',
                                anchor:[0.5,0.5],
                                styling:{
                                    'fill': '#aeb0b0',
                                    'font-size' : '20px'
                                },
                                layout:{
                                    rightOf:'labelsLeft',
                                    fillRight:true,
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
                                layout:{
                                    alignParentBottom:true,
                                    fillRight:true,
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
                                type:'chart.Area',
                                animate:true,
                                orientation:'horizontal',
                                bgColor:'#424242',
                                layout:{
                                    rightOf:'barValues',
                                    fillRight:true,
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
                                        animationDuration:2, // too many points, so really low duration
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