<?php
$sub = true;
$pageTitle = 'Example of ludo form components';
require_once("../includes/demo-header.php");
?>
<body>
<script type="text/javascript" src="../../src/form/element.js"></script>
<script type="text/javascript" src="../../src/form/combo.js"></script>
<script type="text/javascript" src="../../src/menu/button.js"></script>
<script type="text/javascript" src="../../src/form/label-element.js"></script>
<script type="text/javascript" src="../../src/form/text.js"></script>
<script type="text/javascript" src="../../src/form/select.js"></script>
<script type="text/javascript" src="../../src/form/checkbox.js"></script>
<script type="text/javascript" src="../../src/form/manager.js"></script>
<script type="text/javascript" src="../../src/form/radio-group.js"></script>
<script type="text/javascript" src="../../src/model/model.js"></script>
<script type="text/javascript" src="../../src/layout/renderer.js"></script>
<script type="text/javascript" src="../../src/layout/factory.js"></script>
<script type="text/javascript" src="../../src/layout/linear-horizontal.js"></script>
<script type="text/javascript" src="../../src/layout/linear-vertical.js"></script>
<script type="text/javascript" src="../../src/view/button-bar.js"></script>
<script type="text/javascript" src="../../src/color/base.js"></script>
<script type="text/javascript" src="../../src/color/color.js"></script>
<script type="text/javascript" src="../../src/color/boxes.js"></script>
<script type="text/javascript" src="../../src/color/rgb-slider.js"></script>
<script type="text/javascript" src="../../src/form/color.js"></script>
<script type="text/javascript" src="../../src/view/title-bar.js"></script>
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
<script type="text/javascript" src="../../src/form/slider.js"></script>
<script type="text/javascript" src="../../src/form/date.js"></script>
<script type="text/javascript" src="../../src/form/textarea.js"></script>
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
        height:430,
        width:650,
        left:50,
        top:30,
        form:{
            resource : 'User',
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
                            { type:'form.Select', name:'country', stretchField:true, 'label':'Country',
                                valueKey:'id', textKey:'name',
                                dataSource:{
                                    resource:'Countries', service:'read', url:'../controller.php'
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
                            { type:'form.Slider', id:'mySlider', direction:'horizontal', label:'form.Slider', value:10, minValue:0, maxValue:255 },
                            { type:'form.Number', label:'form.Number(linked)', minValue:0, maxValue:255, fieldWidth:50, value:10, maxLength:3, suffix:'RGB Color', linkWith:'mySlider'},
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