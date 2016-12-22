/**
 Class for circle tags. It extends canvas.Node by adding setter and getter methods
 for radius, center x and center y.
 @namespace canvas
 @class ludo.svg.Circle
 @augments canvas.Node
 
 @param {Object} coordinates
 @param {canvas.NodeConfig} config
 @example
	 var circle = new ludo.svg.Circle(
 		{ cx:100, cy:100, r:200 },
	 	{ paint:paintObject }
 	 );
 */
ludo.svg.Circle = new Class({
	Extends:ludo.svg.NamedNode,
	tagName:'circle',

	/**
	 * Set new radius
	 * @function setRadius
	 * @param {Number} radius
	 * @memberof ludo.svg.Circle.prototype
	 */
	setRadius:function (radius) {
		this.set('r', radius);
	},

	/**
	 * Return curent radius
	 * @function getRadius
	 * @return {String|Number} radius
	 * @memberof ludo.svg.Circle.prototype
	 */
	getRadius:function () {
		return this.el.r.animVal.value;
	},

	/**
	 * Set new center X
	 * @function setCx
	 * @param {Number} x
	 * @memberof ludo.svg.Circle.prototype
	 */
	setCx:function (x) {
		this.set('cx', x);
	},
	/**
	 * Return current center X
	 * @function getX
	 * @return {String|Number} cx
	 * @memberof ludo.svg.Circle.prototype
	 */
	getCx:function () {
		return this.el.cx.animVal.value;
	},

	/**
	 * Set new center Y
	 * @function setCy
	 * @param {Number} y
	 * @memberof ludo.svg.Circle.prototype
	 */
	setCy:function (y) {
		this.set('cy', y);
	},
	/**
	 * Return current center Y
	 * @function getCy
	 * @return {String|Number} cy
	 * @memberof ludo.svg.Circle.prototype
	 */
	getCy:function () {
		return this.el.cy.animVal.value;
	},

	/**
	 * Return position on canvas
	 * @function getPosition()
	 * @return {Object} x and y
	 * @memberof ludo.svg.Circle.prototype
	 */
	getPosition:function(){
		var translate = this.getTranslate();
		var r = this.getRadius();
		return {
			x: this.getCx() - r + translate.x,
			y: this.getCy() - r + translate.y
		}
	},

	/**
	 * Returns diameter x diameter
	 * @function getSize
	 * @returns {{x: number, y: number}}
	 * @memberof ludo.svg.Circle.prototype
     */
	getSize:function(){
		var r = this.getRadius();
		return {
			x: r*2,
			y: r*2
		}
	}
});