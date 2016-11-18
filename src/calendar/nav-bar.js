/**
 * Displays nav-buttons for previous month and year to the left, a calendar.MonthYearSelector in the center and buttons for next month and next year to the right.
 * @namespace ludo.calendar
 * @class ludo.calendar.NavBar
 * @augments calendar.Base
 */
ludo.calendar.NavBar = new Class({
    Extends:ludo.calendar.Base,
    type:'calendar.NavBar',
    date:undefined,
    layout:{
        height: 20,
        type:'linear',
        orientation:'horizontal'
    },
    cls:'ludo-calendar-info-panel',

    children:[
        { type:'form.Button', size:'s', value:'<<', name:'previousyear', width:25},
        { type:'form.Button', size : 's', value:'<', name:'previous', width:25},
        { weight:1, name:'info', type:'calendar.MonthYearSelector' },
        { type:'form.Button', size : 's', name:'next', value:'>', width:25 },
        { type:'form.Button', size : 's', name:'nextyear', value:'>>', width:25 }
    ],

    __rendered:function () {
        this.parent();
        this.child['previous'].addEvent('click', this.goToPreviousMonth.bind(this));
        this.child['next'].addEvent('click', this.goToNextMonth.bind(this));
        this.child['nextyear'].addEvent('click', this.goToNextYear.bind(this));
        this.child['previousyear'].addEvent('click', this.goToPreviousYear.bind(this));
    },
    goToPreviousMonth:function () {
        this.setDate(this.date.decrement('month', 1));
        this.sendSetDateEvent();
    },
    goToNextMonth:function () {
        this.setDate(this.date.increment('month', 1));
        this.sendSetDateEvent();
    },

    goToPreviousYear:function () {
        this.setDate(this.date.decrement('year', 1));
        this.sendSetDateEvent();
    },

    goToNextYear:function () {
        this.setDate(this.date.increment('year', 1));
        this.sendSetDateEvent();
    },


    setDate:function (date) {
        this.date = date;
        this.showDate();
        this.child['info'].setDate(date);
    },

    sendDate:function (date) {
        this.date = date;
        this.sendSetDateEvent();
    },

    showDate:function () {
        this.child['info'].addEvent('setdate', this.sendDate.bind(this));
    }
});