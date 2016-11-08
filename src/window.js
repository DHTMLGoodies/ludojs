/**
 * Displays a movable View with Title Bar.
 * @parent ludo.FramedView
 * @class ludo.Window
 * @param {Object} config
 * @param {Boolean} config.resizable true to make the window resizable, default = true
 * @param {Boolean} config.movable true to make the window movable, default = true
 * @param {Boolean} config.hideBodyOnMove true to display a dotted rectangle when moving the window. The window will be positioned on mouse up.
 * @param {Boolean} config.resizeLeft true make the window resizable from left edge, default = true
 * @param {Boolean} config.resizeTop true make the window resizable from top edge, default = true.
 * @param {Boolean} config.resizeRight true make the window resizable from right edge, default = true.
 * @param {Boolean} config.resizeBottom true make the window resizable from bottom edge, default = true.
 * @param {Boolean} config.preserveAspectRatio Preserve aspect ratio(width/height) when resizing.
 * @param {Boolean} config.closable True to make the window closable. This will add a close button to the title bar.
 * @param {Boolean} config.minimizable True to make the window minimizable. This will add a minimize button to the title bar.
 * @summary new ludo.Window({ ... });
 *
 * @example
 * new ludo.Window({
 *	   layout:{
 *	        type:'linear', orientation:'horizontal',
 *          width:500,height:500,
 *	        left:100,top:100
 *
 *	   },
 *	   children:[
 *	   {
 *		   	layout:{
 *		   		weight:1
 *			},
 *		   html : 'Panel 1'
 *	   },{
 *		   	layout:{
 *		   		weight:1
 *			},
 *		   	html: 'Panel 2'
 *	   }]
 *	});
 */
ludo.Window = new Class({
    Extends: ludo.FramedView,
    type: 'Window',
    cssSignature: 'ludo-window',
    movable: true,
    resizable: true,
    closable: true,
    top: undefined,
    left: undefined,
    width: 300,
    height: 200,
    resizeTop: true,
    resizeLeft: true,
    hideBodyOnMove: false,
    preserveAspectRatio: false,
    statefulProperties: ['layout'],

    ludoConfig: function (config) {
        config = config || {};
        config.renderTo = document.body;
        var keys = ['resizeTop', 'resizeLeft', 'hideBodyOnMove', 'preserveAspectRatio'];
        this.setConfigParams(config, keys);

        this.parent(config);
    },

    ludoEvents: function () {
        this.parent();
        if (this.hideBodyOnMove) {
            this.addEvent('startmove', this.hideBody.bind(this));
            this.addEvent('stopmove', this.showBody.bind(this));
        }
        this.addEvent('stopmove', this.saveState.bind(this));
    },

    hideBody: function () {
        this.getBody().css('display', 'none');
        if (this.els.buttonBar)this.els.buttonBar.el.css('display', 'none');
    },

    showBody: function () {
        this.getBody().css('display', '');
        if (this.els.buttonBar)this.els.buttonBar.el.css('display', '');
    },

    ludoRendered: function () {
        this.parent();
        this.getEl().addClass('ludo-window');
        this.focusFirstFormField();
        this.fireEvent('activate', this);
    },

    ludoDOM: function () {
        this.parent();
        if (this.isResizable()) {
            var r = this.getResizer();
            if (this.resizeTop) {
                if (this.resizeLeft) {
                    r.addHandle('nw');
                }
                r.addHandle('n');
                r.addHandle('ne');
            }

            if (this.resizeLeft) {
                r.addHandle('w');
                r.addHandle('sw');
            }
            r.addHandle('e');
            r.addHandle('se');
        }
    },

    show: function () {
        this.parent();
        this.focusFirstFormField();
    },

    focusFirstFormField: function () {
        var els = this.getBody().children('input');
        for (var i = 0, count = els.length; i < count; i++) {
            if (els[i].type && els[i].type.toLowerCase() === 'text') {
                els[i].focus();
                return;
            }
        }
        var el = this.getBody().find('textarea');
        if (el) {
            el.focus();
        }
    },

    isUsingShimForResize: function () {
        return true;
    },
    /**
     * Show window at x and y position
     * @function showAt
     * @param {Number} x
     * @param {Number} y
     * @return void
     */
    showAt: function (x, y) {
        this.setXY(x, y);
        this.show();
    },

    setXY: function (x, y) {
        this.layout.left = x;
        this.layout.top = y;
        var r = this.getLayout().getRenderer();
        r.clearFn();
        r.resize();
    },

    center: function () {
        var b = $(document.body);
        var bodySize = {x: b.width(), y: b.height()};
        var x = Math.round((bodySize.x / 2) - (this.getWidth() / 2));
        var y = Math.round((bodySize.y / 2) - (this.getHeight() / 2));
        this.setXY(x, Math.max(0, y));
    },

    /**
     * Show window centered on screen
     * @function showCentered
     * @return void
     */
    showCentered: function () {
        this.center();
        this.show();
    },

    isWindow: function () {
        return true;
    }
});