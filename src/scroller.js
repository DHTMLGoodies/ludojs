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
        this.renderTo = config.parent ? document.id(config.parent) : null;
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
        var el = new Element('div');
        el.addClass(cls);
        el.setStyle('visibility', 'hidden');
        document.body.adopt(el);
        this.wheelSize = el.getSize().y;
        if (!this.wheelSize) {
            this.wheelSize = 25;
        }
        el.destroy();
    },

    createElements:function () {
        this.els.el = new Element('div');
        ludo.dom.addClass(this.els.el, 'ludo-scroller');
        ludo.dom.addClass(this.els.el, 'ludo-scroller-' + this.type);
        this.els.el.setStyles({
            'position':'relative',
            'z-index':1000,
            'overflow':'hidden'
        });

        if (this.type == 'horizontal') {
            this.els.el.setStyles({
                'overflow-x':'auto',
                'width':'100%',
                'height':Browser.ie ? '21px' : '17px'
            });
        } else {
            this.els.el.setStyles({
                'overflow-y':'auto',
                'height':'100%',
                'width':Browser.ie ? '21px' : '17px',
                'right':'0px',
                'top':'0px',
                'position':'absolute'
            });
        }

        this.els.el.addEvent('scroll', this.performScroll.bind(this));

        this.els.elInner = new Element('div');
        this.els.elInner.setStyle('position', 'relative');
        this.els.elInner.set('html', '&nbsp;');

        this.els.el.adopt(this.els.elInner);
    },

    createEvents:function () {
        this.els.elInner.addEvent('resize', this.toggle.bind(this));
        if (this.type == 'vertical') {
            for (var i = 0; i < this.els.applyTo.length; i++) {
                this.els.applyTo[i].addEvent('mousewheel', this.eventScroll.bind(this));
            }
        }
        document.id(window).addEvent('resize', this.resize.bind(this));
    },

    resize:function () {
        if (this.type == 'horizontal') {
            this.els.el.setStyle('width', this.renderTo.offsetWidth);
        } else {
            var size = this.renderTo.offsetHeight;
            if (size == 0) {
                return;
            }
            this.els.el.setStyle('height', size);
        }

        this.toggle();
    },

    getEl:function () {
        return this.els.el;
    },

    setContentSize:function (size) {
        if (this.type == 'horizontal') {
            this.currentSize = size || this.getWidthOfScrollableElements();
            this.els.elInner.setStyle('width', this.currentSize);
        } else {
            this.currentSize = size || this.getHeightOfScrollableElements();
            if (this.currentSize <= 0) {
                var el = this.els.applyTo.getChildren('.ludo-grid-data-column');
                if (el.length) {
                    this.currentSize = el[0].getSize().y;
                }
            }
            this.els.elInner.setStyle('height', this.currentSize);
        }

        if (this.currentSize <= 0) {
            this.setContentSize.delay(1000, this);
        }

        this.resize();
        this.toggle();
    },

    getWidthOfScrollableElements:function () {
        return this.getTotalSize('offsetWidth');
    },

    getHeightOfScrollableElements:function () {
        return this.getTotalSize('offsetHeight');
    },

    getTotalSize:function (key) {
        var ret = 0;
        for (var i = 0; i < this.els.applyTo.length; i++) {
            ret += this.els.applyTo[i][key];
        }
        return ret;
    },

    eventScroll:function (e) {
        this.els.el.scrollTop -= (e.wheel * this.wheelSize);
        return false;
    },

    performScroll:function () {
        if (this.type == 'horizontal') {
            this.scrollTo(this.els.el.scrollLeft);
        } else {
            this.scrollTo(this.els.el.scrollTop);
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
            this.els.applyTo[i].style[css] = (val * -1) + 'px';
        }
        this.fireEvent('scroll', this);
    },

    getHeight:function () {
        return this.active ? this.els.el.getSize().y : 0;
    },

    getWidth:function () {
        return this.active ? this.els.el.getSize().x : 0;
    },

    toggle:function () {
        this.shouldShowScrollbar() ? this.show() : this.hide();
    },

    shouldShowScrollbar:function () {
        var css = this.type === 'horizontal' ? 'x' : 'y';
        var size = this.getParentEl().getSize()[css];
        return this.currentSize > size && size > 0;
    },

    getParentEl:function () {
        return this.renderTo ? this.renderTo : this.els.el;
    },

    show:function () {
        this.active = true;
        this.els.el.style.display='';
    },

    hide:function () {
        this.active = false;
        this.scrollTo(0);
        this.els.el.style.display='none';
    }
});