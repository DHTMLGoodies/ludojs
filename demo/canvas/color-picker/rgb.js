ludo.colorPicker.RGB = new Class({
    Extends:ludo.FramedView,
    type:'colorPicker.RGB',
    useController:true,
    resizable:false,
    layout:'rows',
    height:130,
    minimizable:false,
    title:'RGB',
    colorObj:undefined,
    elCss:{
        'border-right': '0',
        'border-top': '0'
    },

    currentColor:{
        r:255, g:255, b:255
    },
    formConfig:{
        fieldWidth:60,
        labelWidth:80
    },
    children:[
        {
            type:'form.Number', height:24, minValue:0, maxValue:255, size:4, value:255, name:'r', label:'Red'
        },
        {
            type:'form.Number', height:24, minValue:0, maxValue:255, size:4, value:255, name:'g', label:'Green'
        },
        {
            type:'form.Number', height:24, minValue:0, maxValue:255, size:4, value:255, name:'b', label:'Blue'
        },
        {
            type:'form.Text', size:10, value:'#FFFFFF', label:'RGB', name:'rgb',
            validator:function (value) {
                return value.match(/^#?[A-F0-9]{6}$/i);
            }
        }
    ],

    ludoEvents:function () {
        this.parent();
        this.child['r'].addEvent('change', this.receiveColor.bind(this));
        this.child['g'].addEvent('change', this.receiveColor.bind(this));
        this.child['b'].addEvent('change', this.receiveColor.bind(this));
        this.child['rgb'].addEvent('change', this.receiveRGB.bind(this));
    },

    __rendered:function () {
        this.parent();
        this.colorObj = new ludo.color.Color();
    },

    receiveRGB:function (rgb) {
		rgb = rgb.replace(/#/g,'');
        this.setRGB(rgb);
        this.fireEvent('setColor', '#' + rgb);
    },

    receiveColor:function (value, obj) {
        if (this.currentColor[obj.name] != value) {

            this.currentColor[obj.name] = value;
			this.fireEvent('setRGBColorValue', [obj.name, value]);
        }
    },

    addControllerEvents:function () {
        this.controller.addEvent('setRGBValue', this.setValue.bind(this));
        this.controller.addEvent('setRGB', this.setRGB.bind(this));
    },

    setRGB:function (color) {
        this.child['rgb'].val(color);
    },

    setValue:function (property, value) {
        if (value != this.currentColor[property]) {
			value = Math.round(value);
            this.currentColor[property] = value;
            this.child[property].val(value);
        }
    }
});
