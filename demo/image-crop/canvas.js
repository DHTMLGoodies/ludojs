ludo.crop.Canvas = new Class({
    Extends:ludo.svg.Canvas,
    type:'crop.Canvas',
    useController:true,
    svg:{
        type:'svg.Canvas',
        children:[
            {
                type:'crop.Image'
            },
            {
                type:'crop.CropArea'
            },
            { type:'crop.Handle', region:'nw'},
            { type:'crop.Handle', region:'n'},
            { type:'crop.Handle', region:'ne'},
            { type:'crop.Handle', region:'e'},
            { type:'crop.Handle', region:'se'},
            { type:'crop.Handle', region:'s'},
            { type:'crop.Handle', region:'sw'},
            { type:'crop.Handle', region:'w'}
        ]
    },
    css:{
        'background-color':'#555'
    },

    addControllerEvents:function () {
        this.controller.addEvent('loadimage', this.showImage.bind(this));
    },

    showImage:function (image) {
        this.svg.setViewboxSize(image.width, image.height);
    },

    resizeDOM:function () {
        this.svg.scaleToParent();
    }
});
