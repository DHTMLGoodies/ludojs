/**
@class Window
@extends FramedView
@description Class for floating window
@constructor
@param {Object} config
@example
	new ludo.Window({
	   width:500,height:500,
	   left:100,top:100,
	   layout:'cols',
	   children:[{
		   	layout:{
		   		weight:1
			},
		   html : 'Panel 1'
	   },{
		   	layout:{
		   		weight:1
			},
		   	html: 'Panel 2'
	   }]
	});
 */
ludo.Window = new Class({
    Extends:ludo.FramedView,
    type:'Window',
    cssSignature:'ludo-window',

	/**
	 * True to make the window movable
	 * @attribute movable
	 * @type {Boolean}
	 * @default true
	 */
	movable:true,
	resizable:true,
	closable:true,

    /**
     * Top position of window
     * @attribute {Number} top
     * @default undefined
     */
    top:undefined,
    /**
     * Left position of window
     * @attribute {Number} left
     * @default undefined
     */
    left:undefined,
    /**
     * Width of window
     * @attribute {Number} width
     * @default 300
     */
    width:300,
    /**
     * Height of window
     * @attribute {Number} height
     * @default 200
     */
    height:200,
    /**
     * When set to true, resize handle will be added
     * to the top ludo of the window. This can be useful to turn off when you're extending the ludo.Window component
     * to create custom components where top position should be fixed.
     * @attribute {Boolean} resizeTop
     * @default true
     */
    resizeTop:true,
    /**
     * When set to true, resize handle will be added
     * to the left ludo of the window. This can be useful to turn off when you're extending the ludo.Window component
     * to create custom components where left position should be fixed.
     * @attribute {Boolean} resizeLeft
     * @default true
     */
    resizeLeft:true,

    /**
     * Hide content of window while moving/dragging the window
     * @attribute {Boolean} hideBodyOnMove
     * @default false
     */
    hideBodyOnMove:false,

    /**
     * Preserve aspect ratio when resizing
     * @attribute {Boolean} preserveAspectRatio
     * @default false
     */
    preserveAspectRatio:false,

	statefulProperties:['layout'],

    ludoConfig:function (config) {
		config = config || {};
		config.left = config.left || config.x;
		config.top = config.top || config.y;
		config.renderTo = document.body;

        var keys = ['resizeTop','resizeLeft','hideBodyOnMove','preserveAspectRatio'];
        this.setConfigParams(config, keys);

		this.parent(config);
    },

    ludoEvents:function () {
        this.parent();
        if (this.hideBodyOnMove) {
            this.addEvent('startmove', this.hideBody.bind(this));
            this.addEvent('stopmove', this.showBody.bind(this));
        }
		this.addEvent('stopmove', this.saveState.bind(this));
    },

    hideBody:function () {
        this.getBody().style.display = 'none';
        this.els.buttonBar.el.style.display = 'none';
    },

    showBody:function () {
        this.getBody().style.display = '';
        this.els.buttonBar.el.style.display = '';
    },

    ludoRendered:function () {
        this.parent();
        ludo.dom.addClass(this.getEl(), 'ludo-window');
        this.focusFirstFormField();
        this.fireEvent('activate', this);
    },

    ludoDOM:function () {
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

    show:function () {
		this.parent();
        this.focusFirstFormField();
    },

    focusFirstFormField:function () {
        var els = this.getBody().getElements('input');
        for (var i = 0, count = els.length; i < count; i++) {
            if (els[i].type && els[i].type.toLowerCase() === 'text') {
                els[i].focus();
                return;
            }
        }
        var el = this.getBody().getElement('textarea');
        if (el) {
            el.focus();
        }
    },

    isUsingShimForResize:function () {
        return true;
    },
    /**
     * Show window at x and y position
     * @method showAt
     * @param {Number} x
     * @param {Number} y
     * @return void
     */
    showAt:function (x, y) {
        this.setXY(x,y);
        this.show();
    },

    setXY:function(x,y){
        this.layout.left = x;
        this.layout.top = y;
        var r = this.getLayoutManager().getRenderer();
        r.clearFn();
        r.resize();
    },

    center:function(){
        var bodySize = document.body.getSize();
        var x = Math.round((bodySize.x / 2) - (this.getWidth() / 2));
        var y = Math.round((bodySize.y / 2) - (this.getHeight() / 2));
        this.setXY(x,y);
    },

    /**
     * Show window centered on screen
     * @method showCentered
     * @return void
     */
    showCentered:function () {
        this.center();
        this.show();
    },

    isWindow:function(){
        return true;
    }
});