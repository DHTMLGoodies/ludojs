ludo.dialog.Form = new Class({
    Extends: ludo.dialog.Dialog,
    type : 'dialog.Form',
    input : undefined,
    elements : [],
    labelWidth : 150,

    ludoConfig : function(config){
        if(!config.buttons && !config.buttonConfig && !config.buttonBar){
            config.buttons = [
                {
                    value : 'OK',
                    width : 60
                },
                {
                    value : 'Cancel',
                    width : 60
                }
            ]
        }
        this.setConfigParams(config, 'labelWidth','elements');
        this.parent(config);
    },

    ludoRendered : function(){
        this.parent();
        this.formCmp = this.addChild({
            type : 'form.Form',
            elements : this.elements
        });
        this.elements = undefined;
    },

    getValues : function(){
        return this.formCmp.getValues();
    },

    buttonClick : function(value){
        this.fireEvent(value.toLowerCase(), [this.getValues()]);
        this.hide();
    }
});