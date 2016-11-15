<?php
$pageTitle = 'Image Crop demo';
require_once("includes/demo-header.php");
?>





<script type="text/javascript" src="image-crop/crop.js"></script>
<script type="text/javascript" src="image-crop/controller.js"></script>
<script type="text/javascript" src="image-crop/canvas.js?rnd=123"></script>
<script type="text/javascript" src="image-crop/controls.js"></script>
<script type="text/javascript" src="image-crop/crop-area.js"></script>
<script type="text/javascript" src="image-crop/image.js"></script>
<script type="text/javascript" src="image-crop/handle.js"></script>
<script type="text/javascript" class="source-code">


new ludo.Window({
    width : 500,
    height: 520,
    left:50,
    top:50,
    title:'Image Crop',
    children:[{
        type : 'crop.Crop',
        id:'crop'
    }],
    buttonBar:{
        children:[{
            type : 'form.SubmitButton', value : 'Crop'
        }]
    }
});

ludo.get('crop').loadImage('image-crop/images/nasa.jpg');


</script>
</body>
</html>