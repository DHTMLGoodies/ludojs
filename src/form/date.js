/**
 * Date picker
 * @namespace ludo.form
 * @class ludo.form.Date
 * @param {Object} config
 * @param {String} inputFormat internal date format, and date format sent on form submission. default: Y-m-d
 * @param {String} displayFormat date format shown to the viewer, default: Y-m-d
 * @augments ludo.form.Combo
 */
ludo.form.Date = new Class({
    Extends: ludo.form.Combo,
    children: [{
        type: 'calendar.Calendar'
    }],

    displayFormat: 'Y-m-d',
    inputFormat: 'Y-m-d',

    childLayout:{
        width: 250, height: 250
    },

    __construct: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['displayFormat', 'inputFormat']);

        this.displayFormat = this.displayFormat.replace(/([a-z])/gi, '%$1');
        this.inputFormat = this.inputFormat.replace(/([a-z])/gi, '%$1');
        this.value = this.value ? ludo.util.parseDate(this.value, this.inputFormat) : undefined;
        this.initialValue = this.constructorValue = this.value;
    },


    __rendered: function () {
        this.parent();
        this.setFormElValue(this.value);
    },

    addChild: function (child) {

        child.value = this.value || new Date();

        this.parent(child);
        this.children[0].addEvent('change', function (date) {
            this._set(ludo.util.parseDate(date, this.inputFormat));
            this.blur();
        }.bind(this));
    },
    ludoEvents: function () {
        this.parent();
        this.addEvent('showCombo', function () {
            this.children[0].setDate(this.value ? ludo.util.parseDate(this.value, this.displayFormat) : new Date());
        }.bind(this));

    },

    setValue: function (value) {
        console.warn("Use of deprecated setValue");
        console.trace();
        value = value ? ludo.util.parseDate(value, this.displayFormat) : value;
        if (value && value.getYear && isNaN(value.getYear()))value = undefined;
        this.parent(value);
    },
    getValue: function () {
        console.warn("Use of deprecated getValue");
        console.trace();
        return this.value ? ludo.util.parseDate(this.value, this.displayFormat).format(this.inputFormat) : undefined;
    },

    val: function (value) {
        if (arguments.length == 0) {
            return this.value ? ludo.util.parseDate(this.value, this.displayFormat).format(this.inputFormat) : undefined;
        }
        this._set(value);
    },

    _set: function (value) {
        value = value ? ludo.util.parseDate(value, this.displayFormat) : value;
        if (value && value.getYear && isNaN(value.getYear()))value = undefined;
        this.parent(value);
    },

    setFormElValue: function (value) {
        if (this.els.formEl && this.els.formEl.val() !== value) {
            value = value ? ludo.util.isString(value) ? value : value.format(this.displayFormat) : '';
            this.els.formEl.val(value);
        }
        this.children[0].hide();
    }
});