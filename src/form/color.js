ludo.form.Color = new Class({
    Extends:ludo.form.Combo,
    regex:/^#[0-9A-F]{6}$/i,
    childLayout:{
        width:250, height:250
    },

    getClassChildren:function () {
        return [
            {
                layout:{
                    'type':'tabs'
                },
                cls:'ludo-tabs-in-dropdown',
                bodyCls:'ludo-tabs-in-dropdown-body',
                children:[
                    {
                        title:'Color boxes',
                        type:'color.Boxes',
                        value:this.value,
                        listeners:{
                            'setColor' : this.receiveColor.bind(this)
                        }
                    },
                    {
                        title:'Color Slider',
                        type:'color.RGBSlider',
                        value:this.value,
                        listeners:{
                            'setColor' : this.receiveColor.bind(this)
                        }

                    }
                ]
            }
        ];
    },

    receiveColor:function (color) {
        this.setValue(color);
        this.hideMenu();
    }
});