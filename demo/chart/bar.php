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
                return '<p><b>{record.fruit}<br>{record.people} people({record.__percent}%)</p>';
            }

            return record.fruit;
        },

        valueOf:function(record, caller){
            return record.people;
        },

        getText:function(caller){
            switch(caller.id){
                case 'labelFruit': return "Nicest Fruit";
                case "labelPeople": return "People"
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

    var w = new ludo.Window({
        title:'Bar chart',
        layout:{
            minWidth:500,minHeight:400,
            width:700,
            height:500,
            left:20,
            top:20,
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
                                id:'labelFruit',
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
                                id:'labelPeople',
                                type:'chart.Text',
                                anchor:[0.5,0.5],
                                styling:{
                                    'fill': '#aeb0b0',
                                    'font-size' : '20px'
                                },
                                layout:{
                                    rightOf:'labelFruit',
                                    fillRight:true,
                                    alignParentBottom:true,
                                    height:50,
                                    alignParentLeft:true
                                }
                            },
                            {
                                id:'barLabels',
                                type:'chart.BarLabels',
                                orientation:'vertical',
                                layout:{
                                    rightOf:'labelFruit',
                                    fillUp:true,
                                    bottom:80,
                                    width:60
                                },
                                padding:4,
                                styling:{
                                    'fill': '#aeb0b0',
                                    'font-size' : '12px'
                                }
                            },
                            {
                                id:'barValues',
                                type:'chart.BarValues',
                                orientation:'horizontal',
                                layout:{
                                    above:'labelPeople',
                                    rightOf:'barLabels',
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
                                orientation:'vertical',
                                id:'bar',
                                bgColor:'#424242',
                                barSize:0.9, // Fraction bar width
                                layout:{
                                    rightOf:'barLabels',
                                    fillRight:true,
                                    fillUp:true,
                                    above:'barValues'
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

</script>
</body>
</html>