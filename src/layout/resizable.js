/**
 * Resize Components within col or row layout
 * @namespace layout
 * @class Resizable
 * @extends Core
 */
ludo.ResizableZIndex = 50000;
ludo.layout.Resizable = new Class({
    Extends:ludo.Core,
    component:undefined,
    el:undefined,
    type:'row',
    cls:'',
    resizeProperties:{
        active:false
    },
    position:'after',
    alignWithCmp:undefined,
    css:undefined,

    ludoConfig:function (config) {
        this.parent(config);
        this.component = config.component;
        this.type = config.type || this.type;
        this.min = config.min || 0;
        this.max = config.max || 10000;
        this.cls = config.cls || this.cls;
        this.position = config.position || this.position;

        if (config.css) {
            this.css = config.css;
        }
        this.createDOM();
        if (this.type === 'row') {
            this.resizeAndPosition.delay(200, this);
        }

        this.component.addEvent('maximize', this.show.bind(this));
        this.component.addEvent('expand', this.show.bind(this));
        this.component.addEvent('minimize', this.hide.bind(this));
        this.component.addEvent('collapse', this.hide.bind(this));

    },

    show:function () {
        this.el.style.display = '';
    },
    hide:function () {
        this.el.css('display', 'none');
    },
    alignWith:function (cmp) {
        if (this.type === 'row') {
            this.el.style.height = cmp.getEl().style.height;
        }
        this.alignWithCmp = cmp;
    },

    createDOM:function () {
        this.el = $('<div>');
        this.el.addClass('ludo-resize-handle');
        ludo.dom.addClass(this.el, 'ludo-resize-handle-' + this.type);
        var styles = {
            'position':'absolute',
            'top':0,
            'z-index':50000 + ludo.CmpMgr.getNewZIndex(),
            'cursor':this.type == 'row' ? 's-resize' : 'w-resize'
        };
        if (this.type == 'row') {
            styles.width = '100%';

        } else {
            styles.height = '100%';
        }
        this.el.setStyles(styles);

        if (this.css) {
            for (var style in this.css) {
                if (this.css.hasOwnProperty(style)) {
                    this.el.setStyle(style, this.css[style]);
                }
            }
        }

        this.addResizeEvents();

        this.component.getParent().getBody().append(this.el);

        if (this.cls) {
            this.el.addClass(this.cls);
        }

        this.setSizeOfDragHandle.delay(100, this);
        if (this.type === 'row') {
            if (Browser.ie) {
                document.id(document.documentElement).addEvent('resize', this.resizeAndPosition.bind(this));
            } else {
                document.id(window).addEvent('resize', this.resizeAndPosition.bind(this));
            }
        }
    },

    addResizeEvents:function () {

        this.el.addEvent(ludo.util.getDragStartEvent(), this.startResize.bind(this));
        this.getEventEl().addEvent(ludo.util.getDragMoveEvent(), this.moveResizeHandle.bind(this));
        this.getEventEl().addEvent(ludo.util.getDragEndEvent(), this.stopResize.bind(this));

        if (!ludo.util.isTabletOrMobile()) {
            this.el.addEvent('mouseover', this.mouseOverResizeHandle.bind(this));
            this.el.addEvent('mouseout', this.mouseOutResizeHandle.bind(this));
        }
    },

    setSizeOfDragHandle:function () {
        if (this.type === 'row') {
            this.el.setStyle('height', this.el.getSize().y);
        } else {
            this.el.setStyle('width', this.el.getSize().x);
        }
    },

    getEl:function () {
        return this.el;
    },

    startResize:function (e) {
		ludo.EffectObject.start();
        this.el.addClass('ludo-resize-handle-active');
        var offset = this.getHandleOffset();
        this.resizeProperties = {
            'min':this.getMinPosOfResizeHandle() - offset,
            'max':this.getMaxPosOfResizeHandle() - offset,
            'currentPos':undefined,
            'mouseX':e.page.x,
            'mouseY':e.page.y,
            'elX':parseInt(e.target.getStyle('left').replace('px', '')),
            'elY':parseInt(e.target.getStyle('top').replace('px', '')),
            'active':true

        };
        return false;
    },

    colResize:function () {
        var el = this.alignWithCmp.getEl();
        this.el.style.left = el.style.left;
        this.el.style.top = el.style.top;
        this.el.style.width = el.style.width;
        this.el.style.height = this.getNewHeight(el);
    },

    getNewHeight:function (el) {

        if (!this.css) {
            return el.style.height;
        }

        return el.getSize().y - ludo.dom.getMH(this.el);
    },

    resizeAndPosition:function () {
        var coordinates = this.component.getEl().getCoordinates(this.component.getParent().getBody());
        var pos;
        if (this.position === 'after') {
            pos = coordinates.top + coordinates.height;
        } else {
            pos = coordinates.top - this.getSizeOfHandle();
        }
        var styles = {
            top:pos
        };
        this.el.setStyles(styles);
    },

    mouseOverResizeHandle:function (e) {
        if (!this.isResizeActive()) {
            e.target.addClass('ludo-resize-handle-over');
        }
    },

    mouseOutResizeHandle:function (e) {
        e.target.removeClass('ludo-resize-handle-over');
    },

    moveResizeHandle:function (e) {
        if (this.isResizeActive()) {
            var pos;
            if (this.type == 'col') {
                pos = this.resizeProperties.elX - this.resizeProperties.mouseX + e.page.x;
                if (pos < this.resizeProperties.min)pos = this.resizeProperties.min;
                else if (pos > this.resizeProperties.max)pos = this.resizeProperties.max;
                this.el.style.left = pos + 'px';
            }
            if (this.type == 'row') {
                pos = this.resizeProperties.elY - this.resizeProperties.mouseY + e.page.y;
                if (pos < this.resizeProperties.min)pos = this.resizeProperties.min;
                else if (pos > this.resizeProperties.max)pos = this.resizeProperties.max;
                this.el.style.top = pos + 'px';
            }
            this.resizeProperties.currentPos = pos;

            return false;
        }
    },

    isResizeActive:function () {
        return this.resizeProperties.active;
    },

    getHandleOffset:function () {
        if (!this.handleOffset) {
            var size = this.getSizeOfHandle();
            var offset = Math.ceil(size / 2);
            if (offset > 0) {
                this.handleOffset = offset;
            } else {
                return 3;
            }
        }
        return this.handleOffset;
    },

    handleSize:0,
    getSizeOfHandle:function () {
        if (!this.handleSize) {
            this.handleSize = this.type == 'row' ? this.el.getSize().y : this.el.getSize().x;
        }
        return this.handleSize;
    },

    getMinPosOfResizeHandle:function () {
        return this.min;
    },

    getMaxPosOfResizeHandle:function () {
        return this.max;
    },

    stopResize:function () {
        if (this.isResizeActive()) {
			ludo.EffectObject.end();

            if (this.type === 'row') {
                this.el.setStyle('top', this.el.getStyle('top'));
            } else {
                this.el.setStyle('left', this.el.getStyle('left'));
            }
            this.resizeProperties.active = false;
            this.el.removeClass('ludo-resize-handle-active');
            if (this.resizeProperties.currentPos) {
                var resizeAmount = this.resizeProperties.currentPos;
                if (this.type === 'row') {
                    resizeAmount -= this.resizeProperties.elY;
                    if (this.position === 'before') {
                        resizeAmount *= -1;
                    }
                    this.fireEvent('resize', [this.component.getHeight() + resizeAmount, resizeAmount]);
                } else {
                    resizeAmount -= this.resizeProperties.elX;
                    if (this.position === 'before') {
                        resizeAmount *= -1;
                    }
                    this.fireEvent('resize', [this.component.getWidth() + resizeAmount, resizeAmount]);
                }
            }
        }
    }
});