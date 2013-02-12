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
            var c = this.getEl();
            var e = this.getBody();
            var f = this.els.formEl;

            height -= ( ludo.dom.getMH(c) + ludo.dom.getPH(c) + ludo.dom.getBH(c));
            height -= ( ludo.dom.getMH(e) + ludo.dom.getPH(e) + ludo.dom.getBH(e));
            height -= ( ludo.dom.getMH(f) + ludo.dom.getPH(f) + ludo.dom.getBH(f));

            height -= 1;
            if (height > 0) {
                this.els.formEl.setStyle('height', height);
            }
        }
    }
});