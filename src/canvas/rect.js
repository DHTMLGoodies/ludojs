/**
 Class for rect tags. It extends canvas.Node by adding setter and getter methods
 for x,y, width, height and rounded corners(rx and ry).
 @namespace canvas
 @class Rect
 @augments canvas.Node
 @constructor
 @param {Object} coordinates
 @param {canvas.NodeConfig} config
 @example
	 var rect = new ludo.canvas.Rect(
 		{ x:100,y:100, width:200,height:100, "class":paintObject }
 	 );
 */
ludo.canvas.Rect = new Class({
	Extends: ludo.canvas.NamedNode,
	tagName : 'rect',

	/**
	 * Returns value of 'x' attribute. Actual position on canvas may be different due to
	 * translate transformation. Use {{#crossLink "canvas.Rect/getPosition"}}{{/crossLink}} to
	 * get actual position on canvas.
	 * @function getX
	 * @return {Number} x
	 */
	getX:function(){
		return this.el.x.animVal.value;
	},

	/**
	 * Returns value of 'y' attribute.
	 * @function getY
	 * @return {Number} y
	 */
	getY:function(){
		return this.el.y.animVal.value;
	},

	/**
	 * Returns width of rectangle
	 * @function getWidth
	 * @return {Number} width
	 */
	getWidth:function(){
		return this.el.width.animVal.value;
	},

	/**
	 * Returns height of rectangle
	 * @function getWidth
	 * @return {Number} width
	 */
	getHeight:function(){
		return this.el.height.animVal.value;
	},
	/**
	 * Return x-size of rounded corners
	 * @function getRx
	 * @return {Number} rx
	 */
	getRx:function(){
		return this.el.rx.animVal.value;
	},

	/**
	 * Return y-size of rounded corners
	 * @function getRy
	 * @return {Number} ry
	 */
	getRy:function(){
		return this.el.ry.animVal.value;
	},

	/**
	 * Set new x coordinate
	 * @function setX
	 * @param {Number} x
	 */
	setX:function(x){
		this.set('x', x);
	},

	/**
	 * Set new y coordinate
	 * @function setY
	 * @param {Number} y
	 */
	setY:function(y){
		this.set('y', y);
	},

	/**
	 * Set new width
	 * @function setWidth
	 * @param {Number} width
	 */
	setWidth:function(width){
		this.set('width', width);
	},
	/**
	 * Set new height
	 * @function setHeight
	 * @param {Number} height
	 */
	setHeight:function(height){
		this.set('height', height);
	},

	/**
	 * Set new width of rounded corners
	 * @function setRx
	 * @param {Number} rx
	 */
	setRx:function(rx){
		this.set('rx', rx);
	},

	/**
	 * Set new height of rounded corners
	 * @function setRy
	 * @param {Number} ry
	 */
	setRy:function(ry){
		this.set('ry', ry);
	}


});