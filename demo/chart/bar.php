<?php
$sub = true;
$pageTitle = 'Bar Chart - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">


    var dataSource = new ludo.chart.DataSource({
        data:[
            {
                "id":"apple",
                "fruit": "Apple",
                "people": 35,
                "__color": "#D32F2F"
            },
            {
                "id": "orange",
                "fruit": "Orange",
                "people": 33,
                "__color": "#FF8A65"
            },
            {
                "id" : "banana",
                "fruit": "Banana",
                "people": 9,
                "__color": "#FDD835"
            },
            {
                "id" : "kiwi",
                "fruit": "Kiwi",
                "people": 24,
                "__color": "#1B5E20"
            },
            {
                "id": "blueberry",
                "fruit": "Blueberry",
                "people": 40,
                "__color": "#0D47A1"
            },
            {
                "id": "grapes",
                "fruit": "Grapes",
                "people": 6,
                "__color": "#689F38"
            }
        ],
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
                                type:'chart.ChartLabels',
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
                                type:'chart.ChartValues',
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
                                type:'chart.BgLines',
                                bgColor:'#424242',
                                layout:{
                                    rightOf:'barLabels',
                                    fillRight:true,
                                    fillUp:true,
                                    above:'barValues'
                                },
                                x:{
                                    stroke: '#535353'
                                }
                            },
                            {
                                name : 'bar',
                                type:'chart.Bar',
                                animate:true,
                                orientation:'vertical',
                                id:'bar',

                                barSize:0.9, // Fraction bar width
                                layout:{
                                    rightOf:'barLabels',
                                    fillRight:true,
                                    fillUp:true,
                                    above:'barValues'
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