/**
* Class used to select month and year for a calendar.
* @namespace ludo.calendar
* @class ludo.calendar.MonthYearSelector
* @augments ludo.calendar.Selector
* @fires ludo.calendar.MonthYearSelector#setDate - Arguments Date and ludo.View(the view firing the event)
*/
ludo.calendar.MonthYearSelector = new Class({
    Extends:ludo.calendar.Selector,
    height:25,
    minDisplayed:undefined,
    maxDisplayed:undefined,
    fx:undefined,
    date:undefined,
    calCls : 'ludo-calendar-month-year-container',

    renderOptions:function () {
        this.removeOptions();

        this.els.activeOption = undefined;
        for (var i = this.offsetOptions*-1; i <= this.offsetOptions; i++) {
            var el = this.getDomForAMonth(i);
            this.els.calendarContainer.append(el);
            this.els.options.push(el);
        }
        this.setMinAndMaxDisplayed();
    },

    setMinAndMaxDisplayed:function () {
        var d = this.date.clone();
        this.minDisplayed = d.decrement('month', this.offsetOptions);
        d = this.date.clone();
        this.maxDisplayed = d.increment('month', this.offsetOptions);
    },

    getDomForAMonth:function (monthFromCurrent) {
        var d = this.date.clone().increment('month', monthFromCurrent);
        var txt = this.months[d.get('month')];
        var el = jQuery('<div>');

        el.attr({
            'year' : d.get('year'), 'month' : d.get('month')
        });
        el.addClass('ludo-calendar-month-year');
        if (monthFromCurrent == 0) {
            el.addClass('ludo-calendar-month-year-selected');
            this.els.activeOption = el;
        }
        el.html('<span>' + txt + '</span>');
        el.on('click', this.clickMonth.bind(this));
        return el;
    },

    clickMonth:function (e) {
        var el = jQuery(e.currentTarget);
        this.setMonthAndYear(el.attr('month'), el.attr('year'));
        this.sendSetDateEvent();
    },

    setMonthAndYear:function(month, year){
        this.date.set('month', month);
        this.date.set('year', year);
        this.refreshView();
    },

    setDate:function(date){
        this.parent(date);
        this.refreshView();
    },

    refreshView:function () {
        this.addAndRemoveOptions();
        if (this.els.activeOption) {
            this.centerDom(this.els.activeOption);
            this.els.activeOption.html( this.months[this.els.activeOption.attr('month')]);
            this.els.activeOption.removeClass('ludo-calendar-month-year-selected');
        }
        this.els.activeOption = this.getNewActiveOption();
        this.populateActiveMonth();
        this.animateDomToCenter.delay(20, this, this.els.activeOption);
    },

    populateActiveMonth:function() {
        this.els.activeOption.addClass('ludo-calendar-month-year-selected');
        this.els.activeOption.html( this.months[this.date.get('month')] + ', ' + this.date.get('year'));
    },

    addAndRemoveOptions:function () {
        var min = this.date.clone().decrement('month', this.offsetOptions);
        var max = this.date.clone().increment('month', this.offsetOptions);
        if(max < this.minDisplayed || min > this.maxDisplayed){
            this.renderOptions();
        }else{
            var diff = this.date.diff(this.minDisplayed, 'month') + this.offsetOptions;
            if(diff > 0){
                this.insertMonthBefore(diff);
            }else{
                this.insertMonthAfter(diff*-1);
            }
        }
        this.setMinAndMaxDisplayed();
    },
    insertMonthBefore:function (count) {
        var els = [];
        for (var i = 0; i<count;i++) {
            var monthsFromCurrent = i - this.offsetOptions;
            var el = this.getDomForAMonth(monthsFromCurrent);
            el.insertBefore(this.els.options[0]);
            els.push(el);
            this.els.options[this.els.options.length - 1].remove();
            this.els.options.length--;
        }
        this.els.options = els.append(this.els.options);
    },
    insertMonthAfter:function (count) {
        for (var i = count; i > 0; i--) {
            var monthsFromCurrent = this.offsetOptions - i + 1;
            var el = this.getDomForAMonth(monthsFromCurrent);
            this.els.calendarContainer.append(el);
            this.els.options.push(el);
            this.els.options[i - 1].remove();
        }
        this.els.options = this.els.options.slice(count);
    },

    getNewActiveOption:function () {
        var year = this.date.get('year'), month = this.date.get('month');
        for (var i = 0; i < this.els.options.length; i++) {
            if (this.els.options[i].attr('year') == year && this.els.options[i].attr('month') == month) {
                return this.els.options[i];
            }
        }
		return undefined;
    }
});