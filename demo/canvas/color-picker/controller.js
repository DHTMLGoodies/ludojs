ludo.colorPicker.Controller = new Class({
    Extends:ludo.controller.Controller,
    type:'colorPicker.Controller',
    singleton:true,

	currentRGBCode : undefined,
	currentRGB:{ r:undefined, g:undefined, b:undefined },
	currentHSV:{  h:undefined, s:undefined, v:undefined },

	rgbKeys : ['r','g','b'],
	hsvKeys : ['h','s','v'],

    ludoConfig:function (config) {
        this.parent(config);
        this.colorObj = new ludo.color.Color();
    },
    addView:function (view) {
        view.addEvent('setColor', this.setColor.bind(this));
		view.addEvent('setRGBColorValue', this.receiveRGBValue.bind(this));
		view.addEvent('setHSVColorValue', this.receiveHSVValue.bind(this));
		view.addEvent('setHue', this.receiveHue.bind(this));
    },

	receiveRGBValue:function(key, value){
		this.currentRGB[key] = value;
		this.currentRGBCode = this.colorObj.rgbCode(this.currentRGB);
		this.currentHSV = this.colorObj.toHSV(this.currentRGB);
		this.fireHSVValueEvents(0);
		this.fireRGBColorEvent();
	},
	receiveHue:function(hue){
		this.receiveHSVValue('h', hue);
		this.fireEvent('setHSVValue', ['h', this.currentHSV['h']]);

	},
	receiveHSVValue:function(key, value){
		this.currentHSV[key] = value;
		this.currentRGB = this.colorObj.hsvToRGB(this.currentHSV);
		this.currentRGBCode = this.colorObj.rgbCode(this.currentRGB);

		this.fireRGBValueEvents(0);
		this.fireHSVValueEvents(0);
		this.fireRGBColorEvent();
	},

    setColor:function (color) {
		if (color !== this.currentColor) {
			this.currentRGBCode = color;
			this.currentRGB = this.colorObj.rgbObject(color);
			this.currentHSV = this.colorObj.toHSV(this.currentRGB);
			this.fireRGBValueEvents(0);
			this.fireHSVValueEvents(0);
            this.fireRGBColorEvent();
        }
    },

	fireRGBColorEvent:function(){
		this.fireEvent('setRGB', this.currentRGBCode);
	},

	fireRGBValueEvents:function(except){
		for(var i=0;i<this.rgbKeys.length;i++){
			var key = this.rgbKeys[i];
			if(key !== except)this.fireEvent('setRGBValue', [key, this.currentRGB[key]]);
		}
	},

	fireHSVValueEvents:function(except){
		for(var i=0;i<this.hsvKeys.length;i++){
			var key = this.hsvKeys[i];
			if(key !== except)this.fireEvent('setHSVValue', [key, this.currentHSV[key]]);
		}
	},

	getHSV:function(){
		return {
			h : Math.round(this.currentHSV.h),
			s : Math.round(this.currentHSV.s),
			v : Math.round(this.currentHSV.v)
		}
	}
});
var controller = new ludo.colorPicker.Controller({
    id:'myController'
});
