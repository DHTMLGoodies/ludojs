/**
 Class for creating Radial Gradients,
 see: http://www.w3.org/TR/SVG/pservers.html#RadialGradientElement
 @namespace canvas
 @class RadialGradient
 @augments canvas.Gradient
 @example
 	var gradient = new ludo.canvas.RadialGradient({
		cx:400,cy:200,r:300,fx:400,fy:200
	});
 	gradient.addStop('0%', 'red');
 	gradient.addStop('50%', 'blue');
 	gradient.addStop('100%', 'red');
 */
ludo.canvas.RadialGradient = new Class({
	Extends:ludo.canvas.Gradient,
	tagName:'radialGradient',

	initialize:function (config) {
		config = config || {};
		config.gradientUnits = config.gradientUnits || 'userSpaceOnUse';
		this.parent(config);
	},

	setCx:function (value) {
		this.set('cx', value);
	},

	setCy:function (value) {
		this.set('cy', value);
	},

	setR:function (value) {
		this.set('r', value);
	},

	setFx:function (value) {
		this.set('fx', value);
	},

	setFy:function (value) {
		this.set('fy', value);
	}
});