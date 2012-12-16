/**
 * @namespace form
 * @class Element
 * @extends View
 * @description Super class for form components.
 */
ludo.form.Element = new Class({
	Extends:ludo.View,
	label:'',
	value:'',
	remote:{
		isJSON:true,
		onLoadMessage:''
	},
	autoHeight:true,
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
	data:null,
	/**
	 * Custom class name to apply to input element
	 * @attribute formCls
	 * @type string
	 * @default undefined
	 */
	formCls:undefined,
	/**
	 * Custom CSS rules to apply to input element
	 * @attribute formCss
	 * @type Object, example: { border : '1px solid #000' }
	 * @default undefined
	 */
	formCss:undefined,
	elementId:undefined,
	/**
	 * Let input field use all remaining space of the component
	 * @attribute stretchField
	 * @type {Boolean}
	 * @default true
	 */
	stretchField:true,
	fieldConfig:{},

	/**
	 * On focus, auto select text of input field.
	 * @attribute selectOnFocus
	 * @type {Boolean}
	 * @default false
	 */
	selectOnFocus:false,

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

	ludoConfig:function (config) {

		this.parent(config);

		this.label = config.label || this.label;
		this.formCss = config.formCss || this.formCss;

		var defaultConfig = this.getInheritedFormConfig();
		this.labelWidth = defaultConfig.labelWidth || this.labelWidth;
		this.fieldWidth = defaultConfig.fieldWidth || this.fieldWidth;
		this.formCls = defaultConfig.formCls || this.formCls;
		this.formCss = defaultConfig.formCss || this.formCss;
		this.elementId = defaultConfig.elementId || this.elementId;
		if (defaultConfig.height && config.height === undefined) {
			this.height = defaultConfig.height;
			this.autoHeight = false;
		}
		if(config.validator !== undefined)this.validator = config.validator;
		if (this.validator !== undefined) {
			this.createValidator();
		}
		if (config.stretchField !== undefined)this.stretchField = config.stretchField;
		if (config.required !== undefined)this.required = config.required;
		if (config.selectOnFocus !== undefined) this.selectOnFocus = config.selectOnFocus;
		if (config.required !== undefined) this.required = config.required;
		if (config.twin !== undefined) this.twin = config.twin;
		if (config.disabled !== undefined) this.disabled = config.disabled;

		if (config.linkWith !== undefined) {
			this.setLinkWith(config.linkWith);
		}

		this.labelWidth = config.labelWidth || this.labelWidth;
		this.fieldWidth = config.fieldWidth || this.fieldWidth;

		this.elementId = config.elementId || this.elementId;
		this.value = config.value || this.value;
		this.initialValue = this.constructorValue = this.value;
		if (!this.name) {
			this.name = 'ludo-form-el-' + String.uniqueID();
		}
		this.data = config.data || null;

		config.fieldConfig = config.fieldConfig || {};
		this.fieldConfig.value = config.fieldConfig.value || 'value';
		this.fieldConfig.text = config.fieldConfig.text || 'text';

		if (this.dataSource) {
			this.isReady = false;
			this.getDataSource().addEvent('load', this.setReady.bind(this));
		}

		ludo.Form.add(this);
	},

	createValidator:function(){
		if(ludo.util.isFunction(this.validator)){
			this.validatorFn = this.validator;
		}else{
			this.validator.applyTo = this;
			this.validator = ludo._new(this.validator);
			this.validatorFn = this.validator.isValid;
		}
	},

	ludoEvents:function () {
		this.parent();

		var formEl = this.getFormEl();

		if (formEl) {
			formEl.addEvent('keydown', this.keyDown.bind(this));
			formEl.addEvent('keypress', this.keyPress.bind(this));
			formEl.addEvent('keyup', this.keyUp.bind(this));
			formEl.addEvent('focus', this.focus.bind(this));
			formEl.addEvent('change', this.change.bind(this));
			formEl.addEvent('blur', this.blur.bind(this));
		}
		if (this.data) {
			this.populate(this.data);
		}
		if (this.selectOnFocus) {
			formEl.addEvent('focus', this.selectText.bind(this));
		}
	},

	ludoRendered:function () {
		this.parent();

		if (this.getFormEl()) {
			this.getFormEl().setProperty('name', this.getName());
		}
		if(this.disabled)this.disable();

		if (this.value && this.els.formEl) {
			this.els.formEl.set('value', this.value);
		}
		this.validate();
		var parentFormManager = this.getParentFormManager();
		if (parentFormManager) {
			parentFormManager.registerFormElement(this);
		}
		if (this.linkWith) {
			this.setLinkWithOfOther();
		}
	},
	/**
	 * Disable form element
	 * @method disable
	 * @return void
	 */
	disable:function () {
		this.getFormEl().setProperty('disabled', '1');
		ludo.dom.addClass(this.els.label, 'ludo-form-label-disabled');
	},
	/**
	 * Enable form element
	 * @method enable
	 * @return void
	 */
	enable:function () {
		this.getFormEl().removeProperty('disabled');
		this.els.label.removeClass('ludo-form-label-disabled');
	},

	getInheritedFormConfig:function () {
		var cmp = this.getParent();
		if (cmp) {
			return cmp.formConfig || {};
		}
		return {};
	},

	selectText:function () {
		this.getFormEl().select();
	},

	ludoDOM:function () {
		this.parent();
	},

	ludoCSS:function () {
		this.parent();
		this.getEl().addClass('ludo-form-element');
		if (this.els.formEl) {
			if (this.fieldWidth && this.getFormEl()) {
				this.els.formEl.setStyle('width', this.fieldWidth - ludo.dom.getPW(this.getFormEl()) - ludo.dom.getBW(this.getFormEl()));
			}
			if (this.formCls) {
				this.els.formEl.addClass(this.formCls);
			}
			if (this.elementId) {
				this.els.formEl.id = this.elementId;
			}
			if (this.formCss) {
				this.els.formEl.setStyles(this.formCss);
			}
		}
	},

	getFormElId:function () {
		if (!this.elementId) {
			this.elementId = 'ludo-form-el-' + String.uniqueID();
		}
		return this.elementId;
	},

	getWidth:function () {
		var ret = this.parent();
		if (!ret) {
			ret = this.fieldWidth;
			if (this.label) {
				ret += this.labelWidth;
			}
			ret += 2;

		}
		return ret;
	},

	keyUp:function (e) {
		/**
		 * key up event
		 * @event key_up
		 * @param key
		 * @param value of form field
		 * @param Component this
		 */
		this.fireEvent('key_up', [ e.key, this.getValue(), this ]);
	},

	keyDown:function (e) {
		/**
		 * key down event
		 * @event key_down
		 * @param key
		 * @param value of form field
		 * @param Component this
		 */
		this.fireEvent('key_down', [ e.key, this.getValue(), this ]);
	},

	keyPress:function (e) {
		/**
		 * key press event
		 * @event key_press
		 * @param key
		 * @param value of form field
		 * @param Component this
		 */
		this.fireEvent('key_press', [ e.key, this.getValue(), this ]);
	},

	focus:function () {
		this._focus = true;
		this.clearInvalid();
		/**
		 * On focus event
		 * @event focus
		 * @param value of form field
		 * @param Component this
		 */
		this.fireEvent('focus', [ this.getValue(), this ]);
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
		 * @param value of form field
		 * @param Component this
		 */
		if(this.wasValid)this.fireEvent('change', [ this.getValue(), this ]);
	},

	blur:function () {
		this._focus = false;
		this.validate();

		if(this.getFormEl())this.value = this.getFormEl().value;
		if (this.getValue() !== this.initialValue) {
			/**
			 * @event dirty
			 * @description event fired on blur when value is different from it's original value
			 * @param {String} value
			 * @param {Object} ludo.form.* component
			 */
			this.setDirty();
			this.fireEvent('dirty', [this.getValue(), this]);
		} else {
			/**
			 * @event clean
			 * @description event fired on blur when value is equal to original/start value
			 * @param {String} value
			 * @param {Object} ludo.form.* component
			 */
			this.setClean();
			this.fireEvent('clean', [this.getValue(), this]);
		}
		/**
		 * On blur event
		 * @event blur
		 * @param value of form field
		 * @param Component this
		 */
		this.fireEvent('blur', [ this.getValue(), this ]);
	},

	hasFocus:function () {
		return this._focus;
	},
	insertJSON:function (json) {
		this.populate(json.data);
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
		return this.value;
	},
	/**
	 * Set new value
	 * @method setValue
	 * @param value
	 * @return void
	 */
	setValue:function (value) {
		if (!this.isReady) {
			this.setValue.delay(50, this, value);
			return;
		}

		if (value == this.value) {
			return;
		}
		if (this.els.formEl && this.els.formEl.value !== value) {
			this.els.formEl.set('value', value);
		}

		this.value = value;

		this.validate();

		if(this.wasValid){
			/**
			 * This event is fired whenever current value is changed, either
			 * manually by user or by calling setValue. When the value is changed
			 * manually by user via GUI, the "change" event is fired first, then
			 * "valueChange" afterwards.
			 * @event valueChange
			 * @param {Object|String|Number} value
			 * @param {form.Element} form component
			 */
			this.fireEvent('valueChange', [value, this]);
			if(this.stateful)this.fireEvent('state');
			if (this.linkWith)this.updateLinked();
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
	 * Is form input valid
	 * @method isValid
	 * @return {Boolean}
	 */
	isValid:function () {
		if (this.twin) {
			var cmp = ludo.get(this.twin);
			if (cmp && this.getValue() !== cmp.getValue()) {
				return false;
			}
		}
		if (this.validatorFn) {
			return this.validatorFn.call(this.validator, this.getValue());
			// return this.validator.isValid(this.getValue());
		}
		return true;
	},

	clearInvalid:function () {
		var el = this.getFormEl();
		if (el) {
			el.removeClass('ludo-form-el-invalid');
		}
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
			this.fireEvent('valid', [this.getValue(), this]);
		} else {
			this.wasValid = false;
			/**
			 * Event fired when value of form component is valid. This is fired on blur
			 * @event invalid
			 * @param {String} value
			 * @param {Object} component
			 */
			this.fireEvent('invalid', [this.getValue(), this]);
		}
	},

	isFormElement:function () {
		return true;
	},

	/**
	 * Returns initial value sent to constructor
	 * @method getInitialValue
	 * @return string initial value
	 */
	getInitialValue:function () {
		return this.initialValue;
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
		this.getEl().addClass('ludo-form-el-dirty');
	},

	setClean:function () {
		this.dirtyFlag = false;
		this.getEl().removeClass('ludo-form-el-dirty');
	},

	setReady:function () {
		this.isReady = true;
	},

	updateLinked:function () {
		var cmp = ludo.get(this.linkWith);
		var val = this.value;
		if (cmp.value !== val) {
			cmp.setValue(val);
		}
	},

	setLinkWith:function (linkWith) {
		this.linkWith = linkWith;
		this.addEvent('valueChange', this.updateLinked.bind(this));
	},

	setLinkWithOfOther:function (attempts) {
		attempts = attempts || 0;
		var cmp = ludo.get(this.linkWith);
		if (cmp && !cmp.linkWith) {
			if (!this.getValue())this.setValue(cmp.value);
			cmp.setLinkWith(this.id);
		} else {
			if (attempts < 100) {
				this.setLinkWithOfOther.delay(50, this, attempts + 1);
			}
		}
	}
});