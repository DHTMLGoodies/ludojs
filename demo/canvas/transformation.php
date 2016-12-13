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


    // Rotation of rectangle
    var c2 = c.$('circle', { cx: 100, cy: 100, r : 20});
    c2.css('fill', '#000');
    c.append(c2);

    var rect = c.$('rect', { x : 50, y: 50, width: 100, height: 100});
    rect.css({ fill : '#660000', 'fill-opacity' : 0.3 });
    c.append(rect);

    rect.rotate(20, 100, 100);


    // Translate circle
    var circle = c.$('circle', { cx: 200, cy: 150, r: 50 });
    c.append(circle);
    circle.css({ fill: '#006699'});
    circle.translate(140,100);

    var circle2 = c.$('circle', { cx: 200, cy: 150, r: 50 });
    c.append(circle2);
    circle2.css({ fill: '#006699', 'fill-opacity' : 0.5});


    /**
     * Create polygon and animate translation transform
     */
    var polygon = c.$('polygon', {points: '10 10 100 20 150 100'});
    polygon.css('fill', '#660099');
    c.append(polygon);

    polygon.animate({
        translate: [500,400]
    }, 300);

    /**
     * Create rectangle and run rotation animation
     */
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


    /** Create Ellipse and animate it */
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

    // First animation function, animates x radius
    function animateEllipseX(){
        ellipse.animate({
            rx: 100, ry: 50
        }, 1500, ludo.canvas.easing.bounce, animateEllipseY);
    }
    // Second animation function animating y radius.
    function animateEllipseY(){
        ellipse.animate({
            rx: 50, ry: 100
        }, 1500, ludo.canvas.easing.bow, animateEllipseX);
    }
    // Run first animation function which triggers second on complete
    animateEllipseX();

    /**
     * Scaling transformation
     */

    var rect3 = c.$('rect', {
        x:50,y:400, width:100,height:150
    });
    rect3.css({
        fill:'#64B5F6',
        'fill-opacity': 0.5
    });
    c.append(rect3);

    var rect4 = c.$('rect', {
        x:0,y:0, width:100,height:200
    });
    rect4.css({
        fill:'#64B5F6',
        'fill-opacity': 0.5
    });
    c.append(rect4);

    rect4.setTranslate(50,350);

    rect4.translate(-25,-25);
    rect4.setScale(1.5,1.5);




    </script>
</body>
</html>
