
/**
 * A View displaying days in a month. It's one of the child views of ludo.calendar.Calendar.
 * @namespace calendar
 * @class ludo.calendar.Days
 * @param {Object} config
 * @param {String|Date} value Selected date
 * @fires ludo.calendar.Days#setDate - Arguments Date and ludo.View(the view firing the event)
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

    value:undefined,
    touch:{
        enabled:false
    },

    __rendered:function () {
        this.parent();
        this.createCalendarHeader();
        this.createCalendarView();
    },
    ludoDOM:function () {
        this.parent();
        this.$b().addClass('ludo-calendar-view');
    },
    ludoEvents:function () {
        this.parent();
        if (ludo.util.isTabletOrMobile()) {
            var el = this.$b();
            el.on('touchstart', this.touchStart.bind(this));
            this.getEventEl().on('touchmove', this.touchMove.bind(this));
            this.getEventEl().on('touchend', this.touchEnd.bind(this));
        }
    },

    touchStart:function (e) {
        var p = ludo.util.pageXY(e);
        this.touch = {
            enabled:true,
            x1:p.pageX, x2:p.pageX,
            y1:p.pageY, y2:p.pageY
        };

        if (e.target.tagName.toLowerCase() == 'window') {
            return false;
        }
        return undefined;
    },
    touchMove:function (e) {
        if (this.touch.enabled) {
            var p = ludo.util.pageXY(e);

            this.touch.x2 = p.pageX;
            this.touch.y2 = p.pageY;

            var left = this.touch.x2 - this.touch.x1;
            var top = this.touch.y2 - this.touch.y1;

            if (Math.abs(left) > Math.abs(top)) {
                if (left > 100)left = 100;
                if (left < -100) left = -100;
                this.els.monthView.css('left',  left + 'px');
                this.els.monthView.css('top',  '0px');
            } else {
                if (top > 100)top = 100;
                if (top < -100) top = -100;
                this.els.monthView.css('top',  top + 'px');
                this.els.monthView.css('left',  '0px');
            }
            return false;
        }
        return undefined;
    },
    touchEnd:function () {
        if (this.touch.enabled) {
            this.touch.enabled = false;
            var diffX = this.touch.x2 - this.touch.x1;
            var diffY = this.touch.y2 - this.touch.y1;

            var absX = Math.abs(diffX);
            var absY = Math.abs(diffY);

  
            if (absX > 100 || absY > 100) {
                if (absX > absY) {
                    this.date[diffX > 0 ? 'decrement' : 'increment']('month', 1);
                } else {
                    this.date[diffY > 0 ? 'decrement' : 'increment']('year', 1);
                }
                this.sendSetDateEvent();
                this.showMonth();
            }
            this.els.monthView.css('left',  '0');
            this.els.monthView.css('top',  '0');
        }

    },
    createCalendarHeader:function () {
        var el = this.els.daysHeader = jQuery('<div>');
        el.addClass('ludo-calendar-header');
        this.$b().append(el);

        var html = ['<table ', 'cellpadding="0" cellspacing="0" border="0" width="100%">'];
        html.push(this.getColGroup().join(''));
        html.push('<tr>');
        var headers = this.getTextForHeader();
        for (var i = 0; i < headers.length; i++) {
            html.push('<td>' + headers[i] + '</td>');
        }
        html.push('</tr>');
        html.push('</table>');
        el.html( html.join(''));
    },

    resizeDOM:function () {
        if (!this.els.daysContainer) {
            this.resizeDOM.delay(10, this);
            return;
        }
        this.parent();
        var b = this.$b();
        var h = this.els.daysHeader;
        var size = { x:b.width(),y:b.height() };

        var height = size.y - ludo.dom.getBH(b) - ludo.dom.getPH(b) - h.height() + ludo.dom.getMH(h);

        var c = this.els.daysContainer;
        height -= (ludo.dom.getMH(c) + ludo.dom.getPH(c) + ludo.dom.getBH(c));
        c.css('height',  height + 'px');
    },

    getColGroup:function () {
        var html = [];
        html.push('<colgroup>');
        html.push('<col ' + 'width="' + this.colWidthFirst + '%" />');
        for (var i = 0; i < 7; i++) {
            html.push('<col ' + 'width="' + this.colWidthRest + '%" />');
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
        var el = this.els.daysContainer = jQuery('<div>');
        el.addClass('ludo-calendar-container-days');
        el.css({
            position:'relative',
            width:'100%',
            overflow:'hidden',
            left:0,
            top:0
        });

        this.$b().append(el);
    },
    showMonth:function () {
        if (this.els.monthView) {
            this.els.monthView.remove();
        }

        var el = this.els.monthView = jQuery('<div>');
        el.on('click', this.selectDay.bind(this));
        el.addClass('ludo-calendar-body-days');
        this.resizeMonthView();
        el.css('position', 'absolute');

        this.els.daysContainer.append(el);


        var html = ['<table ', 'cellpadding="0" cellspacing="0" border="0" width="100%" style="height:100%">'];
        html.push(this.getColGroup().join(''));

        var days = this.getDaysForView();
        var cls = '';

        var selectedDay = 0;
        if (this.isValueMonth()) {
            selectedDay = this.value.get('date');
        }
        var today = 0;
        if (this.isOnTodaysMonth()) {
            today = new Date().get('date');
        }
        var thisMonthStarted = false;
        var nextMonthStarted = false;
        var clsInner;
        for (var i = 0; i < days.length; i++) {
            cls = 'calendar-day-cell ';
            clsInner = '';
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
                    if ((this.sundayFirst && (i - 1) % 8 == 0) || (!this.sundayFirst && (i + 1) % 8 == 0)) {
                        cls = cls + ' calendar-sunday';
                    }
                    if (days[i] == selectedDay) {
                        cls = cls + ' calendar-day-selected';
                    }
                    if (days[i] == today) {
                        clsInner = ' calendar-day-today';
                    }
                    cls = cls + ' calendar-day-' + days[i];
                }
            }

            html.push('<td style="position:relative" class="calendar-day-c ' + cls + '"><div class="calendar-day-div' + clsInner + '" style="position:absolute;left:0;top:0;width:100%;height:100%;"></div><span style="position:relative">' + days[i] + '</span></td>');
        }



        html.push('</table>');
        el.html( html.join(''));



        var divs = el.find('.calendar-day-div');

        divs.on('mouseover', this.mouseOverDays.bind(this));
        divs.on('mouseout', this.removeClsFromMouseOverDay.bind(this));

        this.resizeMonthView.delay(20, this);

        this.resizeToday();

    },

    mouseOverDays:function (e) {
        var el = jQuery(e.target);
        if(!el.hasClass('calendar-day-div')){
            return;
        }
        this.removeClsFromMouseOverDay();

        if(this.els.mouseOverDay != undefined && c[0] == this.els.mouseOverDay[0])return;

        var p = el.parent();
        if(p.hasClass('calendar-week') || p.hasClass('calendar-day-inactive')){
            return;
        }

        this.resizeHighlighted(el);

        el.addClass('calendar-day-mouse-over');
        this.els.mouseOverDay = el;
    },

    removeClsFromMouseOverDay:function (e) {

        if(e && e.target.className != 'calendar-day-div')return;
        if (this.els.mouseOverDay) {
            this.resizeHighlighted(this.els.mouseOverDay);
            this.els.mouseOverDay.removeClass('calendar-day-mouse-over');
            this.els.mouseOverDay = undefined;
        }
    },

    isValueMonth:function () {
        return this.value ? this.value.get('month') == this.date.get('month') && this.value.get('year') == this.date.get('year') : false;
    },

    isOnTodaysMonth:function () {
        var today = new Date();
        return today.get('month') == this.date.get('month') && today.get('year') == this.date.get('year');
    },
    resizeMonthView:function () {
        this.els.monthView.css('width',  '100%');
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
            for (i = count - 1; i >= 0; i--) {
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

    resizeHighlighted:function(el){
        var p = el.parent();
        var w = p.width();
        var h= p.height();

        var size = Math.min(h, w);
        size -= Math.floor(size / 10);

        el.css({
            width:size, height:size,
            left:Math.max(0, (w-size)/2),
            top:Math.max(0, (h-size)/2)
        });
    },

    selectDay:function (e) {
        var el = jQuery(e.target);
        if (!el.hasClass('calendar-day')) {
            el = el.closest('.calendar-day');
            if (!el)return;
        }
        if (el.hasClass('calendar-day-inactive')) {
            return;
        }
        this.removeClsFromMouseOverDay();
        this.removeClsFromSelectedDay();

        el.addClass('calendar-day-td-selected');
        el.children('div').addClass('calendar-day-selected');

        this.resizeHighlighted(el.children('div'), el);
        this.value = this.date.clone();

        this.value.set('date', el.find('span').html());
        this.fireEvent('change', [this.value, this]);
    },

    removeClsFromSelectedDay:function () {

        if (this.els.monthView && this.isValueMonth()) {
            var el = this.els.monthView.find('.calendar-day-' + this.value.get('date'));
            if (el){
                el.removeClass('calendar-day-td-selected');
                el.children('div').removeClass('calendar-day-selected');
                el.children('div').css({
                    width:'100%', height:'100%'
                });

            }
        }
    },

    addClsForSelectedDay:function () {
        if (this.els.monthView && this.isValueMonth()) {
            var el = this.els.monthView.find('.calendar-day-' + this.value.get('date'));
            if (el)el.children('div').addClass('calendar-day-selected');
        }
    },

    setStartWeek:function (week) {
        this.week = week;
    },

    getNextWeek:function () {
        var ret = this.week;
        this.week++;
        if (this.week > 53 || (this.week > 50 && this.date.get('month') == 0)) {
            this.week = 1;
        }
        return ret;
    },
    /**
     * Set currently viewed month
     * @function setDate
     * @param {Object} date
     * @return void
     * @memberof ludo.calendar.Days.prototype
     */
    setDate:function (date) {
        this.date = date;
        this.showMonth();
    },
    /**
     * Set selected date
     * @function setValue
     * @param {Date} date
     * @memberof ludo.calendar.Days.prototype
     */
    setValue:function (date) {
        this.removeClsFromSelectedDay();
        this.value = date.clone();
        this.addClsForSelectedDay();
    },

    resizeSelected:function(){
        if (this.els.monthView && this.isValueMonth()) {
            var el = this.els.monthView.find('.calendar-day-' + this.value.get('date'));
            if (el){
                this.resizeHighlighted(el.children('div'));

            }
        }
    },

    resizeToday:function(){
        this.resizeCell('.calendar-day-today');
    },

    resizeMO:function(){
        this.resizeCell('.calendar-day-mouse-over');
    },

    resizeCell:function(cls){
        var el = this.els.monthView.find(cls);
        if(el.length> 0){
            this.resizeHighlighted(el);
        }
    },


    resize:function(config){
        this.parent(config);

        this.els.monthView.find('.calendar-day-div').css({
            width:'100%', height:'100%'
        });

        this.resizeSelected();
        this.resizeToday();
        this.resizeMO();



        /*
        var els = this.els.monthView.find('.calendar-day-c');
        if(els.length > 0){
            var h = jQuery(els[0]).height();
            console.log(h);
            this.els.monthView.find('.calendar-day-c').css('font-size', (h / 2.2) + 'px' );

        }
        */

    }
});