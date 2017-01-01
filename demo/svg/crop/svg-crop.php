<?php
$sub = true;
$prefix = "../../";
$pageTitle = 'SVG Crop Tool';
require_once("../../includes/demo-header.php");
?>
<script type="text/javascript" src="crop.js?rnd=3"></script>
<script type="text/javascript" class="source-code">


    var v = new ludo.Window({
        title: 'SVG Crop Tool',
        renderTo: document.body,
        layout: {
            width: '800', height: '600',
            left:50,top:50,
            minWidth:400,
            minHeight:400,
            type: 'fill'
        },
        children: [
            {
                id: 'cropTool',
                type: 'svgCrop.CropTool',
                listeners: {
                    'crop': function (cropArea) {
                        new ludo.Notification({
                                html: 'Crop event : ' + JSON.stringify(cropArea),
                                layout: {
                                    centerIn: ludo.$('cropTool')
                                }
                            }
                        );

                    }
                }
            }

        ]
    });

    ludo.$('cropTool').setPicture('../../images/drawing-big.png');


</script>
</body>
</html>