ludo.colorPicker.Picker = new Class({
	Extends:ludo.View,
	type:'colorPicker.Picker',
	useController:true,


	currentBrightness : -1,
	currentSaturation: -1,
	__rendered:function () {
		this.parent();
		this.colorObj = new ludo.color.Color();
		var canvas = this.svg();

		this.addLeftRightMask();
		this.addTopBottomMask();

		this.colorRect = new ludo.svg.Node('rect', {
			x:0, y:0, width:'100%', height:'100%', fill:'#F00'
		});
		canvas.append(this.colorRect);

		var rect = new ludo.svg.Node('rect', { x:0, y:0, width:'100%', height:'100%', fill:this.getLeftRightGradient(), mask:this.maskTB});
		canvas.append(rect);

		this.rect = new ludo.svg.Node('rect', { x:0, y:0, width:'100%', height:'100%', fill:this.getLeftRightGradient(), mask:this.maskLR});
		this.rect.css('cursor', 'crosshair');
		canvas.append(this.rect);
		this.rect.on('click', this.receiveClick.bind(this));

		this.createCircle();

	},

	createCircle:function(){
		this.circle = new ludo.svg.Node('circle', { cx : 100, cy:100, r: 5 });
		this.circle.css('stroke', '#FFF');
		this.circle.css('fill', 'none');
		this.svg().append(this.circle);
	},
	getLeftRightGradient:function () {
		var gradient = new ludo.svg.Gradient({x1:'0%', y1:'0%', x2:'100%', y2:'0%'});
		gradient.addStop('0%', '#000', 1);
		gradient.addStop('100%', '#FFF', 1);
		this.svg().appendDef(gradient);
		return gradient;
	},

	addLeftRightMask:function () {
		this.maskLR = new ludo.svg.Mask();
		this.svg().appendDef(this.maskLR);
		var gradient = new ludo.svg.Gradient({x1:'0%', y1:'0%', x2:'100%', y2:'0%'});
		gradient.addStop('0%', '#FFF', 1);
		gradient.addStop('100%', '#FFF', 0);
		this.svg().appendDef(gradient);
		var rect = new ludo.svg.Node('rect', { x:0, y:0, width:'100%', height:'100%', fill:gradient});
		this.maskLR.append(rect);

	},
	addTopBottomMask:function () {
		this.maskTB = new ludo.svg.Mask();
		this.svg().appendDef(this.maskTB);
		var gradient = new ludo.svg.Gradient({x1:'0%', y1:'0%', x2:'0%', y2:'100%'});
		gradient.addStop('0%', '#FFF', 0);
		gradient.addStop('100%', '#FFF', 1);
		this.svg().appendDef(gradient);
		var rect = new ludo.svg.Node('rect', { x:0, y:0, width:'100%', height:'100%', fill:gradient});
		this.maskTB.append(rect);
	},

	receiveClick:function (e) {
		var bodyPos = this.getBodyPos();
		var pos = {
			x:e.pageX - bodyPos.left,
			y:e.pageY - bodyPos.top
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

		var pos = jQuery(b).offset();
		pos.left += ludo.dom.getBW(b)/2;
		pos.top += ludo.dom.getBH(b)/2;
		return pos;
	},

	getBodySize:function(){
		var b = this.getBody();
		return {
			x:b.width(),
			y:b.height()
		};
	},

	updateCircleStyleByBrightness:function(v){
		if(v > 50){
			this.circle.css('stroke', '#000');
		}else{
			this.circle.css('stroke', '#FFF');
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
