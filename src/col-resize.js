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
        this.getEventEl().on(ludo.util.getDragMoveEvent(), this.moveColResizeHandle.bind(this));
        this.getEventEl().on(ludo.util.getDragEndEvent(), this.stopColResize.bind(this));
    },

    setPos:function (index, pos) {
        this.resizeHandles[index].css('left', pos);
    },

    hideHandle:function (index) {
        this.resizeHandles[index].css('display', 'none');
    },
    showHandle:function (index) {
        this.resizeHandles[index].css('display', '');
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

        var el = $('<div>');
        el.addClass('ludo-column-resize-handle');
        el.css({
            'top':0,
            'position':'absolute',
            'height':'100%',
            'cursor':'col-resize',
            'z-index':15000,
            display:isVisible ? '' : 'none'
        });
        el.attr('col-reference', key);
        el.on(ludo.util.getDragStartEvent(), this.startColResize.bind(this));
        if (!ludo.util.isTabletOrMobile()) {
            el.on('mouseenter', this.mouseOverResizeHandle.bind(this));
            el.on('mouseleave', this.mouseOutResizeHandle.bind(this));
        }
        this.resizeHandles[key] = el;
        return el;
    },

    startColResize:function (e) {
        var columnName = $(e.target).attr('col-reference');
        this.fireEvent('startresize', columnName);
        $(e.target).addClass('ludo-resize-handle-active');
        var offset = this.getLeftOffsetOfColResizeHandle();

        var r = this.resizeProperties;
        r.min = this.getMinPos() - offset;
        r.max = this.getMaxPos() - offset;

        r.mouseX = this.resizeProperties.currentX = e.pageX;
        r.elX = parseInt($(e.target).css('left').replace('px', ''));
        r.currentX = this.resizeProperties.elX;

        r.active = true;
        r.el = $(e.target);
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
            var pos = this.resizeProperties.elX - this.resizeProperties.mouseX + e.pageX;
            pos = Math.max(pos, this.resizeProperties.min);
            pos = Math.min(pos, this.resizeProperties.max);

            this.resizeProperties.el.css('left', pos);

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
        $(e.target).addClass('ludo-grid-resize-handle-over');
    },
    mouseOutResizeHandle:function (e) {
        $(e.target).removeClass('ludo-grid-resize-handle-over');
    },

    isActive:function(){
        return this.resizeProperties.active;
    }
});