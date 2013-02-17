/**
 * @namespace calendar
 * @class Calendar
 * @extends calendar.Base
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

    ludoConfig:function (config) {
        this.parent(config);
        if (config.inputFormat !== undefined)this.inputFormat = config.inputFormat;
        if(config.value !== undefined)config.date = config.value;
        if (config.date !== undefined) {
            this.date = Date.parse(config.date);
        } else {
            this.date = new Date();
        }
        this.value = this.date;
        if (config.minDate !== undefined)this.minDate = config.minDate;
        if (config.maxDate !== undefined)this.maxDate = config.maxDate;

        if (this.minDate)this.minDate = Date.parse(this.minDate);
        if (this.maxDate)this.maxDate = Date.parse(this.maxDate);
    },

    /**
     * Set year (4 digits)
     * @method setYear
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
     * @method getDate
     * @return {Object} selected date
     */
    getDate : function(){
        return this.value;
    },
    /**
     * Returns selected date
     * @method getValue
     * @return {String} selected date
     */
    getValue:function(){
        return this.value.format(this.inputFormat);
    },
    /**
     * Set new current date
	 * @method setValue
     * @param {Date} date
     */
    setValue:function(date){
        this.value = date;
        this.fireEvent('change', [this.getValue(), this]);
    },

    /**
     * Set current month
	 * @method setMonth
     * @param {Number} month (1-12)
	 * @return void
     */
    setMonth:function (month) {
        month = month - 1;
        this.date.set('month', month);
        this.setDate(this.date);
    },

    ludoRendered:function () {
        this.parent();
        for(var i=0;i<this.children.length;i++){
            var c = this.children[i];
            c.setDate(this.date);
            c.setValue(this.date);
            c.addEvent('setdate', this.setDate.bind(this));
            c.addEvent('change', this.setValue.bind(this));
        }
		this.getLayoutManager().resize();
    }
});