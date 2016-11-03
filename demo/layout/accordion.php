<?php
$sub = true;
$pageTitle = 'Accordion Layout';
require_once("../includes/demo-header.php");
?>
<body>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/base.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/renderer.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear-horizontal.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear-vertical.js"></script>
<style type="text/css">

</style>
<script type="text/javascript" class="source-code">
    var w = new ludo.Window({
        title:'Accordion layout',
        layout:{
            left:50, top:50,
            width:700, height:600,
            type:'accordion', // Render children in an accordion
            easing: 'swing', // easing for the animation. linear and swing are available. More can be found in jQuery plugins
            duration: 300 // 1/2 s duration for the animations
        },
        children:[ // Children for the accordion listed below
            {
                title: 'How to apply custom styling to your Accordion',// Title for the accordion
                dataSource:{ // Insert content from external file
                    type: 'dataSource.HTML',
                    url: 'includes/accordion-styling.html'
                },
                css:{
                    padding:5,
                    'font-size' : '1.2em'
                }
            },
            {
                title: 'Drawing', // Title for the accordion
                html: '<img src="../images/drawing.png" style="margin-right:5px;margin-bottom:5px;float:left">' +
                'This is a Charcoal drawing on Smooth Newsprint paper. <br>',
                css:{ // CSS styling for the view
                    padding:5,
                    'font-size' : '1.2em',
                    'overflow-y': 'auto'
                }
            },

            {
                title: 'Source Code',// Title for the accordion
                type:'SourceCodePreview',
                css:{
                    padding:5
                }
            }
        ]
    });
</script>
</body>
</html>