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

            if(config.value){
                config.width = config.value.length*10;
            }else{
                config.width = 20;
            }
            config.width = Math.max(config.width, 20);
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
    },
    
    disab2le:function () {
        this.disabled = true;
        ludo.dom.addClass(this.els.body, 'ludo-form-tiny-button-disabled');
        this.els.body.removeClass('ludo-form-tiny-button-over');
        this.els.body.removeClass('ludo-form-tiny-button-down');
        this.els.body.removeClass('ludo-form-tiny-button-selected');
    },

    enab2le:function () {
        this.disabled = false;
        this.els.body.removeClass('ludo-form-tiny-button-disabled');
    }
    
});