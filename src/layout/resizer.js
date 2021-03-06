ludo.layout.Resizer = new Class({
    Extends: ludo.Core,
    type:'layout.Resizer',
    layout: {},
    orientation: undefined,
    view: undefined,
    dd: undefined,
    pos: undefined,
    isActive: false,
    hidden: false,
    lm:undefined,

    __construct: function (config) {
        this.parent(config);
        this.__params(config, ['orientation', 'view', 'layout', 'pos', 'hidden','lm']);
        this.createDOM(config.renderTo);
        this.addViewEvents();
        this.createDragable();


        if(this.lm.type=='layout.Docking' && this.lm.collapsed){
            this.hidden = true;
        }
        if (this.hidden)this.hide();
        
        this.lm.on('collapse', this.hide.bind(this));
        this.lm.on('expand', this.show.bind(this));
    },

    createDOM: function (renderTo) {
        this.el = jQuery('<div>');
        this.el.on('mouseenter', this.enterResizer.bind(this));
        this.el.on('mouseleave', this.leaveResizer.bind(this));
        this.el.addClass("ludo-resize-handle");
        this.el.addClass('ludo-resize-handle-' + ((this.orientation === 'horizontal') ? 'col' : 'row'));
        this.el.addClass('ludo-layout-resize-' + ((this.orientation === 'horizontal') ? 'col' : 'row'));

        this.el.css({
            cursor: (this.orientation == 'horizontal' ? 'ew-resize' : 'ns-resize'),
            zIndex: 100000
        });

        renderTo.append(this.el);

    },

    enterResizer: function () {
        if (!this.isActive) {
            this.el.css('z-index', parseInt(this.el.css('z-index')) + 1);
            this.el.addClass('ludo-resize-handle-active');
        }
    },

    leaveResizer: function () {
        if (!this.isActive) {
            this.el.css('z-index', parseInt(this.el.css('z-index')) - 1);
            this.el.removeClass('ludo-resize-handle-active');
        }
    },
    createDragable: function () {
        this.dd = new ludo.effect.Drag({
            directions: this.orientation == 'horizontal' ? 'X' : 'Y'
        });
        this.dd.addEvent('before', this.beforeDrag.bind(this));
        this.dd.addEvent('end', this.endDrag.bind(this));
        this.dd.add(this.el);
    },

    beforeDrag: function () {
        this.dd.setMinX(30);
        this.isActive = true;
        this.el.removeClass('ludo-resize-handle-active');
        this.el.addClass('ludo-resize-handle-active');
        this.fireEvent('before', [this, this.view]);
        this.fireEvent('startResize');
    },

    setMinWidth: function (x) {
        if (this.pos === 'left') {
            var el = this.view.getEl();
            this.dd.setMaxX(el.position().left + el.width() - x);
        } else {
            this.dd.setMinX(this.view.getEl().position().left + x);
        }
    },

    setMaxWidth: function (x) {
        var el = this.view.getEl();
        if (this.pos === 'right') {
            this.dd.setMaxX(el.position().left + x);
        } else {
            var pos = 0;
            if (this.layout.affectedSibling) {
                pos = this.layout.affectedSibling.getEl().position().left + 10;
            }
            this.dd.setMinX(Math.max(pos, el.position().left + el.width() - x));
        }
    },

    setMinHeight: function (y) {
        if (this.pos === 'above') {
            var el = this.view.getEl();
            this.dd.setMaxY(el.position().top + el.height() - y);
        } else {
            this.dd.setMinY(this.view.getEl().position().top + y);
        }

    },

    setMaxHeight: function (y) {
        var el = this.view.getEl();
        if (this.pos === 'below') {
            this.dd.setMaxY(el.position().top + y);
        } else {
            var pos = 10;
            if (this.layout.affectedSibling) {
                pos = this.layout.affectedSibling.getEl().position().top + 10;
            }
            this.dd.setMinY(Math.max(pos, el.position().top + el.height() - y));
        }
    },

    endDrag: function (dragged, dd) {
        this.el.removeClass('ludo-resize-handle-over');
        this.el.removeClass('ludo-resize-handle-active');
        var change = this.orientation === 'horizontal' ? dd.getDraggedX() : dd.getDraggedY();
        if (this.pos === 'left' || this.pos === 'above') {
            change *= -1;
        }
        this.fireEvent('resize', change);
        this.fireEvent('stopResize');
        this.isActive = false;
    },

    getEl: function () {
        return this.el;
    },

    addViewEvents: function () {
        this.view.addEvent('maximize', this.show.bind(this));
        this.view.addEvent('expand', this.show.bind(this));
        this.view.addEvent('minimize', this.hide.bind(this));
        this.view.addEvent('collapse', this.hide.bind(this));
        this.view.addEvent('hide', this.hide.bind(this));
        this.view.addEvent('show', this.show.bind(this));
    },

    show: function () {
        this.el.css('display', '');
        this.hidden = false;
    },

    hide: function () {
        this.hidden = true;
        this.el.css('display', 'none');
    },

    getWidth: function () {
        return this.hidden ? 0 : 5;
    },

    getHeight: function () {
        return this.hidden ? 0 : 5;
    },

    resize: function (config) {

        this.el.css({
            left: '', top: '', right: '', bottom: ''
        });
        
        if (config.width !== undefined && config.width > 0)this.el.css('width', config.width);
        if (config.height !== undefined && config.height > 0)this.el.css('height', (config.height - ludo.dom.getMBPH(this.el)));
        if (config.left !== undefined)this.el.css('left', config.left);
        if (config.top !== undefined)this.el.css('top', config.top);
        if (config.bottom !== undefined)this.el.css('bottom', config.bottom);
        if (config.right !== undefined)this.el.css('right', config.right);
    },

    getParent: function () {

    },
    setParentComponent: function () {

    },
    isVisible: function () {
        return !this.hidden;
    },
    isHidden: function () {
        return this.hidden;
    },

    hasChildren: function () {
        return false;
    },

    isFormElement: function () {
        return false;
    }
});