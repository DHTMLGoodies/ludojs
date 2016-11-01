<?php
$sub = true;
$pageTitle = 'Example of ludo form components';
require_once("../includes/demo-header.php");
?>
<body>
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
        title: 'Example of table ',
        layout: {
            type: 'tabs',
            height: 550,
            width: 650,
            left: 50,
            top: 30
        },
        css: {
            'border-top': 0
        },

        form: {
            resource: 'StaticUser',
            autoLoad: true,
            arguments: 100
        },
        children: [
            {
                title: 'Form',
                id: 'myForm',
                css: {padding: 8},
                layout: {
                    type: 'table', // Render children i a table layout
                    columns: [
                        {width: 100},
                        {weight: 1}
                    ]
                },
                children: [
                    {
                        type: 'form.Label', label: 'First name:', labelFor: 'firstname'
                    },
                    {
                        type: 'form.Text',
                        name: 'firstname',
                        id: 'firstname',
                        required: true,
                        placeholder: 'Enter firstname',
                        validateKeyStrokes:true
                    },
                    {
                        type: 'form.Label', label: 'Last name:', labelFor: 'lastname',
                        layout: {
                            row: true
                        }
                    },
                    {
                        type: 'form.Text',
                        name: 'lastname',
                        id: 'lastname',
                        required: true,
                        placeholder: 'Enter Lastname',
                        validateKeyStrokes:true
                    },
                    {
                        layout: {row: true},
                        type: 'form.Label', label: 'Age', id: 'age', labelFor: 'age'
                    },
                    {
                        type: 'form.Number',
                        name: 'age', id: 'age',
                        minValue: 3,
                        maxValue: 150, placeholder: 'Enter age(3-150)',
                        layout: { width: 100 } // Override default width of column
                    },
                    {
                        layout: {
                            row: true
                        },
                        type: 'form.Button', value: 'Show Values',
                        listeners: {
                            'click': function () {
                                ludo.get('formValues').html(JSON.stringify(ludo.get('myForm').getForm().values()));
                            }
                        }
                    },
                    {
                        layout: {
                            row: true,
                            colspan: 2,
                            height: 100
                        },
                        id: 'formValues',
                        css: {
                            'font-size': '1.1em',
                            border: '1px solid #aaa',
                            padding: 5
                        }
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