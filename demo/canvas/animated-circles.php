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


    var colorUtil = new ludo.color.Color();
    
    var circles = [];

    var maxX = 800, maxY = 600;
    
    for(var i=0;i<50;i++){
        
        var circle = c.$('circle', {
            r: Math.round(Math.random() * 20) + 5,
            fill: colorUtil.randomColor()
        });

        circle.setTranslate(Math.round(Math.random() * maxX),Math.round(Math.random() * maxY));

        c.append(circle);

        circles.push(circle);
    }


    function animate(circle){

        var fn = function(){
            animate.delay(Math.round(Math.random() * 2000) + 300, this, circle)
        };

        circle.animate({
            translate:[Math.round(Math.random() * maxX),Math.round(Math.random() * maxY)],
            r: Math.round(Math.random() * 40) + 5

        },
            {
                duration:1200,
                complete:fn,
                easing:ludo.canvas.easing.outCubic
            });

    }

    for(var i=0;i<circles.length;i++){
        animate(circles[i]);
    }

</script>
</body>
</html>
