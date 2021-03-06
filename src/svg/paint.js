/**
 Class for styling of SVG DOM nodes
 @namespace ludo.canvas
 @class ludo.svg.Paint
 @param {Object} config
 @example
 	var canvas = new ludo.svg.Canvas({
		renderTo:'myDiv'
 	});

 	var paint = new ludo.svg.Paint({
		'stroke-width' : 5,
		'stroke-opacity' : .5,
		'stroke-color' : '#DEF'
	}, { className : 'MyClass' );
 	canvas.appendDef(paint); // Appended to &lt;defs> node

 	// create node and set "class" to paint
 	// alternative methods:
 	// paint.applyTo(node); and
 	// node.addClass(paint.getClassName());
	var node = new ludo.svg.Node('rect', { id:'myId2', 'class' : paint});

 	canvas.append(node);

 	// Paint object for all &lt;rect> and &lt;circle> tags:

	var gradient = new ludo.svg.Gradient({
        id:'myGradient'
    });
    canvas.append(gradient);
    gradient.addStop('0%', '#0FF');
    gradient.addStop('100%', '#FFF', 0);
    // New paint object applied to all &lt;rect> and &lt;circle> tags.
 	var paint = new ludo.svg.Paint({
		'stroke-width' : 5,
		'fill' : gradient,
		'stroke-opacity' : .5,
		'stroke-color' : '#DEF'
	}, { selectors : 'rect, circle' );
 */

ludo.svg.Paint = new Class({
	Extends:ludo.svg.Node,
	tagName:'style',
	css:{},
	nodes:[],
	className:undefined,
	tag:undefined,
	cssPrefix : undefined,

	mappings:{
		'color':['stroke-color'],
		'background-color':['fill-color'],
		'opacity':['fill-opacity', 'stroke-opacity']
	},

	initialize:function (css, config) {
		config = config || {};
		this.className = config.className || 'css-' + String.uniqueID();
		this.cssPrefix = config.selectors ? config.selectors : '.' + this.className;
		if(config.selectors)delete config.selectors;
		if(config.className)delete config.className;
		this.parent(this.tagName, config);
		if (css !== undefined)this.setStyles(css);
	},

	setStyles:function (styles) {
		Object.each(styles, function (value, key) {
			this.setStyleProperty(key, value);
		}, this);
		this.updateCssContent();
	},

	/**
	 Update a css style
	 @function setStyle
	 @param {String} style
	 @param {String|Number}value
	 @memberof ludo.svg.Paint.prototype
	 @example
	 	var paint = new ludo.svg.Paint({
	 		css:{
	 			'stroke-opacity' : 0.5
	 		}
	 	});
	 	canvas.append(paint);
	 	paint.setStyle('stroke-opacity', .2);
	 */
	setStyle:function (style, value) {
		this.setStyleProperty(style, value);
		this.updateCssContent();
	},

	updateCssContent:function () {
		var css = JSON.stringify(this.css);
		css  = css.replace(/"/g,"");
		css  = css.replace(/,/g,";");
		this.text(this.cssPrefix + css);
	},

	setStyleProperty:function (style, value) {
		value = this.getRealValue(value);
		if (this.mappings[style]) {
			this.setMapped(style, value);
		} else {
			this.css[style] = value;
		}
	},

	setMapped:function (style, value) {
		for (var i = 0; i < this.mappings[style].length; i++) {
			var m = this.mappings[style][i];
			this.css[m] = value;
		}
	},

	/**
	 * Return value of a css style
	 * @function getStyle
	 * @param {String} style
	 * @return {String|Number} value
	 * @memberof ludo.svg.Paint.prototype
	 */
	getStyle:function (style) {
		if (this.mappings[style])style = this.mappings[style][0];
		return this.css[style];
	},

	getRealValue:function (value) {
		return value && value.id !== undefined ? 'url(#' + value.id + ')' : value;
	},

	/**
	 * Apply css to a SVG node. This is done by adding CSS class to the node
	 * @function applyTo
	 * @param {canvas.Node} node
	 * @memberof ludo.svg.Paint.prototype
	 */
	applyTo:function (node) {
		ludo.svg.addClass(node.el ? node.el : node, this.className);
	},

	/**
	 * Returns class name of Paint object
	 * @function getClassName
	 * @return {String} className
	 * @memberof ludo.svg.Paint.prototype
	 */
	getClassName:function () {
		return this.className;
	},

	getUrl:function(){
		return this.className;
	}
});
