/**
 * Class for checkbox form elements
 * @class ludo.form.Checkbox
 * @augments ludo.form.Element
 */
ludo.form.Checkbox = new Class({
    Extends:ludo.form.Element,
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

    __construct:function (config) {
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
            this.getInputCell().append(radio);
            this.els.formEl = document.id(radio);
        } else {
            radio = this.els.formEl = $('<input type="' + this.inputType + '" id="' + id + '" value="' + this.value + '" name="' + this.getName() + '">');
            this.getInputCell().append(radio);

        }
        this.els.formEl.on('click', this.toggleImage.bind(this));
        if(this.inputType === 'checkbox'){
            this.els.formEl.on('click', this.valueChange.bind(this));
        }
        if (this.checked) {
            this.getFormEl().checked = true;
            this.toggleImage();
        }
    },

    addRadioImage:function () {
        var div = this.els.radioImageDiv = $('<div>');
        var radioDivInner = $('<div>');
        radioDivInner.addClass('ludo-radio-image-inner');
        radioDivInner.setStyles({
            'width':'100%',
            'height':'100%',
            'background' : 'url(' + this.image + ') no-repeat center center'
        });

        div.append(radioDivInner);
        div.addClass('ludo-radio-image');
        div.addEvent('click', this.clickOnImage.bind(this));
        this.getImageCell().append(div);
        this.getBody().getElement('.checkbox-image-row').style.display = '';
    },

    getImageCell:function () {
        return this.getCell('.input-image','imageCell');
    },

    setWidthOfLabel:function () {

    },

    clickOnImage:function () {
        if (this.inputType === 'checkbox') {
            this.setChecked(!this.isChecked());
        } else {
            this.check();
        }
    },
    /**
     * Return true if checkbox is checked, false otherwise
     * @function isChecked
     * @return {Boolean} checked
     */
    isChecked:function () {
        return this.getFormEl().attr('checked') ? true : false;
    },
    /**
     * Set checkbox to checked
     * @function check
     * @return void
     */
    check:function () {
        if (!this.isChecked()) {
            this.setChecked(true);
        }
    },
    /**
     * Uncheck checkbox
     * @function uncheck
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

    getValue:function(){
        console.warn("Use of deprecated getValue");
        console.trace();
        return this.isChecked() ? this.getFormEl().val() : '';
    },

    _get:function () {
        return this.isChecked() ? this.getFormEl().val() : '';
    },
    /**
     * Set checkbox to checked or unchecked
     * @function setChecked
     * @param {Boolean} checked
     */
    setChecked:function (checked) {
        this.setCheckedProperty(checked);
        this.fireEvent('change', [this._get(), this]);
        this.value = this._get();
        this.toggleImage();
        this.toggleDirtyFlag();
    },

    setCheckedProperty:function(checked){
        if(checked){
            this.getFormEl().attr('checked', '1');
        }else{
            this.getFormEl().removeAttr('checked');
        }
    },

    valueChange:function(){
        this.value = this.isChecked() ? this.getFormEl().val() : '';
        this.toggleDirtyFlag();
    },

    reset:function(){
        this.setCheckedProperty(this.initialValue ? true : false);
        this.fireEvent('valueChange', [this._get(), this]);
        this.toggleImage();
    },

    toggleImage:function () {
        if (this.els.radioImageDiv) {
            if (this.isChecked()) {
                this.els.radioImageDiv.addClass('ludo-radio-image-checked');
            } else {
                this.els.radioImageDiv.removeClass('ludo-radio-image-checked');
            }
        }
    },

    supportsInlineLabel:function(){
        return false;
    }
});