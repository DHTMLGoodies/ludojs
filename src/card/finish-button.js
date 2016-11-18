ludo.card.FinishButton = new Class({
    Extends:ludo.card.Button,
    type:'card.FinishButton',
    value:'Finish',
    hidden:true,

    addButtonEvents:function(){
		var lm;
        if (this.applyTo) {
			lm = this.applyTo.getLayout();
            var fm = this.applyTo.getForm();

            lm.addEvent('valid', this.enable.bind(this));
            lm.addEvent('invalid', this.disable.bind(this));
            lm.addEvent('lastcard', this.show.bind(this));
            lm.addEvent('notlastpage', this.hide.bind(this));

            fm.addEvent('beforeSave', this.disable.bind(this));
            fm.addEvent('success', this.setSubmitted.bind(this));

            if(!lm.isValid()){
                this.disabled = true;
            }
        }
        this.addEvent('click', this.submit.bind(this));

        if(lm && lm.isOnLastPage()){
            this.show();
        }
    },

    enable:function(){
        if(this.applyTo.getLayout().isValid()){
            this.parent();
        }
    },

    show:function(){
        if(!this.submitted){
            return this.parent();
        }
        return undefined;
    },
    submitted : false,
    submit:function () {
        if (this.applyTo) {
            this.applyTo.getForm().submit();
        }
    },

    setSubmitted:function(){
        this.submitted = true;
    }
});