/**
 * Md5 validator for form elements
 * When used, the associated form element will be flagged as invalid if MD5(value) doesn't match value of this validator.
 * If no value is sent to the constructor of form.validator.Md5, it will send a request to the server and ask for it.
 * @class Md5
 * @augments ludo.form.validator.Base
 *
 */
ludo.form.validator.Md5 = new Class({
    Extends:ludo.form.validator.Base,
    type : 'form.validator.Md5',

    /**
     * MD5 value to validate against. Component will be valid only when
     * md5(formElement.value) matches this value
     * @attribute value
     * @default undefined
     */
    value:undefined,

    isValid : function(value){
        return faultylabs.MD5(value) == this.value;
    }
});