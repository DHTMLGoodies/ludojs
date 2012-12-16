/**
* Class used to select month and year for a calendar.
* @namespace calendar
* @class MonthYearSelector
* @extends calendar.Selector
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
            this.els.calendarContainer.adopt(el);
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
        var el = new Element('div');

        el.setProperties({
            'year' : d.get('year'), 'month' : d.get('month')
        });
        ludo.dom.addClass(el, 'ludo-calendar-month-year');
        if (monthFromCurrent == 0) {
            ludo.dom.addClass(el, 'ludo-calendar-month-year-selected');
            this.els.activeOption = el;
        }
        el.set('html', '<span>' + txt + '</span>');
        el.addEvent('click', this.clickMonth.bind(this));
        return el;
    },

    clickMonth:function (e) {
        var el = e.target;
        if (!el.hasClass('ludo-calendar-month-year'))el = el.getParent('.ludo-calendar-month-year');

        this.setMonthAndYear(el.getProperty('month'), el.getProperty('year'));
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
            this.els.activeOption.set('html', this.months[this.els.activeOption.getProperty('month')]);
            this.els.activeOption.removeClass('ludo-calendar-month-year-selected');
        }
        this.els.activeOption = this.getNewActiveOption();
        this.populateActiveMonth();
        this.animateDomToCenter.delay(20, this, this.els.activeOption);
    },

    populateActiveMonth:function() {
        ludo.dom.addClass(this.els.activeOption, 'ludo-calendar-month-year-selected');
        this.els.activeOption.set('html', this.months[this.date.get('month')] + ', ' + this.date.get('year'));

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
            el.inject(this.els.options[0], 'before');
            els.push(el);
            this.els.options[this.els.options.length - 1].dispose();
            this.els.options.length--;
        }
        this.els.options = els.append(this.els.options);
    },
    insertMonthAfter:function (count) {
        for (var i = count; i > 0; i--) {
            var monthsFromCurrent = this.offsetOptions - i + 1;
            var el = this.getDomForAMonth(monthsFromCurrent);
            this.els.calendarContainer.adopt(el);
            this.els.options.push(el);
            this.els.options[i - 1].dispose();
        }
        this.els.options = this.els.options.slice(count);
    },

    getNewActiveOption:function () {
        var year = this.date.get('year'), month = this.date.get('month');
        for (var i = 0; i < this.els.options.length; i++) {
            if (this.els.options[i].getProperty('year') == year && this.els.options[i].getProperty('month') == month) {
                return this.els.options[i];
            }
        }
    }
});