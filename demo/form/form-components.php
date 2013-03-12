<?php
$sub = true;
$pageTitle = 'Example of ludo form components';
require_once("../includes/demo-header.php");
?>
<body>
<script type="text/javascript" src="../../src/form/combo.js"></script>
<script type="text/javascript" src="../../src/menu/button.js"></script>
<style type="text/css">
.ludo-form-text-element input, .ludo-form-text-element textarea{
    border:0;
    padding:0;
    outline: none;
}
.ludo-form-text-element{
    border:1px solid #ccc;
    background-color:#FFF;
    padding:1px;
}


</style>
<script type="text/javascript" src="../../src/form/slider.js"></script>
<script type="text/javascript" src="../../src/form/date.js"></script>
<script type="text/javascript" class="source-code">

    new ludo.Window({
        id:'myWindow',
        title:'Form components',
        layout:{
            type:'cols'
        },
        height:400,
        width:650,
        left:50,
        top:30,

        children:[
            {
                formConfig:{
                    labelWidth:130
                },
                weight:1,
                layout:'rows',
                children:[
                    { type:'form.Text', 'label':'First name', ucWords:true, stretchField:true, name:'firstname', value:'', required:true },
                    { type:'form.Text', 'label':'Last name', ucWords:true, stretchField:true, value:'', name:'lastname' },
                    { type:'form.Email', 'label':'E-mail', stretchField:true, name:'email', value:'' },
                    { type:'form.Textarea', label:'Address', ucFirst:true, stretchField:true, name:'address', value:'', weight:1}
                ]
            },
            {
                formConfig:{
                    labelWidth:130
                },
                weight:1,
                overflow:'hidden',
                layout:'rows',
                children:[
                    { type:'form.Text', 'label':'Phone', stretchField:true, name:'phone', value:'', required:true },
                    { type:'form.Text', minLength:4, 'label':'Zip code', stretchField:true, name:'zipcode', value:'' },
                    { type:'form.Text', name:'city', stretchField:true, 'label':'City', value:'' },
                    { type:'form.Date', name:'birth', readonly:true, id:'birth', stretchField:true, 'label':'Born'},
                    { type:'form.File', name:'picture', label:'Picture', value:'', height:25 },
                    { type:'form.DisplayField', label:'form.DisplayField', value:'My value'},
                    { type:'form.Checkbox', label:'I agree'},
                    { type:'form.Checkbox', image:'../images/radio-image-bg.png', label:'Checkbox with image'},
                    { type:'form.Slider',  id:'mySlider', direction:'horizontal', label:'form.Slider', value:10, minValue:0, maxValue:255 },
                    { type:'form.Number', label:'form.Number(linked)', minValue:0,maxValue:255, fieldWidth:50, maxLength:3, suffix:'RGB Color', linkWith:'mySlider'}
                ]}
        ],

        buttonBar:{
            align:'left',
            children:[
                { type:'form.Button', toggle:true, icon:'../images/icon-left.png', value:'Left', width:80, toggleGroup:'alignment' },
                { type:'form.Button', toggle:true, icon: '../images/icon-center.png', value:'Center', width:80, toggleGroup: 'alignment' },
                { type:'form.Button', toggle:true, icon:'../images/icon-right.png', value:'Right', width:80, toggleGroup: 'alignment' },
                {
                    weight:1
                },
                {
                    type:'form.SubmitButton'
                },
                {
                    type:'form.ResetButton'
                },
                {
                    type:'form.CancelButton'
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