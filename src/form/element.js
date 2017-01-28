/**
 * Super class for form Views.
 * This class inherits from <a href="ludo.View.html">ludo.View</a>.
 * @module form
 * @class ludo.form.Element
 * @param {Object} config Configuration when creating the View. These properties and properties from superclass is available
 * @param {String} config.name Name of element. A call to parentView.getForm().values() will return &lt;name> : &lt;value>.
 * @param {Boolean} config.required True to apply validation for required. Default:false
 * @param {Object} config.formCss Optional css styling of the form element. Example: { type:'form.Text', formCss:{ "text-align": right }} to right align text of a text input.
 * @param {Function} config.validator A Validator function to be executed when value is changed. This function should return true when valid, false when invalid. Current value will be passed to this function.
 * @param {Function} config.linkWith Creates a link with form element with this id. When two form views are linked, they will always have the same value. When one value is changed, the linked form view is automatically updated.
 * @param {String} config.name Name of form element
 * @param {String|Number} config.value - Initial value for form element.
 * Example: A link between a form.Seekbar and a form.Number.
 * Example: { type:'form.Text', placeHolder='Enter Valid Value', validator:function(value){ return value == 'Valid Value' } }
 * @fires ludo.form.Element#enable - Fired on enable, argument: ludo.form.Element
 * @fires ludo.form.Element#disable - Fired on disable, argument: ludo.form.Element
 * @fires ludo.form.Element#key_down - Fired on key down. Arguments: key, value, ludo.form.Element
 * @fires ludo.form.Element#key_up - Fired on key up. Arguments: key, value, ludo.form.Element
 * @fires ludo.form.Element#key_press - Fired on key up. Arguments: key, value, ludo.form.Element
 * @fires ludo.form.Element#focus - Fired on focus received. Arguments: value, ludo.form.Element
 * @fires ludo.form.Element#blur - Fired on blur. Arguments: value, ludo.form.Element
 * @fires ludo.form.Element#change - Fired on changed value by GUI. Arguments: value, ludo.form.Element
 * @fires ludo.form.Element#valueChange - Fired on changed value by GUI or the val function. Arguments: value, ludo.form.Element
 * @fires ludo.form.Element#dirty - Fired on new value which is different from initial. Arguments. value, ludo.form.Element
 * @fires ludo.form.Element#clean - Fired on new value which is the same as initial. Arguments. value, ludo.form.Element
 * @fires ludo.form.Element#value - Fired when a new valid value is set. Arguments. value, ludo.form.Element
 * @fires ludo.form.Element#invalid - Fired when a new value is set which is invalid. Arguments. value, ludo.form.Element
 * @namespace ludo.form
 */
