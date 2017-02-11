/**
 * Text Area field
 * @namespace ludo.form
 * @class ludo.form.Textarea
 * @augments ludo.form.Text
 */
ludo.form.Textarea = new Class({
    Extends:ludo.form.Text,
    type:'form.Textarea',
    inputType:undefined,
    inputTag:'textarea',
    overflow:'hidden',

    __construct:function (config) {
        this.parent(config);
        this.ucWords = false;
    },

    __rendered:function(){
        this.parent();
        this.els.formEl.css({
            paddingRight:0,paddingTop:0
        });
    },

    offX:undefined, offY:undefined,

    resizeDOM:function () {
        this.parent();

        if(this.offX == undefined){
            this.offX = (this.els.formEl.outerWidth() - this.els.formEl.width()) + (this.getInputCell().outerWidth() - this.getInputCell().width());
            this.offY = (this.els.formEl.outerWidth() - this.els.formEl.width()) + (this.getInputCell().outerHeight() - this.getInputCell().height());
        }
        this.els.formEl.css('width', this.$b().width() - this.offX);
        this.els.formEl.css('height', this.$b().height() - this.offY - 2);
    }
});