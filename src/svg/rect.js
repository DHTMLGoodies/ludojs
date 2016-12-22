/**
 Class for rect tags. It extends canvas.Node by adding setter and getter methods
 for x,y, width, height and rounded corners(rx and ry).
 @namespace ludo.canvas
 @class ludo.svg.Rect
 @augments ludo.svg.Node
 @param {Object} coordinates
 @param {canvas.NodeConfig} config
 @example
	 var rect = new ludo.svg.Rect(
 		{ x:100,y:100, width:200,height:100, "class":paintObject }
 	 );
 */
ludo.svg.Rect = new Class({
	Extends: ludo.svg.NamedNode,
	tagName : 'rect',

	/**
	 * Returns value of 'x' attribute. Actual position on canvas may be different due to
	 * translate transformation. Use {{#crossLink "canvas.Rect/getPosition"}}{{/crossLink}} to
	 * get actual position on canvas.
	 * @function getX
	 * @return {Number} x
	 * @memberof ludo.svg.Rect.prototype
	 */
	getX:function(){
		return this.el.x.animVal.value;
	},

	/**
	 * Returns value of 'y' attribute.
	 * @function getY
	 * @return {Number} y
	 * @memberof ludo.svg.Rect.prototype
	 */
	getY:function(){
		return this.el.y.animVal.value;
	},

	/**
	 * Returns width of rectangle
	 * @function getWidth
	 * @return {Number} width
	 * @memberof ludo.svg.Rect.prototype
	 */
	getWidth:function(){
		return this.el.width.animVal.value;
	},

	/**
	 * Returns height of rectangle
	 * @function getWidth
	 * @return {Number} width
	 * @memberof ludo.svg.Rect.prototype
	 */
	getHeight:function(){
		return this.el.height.animVal.value;
	},
	/**
	 * Return x-size of rounded corners
	 * @function getRx
	 * @return {Number} rx
	 * @memberof ludo.svg.Rect.prototype
	 */
	getRx:function(){
		return this.el.rx.animVal.value;
	},

	/**
	 * Return y-size of rounded corners
	 * @function getRy
	 * @return {Number} ry
	 * @memberof ludo.svg.Rect.prototype
	 */
	getRy:function(){
		return this.el.ry.animVal.value;
	},

	/**
	 * Set new x coordinate
	 * @function setX
	 * @param {Number} x
	 * @memberof ludo.svg.Rect.prototype
	 */
	setX:function(x){
		this.set('x', x);
	},

	/**
	 * Set new y coordinate
	 * @function setY
	 * @param {Number} y
	 * @memberof ludo.svg.Rect.prototype
	 */
	setY:function(y){
		this.set('y', y);
	},

	/**
	 * Set new width
	 * @function setWidth
	 * @param {Number} width
	 * @memberof ludo.svg.Rect.prototype
	 */
	setWidth:function(width){
		this.set('width', width);
	},
	/**
	 * Set new height
	 * @function setHeight
	 * @param {Number} height
	 * @memberof ludo.svg.Rect.prototype
	 */
	setHeight:function(height){
		this.set('height', height);
	},

	/**
	 * Set new width of rounded corners
	 * @function setRx
	 * @param {Number} rx
	 * @memberof ludo.svg.Rect.prototype
	 */
	setRx:function(rx){
		this.set('rx', rx);
	},

	/**
	 * Set new height of rounded corners
	 * @function setRy
	 * @param {Number} ry
	 * @memberof ludo.svg.Rect.prototype
	 */
	setRy:function(ry){
		this.set('ry', ry);
	}


});