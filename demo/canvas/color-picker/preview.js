ludo.colorPicker.Preview = new Class({
    Extends:ludo.View,
    type:'colorPicker.Preview',
    weight:1,
    useController:true,
    containerCss:{
        'border-left': '1px solid #C0C0C0'
    },
    css:{
        margin:'5px',
        border:'1px solid #C0C0C0'
    },
    addControllerEvents:function () {
        this.controller.addEvent('setRGB', this.setColor.bind(this));
    },
    setColor:function (color) {
        this.getBody().css('background-color', color);
    }

});