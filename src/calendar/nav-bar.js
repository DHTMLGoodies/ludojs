/**
 * Displays nav-buttons for previous month and year to the left, a calendar.MonthYearSelector in the center and buttons for next month and next year to the right.
 * @namespace calendar
 * @class NavBar
 * @extends calendar.Base
 */
ludo.calendar.NavBar = new Class({
    Extends:ludo.calendar.Base,
    type:'calendar.NavBar',
    height:20,
    date:undefined,
    layout:{ type:'linear', orientation:'horizontal'},
    cls:'ludo-calendar-info-panel',

    children:[
        { type:'form.TinyButton', value:'<<', name:'previousyear', width:25},
        { type:'form.TinyButton', value:'<', name:'previous', width:25},
        { weight:1, name:'info', type:'calendar.MonthYearSelector' },
        { type:'form.TinyButton', name:'next', value:'>', width:25 },
        { type:'form.TinyButton', name:'nextyear', value:'>>', width:25 }
    ],

    ludoRendered:function () {
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