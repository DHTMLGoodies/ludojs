<?php
$sub = true;
$pageTitle = 'Bar Chart - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">


    var dataSource = new ludo.chart.DataSource({
        data:[{
            "name": "Poll",
            "date": "2016-12-16",
            "parties": [
                {
                    "name": "Rødt",
                    "percentage": 1.5,
                    "__color": "#660000"
                },
                {
                    "name": "SV",
                    "percentage": 3.4,
                    "__color": "#770000",
                    "coalition": "left"

                },
                {
                    "name": "MDG",
                    "percentage": 2.9,
                    "__color": "#689F38",
                    "coalition": "left"
                },
                {
                    "name": "AP",
                    "percentage": 37.8,
                    "__color": "#D32F2F",
                    "coalition": "left"
                },
                {
                    "name": "SP",
                    "percentage": 6.8,
                    "__color": "#388E3C",
                    "coalition": "left"
                },
                {
                    "name": "V",
                    "percentage": 4.8,
                    "__color": "#81C784",
                    "coalition": "right"
                },
                {
                    "name": "KrF",
                    "percentage": 4.0,
                    "__color": "#FBC02D",
                    "coalition": "right"
                },
                {
                    "name": "H",
                    "percentage": 23.3,
                    "__color": "#0288D1",
                    "coalition": "right"
                },
                {
                    "name": "Frp",
                    "percentage": 13,
                    "__color": "#0D47A1",
                    "coalition": "right"
                },
                {
                    "name": "A",
                    "percentage": 2.1,
                    "__color": "#AAA"
                }
            ]
        }],
        childKey: 'parties',
        textOf:function(record, caller){

            if(caller.type == 'chart.Tooltip'){ // Return text for tooltip module
                var ret = '<p><b>Party: ' + record.name +'<br>' + record.percentage.toFixed(1) + '%';

                if(record.coalition != undefined){
                    ret += '<br>Coalition: ' +  this.sumBy({ "coalition": record.coalition }, "percentage" ).toFixed(1) + '%'
                }

                ret += '</p>';

                return ret;
            }
            return record.name;
        },

        // Textual representation of value, i.e. value + percentage sign
        valueForDisplay:function(value){
            return value + '%';
        },

        // Telling the data source how to get the value
        valueOf:function(record, caller){
            return record.percentage;
        },

        max:function(){
            return this.maxVal + 5 - (this.maxVal % 5);
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
            return 5;
        },

        dataFor:function(caller, data){
            // The bar module and chart labels requires a one dimensional array, ie. the "parties" array
            if(caller.type=='chart.Bar' || caller.type=='chart.ChartLabels'){
                return data[0].parties;
            }
            return data;
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
                                text: "Percentage",
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
                                text:"Poll, December, 16th, 2016",
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
                                bgLines:{
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
                                        },
                                        animationDuration:200
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