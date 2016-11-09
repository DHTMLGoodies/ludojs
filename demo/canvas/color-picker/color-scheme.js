ludo.colorPicker.ColorScheme = new Class({
	Extends: ludo.View,
	useController:true,
	type:'colorPicker.ColorScheme',
	css:{
		'background-color' : '#f5f5f5'
	},
	elCss:{
		'border-top': '1px solid #C0C0C0'
	},
	colorBoxes:[],
	currentColorCount : undefined,

	colors:undefined,
	stateful:true,
	statefulProperties:['colors'],

	ludoConfig:function(config){
		this.parent(config);
		if(config.colors !== undefined)this.colors = config.colors;
	},
	ludoRendered:function(){
		this.parent();
		this.colorObj = new ludo.color.Color();
		this.getBody().html('<div class="default-color-scheme-box">Generate color scheme using the buttons below</div>');
		if(this.colors !== undefined){
			this.renderColorBoxes(this.colors);
		}
	},

	createDefaultColorBoxes:function(){
		this.getBody().html('');
		var c = $('<div>');
		this.getBody().append(c);

		c.css('height', '100%');
		c.css('width', '2000px');
		for(var i=0;i<9;i++){
			var box = this.colorBoxes[i] =  $('<div class="color-scheme-box" style="position:relative;float:left;display:none;cursor:pointer"></div>');

			box.on('click', this.boxClick.bind(this));
			c.append(box);
		}
	},

	boxClick:function(e){
		this.fireEvent('setColor', e.target.title);
	},

	generateMonochromaticScheme:function(color){
		var colors = this.getColorsBySaturation(color, [-28,-21,-14,-7,0,7,14,21,28]);
		this.renderColorBoxes(colors);
	},

	generateComplementaryScheme:function(color){
		var colors = this.getColors(color, [-15,0,15,165,180,195]);
		this.renderColorBoxes(colors);
	},

	generateTriadScheme:function(color){
		var colors = this.getColors(color, [0,120,240]);
		this.renderColorBoxes(colors);
	},

	generateSplitComplementary:function(color){
		var colors = this.getColors(color, [0,160,200]);
		this.renderColorBoxes(colors);
	},

	showBoxes:function(howMany){
		for(var i=0;i<howMany;i++){
			this.colorBoxes[i].css('display', '');
		}
		for(i=howMany;i<this.colorBoxes.length;i++){
			this.colorBoxes[i].css('display','none');
		}
		currentColorCount = howMany;
	},

	renderColorBoxes:function(colors){
		if(this.colorBoxes.length === 0){
			this.createDefaultColorBoxes();
		}
		if(colors.length !== this.currentColorCount)this.showBoxes(colors.length);
		for(var i=colors.length-1;i>=0;i--){
			this.colorBoxes[i].css('backgroundColor', colors[i]);
			this.colorBoxes[i].title = colors[i];

		}
		this.colors = colors;
		this.fireEvent('state');
	},

	getColors:function(startColor, offsets){
		var ret = [];
		for(var i=0;i<offsets.length;i++){
			var h = startColor.h + offsets[i];
			if(h>=360)h-=360;
			if(h<0)h+=360;
			ret.push(this.colorObj.rgbCode({ h: h, s : startColor.s, v: startColor.v }));
		}
		return ret;
	},

	getColorsBySaturation:function(startColor, offsets){
		var ret = [];
		for(var i=0;i<offsets.length;i++){
			var s = startColor.s + offsets[i];
			if(s>=100)s-=100;
			if(s<0)s+=100;
			ret.push(this.colorObj.rgbCode({ h: startColor.h, s : s, v: startColor.v }));
		}
		return ret;
	}
});