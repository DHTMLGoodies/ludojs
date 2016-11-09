<?php
$pageTitle = 'LudoJS Notification demo';
require_once("includes/demo-header.php");
?>
<body>
<script type="text/javascript" class="source-code">
    var win = new ludo.View({
        id: 'videowin',

        hideBodyOnMove: true,
        renderTo: document.body,
        title: 'YouTube Video',
        layout: {
            width: 'matchParent', height: 'matchParent', type: 'relative'
        },
        children: [
            {
                id: 'button1',
                layout: {
                    width: 250
                },
                type: 'form.Button',
                value: 'Show Centered Notification',
                listeners: {
                    'click': function () {
                        new ludo.Notification({html: 'A new notification',autoRemove:true});
                    }
                }
            },
            {

                id: 'button2',
                type:'form.Button',
                value: 'Show positioned Notification',
                elCss:{
                    marginTop:20
                },
                layout: {
                    below: 'button1',
                    width: 250

                },
                listeners: {
                    'click': function () {
                        new ludo.Notification({
                            html: 'This is a positioned Notification',
                            autoRemove:true,
                            layout: {
                                alignTop: 'button2',
                                rightOf:'button2'
                            }
                        });
                    }
                }

            },
            {
                id:'heading',
                html: '<h1>Source Code</h1>',
                layout:{
                    below:'button2',height:50,width:'matchParent'
                }
            },
            {
                layout:{
                    below:'heading',
                    height:400
                },
                css:{
                    overflow:'auto',
                    'background-color': '#fff',
                    border:'1px solid #ddd'
                },
                type:'SourceCodePreview'
            }
        ]
    });
</script>



</body>
</html>