/**
 * Base class for calendar related classes
 * @namespace calendar
 * @module calendar
 * @class Base
 */
ludo.calendar.Base = new Class({
    Extends: ludo.View,
    months : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    monthsLong:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    days:['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    headerWeek : 'Week',

    ludoConfig:function(config){
        this.parent(config);
        this.date = new Date();
        this.translate();
    },

    translate:function(){
        for(var i=0;i<this.months.length;i++){
            this.months[i] = ludo.language.get(this.months[i]);
            this.monthsLong[i] = ludo.language.get(this.monthsLong[i]);
        }
        for(i=0;i<this.days.length;i++){
            this.days[i] = ludo.language.get(this.days[i]);
        }
        this.headerWeek = ludo.language.get(this.headerWeek);
    },

    setDate:function (date) {
        this.date = date;
    },
    getDate:function(){
        return this.date;
    },

    sendSetDateEvent:function(){
        this.fireEvent('setdate', [this.date, this]);
    },

    setValue:function(){

    }
});
