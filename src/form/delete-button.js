
ludo.form.DeleteButton = new Class({
	// TODO show shim over applyTo component when delete or submit is in progress
	Extends:ludo.form.Button,
	type:'form.DeleteButton',
	value:'Delete',
	/*
	 * Apply submit button to form of this LudoJS component
	 * @config {String|View} applyTo
	 * @default undefined
	 */
	applyTo:undefined,
	__construct:function(config){
		this.parent(config);
		// TODO create base class for delete, submit and cancel button
		this.setConfigParams(config, ['applyTo']);
	},

	__rendered:function () {
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