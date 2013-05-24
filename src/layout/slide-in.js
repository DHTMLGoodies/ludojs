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
        var widthOfFirst = this.view.children[0].layout.width;

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

    show:function () {
        if (!this.view.layout.active) {
            this.view.layout.active = true;
            var widthOfFirst = this.view.children[0].layout.width;
            this.effect().slide(this.slideEl, { x:widthOfFirst * -1}, {x:0 }, this.getDuration());
        }
    },

    hide:function () {
        if (this.view.layout.active) {
            this.view.layout.active = false;
            var widthOfFirst = this.view.children[0].layout.width;
            this.effect().slide(this.slideEl, {x:0 }, { x:widthOfFirst * -1}, this.getDuration());
        }
    },

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