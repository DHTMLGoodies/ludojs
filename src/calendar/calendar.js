/**
 * @namespace calendar
 * @class ludo.calendar.Calendar
 * @augments ludo.calendar.Base
 * @param {Object} config
 * @param {String} config.inputFormat Date format saved as value(example: d-m-Y). Default is Y-m-d.
 * @param {String|Date} config.value Initial date.
 * @param {String|Date} config.date Alias to config.value.
 * @param {String|Date} config.minDate Optional minimum selectable date
 * @param {String|Date} config.maxDate Optional maximum selectable date
 * @param {String} config.inputFormat Internal format, default: 'Y-m-d'
 * @fires ludo.calendar.Calendar#setDate - Arguments Date and ludo.View(the view firing the event)
 */
ludo.calendar.Calendar = new Class({
    Extends: ludo.calendar.Base,
    layout: {
        type: 'linear',
        orientation: 'vertical'
    },

    value: undefined,

    inputFormat: 'Y-m-d',
    date: undefined,
    minDate: undefined,
    maxDate: undefined,

    __construct: function (config) {
        this.parent(config);
        this.__params(config, ['inputFormat', 'value', 'minDate', 'maxDate', 'date', 'sundayFirst']);


        this.date = this.date || this.value;
        this.date = this.date ? Date.parse(this.date) : new Date();

        this.value = this.date;

        if (this.minDate)this.minDate = Date.parse(this.minDate);
        if (this.maxDate)this.maxDate = Date.parse(this.maxDate);
    },

    /**
     * Set year (4 digits)
     * @function setYear
     * @param {Number} year
     * @memberof ludo.calendar.Calendar.prototype
     *
     */
    setYear: function (year) {
        this.date.set('year', year);
        this.setDate(this.date);
    },

    setDate: function (date, sentByComponent) {
        this.date = date;
        for (var i = 0; i < this.children.length; i++) {
            if (!sentByComponent || this.children[i].id !== sentByComponent.id) {
                this.children[i].setDate(this.date);
            }
        }
    },

    /**
     * Returns selected date as Date object
     * @function getDate
     * @return {Object} selected date
     * @memberof ludo.calendar.Calendar.prototype
     */
    getDate: function () {
        return this.value;
    },

    /**
     * Set or get date
     * @function val
     * @param {String|Date} date
     * @returns {*}
     * @memberof ludo.calendar.Calendar.prototype
     */
    val: function (date, sentByComponent) {
        if (arguments.length == 0) {
            return this.value.format(this.inputFormat);
        }
        this.value = Date.parse(date);
        this.fireEvent('change', [this.value, this]);
    },

    getValue: function () {
        console.warn("Use of deprecated calendar.getValue");
        console.trace();
        return this.value.format(this.inputFormat);
    },
    /*
     * Set new current date
     * @function setValue
     * @param {Date} date
     */
    setValue: function (date) {
        console.warn("Use of deprecated calendar.setValue");
        console.trace();
        this.value = Date.parse(date);
        this.fireEvent('change', [this.value, this]);
    },

    /**
     * Set current month
     * @function setMonth
     * @param {Number} month (1-12)
     * @memberof ludo.calendar.Calendar.prototype
     * @return void
     */
    setMonth: function (month) {
        month = month - 1;
        this.date.set('month', month);
        this.setDate(this.date);
    },

    __rendered: function () {
        this.parent();
        for (var i = 0; i < this.children.length; i++) {
            var c = this.children[i];
            c.setDate(this.date);
            c.val(this.date);
            c.addEvent('setdate', this.setDate.bind(this));
            c.addEvent('change', this.val.bind(this));
        }
        this.getLayout().resize();
    },

    __children: function () {
        return [
            {type: 'calendar.NavBar', name: 'info'},
            {type: 'calendar.Days', name: 'days', sundayFirst: this.sundayFirst},
            {type: 'calendar.Today', name: 'today'}
        ]
    }
});