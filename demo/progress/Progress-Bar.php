<?php
$sub = true;
$pageTitle = 'Wizard demo';
require_once("../includes/demo-header.php");
?>
<body>
<script type="text/javascript" src="../../src/progress/base.js"></script>
<script type="text/javascript" src="../../src/progress/bar.js"></script>
<script type="text/javascript" src="../../src/progress/datasource.js"></script>
<script type="text/javascript" src="../../src/remote/broadcaster.js"></script>
<script type="text/javascript" class="source-code">
    var w = new ludo.Window({
        id:'myWindow',
        left:50, top:50,
        width:350, height:320,
        title:'',
        layout:{
            type:'linear',
            orientation:'vertical'
        },
        form:{
            'resource' : 'ProgressDemo'
        },
        children:[
            {
                name:'personalia',
                layout:{
                    type:'linear',
                    orientation:'vertical'
                },
                children:[
                    { type:'form.Text', name:'firstname', label:'Firstname', required:false,value:'Jane'},
                    { type:'form.Text', name:'lastname', label:'Lastname', required:false,value:'Johnson'},
                    { type:'form.Spinner', name:'age', label:'Age', stretchField:false, maxLength:3, value: 25, fieldWidth:50,minValue:8,maxValue:120 },
                    { type:'form.Textarea', name:'address', label:'Address', layout:{ weight:1 } },
                    { type:'form.Text', name:'zipcode', label:'Zip code'},
                    { type:'form.Text', name:'city', label:'City'},
                    { height:5 }

                ]
            }
        ],
        buttonBar:{
            align:'left',
            children:[
                {
                    type:'progress.Bar', weight:1, listenTo:'ProgressDemo/save'
                },
                {
                    type:'form.SubmitButton'
                }
            ]}
    });
</script>
</body>
</html>