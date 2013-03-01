/**
 * Super class for year and month-selectors
 * @namespace calendar
 * @class Selector
 * @extends calendar.Base
 */
ludo.calendar.Selector = new Class({
    Extends:ludo.calendar.Base,
    height:25,
    date:undefined,
    minDate:undefined,
    maxDate:undefined,

    minDisplayedYear:undefined,
    maxDisplayedYear:undefined,
    fx:undefined,
    offsetOptions:13,
    calCls:'ludo-calendar-year-container',

    ludoConfig:function (config) {
        this.parent(config);
        this.els.options = [];
    },

    ludoRendered:function () {
        this.parent();
        this.createOptionsContainer();
        this.fx = new Fx.Tween(this.els.calendarContainer, {
            duration:200
        });
        this.renderOptions();
        this.autoResize();
    },

    createOptionsContainer:function () {
        var el = this.els.calendarContainer = new Element('div');
        el.addClass(this.calCls);
        el.setStyles({
            position:'absolute', width:'3000px', left:0, top:0
        });
        this.getBody().adopt(el);
    },
    autoResize:function () {
        var height = this.els.calendarContainer.getSize().y;
        height += ludo.dom.getMH(this.els.calendarContainer);
        this.height = height + ludo.dom.getMBPH(this.getBody()) + ludo.dom.getMBPH(this.getEl());

    },

    resizeDOM:function () {
        this.parent();
        if (this.els.activeOption) {
            this.animateDomToCenter.delay(20, this, this.els.activeOption);
        }
    },

    removeOptions:function () {
        for (var i = 0; i < this.els.options.length; i++) {
            this.els.options[i].dispose();
        }
        this.els.options = [];
    },

    centerDom:function (domEl) {
        domEl.getParent().style.marginLeft = this.getCenterPos(domEl) + 'px';
    },

    animateDomToCenter:function (domEl) {
        if(domEl && domEl.getParent()){
            this.fx.start('margin-left', domEl.getParent().style.marginLeft, this.getCenterPos(domEl));
        }
    },

    getCenterPos:function (domEl) {
        var bodyWidth = this.getBody().clientWidth;
        var offset = domEl.offsetLeft;
        var elWidth = domEl.getSize().x;
        var left = bodyWidth / 2 - offset - elWidth / 2;
        return Math.round(left);
    },

    setMinDate:function (date) {
        this.minDate = date;
    },

    setMaxDate:function (date) {
        this.maxDate = date;
    }
});