<?php
$sub = true;
$pageTitle = 'Example of ludo form components';
require_once("../includes/demo-header.php");
?>
<body>
<link rel="stylesheet" href="../../css-source/form/on-off-switch.css" type="text/css"/>
<style type="text/css">
    .ludo-form-text-element input, .ludo-form-text-element textarea {
        border: 0;
        padding: 0;
        outline: none;
    }

    .ludo-form-text-element {
        border: 1px solid #ccc;
        background-color: #FFF;
        padding: 1px;
    }

</style>
<script type="text/javascript" class="source-code">

    // Create color util object for easy access to color functions
    var colorUtil = new ludo.color.Color();

    /** This function is called when color is changed from one of the seekbars */
    function updateColor(){
        var color = colorUtil.rgbCode(ludo.get('red').val(), ludo.get('green').val(), ludo.get('blue').val());

        ludo.get('preview').getBody().css({
            'background-color': color
        });

        ludo.get('rgbCode').val(color.substr(1));

    }


    /** This function is called when color is changed from text box */
    function updateColorByCode(){
        var color = ludo.get('rgbCode').val();

        var rgbColors = colorUtil.rgbObject(color);

        ludo.get('preview').getBody().css({
            'background-color': '#' + color
        });

        ludo.get('red').val(rgbColors.r);
        ludo.get('green').val(rgbColors.g);
        ludo.get('blue').val(rgbColors.b);

    }


    // Put all views inside a floating window
    var w = new ludo.Window({
        id: 'myWindow',
        title: 'Set Colors using Seekbars',
        layout: {
            // for this demo, the demo it's self will be displayed in one tab and the source code in a second tab
            type: 'tabs'

        },
        css: {
            'border-top': 0
        },
        closable: false,
        height: 430,
        width: 650,
        left: 50,
        top: 30,
        listeners:{
            render:updateColor
        },
        children: [
            {
                title: 'Seekbar Demo', // Tab title

                layout: {
                    height: 'matchParent',
                    width: 'matchParent',
                    type: 'linear',
                    orientation: 'vertical'
                },
                css:{
                    padding:10
                },

                children: [

                    {
                        id: 'red', // id of view for easy access using ludo.get('red') later
                        reverse:true,
                        orientation:'horizontal',
                        minValue:0,maxValue:255, // Min value set to 0, max set to 255
                        thumbColor:'#D32F2F', // Red color of seekbar thumb
                        negativeColor:'#D32F2F', // Same red color on the seekbar(below thumb)
                        type: 'form.Seekbar', // Type of view is form.Seekbar
                        stateful:true, // value will be saved, i.e. saved
                        value:100, // Sets a default red value of 100
                        css:{
                            'padding-left': 5,'padding-right':5 // some space between the seekbars
                        },
                        layout: {
                            height:60 // Sets with of seek bar to 60. height will be height of parent(default for linear horizontal layout
                        },
                        listeners:{
                            change:updateColor // call the updateColor function above when red value is changed
                        }
                    },
                    {
                        // Seekbar for the green color
                        id: 'green',
                        value:200,
                        orientation:'horizontal',
                        thumbColor:'#388E3C',
                        negativeColor:'#388E3C',
                        minValue:0,maxValue:255,
                        type: 'form.Seekbar',
                        stateful:true,
                        css:{
                            'padding-left': 5,'padding-right':5
                        },
                        layout: {
                            height:60
                        },
                        listeners:{
                            change:updateColor
                        }
                    },
                    {
                        // Seekbar for the blue color
                        id: 'blue',
                        value:50,
                        orientation:'horizontal',
                        thumbColor:'#1976D2',
                        negativeColor:'#1976D2',
                        type: 'form.Seekbar',
                        minValue:0,maxValue:255,
                        stateful:true,
                        css:{
                            'padding-left': 5,'padding-right':5
                        },
                        layout: {
                            height:60
                        },
                        listeners:{
                            change:updateColor
                        }
                    },
                    {
                        layout:{
                            weight:1, // This view should use all remaining space of parent
                            type:'linear', // Children will be stacked
                            orientation:'vertical' // beneath each other
                        },
                        children:[

                            {
                                id:'preview', // This view will be updated with a background color of the three seekbars
                                layout:{
                                    weight:1 // Use all remaining vertical space of parent view
                                },
                                css:{
                                    'border':'1px solid #AAA' // A nice medium gray border around the preview
                                }
                            },
                            {
                                // A form text element showing the
                                type:'form.Text',
                                label:'#',
                                labelSuffix:'', // label suffix for all form views is ":", This line removes it
                                labelWidth:15, // Short label
                                maxLength:6, // Max length of color code is 6, example: FFAABB
                                layout:{ height:30 },
                                id:'rgbCode', // id for easy access using ludo.get("rgbCode")
                                // A custom validator function. The value has to match this color code Regular Expression pattern(6 characters from 0-9,A-F)
                                // The validator will make sure that the change event below will only be triggered when we have a valid RGB code
                                validator:function(val){
                                    return /^[0-9A-F]{6}$/.test(val);
                                },
                                listeners:{
                                    'change': updateColorByCode // When value is changed, call the updateColorByCode function
                                }
                            }
                        ]
                    }

                ]


            }, {
                type: 'SourceCodePreview'
            }
        ]
    });

</script>
</body>
</html>