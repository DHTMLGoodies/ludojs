/**
 * Base class for form component validators
 * @namespace ludo.form.validator
 * @class ludo.form.validator.Base
 * @augments Core
 */
ludo.form.validator.Base = new Class({
	Extends:ludo.Core,

	value:undefined,
	applyTo:undefined,

	__construct:function (config) {
		this.parent(config);
		if (config.value !== undefined)this.value = config.value;
		if (config.applyTo !== undefined)this.applyTo = config.applyTo;
		if (!this.value) {
			this.loadValue();
		}
	},

	/**
	 Loading valid value from server.
	 @function loadValue
	 @memberof ludo.form.validator.Base.prototype
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
		new ludo.remote.JSON({
			url:this.getUrl,
			data:{
				"request": ["Md5Validation",this.applyTo.getName(),"read"].join('/'),
				"data": {
					"md5Validation" : true,
					"getValidatorValueFor": this.applyTo.getName()
				}
			},
			"listeners":{
				"success":  function(request){
					this.value = request.getData().value;
					/**
					 * Event fired after validator value has been loaded from server
					 * @event loadValue
					 * @param form.validator.Base this
					 */
					this.fireEvent('loadValue', this);
				}.bind(this)
			}
		});
	},

	isValid:function (value) {
		return value == this.value;
	}
});