<?php
$sub = true;
$pageTitle = 'Bar Chart - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">


    var dataSource = new ludo.chart.DataSource({
        // Return text label for chart data.
        textOf: function (record, caller) {
            if(caller.type == 'chart.LabelListItem'){
                return record.gender + " 0-14yrs"
            }
            return record.gender || record.name;
        },

        // Displays textual verson of a value. Returning value + '%'.
        // Used in the labels to the left of the column chart
        valueForDisplay:function(value, caller){
            return value + "%";
        },

        // Return chart value for chart data. The data source doesn't know our data, so
        // this tells the data source where to get the value.
        valueOf: function (record) {
            return record.percent;
        },

        /** Return texts for chart Text views chart.Text */
        getText: function (caller) {
            switch (caller.id) {
                case 'labelsLeft':
                    return "Percent";
                case "labelsTop":
                    return "What those kids are doing"
            }
            return "";
        },


        max: function () { // Displaying percent in the chart, so max should be 100
            return 100;
        },

        min: function () { // Mininum percent is 0
            return 0;
        },

        colorOf: function (record) { // Return color codes for the chart items.
            if (record.gender == 'girls')return '#E64A19';
            if (record.gender == 'boys')return '#039BE5';
            return '#F00';
        },

        // Function returning increments for lines and labels
        increments: function (minVal, maxVal, caller) {
            return 10;
        },

        data: [

            {
                "name": "Skateboarding",
                "children": [
                    {"gender": "boys", "percent": 38},
                    {"gender": "girls", "percent": 24}
                ]
            },
            {
                "name": "Bike riding",
                "children": [
                    {"gender": "boys", "percent": 76},
                    {"gender": "girls", "percent": 57}
                ]
            },
            {
                "name": "Watching TV",
                "children": [
                    {"gender": "boys", "percent": 100},
                    {"gender": "girls", "percent": 100}
                ]
            },
            {
                "name": "Computer Games",
                "children": [
                    {"gender": "boys", "percent": 80},
                    {"gender": "girls", "percent": 60}
                ]
            },
            {
                "name": "Arts and Crafts",
                "children": [
                    {"gender": "boys", "percent": 36},
                    {"gender": "girls", "percent": 58}
                ]
            }
        ]


    });
    var d = new Date();
    var w = new ludo.Window({
        title: 'Bar chart',
        layout: {
            minWidth: 500, minHeight: 400,
            width: 700,
            height: 500,
            left: 20,
            top: 20,
            type: 'tab'
        },
        children: [
            {
                title: 'Chart',
                layout: {
                    type: 'relative'
                },
                css: {
                    'padding-right': 10
                },
                children: [
                    {

                        layout: {
                            width: 'matchParent',
                            height: 'matchParent'
                        },
                        type: 'chart.Chart',
                        id: 'chart',
                        dataSource: dataSource,
                        children: [
                            {
                                id: 'labelsLeft',
                                type: 'chart.Text',
                                styling: {
                                    fill: '#aeb0b0',
                                    'font-size': '24px'
                                },
                                anchor: [0.5, 0.5],
                                layout: {
                                    width: 60,
                                    bottom: 50,
                                    fillUp: true,
                                    alignParentLeft: true
                                },
                                rotate: 'left'
                            },
                            {
                                id: 'labelsTop',
                                type: 'chart.Text',
                                anchor: [0.5, 0.3],
                                styling: {
                                    'fill': '#aeb0b0',
                                    'font-size': '20px'
                                },
                                layout: {
                                    rightOf: 'labelsLeft',
                                    fillRight: true,
                                    alignParentTop: true,
                                    height: 70,
                                    alignParentLeft: true
                                }
                            },
                            {
                                id: 'barValues',
                                orientation: 'vertical',
                                type: 'chart.ChartValues',
                                layout: {
                                    rightOf: 'labelsLeft',
                                    below: 'labelsTop',
                                    bottom: 30,
                                    width: 30
                                },
                                padding: 4,
                                styling: {
                                    'fill': '#aeb0b0',
                                    'font-size': '12px'
                                }
                            },
                            {
                                id: 'barLabels',
                                type: 'chart.ChartLabels',
                                layout: {
                                    alignParentBottom: true,
                                    rightOf: 'barValues',
                                    fillRight: true,
                                    height: 30
                                },
                                styling: {
                                    'fill': '#aeb0b0',
                                    'font-size': '12px'
                                }
                            },
                            {
                                name: 'bar',
                                id: 'bar',
                                type: 'chart.Bar',
                                animate: true,
                                orientation: 'horizontal',
                                bgColor: '#424242',
                                barSize: 0.7, // Fraction bar width
                                layout: {
                                    rightOf: 'barValues',
                                    fillRight: true,
                                    below: 'labelsTop',
                                    above: 'barLabels'
                                },
                                lines: {
                                    stroke: '#535353'
                                },
                                outline: {
                                    'left': {
                                        stroke: '#aeb0b0',
                                        fill: 'none'

                                    },
                                    'bottom': {
                                        stroke: '#aeb0b0'
                                    },
                                    'top': {
                                        stroke: '#535353'
                                    },
                                    'right': {
                                        stroke: '#535353'
                                    }
                                },
                                plugins: []
                            },

                            {
                                type: 'chart.LabelList',
                                layout: {
                                    alignParentTop:true,
                                    alignTop:'bar',
                                    alignRight:'bar',
                                    offsetY:5,
                                    offsetX : -5,
                                    width: 180,
                                    height: 22
                                },
                                textStyles: {
                                    fill: '#aeb0b0',
                                    'font-size': '11px'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                type: 'SourceCodePreview'
            }
        ]
    });

    console.log('time to render: ' + (new Date().getTime() - d.getTime()));
</script>
</body>
</html>