<?php
$sub = true;
$pageTitle = 'ViePager Layout demo';
require_once("../includes/demo-header.php");
?>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/base.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/view-pager.js"></script>

<body>
<script type="text/javascript" class="source-code">
    var w = new ludo.Window({
        id:'myWindow',
        left:50, top:50,
        width:310, height:285,
        resizable:false,
        title:'Swipe between pages',
        layout:{
            type: 'tabs'

        },
        children:[
            {
                title:'Demo',
                layout:{
                    animationDuration:250,
                    animate:true,
                    dragging:true,
                    type:'ViewPager',
                    orientation:'horizontal'
                },
                elCss:{
                    border:0
                },
                children:[
                    { name:'card1', html:'<img src="../images/card1.png">' },
                    { name:'card2', html:'<img src="../images/card2.png">', layout:{ visible: true }},
                    { name:'card3', html:'<img src="../images/card3.png">'},
                    { name:'card4', html:'<img src="../images/card4.png">'},
                    { name:'card5', html:'<img src="../images/card5.png">'},
                    { name:'card6', html:'<img src="../images/card6.png">'},
                    { name:'card7', html:'<img src="../images/card7.png">'},
                    { name:'card8', html:'<img src="../images/card8.png">'},
                    { name:'card9', html:'<img src="../images/card9.png">'},
                    { name:'card10', html:'<img src="../images/card10.png">'},
                    { name:'card11', html:'<img src="../images/card11.png">'},
                    { name:'card12', html:'<img src="../images/card12.png">'},
                    { name:'card13', html:'<img src="../images/card13.png">'}
                ],
                listeners:{
                    'showpage':function (deck, card) {
                        ludo.get('myWindow').setTitle('Showing card ' + (deck.getIndexOfVisiblePage() + 1) + ' of ' + deck.getCountCards())
                    }
                }
            },
            {
                type:'SourceCodePreview'
            }
        ]
    });
</script>
</body>
</html>