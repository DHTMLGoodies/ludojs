<?php
$sub = true;
$pageTitle = 'Example of ludo form components';
require_once("../includes/demo-header.php");
?>

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
        title: 'Form components',
        layout: {
            type: 'tabs',
            height: 550,
            width: 650,
            left: 50,
            top: 30
        },
        // Form configuration
        form: {
            hiddenFields: ['id'], // Hidden fields which could be populated using ludo.get('myWindow).getForm().set('id', 100);
            submit: {
                url: '../controller.php',
                data: {
                    submit: 1
                },
                listeners: {
                    'init': function () {
                        console.log('init');
                        ludo.get('myWindow').shim().show('Loading data');
                    },
                    'success': function (json, form) {
                        new ludo.dialog.Alert({
                            title: 'Thank you!',
                            resizable: true,
                            html: 'Thank you. Your data has been saved..'
                        });

                        form.commit();
                    },
                    'fail': function (text, error, form) {
                        // do something on failure
                    }
                }
            },

            read: {
                autoload: true,  // autoload data on create
                url: 'form-data.json', // read url
                keys: ['id'], // array of form values to add to the view request
                listeners: {
                    'success': function (json, form) {
                        form.clear();
                        form.populate(json);

                    },
                    'fail': function (text, error, form) {
                        // do something on failure
                    }
                }
            }
        },
        children: [
            {
                title: 'Form',
                layout: {
                    type: 'linear',
                    orientation: 'vertical'
                },
                children: [
                    {
                        elCss: {
                            border: 0
                        },
                        type: 'FramedView',
                        title: 'Personal Information',
                        layout: {
                            type: 'table',
                            columns: [
                                {width: 150}, {weight: 1}
                            ],
                            height: 'wrap'
                        },
                        css:{
                            padding: 3
                        },
                        children: [
                            { type:'form.Label', label: 'Name', labelFor: 'name'},
                            {
                                type: 'form.Text', placeholder: 'Name', name: 'name'
                            },
                            { type:'form.Label', label: 'Email', labelFor: 'email', layout: {row: true }},
                            {
                                type: 'form.Email', placeholder: 'Email address', name: 'email', required: true
                            },
                            { type:'form.Label', label: 'Password', labelFor: 'password', layout: {row: true }},
                            {
                                type: 'form.Password', placeHolder: 'Password', name: 'password'
                            },
                            { type:'form.Label', label: 'Repeat Password', labelFor: 'password2', layout: {row: true }},
                            {
                                type: 'form.Password',
                                placeHolder: 'Repeat Password',
                                name: 'password2',
                                twin: 'password'
                            }
                        ]
                    },
                    {
                        elCss: {
                            border: 0
                        },
                        type: 'FramedView',
                        title: 'Address details',
                        layout: {
                            type: 'linear', orientation: 'vertical', height: 'wrap'
                        },
                        children: [
                            {
                                type: 'form.Text', placeholder: 'Address line 1', name: 'addressline1'
                            },
                            {
                                type: 'form.Text', placeholder: 'Address line 2', name: 'addressline2'
                            },
                            {
                                type: 'form.Text', placeholder: 'Town/City', name: 'city'
                            },
                            {
                                type: 'form.Text', placeholder: 'Zip/Post code', name: 'zipcode'
                            }
                        ]

                    }
                ]

            }, {
                type: 'SourceCodePreview'
            }

        ],

        buttonBar: {
            children: [

                {
                    type: 'form.SubmitButton', width: 80
                },
                {
                    type: 'form.ResetButton', width: 80
                },
                {
                    type: 'form.CancelButton', width: 80
                }
            ]
        }
    });

</script>
</body>
</html>