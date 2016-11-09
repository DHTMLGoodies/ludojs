ludo.form.Hidden = new Class({
    Extends: ludo.form.Element,
    type : 'form.Hidden',
    labelWidth : 0,
    defaultValue : '',
    hidden: false,

	elCss:{
		display : 'none'
	},

    ludoDOM : function() {
        this.parent();
        this.els.formEl = new Element('input');
        this.els.formEl.attr('type', 'hidden');
        this.els.formEl.id = this.getFormElId();
        this.getBody().append(this.els.formEl);
    },

    ludoRendered : function(){
        this.parent();
        this.hide();
    },
    getHeight : function(){
        return 0;
    },
    getWidth : function(){
        return 0;
    }
});