<?php
$pageTitle = 'Progress bar demo';
require_once("includes/demo-header.php");
?>
<body>
<script type="text/javascript" class="source-code">
    new ludo.Window({
        id:'progress-bar-window',
        left:50, top:50,
        title:'ProgressBar demo',
        width:300, height:200,
        form:{
            url:'resources/progress-bar.php'
        },
        layout:'rows',
        children:[
            { html:'Click on Submit will demonstrate the progress bar '},
            { type:'progress.Bar', url:'resources/progress-bar.php', pollFrequence:.5, listeners:{
                finish:function () {
                    var cmp = ludo.get('progress-bar-window')
                    cmp.dispose.delay(1000, cmp);
                }
            } },
            { type:'progress.Text', url:'resources/progress-bar.php', tpl:'Current Status: {text}' }
        ],
        listeners:{
            'submit':function () {
                /* You will usually hide the component here */
            }
        },
        buttonBar:[
            {
                type:'form.SubmitButton', value:'Submit'
            }
        ]
    });
</script>
</body>
</html>