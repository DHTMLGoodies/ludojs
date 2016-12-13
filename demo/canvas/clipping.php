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
                title:'Clipping Demo'
            },
            {
                type:'SourceCodePreview'
            }
        ]
    });

    // Get reference to SVG surface
    var c = ludo.$('demoView').getCanvas();

    // Create color util for easy color generation
    var colorUtil = new ludo.color.Color();
    var color = '#669900';

    // size of canvas
    var w = c.width;
    var h = c.height;

    // Create a group(g) tag which all circles and lines will be appended to. Clip path will be added to the "g" tag.
    var g = c.$('g');
    c.append(g);


    var clipCircleRadius = 150;
    // Create clip path
    var clipPath = c.$('clipPath');
    // Append circle to the clip path. We will later animate this circle
    var clipCircle = c.$('circle', {
        cx:100,cy:100, r: clipCircleRadius
    });
    clipPath.append(clipCircle);
    // Append clip path to svg
    c.append(clipPath);

    // Apply clip path to the g tag.
    g.applyClipPath(clipPath);

    var rect = new ludo.canvas.Rect({
        x:0,y:0,width:w,height:h
    });
    rect.css('fill', '#918777');
    g.append(rect);


    // Loop creating circles and lines
    var x,y, lastX,lastY;
    var lastColor;
    for(var i=0;i<20;i++){
        x = Math.random() * (w - 20);
        y = Math.random() * (h - 20);



        if(lastX != undefined){
            var l = c.$('line', {
                x1: lastX,y1: lastY,
                x2: x, y2: y
            });
            l.css({
                stroke: lastColor, 'stroke-width' : 5
            });
            g.append(l);
        }

        var circle = c.$('circle', {
            cx : x,
            cy : y,
            r : 5 + (Math.random() * 15)
        });
        circle.css('fill', color);
        g.append(circle);

        lastColor = color;
        color = colorUtil.offsetHue(color, Math.random() * 20);

        lastX = x;
        lastY = y;
    }

    var image = c.$('image', {
        width:600,height:852,
        x:50,y:50,
        'xlink:href' : '../images/drawing.png'
    });

    g.append(image);

    function animate(){
        var radius = clipCircleRadius;
        var toX = Math.max(radius, Math.random() * (w - radius));
        var toY = Math.max(radius, Math.random() * (h - radius));

        clipCircle.animate({
           cx:toX, cy:toY
        }, 1500, undefined,
        animate);
    }

    animate();


</script>