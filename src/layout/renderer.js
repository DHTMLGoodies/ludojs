/**
 * Renderer class for Views which does not have a parent view and are typically rendered to the &lt;body> tag.
 *
 * It uses the views layout options for it's rendering. The config options are much the same as for the relative layout.
 *
 * You can use a combination of the layout properties mentioned below.
 *
 * @class ludo.layout.Renderer
 * @config {object} layout
 * @config {number|string} layout.width Width of view in pixels, percent, "matchParent" or "wrap"
 * @config {number|string} layout.height Height of view in pixels, percent, "matchParent" or "wrap"
 * @config {number|string} rightOf Id of view or id of dom element to align right of.
 * It can be any view which could be referenced using ludo.$, or any value which can be referenced using jQuery's dollar function. if jQuery use
 * values like '#id'.
 * @config {number|string} rightOrLeftOf Id of view or dom node to align right of(if enough room). it will be placed to the left if not enough room.
 * @config {number|string} leftOrRightOf Id of view or dom node to align left of(if enough room). it will be placed to the right if not enough room.
 * @config {number|string} sameHeightAs Same height as view or dom node with this id. if jQuery, use "#" prefix
 * @config {number|string} sameWidthAs Same width as view or dom node with this id. if jQuery, use "#" prefix
 * @config {number|string} alignLeft Align left with view or dom node with this id. if jQuery, use "#" prefix
 * @config {number|string} alignRight Align right with view or dom node with this id. if jQuery, use "#" prefix
 * @config {number|string} alignTop Align top edge with view or dom node with this id. if jQuery, use "#" prefix
 * @config {number|string} alignBottom Align bottom edge with view or dom node with this id. if jQuery, use "#" prefix
 * @config {number|string} centerIn. Center in view  or dom node with this id. if jQuery, use "#" prefix
 * @config {number|string} left. left coordinate in pixels
 * @config {number|string} top. top coordinate in pixels
 * @config {number|string} offsetX. After positioning, offset left coordinate with these many pixels
 * @config {number|string} offsetY. After positioning, offset top coordinate with these many pixels
 *
 */
