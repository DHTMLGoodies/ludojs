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


    // Create color util instance for the circle colors
    var colorUtil = new ludo.color.Color();

    // Create array for the circle SVG nodes
    var circles = [];

    // Specify max x and y which is the size of the SVG
    var maxX = v.getBody().width(), maxY = v.getBody().height();

    // Create 50 SVG <circle> objects and put them in the circle array
    for (var i = 0; i < 50; i++) {

        var circle = c.$('circle', {
            r: Math.round(Math.random() * 20) + 5, // Random radius
            fill: colorUtil.randomColor() // Random color
        });

        // Random initial position
        circle.setTranslate(Math.round(Math.random() * maxX), Math.round(Math.random() * maxY));

        // Append circle to the SVG
        c.append(circle);

        // Add circle to the array.
        circles.push(circle);
    }


    // Recursively called animation function
    function animate(circle) {


        var fn = function () {
            animate.delay(Math.round(Math.random() * 2000) + 300, this, circle)
        };

        circle.animate(
            {
                translate: [Math.round(Math.random() * maxX), Math.round(Math.random() * maxY)],
                r: Math.round(Math.random() * 40) + 5

            },
            {
                duration: 1200, // 1.2 seconds
                complete: fn, // call fn Function on complete
                easing: ludo.canvas.easing.outCubic // Easing function
            });

    }

    // Animate all circles
    for (i = 0; i < circles.length; i++) {
        animate(circles[i]);
    }

</script>
</body>
</html>
