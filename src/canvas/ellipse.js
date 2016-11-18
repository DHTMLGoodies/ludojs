/**
 Class for drawing ellipses.
 @namespace ludo.canvas
 @class ludo.canvas.Ellipse
 @augments ludo.canvas.NamedNode
 @param {Object} coordinates
 @param {ludo.canvas.NodeConfig} config
 @example
 	var ellipse = new ludo.canvas.Ellipse({ cx:500, cy:425, rx:250, ry:200 }, { paint: paintObject } );
 */
ludo.canvas.Ellipse = new Class({
	Extends:ludo.canvas.NamedNode,
	tagName:'ellipse',

	/**
	 * Set new x-radius
	 * @function setRadiusX
	 * @param {Number} radius
	 */
	setRadiusX:function (radius) {
		this.set('rx', radius);
	},

	/**
	 * Set new y-radius
	 * @function setRadiusY
	 * @param {Number} radius
	 */
	setRadiusY:function (radius) {
		this.set('ry', radius);
	},

	/**
	 * Return curent radius
	 * @function getRadiusX
	 * @return {String|Number} x-radius
	 */
	getRadiusX:function () {
		return this.el.rx.animVal.value;
	},

	/**
	 * Return curent y-radius
	 * @function getRadiusY
	 * @return {String|Number} y-radius
	 */
	getRadiusY:function () {
		return this.el.ry.animVal.value;
	},

	/**
	 * Set new center X
	 * @function setCx
	 * @param {Number} x
	 */
	setCx:function (x) {
		this.set('cx', x);
	},
	/**
	 * Return current center X
	 * @function getX
	 * @return {String|Number} cx
	 */
	getCx:function () {
		return this.el.cx.animVal.value;
	},

	/**
	 * Set new center Y
	 * @function setCy
	 * @param {Number} y
	 */
	setCy:function (y) {
		this.set('cy', y);
	},
	/**
	 * Return current center Y
	 * @function getCy
	 * @return {String|Number} cy
	 */
	getCy:function () {
		return this.el.cy.animVal.value;
	},

	/**
	 * Return position on canvas
	 * @function getPosition()
	 * @return {Object} x and y
	 */
	getPosition:function () {
		var translate = this.getTranslate();
		return {
			x:this.getCx() - this.getRadiusX() + translate.x,
			y:this.getCy() - this.getRadiusY() + translate.y
		}
	},

	/**
	 Return size of ellipse
	 @function getSize
	 @return {Object} x and y
	 @example
	 	var ellipse = new ludo.canvas.Ellipse({ cx:500, cy:425, rx:250, ry:200 });
	 	var size = ellipse.geSize(); // will return {x: 500, y: 400}
	 which is rx*2 and ry*2

	 */
	getSize:function () {
		return {
			x:this.getRadiusX() * 2,
			y:this.getRadiusY() * 2
		}
	}
});