<?php
$sub = true;
$pageTitle = 'User admin with LudoJS and LudoDB';
require_once("../includes/demo-header.php");
?>
<body>
<script type="text/javascript">

    var v = new ludo.Window({
        renderTo:document.body,
        title:'User admin',
        layout:{
            type:'linear',
            orientation:'horizontal',
            left:20, top:20,
            width:700, height:500
        },
        children:[
            {
                type:'grid.Grid',
                layout:{
                    width:300
                },
                containerCss:{
                    'border-right':'1px solid #d7d7d7'
                },
                resizable:true,
                dataSource:{
                    url:'../controller.php',
                    resource:'LudoJSUsers',
                    service:'read',
                    listeners:{
                        "select":function (record) {
                            ludo.get('formView').getForm().read(record.id);
                        }
                    }
                },
                columns:{
                    'firstname':{
                        heading:'Firstname',
                        sortable:true,
                        movable:true
                    },
                    'lastname':{
                        heading:'Lastname',
                        sortable:true,
                        movable:true
                    },
                    country_name:{
                        heading:'Country',
                        movable:true
                    }
                }

            },
            {
                type:'FramedView',
                title:'Edit user',
                id:'formView',
                minimizable:false,
                containerCss:{
                    'border':0,
                    'border-left':'1px solid #d7d7d7'
                },
                layout:{
                    weight:1,
                    type:'linear',
                    orientation:'vertical'
                },
                form:{
                    'resource':'LudoJSUser',
                    listeners:{
                        'beforeRead':function () {
                            ludo.get('formView').shim().show('Loading record');
                        },
                        'beforeSave':function () {
                            ludo.get('formView').shim().show('Saving record');
                        },
                        'read':function () {
                            ludo.get('formView').shim().hide();
                            ludo.get('formView').setTitle('Edit user')
                        },
                        'saved':function () {
                            ludo.get('formView').shim().hide();
                        },
                        'new' : function(){
                            ludo.get('formView').setTitle('New user')
                        }
                    }
                },
                children:[
                    { type:'form.Text', inlineLabel:'First name', name:'firstname', required:true },
                    { type:'form.Text', inlineLabel:'Last name', name:'lastname', required:true },
                    { type:'form.Textarea', inlineLabel:'Address', name:'address', required:true },
                    {
                        type:'form.Select',
                        dataSource:{
                            'resource':'LudoJSCountries',
                            'service':'read'
                        },
                        valueKey:'id',
                        textKey:'name',
                        name:'country',
                        emptyItem:{
                            'id':'',
                            'name':'Select country'
                        }
                    },
                    {
                        type:'form.RadioGroup',
                        labelWidth : 50,
                        id:'gender',
                        name:'gender',
                        label:'Gender',
                        options:[
                            { value:'f', text:'Female' },
                            { value:'m', text:'Male' }
                        ],
                        value:'f'
                    }
                ]
            }
        ],

        buttons:[
            {
                type:'form.Button', value:'New',
                listeners:{
                    'click':function () {
                        ludo.get('formView').getForm().newRecord();
                    }
                }
            },
            {
                type:'form.SubmitButton', applyTo:'formView', value:'Save'
            }
        ]


    });

</script>
</body>
</html>