<?php
$sub = true;
$pageTitle = 'Bar Chart - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">

    var v = new ludo.View({
        renderTo: document.body,
        layout: {
            width: 'matchParent', height: 'matchParent'
        },
        css: {
            'background-color': '#eee'
        }
    });

    var c = v.getCanvas();
    c.addStyleSheet('box', {
        fill: '#445566'
    });

    var rect = new ludo.canvas.Rect({
        x:0,y:0,width:500,height:500
    });
    rect.css({
        'stroke' : '#ff0000'
    });
    rect.addClass('box');

    c.append(rect);

    var circle = new ludo.canvas.Circle({
        cx: 100, cy: 110, r: 5
    });
    circle.css({
        fill: '#660000'
    });
    c.append(circle);

    var rect = new ludo.canvas.Rect({
        x: 400, y: 50, width: 100, height: 100
    });
    rect.css({
        'fill': '#669900'
    });
    c.append(rect);



    var firstAnimation = function(){
        circle.animate({
                translate: [300,300],
                r: 20
            }, 2000, ludo.canvas.easing.inOutQuad,
            function () {
                secondAnimation.call();
            },
            function (node, delta, elapsed0To1) {
                // console.log(delta);

            }
        );

    };

    var secondAnimation = function(){
        circle.animate({
                translate: [0, 0],
                r: 5
            }, 2000, ludo.canvas.easing.inOutQuad,
            function () {
                firstAnimation.call();
            },
            function (node, delta, elapsed0To1) {
                // console.log(delta);

            }
        );
    };

    firstAnimation.call();


    var rectAnim = function(){
        rect.animate({
            translate:[0,500]
        },1500, ludo.canvas.easing.inCubic,
            function(){
                rectAnim2.call();
            }
        );
    };

    var rectAnim2 = function(){
        rect.animate({
            translate:[0,0]
        },1500, undefined,
            function(){
                rectAnim.call();
            })
    };

    rectAnim.call();






</script>