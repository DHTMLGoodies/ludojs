<?php
$sub = true;
$pageTitle = 'SVG Clipping - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">

    var v = new ludo.FramedView({
        title: 'SVG Clipping',
        renderTo: document.body,
        layout: {
            width: 'matchParent',
            height: 'matchParent',
            type:'tabs',
            tabs:'left'
        },
        children:[
            {
                id:'demoView',
                title:'Transformation Demo'
            },
            {
                type:'SourceCodePreview'
            }
        ]
    });

    // Get reference to SVG surface
    var c = ludo.$('demoView').getCanvas();

    var c2 = c.$('circle', { cx: 100, cy: 100, r : 20});
    c2.css('fill', '#000');
    c.append(c2);

    var rect = c.$('rect', { x : 50, y: 50, width: 100, height: 100});
    rect.css({ fill : '#660000', 'fill-opacity' : 0.3 });
    c.append(rect);

    rect.rotate(20, 100, 100);


    var circle = c.$('circle', { cx: 200, cy: 150, r: 50 });
    c.append(circle);
    circle.css({ fill: '#006699'});
    circle.translate(140,100);

    var circle2 = c.$('circle', { cx: 200, cy: 150, r: 50 });
    c.append(circle2);
    circle2.css({ fill: '#006699', 'fill-opacity' : 0.5});


    var polygon = c.$('polygon', {points: '10 10 100 20 150 100'});
    polygon.css('fill', '#660099');
    c.append(polygon);

    polygon.animate({
        translate: [500,400]
    }, 300);

    var rect2 = c.$('rect', { x : 0, y: 0, width: 120, height: 100});
    rect2.css({ fill : '#669900' });
    c.append(rect2);

    rect2.translate(200,250);

    function animate(){
        rect2.animate({
            rotate: [360, 60, 50 ]
        }, 4000, ludo.canvas.easing.bounce, animate);
    }

    animate();


    var ellipse = c.$('ellipse', {
        cx: 600,cy:150,
        rx:50,ry:50
    });

    ellipse.css({
        'fill': '#303F9F',
        'stroke': '#fff',
        'stroke-width' : 5
    });
    c.append(ellipse);

    function animateEllipseX(){
        ellipse.animate({
            rx: 100, ry: 50
        }, 1500, ludo.canvas.easing.bounce, animateEllipseY);
    }

    function animateEllipseY(){
        ellipse.animate({
            rx: 50, ry: 100
        }, 1500, ludo.canvas.easing.bow, animateEllipseX);
    }

    animateEllipseX();

    </script>
</body>
</html>
