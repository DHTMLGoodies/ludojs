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

    ludoRendered:function(){
        this.parent();
        this.els.formEl.style.paddingRight = 0;
        this.els.formEl.style.paddingTop = 0;
    },
    resizeDOM:function () {
        this.parent();
        var w;
        if (!this.label) {
            w = this.getInnerWidthOfBody();
            if (w <= 0)return;
        }else{
            var p = this.els.formEl.parentNode;
            w = (p.offsetWidth - ludo.dom.getBW(p) - ludo.dom.getPW(p));
        }

        this.els.formEl.setStyle('width', w + 'px');

        if (this.layout && this.layout.weight) {
            var height = this.getEl().offsetHeight;
            height -= (ludo.dom.getMH(this.getEl()) + ludo.dom.getMBPH(this.getBody()) + ludo.dom.getMH(this.els.formEl.parentNode));
            if (height > 0) {
                this.els.formEl.style.height = height+'px';
            }
        }
    }
});