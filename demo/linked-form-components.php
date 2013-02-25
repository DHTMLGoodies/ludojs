<?php
$pageTitle = 'Linked form components';
require_once("includes/demo-header.php");
?>
<body>

<script type="text/javascript" class="source-code">

var w = new ludo.Window({
    left:650,
    top:20,
    layout:'rows',
    title:'Linked text fields',
    children:[
        { label:'Field 1', id:'field1', linkWith:'field2', stretchField:true, type:'form.Text', name:'firstname'},
        { label:'Field 2', id: 'field2', stretchField:true, name:'address', type: 'form.Text', value:'', weight:1}
    ]
});
</script>

</body>
</html>