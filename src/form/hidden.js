ludo.form.Hidden = new Class({
    Extends: ludo.form.Element,
    type : 'form.Hidden',
    labelWidth : 0,
    defaultValue : '',
    hidden: true,

    ludoDOM : function() {
        this.parent();
        this.els.formEl = new Element('input');
        this.els.formEl.setProperty('type', 'hidden');
        this.els.formEl.id = this.getFormElId();
        this.getBody().adopt(this.els.formEl);
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