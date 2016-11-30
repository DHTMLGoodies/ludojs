<?php
$sub = true;
$pageTitle = 'On-Off Switch Sample - LudoJS';
require_once("../includes/demo-header.php");
?>

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
        id: 'myWindow',
        title: 'On-Off Switch',
        layout: {
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
        children: [
            {
                title: 'Form',
                layout: {
                    type: 'table',
                    columns: [
                        {width: 100},
                        {weight: 1}
                    ]
                },
                css:{
                    padding:5
                },
                children: [
                    {
                        type: 'form.Label',
                        label: 'Heater',
                        layout:{
                            vAlign:'middle'
                        }
                    },
                    {
                        label: 'Heater',
                        id: 'heater',
                        fieldWidth: 350,
                        type: 'form.OnOff',
                        layout: {
                            height: 30,
                            width:60
                        },
                        textOn: 'On',
                        textOff: 'Off',
                        listeners: {
                            'change': function (checked) {
                                if (checked) {
                                    ludo.get('textEl').html('Heater turned on');
                                } else {
                                    ludo.get('textEl').html('Heater turned off');
                                }
                            }
                        }
                    },
                    {

                        id: 'textEl',
                        layout: {
                            row: true,
                            colspan:2,
                            height: 150
                        },
                        css: {
                            'font-size': 20
                        }
                    },
                    {
                        type: 'form.Button',
                        layout: {
                            row:true,
                            colspan:2
                        },
                        listeners: {
                            'click': function () {
                                ludo.get('heater').toggle();
                            }
                        },
                        value: 'Call OnOff toggle method'
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