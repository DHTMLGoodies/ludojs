/**
 * Display "Today" button inside a calendar. When clicked, date of calendar will be set to today's date.
 * @namespace calendar
 * @class Today
 * @augments calendar.Base
 */
ludo.calendar.Today = new Class({
    Extends:ludo.calendar.Base,
    layout : {
        type:'relative'
    },
    height:30,
    overflow:'hidden',
    css:{
        'margin-top' : 2
    },

    __rendered:function(){
        this.parent();
        this.child['today'].addEvent('click', this.setToday.bind(this));
    },

    getClassChildren:function(){
        return [{ name:'today', type:'form.Button', value : ludo.language.get('Today'), layout: { centerInParent:true}}];
    },

    setDate:function(){
        // this.date is always today's date which is set in __construct
    },

    setToday:function(){
        this.date = new Date();
        this.sendSetDateEvent();
    }
});