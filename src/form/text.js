/**
 * @namespace form
 * @class Text
 * @description Form input text
 * @extends form.LabelElement
 *
 */
ludo.form.Text = new Class({
	Extends:ludo.form.LabelElement,
	type:'form.Text',
	labelWidth:100,
	defaultValue:'',
	/**
	 * Max length of input field
	 * @attribute maxLength
	 * @type int
	 * @default undefined
	 */
	maxLength:undefined,

	/**
	 * Minimum length of value. invalid event will be fired when
	 * value is too short. The value will be trimmed before checking size
	 * @attribute minLength
	 * @type {Number}
	 * @default undefined
	 */
	minLength:undefined,

	/**
	 * When true, capitalize first letter automatically
	 * @attribute {Boolean} ucFirst
	 * @default false
	 */
	ucFirst:false,

	/**
	 When true, capitalize first letter of every word while typing
	 Note! ucWords is not an option for ludo.form.Textarea
	 @attribute {Boolean} ucWords
	 @default false
	 */
	ucWords:false,

	inputType:'text',
	inputTag:'input',

	/**
	 Regular expression used for validation
	 @attribute regex
	 @type String
	 @default undefined
	 @example
	 	regex:'[0-9]
	 This will only validate numbers
	 */
	regex:undefined,

	/**
	 Regular expression flag used when regex is defined
	 @attribute {String} regexFlags
	 @default 'gi'
	 @example
	 	regexFlags:'gi';
	 For global case-insensitive search
	 */

	regexFlags:'gi',

	/**
	Run RegEx validation on key strokes. Only keys matching "regex" will be added to the text field.
	@property validateKeyStrokes
	@type {Boolean}
	@default false
	*/
	validateKeyStrokes:false,

	/**
	 * current pixel width of form element
	 * @property int
	 * @private
	 */
	formFieldWidth:undefined,

	ludoConfig:function (config) {
		this.parent(config);
        var keys = ['regex','regexFlags','minLength','maxLength','defaultValue','validateKeyStrokes','ucFirst','ucWords'];
        this.setConfigParams(config,keys);
	},

	ludoEvents:function () {
		this.parent();
		var el = this.getFormEl();
		if (this.validateKeyStrokes) {
			el.addEvent('keydown', this.validateKey.bind(this));
		}
		if (this.ucFirst || this.ucWords) {
			el.addEvent('keyup', this.upperCaseWords.bind(this));
		}
		this.getFormEl().addEvent('keyup', this.sendKeyEvent.bind(this));
	},

	sendKeyEvent:function(){
		/**
		 * Event fired when a key is pressed
		 * @event key
		 * @param {String} value
		 */
		this.fireEvent('key', this.els.formEl.value);
	},

	validateKey:function (e) {
		if (e.control || e.alt) {
			return undefined;
		}

		if (this.regex && e.key && e.key.length == 1) {
			var reg = new RegExp(this.regex);
			if (!reg.test(e.key)) {
				return false;
			}
		}
		return undefined;
	},
	/**
	 * Return width of form field in pixels
	 * @method getFieldWidth
	 * @return {Number} width
	 */
	getFieldWidth:function () {
		return this.formFieldWidth;
	},
	/**
	 * Focus form element
	 * @method focus
	 * @return void
	 */
	focus:function () {
		this.parent();
		this.getFormEl().focus();
	},
	/**
	 * Returns true if current value is valid
	 * A value is invalid when
	 * - required is true and trimmed length of value is 0
	 * - length of value is greater than 0 but less than this.minLength
	 * - length of value is greater than 0 but does not match this.regex (Regular expression).
	 * @method isValid
	 * @return {Boolean} valid
	 */
	isValid:function () {
		var valid = this.parent();
		if (!valid)return false;
		var val = this.getFormEl().get('value').trim();

		if (val.length == 0 && this.required) {
			return false;
		}
		if (val.length > 0 && this.minLength && val.length < this.minLength) {
			return false;
		}
		if (this.maxLength && val.length > this.maxLength) {
			return false;
		}
		if (this.regex) {
			var regEx = new RegExp(this.regex, this.regexFlags);
			return regEx.test(this.getValue());
		}
		return true;
	},

	validate:function () {
		this.parent();
		if (!this.isValid() && !this._focus) {
			this.getEl().addClass('ludo-form-el-invalid');
		}
	},
	keyUp:function (e) {
		this.parent(e);
		this.validate();
	},

	upperCaseWords:function (e) {
		if (this.ucFirst || this.ucWords) {
			if (e.control || e.alt || this.hasSelection())return;
			var val = this.getFormEl().get('value');
			if (val.length == 0) {
				return;
			}
			if (this.ucWords && val.length > 1) {
				var tokens = val.split(/\s/g);
				for (var i = 0; i < tokens.length; i++) {
					if (tokens[i].length == 1) {
						tokens[i] = tokens[i].toUpperCase();
					} else {
						tokens[i] = tokens[i].substr(0, 1).toUpperCase() + tokens[i].substr(1);
					}
				}
				this.getFormEl().set('value', tokens.join(' '));
			}
			else {
				val = val.substr(0, 1).toUpperCase() + val.substr(1);
				this.getFormEl().set('value', val);
			}
		}
	},

	hasSelection:function () {
		var start = this.getSelectionStart();
		var end = this.getSelectionEnd();
		return end > start;
	},

	getSelectionStart:function () {
		if (this.els.formEl.createTextRange) {
			var r = document.selection.createRange().duplicate();
			r.moveEnd('character', this.els.formEl.value.length);
			if (r.text == '') return this.els.formEl.value.length;
			return this.els.formEl.value.lastIndexOf(r.text);
		} else return this.els.formEl.selectionStart;
	},

	getSelectionEnd:function () {
		if (this.els.formEl.createTextRange) {
			var r = document.selection.createRange().duplicate();
			r.moveStart('character', -this.els.formEl.value.length);
			return r.text.length;
		} else return this.els.formEl.selectionEnd;
	}
});
