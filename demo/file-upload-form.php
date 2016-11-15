<?php
$pageTitle = 'File upload demo';
require_once("includes/demo-header.php");
?>

<script type="text/javascript">

var w = new ludo.Window({
    left:50,top:50,
    title : 'File upload form',
    width: 400,height:200,
    form: {
        url: 'server-file-upload-form.php'
    },
    layout : {
        'type' : 'linear',
        'orientation' : 'vertical'
    },
    children : [
        { type: 'form.Text', name:'title','label':'Title'},
        { type: 'form.File', name:'fileOne','label':'File 1',value:'green.psd',instantUpload:false },
        { type: 'form.File', name:'fileTwo','label':'File 2',value:'gray.psd',instantUpload:false }
    ],
    buttonBar : [
        {
            type:'form.SubmitButton'
        },{
            type : 'form.ResetButton'
        }
    ]
});


</script>
</body>
</html>