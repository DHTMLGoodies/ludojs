/**
 * Super class for year and month-selectors
 */
ludo.calendar.Selector = new Class({
    Extends:ludo.calendar.Base,
    height:25,
    date:undefined,
    minDate:undefined,
    maxDate:undefined,
    overflow:'hidden',
    minDisplayedYear:undefined,
    maxDisplayedYear:undefined,
    fx:undefined,
    offsetOptions:13,
    calCls:'ludo-calendar-year-container',

    __construct:function (config) {
        this.parent(config);
        this.els.options = [];
    },

    __rendered:function () {
        this.parent();
        this.createOptionsContainer();

        this.renderOptions();
        this.autoResize();
    },

    createOptionsContainer:function () {
        var el = this.els.calendarContainer = jQuery('<div>');
        el.addClass(this.calCls);
        el.css({
            position:'absolute', width:'3000px', left:0, top:0
        });
        this.getBody().append(el);
    },
    autoResize:function () {
        var height = this.els.calendarContainer.height();
        height += ludo.dom.getMH(this.els.calendarContainer);
        this.layout.height = height + ludo.dom.getMBPH(this.getBody()) + ludo.dom.getMBPH(this.getEl());

    },

    resizeDOM:function () {
        this.parent();
        if (this.els.activeOption) {
            this.animateDomToCenter.delay(20, this, this.els.activeOption);
        }
    },

    removeOptions:function () {
        for (var i = 0; i < this.els.options.length; i++) {
            this.els.options[i].remove();
        }
        this.els.options = [];
    },

    centerDom:function (domEl) {
        domEl.parent().css('marginLeft',  this.getCenterPos(domEl) + 'px');
    },

    animateDomToCenter:function (domEl) {
        if(domEl && jQuery(domEl).parent()){
            this.els.calendarContainer.animate(
            { 'margin-left' : this.getCenterPos(domEl)},
                200
            );
        }
    },

    getCenterPos:function (domEl) {
        domEl = jQuery(domEl);
        return Math.round((this.getBody().outerWidth() / 2) - domEl.position().left - (domEl.outerWidth() / 2));
    },

    setMinDate:function (date) {
        this.minDate = date;
    },

    setMaxDate:function (date) {
        this.maxDate = date;
    }
});