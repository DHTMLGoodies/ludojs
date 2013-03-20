/**
 * Display "Today" button inside a calendar. When clicked, date of calendar will be set to today's date.
 * @namespace calendar
 * @class Today
 * @extends calendar.Base
 */
ludo.calendar.Today = new Class({
    Extends:ludo.calendar.Base,
    layout : {
        type:'relative'
    },
    height:25,
    overflow:'hidden',
    css:{
        'margin-top' : 2
    },
    children : [{ name:'today', type:'form.Button', value : 'Today', layout: { centerInParent:true}}],

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