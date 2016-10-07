<?php
$sub = true;
$pageTitle = 'Canvas Demo - ludoJS';
require_once("../includes/demo-header.php");
?>
<body>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/engine.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/canvas/mask.js"></script>


<h1>Canvas API with Drag And Drop (iPad compatible)</h1>

<!--<script type="text/javascript"><!--
google_ad_client = "ca-pub-0714236485040063";
/* LudoJS */
google_ad_slot = "6617755948";
google_ad_width = 336;
google_ad_height = 280;
//--><!--
</script>
<script type="text/javascript"
        src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>-->
<script type="text/javascript">
    var dd = new ludo.canvas.Drag();
    dd.addEvent('before', function (dragged) {
        ludo.canvasEngine.toFront(dragged.el.getEl());
    });

    var win = new ludo.Window({
        stateful:true,
        id:'canvasWindow',
        minWidth:100, minHeight:100,
        left:90, top:90,
        width:730, height:490,
        title:'Canvas - The dynamically created SVG shapes below are draggable',
        layout:'rows',
        css:{
            'background-color':'#FFF'
        }
    });
    var canvas = win.getCanvas();

    var paint = new ludo.canvas.Paint({
            'fill':'#999',
            'stroke':'#DEF',
            'stroke-width':'5',
            cursor:'pointer',
            'fill-opacity':.8

    });
    canvas.adopt(paint);
    var paintTwo = new ludo.canvas.Paint({
        'fill':'orange',
        'stroke':'#D90000',
        'stroke-width':'5',
        'opacity':.8,
        cursor:'pointer'

    });
    canvas.adopt(paintTwo);

    var d = new Date();
    for (var i = 0; i < 4; i++) {
        var circle = new ludo.canvas.Node('circle', { cx:180 + (i * 40), cy:130 + (i * 40), r:35 + (i * 3) });
        canvas.adopt(circle);
        dd.add(circle);
    }
    if (window.console !== undefined)console.log(new Date().getTime() - d.getTime());

    var gradient = new ludo.canvas.Gradient({
        id:'myGradient'
    });
    canvas.adopt(gradient);
    gradient.addStop('0%', '#0FF');
    gradient.addStop('100%', '#FFF', 0);

    var paintThree = new ludo.canvas.Paint({
        'fill':gradient,
        'stroke':'#888',
        'stroke-width':'5',
        cursor:'pointer'
    },{
        selectors:'rect,circle'
    });
    canvas.adopt(paintThree);
    circle = new ludo.canvas.Circle({cx:280, cy:280, r:85, "class": paintTwo});
    canvas.adopt(circle);

    dd.add(circle);
    var rect = new ludo.canvas.Rect({x:180, y:100, width:150, height:50, rx:5, ry:5});
    canvas.adopt(rect);

    dd.add({
        el:rect
    });

    var polygon = new ludo.canvas.Polygon('200,200 350,350,150,290 140 240', { "class" :paintTwo });
    canvas.adopt(polygon);
    dd.add(polygon);

    var ellipse = new ludo.canvas.Ellipse({ cx:100, cy:125, rx:50, ry:70 });
    canvas.adopt(ellipse);
    dd.add(ellipse);

    var path = new ludo.canvas.Path('M 400 100 L 200 200 Q 350 150 300 100 Z', { "class" :paint })
    canvas.adopt(path);

    dd.add(path);


    var filter = new ludo.canvas.Filter({ id:'myFilter', filterUnits:'userSpaceOnUse'});
    canvas.adopt(filter);
    filter.add('feGaussianBlur', { "in":"SourceAlpha", "stdDeviation":4, result:"blur"});
    filter.add('feOffset', { "in":"blur", "dx":4, dy:"4", result:"offsetBlur"});
    var light = filter.add('feSpecularLighting', {
        "in":"blur",
        surfaceScale:5,
        specularConstant:".75",
        specularExponent:20,
        "lighting-color":"#bbbbbb",
        result:"specOut"
    });
    light.add('fePointLight', { x: -5000, y:-10000, z:20000});
    filter.add('feComposite', { "in": "specOut", "in2": "SourceAlpha", operator:"in", result:"specOut"})
    filter.add('feComposite', { "in": "SourceGraphic", "in2": "specOut", operator:"arithmetic", "k1":0,"k2":1,k3:1,k4:0, result:"litPaint"})
    filter.addFeMergeNode('offsetBlur');
    filter.addFeMergeNode('litPaint');



    var topGroup = canvas.add('g', { id : 'myGroup'} );
    topGroup.setStyle('cursor', 'pointer');
    var g = topGroup.add('g');
    g.add('path', { fill : 'none', stroke : '#D90000', 'stroke-width' : 10, d: 'M50,90 C0,90 0,30 50,30 L150,30 C200,30 200,90 150,90 z'});
    g.add('path', { fill : '#D90000', d: 'M60,80 C30,80 30,40 60,40 L140,40 C170,40 170,80 140,80 z'});
    var g2 = g.add('g', { fill : '#FFFFFF', stroke : 'black', 'font-size' : 45, 'font-family' : 'Verdana'});
    var t = g2.add('text', { x: 52, y:76 }, 'SVG');


    topGroup.applyFilter(filter);
    polygon.applyFilter(filter);

    dd.add(topGroup);

    var mask = new ludo.canvas.Mask();
    canvas.adoptDef(mask);

    var gr = new ludo.canvas.Gradient({
        id:'gradient2'
    });
    canvas.adopt(gr);
    gr.addStop('0%', 'white', 0);
    gr.addStop('100%', 'white', 1);

    var rect2 = new ludo.canvas.Rect({ x:0,y:0, width:500,height:500, fill:gr });

    mask.adopt(rect2);
    ellipse.applyMask(mask);



</script>

</body>
</html>