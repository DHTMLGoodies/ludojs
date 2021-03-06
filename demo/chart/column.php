<?php
$sub = true;
$pageTitle = 'Bar Chart - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">


    var dataSource = new ludo.chart.DataSource({
        url : '../data/bar-chart-data.json',
        textOf:function(record, caller){
            if(caller.type == 'chart.Tooltip'){
                return '<p><b>' + record.fruit +'<br>' + record.people + ' of ' + record.__sum + ' people(' + record.__percent + '%)</p>';
            }
            return record.fruit;
        },

        valueForDisplay:function(value, caller){
            return value;
        },

        valueOf:function(record, caller){
            return record.people;
        },

        getText:function(caller){
            switch(caller.id){
                case 'labelsLeft': return "People";
                case "labelsTop": return "Nicest Fruit"
            }
            return "";
        },

        max:function(){
            return this.maxVal + 10 - (this.maxVal % 10);
        },

        min:function(){
            return 0;
        },

        value:function(value, caller){
            return value;
        },

        // Function returning increments for lines, labels
        increments:function(minVal, maxVal, caller){
            // may also return an array like [0,10,20,30,40,50,60]
            return 10;
        }


    });
    var d = new Date();
    var w = new ludo.FramedView({
        title:'Bar chart',
        renderTo:document.body,
        layout:{
            width:'matchParent',
            height:'matchParent',
            type:'tab',
            tabs:'left'
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
                                type:'chart.ChartValues',
                                layout:{
                                    rightOf:'labelsLeft',
                                    below:'labelsTop',
                                    bottom:30,
                                    width:30
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
                                type:'chart.BgLines',
                                bgColor:'#424242',
                                layout:{
                                    rightOf:'barValues',
                                    fillRight:true,
                                    below:'labelsTop',
                                    above:'barLabels'
                                },
                                y:{
                                    stroke: '#535353'
                                }
                            },
                            {
                                name : 'bar',
                                type:'chart.Bar',
                                animate:true,
                                id:'bar',
                                barSize:0.9, // Fraction bar width
                                layout:{
                                    rightOf:'barValues',
                                    fillRight:true,
                                    below:'labelsTop',
                                    above:'barLabels'
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
                                    {
                                        type:'chart.Tooltip',
                                        textStyles:{
                                            'font-size':'12px'
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