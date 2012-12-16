/**
 * Base class for form component validators
 * @namespace form.validator
 * @class Base
 * @extends Core
 */
ludo.form.validator.Base = new Class({
	Extends:ludo.Core,

	value:undefined,

	/**
	 * Validator is applied to this component
	 * @attribute object applyTo
	 * @default undefined
	 */
	applyTo:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.value !== undefined)this.value = config.value;
		if (config.applyTo !== undefined)this.applyTo = config.applyTo;
		if (!this.value) {
			this.loadValue();
		}
	},

	/**
	 Loading valid value from server.
	 @method loadValue
	 Request to server example:
	 @example
		{
			getValidatorValueFor:'nameOfView',
		}
	 Response from server example:
	 @example
	 	{ success:true, data : { value : 'valid value} }

	*/
	loadValue:function () {
		this.JSONRequest('md5Validation', {
			data:{
				getValidatorValueFor:this.applyTo.getName()
			},
			onSuccess:function (json) {
				this.value = json.data.value;
				/**
				 * Event fired after validator value has been loaded from server
				 * @event loadValue
				 * @param form.validator.Base this
				 */
				this.fireEvent('loadValue', this);
			}.bind(this)
		});
	},

	isValid:function (value) {
		return value == this.value;
	}
});