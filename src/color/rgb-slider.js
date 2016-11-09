ludo.color.RGBSlider = new Class({
    Extends:ludo.color.Base,
	type:'color.RGBSlider',
    layout:{
        type:'relative'
    },
    value:'#000000',
    regex:/^\#[0-9A-Fa-f]{6}$/i,

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['value']);
    },

    ludoRendered:function () {
        this.parent();
        this.updatePreview();
        this.child['preview'].child['colorValue'].addEvent('setColor', this.receiveColor.bind(this));
    },

    show:function(){
        this.parent();
        this.updateSliders();
    },

    setColor:function (color) {
        if (this.regex.test(color)) {
            this.value = color;
            this.updateSliders();
        }
    },

    getClassChildren:function () {
        return [
            this.getSlider('red', undefined),
            this.getSlider('green', 'red'),
            this.getSlider('blue', 'green'),
            this.getNumberField('red', undefined),
            this.getNumberField('green', 'redValue'),
            this.getNumberField('blue', 'greenValue'),
            {
                id:'colorPreview',
                name:'preview',
                layout:{
                    alignParentLeft:true,
                    fillRight:true,
                    below:'blueValue',
                    fillDown:true,
                    width:'matchParent',
                    type:'relative'
                },
                css:{
                    border:'1px solid #000'
                },
                elCss:{
                    margin:3
                },
                children:[
                    {
                        name:'colorValue',
                        type:'color.RGBSliderValue'
                    }
                ]
            }
        ];
    },

    receiveColor:function (color) {
        this.fireEvent('setColor', color.toUpperCase());
    },

    getSlider:function (name, below) {
        return {
            name:name,
            id:name,
            value:this.getColorValue(name),
            type:'form.Slider',
            label:name.substr(0, 1).toUpperCase() + name.substr(1), minValue:0, maxValue:255,
            labelWidth:45,
            layout:{
                alignParentTop:below ? false : true,
                below:below,
                height:23,
                leftOf:name + 'Value',
                fillLeft:true
            },
            listeners:{
                'change':this.updatePreview.bind(this)
            }
        };
    },

    getNumberField:function (name, below) {
        return {
            type:'form.Number',
            minValue:0,
            maxValue:255,
            fieldWidth:30,
            value:this.getColorValue(name),
            label:'',
            name:name + 'Value',
            linkWith:name,
            layout:{
                alignParentRight:true,
                width:40,
                below:below
            },
            listeners:{
                'change':this.updatePreview.bind(this)
            }
        };
    },

    updatePreview:function () {
        var items = ['red', 'green', 'blue'];
        var color = '#';

        for (var i = 0; i < items.length; i++) {
            color = color + this.prefixed(parseInt(this.child[items[i]].val()).toString(16));
        }
        this.child['preview'].getBody().css('backgroundColor',  color);
        this.child['preview'].child['colorValue'].setColor(color);

    },

    prefixed:function (color) {
        return color.length === 1 ? '0' + color : color;
    },
    cInstance:undefined,
    colorInstance:function () {
        if (this.cInstance === undefined) {
            this.cInstance = new ludo.color.Color();
        }
        return this.cInstance;
    },

    getColorValue:function (color) {
        return this.colorInstance().rgbObject(this.value)[color.substr(0, 1)] || 0;
    },

    updateSliders:function(){

        if(!this.child['red'] || !this.value)return;

        var color = this.colorInstance().rgbObject(this.value);

        this.child['red'].val(color.r);
        this.child['green'].val(color.g);
        this.child['blue'].val(color.b);
        this.updatePreview();
    }
});

ludo.color.RGBSliderValue = new Class({
    Extends:ludo.View,
    color:undefined,
    cls:'ludo-color-rgb-slider-value',
    layout:{
        width:70,
        height:20,
        centerInParent:true
    },

    overflow:'hidden',

    ludoEvents:function () {
        this.parent();
        this.getBody().on('click', this.sendColor.bind(this));
    },

    setColor:function (color) {
        this.color = color;
        this.getBody().html(color.toUpperCase());
    },

    sendColor:function () {
        this.fireEvent('setColor', this.color);
    }
});