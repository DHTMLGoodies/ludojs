/**
 Special animation class for SVG elements
 @namespace canvas
 @class Curtain
 @constructor
 @param {ludo.canvas.Node} node
 @example
	node.curtain().open('LeftRight');
 */
ludo.canvas.Curtain = new Class({
	Extends:ludo.canvas.Node,
	applyTo:undefined,
	nodes:{},
	bb:undefined,
	animation:undefined,
	action:undefined,

	initialize:function (node) {
		this.parent('clipPath');
		this.applyTo = node;

		var g = new ludo.canvas.Node('g');
		g.adopt(this);
		this.applyTo.getCanvas().appendChild(g.getEl());

	},

	/**
	 * Open curtains, i.e. show element
	 * @method open
	 * @param {String} direction (LeftRight, TopBottom, BottomTop or RightLeft),
	 * @param {Number} duration in seconds
	 * @optional
	 * @default 1
	 * @param {Number} fps (Frames per second)
	 * @optional
	 * @default 33
	 */
	open:function (direction, duration, fps) {
		this.onStart();
		this.action = 'open';
		this.getAnimation().animate(this.getCoordinates(direction), duration, fps);

	},

	/**
	 * Close curtains, i.e. hide element
	 * @method close
	 * @param {String} direction (LeftRight, TopBottom, BottomTop or RightLeft),
	 * @param {Number} duration in seconds
	 * @optional
	 * @default 1
	 * @param {Number} fps (Frames per second)
	 * @optional
	 * @default 33
	 */
	close:function (direction, duration, fps) {
		this.onStart();
		this.action = 'close';
		this.getAnimation().animate(this.getCoordinates(direction, true), duration, fps);
	},

	onStart:function(){
		this.applyTo.show();
		this.setBB();
		this.applyTo.applyClipPath(this);
	},

	getAnimation:function () {
		if (this.animation === undefined) {
			this.animation = this.rect().animation();
			this.animation.addEvent('finish', this.removeClipPath.bind(this));
		}
		this.rect().setProperties(this.bb);
		return this.animation;
	},

	setBB:function () {
		this.bb = this.applyTo.getBBox();

	},

	removeClipPath:function () {
		if (this.action === 'close') {
			this.applyTo.hide();
		}
		this.applyTo.remove('clip-path');

	},

	getCoordinates:function (direction, close) {
		var ret;

		if(close){
			var tokens = this.getDirections(direction);
			direction = tokens[1]+tokens[0];
		}
		switch (direction) {
			case 'RightLeft':
				ret = {
					width:{
						from:0, to:this.bb.width
					},
					x:{
						from:this.bb.width + this.bb.x,
						to:this.bb.x
					}
				};
				break;
			case 'TopBottom':
				ret = {
					height:{
						from:0, to:this.bb.height
					}
				};
				break;
			case 'BottomTop':
				ret = {
					height:{
						from:0, to:this.bb.height
					},
					y:{
						from:this.bb.height + this.bb.y,
						to:this.bb.y
					}
				};
				break;

			default:
				ret = {
					width:{
						from:0, to:this.bb.width
					}
				};
		}

		if(close){
			var keys = ['width','height','x','y'];
			for(var i=0;i<keys.length;i++){
				if(ret[keys[i]] !== undefined){
					var f = ret[keys[i]].from;
					ret[keys[i]].from = ret[keys[i]].to;
					ret[keys[i]].to = f;
				}
			}
		}

		return ret;
	},

	getDirections:function (direction) {
		return direction.replace(/([A-Z])/g, ' $1').trim().split(/\s/g);
	},

	rect:function () {
		if (this.nodes['rect'] === undefined) {
			this.nodes['rect'] = new ludo.canvas.Rect({
				x:this.bb.x, y:this.bb.y,
				width:this.bb.width,
				height:this.bb.height
			});
			this.adopt(this.nodes['rect'])
		}
		return this.nodes['rect'];
	}

});