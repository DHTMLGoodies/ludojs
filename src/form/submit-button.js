/**
 * Special Button for form submission.
 * This button will automatically be disabled when a form is invalid, and automatically enabled when it's valid.
 * A form consists of all form elements of parent component, including form elements of child components.
 * @namespace form
 * @class SubmitButton
 * @extends form.Button
 */
ludo.form.SubmitButton = new Class({
	Extends:ludo.form.Button,
	type:'form.SubmitButton',
	value:'Submit',
	disableOnInvalid:true,
	/**
	 * Apply submit button to form of this LudoJS component. If not defined, it will be applied
     * to parent view.
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
		var form = this.applyTo.getForm();
		if (this.applyTo) {
			form.addEvent('valid', this.enable.bind(this));
			form.addEvent('invalid', this.disable.bind(this));
			form.addEvent('clean', this.disable.bind(this));
			form.addEvent('dirty', this.enable.bind(this));
		}
		if(!form.isValid()){
			this.disable();
		}
		this.addEvent('click', this.submit.bind(this));
	},

	submit:function () {
		if (this.applyTo) {
			this.applyTo.getForm().submit();
		}
	}
});