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
	 @type RegExp
	 @default undefined
	 @example
	 	regex:'[0-9]'
	 This will only validate numbers
	 */
	regex:undefined,

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

    /**
     * True to apply readonly attribute to element
     * @config {Boolean} readonly
     * @default false
     */
    readonly : false,

    /**
     * On focus, auto select text of input field.
     * @attribute selectOnFocus
     * @type {Boolean}
     * @default false
     */
    selectOnFocus:false,


    ludoConfig:function (config) {
		this.parent(config);
        var keys = ['selectOnFocus', 'regex','minLength','maxLength','defaultValue','validateKeyStrokes','ucFirst','ucWords','readonly'];
        this.setConfigParams(config,keys);
        if(this.regex && ludo.util.isString(this.regex)){
            var tokens = this.regex.split(/\//g);
            var flags = tokens.length > 1 ? tokens.pop() : '';
            this.regex = new RegExp(tokens.join('/'), flags);
        }
        this.applyValidatorFns(['minLength','maxLength','regex']);
    },

	ludoEvents:function () {
		this.parent();
		var el = this.getFormEl();
		if (this.ucFirst || this.ucWords) {
			this.addEvent('blur', this.upperCaseWords.bind(this));
		}
        this.addEvent('blur', this.validate.bind(this));
		if (this.validateKeyStrokes) {
			el.addEvent('keydown', this.validateKey.bind(this));
		}
        ludo.dom.addClass(el.parentNode, 'ludo-form-text-element');
		el.addEvent('keyup', this.sendKeyEvent.bind(this));

        if (this.selectOnFocus) {
            el.addEvent('focus', this.selectText.bind(this));
        }
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
		if (!e.control && !e.alt && this.regex && e.key && e.key.length == 1) {
			if (!this.regex.test(e.key)) {
				return false;
			}
		}
		return undefined;
	},
	/**
	 * Return width of input field in pixels.
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

	validate:function () {
        var valid = this.parent();
		if (!valid && !this._focus) {
			this.getEl().addClass('ludo-form-el-invalid');
		}
        return valid;
	},
	keyUp:function (e) {
		this.parent(e);
		if(this.validateKeyStrokes){
            this.validate();
        }
	},

	upperCaseWords:function () {
		if (this.ucFirst || this.ucWords) {
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

    selectText:function () {
        this.getFormEl().select();
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
