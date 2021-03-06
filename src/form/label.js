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
    type:'form.Label',

    __construct:function(config){
        this.parent(config);
        this.__params(config, ['label','labelFor']);
    },

    ludoDOM:function(){
        this.parent();
        
        this.els.label = jQuery('<label class="input-label" for="el-' + this.labelFor + '">' + this.label + '</label>');
        this.$b().append(this.els.label);
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
            view.addEvent('enable', this.onEnable.bind(this));
            view.addEvent('disable', this.onDisable.bind(this));
            if(!view.isValid())
                this.onInvalid();
        }
    },

    resizeDOM:function(){
        this.parent();
        this.els.label.css('line-height', this.$b().height() + 'px');
    },

    onEnable:function(){
        this.$b().removeClass('ludo-form-label-disabled');
    },

    onDisable:function(){
        this.$b().addClass('ludo-form-label-disabled');
    },

    onValid:function(){
        this.$b().removeClass('ludo-form-el-invalid');
    },

    onInvalid:function(){
        this.$b().removeClass('ludo-form-el-invalid');
        this.$b().addClass('ludo-form-el-invalid');
    }
});