/**
 * Navigation Dots for the ViewPager layout
 * @class ludo.view.ViewPagerNav
 * @param {Object} config
 */
ludo.view.ViewPagerNav = new Class({
    Extends: ludo.View,
    viewPager:undefined,

    dotParents : undefined,
    dots:undefined,

    dotSize:undefined,
    dotSizeSelected:undefined,
    dotSizeUnselected:undefined,

    // Reference to selected dot
    selectedDot:undefined,

    spacing:0,

    __construct:function(config){
        this.parent(config);
        if(config.spacing != undefined)this.spacing = config.spacing;
    },

    /**
     * Creates a reference to the ViewPager layout
     * @function setViewPager
     * @memberof ludo.view.ViewPagerNav.prototype
     * @param {ludo.layout.ViewPager} viewPager
     * @example
     * viewPager.setViewPager(ludo.$('viewpagerView').getLayout());
     */
    setViewPager:function(viewPager){
        this.viewPager = viewPager;
        this.renderDots();
    },

    renderDots:function(){

        this.dotParents = [];
        this.dots = [];

        this.getBody().empty();

        for(var i=0;i<this.viewPager.count;i++){
            var parent = $('<div class="ludojs-viewpager-dot-parent" style="position:absolute"></div>');
            var dot = $('<div class="ludojs-viewpager-dot" style="position:absolute"></div>');
            parent.attr('data-index', i);
            parent.append(dot);
            this.getBody().append(parent);
            this.dotParents.push(parent);
            this.dots.push(dot);

            parent.on('click', this.clickDot.bind(this));
        }

    },

    clickDot:function(e){
        var index = parseInt($(e.currentTarget).attr("data-index"));
        this.viewPager.goToPage(index);
    },

    resize:function(params){
        this.parent(params);
        this.resizeAndPositionDots();
    },

    resizeAndPositionDots:function(){
        this.dotSizeSelected = this.getBody().height();
        this.dotSize = this.dotSizeSelected * 0.5;
        this.dotSizeUnselected = this.dotSizeSelected * 0.8;

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

            var size = selected ? this.dotSizeSelected : this.dotSizeUnselected;
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
                this.selectedDot.addClass('ludojs-viewpager-dot-selected');
            }
            // Set left position for next dot
            left+= this.dotSizeSelected + this.spacing;
        }
    },


    navigate:function(){
        if(this.selectedDot != undefined){
            this.selectedDot.removeClass('ludojs-viewpager-dot-selected');
            var size = this.dotSizeUnselected;
            this.selectedDot.animate({
                width: size,
                height: size,
                top:(size/2) + 'px',
                left:(size/2)+ 'px'
            }, { duration: 200, queue: false });


        }
        this.selectedDot = this.dots[this.viewPager.selectedIndex];

        this.selectedDot.addClass('ludojs-viewpager-dot-selected');
        this.selectedDot.animate({
            width: this.dotSizeSelected,
            height: this.dotSizeSelected,
            top:0,
            left:0,
        }, { duration: 200, queue: false });
    }
});