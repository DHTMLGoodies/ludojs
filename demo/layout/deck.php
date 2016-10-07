<?php
$sub = true;
$pageTitle = 'Deck/Card demo';
require_once("../includes/demo-header.php");
?>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/base.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/card.js"></script>

<body>
<script type="text/javascript" class="source-code">
    var w = new ludo.Window({
        id:'myWindow',
        left:50, top:50,
        width:310, height:290,
        resizable:false,
        title:'Card/Deck inside a window',
        layout:'fill',
        children:[
            {
                layout:{
                    animate:true,
                    type:'card'
                },

                animationDuration:250,
                titleBar:false,
                containerCss:{
                    border:0
                },
                name:'deck',
                children:[
                    { name:'card1', html:'<img src="../images/card1.png">' },
                    { name:'card2', html:'<img src="../images/card2.png">'},
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
                    'showcard':function (deck, card) {
                        ludo.get('myWindow').setTitle('Showing card ' + (deck.getIndexOfVisibleCard() + 1) + ' of ' + deck.getCountCards())
                    }
                }
            }
        ],
        buttonBar:{
            align:'left',
            children:[
                {
                    type:'card.ProgressBar', weight:1
                },
                {
                    type:'card.PreviousButton'
                },
                {
                    type:'card.NextButton'
                }
            ]}
    });
</script>
</body>
</html>