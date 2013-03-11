/**
 * Text Area field
 * @namespace form
 * @class Textarea
 * @extends form.Element
 */
ludo.form.Textarea = new Class({
    Extends:ludo.form.Text,
    type:'form.Textarea',
    inputType:undefined,
    inputTag:'textarea',
    overflow:'hidden',

    ludoConfig:function (config) {
        this.parent(config);
        this.ucWords = false;
    },

    resizeDOM:function () {
        this.parent();
        if (!this.label) {
            var w = this.getInnerWidthOfBody();
            if (w <= 0)return;
            this.els.formEl.setStyle('width', w + 'px');
        }

        if (this.layout && this.layout.weight) {
            var height = this.getEl().offsetHeight;
            // TODO refactor the static value 6
            height -= (ludo.dom.getMBPH(this.getEl()) + ludo.dom.getMBPH(this.getBody()) + ludo.dom.getMBPH(this.els.formEl.parentNode) + 2);
            if (height > 0) {
                this.els.formEl.style.height = height+'px';
            }
        }
    }
});