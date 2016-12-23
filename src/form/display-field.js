/**
 * Read only field, used for display only
 * @namespace ludo.form
 * @class ludo.form.DisplayField
 * @augments ludo.form.Text
 * @param {Object} config
 * @param {Object} config.tpl Template string for display field, example: tpl: '<a href="mailto:{value}">{value}</a>'
 */
ludo.form.DisplayField = new Class({
	Extends:ludo.form.Element,
	type:'form.DisplayField',
	inputTag:'span',
	inputType:'',
	
	tpl:'',
	setValue:function (value) {
		console.warn("Use of deprecated setValue");
		console.trace();
		if (!value) {
			this.getFormEl().html( '');
			return;
		}
		this.setTextContent(value);
	},

	val:function(value){
		if(arguments.length == 0){
			return this._get();
		}
		if (value.length == 0) {
			this.getFormEl().html('');
			return;
		}
		this.setTextContent(value);
	},

	__rendered:function(){
		this.parent();
		this.setTextContent(this.value);
	},

	setTextContent:function(value){
        var html = this.tpl ? this.getTplParser().getCompiled({ value:value }) : value ? value : '';

        this.getFormEl().html( html);
	},

	isValid:function () {
		return true;
	},

	getValue:function () {
		return this.value;
	},

    supportsInlineLabel:function(){
        return false;
    }
});