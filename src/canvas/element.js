/**
 * Base class for Canvas elements. canvas.Element can be handled as
 * {{#crossLink "canvas.Node"}}{{/crossLink}}, but it extends ludo.Core which
 * make it accessible using ludo.get('id'). The {{#crossLink "canvas.Node"}}{{/crossLink}} object
 * can be accessed using {{#crossLink "canvas.Element/getNode"}}{{/crossLink}}. A canvas.Element
 * object can be adopted to other elements or nodes using the  {{#crossLink "canvas.Element/adopt"}}{{/crossLink}}
 * or  {{#crossLink "canvas.Node/adopt"}}{{/crossLink}} methods.
 * A canvas element contains methods for transformations and other
 * @namespace canvas
 * @class Element
 * @extends ludo.Core
 */
ludo.canvas.Element = new Class({
	Extends:ludo.Core,

	/**
	 * Reference to canvas.Node
	 * @property {canvas.Node} node
	 */
	node:undefined,

	/**
	 * Which tag, example: "rect"
	 * @config {String} tag
	 */
	tag:undefined,

	engine:ludo.canvasEngine,
	/**
	 * Properties
	 * @config {Object} p
	 */
	p:undefined,

	/**
	 Attributes applied to DOM node
	 @config attr
	 @type {Object}
	 @default undefined
	 @example
	 	{
			x1:50,y1:50,x2:100,y2:150
		}
	 */
	attr:undefined,

	ludoConfig:function (config) {
		this.parent(config);
        this.setConfigParams(config, ['tag','attr']);
		this.node = new ludo.canvas.Node(this.tag, this.attr);
	},

	/**
	 * Return canvas node for this element
	 * @method getNode
	 * @return {canvas.Node} node
	 */
	getNode:function(){
		return this.node;
	},

	getEl:function () {
		return this.node.el;
	},

	set:function (key, value) {
		this.engine.set(this.getEl(), key, value);
	},

	/**
	 Returns value of an attribute
	 @method get
	 @param key
	 @return {String} value
	 @example
	 	var element = new ludo.canvas.Element('rect', {
	 		attr:{x1:100,y1:150,x2:200,y2:250}
	 	});
	 	alert(element.get('x1')); // outputs 100
	 */
	get:function (key) {
		return this.engine.get(this.getEl(), key);
	},

	setHtml:function (html) {
		this.engine.setHtml(this.getEl(), html);
	},

	rotate:function (degrees) {
		this.engine.rotate(this.getEl(), degrees);
	},
	toFront:function () {
		this.engine.toFront(this.getEl());
	},
	toBack:function () {
		this.engine.toBack(this.getEl());
	},
	skewX:function (degrees) {
		this.engine.skewX(this.getEl(), degrees);
	},
	skewY:function (degrees) {
		this.engine.skewY(this.getEl(), degrees);
	},

	/**
	 * Adopt element or node
	 * @method adopt
	 * @param {canvas.Element|canvas.Node} node
	 * @return {canvas.Element} parent
	 */
	adopt:function(node){
		this.node.adopt(node);
		return this;
	},

	/**
	 * Remove text and child nodes from element
	 * @method empty
	 * @return {canvas.Element} this
	 */
	empty:function(){
		this.node.empty();
		return this;
	},

	add:function(tagName, properties, config){
		return this.node.add(tagName,properties, config);
	}
});