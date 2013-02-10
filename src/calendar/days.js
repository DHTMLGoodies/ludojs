/**
 * Class used to display days in a month
 * @namespace calendar
 * @class Days
 * @extends calendar.Base
 */
ludo.calendar.Days = new Class({
    Extends:ludo.calendar.Base,
    layout:{
		weight:1
	},
    date:undefined,
    colWidthFirst:16,
    colWidthRest:12,
    showWeeks:true,
    sundayFirst:false,
    overflow:'hidden',
    week:undefined,
    /**
     * selected date
     * @property object value
     */
    value:undefined,
    touchData:{
        enabled:false
    },

    ludoRendered:function () {
        this.parent();
        this.createCalendarHeader();
        this.createCalendarView();
    },
    ludoDOM:function () {
        this.parent();
        this.getBody().addClass('ludo-calendar-view');
    },
    ludoEvents:function () {
        this.parent();
        if (this.shouldUseTouchEvents()) {
            var el = this.getBody();
            el.addEvent('touchstart', this.touchStart.bind(this));
            this.getEventEl().addEvent('touchmove', this.touchMove.bind(this));
            this.getEventEl().addEvent('touchend', this.touchEnd.bind(this));
        }
    },


    touchStart:function (e) {
        this.touchData = {
            enabled:true,
            x1:e.page.x, x2:e.page.x,
            y1:e.page.y, y2:e.page.y
        };

        if(e.target.tagName.toLowerCase() == 'window'){
            return false;
        }
    },
    touchMove:function (e) {
        if (this.touchData.enabled) {
            this.touchData.x2 = e.page.x;
            this.touchData.y2 = e.page.y;

            var left = this.touchData.x2 - this.touchData.x1;
            var top = this.touchData.y2 - this.touchData.y1;

            if (Math.abs(left) > Math.abs(top)) {
                if (left > 100)left = 100;
                if (left < -100) left = -100;
                this.els.monthView.style.left = left + 'px';
                this.els.monthView.style.top = '0px';
            } else {
                if (top > 100)top = 100;
                if (top < -100) top = -100;
                this.els.monthView.style.top = top + 'px';
                this.els.monthView.style.left = '0px';
            }
            return false;
        }
    },
    touchEnd:function () {
        if (this.touchData.enabled) {
            this.touchData.enabled = false;
            var diffX = this.touchData.x2 - this.touchData.x1;
            var diffY = this.touchData.y2 - this.touchData.y1;

            var absX = Math.abs(diffX);
            var absY = Math.abs(diffY);

            if (absX > 100 || absY > 100) {
                if (absX > absY) {
                    if (diffX > 0) {
                        this.date.decrement('month', 1);
                    } else {
                        this.date.increment('month', 1);
                    }
                } else {
                    if (diffY > 0) {
                        this.date.decrement('year', 1);
                    } else {
                        this.date.increment('year', 1);
                    }
                }
                this.sendSetDateEvent();
                this.showMonth();
            }
            this.els.monthView.style.left = '0px';
            this.els.monthView.style.top = '0px';
        }

    },
    createCalendarHeader:function () {
        var el = this.els.daysHeader = new Element('div');
        ludo.dom.addClass(el, 'ludo-calendar-header');
        this.getBody().adopt(el);

        var html = ['<table cellpadding="0" cellspacing="0" border="0" width="100%">'];
        html.push(this.getColGroup().join(''));
        html.push('<tr>');
        var headers = this.getTextForHeader();
        for (var i = 0; i < headers.length; i++) {
            html.push('<td>' + headers[i] + '</td>');
        }
        html.push('</tr>');
        html.push('</table>');
        el.set('html', html.join(''));
    },

    resizeDOM:function () {
        if (!this.els.daysContainer) {
            this.resizeDOM.delay(10, this);
            return;
        }
        this.parent();
        var b = this.getBody();
        var h = this.els.daysHeader;
        var size = b.getSize();

        var height = size.y - ludo.dom.getBH(b) - ludo.dom.getPH(b);
        height -= h.getSize().y;
        height += ludo.dom.getMH(h);

        var c = this.els.daysContainer;
        height -= (ludo.dom.getMH(c) + ludo.dom.getPH(c) + ludo.dom.getBH(c));
        c.style.height = height + 'px';
    },

    getColGroup:function () {
        var html = [];
        html.push('<colgroup>');
        html.push('<col width="' + this.colWidthFirst + '%">');
        for (var i = 0; i < 7; i++) {
            html.push('<col width="' + this.colWidthRest + '%">');
        }
        html.push('</colgroup>');
        return html;
    },

    getTextForHeader:function () {
        var ret = [this.headerWeek];
        if (this.sundayFirst) {
            ret.push(this.days[this.days.length - 1]);
            ret = ret.append(this.days.slice(0, this.days.length - 1));

        } else {
            ret = ret.append(this.days);
        }
        return ret;
    },

    createCalendarView:function () {
        var el = this.els.daysContainer = new Element('div');
        ludo.dom.addClass(el, 'ludo-calendar-container-days');
        el.setStyles({
            position:'relative',
            width:'100%',
            overflow:'hidden',
            left:0,
            top:0
        });
        el.addEvent('mousemove', this.mouseOverDays.bind(this));
        el.addEvent('mouseleave', this.removeClsFromMouseOverDay.bind(this));
        this.getBody().adopt(el);
    },
    showMonth:function () {
        if (this.els.monthView) {
            this.els.monthView.dispose();
        }

        var el = this.els.monthView = new Element('div');
        el.addEvent('click', this.selectDay.bind(this));
        ludo.dom.addClass(el, 'ludo-calendar-body-days');
        el.style.height = '100%';
        this.resizeMonthView();
        el.style.position = 'absolute';

        this.els.daysContainer.adopt(el);

        var html = ['<table cellpadding="0" cellspacing="0" border="0" width="100%" style="height:100%">'];
        html.push(this.getColGroup().join(''));

        var days = this.getDaysForView();
        var cls = '';

        var selectedDay = 0;
        if (this.isDisplayingMonthForCurrentValue()) {
            selectedDay = this.value.get('date');
        }
        var today = 0;
        if (this.isDisplayingTodaysMonth()) {
            today = new Date().get('date');
        }
        var thisMonthStarted = false;
        var nextMonthStarted = false;
        for (var i = 0; i < days.length; i++) {
            cls = '';
            if (i % 8 == 0) {
                if (i)html.push('</tr>');
                html.push('<tr>');
                cls = 'calendar-week';
            } else {
                if (days[i] == 1 && thisMonthStarted)nextMonthStarted = true;
                if (days[i] == 1)thisMonthStarted = true;
                cls = 'calendar-day';
                if (!thisMonthStarted || nextMonthStarted) {
                    cls = cls + ' calendar-day-inactive';
                } else {
                    if (this.sundayFirst && (i - 1) % 8 == 0) {
                        cls = cls + ' calendar-sunday';
                    }
                    if (!this.sundayFirst && (i + 1) % 8 == 0) {
                        cls = cls + ' calendar-sunday';
                    }
                    if (days[i] == selectedDay) {
                        cls = cls + ' calendar-day-selected';
                    }
                    if (days[i] == today) {
                        cls = cls + ' calendar-day-today';
                    }
                    cls = cls + ' calendar-day-' + days[i];
                }
            }

            html.push('<td');
            html.push(' class="' + cls + '"');
            html.push('>' + days[i] + '</td>')
        }

        html.push('</table>');
        el.set('html', html.join(''));
        this.resizeMonthView.delay(20, this);

    },

    mouseOverDays:function (e) {
        var el = e.target;
        this.removeClsFromMouseOverDay();
        if (!el.hasClass('calendar-day') || el.hasClass('calendar-day-inactive')) {
            return;
        }
        ludo.dom.addClass(el, 'calendar-day-mouse-over');
        this.els.mouseOverDay = el;
    },

    removeClsFromMouseOverDay:function () {
        if (this.els.mouseOverDay) {
            this.els.mouseOverDay.removeClass('calendar-day-mouse-over');
            this.els.mouseOverDay = undefined;
        }
    },

    isDisplayingMonthForCurrentValue:function () {
        if (!this.value) {
            return;
        }
        return this.value.get('month') == this.date.get('month') && this.value.get('year') == this.date.get('year');
    },
    isDisplayingTodaysMonth:function () {
        var today = new Date();
        return today.get('month') == this.date.get('month') && today.get('year') == this.date.get('year');
    },
    resizeMonthView:function () {
        this.els.monthView.style.width = '100%';
    },

    getDaysForView:function () {
        var ret = [];
        var thisMonth = this.date.clone();
        thisMonth.setDate('1');

        var lastMonth = thisMonth.clone().decrement('day', 1);
        var daysInMonth = thisMonth.getLastDayOfMonth();

        var dayOfWeek = thisMonth.getUTCDay();

        if (this.sundayFirst) {
            dayOfWeek++;
            if (dayOfWeek > 6)dayOfWeek = 0;
        }
        var i;
        if (dayOfWeek > 0 || daysInMonth < 31) {
            this.setStartWeek(lastMonth.get('week'));
            var daysInLastMonth = lastMonth.getLastDayOfMonth();
            var count = dayOfWeek || 7;
            ret.push(this.getNextWeek());
            for (i = count - 1; i > 0; i--) {
                ret.push(daysInLastMonth - i);
            }
            if (ret.length % 8 == 0) {
                ret.push(this.getNextWeek());
            }
        } else {
            this.setStartWeek(thisMonth.get('week'));
            ret.push(this.getNextWeek());
        }

        for (i = 1; i <= daysInMonth; i++) {
            ret.push(i);
            if (ret.length % 8 == 0) {
                ret.push(this.getNextWeek());
            }
        }
        var len = ret.length;
        for (i = ret.length; i < 48; i++) {

            if (ret.length < 48) {
                if (ret.length % 8 == 0) {
                    ret.push(this.getNextWeek());
                }
                ret.push(i - len + 1);
            }
        }
        return ret;
    },

    selectDay:function (e) {
        var el = e.target;
        if (!el.hasClass('calendar-day')) {
            el = el.getParent('.calendar-day');
            if (!el)return;
        }
        if (el.hasClass('calendar-day-inactive')) {
            return;
        }
        this.removeClsFromSelectedDay();

        ludo.dom.addClass(el, 'calendar-day-selected');
        this.value = this.date.clone();
        this.value.set('date', el.get('html'));
        this.fireEvent('change', [this.value, this]);
    },

    removeClsFromSelectedDay:function () {
        if (this.els.monthView && this.isDisplayingMonthForCurrentValue()) {
            var el = this.els.monthView.getElement('.calendar-day-' + this.value.get('date'));
            if (el)el.removeClass('calendar-day-selected');
        }
    },

    addClsForSelectedDay:function () {
        if (this.els.monthView && this.isDisplayingMonthForCurrentValue()) {
            var el = this.els.monthView.getElement('.calendar-day-' + this.value.get('date'));
            if (el)ludo.dom.addClass(el, 'calendar-day-selected');
        }
    },

    setStartWeek:function (week) {
        this.week = week;
    },

    getNextWeek:function () {
        var ret = this.week;
        this.week++;
        if (this.week > 50 && this.date.get('month') == 0) {
            this.week = 1;
        } else if (this.week > 53) {
            this.week = 1;
        }
        return ret;
    },
    /**
     * Set currently viewed month
	 * @method setDate
     * @param {Object} date
	 * @return void
     */
    setDate:function (date) {
        this.date = date;
        this.showMonth();
    },
    /**
     * Set selected date
	 * @method setValue
     * @param Date
     */
    setValue:function (date) {
        this.removeClsFromSelectedDay();
        this.value = date.clone();
        this.addClsForSelectedDay();
    }
});