ludo.crop.Image = new Class({
    Extends:ludo.svg.Base,
    type:'crop.Image',
    useController:true,
    tag:'image',
    properties:{
        x:0,y:0,width:200,height:200
    },

    addControllerEvents:function () {
        this.controller.addEvent('loadimage', this.setImage.bind(this));
    },

    setImage:function(image){

        this.set('xlink:href', image.path);
        this.set('width', image.width);
        this.set('height', image.height);
    }

});