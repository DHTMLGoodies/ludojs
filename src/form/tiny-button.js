/**
 * Small button
 * @namespace ludo.form
 * @class ludo.form.TinbyButton
 */
ludo.form.TinyButton = new Class({
    Extends: ludo.form.Button,
    type:'form.Button', size : 's',
    width:20,
    buttonHeight:15,

    __construct:function (config) {
        if(config.width == undefined){
            config.width = Math.max(config.value ? config.value.length*10 : 20, 20);
        }
        this.parent(config);
    },

    ludoDOM:function () {
        this.parent();
        this.getEl().addClass('ludo-form-button-s');
        this.$b().addClass('ludo-form-tiny-button');
        this.$b().setStyle('padding-left', 0);
        this.els.txt.style.height = '15px';
    },

    addIcon:function(){
        this.parent();
        this.els.icon.style.width = '100%';
    }
});