ludo.form.Element = new Class({
    Extends:ludo.View,

    value:undefined,
    onLoadMessage:'',

    name:undefined,


    formCss:undefined,
    stretchField:true,
    required:false,
    dirtyFlag:false,
    initialValue:undefined,
    constructorValue:undefined,
    /*
     * Is form element ready for setValue. For combo boxes and select boxes it may
     * not be ready until available values has been loaded remotely
     * @property isReady
     * @type {Boolean}
     * @private
     */
    isReady:true,
    overflow:'hidden',

    /*
     * Will not validate unless value is the same as value of the form element with this id
     * Example of use: Password and Repeat password. It's sufficient to specify "twin" for one of
     * the views.
     * @property twin
     * @type String
     * @default undefined
     */
    twin:undefined,
    linkWith:undefined,
    statefulProperties:['value'],
    validator:undefined,
    validatorFn:undefined,

    validators:[],
    submittable:true,

    __construct:function (config) {
        

        this.parent(config);
        var defaultConfig = this.getInheritedFormConfig();

        // TODO change disabled to enabled


        var keys = ['label', 'suffix', 'formCss', 'validator', 'stretchField', 'required', 'twin', 'disabled','submittable',
            'value', 'data'];
        this.setConfigParams(config, keys);

        this.elementId = ('el-' + this.name).trim();
        this.formCss = defaultConfig.formCss || this.formCss;
        if (defaultConfig.height && config.height === undefined)this.layout.height = defaultConfig.height;

        if (this.validator) {
            this.createValidator();
        }
        if (config.linkWith !== undefined) {
            this.setLinkWith(config.linkWith);
        }

        if (this.dataSource && !this.dataSource.data) {
            this.isReady = false;
        }
        this.initialValue = this.constructorValue = this.value;
        if (!this.name)this.name = 'ludo-form-el-' + String.uniqueID();


        ludo.Form.add(this);
        if(this.required)this.applyValidatorFns(['required']);
        this.applyValidatorFns(['twin']);
    },

    ludoDOM:function(){
        this.parent();
        this.addInput();
    },

    applyValidatorFns:function (keys) {
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (this[key] !== undefined) {
                this.validators.push({
                    fn:ludo.form.validator[key],
                    key:key
                });
            }
        }
    },

    createValidator:function () {
        var fn;
        if (ludo.util.isFunction(this.validator)) {
            fn = this.validator;
        } else {
            this.validator.applyTo = this;
            this.validator = ludo._new(this.validator);
            fn = this.validator.isValid.bind(this.validator);
        }
        this.validators.push({
            fn : fn,key:''
        });
    },

    ludoEvents:function () {
        this.parent();

        if (this.dataSource) {
            this.getDataSource().addEvent('load', this.setReady.bind(this));
        }

        var formEl = this.getFormEl();

        if (formEl) {
            formEl.on('keydown', this.keyDown.bind(this));
            formEl.on('keypress', this.keyPress.bind(this));
            formEl.on('keyup', this.keyUp.bind(this));
            formEl.on('focus', this.focus.bind(this));
            formEl.on('change', this.change.bind(this));
            formEl.on('blur', this.blur.bind(this));
        }
    },

    __rendered:function () {
        this.parent();

        if (this.disabled)this.disable();

		if(this.els.formEl){
			this.els.formEl.attr('name', this.getName());
			if(this.value !== undefined)this.els.formEl.val(this.value)
		}
        if (this.linkWith) {
            this.createBackLink();
        }
		var parentFormManager = this.getParentForm();
	    if (parentFormManager) {
			parentFormManager.registerFormElement(this);
		}
		this.validate();
    },

    /**
     * Enable or disable form element
     * @param {Boolean} enabled
     * @memberof ludo.form.Element.prototype
     */
    setEnabled:function(enabled){
        if(enabled)this.enable(); else this.disable();
    },

    /**
     * Disable form element
     * @function disable
     * @return void
     * @memberof ludo.form.Element.prototype
     */
    disable:function () {
        this.getFormEl().attr('disabled', '1');
        this.fireEvent('disable', this);
    },
    /**
     * Enable form element
     * @function enable
     * @return void
     * @memberof ludo.form.Element.prototype
     */
    enable:function () {
        this.getFormEl().removeAttr('disabled');
        this.fireEvent('enable', this);
    },

    getInheritedFormConfig:function () {
        var cmp = this.getParent();
        if (cmp) {
            return cmp.formConfig || {};
        }
        return {};
    },

    ludoCSS:function () {
        this.parent();
        this.getEl().addClass('ludo-form-element');
        if (this.els.formEl) {
            this.els.formEl.id = this.elementId;

            if (this.formCss) {
                this.els.formEl.css(this.formCss);
            }
        }
    },

    getFormElId:function () {
        return this.elementId;
    },

    getWidth:function () {
        var ret = this.parent();
        return ret ? ret : 20;
    },

    keyUp:function (e) {
        this.fireEvent('key_up', [ e.key, this.value, this ]);
    },

    keyDown:function (e) {

        this.fireEvent('key_down', [ e.key, this.value, this ]);
    },

    keyPress:function (e) {
        this.fireEvent('key_press', [ e.key, this.value, this ]);
    },

    focus:function () {
        this._focus = true;
        this.clearInvalid();
        this.fireEvent('focus', [ this.value, this ]);
    },
    change:function () {
        if (this.els.formEl) {
            this._set(this.els.formEl.val());

        }
        if (this.wasValid)this.fireEvent('change', [ this._get(), this ]);
    },

    blur:function () {
        this._focus = false;
        this.validate();
        if (this.getFormEl())this.value = this.getValueOfFormEl();
        this.toggleDirtyFlag();

        this.fireEvent('blur', [ this.value, this ]);
    },

    getValueOfFormEl:function(){
        return this.getFormEl().val();
    },

    toggleDirtyFlag:function(){
        if (this.value !== this.initialValue) {
            this.setDirty();
            this.fireEvent('dirty', [this.value, this]);
        } else {
            this.setClean();
            this.fireEvent('clean', [this.value, this]);
        }
    },

    hasFocus:function () {
        return this._focus;
    },
    JSON:function (data) {
        this.populate(data);
    },
    populate:function () {

    },
    getLabel:function () {
        return this.label;
    },

    getValue:function () {
        console.warn("Use of deprecated getValue");
        console.trace();
        return this.els.formEl ? this.els.formEl.val() : this.value;
    },

    /**
     * Set or get value. If val argument is set, you will set a value, if not current value
     * will be returned.
     * @param {String|Number|Array|Object|Boolean} val
     * @returns {*}
     * @memberof ludo.form.Element.prototype
     */

    val:function(val){
        if(arguments.length == 0){
            return this._get();
        }
        this._set(val);
    },

    _get:function(){
        return this.els.formEl ? this.els.formEl.val() : this.value;
    },

    _set:function(value){

        if (value == this.value) {
            return value;
        }

        this.setFormElValue(value);
        this.value = value;



        this.validate();

        if (this.wasValid) {
            this.fireEvent('valueChange', [this._get(), this]);
            if (this.stateful)this.fireEvent('state');
            if (this.linkWith)this.updateLinked();
        }

        this.fireEvent('value', value);

        return value;
    },

    /*
     * Set new value
     * @function setValue
     * @param value
     * @return void
     */
    setValue:function (value) {
        console.warn("Use of deprecated setValue");
        console.trace();
        return this._set(value);
    },

    setFormElValue:function(value){
        if (this.els.formEl && this.els.formEl.val() !== value) {
            this.els.formEl.val(value);
            if(this.inlineLabel)this.els.formEl.removeClass('ludo-form-el-inline-label');
        }
    },

    /**
     * Get reference to input element
     * @function getFormEl
     * @return DOMElement
     * @memberof ludo.form.Element.prototype
     */
    getFormEl:function () {
        return this.els.formEl;
    },
    /**
     * Returns true when value of form element is valid, i.e. larger than minValue, matching regex etc.
     * @function isValid
     * @return {Boolean} valid
     * @memberof ludo.form.Element.prototype
     */
    isValid:function () {
        if(this.validators.length === 0)return true;

        var val = this.getFormEl() ? this.getValueOfFormEl().trim() : this.value;
        for (var i = 0; i < this.validators.length; i++) {
            if (!this.validators[i].fn.apply(this, [val, this[this.validators[i].key], this])){
                return false;
            }
        }
        return true;
    },

    clearInvalid:function () {
        this.getEl().removeClass('ludo-form-el-invalid');
    },

    wasValid:true,

    validate:function () {
        this.clearInvalid();
        if (this.isValid()) {
            this.wasValid = true;

            this.fireEvent('valid', [this.value, this]);
            return true;
        } else {
            this.wasValid = false;

            this.fireEvent('invalid', [this.value, this]);
            return false;
        }
    },

    isFormElement:function () {
        return true;
    },

    /**
     * Alias to reset
     * @memberof ludo.form.Element.prototype
     */
    rollback:function(){
        this.reset();
    },
    /**
     * Reset / Roll back to last committed value. It could be the value stored by last commit method call
     * or if the original value/default value of this field.
     * @function reset
     * @memberof ludo.form.Element.prototype
     * @return void
     */
    reset:function () {
        this._set(this.initialValue);
    },

    /**
     * Reset value back to the original value sent(constructor value)
     * @function clear
     * @memberof ludo.form.Element.prototype
     */
    clear:function () {
        this._set(this.constructorValue);
    },

    /**
     * Update initial value to current value. These actions will always trigger a commit<br>
     * - Form or Model submission
     * - Fetching new record for a ludo.model.Model
     * @function commit
     * @memberOf ludo.form.Element.prototype
     */
    commit:function () {
        if(!this.isReady){
            this.commit.delay(100, this);
            return;
        }
        this.initialValue = this.value;
    },
    /**
     * Returns true if current value is different from original value
     * @function isDirty
     * @return {Boolean} isDirty
     * @memberof ludo.form.Element.prototype
     */
    isDirty:function () {
        return this.dirtyFlag;
    },

    setDirty:function () {
        this.dirtyFlag = true;
        this.getEl().addClass('ludo-form-el-dirty');
    },

    setClean:function () {
        this.dirtyFlag = false;
        var el = this.getEl();
        if(el)el.removeClass('ludo-form-el-dirty');
    },

    setReady:function () {
        this.isReady = true;
        var val = this.value;
        this.value = undefined;
        if(val)this._set(val);
    },

    updateLinked:function () {
        var cmp = this.getLinkWith();
        if (cmp && cmp.value !== this.value) {
            cmp._set(this.value);
        }
    },

    setLinkWith:function (linkWith) {
        this.linkWith = linkWith;
        this.addEvent('valueChange', this.updateLinked.bind(this));
    },

    createBackLink:function (attempts) {
        attempts = attempts || 0;
        var cmp = this.getLinkWith();
        if (cmp && !cmp.linkWith) {
            if (this.value === undefined){
				this.initialValue = this.constructorValue = cmp.value;
				this._set(cmp.value);
			}
            cmp.setLinkWith(this);
        } else {
            if (attempts < 100) {
                this.createBackLink.delay(50, this, attempts + 1);
            }
        }
    },

    addInput: function () {
        if (!this.inputTag) {
            return;
        }

        this.els.inputCell = jQuery('<div class="input-cell"></div>');
        this.getBody().append(this.els.inputCell);
        this.els.formEl = jQuery('<' + this.inputTag + '>');

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
        this.els.formEl.css('width', '100%');
        this.els.formEl.attr("id", this.getFormElId());
    },

    getLinkWith:function(){
        var cmp = ludo.get(this.linkWith);
        return cmp ? cmp : this.parentComponent ? this.parentComponent.child[this.linkWith] : undefined;
    },

    getInputCell:function(){
        return this.els.inputCell;
    }
});