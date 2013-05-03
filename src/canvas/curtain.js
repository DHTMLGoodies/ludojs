ludo.canvas.Curtain = new Class({
	Extends:ludo.canvas.Node,
	applyTo:undefined,
	nodes:{},
	bb:undefined,
	animation:undefined,
	action : undefined,

	initialize:function (node, config) {
		this.parent('clipPath');
		this.applyTo = node;

		var g = new ludo.canvas.Node('g');
		g.adopt(this);
		this.applyTo.getCanvas().appendChild(g.getEl());
		this.applyTo.applyClipPath(this);
	},

	open:function (direction, duration, fps) {
		this.setBB();
		this.action = 'open';
		this.getAnimation().animate(this.getCoordinates(direction), duration, fps);
	},

	getAnimation:function(){
		if(this.animation === undefined){
			this.animation = this.rect().animation();
			this.animation.addEvent('finish', this.removeClipPath.bind(this));
		}
		return this.animation;
	},

	setBB:function(){
		this.bb = this.applyTo.getBBox();
	},

	removeClipPath:function(){
		if(this.action === 'close'){
			this.applyTo.hide();
		}
		this.applyTo.remove('clip-path');

	},

	getCoordinates:function (direction, close) {

		switch(direction){
			case 'RightLeft':
				return {
					width:{
						from:0, to:this.bb.width
					},
					x: {
						from: this.bb.width + this.bb.x,
						to : this.bb.x
					}
				};
			case 'TopBottom':
				return {
					height:{
						from:0, to:this.bb.height
					}
				};
			case 'BottomTop':
				return {
					height:{
						from:0, to:this.bb.height
					},
					y:{
						from: this.bb.height + this.bb.y,
						to : this.bb.y
					}
				};

			default:
				return {
					width:{
						from:0, to:this.bb.width
					}
				};
		}

	},

	getDirections:function (direction) {
		return direction.replace(/([A-Z])/g, ' $1').trim().toLowerCase().split(/\s/g);
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