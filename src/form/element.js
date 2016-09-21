/**
 * @namespace form
 * @class Element
 * @extends View
 * @description Super class for form components.
 */
ludo.form.Element = new Class({
    Extends:ludo.View,
	/**
	 * Form element label
	 * @config {String} label
	 * @default ''
	 */
    label:undefined,
	/**
	 * Label after input field
	 * @config {String} suffix
	 *
	 */
	suffix:'',

    /**
     * Initial value
     * @config {String|Number} value
     * @default undefined
     */
    value:undefined,

    onLoadMessage:'',

    /**
     * Width of label
     * @attribute labelWidth
     * @default 100
     */
    labelWidth:100,
    /**
     * "name" is inherited from ludo.View. It will also be set as name of input element
     * @attribute name
     * @type string
     * @default undefined
     */
    name:undefined,
    /**
     * Width of input element
     * @attribute fieldWidth
     * @type int
     * @default undefined
     */
    fieldWidth:undefined,

    /**
     * Custom CSS rules to apply to input element
     * @attribute formCss
     * @type Object, example: { border : '1px solid #000' }
     * @default undefined
     */
    formCss:undefined,
    /**
     * Let input field use all remaining space of the component
     * @attribute stretchField
     * @type {Boolean}
     * @default true
     */
    stretchField:true,


    /**
     * Is a value required for this field
     * @attribute required
     * @type {Boolean}
     * @default false
     */
    required:false,
    dirtyFlag:false,
    initialValue:undefined,
    constructorValue:undefined,
    /**
     * Is form element ready for setValue. For combo boxes and select boxes it may
     * not be ready until available values has been loaded remotely
     * @property isReady
     * @type {Boolean}
     * @private
     */
    isReady:true,
    overflow:'hidden',

    /**
     * Will not validate unless value is the same as value of the form element with this id
     * Example of use: Password and Repeat password. It's sufficient to specify "twin" for one of
     * the views.
     * @property twin
     * @type String
     * @default undefined
     */
    twin:undefined,

    /**
     * Link with a form component with this id. Value of these components will always be the same
     * Update one and the other component will be updated automatically. It's sufficient
     * to specify linkWith for one of the two views.
     * @property linkWith
     * @type String
     * @default undefined
     */
    linkWith:undefined,

    /**
     * When using stateful:true, value will be preserved to next visit.
     * @property statefulProperties
     * @type Array
     * @default ['value']
     */
    statefulProperties:['value'],

    /**
     Object of class form.validator.* or a plain validator function
     When set the isValid method of the validator will be called after standard validation is complete
     and form element is valid.
     @property validator
     @type Object
     @example
        validator : { type : 'form.validator.Md5', value : 'MD5 hash of something' }
     In order to validate this field, the MD5 of form field value must match form.validator.Md5.value
     @example
        validator:function(value){
	 		return value === 'Valid value';
	 	}
     is example of simple function used as validator.
     */
    validator:undefined,
    validatorFn:undefined,

    validators:[],

    ludoConfig:function (config) {
        this.parent(config);
        var defaultConfig = this.getInheritedFormConfig();
        this.labelWidth = defaultConfig.labelWidth || this.labelWidth;
        this.fieldWidth = defaultConfig.fieldWidth || this.fieldWidth;
        this.inlineLabel = defaultConfig.inlineLabel || this.inlineLabel;

        var keys = ['label', 'suffix', 'formCss', 'validator', 'stretchField', 'required', 'twin', 'disabled', 'labelWidth', 'fieldWidth',
            'value', 'data'];
        this.setConfigParams(config, keys);

        this.elementId = 'el-' + this.id;
        this.formCss = defaultConfig.formCss || this.formCss;
        if (defaultConfig.height && config.height === undefined)this.layout.height = defaultConfig.height;

        if (this.validator) {
            this.createValidator();
        }
        if (config.linkWith !== undefined) {
            this.setLinkWith(config.linkWith);
        }

        if (this.dataSource) {
            this.isReady = false;
        }
        this.initialValue = this.constructorValue = this.value;
        if (!this.name)this.name = 'ludo-form-el-' + String.uniqueID();


        ludo.Form.add(this);
        if(this.required)this.applyValidatorFns(['required']);
        this.applyValidatorFns(['twin']);
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

    ludoRendered:function () {
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
     */
    setEnabled:function(enabled){
        if(enabled)this.enable(); else this.disable();
    },

    /**
     * Disable form element
     * @method disable
     * @return void
     */
    disable:function () {
        this.getFormEl().attr('disabled', '1');
        ludo.dom.addClass(this.els.label, 'ludo-form-label-disabled');
    },
    /**
     * Enable form element
     * @method enable
     * @return void
     */
    enable:function () {
        this.getFormEl().removeProperty('disabled');
        ludo.dom.removeClass(this.els.label, 'ludo-form-label-disabled');
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
        ludo.dom.addClass(this.getEl(), 'ludo-form-element');
        if (this.els.formEl) {
            if (this.fieldWidth) {
                this.els.formEl.css('width', (this.fieldWidth - ludo.dom.getPW(this.els.formEl) - ludo.dom.getBW(this.els.formEl)));
            }

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
        return ret ? ret : this.fieldWidth + (this.label ? this.labelWidth : 0) + 2;
    },

    keyUp:function (e) {
        /**
         * key up event
         * @event key_up
         * @param {String} key
         * @param {String|Boolean|Object|Number} value
         * @param {View} this
         */
        this.fireEvent('key_up', [ e.key, this.value, this ]);
    },

    keyDown:function (e) {
        /**
         * key down event
         * @event key_down
         * @param {String} key
         * @param {String|Boolean|Object|Number} value
         * $param {View} this
         */
        this.fireEvent('key_down', [ e.key, this.value, this ]);
    },

    keyPress:function (e) {
        /**
         * key press event
         * @event key_press
         * @param {String} key
         * @param {String|Boolean|Object|Number} value
         * $param {View} this
         */
        this.fireEvent('key_press', [ e.key, this.value, this ]);
    },

    focus:function () {
        this._focus = true;
        this.clearInvalid();
        /**
         * On focus event
         * @event focus
         * @param {String|Boolean|Object|Number} value
         * $param {View} this
         */
        this.fireEvent('focus', [ this.value, this ]);
    },
    change:function () {
        if (this.els.formEl) {
            this.setValue(this.els.formEl.get('value'));
        }
        /**
         * On change event. This event is fired when value is changed manually
         * by the user via GUI. The "change" event is followed by a
         * "valueChange" event.
         * When value is changed using the setValue method
         * only the "valueChange" event is fired.
         *
         * @event change
         * @param {String|Boolean|Object|Number} value
         * $param {View} this
         */
        if (this.wasValid)this.fireEvent('change', [ this.getValue(), this ]);
    },

    blur:function () {
        this._focus = false;
        this.validate();
        if (this.getFormEl())this.value = this.getValueOfFormEl();
        this.toggleDirtyFlag();
        /**
         * On blur event
         * @event blur
         * @param {String|Boolean|Object|Number} value
         * $param {View} this
         */
        this.fireEvent('blur', [ this.value, this ]);
    },

    getValueOfFormEl:function(){
        return this.getFormEl().val();
    },

    toggleDirtyFlag:function(){
        if (this.value !== this.initialValue) {
            /**
             * @event dirty
             * @description event fired on blur when value is different from it's original value
             * @param {String} value
             * @param {Object} ludo.form.* component
             */
            this.setDirty();
            this.fireEvent('dirty', [this.value, this]);
        } else {
            /**
             * @event clean
             * @description event fired on blur when value is equal to original/start value
             * @param {String} value
             * @param {Object} ludo.form.* component
             */
            this.setClean();
            this.fireEvent('clean', [this.value, this]);
        }
    },

    hasFocus:function () {
        return this._focus;
    },
    insertJSON:function (data) {
        this.populate(data);
    },
    populate:function () {

    },
    getLabel:function () {
        return this.label;
    },
    /**
     * Return current value
     * @method getValue
     * @return string
     */
    getValue:function () {
        return this.els.formEl ? this.els.formEl.get('value') : this.value;
    },
    /**
     * Set new value
     * @method setValue
     * @param value
     * @return void
     */
    setValue:function (value) {
        if (!this.isReady) {
            if(value)this.setValue.delay(50, this, value);
            return;
        }

        if (value == this.value) {
            return;
        }

        this.setFormElValue(value);
        this.value = value;



        this.validate();

        if (this.wasValid) {
            /**
             * This event is fired whenever current value is changed, either
             * manually by user or by calling setValue. When the value is changed
             * manually by user via GUI, the "change" event is fired first, then
             * "valueChange" afterwards.
             * @event valueChange
             * @param {Object|String|Number} value
             * @param {form.Element} form component
             */
            this.fireEvent('valueChange', [this.getValue(), this]);
            if (this.stateful)this.fireEvent('state');
            if (this.linkWith)this.updateLinked();
        }

        this.fireEvent('value', value);
    },

    setFormElValue:function(value){
        if (this.els.formEl && this.els.formEl.value !== value) {
            this.els.formEl.set('value', value);
            if(this.inlineLabel)ludo.dom.removeClass(this.els.formEl, 'ludo-form-el-inline-label');
        }
    },

    /**
     * Get reference to input element
     * @method getFormEl
     * @return DOMElement
     */
    getFormEl:function () {
        return this.els.formEl;
    },
    /**
     * Returns true when value of form element is valid, i.e. larger than minValue, matching regex etc.
     * @method isValid
     * @return {Boolean} valid
     */
    isValid:function () {
        if(this.validators.length === 0)return true;

        var val = this.getFormEl() ? this.getValueOfFormEl().trim() : this.value;
        for (var i = 0; i < this.validators.length; i++) {
            if (!this.validators[i].fn.apply(this, [val, this[this.validators[i].key]])){
                return false;
            }
        }
        return true;
    },

    clearInvalid:function () {
        ludo.dom.removeClass(this.getEl(), 'ludo-form-el-invalid');
    },

    wasValid:true,

    validate:function () {
        this.clearInvalid();
        if (this.isValid()) {
            this.wasValid = true;
            /**
             * Event fired when value of form component is valid. This is fired on blur
             * @event valid
             * @param {String} value
             * @param {Object} component
             */
            this.fireEvent('valid', [this.value, this]);
            return true;
        } else {
            this.wasValid = false;
            /**
             * Event fired when value of form component is valid. This is fired on blur
             * @event invalid
             * @param {String} value
             * @param {Object} component
             */
            this.fireEvent('invalid', [this.value, this]);
            return false;
        }
    },

    isFormElement:function () {
        return true;
    },

    /**
     * Reset / Roll back to last committed value. It could be the value stored by last commit method call
     * or if the original value/default value of this field.
     * @method reset
     * @return void
     */
    reset:function () {
        this.setValue(this.initialValue);
    },

    /**
     * Reset value back to the original value sent(constructor value)
     * @method clear
     * @return void
     */
    clear:function () {
        this.setValue(this.constructorValue);
    },

    /**
     * Update initial value to current value. These actions will always trigger a commit<br>
     * - Form or Model submission
     * - Fetching new record for a ludo.model.Model
     * @method commit
     * @return void
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
     * @method isDirty
     * @return {Boolean} isDirty
     */
    isDirty:function () {
        return this.dirtyFlag;
    },

    setDirty:function () {
        this.dirtyFlag = true;
        ludo.dom.addClass(this.getEl(), 'ludo-form-el-dirty');
    },

    setClean:function () {
        this.dirtyFlag = false;
        ludo.dom.removeClass(this.getEl(), 'ludo-form-el-dirty');
    },

    setReady:function () {
        this.isReady = true;
    },

    updateLinked:function () {
        var cmp = this.getLinkWith();
        if (cmp && cmp.value !== this.value) {
            cmp.setValue(this.value);
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
				this.setValue(cmp.value);
			}
            cmp.setLinkWith(this);
        } else {
            if (attempts < 100) {
                this.createBackLink.delay(50, this, attempts + 1);
            }
        }
    },

    getLinkWith:function(){
        var cmp = ludo.get(this.linkWith);
        return cmp ? cmp : this.parentComponent ? this.parentComponent.child[this.linkWith] : undefined;
    }
});