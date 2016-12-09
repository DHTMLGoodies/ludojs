<?php
$sub = true;
$pageTitle = 'SVG Animation - Easing - ludoJS';
require_once("../includes/demo-header.php");
?>

<script type="text/javascript" class="source-code">

    var easing = ludo.canvas.easing.linear;

    function setEasing(e){

        easing = ludo.canvas.easing[e];
    }

    var v = new ludo.FramedView({
        title: 'SVG Animations Illustrated',
        renderTo: document.body,
        layout: {
            width: 'matchParent', height: 'matchParent',
            type:'linear',
            orientation:'vertical'
        },
        children:[
            {
                layout:{
                    height:30,
                    type:'table',
                    columns:[
                        { width: 100},
                        { weight: 1}

                    ]
                },
                css:{
                    padding:3
                },
                children:[
                    {type:'form.Label', label: 'Select Easing:' },
                    {
                        type:'form.Select', name:'easing',
                        valueKey:'easing', textKey : 'easing',
                        dataSource:{
                            data:[
                                { easing : 'linear' },
                                { easing: 'inQuad' },
                                { easing: 'outQuad' },
                                { easing: 'inOutQuad' },
                                { easing: 'inCubic' },
                                { easing: 'outCubic' },
                                { easing: 'inOutCubic' },
                                { easing: 'inQuart' },
                                { easing: 'outQuart' },
                                { easing: 'inOutQuart' },
                                { easing: 'inQuint' },
                                { easing: 'outQuint' },
                                { easing: 'inOutQuint' },
                                { easing: 'inSine' },
                                { easing: 'outSine' },
                                { easing: 'inOutSine' },
                                { easing: 'inExpo' },
                                { easing: 'outExpo' },
                                { easing: 'inOutExpo' },
                                { easing: 'inCirc' },
                                { easing: 'outCirc' },
                                { easing: 'inOutCirc' }
                            ]
                        },
                        listeners:{
                            'change': function(value){
                                setEasing(value);
                            }
                        }
                    }
                ]
            },
            {
                id:'svgView',
                css: {
                    'background-color': '#aeb0b0'
                },
                layout:{
                    weight:1
                }
            }

        ]



    });

    var c = ludo.$('svgView').getCanvas();
    c.addStyleSheet('box', {
        fill: '#669900'
    });

    var t = new ludo.canvas.Text('Click to run Animation', {
        x:c.width/2, y:c.height / 2
    });

    t.css({
        'font-size' : '22px', fill:'#FFF'
    });
    t.textAnchor('middle');
    c.append(t);


    c.addStyleSheet('illustration', {
        fill: '#E57373', 'fill-opacity' : 1
    });

    var circle = new ludo.canvas.Circle({
        cx: 100, cy: 110, r: 10
    });
    circle.addClass('box');
    c.append(circle);

    var illustrationNodes = [];
    var illIndex = 0;

    function getIllustrationNode(){
        var node;
        if(illIndex >= illustrationNodes.length){
            node = new ludo.canvas.Circle({ cx:0,cy:0, r: 3 });
            node.addClass('illustration');
            c.append(node);
            illustrationNodes.push(node);
            circle.toFront();
        }else{
            node = illustrationNodes[illIndex];
        }
        illIndex++;
        return node;
    }

    function moveIllustrationNodes(){

        var x = circle.attr('cx');
        var y = circle.attr('cy');
        for(var i=0;i<illustrationNodes.length;i++){
            illustrationNodes[i].attr('cx', x);
            illustrationNodes[i].attr('cy', y);
        }
        circle.toFront();
    }

    c.node.on('click', function(e){

        var x = e.clientX;
        var y = e.clientY;

        illIndex = 0;

        moveIllustrationNodes();
        circle.animate({
                cx:x, cy:y
            }, 600, easing,
            function (node) {

            },
            function (node, vals) {
                // console.log(delta);
                var n = getIllustrationNode();
                n.attr('cx', vals.cx);
                n.attr('cy', vals.cy);


            }
        );
    });

    function getEasing(){
        return easing;
    }










</script>