ludo.layout.Renderer = new Class({
    // TODO Support top and left resize of center aligned dialogs
    // TODO store inner height and width of views(body) for fast lookup
    view: undefined,
    options: ['width', 'height',
        'rightOf', 'leftOf', 'below', 'above',
        'sameHeightAs', 'sameWidthAs',
        'offsetWidth', 'offsetHeight',
        'rightOrLeftOf', 'leftOrRightOf',
        'alignLeft', 'alignRight', 'alignTop', 'alignBottom',
        'centerIn',
        'left', 'top',
        'offsetX', 'offsetY', 'fitVerticalViewPort'],
    fn: undefined,
    viewport: {
        x: 0, y: 0, width: 0, height: 0
    },
    coordinates: {
        left: undefined,
        right: undefined,
        above: undefined,
        below: undefined,
        width: undefined,
        height: undefined
    },
    lastCoordinates: {},

    initialize: function (config) {
        this.view = config.view;
        this.fixReferences();
        this.setDefaultProperties();
        this.view.addEvent('show', this.resize.bind(this));
        ludo.dom.clearCache();
        this.addResizeEvent();

        if (this.view.getLayout != undefined) {
            this.view.getLayout().on('addChild', this.clearFn.bind(this));
        }
        this.view.on('addChild', this.clearFn.bind(this));

        this.view.on('remove', this.removeEvents.bind(this));
    },

    fixReferences: function () {
        var el;
        var hasReferences = false;

        for (var i = 0; i < this.options.length; i++) {
            var key = this.options[i];
            switch (key) {
                case 'offsetX':
                case 'offsetY':
                case 'width':
                case 'height':
                case 'left':
                case 'top':
                case 'fitVerticalViewPort':
                    break;
                default:
                    el = undefined;
                    if (this.view.layout[key] !== undefined) {
                        hasReferences = true;
                        var val = this.view.layout[key];

                        if (typeof val === 'string') {
                            var view;
                            if (val === 'parent') {
                                view = this.view.getParent();
                            } else {
                                view = ludo.get(val);
                            }
                            if (view) {
                                el = view.getEl();
                                view.addEvent('resize', this.clearFn.bind(this));
                            } else {
                                el = jQuery(val);
                            }
                        } else {
                            if (val.getEl !== undefined) {
                                el = val.getEl();
                                val.addEvent('resize', this.clearFn.bind(this));
                            } else {
                                el = jQuery(val);
                            }
                        }
                        if (el)this.view.layout[key] = el; else this.view.layout[key] = undefined;
                    }
            }
        }
        if (hasReferences)this.view.getEl().css('position', 'absolute');
    },

    setDefaultProperties: function () {
        // TODO is this necessary ?
        this.view.layout.width = this.view.layout.width || 'matchParent';
        this.view.layout.height = this.view.layout.height || 'matchParent';
    },

    resizeFn: undefined,

    addResizeEvent: function () {
        // todo no resize should be done for absolute positioned views with a width. refactor the next line
        if (this.view.isWindow)return;
        this.resizeFn = this.resize.bind(this);
        //var node = this.getParentNode();
        // node.resize(this.resizeFn);

        jQuery(window).on('resize', this.resizeFn);
    },

    getParentNode: function () {
        var node = this.view.getEl().parent();
        if (!node || !node.prop("tagName"))return;
        if (node.prop("tagName").toLowerCase() !== 'body') {
            node = jQuery(node);
        } else {
            node = jQuery(window);
        }
        return node;
    },

    removeEvents: function () {
        // this.getParentNode().off('resize', this.resizeFn);
        if(this.resizeFn) jQuery(window).off('resize', this.resizeFn);
    },

    buildResizeFn: function () {
        var parent = this.view.getEl().parent();
        if (!parent)this.fn = function () {
        };
        var fns = [];
        var fnNames = [];
        for (var i = 0; i < this.options.length; i++) {
            if (this.view.layout[this.options[i]] !== undefined) {
                fns.push(this.getFnFor(this.options[i], this.view.layout[this.options[i]]));
                fnNames.push(this.options[i]);
            }
        }
        this.fn = function () {
            for (i = 0; i < fns.length; i++) {
                fns[i].call(this, this.view, this);
            }
        }
    },

    getFnFor: function (option, value) {
        var c = this.coordinates;


        switch (option) {

            case 'height':
                if (value === 'matchParent') {

                    return function (view, renderer) {
                        c.height = renderer.viewport.height;
                    }
                }
                if (value === 'wrap') {
                    var s = ludo.dom.getWrappedSizeOfView(this.view);
                    // TODO test out layout in order to check that the line below is working.
                    this.view.layout.height = s.y;
                    return function () {
                        c.height = s.y;
                    }

                }
                if (value.indexOf !== undefined && value.indexOf('%') > 0) {
                    value = parseInt(value);
                    return function (view, renderer) {
                        c.height = (renderer.viewport.height * value / 100)
                    }
                }
                return function () {
                    c.height = this.view.layout[option];
                }.bind(this);
            case 'width':
                if (value === 'matchParent') {
                    return function (view, renderer) {
                        c.width = renderer.viewport.width;
                    }
                }
                if (value === 'wrap') {
                    var size = ludo.dom.getWrappedSizeOfView(this.view);
                    this.view.layout.width = size.x;
                    return function () {
                        c.width = size.x;
                    }

                }
                if (value.indexOf !== undefined && value.indexOf('%') > 0) {
                    value = parseInt(value);
                    return function (view, renderer) {
                        c.width = (renderer.viewport.width * value / 100)
                    }
                }
                return function () {
                    c.width = this.view.layout[option];
                }.bind(this);
            case 'rightOf':
                return function () {
                    c.left = value.offset().left + value.outerWidth();
                };
            case 'leftOf':
                return function () {
                    c.left = value.offset().left - c.width;
                };
            case 'leftOrRightOf':
                return function () {
                    var x = value.offset().left - c.width;
                    if (x - c.width < 0) {
                        x += (value.outerWidth() + c.width);
                    }
                    c.left = x;
                };
            case 'rightOrLeftOf' :
                return function (view, renderer) {
                    var val = value.offset().left + value.outerWidth();
                    if (val + c.width > renderer.viewport.width) {
                        val -= (value.outerWidth() + c.width);
                    }
                    c.left = val;
                };
            case 'above':
                return function (view, renderer) {
                    c.top = value.offset().top - c.height;
                };
            case 'below':
                return function () {
                    c.top = value.offset().top + value.height();
                };
            case 'alignLeft':
                return function () {
                    c.left = value.offset().left;
                };
            case 'alignTop':
                return function () {
                    c.top = value.offset().top;
                };
            case 'alignRight':
                return function () {
                    c.left = value.offset().left + value.outerWidth() - c.width;
                };
            case 'alignBottom':
                return function () {
                    c.top = value.offset().top + value.outerHeight() - c.height;
                };
            case 'offsetX' :
                return function () {
                    c.left = c.left ? c.left + value : value;
                };
            case 'offsetY':
                return function () {
                    c.top = c.top ? c.top + value : value;
                };
            case 'sameHeightAs':
                return function () {
                    c.height = value.height();
                };
            case 'offsetWidth' :
                return function () {
                    c.width = c.width + value;
                };
            case 'offsetHeight':
                return function () {
                    c.height = c.height + value;
                };
            case 'centerIn':
                return function () {
                    value = value.getEl != undefined ? value.getEl() : value;
                    var pos = value.offset();
                    c.top = (pos.top + (value.height() / 2)) - (c.height / 2);
                    c.left = (pos.left + value.outerWidth()/ 2)  - (c.width / 2);
                };
            case 'centerHorizontalIn':
                return function () {
                    c.left = (value.offset().left + value.outerWidth()) / 2 - (c.width / 2);
                };
            case 'centerVerticalIn':
                return function () {
                    c.top = (value.offset().top + (value.height() / 2)) - (c.height / 2);
                };
            case 'sameWidthAs':
                return function () {
                    c.width = value.outerWidth();
                };
            case 'x':
            case 'left':
                return function () {
                    c.left = this.view.layout[option];
                }.bind(this);
            case 'y':
            case 'top':
                return function () {
                    c.top = this.view.layout[option];
                }.bind(this);
            case 'fitVerticalViewPort':
                return function (view, renderer) {
                    if (c.height) {
                        var pos = c.top !== undefined ? c.top : view.getEl().offset().top;
                        if (pos + c.height > renderer.viewport.height - 2) {
                            c.top = renderer.viewport.height - c.height - 2;
                        }
                    }
                };
            default:
                return function () {
                };
        }
    },

    posKeys: ['left', 'right', 'top', 'bottom'],

    clearFn: function () {
        this.fn = undefined;
    },

    resize: function () {
        

        if (this.view.isHidden())return;
        if (this.fn === undefined)this.buildResizeFn();
        this.setViewport();

        this.fn.call(this);

        var c = this.coordinates;

        this.view.resize(c);


        if (c['bottom'])c['top'] = undefined;
        if (c['right'])c['left'] = undefined;

        for (var i = 0; i < this.posKeys.length; i++) {
            var k = this.posKeys[i];
            if (this.coordinates[k] !== undefined && this.coordinates[k] !== this.lastCoordinates[k])this.view.getEl().css(k, c[k]);
        }
        this.lastCoordinates = Object.clone(c);
    },

    resizeChildren: function () {
        if (this.view.children.length > 0)this.view.getLayout().resizeChildren();
    },

    setViewport: function () {
        if (!this.view.getEl || !this.view.getEl()) {
            console.trace();
            console.log(this.view);
            return;
        }
        var el = this.view.getEl().parent();
        if (!el)return;
        this.viewport.width = el.width();
        this.viewport.height = el.height();
    },

    getMinWidth: function () {
        return this.view.layout.minWidth || 5;
    },

    getMinHeight: function () {
        return this.view.layout.minHeight || 5;
    },

    getMaxHeight: function () {
        return this.view.layout.maxHeight || 5000;
    },

    getMaxWidth: function () {
        return this.view.layout.maxWidth || 5000;
    },

    setPosition: function (x, y) {
        if (x !== undefined && x >= 0) {
            this.coordinates.left = this.view.layout.left = x;
            this.view.getEl().css('left', x);
            this.lastCoordinates.left = x;
        }
        if (y !== undefined && y >= 0) {
            this.coordinates.top = this.view.layout.top = y;
            this.view.getEl().css('top', y);
            this.lastCoordinates.top = y;
        }
    },

    setSize: function (config) {

        if (config.left)this.coordinates.left = this.view.layout.left = config.left;
        if (config.top)this.coordinates.top = this.view.layout.top = config.top;
        if (config.width)this.view.layout.width = this.coordinates.width = config.width;
        if (config.height)this.view.layout.height = this.coordinates.height = config.height;
        this.resize();
    },

    position: function () {
        return {
            x: this.coordinates.left,
            y: this.coordinates.top
        };
    },

    getSize: function () {
        return {
            x: this.coordinates.width,
            y: this.coordinates.height
        }
    },

    setValue: function (key, value) {
        this.view.layout[key] = value;
    },

    getValue: function (key) {
        return this.view.layout[key];
    }
});