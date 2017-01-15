<?php
$sub = true;
$pageTitle = 'Progress Bar Demo';
require_once("../includes/demo-header.php");
?>

<style type="text/css">
    .ludo-progress-bg {
        background-color: #444;
        border: 2px solid #333333;
    }

    .ludo-progress-pr {
        background-color: #1976D2;

    }

    .ludo-progress-text {
        color: #FFFFFF;
        font-size: 12px;
    }

    .ludo-progress-donut-bg {
        background-color: #444444;
        border: 2px solid #333333;
    }

    .ludo-progress-donut-bar {
        background-color: #1976D2;
    }

</style>
<script type="text/javascript" class="source-code">

    var v = new ludo.View({
        renderTo: document.body,
        layout: {
            width: 'matchParent', height: 'matchParent',
            type: 'tabs'
        },

        children: [
            {
                title: 'Progress Bar Sample',
                layout: {
                    type: 'relative'
                },
                children: [
                    {
                        id: 'progress',
                        type: 'progress.Bar',
                        borderRadius: 3,
                        steps: 100,
                        animationDuration: 1000,
                        elCss: {
                            margin: 2
                        },
                        layout: {
                            width: 300,
                            centerHorizontal: true,
                            alignParentTop: true
                        },
                        listeners:{
                            animate:function (percent) {
                                this.text(percent.toFixed(0) + '%');
                            }
                        }
                    },
                    {
                        id: 'buttontop',
                        elCss: {
                            'margin-top': 10
                        },
                        type: 'form.Button',
                        value: 'Rerun first Progress Bar',
                        listeners: {
                            'click': function () {
                                ludo.$('progress').setProgress(0, false);
                                ludo.$('progress').percent(100, true);
                            }
                        },
                        layout: {
                            width: 150,
                            centerHorizontal: true,
                            below: 'progress'
                        }
                    },
                    {
                        id: 'progress2',
                        type: 'progress.Bar',
                        elCss: {
                            margin: 4
                        },
                        textSizeRatio: 0.5, // Size of text relative to height of progress bar
                        borderRadius: 3, // Border radius, if not set it will be height / 2
                        steps: 100, // Number of steps
                        progress: 88, // Current progress
                        // Background pattern displayed on top of background
                        // The background pattern usually don't have 100% opacity
                        bgPattern: '../images/rect-pattern.png',
                        // Front pattern displayed on top of moving progress bar, also with some transparency
                        frontPattern: '../images/progress-pattern.png',
                        backgroundStyles: {
                            /* Custom styles fro the background */
                            'stroke-width': 2
                        },
                        layout: {
                            height: 26,
                            width: 'matchParent',
                            centerHorizontal: true,
                            below: 'buttontop'
                        },
                        barStyles: {
                            fill: '#388E3C',
                            stroke: '#388E3C'
                        },
                        listeners: {
                            'animate': function (percent) {
                                var prs = percent.toFixed(0);
                                ludo.$('progress-status').html(prs + '% Completed');
                            }
                        }
                    },
                    {
                        id: 'progress-status',
                        html: '0% Completed',
                        type: 'ludo.View',
                        layout: {
                            height: 40,
                            width: 300,
                            centerHorizontal: true,
                            below: 'progress2'
                        },
                        css: {
                            'font-size': 25,
                            'text-align': 'center'
                        }
                    },
                    {
                        id: 'button',
                        type: 'form.Button',
                        value: 'Increment bar',

                        elCss: {
                            'margin-top': 10
                        },
                        listeners: {
                            'click': function () {
                                ludo.$('progress2').increment();
                            }
                        },
                        layout: {
                            width: 120,
                            centerHorizontal: true,
                            below: 'progress-status'
                        }
                    },
                    {
                        id: 'resetButton',
                        elCss: {
                            'margin-top': 10
                        },
                        type: 'form.Button',
                        value: 'Reset bar',
                        listeners: {
                            'click': function () {
                                ludo.$('progress2').setProgress(0, false);
                            }
                        },
                        layout: {
                            width: 120,
                            rightOf:'button',
                            below: 'progress-status'
                        }
                    },
                    {
                        id: 'donutProgress',
                        type: 'progress.Donut',
                        steps: 100,
                        progress: 0,
                        innerRadius: function(outerRadius){
                            return outerRadius * 0.7
                        },
                        frontPattern:'../images/pattern-color-wheel.png',
                        bgPattern:'../images/pattern-wheel.png',
                        animationDuration: 2000,
                        easing: ludo.svg.easing.outSine,
                        layout: {
                            width: 150, height: 150,
                            centerHorizontal: true,
                            below: 'resetButton'
                        },
                        elCss:{
                            'margin-top': 20
                        },
                        listeners: {
                            animate: function (percent) {
                                this.text(percent.toFixed(0) + '%');
                            },
                            change: function () {
                                if (this.progress == 100) {
                                    ludo.$('donutProgress2').increment(100);

                                }
                            }
                        },
                        text: '0%'
                    },
                    {
                        id: 'donutProgress4',
                        type: 'progress.Donut',
                        elCss:{
                            'margin-top': 20
                        },
                        steps: 100,
                        progress: 88,
                        layout: {
                            width: 150, height: 150,
                            rightOf:'donutProgress',
                            below: 'resetButton'
                        },
                        listeners:{
                            'change':function(percent){
                                this.text(percent.toFixed(0) + '%');
                            }
                        },
                        text: '0%'
                    },
                    {
                        id: 'donutProgress2',
                        type: 'progress.Donut',
                        steps: 100,
                        progress: 0,
                        innerRadius: function(outerRadius){
                            return outerRadius * 0.8
                        },
                        textSizeRatio: 0.27,
                        animationDuration: 2000,
                        backgroundStyles: {
                            'stroke-width': 0

                        },
                        barStyles: {
                            'fill': '#DDD',
                            'stroke-width': 0
                        },
                        layout: {
                            width: 50, height: 50,
                            centerHorizontal: true,
                            below: 'donutProgress'
                        },
                        listeners: {
                            animate: function (percent) {
                                this.text(percent.toFixed(0) + '%');
                            }
                        },
                        text: '0%'
                    },
                    {
                        type:'form.Button',
                        value:'Progress in Window',
                        layout:{
                           width:150,
                            below:'donutProgress2',
                            centerHorizontal:true
                        },
                        listeners:{
                            'click': showWindow
                        }
                    }
                ]
            },
            {
                type: 'SourceCodePreview'
            }
        ]


    });

    function showWindow(){
        new ludo.Window({
            title:'Color Progress',
            layout:{
                type:'fill',
                height:300,width:300,
                left:100, top: 100
            },
            children:[
                {
                    id: 'donutProgress3',
                    type: 'progress.Donut',
                    steps: 100,
                    progress: 0,
                    innerRadius: function(outerRadius){
                        return outerRadius * 0.7
                    },
                    frontPattern:'../images/pattern-color-wheel.png',
                    bgPattern:'../images/pattern-wheel.png',
                    easing: ludo.svg.easing.outSine,
                    listeners: {
                        animate: function (percent) {
                            this.text(percent.toFixed(0) + '%');
                        },
                        change: function () {
                            if (this.progress == 100) {
                                ludo.$('donutProgress2').increment(100);

                            }
                        }
                    },
                    text: '0%'
                }
            ],
            buttonBar:{
                children:[
                    {
                        type:'form.Button', value:'Increment',
                        listeners:{
                            click:function(){
                                ludo.$('donutProgress3').increment(10)
                            }
                        }
                    },
                    {
                        type:'form.Button', value:'Reset',
                        listeners:{
                            click:function(){
                                ludo.$('donutProgress3').setProgress(0)
                            }
                        }
                    }
                ]
            }
        });

    }


    var p = ludo.$('progress');



    p.increment(100);

    var donut = ludo.$('donutProgress');
    donut.increment(100);

</script>
</body>
</html>