<?php
$sub = true;
$pageTitle = 'Area Chart - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">

    var dataSource = new ludo.chart.DataSource({
        id:'dataSource',
        data:[
            {   /* One item for each area  */
                "region": "Africa",
                "period": [
                    {"year": "1500", "population": 86}, /* Point */
                    {"year": "1600", "population": 114},
                    {"year": "1700", "population": 106},
                    {"year": "1750", "population": 106},
                    {"year": "1800", "population": 107},
                    {"year": "1850", "population": 111},
                    {"year": "1900", "population": 133},
                    {"year": "1950", "population": 221},
                    {"year": "1999", "population": 783},
                    {"year": "2008", "population": 973},
                    {"year": "2010", "population": 1022 },
                    {"year": "2012", "population": 1052 },
                    {"year": "2050", "population": 2478 }
                ]
            },
            {
                "region": "Asia",
                "period": [

                    {"year": "1500", "population": 282},
                    {"year": "1600", "population": 350},
                    {"year": "1700", "population": 411},
                    {"year": "1750", "population": 502},
                    {"year": "1800", "population": 635},
                    {"year": "1850", "population": 809},
                    {"year": "1900", "population": 947},
                    {"year": "1950", "population": 1402},
                    {"year": "1999", "population": 3700},
                    {"year": "2008", "population": 4054},
                    {"year": "2010", "population": 4164 },
                    {"year": "2012", "population": 4250 },
                    {"year": "2050", "population": 5267 }

                ]
            },
            {
                "region": "Europe",
                "period": [

                    {"year": "1500", "population": 168},
                    {"year": "1600", "population": 170},
                    {"year": "1700", "population": 178},
                    {"year": "1750", "population": 190},
                    {"year": "1800", "population": 203},
                    {"year": "1850", "population": 276},
                    {"year": "1900", "population": 408},
                    {"year": "1950", "population": 547},
                    {"year": "1999", "population": 675},
                    {"year": "2008", "population": 732},
                    {"year": "2010", "population": 738 },
                    {"year": "2012", "population": 740 },
                    {"year": "2050", "population": 734 }

                ]
            },
            {
                "region": "Latin America",
                "period": [

                    {"year": "1500", "population": 40},
                    {"year": "1600", "population": 20},
                    {"year": "1700", "population": 10},
                    {"year": "1750", "population": 16},
                    {"year": "1800", "population": 24},
                    {"year": "1850", "population": 38},
                    {"year": "1900", "population": 74},
                    {"year": "1950", "population": 167},
                    {"year": "1999", "population": 508},
                    {"year": "2008", "population": 577},
                    {"year": "2010", "population": 590 },
                    {"year": "2012", "population": 603 },
                    {"year": "2050", "population": 784 }

                ]
            },
            {
                "region": "North America",
                "period": [

                    {"year": "1500", "population": 6},
                    {"year": "1600", "population": 3},
                    {"year": "1700", "population": 2},
                    {"year": "1750", "population": 2},
                    {"year": "1800", "population": 7},
                    {"year": "1850", "population": 26},
                    {"year": "1900", "population": 82},
                    {"year": "1950", "population": 172},
                    {"year": "1999", "population": 312},
                    {"year": "2008", "population": 337},
                    {"year": "2010", "population": 345 },
                    {"year": "2012", "population": 351 },
                    {"year": "2050", "population": 433 }

                ]
            },
            {
                "region": "Oceania",
                "period": [

                    {"year": "1500", "population": 3},
                    {"year": "1600", "population": 3},
                    {"year": "1700", "population": 3},
                    {"year": "1750", "population": 2},
                    {"year": "1800", "population": 2},
                    {"year": "1850", "population": 2},
                    {"year": "1900", "population": 6},
                    {"year": "1950", "population": 13},
                    {"year": "1999", "population": 30},
                    {"year": "2008", "population": 34},
                    {"year": "2010", "population": 37 },
                    {"year": "2012", "population": 38 },
                    {"year": "2050", "population": 57 }

                ]
            }
        ],
        childKey:'period',
        // Return text label for chart data.
        textOf:function(record, caller){
            if(caller.type == 'chart.Tooltip'){
                return '<p><b>{parent.region}</b><br>Year: ' + record.year + '<br>Population: {record.population} '  + 'million (' + (Math.round(record.__indexFraction * 1000)/10) + '%)' +
                    '<br>Total Population: {record.__indexSum} million</p>';
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
        valueOf:function(record, caller){
            if(caller.type == 'cha3rt.LineItem'){
                console.log(record.__indexFraction);
                return record.__indexFraction * 100;
            }
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
            var max = this.maxIndexSum();
            return  max + 500 - (500 - max % 500);
        },

        min:function(){ // Function returning min value for the y axis
            return 0;
        },

        valueForDisplay:function(value, caller){
            if(caller.type == 'chart.ChartValues'){
                if(value >= 1000)return (value / 1000) + " billion";
                return value + ' million';
            }
            return value;
        },
        // Function returning increments for lines and labels
        increments:function(){
            return 500;
        },

        maxSaturation:70,
        minBrightness:90,

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
                                    width:70
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
                                animate:true,
                                orientation:'horizontal',
                                bgColor:'#333',
                                stacked:true,
                                areaStyles:{
                                    'fill-opacity' : 0.5
                                },
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
                                        animationDuration:50,
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