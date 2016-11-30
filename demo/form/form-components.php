<?php
$sub = true;
$pageTitle = 'Example of ludo form components';
require_once("../includes/demo-header.php");
?>

<style type="text/css">
    
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
                        ludo.get('myWindow').shim().show('Saving data');
                    },
                    'success': function (json, form) {
                        ludo.get('myWindow').shim().hide();
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
                populate: true, 
                keys: ['id'], // array of form values to add to the view request
                listeners: {
                    'success': function (json, form) {
                        

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
                            simple: true,
                            columns: [
                                {width: 150}, {weight: 1}
                            ],
                            height: 'wrap'
                        },
                        css: {
                            padding: 3
                        },
                        children: [
                            {
                                type: 'form.Label', label: 'Name:', labelFor: 'name'
                            },
                            {
                                type: 'form.Text', placeholder: 'Name', name: 'name'
                            },
                            {
                                type: 'form.Label', label: 'Email:', labelFor: 'email'
                            },
                            {
                                type: 'form.Email', placeholder: 'Email address', name: 'email', required: true
                            },
                            {
                                type: 'form.Label', label: 'Password:', labelFor: 'password'
                            },
                            {
                                type: 'form.Password', placeHolder: 'Password', name: 'password'
                            },
                            {
                                type: 'form.Label', label: 'Repeat Password:', labelFor: 'password2'
                            },
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
                        css: {
                            padding: 3
                        },
                        layout: {
                            type: 'table',
                            simple: true,
                            columns: [
                                {width: 150}, {weight: 1}
                            ],
                            height: 'wrap'
                        },
                        children: [
                            {type: 'form.Label', label: 'Address:', labelFor: 'addressline1'},
                            {
                                type: 'form.Text', placeholder: 'Address line 1', name: 'addressline1'
                            },
                            {type: 'form.Label', label: 'Address 2:', labelFor: 'addressline2'},
                            {
                                type: 'form.Text', placeholder: 'Address line 2', name: 'addressline2'
                            },
                            {type: 'form.Label', label: 'Town/City:', labelFor: 'city'},
                            {
                                type: 'form.Text', placeholder: 'Town/City', name: 'city'
                            },
                            {type: 'form.Label', label: 'Zip/Post code:', labelFor: 'zipcode'},
                            {
                                type: 'form.Text', placeholder: 'Zip/Post code', name: 'zipcode'
                            },
                            {
                                type:'form.Label', label:'Country:', labelFor:'country'
                            },
                            {
                                type:'form.Select',
                                id:'country',
                                name:'country',
                                dataSource:{
                                    url:'../data/countries.json'
                                },
                                textKey:'name',
                                valueKey:'code',
                                emptyItem:{
                                    name:'Please select country',
                                    code:''
                                }
                            },
                            {
                                type:'form.Label', label:'Gender:', labelFor:'gender',
                                layout:{
                                    height:30
                                }
                            },
                            {
                                type:'form.OnOffSwitch',
                                name:'gender',
                                textOn:'Female',
                                textOff:'Male',
                                layout:{
                                    width:100,height:30
                                },
                                checkedVal:'F',
                                uncheckedVal:'M',
                                trackColorOn:'#C2185B',
                                trackColorOff:'#1976D2'

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