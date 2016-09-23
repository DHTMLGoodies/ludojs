/**
 Class used to create canvas(&lt;SVG>) object
 @namespace canvas
 @class Canvas
 @constructor
 @param {Object} config
 @example
 	var canvas = new ludo.canvas.Canvas({
 		renderTo:'idOfDiv'
 	});
 */
ludo.canvas.Canvas = new Class({
	Extends:ludo.canvas.Element,
	tag:'svg',
	defaultProperties:{
		xmlns:'http://www.w3.org/2000/svg',
		version:'1.1'
	},
	renderTo:undefined,
	view:undefined,
	title:undefined,
	description:undefined,

	ludoConfig:function (config) {
		config = config || {};
		config.attr = config.attr || {};
		config.attr = Object.merge(config.attr, this.defaultProperties);
		this.parent(config);

        this.setConfigParams(config, ['renderTo','title','description']);

		if(this.title)this.createTitle();
		if(this.description)this.createDescription();

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
		size.x -= (ludo.dom.getPW(this.renderTo) + ludo.dom.getBW(this.renderTo));
		size.y -= (ludo.dom.getPH(this.renderTo) + ludo.dom.getBH(this.renderTo));
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
     * @method getHeight
     * @return {Number} height
     */
	getHeight:function(){
		return this.height;
	},

    /**
     * Returns width of canvas
     * @method getWidth
     * @return {Number} width
     */
	getWidth:function(){
		return this.width;
	},

    /**
     * Returns center point of canvas as an object with x and y coordinates
     * @method getCenter
     * @return {Object}
     */
    getCenter:function(){

        return {
            x : this.width / 2,
            y : this.height / 2
        };
    },

	/**
	 * Update view box size
	 * @method setViewBox
	 * @param width
	 * @type {Number}
	 * @param height
	 * @type {Number}
	 * @param x
	 * @type {Number}
	 * @optional
	 * @param y
	 * @type {Number}
	 * @optional
	 */
	setViewBox:function (width, height, x, y) {
		this.set('viewBox', (x || 0) + ' ' + (y || 0) + ' ' + width + ' ' + height);
	},

	createTitle:function(){
		this.append(new ludo.canvas.Node('title',{}, this.title ));
	},
	createDescription:function(){
		this.append(new ludo.canvas.Node('desc', {}, this.description ));
	},
	defsNode:undefined,

	/**
	 * Returns reference to &lt;defs> node
	 * @method getDefs
	 * @return {canvas.Node} defs node
	 */
	getDefs:function(){
		if(this.defsNode === undefined){
			this.defsNode = new ludo.canvas.Node('defs');
			this.append(this.defsNode);
		}
		return this.defsNode;
	},

	/**
	 * Adopt node into &lt;defs> tag of canvas
	 * @method appendDef
	 * @param {canvas.Node|canvas.Element} node
	 * @return {canvas.Node} defs Node
	 */
	appendDef:function(node){
		return this.getDefs().append(node);
	}
});