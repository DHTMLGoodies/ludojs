/**
 * Read only field, used for display only
 * @namespace form
 * @class DisplayField
 * @extends form.Text
 */
ludo.form.DisplayField = new Class({
	Extends:ludo.form.LabelElement,
	type:'form.DisplayField',
	inputTag:'span',
	inputType:'',

	/** Custom tpl for the display field
	 @attribute tpl
	 @type String
	 @default ''
	 @example
	 	tpl:'<a href="mailto:{value}">{value}</a>'
	 {value} will in this example be replaced by value of DisplayField.
	 */
	tpl:'',
	setValue:function (value) {
		if (!value) {
			this.getFormEl().set('html', '');
			return;
		}
		this.setTextContent(value);
	},

	ludoRendered:function(){
		this.parent();
		this.setTextContent(this.value);
	},

	setTextContent:function(value){
        var html = this.tpl ? this.getTplParser().getCompiled({ value:value }) : value ? value : '';
        this.getFormEl().set('html', html);
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