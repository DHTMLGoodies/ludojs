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
        if (this.layout && this.layout.weight) {
            if (!this.label) {
                var w = this.getInnerWidthOfBody();
                if (w <= 0)return;
                this.els.formEl.setStyle('width', this.getInnerWidthOfBody() + 'px');
            }
            var parentComponent = this.getParent();
            var height;
            if ((parentComponent && parentComponent.layout.type === 'fill')) {
                height = parentComponent.getInnerHeightOfBody();
            } else {
                height = this.getHeight();
            }

            height -= (ludo.dom.getMBPH(this.getEl()) + ludo.dom.getMBPH(this.getBody()) + ludo.dom.getMBPH(this.els.formEl) + 1);
            if (height > 0) {
                this.els.formEl.setStyle('height', height);
            }
        }
    }
});