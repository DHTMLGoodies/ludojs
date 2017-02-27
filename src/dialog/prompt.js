/**
 * Dialog with one text field. Default buttons are "OK" and "Cancel"
 * @namespace ludo.dialog
 * @class ludo.dialog.Prompt
 * @augments ludo.dialog.Dialog
 * @param {Object} config
 */
ludo.dialog.Prompt = new Class({
    Extends: ludo.dialog.Dialog,
    type : 'dialog.Prompt',
    input : undefined,
    inputConfig : {},
    label:'',
    value:'',
    __construct : function(config){
        if(!config.buttons && !config.buttonConfig && !config.buttonBar){
            config.buttons = [
                {
                    value : 'OK',
                    width : 60,
					defaultSubmit:true,
                    type:'form.Button'
                },
                {
                    value : 'Cancel',
                    width : 60
                }
            ]
        }
        this.__params(config, ['label','value','inputConfig']);
        this.parent(config);
    },

    __rendered : function(){
        this.parent();
        var inputConfig = Object.merge(this.inputConfig, {
            type : 'form.Text',
            label : this.label,
            value : this.value
        });

        this.input = this.addChild(inputConfig);
        this.input.focus();
    },

    /**
     * Return value of input field
     * @function val
     * @return String value
     * @memberof ludo.dialog.Prompt
     */
    val: function(){
        return this.input.val();
    },

    getValue : function(){
        return this.input.val()
    },

    buttonClick : function(value, button){
        this.fireEvent(button.value.toLowerCase(), [this.val(), this]);
        if (this.autoHideOnBtnClick) {
            this.hide();
        }
    }

});