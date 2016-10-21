<?php
$sub = true;
$pageTitle = 'Example of ludo form components';
require_once("../includes/demo-header.php");
?>
<body>
<link rel="stylesheet" href="../../css-source/form/on-off-switch.css" type="text/css"/>
<style type="text/css">
    .ludo-form-text-element input, .ludo-form-text-element textarea {
        border: 0;
        padding: 0;
        outline: none;
    }
    body,html{margin:0;padding:0}

    .ludo-form-text-element {
        border: 1px solid #ccc;
        background-color: #FFF;
        padding: 1px;
    }

</style>
<script type="text/javascript" class="source-code">


    // Parent view is a View with a title bar
    var w = new ludo.FramedView({
        renderTo:document.body,
        id: 'myWindow',
        title: 'Basic Views',
        layout: {
            // for this demo, the demo it's self will be displayed in one tab and the source code in a second tab
            type: 'tabs',
            height:'matchParent',width:'matchParent'

        },
        css: {
            'border-top': 0
        },
        children: [
            {
                title: 'Views', // Tab title

                layout: {
                    // Child views will be rendered beneath each other
                    type: 'linear',
                    orientation: 'vertical' // horizontal will display children side by side.
                },
                css: {
                    padding: 10 // Padding inside the body
                },
                // Three children stacked beneath each other
                // The children are rendered inside the body &lt;div> of the parent
                children: [
                    {html: 'First view. Click Source code tab to see the code', layout: {height: 100}},
                    {html: 'Second View', layout: {height: 150 }},
                    {html:'Last View', layout:{ weight: 1 }} // This view will use all remaining space
                ]
            }, {
                type: 'SourceCodePreview'
            }
        ]
    });

</script>
</body>
</html>