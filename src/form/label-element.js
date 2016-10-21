/**
 * Base class for all form elements with label
 * @namespace ludo.form
 * @class LabelElement
 * @augments ludo.form.Element
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

    /**
     * Suffix after the label. Default is ":" (colon)
     * @memberof ludo.form.LabelElement.prototype
     * @default ":"
     * @property {string} labelSuffix
     */
    labelSuffix:':',

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['inlineLabel','labelSuffix']);
        if(!this.supportsInlineLabel())this.inlineLabel = undefined;
    },

    ludoEvents:function () {
        this.parent();
        if (this.inlineLabel) {
            var el = this.getFormEl();
            if (el) {
                el.on('blur', this.setInlineLabel.bind(this));
                el.on('focus', this.clearInlineLabel.bind(this));
                this.addEvent('value', this.clearInlineLabelCls.bind(this));
            }
        }
    },

    ludoDOM:function () {
        this.parent();
        this.getBody().html(this.fieldTpl.join(''));
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
		if(!this.inlineLabel)return;
        var el = this.getFormEl();
        if (el.val().length === 0) {
            el.addClass('ludo-form-el-inline-label');
            el.val(this.inlineLabel);
        }
    },

	clear:function(){
		this.parent();
		this.setInlineLabel();
	},

	reset:function(){
		this.parent();
		this.setInlineLabel();
	},

    clearInlineLabel:function () {
        var el = this.getFormEl();
        if (el.val() === this.inlineLabel) {
            el.val('');
            this.getFormEl().removeClass('ludo-form-el-inline-label');
        }
    },

    clearInlineLabelCls:function(){
        this.getFormEl().removeClass('ludo-form-el-inline-label');
    },

    getValueOfFormEl:function () {
        var val = this.getFormEl().val();
        return this.inlineLabel && this.inlineLabel === val ? '' : val;
    },

    addLabel:function () {
        if (this.label !== undefined) {
			this.getLabelDOM().html(this.label ?  this.label + this.labelSuffix : '');
            this.els.label.attr('for', this.getFormElId());
        }
        if (this.suffix) {
            var s = this.getSuffixCell();
            s.css('display', '');
            var label = s.find('label').first();
            if (label) {
                label.html( this.suffix);
                label.attr('for', this.getFormElId());
            }
        }
    },

    setWidthOfLabel:function () {
        if(this.label === undefined){
            this.getLabelDOM().css('display', 'none');
        }else{
            this.getLabelDOM().parent().css('width', this.labelWidth);
        }
    },

    getLabelDOM:function () {
        return this.getCell('.input-label', 'label');
    },

    addInput:function () {
        if (!this.inputTag) {
            return;
        }
        this.els.formEl =$('<' + this.inputTag + '>');

        if (this.inputType) {
            this.els.formEl.attr('type', this.inputType);
        }
        if (this.maxLength) {
            this.els.formEl.attr('maxlength', this.maxLength);
        }
        if (this.readonly) {
            this.els.formEl.attr('readonly', true);
        }
        this.getInputCell().append(this.els.formEl);
        if (this.fieldWidth) {
            this.els.formEl.css('width', this.fieldWidth);
            this.getInputCell().parent().css('width', (this.fieldWidth + ludo.dom.getMBPW(this.els.formEl)));
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
            this.els[cacheKey] = this.getBody().find(selector + ":first");
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
            if (this.label !== undefined)width -= this.labelWidth;
            if (this.suffix)width -= this.getSuffixCell().offsetWidth;
            if(this.inputTag !== 'select') width -= 5;
            if (width > 0 && !isNaN(width)) {
                this.formFieldWidth = width;
                this.getFormEl().css('width', width);
            }
        }
    }
});