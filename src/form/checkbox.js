/**
 * Class for checkbox form elements
 * @namespace form
 * @class Checkbox
 * @extends form.LabelElement
 */
ludo.form.Checkbox = new Class({
    Extends:ludo.form.LabelElement,
    type:'form.Checkbox',
    inputType:'checkbox',
    stretchField:false,
    labelWidth:undefined,
    /**
     * Image to be displayed above the checkbox-/radio button
     * @attribute image (Path to image).
     * @type string
     * @default null
     */
    image:undefined,
    /**
     * Initial state
     * @attribute {Boolean} checked
     * @type {Boolean}
     * @default false
     */
    checked:false,
    height:undefined,
    labelSuffix : '',

    fieldTpl:['<table ','cellpadding="0" cellspacing="0" border="0" width="100%">',
        '<tbody>',
        '<tr class="checkbox-image-row" style="display:none">',
        '<td colspan="2" class="input-image"></td>',
        '</tr>',
        '<tr class="input-row">',
        '<td class="input-cell" style="width:30px"></td>',
        '<td><label class="input-label"></label></td>',
        '<td class="suffix-cell" style="display:none"><label></label></td>',
        '</tr>',
        '</tbody>',
        '</table>'
    ],

    ludoConfig:function (config) {
        config = config || {};
        config.value = config.value || '1';
        this.parent(config);
        this.setConfigParams(config, ['inputType','image','checked']);
        this.initialValue = this.constructorValue = this.checked ? this.value : '';
    },

    ludoDOM:function () {
        this.parent();
        if (this.image) {
            this.addRadioImage();
        }
    },

    addInput:function () {
        var id = this.getFormElId();
        var radio;
        if (Browser.ie && parseInt(Browser.version) < 9) {
            radio = document.createElement('<input type="' + this.inputType + '" name="' + this.getName() + '" value="' + this.value + '" id="' + id + '">');
            this.getInputCell().adopt(radio);
            this.els.formEl = document.id(radio);
        } else {
            radio = this.els.formEl = new Element('input');
            this.getInputCell().adopt(radio);
            radio.setProperties({
                'type':this.inputType,
                'name':this.getName(),
                'value':this.value,
                'id':id
            });
        }
        this.els.formEl.addEvent('click', this.toggleImage.bind(this));
        if(this.inputType === 'checkbox'){
            this.els.formEl.addEvent('click', this.valueChange.bind(this));
        }
        if (this.checked) {
            this.getFormEl().checked = true;
            this.toggleImage();
        }
    },

    addRadioImage:function () {
        var div = this.els.radioImageDiv = new Element('div');

        var radioDivInner = new Element('div');
        ludo.dom.addClass(radioDivInner, 'ludo-radio-image-inner');
        radioDivInner.setStyles({
            'width':'100%',
            'height':'100%',
            'background-repeat':'no-repeat',
            'background-position':'center center',
            'background-image':'url(' + this.image + ')'
        });

        div.adopt(radioDivInner);
        ludo.dom.addClass(div, 'ludo-radio-image');
        div.addEvent('click', this.clickOnImage.bind(this));
        this.getImageCell().adopt(div);
        this.getBody().getElement('.checkbox-image-row').style.display = '';
    },

    getImageCell:function () {
        return this.getCell('.input-image','imageCell');
    },

    setWidthOfLabel:function () {

    },

    clickOnImage:function () {
        if (this.inputType === 'checkbox') {
            this.setChecked(!this.getFormEl().checked)
        } else {
            this.check();
        }
    },
    /**
     * Return true if checkbox is checked, false otherwise
     * @method isChecked
     * @return {Boolean} checked
     */
    isChecked:function () {
        return this.getFormEl().getProperty('checked');
    },
    /**
     * Set checkbox to checked
     * @method check
     * @return void
     */
    check:function () {
        if (!this.isChecked()) {
            this.setChecked(true);
        }
    },
    /**
     * Uncheck checkbox
     * @method uncheck
     * @return void
     */
    uncheck:function () {
        if (this.isChecked()) {
            this.setChecked(false);
        }
    },

    focus:function () {

    },

    blur:function () {

    },

    getValue:function () {
        return this.isChecked() ? this.getFormEl().get('value') : '';
    },
    /**
     * Set checkbox to checked or unchecked
     * @method setChecked
     * @param {Boolean} checked
     */
    setChecked:function (checked) {
        this.setCheckedProperty(checked);
        this.fireEvent('change', [this.getValue(), this]);
        this.value = this.getValue();
        this.toggleImage();
        this.toggleDirtyFlag();
    },

    setCheckedProperty:function(checked){
        if(checked){
            this.getFormEl().setProperty('checked', '1');
        }else{
            this.getFormEl().removeProperty('checked');
        }
    },

    valueChange:function(){
        this.value = this.isChecked() ? this.getFormEl().get('value') : '';
        this.toggleDirtyFlag();
    },

    reset:function(){
        this.setCheckedProperty(this.initialValue ? true : false);
        this.fireEvent('valueChange', [this.getValue(), this]);
        this.toggleImage();
    },

    toggleImage:function () {
        if (this.els.radioImageDiv) {
            if (this.isChecked()) {
                ludo.dom.addClass(this.els.radioImageDiv, 'ludo-radio-image-checked');
            } else {
                ludo.dom.removeClass(this.els.radioImageDiv, 'ludo-radio-image-checked');
            }
        }
    }
});