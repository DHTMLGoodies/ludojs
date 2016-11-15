ludo.colorPicker.HSV = new Class({
	Extends:ludo.FramedView,
	type:'colorPicker.HSV',
	useController:true,
	layout:'rows',
	resizable:false,
	height:110,
	minimizable:false,
	title:'HSV',
	colorObj:undefined,
	elCss:{
		'border-right':'0',
		'border-top':'0'
	},
	css:{
		'background-color':'#FFF'
	},
	currentColor:{
		h:360, s:100, v:100
	},
	formConfig:{
		fieldWidth:60,
		labelWidth:80
	},
	children:[
		{
			type:'form.Number', height:24, minValue:0, maxValue:360, value:360, name:'h', label:'H'
		},
		{
			type:'form.Number', height:24, minValue:0, maxValue:100, value:100, name:'s', label:'S'
		},
		{
			type:'form.Number', height:24, minValue:0, maxValue:100, value:100, name:'v', label:'V'
		}
	],

	ludoEvents:function () {
		this.parent();
		this.child['h'].addEvent('change', this.receiveColor.bind(this));
		this.child['s'].addEvent('change', this.receiveColor.bind(this));
		this.child['v'].addEvent('change', this.receiveColor.bind(this));
	},

	__rendered:function () {
		this.parent();
		this.colorObj = new ludo.color.Color();
	},

	receiveColor:function (value, obj) {
		if (this.currentColor[obj.name] != value) {
			this.currentColor[obj.name] = value;
			this.fireColorEvent();
			if (obj.name === 'h')this.fireEvent('setHue', this.currentColor.h);
		}
	},
	addControllerEvents:function () {
		this.controller.addEvent('setHSVValue', this.val.bind(this));
	},

	fireColorEvent:function () {
		var color = this.colorObj.rgbCode(this.currentColor);
		this.fireEvent('setColor', color);
	},
	val:function (property, value) {
		value = Math.round(value);
		if (value !== this.currentColor[property]) {
			this.currentColor[property] = value;
			this.child[property].val(value);

		}
	}
});