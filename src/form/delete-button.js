/**
 * Special Button for form submission.
 * This button will automatically be disabled when a form is invalid, and automatically enabled when it's valid.
 * A form consists of all form elements of parent component, including form elements of child components.
 * @namespace ludo.form
 * @class SubmitButton
 * @augments ludo.form.Button
 */
ludo.form.DeleteButton = new Class({
	// TODO show shim over applyTo component when delete or submit is in progress
	Extends:ludo.form.Button,
	type:'form.DeleteButton',
	value:'Delete',
	/**
	 * Apply submit button to form of this LudoJS component
	 * @config {String|View} applyTo
	 * @default undefined
	 */
	applyTo:undefined,
	ludoConfig:function(config){
		this.parent(config);
		// TODO create base class for delete, submit and cancel button
		this.setConfigParams(config, ['applyTo']);
	},

	ludoRendered:function () {
		this.parent();
		this.applyTo = this.applyTo ? ludo.get(this.applyTo) : this.getParentComponent();
		this.addEvent('click', this.submit.bind(this));
	},

	submit:function () {
		if(this.applyTo){
            this.applyTo.deleteRecord();
        }
	}
});