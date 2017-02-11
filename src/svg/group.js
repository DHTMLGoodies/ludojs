/**
 * SVG Group DOM node which can be positioned as a child view
 * in the relative layout.
 * @namespace canvas
 * @class ludo.svg.Group
 */
ludo.svg.Group = new Class({
    Extends: ludo.svg.View,
    type: 'svg.Group',
    tag: 'g',
    layout: {},

    /**
     * Width of SVG group
     * @property {Number} width
     * @memberof ludo.svg.Group.prototype
     */
    width: undefined,


    children: undefined,

    parentGroup: undefined,

    /**
     * Height of SVG group
     * @property {Number} height
     * @memberof ludo.svg.Group.prototype
     */
    height: undefined,

    child: undefined,

    /**
     * Object with left, top, width and height coordinates of group
     * This object is updated on calls to position() and resize()
     * @property {Object} bbox
     * @memberof ludo.svg.Group.prototype
     */
    bbox:undefined,

    __construct: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['layout', 'renderTo', 'parentComponent', 'parentGroup', '__rendered']);

        this.layout = this.layout || {};
        this.layout.type = 'Canvas';

        config.children = config.children || this.__children();
        this.children = [];

        this.child = {};

        if (this.renderTo) {
            this.renderTo.append(this);
        }

        this.bbox = {
            left:0,top:0,width:0,height:0
        };

        jQuery.each(config.children, function (i, child) {
            child.layout = child.layout || {};
            child.parentGroup = this;
            this.children[i] = child = this.getLayout().addChild(child);
            child.renderTo = this;
            this.child[child.id || child.name] = child;
        }.bind(this));

        if (config.css) {
            this.node.css(this.css);
        }
    },

    __children: function () {
        return this.children || [];
    },

    __rendered: function () {


    },

    resize: function (coordinates) {
        if (coordinates.width) {
            this.width = this.bbox.width = Math.max(0, coordinates.width);
            this.set('width', coordinates.width + 'px');
        }
        if (coordinates.height) {
            this.height =this.bbox.height =  Math.max(0, coordinates.height);
            this.set('height', coordinates.height + 'px');
        }

        if (this.children.length > 0)this.getLayout().resizeChildren();

        this.fireEvent('resize', coordinates);
    },

    getSize: function () {
        return {
            x: this.width || this.renderTo.width(),
            y: this.height || this.renderTo.height()
        }
    },

    getCenter: function () {
        var s = this.getSize();
        return {
            x: s.x / 2, y: s.y / 2
        }
    },

    isHidden: function () {
        return false;
    },

    /**
     * Returns or set position of a SVG group. On no arguments, position will be returned, otherwise,
     * it will be set.
     * @param {Number} x
     * @param {Number} y
     * @returns {{left: *, top: *}}
     * @memberof ludo.svg.Group.prototype
     */
    position: function (x, y) {
        if (arguments.length > 0) {
            this.bbox.left = x;this.bbox.top = y;
            this.node.setTranslate(x, y);
        } else {
            var t = this.node.getTranslate();
            return {left: t[0], top: t[1]};
        }

    },


    getLayout: function () {
        if (!this.hasDependency('layoutManager')) {
            this.createDependency('layoutManager', ludo.layoutFactory.getManager(this));
        }
        return this.getDependency('layoutManager');
    },

    $b: function () {
        return this.node;
    },

    append: function (el) {
        return this.node.append(el);
    }
});