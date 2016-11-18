/**
 * Label for a ludo.form View
 *
 * A label will be assigned the css class ludo-form-el-invalid when the associated form element has an invalid value(not validated).
 * By default, this will render it with a red text.
 * @class ludo.form.Label
 * @param {Object} config
 * @param {String} label Text label
 * @param {String|ludo.form.Element} Reference to a ludo.form View which this label should be associated with.
 *
 */
ludo.form.Label = new Class({
    Extends: ludo.View,
    labelFor:undefined,
    label:undefined,


    __construct:function(config){
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

    resizeDOM:function(){
        this.parent();
        this.els.label.css('line-height', this.getBody().height() + 'px');
    },

    onValid:function(){
        this.getBody().removeClass('ludo-form-el-invalid');
    },

    onInvalid:function(){
        this.getBody().removeClass('ludo-form-el-invalid');
        this.getBody().addClass('ludo-form-el-invalid');
    }
});