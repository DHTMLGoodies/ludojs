/**
 * @namespace calendar
 * @class ludo.calendar.Calendar
 * @augments ludo.calendar.Base
 * @type {Class}
 */
ludo.calendar.Calendar = new Class({
    Extends:ludo.calendar.Base,
    layout:{
		type:'linear',
		orientation:'vertical'
	},

    value:undefined,
    children:[
        { type:'calendar.NavBar', name:'info'},
        // { type:'calendar.MonthYearSelector', name:'monthyear'},
        { type:'calendar.Days', name:'days'},
        // { type:'calendar.YearSelector', name:'year'},
        { type:'calendar.Today', name:'today'}
    ],
    /**
     * @attribute inputFormat
     * @type String
     * @default Y-m-d
     */
    inputFormat:'Y-m-d',

    /**
     * Initial date, example: '2012-02-28', "date" is alias to "value"
     * @attribute date
     * @type String
     */
    date:undefined,

    /**
     * minimum valid date, eg. '2011-01-01'
     * @attribute {String} minDate
     */
    minDate:undefined,
    /**
     * maximum valid date, eg. '2013-01-01'
     * @attribute maxDate
     * @type String
     */
    maxDate:undefined,

    __construct:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['inputFormat','value','minDate','maxDate','date']);
        this.date = this.date || this.value;
        this.date = this.date ?  Date.parse(this.date) : new Date();

        this.value = this.date;

        if (this.minDate)this.minDate = Date.parse(this.minDate);
        if (this.maxDate)this.maxDate = Date.parse(this.maxDate);
    },

    /**
     * Set year (4 digits)
     * @function setYear
     * @param {Number} year
     *
     */
    setYear:function (year) {
        this.date.set('year', year);
        this.setDate(this.date);
    },

    setDate:function(date, sentByComponent){
        this.date = date;
        for(var i=0;i<this.children.length;i++){
            if(!sentByComponent || this.children[i].id!==sentByComponent.id){
                this.children[i].setDate(this.date);
            }
        }
    },

    /**
     * Returns selected date as Date object
     * @function getDate
     * @return {Object} selected date
     */
    getDate : function(){
        return this.value;
    },

    val:function(date, sentByComponent){
        if(arguments.length == 0){
            return this.value.format(this.inputFormat);
        }
        this.value = Date.parse(date);
        this.fireEvent('change', [this.value, this]);
    },
    /**
     * Returns selected date
     * @function getValue
     * @return {String} selected date
     */
    getValue:function(){
        console.warn("Use of deprecated calendar.getValue");
        console.trace();
        return this.value.format(this.inputFormat);
    },
    /**
     * Set new current date
	 * @function setValue
     * @param {Date} date
     */
    setValue:function(date){
        console.warn("Use of deprecated calendar.setValue");
        console.trace();
        this.value = Date.parse(date);
        this.fireEvent('change', [this.value, this]);
    },

    /**
     * Set current month
	 * @function setMonth
     * @param {Number} month (1-12)
	 * @return void
     */
    setMonth:function (month) {
        month = month - 1;
        this.date.set('month', month);
        this.setDate(this.date);
    },

    __rendered:function () {
        this.parent();
        for(var i=0;i<this.children.length;i++){
            var c = this.children[i];
            c.setDate(this.date);
            c.val(this.date);
            c.addEvent('setdate', this.setDate.bind(this));
            c.addEvent('change', this.val.bind(this));
        }
		this.getLayout().resize();
    }
});