ludo.color.RGBSlider = new Class({
    Extends:ludo.View,
    layout:{
        type:'relative'
    },

    value:'#000000',

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['value']);
        if (this.value && !/^#[0-9A-F]{6}/gi.test(this.value)) {
            this.value = '#000000';
        }
    },

    ludoRendered:function () {
        this.parent();
        this.updatePreview();
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
                containerCss:{
                    margin:3
                },
                children:[
                    {
                        name:'colorValue',
                        css:{
                            'line-height' : 20,
                            'font-weight' : 'bold',
                            'text-align' : 'center'
                        },
                        layout:{
                            width:70,
                            height:20,
                            centerInParent:true
                        },
                        containerCss:{
                            border:'1px solid #000',
                            'background-color' : '#fff'
                        }
                    }
                ]
            }
        ];
    },

    getSlider:function (name, below) {
        return {
            name:name,
            id:name,
            value:this.getColorValue(name),
            type:'form.Slider', label:name.substr(0, 1).toUpperCase(), minValue:0, maxValue:255,
            labelWidth:20,
            layout:{
                alignParentTop:below ? false : true,
                below:below,
                height:20,
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
            }
        };
    },

    updatePreview:function () {
        var items = ['red', 'green', 'blue'];
        var color = '#';
        for (var i = 0; i < items.length; i++) {
            color = color + this.child[items[i]].getValue().toString(16);
        }
        this.child['preview'].getBody().style.backgroundColor = color;
        this.child['preview'].child['colorValue'].getBody().innerHTML = color.toUpperCase();
    },
    cInstance:undefined,
    colorInstance:function () {
        if (this.cInstance === undefined) {
            this.cInstance = new ludo.color.Color();
        }
        return this.cInstance;
    },

    getColorValue:function (color) {
        return this.colorInstance().rgbObject(this.value)[color.substr(0, 1)];
    }
});