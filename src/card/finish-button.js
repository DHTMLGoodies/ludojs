ludo.card.FinishButton = new Class({
    Extends:ludo.card.Button,
    type:'card.FinishButton',
    value:'Finish',
    hidden:true,

    onRendered:function(){
		var lm;
        if (this.applyTo) {
			lm = this.applyTo.getLayout();
            var fm = this.applyTo.getForm();

            lm.on('valid', this.enable.bind(this));
            lm.on('invalid', this.disable.bind(this));
            lm.on('lastpage', this.show.bind(this));
            lm.on('notlastpage', this.hide.bind(this));

            fm.on('submit.init', this.disable.bind(this));
            fm.on('submit.success', this.setSubmitted.bind(this));
            fm.on('submit.fail', this.setSubmitted.bind(this));

            if(!lm.isFormValid()){
                this.disable();
            }else{
                this.enable();
            }
        }
        this.on('click', this.submit.bind(this));

        if(lm && lm.selectedIndex == lm.count - 1){
            this.show();
        }
    },

    enable:function(){

        if(this.applyTo.getLayout().isFormValid()){
            this.parent();
        }else{
            console.log('not valid');
        }
    },

    disable:function(){
        console.log('disable');
        console.trace();
        this.parent();
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
            this.applyTo.getForm().save();
        }
    },

    setSubmitted:function(){
        this.submitted = true;
    }
});