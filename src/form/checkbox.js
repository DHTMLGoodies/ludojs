/**
 * Class for checkbox form elements
 * @class ludo.form.Checkbox
 * @param {Object} config
 * @param {booelan} config.checked Initial checked
 * @augments ludo.form.Element
 */
ludo.form.Checkbox = new Class({
    Extends:ludo.form.Element,
    type:'form.Checkbox',
    inputTag : 'input',
    inputType:'checkbox',
    stretchField:false,
    labelWidth:undefined,

    image:undefined,

    checked:false,
    height:undefined,
    labelSuffix : '',

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
       this.parent();
        this.els.formEl.on('click', this.toggleImage.bind(this));
        if(this.inputType === 'checkbox'){
            this.els.formEl.on('click', this.valueChange.bind(this));
        }
        if (this.checked) {
            this.getFormEl().prop('checked', true);
            this.toggleImage();
        }
    },

    addRadioImage:function () {
        var div = this.els.radioImageDiv = jQuery('<div>');
        var radioDivInner = jQuery('<div>');
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
        this.$b().getElement('.checkbox-image-row').style.display = '';
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
     * @memberof ludo.form.Checkbox.prototype
     */
    isChecked:function () {
        return this.getFormEl().prop('checked') ? true : false;
    },
    /**
     * Set checkbox to checked
     * @function check
     * @return void
     * @memberof ludo.form.Checkbox.prototype
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
     * @memberof ludo.form.Checkbox.prototype
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
     * @memberof ludo.form.Checkbox.prototype
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
            this.getFormEl().prop('checked', true);
        }else{
            this.getFormEl().prop('checked', false);
        }
    },

    valueChange:function(){
        this.value = this.isChecked() ? this.getFormEl().val() : '';
        this.toggleDirtyFlag();
    },

    /**
     * Reset back to original value(checked or unchecked)
     * @function reset
     * @memberof ludo.form.Checkbox.prototype
     */
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