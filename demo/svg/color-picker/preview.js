ludo.colorPicker.Preview = new Class({
    Extends:ludo.View,
    type:'colorPicker.Preview',
    weight:1,
    useController:true,

    addControllerEvents:function () {
        this.controller.addEvent('setRGB', this.setColor.bind(this));
    },
    setColor:function (color) {
        this.$b().css('background-color', color);
    }

});