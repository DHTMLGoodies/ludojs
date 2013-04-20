/**
 * Cancel button. This is a pre-configured ludo.form.Button which will close/hide parent view(or view defined in
 * applyTo) on click.
 * Default value of this button is "Cancel".
 * @namespace form
 * @class CancelButton
 * @extends form.Button
 */
ludo.form.CancelButton = new Class({
    Extends:ludo.form.Button,
    type:'form.CancelButton',
    /**
     * @attribute value
     * @description Default value of button
     * @default 'Cancel'
     */
    value:'Cancel',

	/**
	 * Apply cancel button to form of this LudoJS component. If not defined, it
     * will be applied to parent view.
	 * @config {String|View} applyTo
	 * @default undefined
	 */
	applyTo:undefined,

	ludoConfig:function(config){
		this.parent(config);
		this.setConfigParams(config, ['applyTo']);
	},

    ludoRendered:function () {
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