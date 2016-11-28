/**
 * In the Navigation Bar layout, you have to two child views. The first child view is the
 * navigation Bar which initially is hidden off to the left.
 *
 * It can be displayed on demand by calling it's **show** method.
 * 
 * For tutorial, see <a href="../../learn/layout-navbar.html">layout-navbar.html</a>.
 * 
 * This class extends ludo.layout.Base
 * @namespace layout
 * @class ludo.layout.NavBar
 */
ludo.layout.NavBar = new Class({
    Extends:ludo.layout.Base,
    slideEl:undefined,

    onCreate:function(){
        this.view.getBody().css('overflowX', 'hidden');

    },

    onNewChild:function (child) {
        this.parent(child);
        child.getEl().css('position', 'absolute');
    },

    resize:function () {
        var widthOfFirst = this.getWidthOfMenu();

        this.view.children[0].resize({
            width:widthOfFirst,
            height:this.viewport.height
        });

        this.slideEl.css({
            width: (this.viewport.absWidth + widthOfFirst),
            left: this.view.layout.active ? 0 : (widthOfFirst * -1)
        });

        this.view.children[1].getEl().css('left', widthOfFirst + 'px');
        this.view.children[1].resize({
            width:this.viewport.absWidth,
            height:this.viewport.height
        })

    },
    /**
     Show menu
     @function show
     @memberof ludo.layout.NavBar.prototype
     @example
        view.getLayout().show();
     */
    show:function () {
        if (!this.isMenuOpen()) {
            if(this.view.children[0].hidden){
                this.view.children[0].show();
            }
            this.view.layout.active = true;
            this.slideEl.animate({
                left:0
            }, this.getDuration(), this.getEasing());
        }
    },
    /**
     hide menu
     @function hide
     @memberof ludo.layout.NavBar.prototype
     @example
        view.getLayout().hide();
     */
    hide:function () {
        if (this.isMenuOpen()) {
            this.view.layout.active = false;
            var widthOfFirst = this.getWidthOfMenu();

            this.slideEl.animate({
                left: widthOfFirst * -1
            }, this.getDuration(), this.getEasing());
        }
    },

	isMenuOpen:function(){
		return this.view.layout.active;
	},

    /**
     * Toggle between show and hide
     * @function toggle
     * @memberof ludo.layout.NavBar.prototype
     */
    toggle:function () {
        this[this.view.layout.active ? 'hide' : 'show']();
    },

    effect:function () {
        if (this.effectObject === undefined) {
            this.effectObject = new ludo.effect.Effect
        }
        return this.effectObject;
    },

    getDuration:function () {
        return this.view.layout.duration || 150;
    },

    getEasing:function(){
        return this.view.layout.easing || 'swing';
    },

    getWidthOfMenu:function(){
        var ret = this.view.children[0].layout.width;

        if(isNaN(ret)){
            switch(ret){
                case 'matchParent':
                    return this.viewport.width;
                default:
                    return parseInt(ret) * this.viewport.width / 100;
            }

        }else{
            return ret;
        }
    },

    getParentForNewChild:function () {
        if (!this.slideEl) {
            this.slideEl = $('<div style="height:100%;position:absolute"></div>');
            this.view.getBody().append(this.slideEl);

        }
        return this.slideEl;
    }

});