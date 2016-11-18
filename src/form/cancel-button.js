/**
 * Cancel button. This is a pre-configured ludo.form.Button which will close/hide parent view(or view defined in
 * applyTo) on click.
 * Default value of this button is "Cancel".
 *
 * This button inherits from <a href="ludo.form.Button">ludo.form.Button</a>.
 * 
 * @namespace ludo.form
 * @class ludo.form.CancelButton
 * @param {Object} config
 * @param {String|ludo.View} applyTo Apply to this view. The cancel button will then call the hide function of this view. default is parent view.
 * @param {String} value Button text, default: "Cancel"

 */
ludo.form.CancelButton = new Class({
    Extends:ludo.form.Button,
    type:'form.CancelButton',

    value:'Cancel',

	applyTo:undefined,

	__construct:function(config){
		this.parent(config);
		this.setConfigParams(config, ['applyTo']);
	},

    __rendered:function () {
        this.parent();
        this.applyTo = this.applyTo ? ludo.get(this.applyTo) : this.getParentComponent();
        this.addEvent('click', this.hideComponent.bind(this));
    },

    hideComponent:function () {
        if (this.applyTo) {
            this.applyTo.hide();
        }
    }
});