<?php
$sub = true;
$pageTitle = 'SVG Masking - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">

    var v = new ludo.FramedView({
        title: 'SVG Masking Example',
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
                title:'Masking Demo'
            },
            {
                type:'SourceCodePreview'
            }
        ]
    });
    // Get reference to SVG surface
    var c = ludo.$('demoView').svg();

    // Create color util for easy color generation
    var colorUtil = new ludo.color.Color();
    var color = '#669900';

    // size of canvas
    var w = c.width;
    var h = c.height;

    // Create linear gradient. The gradient will be added to the mask tag
    // Everything that's white in the mask will be completely opaque. Black will be completely transparent and everything in between will
    // have some opacity.
    var gradient = c.$('linearGradient');
    c.append(gradient);
    // Add stop tags to the gradient
    var stop = c.$('stop', {
        offset:0,
        'stop-color': '#ffffff',
        'stop-opacity': 1
    });
    gradient.append(stop);
    var stop2 = c.$('stop', {
        offset:100, 'stop-color': '#ffffff', 'stop-opacity' : 0
    });
    gradient.append(stop2);
    c.appendDef(gradient);



    // Create mask
    var mask = c.$('mask');
    // Append rectangle to the clip path
    var clipRect = c.$('rect', {
        x:0,y:0,width:w,height:h
    });
    clipRect.set('fill', gradient);

    mask.append(clipRect);
    // Append clip path to svg
    c.appendDef(mask);



    // Create a group(g) tag which all circles and lines will be appended to. Mask will be added to the "g" tag.
    var g = c.$('g');
    c.append(g);

    // Apply clip path to the g tag.
    g.applyMask(mask);


    // Create lots of circle and lines
    var x,y, lastX,lastY;
    for(var i=0;i<20;i++){
        var r = 5 + (Math.random() * 15);
        x = Math.max(r, Math.random() * (w - r));
        y = Math.max(r, Math.random() * (h - r));

        if(lastX != undefined){
            var l = c.$('line', {
                x1: lastX,y1: lastY,
                x2: x, y2: y
            });
            l.css({
                stroke:color, 'stroke-width': 5
            });
            g.append(l);
        }

        var circle = c.$('circle', {
            cx : x,
            cy : y,
            r : r
        });
        circle.css('fill', color);
        g.append(circle);

        color = colorUtil.offsetHue(color, Math.random() * 20);

        lastX = x;
        lastY = y;
    }

    // Animate the stop opacity attribute
    var toOpacity = 1;
    function animate(){

        var a = toOpacity == 1 ? 0 : 1;
        stop.animate({
                'stop-opacity': a
            }, 2000, ludo.svg.easing.inOutSine);

        stop2.animate({
            'stop-opacity': toOpacity
        }, 2000, ludo.svg.easing.inOutSine,
        animate);
        toOpacity = toOpacity == 1 ? 0 : 1;
    }

    animate();





</script>