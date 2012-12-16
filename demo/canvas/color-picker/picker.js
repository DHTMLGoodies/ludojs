ludo.colorPicker.Picker = new Class({
	Extends:ludo.View,
	type:'colorPicker.Picker',
	useController:true,
	css:{
		margin:3,
		border:'1px solid #C0C0C0'
	},

	currentBrightness : -1,
	currentSaturation: -1,
	ludoRendered:function () {
		this.parent();
		this.colorObj = new ludo.color.Color();
		var canvas = this.getCanvas();

		this.addLeftRightMask();
		this.addTopBottomMask();

		this.colorRect = new ludo.canvas.Rect({
			x:0, y:0, width:'100%', height:'100%', fill:'#F00'
		});
		canvas.adopt(this.colorRect);

		var rect = new ludo.canvas.Rect({ x:0, y:0, width:'100%', height:'100%', fill:this.getLeftRightGradient(), mask:this.maskTB});
		canvas.adopt(rect);

		this.rect = new ludo.canvas.Rect({ x:0, y:0, width:'100%', height:'100%', fill:this.getLeftRightGradient(), mask:this.maskLR});
		this.rect.setStyle('cursor', 'crosshair');
		canvas.adopt(this.rect);
		this.rect.addEvent('click', this.receiveClick.bind(this));

		this.createCircle();

	},

	createCircle:function(){
		this.circle = new ludo.canvas.Circle({ cx : 100, cy:100, r: 5 });
		this.circle.setStyle('stroke', '#FFF');
		this.circle.setStyle('fill', 'none');
		this.getCanvas().adopt(this.circle);
	},
	getLeftRightGradient:function () {
		var gradient = new ludo.canvas.Gradient({x1:'0%', y1:'0%', x2:'100%', y2:'0%'});
		gradient.addStop('0%', '#000', 1);
		gradient.addStop('100%', '#FFF', 1);
		this.getCanvas().adoptDef(gradient);
		return gradient;
	},

	addLeftRightMask:function () {
		this.maskLR = new ludo.canvas.Mask();
		this.getCanvas().adoptDef(this.maskLR);
		var gradient = new ludo.canvas.Gradient({x1:'0%', y1:'0%', x2:'100%', y2:'0%'});
		gradient.addStop('0%', '#FFF', 1);
		gradient.addStop('100%', '#FFF', 0);
		this.getCanvas().adoptDef(gradient);
		var rect = new ludo.canvas.Rect({ x:0, y:0, width:'100%', height:'100%', fill:gradient});
		this.maskLR.adopt(rect);

	},
	addTopBottomMask:function () {
		this.maskTB = new ludo.canvas.Mask();
		this.getCanvas().adoptDef(this.maskTB);
		var gradient = new ludo.canvas.Gradient({x1:'0%', y1:'0%', x2:'0%', y2:'100%'});
		gradient.addStop('0%', '#FFF', 0);
		gradient.addStop('100%', '#FFF', 1);
		this.getCanvas().adoptDef(gradient);
		var rect = new ludo.canvas.Rect({ x:0, y:0, width:'100%', height:'100%', fill:gradient});
		this.maskTB.adopt(rect);
	},

	receiveClick:function (e) {
		var b = this.getBody();
		var bodyPos = this.getBodyPos();
		var pos = {
			x:e.page.x - bodyPos.x,
			y:e.page.y - bodyPos.y
		};
		var size = this.getBodySize();
		var s = (size.y - pos.y) / size.y * 100;
		this.positionCircleBySaturation(s);
		s = Math.min(100, Math.round(s));
		this.fireEvent('setHSVColorValue', ['s', s]);

		var v = 100 - ((size.x - pos.x) / size.x * 100);

		this.positionCircleByBrightness(v);
		v = Math.round(v);
		this.fireEvent('setHSVColorValue', ['v', v]);

		this.updateCircleStyleByBrightness(v);
	},

	getBodyPos:function(){
		var b = this.getBody();
		var pos = b.getPosition();
		pos.x += ludo.dom.getBW(b)/2;
		pos.y += ludo.dom.getBH(b)/2;
		return pos;
	},

	getBodySize:function(){
		var b = this.getBody();
		return {
			x:b.offsetWidth- ludo.dom.getBW(b) - ludo.dom.getPW(b),
			y:b.offsetHeight - ludo.dom.getBH(b) - ludo.dom.getPH(b)
		};
	},

	updateCircleStyleByBrightness:function(v){
		if(v > 50){
			this.circle.setStyle('stroke', '#000');
		}else{
			this.circle.setStyle('stroke', '#FFF');
		}
	},

	addControllerEvents:function () {
		this.controller.addEvent('setHSVValue', this.HSVValue.bind(this));
	},
	HSVValue:function (key, value) {
		if (key === 'h'){
			this.colorRect.set('fill', this.colorObj.rgbCode({ h:value, s:100, v:100 }));
		}else{
			if(key=='s'){
				this.positionCircleBySaturation(value);
			}
			if(key=='v'){
				this.positionCircleByBrightness(value);
				this.updateCircleStyleByBrightness(value);
			}
		}
	},

	positionCircleByBrightness:function(value){
		if(Math.round(value) != Math.round(this.currentBrightness)){
			this.circle.set('cx', value + '%');
			this.currentBrightness = value;
		}
	},
	positionCircleBySaturation:function(value){
		if(Math.round(value) != Math.round(this.currentSaturation)){
			this.circle.set('cy', (100 - value) + '%');
			this.currentSaturation = value;
		}
	}
});
