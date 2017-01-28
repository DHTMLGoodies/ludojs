<?php
$sub = true;
$pageTitle = 'ViewPager Layout demo';
require_once("../includes/demo-header.php");
?>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/base.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/view-pager.js"></script>


<style type="text/css">
    .navigator-dot-parent{
        cursor:pointer;
    }
    .navigator-dot{
        background-color:#388E3C;

    }
    .navigator-dot-selected{
        background-color:#1B5E20;
    }
</style>
<script type="text/javascript" class="source-code">
    ludo.factory.ns('myApp.view');
    
    myApp.view.ViewPagerNav = new Class({
        Extends: ludo.View,
        viewPager:undefined,

        dotParents : undefined,
        dots:undefined,

        dotSize:undefined,
        dotSizeSelected:undefined,

        // Reference to selected dot
        selectedDot:undefined,

        spacing:0,


        __construct:function(config){
            this.parent(config);
            if(config.spacing != undefined)this.spacing = config.spacing;

        },

        setViewPager:function(viewPager){
            this.viewPager = viewPager;
            this.renderDots();
        },

        renderDots:function(){

            this.dotParents = [];
            this.dots = [];

            this.getBody().empty();

            for(var i=0;i<this.viewPager.count;i++){
                var parent = jQuery('<div class="navigator-dot-parent" style="position:absolute"></div>');
                var dot = jQuery('<div class="navigator-dot" style="position:absolute"></div>');
                dot.css('background-color', this.color);
                parent.attr('data-index', i);
                parent.append(dot);
                this.getBody().append(parent);
                this.dotParents.push(parent);
                this.dots.push(dot);

                parent.on('click', this.clickDot.bind(this));
            }

        },

        clickDot:function(e){

            var index = parseInt(jQuery(e.currentTarget).attr("data-index"));
            this.viewPager.goToPage(index);
        },

        resize:function(params){
            this.parent(params);
            this.resizeAndPositionDots();
        },
        
        resizeAndPositionDots:function(){
            this.dotSizeSelected = this.getBody().height();
            this.dotSize = this.dotSizeSelected * 0.5;

            var totalWidthOfDots = this.dotSizeSelected * this.viewPager.count;
            var totalSpacing = this.spacing * this.viewPager.count;
            var left = (this.getBody().width() / 2) - (totalWidthOfDots / 2) - (totalSpacing / 2);
            for(var i=0;i<this.viewPager.count;i++){
                this.dotParents[i].css({
                    left: left,
                    width: this.dotSizeSelected,
                    height: this.dotSizeSelected
                });

                var selected = i == this.viewPager.selectedIndex;

                var size = selected ? this.dotSizeSelected : this.dotSize;
                var offset = selected ? 0 : size / 2;
                this.dots[i].css({
                    width: size,
                    height: size,
                    top:offset + 'px',
                    left:offset+ 'px',
                    'border-radius': (size/2) + 'px'
                });

                if(selected){
                    this.selectedDot = this.dots[i];
                    this.selectedDot.addClass('navigator-dot-selected');
                }
                // Set left position for next dot
                left+= this.dotSizeSelected + this.spacing;
            }
        },


        navigate:function(){
            if(this.selectedDot != undefined){
                this.selectedDot.removeClass('navigator-dot-selected');
                var size = this.dotSize;
                this.selectedDot.animate({
                    width: size,
                    height: size,
                    top:(size/2) + 'px',
                    left:(size/2)+ 'px',
                    'border-radius': (size/2) + 'px'
                }, { duration: 200, queue: false });


            }
            this.selectedDot = this.dots[this.viewPager.selectedIndex];

            this.selectedDot.addClass('navigator-dot-selected');
            this.selectedDot.animate({
                width: this.dotSizeSelected,
                height: this.dotSizeSelected,
                top:0,
                left:0,
                'border-radius': (this.dotSizeSelected/2) + 'px'
            }, { duration: 200, queue: false });


        }
    });

    ludo.factory.createAlias('myApp.view.ViewPagerNav', myApp.view.ViewPagerNav);

    var w = new ludo.Window({
        id:'myWindow',
        resizable:false,
        title:'ViewPager use case',
        layout:{
            left:50, top:50,
            width:310, height:285,
            type:'linear', orientation:'vertical'
        },
        children:[
            {
                id:'ViewPagerView',
                layout:{
                    weight:1,
                    animationDuration:250,
                    animate:true,
                    dragging:true,
                    type:'ViewPager',
                    orientation:'horizontal',
                    listeners:{
                        'showpage': function(layout){
                            ludo.get('myWindow').setTitle('Swipe between pages ' + (layout.selectedIndex+1) + " of " + layout.count);
                            ludo.$('navigator').navigate();

                        },
                        'rendered' :function(layout){
                            ludo.$('navigator').setViewPager(layout);
                        },
                        'addChildRuntime': function(){ // Re-render dots if a child view has been added after first rendering
                            ludo.$('navigator').renderDots();

                        }
                    }

                },
                children:[
                    { name:'card1', html:'<img src="../images/card1.png">' },
                    { name:'card2', html:'<img src="../images/card2.png">'},
                    { name:'card3', html:'<img src="../images/card3.png">'},
                    { name:'card4', html:'<img src="../images/card4.png">', layout:{ visible: true }},
                    { name:'card5', html:'<img src="../images/card5.png">'},
                    { name:'card6', html:'<img src="../images/card6.png">'},
                    { name:'card7', html:'<img src="../images/card7.png">'},
                    { name:'card8', html:'<img src="../images/card8.png">'},
                    { name:'card9', html:'<img src="../images/card9.png">'},
                    { name:'card10', html:'<img src="../images/card10.png">'},
                    { name:'card11', html:'<img src="../images/card11.png">'},
                    { name:'card12', html:'<img src="../images/card12.png">'},
                    { name:'card13', html:'<img src="../images/card13.png">'}
                ]
            },
            {
                id:'navigator',
                type:'myApp.view.ViewPagerNav',
                layout:{
                    height:30
                },
                elCss:{
                    // Some spacing above and below the dot navigator
                    'margin-top' : 8, 'margin-bottom' : 8
                }
            }
        ]
    });
</script>
</body>
</html>