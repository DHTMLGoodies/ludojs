/**
 * @namespace menu
 * @class DropDown
 * @extends menu.Menu
 *
 */
ludo.menu.DropDown = new Class({
    Extends:ludo.menu.Menu,
    type:'menu.DropDown',
    pos:'below',

    ludoConfig:function (config) {
        config.renderTo = document.body;
        this.parent(config);
        if (config.applyTo !== undefined)this.applyTo = config.applyTo;
        if (config.pos !== undefined)this.pos = config.pos;
    },

    ludoDOM:function () {
        this.parent();
        this.getEl().style.position = 'absolute';
    },
    ludoEvents:function () {
        this.parent();
        document.id(document.documentElement).addEvent('click', this.hideAfterDelay.bind(this));
    },

    hideAfterDelay:function () {
        if (!this.isHidden()) {
            this.hide.delay(50, this);
        }
    },

    show:function () {
        this.parent();
        var el = this.getEl();
        var pos = this.getXAndYPos();
        el.style.left = pos.x + 'px';
        el.style.top = pos.y + 'px';
    },

    getXAndYPos:function () {
        var coords = this.applyTo.getEl().getCoordinates();
        var ret = {
            x:coords.left,
            y:coords.top + coords.height
        };
        switch (this.pos) {
            case 'right':
                ret.x = coords.left + coords.width;
                ret.y = coords.top;
                break;
            default:
        }
        return ret;
    },

    toggle:function(){
        if(this.isHidden()){
            this.show();
        }else{
            this.hide();
        }
    }
});