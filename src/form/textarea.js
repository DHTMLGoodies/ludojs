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
    resizeDOM:function () {
        this.parent();
        if (this.layout && this.layout.weight) {
            var height = this.getEl().offsetHeight;
            height -= (ludo.dom.getMBPH(this.getEl()) + ludo.dom.getMBPH(this.getBody()) + ludo.dom.getMH(this.els.formEl.parent()));
			height -=1;
            if (height > 0) {
                this.els.formEl.style.height = height+'px';
            }
        }
    }
});