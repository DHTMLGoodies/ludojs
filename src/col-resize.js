ludo.ColResize = new Class({
    Extends:ludo.Core,
    component:undefined,
    resizeHandles:{},
    resizeProperties:{},
    minPos:0,
    maxPos:10000,

    ludoConfig:function (config) {
        this.parent(config);
        this.component = config.component;
        this.createEvents();
    },

    createEvents:function () {
        this.getEventEl().addEvent(this.getDragMoveEvent(), this.moveColResizeHandle.bind(this));
        this.getEventEl().addEvent(this.getDragEndEvent(), this.stopColResize.bind(this));
    },

    setPos:function (index, pos) {
        this.resizeHandles[index].setStyle('left', pos);
    },

    hideHandle:function (index) {
        this.resizeHandles[index].style.display = 'none';
    },
    showHandle:function (index) {
        this.resizeHandles[index].style.display = '';
    },

    hideAllHandles:function () {
        for (var key in this.resizeHandles){
            if(this.resizeHandles.hasOwnProperty(key)){
                this.hideHandle(key);
            }
        }
    },
    showAllHandles:function () {
        for (var key in this.resizeHandles){
            if(this.resizeHandles.hasOwnProperty(key)){
                this.showHandle(key);
            }
        }
    },

    getHandle:function (key, isVisible) {

        var el = new Element('div');
        ludo.dom.addClass(el, 'ludo-column-resize-handle');
        el.setStyles({
            'top':0,
            'position':'absolute',
            'height':'100%',
            'cursor':'col-resize',
            'z-index':15000,
            display:isVisible ? '' : 'none'
        });
        el.setProperty('col-reference', key);
        if (this.shouldUseTouchEvents()) {
            el.addEvent('touchstart', this.startColResize.bind(this));
        } else {
            el.addEvent('mousedown', this.startColResize.bind(this));
            el.addEvent('mouseenter', this.mouseOverResizeHandle.bind(this));
            el.addEvent('mouseleave', this.mouseOutResizeHandle.bind(this));
        }
        this.resizeHandles[key] = el;
        return el;
    },

    startColResize:function (e) {
        var columnName = e.target.getProperty('col-reference');
        this.fireEvent('startresize', columnName);
        ludo.dom.addClass(e.target, 'ludo-resize-handle-active');
        var offset = this.getLeftOffsetOfColResizeHandle();

        var r = this.resizeProperties;
        r.min = this.getMinPos() - offset;
        r.max = this.getMaxPos() - offset;

        r.mouseX = this.resizeProperties.currentX = e.page.x;
        r.elX = parseInt(e.target.getStyle('left').replace('px', ''));
        r.currentX = this.resizeProperties.elX;

        r.active = true;
        r.el = e.target;
        r.index = columnName;

        return false;
    },

    getLeftOffsetOfColResizeHandle:function () {
        if (!this.resizeHandles[0]) {
            return 3;
        }
        if (!this.handleOffset) {
            var offset = Math.ceil(this.resizeHandles[0].getSize().x / 2);
            if (offset > 0) {
                this.handleOffset = offset;
            } else {
                return 3;
            }
        }
        return this.handleOffset;
    },

    moveColResizeHandle:function (e) {
        if (this.resizeProperties.active) {
            var pos = this.resizeProperties.elX - this.resizeProperties.mouseX + e.page.x;
            pos = Math.max(pos, this.resizeProperties.min);
            pos = Math.min(pos, this.resizeProperties.max);
            this.resizeProperties.el.setStyle('left', pos);

            this.resizeProperties.currentX = pos;
            return false;
        }
		return undefined;
    },

    stopColResize:function () {
        if (this.resizeProperties.active) {
            this.resizeProperties.active = false;
            this.resizeProperties.el.removeClass('ludo-resize-handle-active');
            var change = this.resizeProperties.currentX - this.resizeProperties.elX;
            this.fireEvent('resize', [this.resizeProperties.index, change]);
            return false;
        }
		return undefined;
    },

    getMinPos:function () {
        return this.minPos;
    },
    getMaxPos:function () {
        return this.maxPos;
    },

    setMinPos:function (pos) {
        this.minPos = pos;
    },

    setMaxPos:function (pos) {
        this.maxPos = pos;
    },

    mouseOverResizeHandle:function (e) {
        ludo.dom.addClass(e.target, 'ludo-grid-resize-handle-over');
    },
    mouseOutResizeHandle:function (e) {
        e.target.removeClass('ludo-grid-resize-handle-over');
    },

    isActive:function(){
        return this.resizeProperties.active;
    }
});