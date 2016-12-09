<?php
$sub = true;
$pageTitle = 'Stacked Bar Chart - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">


    var dataSource = new ludo.chart.DataSource({
        url : '../data/bar-chart-data-nested.json',

        // Return text label for chart data.
        textOf:function(record, caller){
            if(caller.type == 'chart.LabelListItem'){
                return record.name + ' yr';
            }
            return record.country;
        },

        // Return chart value for chart data. The data source doesn't know our data, so
        // this tells the data source where to get the value.
        valueOf:function(record){
            return record.people != undefined ? record.people : undefined;
        },

        /** Return texts for chart Text views chart.Text */
        getText:function(caller){
            switch(caller.id){
                case 'labelsLeft': return "People";
                case "labelsTop": return "Male Population"
            }
            return "";
        },

        max:function(){ // Function returning max value for the y axis of the bar chart
            return this.maxValAggr + 40000 - (this.maxValAggr % 20000);
        },

        min:function(){ // Function returning min value for the y axis
            return 0;
        },

        valueForDisplay:function(value, caller){
            if(caller.type == 'chart.BarValues')return Math.round(value / 1000) + " mill";
            return value;
        },

        colorOf:function(record){ // Return color codes for the chart items.
            if(record.name == '0-14')return '#E64A19';
            if(record.name == '15-64')return '#039BE5';
            if(record.name == '65-')return '#43A047';
            return '#F00';
        },

        // Function returning increments for lines and labels
        increments:function(minVal, maxVal, caller){
            return 20000;
        }


    });
    var d = new Date();
    var w = new ludo.Window({
        title:'Bar chart',
        layout:{
            minWidth:500,minHeight:400,
            width:700,
            height:500,
            left:20,
            top:20,
            type:'tab'
        },
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
                                    'font-size' : '24px'
                                },
                                anchor:[0.5, 0.5],
                                layout: {
                                    width: 60,
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
                                type:'chart.BarValues',
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
                                type:'chart.BarLabels',
                                layout:{
                                    alignParentBottom:true,
                                    rightOf:'barValues',
                                    fillRight:true,
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
                                type:'chart.Bar',
                                stacked:true,
                                animate:true,
                                orientation:'horizontal',
                                bgColor:'#424242',
                                barSize:0.7, // Fraction bar width
                                layout:{
                                    rightOf:'barValues',
                                    fillRight:true,
                                    below:'labelsTop',
                                    above:'barLabels'
                                },
                                lines:{
                                    stroke: '#535353'
                                },
                                outline:{
                                    'left': {
                                        stroke: '#aeb0b0',
                                        fill:'none'

                                    },
                                    'bottom':{
                                        stroke: '#aeb0b0'
                                    },
                                    'top':{
                                        stroke: '#535353'
                                    },
                                    'right':{
                                        stroke: '#535353'
                                    }
                                },
                                plugins:[

                                ]
                            },

                            {
                                type:'chart.LabelList',
                                layout:{
                                    alignParentRight:true,
                                    width:200,
                                    below:'labelsTop',
                                    height:30,
                                    offsetX: 10, offsetY: 10
                                },
                                textStyles:{
                                    fill:'#aeb0b0',
                                    'font-size' : '11px'
                                }
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