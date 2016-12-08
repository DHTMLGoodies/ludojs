<?php
$sub = true;
$pageTitle = 'Bar Chart - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">


    var dataSource = new ludo.chart.DataSource({
        url : '../data/bar-chart-data.json',
        textOf:function(record, caller){
            if(caller == undefined)console.trace();
            return record.fruit;
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
                                    above:'barLabels',
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
                                type:'chart.Bar',
                                animate:true,
                                id:'bar',
                                bgColor:'#424242',
                                barSize:0.9, // Fraction bar width
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