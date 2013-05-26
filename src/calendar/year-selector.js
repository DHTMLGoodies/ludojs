/**
 * Class used to display years in a calendar
 * @namespace calendar
 * @class YearSelector
 * @extends calendar.Selector
 */
ludo.calendar.YearSelector = new Class({
    Extends:ludo.calendar.Selector,
    minDisplayedYear:undefined,
    maxDisplayedYear:undefined,

    resizeDOM:function () {
        this.parent();
        if (this.els.activeOption) {
            this.animateDomToCenter(this.els.activeOption);
        }
    },

    renderOptions:function () {
        this.removeOptions();
        this.els.activeOption = undefined;
        var year = this.date.get('year');
        for (var i = year - this.offsetOptions; i < year + this.offsetOptions; i++) {
            var el = this.getDomForAYear(i);
            this.els.calendarContainer.adopt(el);
            this.els.options.push(el);
        }
        this.setMinAndMaxDisplayed();
    },

    setMinAndMaxDisplayed:function () {
        this.minDisplayedYear = this.date.clone().decrement('year', this.offsetOptions).get('year');
        this.maxDisplayedYear = this.date.clone().increment('year', this.offsetOptions).get('year');
    },

    getDomForAYear:function (year) {
        var el = new Element('div');
        el.set('html', '<span>' + year + '</span>');
        el.setProperty('year', year);
        ludo.dom.addClass(el, 'ludo-calendar-year');
        if (year == this.date.get('year')) {
            ludo.dom.addClass(el, 'ludo-calendar-year-selected');
            this.els.activeOption = el;
        }
        el.addEvent('click', this.clickYear.bind(this));
        return el;
    },

    clickYear:function (e) {
        var el = e.target;
        if (!el.hasClass('ludo-calendar-year'))el = el.getParent('.ludo-calendar-year');
        this.date.set('year', el.getProperty('year'));
        this.setDate(this.date);
        this.sendSetDateEvent();
    },

    setDate:function (date) {
        this.date = date;
        this.addAndRemoveOptions();
        if (this.els.activeOption) {
            this.centerDom(this.els.activeOption);
            this.els.activeOption.removeClass('ludo-calendar-year-selected');
        }
        this.els.activeOption = this.getDomElForCurrentYear();
        if (this.els.activeOption) {
            ludo.dom.addClass(this.els.activeOption, 'ludo-calendar-year-selected');
            this.animateDomToCenter.delay(20, this, this.els.activeOption);
        }
    },

    addAndRemoveOptions:function () {
        var year = this.date.get('year');
        var median = Math.round((this.maxDisplayedYear + this.minDisplayedYear) / 2);
        if (year < this.minDisplayedYear || year > this.maxDisplayedYear) {
            this.renderOptions();
        }
        else if (year < median) {
            this.insertYearsBefore(median - year);
        } else {
            this.insertYearsAfter(year - median);
        }

        this.setMinAndMaxDisplayed();
    },
    insertYearsBefore:function (count) {
        var els = [];
        for (var i = count; i > 0; i--) {
            var year = this.minDisplayedYear - i;
            var el = this.getDomForAYear(year);
            el.inject(this.els.options[0], 'before');
            els.push(el);
            this.els.options[this.els.options.length - 1].dispose();
            this.els.options.length--;
        }
        this.els.options = els.append(this.els.options);
    },
    insertYearsAfter:function (count) {
        for (var i = 1; i <= count; i++) {
            var year = this.maxDisplayedYear + i;
            var el = this.getDomForAYear(year);
            this.els.calendarContainer.adopt(el);
            this.els.options.push(el);
            this.els.options[i - 1].dispose();
        }
        this.els.options = this.els.options.slice(count);
    },

    getDomElForCurrentYear:function () {
        var year = this.date.get('year');
        var o = this.els.options;
        for (var i = 0; i < o.length; i++) {
            if (o[i].getProperty('year') == year) {
                return o[i];
            }
        }
		return undefined;
    }
});