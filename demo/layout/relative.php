<?php
$sub = true;
$pageTitle = 'Relative layout';
require_once("../includes/demo-header.php");
?>

<style type="text/css">
    div.customView {
        border: 1px solid #C0C0C0;

        padding: 3px;
        background-color: #FFF;
    }
</style>
<script type="text/javascript" src="../../src/layout/relative.js"></script>
<script type="text/javascript" class="source-code">
    var w = new ludo.Window({
        title:'Relative Layout',

        layout:{
            left:20,top:20,
            width:400,height:400,
            minWidth:300,minHeight:300,
            type:'tabs'
        },
        children:[
            {
                id:'relativeView',
                title:'Relative Layout',
                // This is the view for the demo
                layout:{
                    type:'relative'
                },
                form:{
                    listeners:{
                        'change': function(){
                            this.view.updatePreviews();
                        }
                    }
                },

                listeners:{
                    'render': function(){
                        this.updatePreviews();
                    }
                },

                updatePreviews:function(){
                    var color = this.getColorCode();
                    if(this.currentColor != color){
                        ludo.get('colorPreview').getBody().css('background-color', color);
                        ludo.get('colorCode').html(color);
                        this.currentColor = color;

                        var complementary = this.colorUtil.offsetHue(color, 180);
                        ludo.get('colorPreviewComplementary').getBody().css('background-color', complementary);
                        ludo.get('colorCodeComplementary').html(complementary);
                    }
                },
                /* Custom function which can be called using this.getColorCode() */
                getColorCode:function(){
                    if(this.colorUtil == undefined){
                        this.colorUtil = new ludo.color.Color();
                    }

                    return this.colorUtil.rgbCode(
                        ludo.get('redSlider').val(),
                        ludo.get('greenSlider').val(),
                        ludo.get('blueSlider').val()
                    );
                },

                children:[

                    {
                        id:'greenValue',
                        type : 'form.Number',
                        layout:{
                            centerHorizontal:true,

                            absBottom:0,
                            width:50
                        },

                        linkWith:'greenSlider'
                    },
                    {
                        id:'greenSlider',
                        type:'form.Seekbar',
                        orientation:'vertical',
                        layout:{
                            alignLeft:'greenValue',
                            above:'greenValue',
                            fillUp:true,
                            width:50

                        },
                        value:144,
                        minValue:0,maxValue:255,
                        increments:1,
                        thumbColor :'#388E3C',
                        negativeColor:'#388E3C'
                    },
                    /** Red */
                    {
                        id:'redValue',
                        type : 'form.Number',
                        layout:{
                            leftOf:'greenValue',
                            absBottom:0,
                            width:50
                        },
                        linkWith:'redSlider'
                    },
                    {
                        id:'redSlider',
                        type:'form.Seekbar',
                        orientation:'vertical',
                        layout:{
                            alignLeft:'redValue',
                            above:'redValue',
                            fillUp:true,
                            width:50

                        },
                        minValue:0,maxValue:255,
                        thumbColor :'#D32F2F',
                        negativeColor:'#D32F2F',
                        increments:1,
                        value:33
                    },
                    /** Blue */
                    {
                        id:'blueValue',
                        type : 'form.Number',
                        layout:{
                            rightOf:'greenValue',
                            alignParentBottom:true,
                            width:50
                        },
                        linkWith:'blueSlider'
                    },
                    {
                        id:'blueSlider',
                        increments:1,
                        type:'form.Seekbar',
                        orientation:'vertical',
                        layout:{
                            alignLeft:'blueValue',
                            above:'blueValue',
                            fillUp:true,
                            width:50

                        },
                        value:22,
                        thumbColor :'#1976D2',
                        negativeColor:'#1976D2',
                        minValue:0,maxValue:255

                    },
                    {
                        id:'colorPreview',
                        layout:{
                            type:'relative',
                            alignParentTop:true,
                            rightOf:'blueValue',
                            fillRight:true,
                            fillDown:true
                        },
                        children:[
                            {
                                id:'colorCode',
                                elCss:{
                                    border:'1px solid #EEE',
                                    'border-radius': '10px'
                                },

                                css:{
                                    'line-height' : '20px',
                                    'text-align': 'center'
                                },
                                layout:{
                                    centerInParent:true,
                                    width:70,
                                    height:20
                                }

                            }
                        ]
                    },
                    {
                        id:'colorPreviewComplementary',
                        layout:{
                            type:'relative',
                            alignParentTop:true,
                            leftOf:'redValue',
                            fillLeft:true,
                            fillDown:true
                        },
                        children:[
                            {
                                id:'colorCodeComplementary',
                                elCss:{
                                    border:'1px solid #EEE',
                                    'border-radius': '10px'
                                },

                                css:{
                                    'line-height' : '20px',
                                    'text-align': 'center'
                                },
                                layout:{
                                    centerInParent:true,
                                    width:70,
                                    height:20
                                }

                            },
                            {
                                layout:{
                                    centerHorizontal:true,
                                    width:100,
                                    alignParentTop:true,
                                    offsetY:20

                                },
                                elCss:{
                                    border:'1px solid #EEE',
                                    'border-radius': '10px',
                                    'background-color': '#333',
                                    color: '#EEE',
                                    padding:3

                                },
                                css:{
                                    'font-size': '0.8em',
                                    'text-align': 'center'
                                },
                                html: 'Complementary'

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

    new ludo.Window({
        left:600, top:100, height:300, width:300,
        title:'Sign In',
        layout:{
            type:'relative'
        },

        children:[
            {
                layout:{
                    type:'linear',
                    orientation:'vertical',
                    centerInParent:true,
                    width:200,
                    height:130
                },
                css:{
                    border:'1px solid #C0C0C0',
                    'background-color':'#f5f5f5',
                    padding:3
                },
                children:[
                    {
                        height:25, html:'Box centered in parent'
                    },
                    {
                        type:'form.Text', label:'Username', name:'username'
                    },
                    {
                        type:'form.Password', label:'Password', name:'password'
                    },
                    {
                        type:'form.Button', value:'Sign In'
                    }
                ]

            }
        ]
    });


</script>
</body>
</html>