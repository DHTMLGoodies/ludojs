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

</style>
<script type="text/javascript" class="source-code">

    var v = new ludo.View({
        renderTo: document.body,
        layout: {
            width: 'matchParent', height: 'matchParent',
            type: 'tabs'
        },

        children:[
            {
                title:'Progress Bar Sample',
                layout:{
                    type:'relative'
                },
                children: [
                    {
                        id: 'progress',
                        type: 'progress.Bar',
                        borderRadius: 3,
                        steps: 100,
                        elCss:{
                            margin:2
                        },
                        layout: {
                            width: 300,
                            centerHorizontal: true,
                            alignParentTop: true
                        }
                    },
                    {
                        id:'buttontop',
                        elCss:{
                            'margin-top':10
                        },
                        type:'form.Button',
                        value:'Rerun first button',
                        listeners:{
                            'click': function(){
                                ludo.$('progress').setProgress(0, false);
                                ludo.$('progress').percent(100, true);
                            }
                        },
                        layout:{
                            width:120,
                            centerHorizontal: true,
                            below:'progress'
                        }
                    },
                    {
                        id: 'progress2',
                        type: 'progress.Bar',
                        textSizeRatio:0.5,
                        steps:20,
                        elCss:{
                            margin:4
                        },
                        progress:0,
                        backgroundStyles:{
                            'stroke-width': 1
                        },
                        layout: {
                            height:24,
                            width: 'matchParent',
                            centerHorizontal: true,
                            below: 'buttontop'
                        },
                        barStyles:{
                            fill:'#388E3C',
                            stroke:'#388E3C'
                        },
                        listeners:{
                            'animate':  function(percent){
                                var prs = percent.toFixed(0);
                                ludo.$('progress-status').html(prs + '% Completed');
                            }
                        }
                    },
                    {
                        id:'progress-status',
                        html:'0% Completed',
                        type:'ludo.View',
                        layout:{
                            height:40,
                            width:300,
                            centerHorizontal: true,
                            below:'progress2'
                        },
                        css:{
                            'font-size' : 25,
                            'text-align': 'center'
                        }
                    },
                    {
                        id:'button',
                        type:'form.Button',
                        value:'Increment bar',
                        elCss:{
                            'margin-top':10
                        },
                        listeners:{
                            'click': function(){
                                ludo.$('progress2').increment();
                            }
                        },
                        layout:{
                            width:120,
                            centerHorizontal: true,
                            below:'progress-status'
                        }
                    },
                    {
                        id:'resetButton',
                        elCss:{
                            'margin-top':10
                        },
                        type:'form.Button',
                        value:'Reset bar',
                        listeners:{
                            'click': function(){
                                ludo.$('progress2').setProgress(0, false);
                            }
                        },
                        layout:{
                            width:120,
                            centerHorizontal: true,
                            below:'button'
                        }
                    }
                ]
            },
            {
                type:'SourceCodePreview'
            }
        ]



    });

    var p = ludo.$('progress');

    p.on('animate', function (percent) {
        p.text(percent.toFixed(0) + '%');
    }.bind(p));

    p.increment(100);


</script>
</body>
</html>