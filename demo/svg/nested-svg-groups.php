<?php
$sub = true;
$pageTitle = 'SVG Masking - ludoJS';
require_once("../includes/demo-header.php");
?>
<script type="text/javascript">

    ludo.factory.ns('groupTesting');

    groupTesting.Group = new Class({
        Extends: ludo.svg.Group,
        __rendered:function(){

            this.parent();


            var s = this.getSize();

            this.ellipse= this.$('ellipse', {
                cx: s.x/2,cy:s.y/2,
                rx: s.x/2,ry:s.y/2, fill: '#600',stroke:'#FFF'

            });

            this.append(this.ellipse);

            this.on('resize', this.resizeCircle.bind(this));
        },

        resizeCircle:function(){

            var s = this.getSize();
            this.ellipse.setProperties({
                cx: s.x/2,cy:s.y/2,
                rx: s.x/2,ry:s.y/2
            })
        }
    });
    new ludo.View({
        renderTo: document.body,
        id:'topView',
        layout: {
            type: 'Canvas',
            width: 'matchParent', height: 'matchParent'
        },
        children: [
            {
                id: 'group1',
                type: 'groupTesting.Group',
                layout: {
                    width: 200,
                    height: 'matchParent'
                }
            },
            {
                id: 'group2',
                type: 'svg.Group',
                layout: {
                    rightOf: 'group1',
                    height: 'matchParent',
                    fillRight:true
                },
                children:[
                    {
                        id:'group2_1',
                        type:'groupTesting.Group',
                        layout:{
                            width:'matchParent',
                            height:200
                        }
                    },
                    {
                        id:'group2_2',
                        type:'groupTesting.Group',
                        layout:{
                            below:'group2_1',
                            width:'matchParent',
                            fillDown:true
                        }
                    }
                ]
            }

        ]
    });

</script>
</body>
</html>