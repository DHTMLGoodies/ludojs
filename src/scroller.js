ludo.Scroller = new Class({
    Extends:Events,
    els:{
        applyTo:null,
        el:null,
        elInner:null,
        parent:null
    },

    active:0,
    wheelSize:5,
    type:'horizontal',
    currentSize:0,
    renderTo:undefined,

    initialize:function (config) {
        this.type = config.type || this.type;
        if (config.applyTo) {
            this.setApplyTo(config.applyTo);

        }
        this.renderTo = config.parent ? jQuery(config.parent) : null;
        if (config.mouseWheelSizeCls) {
            this.determineMouseWheelSize(config.mouseWheelSizeCls);
        }
        this.createElements();
        this.createEvents();
    },

    setApplyTo:function (applyTo) {
        if (!ludo.util.isArray(applyTo))applyTo = [applyTo];
        this.els.applyTo = applyTo;
    },

    determineMouseWheelSize:function (cls) {
        var el = jQuery('<div>');
        el.addClass(cls);
        el.css('visibility', 'hidden');
        jQuery(document.body).append(el);
        this.wheelSize = el.height();
        if (!this.wheelSize) {
            this.wheelSize = 25;
        }
        el.remove();
    },

    createElements:function () {
        this.els.el = jQuery('<div>');
        this.els.el.addClass('ludo-scroller');
        this.els.el.addClass('ludo-scroller-' + this.type);
        this.els.el.css({
            'position':'relative',
            'z-index':1000,
            'overflow':'hidden'
        });

		var overflow = 'auto';
        if (this.type == 'horizontal') {
            this.els.el.css({
                'overflow-x':overflow,
                'width':'100%',
                'height':Browser.ie ? '21px' : '17px'
            });
        } else {
            this.els.el.css({
                'overflow-y':overflow,
                'height':'100%',
                'width':Browser.ie ? '21px' : '17px',
                'right':'0px',
                'top':'0px',
                'position':'absolute'
            });
        }



        this.els.el.scroll(this.performScroll.bind(this));

        this.els.elInner = jQuery('<div>');
        this.els.elInner.css('position', 'relative');
        this.els.elInner.html('&nbsp;');

        this.els.el.append(this.els.elInner);
    },

    createEvents:function () {
        this.els.elInner.on('resize', this.toggle.bind(this));
        if (this.type == 'vertical') {
            for (var i = 0; i < this.els.applyTo.length; i++) {
                this.els.applyTo[i].on('mousewheel', this.eventScroll.bind(this));
            }
        }
        jQuery(window).on('resize', this.resize.bind(this));
    },

    resize:function () {
        if (this.type == 'horizontal') {
            this.els.el.css('width', this.renderTo.outerWidth());
        } else {
            var size = this.renderTo.outerHeight();
            if (size == 0) {
                return;
            }
            this.els.el.css('height', size);
        }
        this.toggle();
    },

    getEl:function () {
        return this.els.el;
    },

    setContentSize:function (size) {
        if (this.type == 'horizontal') {
            this.currentSize = size || this.getWidthOfScrollableElements();
            this.els.elInner.css('width', this.currentSize);
        } else {

            this.currentSize = size || this.getHeightOfScrollableElements();

            if (this.currentSize <= 0) {
                var el = this.els.applyTo.getChildren('.ludo-grid-data-column');
                if (el.length) {
                    this.currentSize = el[0].outerHeight();
                }
            }
            this.els.elInner.css('height', this.currentSize);
        }

        if (this.currentSize <= 0) {
            this.setContentSize.delay(1000, this);
        }

        this.resize();
        this.toggle();
    },

    getWidthOfScrollableElements:function () {
        return this.getTotalSize('outerWidth');
    },

    getHeightOfScrollableElements:function () {
        return this.getTotalSize('outerHeight');
    },

    getTotalSize:function (key) {
        var ret = 0;
        for (var i = 0; i < this.els.applyTo.length; i++) {
            ret += this.els.applyTo[i][key]();
        }
        return ret;
    },

    eventScroll:function (e) {
        var s = this.els.el.scrollTop();
        this.els.el.scrollTop(s - e.originalEvent.wheelDelta);
        return false;
    },

    performScroll:function () {

        if (this.type == 'horizontal') {
            this.scrollTo(this.els.el.scrollLeft());
        } else {
            this.scrollTo(this.els.el.scrollTop());
        }
    },

    scrollBy:function (val) {


        var key = this.type === 'horizontal' ? 'scrollLeft' : 'scrollTop';
        this.els.el[key] += val;
        this.scrollTo(this.els.el[key]);
    },

    scrollTo:function (val) {

        var css = this.type === 'horizontal' ? 'left' : 'top';
        for (var i = 0; i < this.els.applyTo.length; i++) {
            this.els.applyTo[i].css(css, (val * -1));
        }
        this.fireEvent('scroll', this);
    },

    getHeight:function () {

        return this.active ? this.els.el.height() : 0;
    },

    getWidth:function () {
        return this.active ? this.els.el.width() : 0;
    },

    toggle:function () {
        this.shouldShowScrollbar() ? this.show() : this.hide();
    },

    shouldShowScrollbar:function () {
        var css = this.type === 'horizontal' ? 'width' : 'height';
        var size = this.getParentEl()[css]();
        return this.currentSize > size && size > 0;
    },

    getParentEl:function () {
        return this.renderTo ? this.renderTo : this.els.el;
    },

    show:function () {
        this.active = true;
        this.els.el.css('display', '');
    },

    hide:function () {
        this.active = false;
        this.scrollTo(0);
        this.els.el.css('display', 'none');
    }
});