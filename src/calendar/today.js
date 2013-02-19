/**
 * Display "Today" button inside a calendar. When clicked, date of calendar will be set to today's date.
 * @namespace calendar
 * @class Today
 * @extends calendar.Base
 */
ludo.calendar.Today = new Class({
    Extends:ludo.calendar.Base,
    layout : 'cols',
    height:25,
    css:{
        'margin-top' : 2
    },
    children : [{ weight:1 }, { name:'today', type:'form.Button', value : 'Today'}, { weight:1 }],

    ludoRendered:function(){
        this.parent();
        this.child['today'].addEvent('click', this.setToday.bind(this));
    },

    setDate:function(){
        // this.date is always today's date which is set in ludoConfig
    },

    setToday:function(){
        this.date = new Date();
        this.sendSetDateEvent();
    }

});