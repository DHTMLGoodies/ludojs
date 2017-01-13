/**
 * Base class for Canvas elements. canvas.View can be handled as
 * {{#crossLink "canvas.Node"}}{{/crossLink}}, but it extends ludo.Core which
 * make it accessible using ludo.get('id'). The {{#crossLink "canvas.Node"}}{{/crossLink}} object
 * can be accessed using {{#crossLink "canvas.View/getNode"}}{{/crossLink}}. A canvas.View
 * object can be adopted to other elements or nodes using the  {{#crossLink "canvas.View/adopt"}}{{/crossLink}}
 * or  {{#crossLink "canvas.Node/adopt"}}{{/crossLink}} methods.
 * A canvas element contains methods for transformations and other
 * @namespace ludo.canvas
 * @class ludo.svg.View
 * @param {Object} config
 * @param {String} config.tag SVG tag name, example "path"
 * @param {Object} config.attr Attributes for the svg tag, example: attr: { "d" : "M 100 100 L 200 200 Z" }
 *
 * @augments ludo.Core
 */
ludo.svg.View = new Class({
    Extends: ludo.Core,

    /**
     * Reference to canvas.Node
     * @property {canvas.Node} node
     * @memberof ludo.svg.View.prototype
     */
    node: undefined,

    tag: undefined,

    engine: ludo.svg,

    p: undefined,

    attr: undefined,

    __construct: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['tag', 'attr']);
        this.node = new ludo.svg.Node(this.tag, this.attr);
    },

    /**
     * Creates a new SVG node
     * @param {String} tag
     * @param {Object} properties
     * @returns {ludo.svg.Node}
     * @memberof ludo.svg.View.prototype
     * @example
     * var circle = svg.$('circle', { r: 50, cx:100,cy:150, fill: '#ff0000' });
     */
    $:function(tag, properties){
        return new ludo.svg.Node(tag, properties);
    },

    /**
     * Return canvas node for this element
     * @function getNode
     * @return {canvas.Node} node
     * @memberof ludo.svg.View.prototype
     */
    getNode: function () {
        return this.node;
    },

    getEl: function () {
        return this.node.el;
    },

    set: function (key, value) {
        this.node.set(key, value);
    },

    /**
     Returns value of an attribute
     @function get
     @memberof ludo.svg.View.prototype
     @param key
     @return {String} value
     @example
     var element = new ludo.svg.View('rect', {
	 		attr:{x1:100,y1:150,x2:200,y2:250}
	 	});
     alert(element.get('x1')); // outputs 100
     */
    get: function (key) {
        return this.node.get( key);
    },

    /**
     * Inserts text to the node if the node supports it
     * @param html
     * @memberof ludo.svg.View.prototype
     */
    html: function (html) {
        this.node.html(html);
    },

    /**
     * Rotate node by this many degrees
     * @function rotate
     * @param {Number} degrees
     * @memberof ludo.svg.View.prototype
     */
    rotate: function (degrees) {
        this.node.rotate(degrees);
    },

    /**
     * Bring view to front (z index)
     * @function toFront
     * @memberof ludo.svg.View.prototype
     */
    toFront: function () {
        this.node.toFront();
    },

    /**
     * Move view back (z-index)
     * @function toBack
     * @memberof ludo.svg.View.prototype
     */
    toBack: function () {
        this.node.toBack();
    },

    /**
     * Skew X by this many degrees
     * @function skewX
     * @param {Number} degrees
     * @memberof ludo.svg.View.prototype
     */
    skewX: function (degrees) {
        this.node.skewX(degrees);
    },

    /**
     * Skew Y by this many degrees
     * @function skewY
     * @param {Number} degrees
     * @memberof ludo.svg.View.prototype
     */
    skewY: function (degrees) {
        this.node.skewY(degrees);
    },

    /**
     * Hide SVG element
     * @function hide
     * @memberof ludo.svg.View.prototype
     */
    hide:function(){
        this.node.hide();
    },

    /**
     * Show SVG element
     * @function show
     * @memberof ludo.svg.View.prototype
     */
    show:function(){
        this.node.show();
    },

    /**
     * Scale SVG element
     * @param {Number} x x-Ratio
     * @param {Number} y y-Ratio
     * @memberof ludo.svg.View.prototype
     */
    scale: function (x, y) {
        this.node.scale(x, y);
    },

    /**
     * Apply CSS attribute to node
     * @param {String} key
     * @param {String|Number} value
     * @memberof ludo.svg.View.prototype
     */
    css: function (key, value) {
        this.node.css(key, value);
    },

    /**
     * Append child node
     * @function append
     * @param {ludo.svg.View|ludo.svg.Node} node
     * @return {canvas.View} parent
     * @memberof ludo.svg.View.prototype
     */
    append: function (node) {
        this.node.append(node);
        return this;
    },

    /**
     * Remove text and child nodes from element
     * @function empty
     * @return {canvas.View} this
     * @memberof ludo.svg.View.prototype
     */
    empty: function () {
        this.node.empty();
        return this;
    },

    // TODO refactor the method below
    /**
     * Appends a new child node and returns it.
     * @function add
     * @param {String} tagName
     * @param {Object} attributes
     * @param {String} text
     * @returns {ludo.svg.Node} created node
     * @memberof ludo.svg.View.prototype
     */

    add: function (tagName, attributes, text) {
        return this.node.add(tagName, attributes, text);
    }
});