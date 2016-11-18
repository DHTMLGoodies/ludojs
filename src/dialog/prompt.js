/**
 * Dialog with one text field. Default buttons are "OK" and "Cancel"
 * @namespace ludo.dialog
 * @class ludo.dialog.Prompt
 * @augments Dialog
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
        this.setConfigParams(config, ['label','value','inputConfig']);
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
     * @function getValue
     * @return String value
     */
    getValue : function(){
        return this.input.getValue()
    },

    buttonClick : function(value, button){
        /**
         * Event fired on when clicking on dialog button
         * @event lowercase name of button with white space removed
         * @param {String} value of input field
         * @param {Object} ludo.dialog.Prompt
         *
         */
        this.fireEvent(button.value.toLowerCase(), [this.getValue(), this]);
        if (this.autoHideOnBtnClick) {
            this.hide();
        }
    }

});