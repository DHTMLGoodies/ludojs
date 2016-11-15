/**
 * Special Button used to reset all form fields of component back to it's original state.
 * This button will automatically be disabled when the form is "clean", and disabled when it's "dirty".
 * @namespace ludo.form
 * @class ResetButton
 * @augments ludo.form.Button
 */
ludo.form.ResetButton = new Class({
    Extends:ludo.form.Button,
    type:'form.ResetButton',
    /**
     * Value of button
     * @attribute {String} value
     * @default 'Reset'
     */
    value:'Reset',
    // TODO create parent class for ResetButton, DeleteButton etc.
    applyTo:undefined,

    __construct:function(config){
        this.parent(config);
        this.setConfigParams(config, ['applyTo']);
    },
    
    __rendered:function () {
        this.parent();
        this.applyTo = this.applyTo ? ludo.get(this.applyTo) : this.getParentComponent();
        var manager = this.applyTo.getForm();
        if (this.applyTo) {
            manager.addEvent('dirty', this.enable.bind(this));
            manager.addEvent('clean', this.disable.bind(this));
        }

        if(!manager.isDirty()){
            this.disable();
        }
        this.addEvent('click', this.reset.bind(this));
    },

    reset:function () {
        if (this.applyTo) {
            this.applyTo.getForm().reset();
        }
    }
});