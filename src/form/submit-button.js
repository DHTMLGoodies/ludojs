/**
 * Special Button for form submission.
 * This button will automatically be disabled when a form is invalid, and automatically enabled when it's valid.
 * A form consists of all form elements of parent component, including form elements of child components.
 * @namespace ludo.form
 * @class SubmitButton
 * @augments ludo.form.Button
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

		if (this.applyTo) {
            var form = this.applyTo.getForm();
			form.addEvent('valid', this.enable.bind(this));
			form.addEvent('invalid', this.disable.bind(this));
			form.addEvent('clean', this.disable.bind(this));
			form.addEvent('dirty', this.enable.bind(this));

            this.checkValidity.delay(100, this);
		}

		this.addEvent('click', this.submit.bind(this));
	},

    checkValidity:function(){
        if(this.applyTo.getForm().isValid()){
            this.enable();
        }else{
            this.disable();
        }
    },

	submit:function () {
		if (this.applyTo) {
			this.applyTo.getForm().submit();
		}
	}
});