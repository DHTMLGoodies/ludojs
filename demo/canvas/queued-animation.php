<?php
$sub = true;
$pageTitle = 'SVG Clipping - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">

    var v = new ludo.FramedView({
        title: 'Queued Animation Example',
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
                title: 'Animation Demo'
            },
            {
                type: 'SourceCodePreview'
            }
        ]
    });

    // Get reference to SVG surface
    var c = ludo.$('demoView').getCanvas();

    var end = c.$('circle', {cx: 0, cy: 0, r: 10, 'fill': '#f00'});
    c.append(end);
    end.setTranslate(600, 600);

    var c2 = c.$('circle', {cx: 0, cy: 0, r: 10});

    c.append(c2);


    c2.setTranslate(100, 100);
    

    // Example of queued animation
    c2.animate({
            translate: ['+500', '+500'],
            fill: '#669900',
            r: 20
        }, {
            duration: 500
        }
    ).animate({
            translate: ['+100'],
            r:5
        }, {
            duration: 500
        }
    ).animate({
        translate:['+0','-100'],
        r: 15,
        fill: '#689F38'
    }).animate({
        translate:['-200','-300'],
        r:35,
        fill: '#FBC02D'
    }, { duration: 1200 }).animate({
        translate:['-200','400']
    }).animate({
        'r' : 200,
        'fill': '#00695C',
        'fill-opacity':0
    },{ duration: 1500 }).animate({
        'r' : 10,
        translate:[100,100],
        'fill-opacity':1
    },{ duration: 1500 });




</script>
</body>
</html>
