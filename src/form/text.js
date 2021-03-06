/**
 * Text Input View
 * This class inherits from <a href="ludo.form.Element.html">ludo.form.Element</a>.
 * @module form
 * @namespace ludo.form
 * @class ludo.form.Text
 * @description Form input text
 *  @param {Object} config Configuration when creating the View. These properties and properties from superclass is available
 * @param {String} config.name Name of element. A call to parentView.getForm().values() will return &lt;name> : &lt;value>.
 * @param {String} config.placeholder Placeholder attribute for the input. Displayed when value is empty. (Default:undefined)
 * @param {Number} config.minLength Defines required min length of value(count characters). (Default:undefined)
 * @param {Number} config.maxLength Defines required max length of value(count characters)
 * @param {Boolean} config.ucFirst True to automatically Uppercase first letter. (Default: false)
 * @param {RegExp} config.regex Regular expression used for validation, example: regex: /$[0-9]{3}^/ to require 3 digits. (Default:undefined)
 * @param {Boolean} config.readonly True to make this form field read only. (Default: false)
 * @param {Boolean} config.selectOnFocus Automatically make the text selected on focus. Default: false
 * @param {Boolean} config.validateKeyStrokes True to run validation after every key stroke(Default: false)
 * @param {Boolean} config.autoComplete False to disable browsers auto complete(default : true)
 * @param {Function} config.validator Optional validator function for the value.
 * @fires ludo.form.Text#key Fired when a key is pressed. Argument: {String} key pressed.
 * @augments ludo.form.Element
 *
 */
ludo.form.Text = new Class({
    Extends: ludo.form.Element,
    type: 'form.Text',
    labelWidth: 100,
    defaultValue: '',
    placeholder:'',

    maxLength: undefined,

    minLength: undefined,
    ucFirst: false,
    ucWords: false,

    inputType: 'text',
    inputTag: 'input',
    regex: undefined,
    validateKeyStrokes: false,
    formFieldWidth: undefined,
    readonly: false,
    selectOnFocus: false,
    autoComplete:true,

    __construct: function (config) {
        this.parent(config);
        
        var keys = ['placeholder', 'selectOnFocus', 'regex', 'minLength', 'maxLength', 'defaultValue', 'autoComplete', 'validateKeyStrokes', 'ucFirst', 'ucWords', 'readonly'];
        this.__params(config, keys);
        if (this.regex && ludo.util.isString(this.regex)) {
            var tokens = this.regex.split(/\//g);
            var flags = tokens.length > 1 ? tokens.pop() : '';
            this.regex = new RegExp(tokens.join('/'), flags);
        }
        this.applyValidatorFns(['minLength', 'maxLength', 'regex']);

        if(this.layout.height == undefined){
            this.layout.height = 'wrap';
        }

    },

    ludoDOM:function(){
        this.parent();
        if(this.placeholder){
            this.getFormEl().attr('placeholder', this.placeholder);
        }

        if(!this.autoComplete){
            this.getFormEl().attr('x-autocompletetype', String.uniqueID());
            this.getFormEl().attr('autocomplete', 'false');
        }
    },

    ludoEvents: function () {
        this.parent();
        var el = this.getFormEl();
        if (this.ucFirst || this.ucWords) {
            this.addEvent('blur', this.upperCaseWords.bind(this));
        }
        this.addEvent('blur', this.validate.bind(this));
        if (this.validateKeyStrokes) {
            el.on('keydown', this.validateKey.bind(this));
        }
        el.parent().addClass('ludo-form-text-element');
        el.on('keyup', this.sendKeyEvent.bind(this));

        if (this.selectOnFocus) {
            el.on('focus', this.selectText.bind(this));
        }
    },

    sendKeyEvent: function () {
        this.fireEvent('key', this.els.formEl.val());
    },

    validateKey: function (e) {
        if (!e.control && !e.alt && this.regex && e.key && e.key.length == 1) {
            if (!this.regex.test(e.key)) {
                return false;
            }
        }
        return undefined;
    },

    getFieldWidth: function () {
        return this.formFieldWidth;
    },
    /**
     * Focus form element
     * @function focus
     * @return void
     * @memberof ludo.form.Text.prototype
     */
    focus: function () {
        this.parent();
        if (!this.getFormEl().is(":focus")) {
            this.getFormEl().focus();
        }
    },

    validate: function () {
        var valid = this.parent();
        if (!valid && !this._focus) {
            this.getEl().addClass('ludo-form-el-invalid');
        }
        return valid;
    },
    keyUp: function (e) {
        this.parent(e);
        if (this.validateKeyStrokes) {
            this.validate();
        }
    },

    upperCaseWords: function () {
        if (this.ucFirst || this.ucWords) {
            var val = this.getValueOfFormEl();
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
                this.getFormEl().val(tokens.join(' '));
            }
            else {
                val = val.substr(0, 1).toUpperCase() + val.substr(1);
                this.getFormEl().val(val);
            }
        }
    },

    hasSelection: function () {
        var start = this.getSelectionStart();
        var end = this.getSelectionEnd();
        return end > start;
    },

    select:function(){
        this.getFormEl().select();
    },

    selectText: function () {
        this.select();
    },

    getSelectionStart: function () {
        if (this.els.formEl.createTextRange) {
            var r = document.selection.createRange().duplicate();
            r.moveEnd('character', this.els.formEl.val().length);
            if (r.text == '') return this.els.formEl.val().length;
            return this.els.formEl.val().lastIndexOf(r.text);
        } else return this.els.formEl.selectionStart;
    },

    getSelectionEnd: function () {
        if (this.els.formEl.createTextRange) {
            var r = document.selection.createRange().duplicate();
            r.moveStart('character', -this.els.formEl.val().length);
            return r.text.length;
        } else return this.els.formEl.selectionEnd;
    }
});
