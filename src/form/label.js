
ludo.form.Label = new Class({
    Extends: ludo.View,
    labelFor:undefined,
    label:undefined,


    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ['label','labelFor']);
    },

    ludoDOM:function(){
        this.parent();
        
        this.els.label = $('<label class="input-label" for="el-' + this.labelFor + '">' + this.label + '</label>');
        this.getBody().append(this.els.label);
    },

    ludoEvents:function(){
        this.parent();
        this.addInvalidEvents.delay(40, this);
    },

    addInvalidEvents:function(){
        if(!this.labelFor)return;
        var view = ludo.get(this.labelFor);
        if(view){
            view.addEvent('valid', this.onValid.bind(this));
            view.addEvent('invalid', this.onInvalid.bind(this));
            if(!view.isValid())
                this.onInvalid();
        }
    },

    onValid:function(){
        this.getBody().removeClass('ludo-form-el-invalid');
    },

    onInvalid:function(){
        this.getBody().removeClass('ludo-form-el-invalid');
        this.getBody().addClass('ludo-form-el-invalid');
    }
});