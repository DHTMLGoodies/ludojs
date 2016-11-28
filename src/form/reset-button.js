/**
 * Special Button used to reset all form fields of component back to it's original state.
 * This button will automatically be disabled when the form is "clean", and disabled when it's "dirty".
 *
 * The Reset button extends <a href="ludo.form.Button.html">ludo.form.Button</a>.
 * @class ludo.form.ResetButton
 * @param {Object} config
 * @param {String} config applyTo. The reset button will be a reset button for the View(including child views) with this id.
 * A press on this button will trigger ludo.$(applyTo).getForm().reset()
 */
ludo.form.ResetButton = new Class({
    Extends:ludo.form.Button,

    value:'Reset',
    // TODO create parent class for ResetButton, DeleteButton etc.
    applyTo:undefined,

    __construct:function(config){
        this.parent(config);
        this.setConfigParams(config, ['applyTo']);
    },
    
    __rendered:function () {
        this.parent();
        this.applyTo = this.applyTo ? ludo.$(this.applyTo) : this.getParentComponent();
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