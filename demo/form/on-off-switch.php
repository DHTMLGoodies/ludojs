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

    var w = new ludo.Window({
        id:'myWindow',
        title:'Form components',
        layout:{
            type:'tabs'

        },
        css:{
            'border-top' : 0
        },
        closable:false,
        height:430,
        width:650,
        left:50,
        top:30,
        children:[
            {
                title:'Form',
                layout:{
                    type:'relative'
                },
                children:[
                    {
                        label:'Heater',
                        id:'heater',
                        fieldWidth:350,
                        type:'form.OnOffSwitch',
                        layout:{
                            width:200,
                            height:30
                        },
                        textOn:'On',
                        textOff:'Off',
                        listeners:{
                            'change':function(checked){
                                if(checked){
                                    ludo.get('textEl').html('Heater turned on');
                                }else{
                                    ludo.get('textEl').html('Heater turned off');
                                }
                            }
                        }
                    },
                    {
                        id:'textEl',
                        layout:{
                            height:150,
                            below:'heater'
                        },
                        css:{
                            padding:5,'font-size':20
                        }
                    },
                    {
                        type:'form.Button',
                        layout:{
                            below:'textEl'
                        },
                        listeners:{
                            'click': function(){
                                ludo.get('heater').toggle();
                            }
                        },
                        value:'Call OnOffSwitch toggle method'
                    }
                ]

            },{
                type:'SourceCodePreview'
            }
        ]
    });

</script>
</body>
</html>