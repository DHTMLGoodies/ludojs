/**
 * Base class for all form elements with label
 * @namespace form
 * @class LabelElement
 * @extends form.Element
 */
ludo.form.LabelElement = new Class({
    Extends:ludo.form.Element,

    fieldTpl:['<table ', 'cellpadding="0" cellspacing="0" border="0" width="100%">',
        '<tbody>',
        '<tr class="input-row">',
        '<td class="label-cell"><label class="input-label"></label></td>',
        '<td><div class="input-cell"></div></td>',
        '<td class="invalid-cell" style="position:relative"><div class="invalid-cell-div"></div></td>',
        '<td class="suffix-cell" style="display:none"><label></label></td>',
        '<td class="help-cell" style="display:none"></td>',
        '</tr>',
        '</tbody>',
        '</table>'
    ],

    labelSuffix:':',

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['inlineLabel']);
        if(!this.supportsInlineLabel())this.inlineLabel = undefined;
        if (this.inlineLabel) {
            this.inlineLabel = this.label;
            this.label = undefined;
        }
    },

    ludoEvents:function () {
        this.parent();
        if (this.inlineLabel) {
            var el = this.getFormEl();
            if (el) {
                el.addEvent('blur', this.setInlineLabel.bind(this));
                el.addEvent('focus', this.clearInlineLabel.bind(this));
                this.addEvent('value', this.clearInlineLabelCls.bind(this));
            }
        }
    },

    ludoDOM:function () {
        this.parent();
        this.getBody().set('html', this.fieldTpl.join(''));
        this.addInput();
        this.addLabel();
        this.setWidthOfLabel();

    },

    ludoRendered:function(){
        this.parent();
        if(this.inlineLabel)this.setInlineLabel();
    },

    supportsInlineLabel:function(){
        return true;
    },

    setInlineLabel:function () {
        var el = this.getFormEl();
        if (el.get('value').length === 0) {
            ludo.dom.addClass(el, 'ludo-form-el-inline-label');
            el.set('value', this.inlineLabel);
        }
    },

    clearInlineLabel:function () {
        var el = this.getFormEl();
        if (el.get('value') === this.inlineLabel) {
            el.set('value', '');
            ludo.dom.removeClass(this.getFormEl(), 'ludo-form-el-inline-label');
        }
    },

    clearInlineLabelCls:function(){
        ludo.dom.removeClass(this.getFormEl(), 'ludo-form-el-inline-label');
    },

    getValueOfFormEl:function () {
        var val = this.getFormEl().get('value');
        return this.inlineLabel && this.inlineLabel === val ? '' : val;
    },

    addLabel:function () {
        if (this.label) {
            this.getLabelDOM().set('html', this.label + this.labelSuffix);
            this.els.label.setProperty('for', this.getFormElId());
        }
        if (this.suffix) {
            var s = this.getSuffixCell();
            s.style.display = '';
            var label = s.getElement('label');
            if (label) {
                label.set('html', this.suffix);
                label.setProperty('for', this.getFormElId());
            }
        }
    },

    setWidthOfLabel:function () {
        if(!this.label){
            this.getLabelDOM().style.display = 'none';
        }else{
            this.getLabelDOM().parentNode.style.width = this.labelWidth + 'px';
        }
    },

    getLabelDOM:function () {
        return this.getCell('.input-label', 'label');
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
        if (this.readonly) {
            this.els.formEl.setProperty('readonly', true);
        }
        this.getInputCell().adopt(this.els.formEl);
        if (this.fieldWidth) {
            this.els.formEl.style.width = this.fieldWidth + 'px';
            this.getInputCell().parentNode.style.width = (this.fieldWidth + ludo.dom.getMBPW(this.els.formEl)) + 'px';
        }
        this.els.formEl.id = this.getFormElId();
    },

    getSuffixCell:function () {
        return this.getCell('.suffix-cell', 'labelSuffix');
    },

    getInputCell:function () {
        return this.getCell('.input-cell', 'cellInput');
    },

    getInputRow:function () {
        return this.getCell('.input-row', 'inputRow');
    },

    getCell:function (selector, cacheKey) {
        if (!this.els[cacheKey]) {
            this.els[cacheKey] = this.getBody().getElement(selector);
        }
        return this.els[cacheKey];
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
            if (this.suffix)width -= this.getSuffixCell().offsetWidth;
            width -= 10;
            if (width > 0 && !isNaN(width)) {
                this.formFieldWidth = width;
                this.getFormEl().style.width = width + 'px';
            }
        }
    }
});