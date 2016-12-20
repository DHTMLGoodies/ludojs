<?php
$sub = true;
$pageTitle = 'Area Chart - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">

    var dataSource = new ludo.chart.DataSource({
        id:'dataSource',
        url : '../data/world-population.json',
        childKey:'period',
        // Return text label for chart data.
        textOf:function(record, caller){
            if(caller.type == 'chart.Tooltip'){
                return '<p><b>{parent.region}</b><br>Year: ' + record.year + '<br>Population: {record.population} million</p>';
            }
            if(caller.type == 'chart.ChartLabels'){
                return record.year;
            }

            if(caller.type == 'chart.LabelListItem'){
                return record.region;
            }

            return record.year;
        },

        // Return chart value for chart data. The data source doesn't know our data, so
        // this tells the data source where to get the value.
        valueOf:function(record){
            return record.population;
        },

        shouldInheritColor:function(record, caller){
            return true;
        },


        /** Return texts for chart Text views chart.Text */
        getText:function(caller){
            switch(caller.id){
                case 'labelsLeft': return "World Population";
                case "labelsTop": return "World Population Over time"
            }
            return "";
        },

        max:function(){ // Function returning max value for the y axis of the line chart
            return 6000;
        },

        min:function(){ // Function returning min value for the y axis
            return 0;
        },


        minBrightness:90,

        valueForDisplay:function(value, caller){
            if(caller.type == 'chart.ChartValues'){
                if(value >= 1000)return value/1000 + " Bill";
                return value + ' Mill'
            }
            return value;
        },
        // Function returning increments for lines and labels
        increments:function(){
            return 500;
        },

        strokeOf:function(record, caller){
            return '#424242';
        },

        dataFor:function(caller, data){
            if(caller.type == 'chart.ChartLabels'){
                return data[0].getChildren();
            }
            return data;
        }
    });

    var dataSourceAverage = new ludo.chart.DataSource({
        id:'averageDs',
        url : '../data/world-population-average.json',
        childKey:'period',
        // Return text label for chart data.
        textOf:function(record, caller){
            if(caller.type == 'chart.Tooltip'){
                return '<p><b>{parent.region}</b><br>Year: ' + record.year + '<br>Population: {record.population} million</p>';
            }
            return record.year;
        },

        // Return chart value for chart data. The data source doesn't know our data, so
        // this tells the data source where to get the value.
        valueOf:function(record){
            return record.population;
        },

        shouldInheritColor:function(record, caller){
            return true;
        },

        max:function(){ // Function returning max value for the y axis of the line chart
            return 6000;
        },

        min:function(){ // Function returning min value for the y axis
            return 0;
        },

        // Function returning increments for lines and labels
        increments:function(){
            return 500;
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
                                    leftOf:'labelsRight',
                                    alignParentTop:true,
                                    height:50,
                                    alignParentLeft:true
                                }
                            },
                            {
                                id:'chartSource',
                                type:'chart.Text',
                                text:'Source: Wikiepdia.org',
                                anchor:[0.5,0.5],
                                styling:{
                                    'fill': '#aeb0b0',
                                    'font-size' : '12px'
                                },
                                layout:{
                                    below:'labelsTop',
                                    sameWidthAs:'labelsTop',
                                    alignLeft:'labelsTop',
                                    height:30
                                }

                            },
                            {
                                id:'labelsRight',
                                type:'chart.LabelList',
                                layout:{
                                    alignParentRight:true,
                                    width:180,
                                    height:'matchParent',
                                    xOffset:5
                                },
                                textStyles:{
                                    'fill': ludo.$C('text'),
                                    'font-size':'14px',
                                    'font-weight' : 'normal'
                                }
                            },
                            {
                                id:'barValues',
                                orientation:'vertical',
                                type:'chart.ChartValues',
                                layout:{
                                    rightOf:'labelsLeft',
                                    below:'chartSource',
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
                                type:'chart.Area',
                                fillOpacity:0.2,
                                revealAnim:true,
                                animate:true,
                                orientation:'horizontal',
                                bgColor:'#222',
                                layout:{
                                    rightOf:'barValues',
                                    leftOf:'labelsRight',
                                    below:'chartSource',
                                    above:'barLabels'
                                },
                                lineStyles:{
                                    'stroke-width' : 2
                                },
                                bgLines:{
                                    stroke: '#535353'
                                },
                                plugins:[
                                    {
                                        type:'chart.Tooltip',
                                        animationDuration:10,
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