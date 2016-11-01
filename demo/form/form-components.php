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
        id:'myWindow',
        title:'Form components',
        layout:{
            type:'tabs',
            height:550,
            width:650,
            left:50,
            top:30
        },
        css:{
            'border-top' : 0
        },

        form:{
            resource : 'StaticUser',
            autoLoad:true,
            arguments : 100
        },
        children:[
            {
                title:'Form',
                layout:{
                    type:'linear',
                    orientation:'horizontal'
                },
                children:[
                    {
                        formConfig:{
                            labelWidth:130,
                            inlineLabel:false
                        },
                        weight:1,
                        layout:'rows',
                        children:[
                            { type:'form.Text', 'label':'First name', ucWords:true, stretchField:true, name:'firstname', value:'', required:true },
                            { type:'form.Text', 'label':'Last name', ucWords:true, stretchField:true, value:'', name:'lastname' },
                            { type:'form.Email', 'label':'E-mail', stretchField:true, name:'email', value:'' },
                            { type:'form.Textarea',  label:'Address', ucFirst:true, stretchField:true, name:'address', value:'', weight:1}
                        ]
                    },
                    {
                        formConfig:{
                            labelWidth:130,
                            inlineLabel:false
                        },
                        weight:1,
                        overflow:'hidden',
                        layout:'rows',
                        children:[
                            { type:'form.Text', 'label':'Phone', stretchField:true, name:'phone', value:'', required:true },
                            { type:'form.Text', minLength:4, 'label':'Zip code', stretchField:true, name:'zipcode', value:'' },
                            { type:'form.Text', name:'city', stretchField:true, 'label':'City', value:'' },
                            { type:'form.Select', name:'country', id:'country', stretchField:true, 'label':'Country',
                                valueKey:'id', textKey:'name',
                                dataSource:{
                                    resource:'StaticCountries', service:'read', url:'../controller.php'
                                }},
                            { type:'form.Date', name:'birth', id:'birth', stretchField:true, 'label':'Born'},
                            { type:'form.Color', name:'color', id:'color', stretchField:true, 'label':'Favorite color'},
                            { type:'form.File', inlineLabel:false, name:'picture', label:'Picture', value:'', height:30 },
                            { type:'form.DisplayField', label:'form.DisplayField', value:'My value',height:30},
                            { type:'form.RadioGroup',
                                id:'gender',
                                name:'gender',
                                label:'Gender',
                                options:[
                                    { value:'female', text:'Female' },
                                    { value:'male', text:'Male' }
                                ],
                                value:'male'
                            },
                            { type:'form.Seekbar', id:'mySlider', orientation:'horizontal', value:10, minValue:0, maxValue:255, layout: { height: 25 },
                            listeners: {
                                'change': function(value){
                                    ludo.get('numberField').val(Math.round(value));
                                }
                            }},
                            { type:'form.Number', label:'form.Number', minValue:0, maxValue:255, fieldWidth:50, value:10, maxLength:3, suffix:'RGB Color', id: 'numberField'},
                            { type:'form.Checkbox', label:'I agree', id:"agree"}
                        ]}
                ]

            },{
                type:'SourceCodePreview'
            }

        ],

        buttonBar:{
            align:'left',
            children:[
                { type:'form.Button', toggle:true, icon:'../images/icon-left.png', value:'Left', width:80, toggleGroup:'alignment' },
                { type:'form.Button', toggle:true, icon:'../images/icon-center.png', value:'Center', width:80, toggleGroup:'alignment' },
                { type:'form.Button', toggle:true, icon:'../images/icon-right.png', value:'Right', width:80, toggleGroup:'alignment' },
                {
                    layout:{ weight: 1 }
                },
                {
                    type:'form.SubmitButton', width:80
                },
                {
                    type:'form.ResetButton',width:80
                },
                {
                    type:'form.CancelButton', width:80
                }
            ]
        },
        listeners:{
            'submit':function () {
                new ludo.dialog.Alert({
                    title:'Thank you!',
                    resizable:true,
                    html:'Thank you. Your data has been saved..'
                })
            }.bind(this)
        }
    });

</script>
</body>
</html>