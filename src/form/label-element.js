/**
 * Base class for all form elements with label
 * @namespace form
 * @class LabelElement
 * @extends form.Element
 */
ludo.form.LabelElement = new Class({
    Extends:ludo.form.Element,

    fieldTpl:['<table ','cellpadding="0" cellspacing="0" border="0" width="100%">',
        '<tbody>',
        '<tr class="input-row">',
        '<td class="label-cell"><label></label></td>',
        '<td class="input-cell"></td>',
        '<td class="suffix-cell" style="display:none"></td>',
        '<td class="help-cell" style="display:none"></td>',
        '</tr>',
        '</tbody>',
        '</table>'
    ],

    labelSuffix:':',

    ludoDOM:function () {
        this.parent();
        this.getBody().set('html', this.fieldTpl.join(''));
        this.addInput();
        this.addLabel();
        this.setWidthOfLabel();
    },

    addLabel:function () {
        if (this.label) {
            this.getLabelDOM().set('html', this.label + this.labelSuffix);
            this.els.label.setProperty('for', this.getFormElId());
        }
    },

    setWidthOfLabel:function () {
        this.getLabelDOM().getParent().setStyle('width', this.labelWidth);
    },

    getLabelDOM:function () {
        if (this.els.label === undefined) {
            this.els.label = this.getInputRow().getElements('label')[0];
        }
        return this.els.label;
    },

    addInput:function () {
        if (!this.inputTag) {
            return;
        }
        this.els.formEl = new Element(this.inputTag);
        if (this.inputType) {
            this.els.formEl.setProperty('type', this.inputType);
        }
        if (this.maxLength) {
            this.els.formEl.setProperty('maxlength', this.maxLength);
        }
		if(this.fieldWidth)this.els.formEl.style.width = this.fieldWidth + 'px';
        this.els.formEl.id = this.getFormElId();

        this.getInputCell().adopt(this.els.formEl);
    },

    getInputCell:function () {
        if (this.els.cellInput === undefined) {
            this.els.cellInput = this.getInputRow().getElement('.input-cell');
        }
        return this.els.cellInput;
    },

    getInputRow:function () {
        if (this.els.inputRow === undefined) {
            this.els.inputRow = this.getBody().getElement('.input-row');
        }
        return this.els.inputRow;
    },

    resizeDOM:function () {
        this.parent();
        if (this.stretchField && this.els.formEl) {
            var width = this.getWidth();
            if (!isNaN(width) && width > 0) {
                width -= (ludo.dom.getMBPW(this.getEl()) + ludo.dom.getMBPW(this.getBody()));
            } else {
                var parent = this.getParent();
                if (parent && parent.layout.type !== 'linear' && parent.layout.orientation !== 'horizontal') {
                    width = parent.getWidth();
                    width -= (ludo.dom.getMBPW(parent.getEl()) + ludo.dom.getMBPW(parent.getBody()));
                    width -= (ludo.dom.getMBPW(this.getEl()) + ludo.dom.getMBPW(this.getBody()));
                } else {
                    var c = this.els.container;
                    width = c.offsetWidth - ludo.dom.getMBPW(this.els.body) - ludo.dom.getPW(c) - ludo.dom.getBW(c);
                }
            }
            if (this.label)width -= this.labelWidth;
            width -= 10;
            if (width > 0 && !isNaN(width)) {
                this.formFieldWidth = width;
                this.getFormEl().style.width = width + 'px';
            }
        }
    }
});