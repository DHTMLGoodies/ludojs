/**
 * Small button
 * @namespace form
 * @class TinbyButton
 */
ludo.form.TinyButton = new Class({
    Extends: ludo.form.Button,
    type:'form.TinyButton',
    width:20,
    buttonHeight:15,

    ludoConfig:function (config) {
        if(config.width == undefined){
            config.width = Math.max(config.value ? config.value.length*10 : 20, 20);
        }
        this.parent(config);
    },

    ludoDOM:function () {
        this.parent();
        this.getEl().addClass('ludo-form-tinybutton');
        this.getBody().addClass('ludo-form-tiny-button');
        this.getBody().setStyle('padding-left', 0);
        this.els.txt.style.height = '15px';
    },

    addIcon:function(){
        this.parent();
        this.els.icon.style.width = '100%';
    }
});