/**
 * Layout where first child slides in from the left on demand
 * @namespace layout
 * @class SlideIn
 */
ludo.layout.SlideIn = new Class({
    Extends:ludo.layout.Base,
    slideEl:undefined,

    onCreate:function(){
        this.view.getBody().style.overflowX = 'hidden';
    },

    onNewChild:function (child) {
        this.parent(child);
        child.getEl().style.position = 'absolute';
    },

    resize:function () {
        var widthOfFirst = this.getWidthOfMenu();

        this.view.children[0].resize({
            width:widthOfFirst,
            height:this.viewport.height
        });

        this.slideEl.style.width = (this.viewport.absWidth + widthOfFirst) + 'px';
        this.slideEl.style.left = this.view.layout.active ? 0 : (widthOfFirst * -1) + 'px';

        this.view.children[1].getEl().style.left = widthOfFirst + 'px';
        this.view.children[1].resize({
            width:this.viewport.absWidth,
            height:this.viewport.height
        })

    },
    /**
     Show menu
     @method show
     @example
        view.getLayout().show();
     */
    show:function () {
        if (!this.isMenuOpen()) {
            if(this.view.children[0].hidden){
                this.view.children[0].show();
            }
            this.view.layout.active = true;
            var widthOfFirst = this.getWidthOfMenu();
            this.effect().slide(this.slideEl, { x:widthOfFirst * -1}, {x:0 }, this.getDuration());
        }
    },
    /**
     hide menu
     @method hide
     @example
        view.getLayout().hide();
     */
    hide:function () {
        if (this.isMenuOpen()) {
            this.view.layout.active = false;
            var widthOfFirst = this.getWidthOfMenu();
            this.effect().slide(this.slideEl, {x:0 }, { x:widthOfFirst * -1}, this.getDuration());
        }
    },

	isMenuOpen:function(){
		return this.view.layout.active;
	},

    /**
     * Toggle between show and hide
     * @method toggle
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
        return this.view.layout.duration || .15;
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
            this.slideEl = ludo.dom.create({
                tag:'div',
                renderTo:this.view.getBody(),
                css:{
                    height:'100%',
                    position:'absolute'
                }
            });
        }
        return this.slideEl;
    }

});