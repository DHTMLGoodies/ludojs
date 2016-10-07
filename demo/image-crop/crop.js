ludo.crop = ludo.crop || {};
ludo.crop.Crop = new Class({
    Extends: ludo.View,
    type : 'crop.Crop',
    useController:true,
    layout : 'cols',
    children:[{
        type: 'crop.Controls',
        width:150
    },{
        type : 'crop.Canvas',
        weight:1
    }],
    buttonBar:{
        align:'right',
        children:[{
            type:'form.SubmitButton',
            value : 'Submit'
        }]
    },

    ludoConfig:function(config){
        this.parent(config);
        new ludo.crop.Controller();
    },

    loadImage:function(path){
        this.fireEvent('loadimage', path);
    }
});