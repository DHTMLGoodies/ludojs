<?php
$pageTitle = 'Model/Form demo';
require_once("includes/demo-header.php");
?>



<script type="text/javascript" class="source-code">
ludo.config.setUrl('controller.php');
ludo.config.disableModRewriteUrls();
var myWin = new ludo.Window({
    title:'Form/Model demo',
    layout:{
        type:'linear',
        orientation:'horizontal'
    },
    height:300,
    width:600,
    left:50,
    top:20,
    model:{
        id:'myModel',
        name:'User',
        columns:['id', 'firstname', 'lastname', 'address', 'email', 'phone', 'zipcode', 'city','picture'],
        recordId:100
    },
    children:[
        {
            weight:1,
            layout:{
                type:'linear',
                orientation:'vertical'
            },
            children:[
                { type:'form.Text', 'label':'First name', ucWords:true, stretchField:true, name:'firstname', value:'', required:true, layout: { height:25 } },
                { type:'form.Text', 'label':'Last name', ucWords:true, stretchField:true, value:'', name:'lastname' },
                { type:'form.Email', 'label':'E-mail', stretchField:true, name:'email', value:'' },
                { type:'form.Textarea', label:'Address', ucFirst:true, stretchField:true, name:'address', value:'', weight:1}
            ]
        },
        {
            weight:1,
            overflow:'hidden',
            layout:{
                type:'linear',
                orientation:'vertical'
            },
            children:[
                { type:'form.Text', 'label':'Phone', stretchField:true, name:'phone', value:'', required:true, layout: { height:25 } },
                { type:'form.Text', minLength:4, 'label':'Zip code', stretchField:true, name:'zipcode', value:'' },
                { type:'form.Text', name:'city', stretchField:true, 'label':'City', value:'' },
                { type:'form.Text', name:'Free text', label:'Not model field', value:'Free text' },
                { type:'form.File', name:'picture', label:'Picture', value:'' },
                { type : 'View', tpl : '{firstname}', name : 'picturepreview', weight:1},
                { html : '<a href="#" onclick="ludo.get(\'myModel\').load(100);return false">Load first user</a><br><a href="#" onclick="ludo.get(\'myModel\').load(101);return false">Load second user</a>'}
            ]}
    ],

    buttonBar:{
        children:[
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
    }
});
ludo.get('myModel').addEvent('saved', function(){
    new ludo.dialog.Alert({
        title:'Thank you!',
        resizable:true,
        html:'Thank you. Your data has been saved..'
    })
})
</script>

</body>
</html>