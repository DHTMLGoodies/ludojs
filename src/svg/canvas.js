/**
 Class used to create canvas(&lt;SVG>) object
 @namespace canvas
 @class ludo.svg.Canvas
 @param {Object} config
 @example
 	var canvas = new ludo.svg.Canvas({
 		renderTo:'idOfDiv'
 	});
 */
ludo.svg.Canvas = new Class({
	Extends:ludo.svg.View,
	tag:'svg',
	defaultProperties:{
		xmlns:'http://www.w3.org/2000/svg',
		version:'1.1'
	},
	renderTo:undefined,
	view:undefined,
	title:undefined,
	description:undefined,

	__construct:function (config) {
		config = config || {};
		config.attr = config.attr || {};
		config.attr = Object.merge(config.attr, this.defaultProperties);
		this.parent(config);

        this.setConfigParams(config, ['renderTo','title','description']);

		if(this.title)this.createTitle();
		if(this.description)this.createDescription();

		ludo.svg.setGlobalMatrix(this.node.el);

		if (this.renderTo !== undefined) {
			if(this.renderTo.getBody !== undefined){
				this.view = this.renderTo;
				this.view.addEvent('resize', this.fitParent.bind(this));
				this.renderTo = this.view.getBody();
			}else{
				this.renderTo = $(this.renderTo);
			}
			this.renderTo.append(this.getEl());
			this.setInitialSize(config);
		}
	},

	setInitialSize:function (config) {
		config.width = config.width || this.width;
		config.height = config.height || this.height;
		if (config.width && config.height) {
			this.set('width', config.width);
			this.set('height', config.height);
			this.setViewBox(config.width, config.height);
			this.width = config.width;
			this.height = config.height;
		} else {
			this.fitParent();
			this.renderTo.on('resize', this.fitParent.bind(this));
		}
	},

	fitParent:function(){
		var size = { x: this.renderTo.width(), y: this.renderTo.height() };
		if(size.x === 0 || size.y === 0)return;

		this.set('width', size.x);
		this.set('height', size.y);
		this.setViewBox(size.x, size.y);

		this.node.css('width', size.x + 'px');
		this.node.css('height', size.y + 'px');
		this.width = size.x;
		this.height = size.y;
		this.fireEvent('resize', size);
	},

    /**
     * Returns height of canvas
     * @function getHeight
     * @return {Number} height
	 * @memberof ludo.svg.Canvas.prototype
     */
	getHeight:function(){
		return this.height;
	},

    /**
     * Returns width of canvas
     * @function getWidth
     * @return {Number} width
	 * @memberof ludo.svg.Canvas.prototype
     */
	getWidth:function(){
		return this.width;
	},

    /**
     * Returns center point of canvas as an object with x and y coordinates
     * @function getCenter
     * @return {Object}
	 * @memberof ludo.svg.Canvas.prototype
     */
    getCenter:function(){
        return {
            x : this.width / 2,
            y : this.height / 2
        };
    },

	/**
	 * Update view box size
	 * @function setViewBox
	 * @param {Number} width Viewbox width
	 * @param {Number} height Viewbox height
	 * @param {Number} x Optional left/x position
	 * @param {Number} y Optional top/y position
	 * @memberof ludo.svg.Canvas.prototype
	 */
	setViewBox:function (width, height, x, y) {
		this.set('viewBox', (x || 0) + ' ' + (y || 0) + ' ' + width + ' ' + height);
	},

	createTitle:function(){
		this.append(new ludo.svg.Node('title',{}, this.title ));
	},
	createDescription:function(){
		this.append(new ludo.svg.Node('desc', {}, this.description ));
	},


	/**
	 * Create a SVG Stylesheet
	 * @param {String} className
	 * @param {Object} styles
	 * @memberof ludo.svg.Canvas.prototype
	 * @example
	 * svg.addStyleSheet('box', { fill : '#669900', stroke: '#000' });
	 * // Use the class
	 * var rect = new ludo.svg.Rect({
     *   	x:0,y:0,width:500,height:500
     * });
	 * svg.append(rect);
	 * rect.addClass('box');
     */
	addStyleSheet:function(className, styles){
		var p = new ludo.svg.Paint(styles, { className : className });
		this.appendDef(p);
	},


	defsNode:undefined,

	/**
	 * Returns reference to &lt;defs> node
	 * @function getDefs
	 * @return {canvas.Node} defs node
	 * @memberof ludo.svg.Canvas.prototype
	 */
	getDefs:function(){
		if(this.defsNode === undefined){
			this.defsNode = new ludo.svg.Node('defs');
			this.append(this.defsNode);
		}
		return this.defsNode;
	},

	/**
	 * Adopt node into &lt;defs> tag of canvas
	 * @function appendDef
	 * @param {canvas.Node|canvas.View} node
	 * @return {canvas.Node} defs Node
	 * @memberof ludo.svg.Canvas.prototype
	 */
	appendDef:function(node){
		return this.getDefs().append(node);
	}
});