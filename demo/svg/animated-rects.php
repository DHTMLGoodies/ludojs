<?php
$sub = true;
$pageTitle = 'SVG Animations - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">

    var v = new ludo.FramedView({
        title: 'SVG Animations',
        renderTo: document.body,
        layout: {
            width: 'matchParent',
            height: 'matchParent',
            type: 'tabs',
            tabs: 'left'
        },
        children: [
            {
                id: 'demoView',
                title: 'Transformation Demo'
            },
            {
                type: 'SourceCodePreview'
            }
        ]
    });

    // Get reference to SVG surface
    var c = ludo.$('demoView').getCanvas();


    // Create color util instance for the rect colors
    var colorUtil = new ludo.color.Color();

    // Create array for the rect SVG nodes
    var rects = [];

    // Specify max x and y which is the size of the SVG
    var maxX = v.getBody().width(), maxY = v.getBody().height();
    var spacing = 4;

    // Create 50 SVG <rect> objects and put them in the rect array
    for (var i = 0; i < 50; i++) {

        var w = (maxX / 50);

        var h = Math.floor(Math.random() * maxY);
        var rect = c.$('rect', {
            width:w - spacing,
            x: spacing + (w * i),
            y : maxY - h,
            height:h,
            fill: colorUtil.randomColor({ v: 100 }) // Random color
        });

        // Append rect to the SVG
        c.append(rect);

        // Add rect to the array.
        rects.push(rect);
    }


    function animate(i){

        var rect = rects[i];
        var fn = function () {
            animate.delay(Math.round(Math.random() * 2000) + 300, this, i)

        };

        var h = Math.random() * maxY;

        rect.animate({
            height:h,
            y: maxY - h
        },{
            complete:fn,
            easing: ludo.svg.easing.outSine,
            duration: (Math.random() * 1000) + 800
        });

    }

    // Animate all circles
    for (i = 0; i < rects.length; i++) {
        animate(i);
    }


</script>
</body>
</html>
