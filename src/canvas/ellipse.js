/**
 Class for drawing ellipses.
 @namespace ludo.canvas
 @class ludo.canvas.Ellipse
 @augments ludo.canvas.NamedNode
 @param {Object} coordinates
 @param {ludo.canvas.NodeConfig} config
 @memberof ludo.canvas.Ellipse.prototype
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
	 * @memberof ludo.canvas.Ellipse.prototype
	 */
	setRadiusX:function (radius) {
		this.set('rx', radius);
	},

	/**
	 * Set new y-radius
	 * @function setRadiusY
	 * @param {Number} radius
	 * @memberof ludo.canvas.Ellipse.prototype
	 */
	setRadiusY:function (radius) {
		this.set('ry', radius);
	},

	/**
	 * Return curent radius
	 * @function getRadiusX
	 * @return {String|Number} x-radius
	 * @memberof ludo.canvas.Ellipse.prototype
	 */
	getRadiusX:function () {
		return this.el.rx.animVal.value;
	},

	/**
	 * Return curent y-radius
	 * @function getRadiusY
	 * @return {String|Number} y-radius
	 * @memberof ludo.canvas.Ellipse.prototype
	 */
	getRadiusY:function () {
		return this.el.ry.animVal.value;
	},

	/**
	 * Set new center X
	 * @function setCx
	 * @param {Number} x
	 * @memberof ludo.canvas.Ellipse.prototype
	 */
	setCx:function (x) {
		this.set('cx', x);
	},
	/**
	 * Return current center X
	 * @function getX
	 * @return {String|Number} cx
	 * @memberof ludo.canvas.Ellipse.prototype
	 */
	getCx:function () {
		return this.el.cx.animVal.value;
	},

	/**
	 * Set new center Y
	 * @function setCy
	 * @param {Number} y
	 * @memberof ludo.canvas.Ellipse.prototype
	 */
	setCy:function (y) {
		this.set('cy', y);
	},
	/**
	 * Return current center Y
	 * @function getCy
	 * @return {String|Number} cy
	 * @memberof ludo.canvas.Ellipse.prototype
	 */
	getCy:function () {
		return this.el.cy.animVal.value;
	},

	/**
	 * Return position on canvas
	 * @function getPosition()
	 * @return {Object} x and y
	 * @memberof ludo.canvas.Ellipse.prototype
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
	 @memberof ludo.canvas.Ellipse.prototype
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