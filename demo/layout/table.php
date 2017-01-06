<?php
$sub = true;
$pageTitle = 'Table layout';
require_once("../includes/demo-header.php");
?>

<style type="text/css">
    div.customView {
        border: 1px solid #C0C0C0;

        padding: 3px;
        background-color: #FFF;
    }
</style>
<script type="text/javascript" src="../../src/layout/relative.js"></script>
<script type="text/javascript" class="source-code">
    var w = new ludo.FramedView({
        title: 'Table layout',
        renderTo:document.body,
        layout: {
            width: 'matchParent', height: 'matchParent',
            type: 'tabs'
        },
        children: [
            {
                title: 'Demo',
                layout: {
                    type: 'table',
                    columns: [
                        {width: 80}, {width: 110}, {weight: 1}
                    ]
                },
                css: {
                    border: 0
                },
                children: [
                    {html: 'First row 1 '},
                    {html: 'First row 2 '},
                    {
                        type: 'calendar.TimePicker',
                        layout: {
                            height: 200,
                            weight:1,
                            rowspan: 3
                        }
                    },
                    {html: 'Second row 1 ', layout: {row: true}},
                    {html: 'Second row 2 '},
                    {
                        html: 'Third and final row spanning 2 columns',
                        layout: {
                            row: true,
                            colspan:2,
                            vAlign : 'middle'
                        }
                    }
                ]

            },
            {
                type: 'SourceCodePreview'
            }
        ]
    });


</script>
</body>
</html>