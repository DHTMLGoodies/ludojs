/**
 * Class used to select month for a calendar.
 * @namespace ludo.calendar
 * @class ludo.calendar.MonthSelector
 * @augments ludo.calendar.Base
 *
 * @fires ludo.calendar.MonthSelector#setDate - Arguments Date and ludo.View(the view firing the event)
 */
ludo.calendar.MonthSelector = new Class({
    Extends: ludo.calendar.Base,
    height:25,

    __rendered:function(){
        this.parent();
        this.createMonthContainer();
        this.renderMonths();
        this.autoResize();
    },

    autoResize:function(){
        var height = this.els.monthContainer.offsetHeight;
        height += ludo.dom.getMH(this.els.monthContainer) + ludo.dom.getMBPH(this.getBody()) + ludo.dom.getMBPH(this.getEl());
        this.layout.height = height;

    },
    createMonthTooltip:function(){
        var el = this.els.monthTip = $('<div>');
        el.setStyles({
            'position' : 'absolute',
            display:'none'
        });
        el.addClass('ludo-calendar-month-tip');
        el.addClass('ludo-calendar-month');
        el.addEvent('click', this.clickMonth.bind(this));
        this.els.monthContainer.append(el);
    },

    createMonthContainer:function(){
        var el = this.els.monthContainer = $('<div>');
        el.addClass('ludo-calendar-month-container');
        el.setStyles({
            position:'absolute', width : '3000px', left:0,top:0
        });
        this.getBody().append(el);
    },

    renderMonths:function(){
        this.els.monthContainer.html( '');
        this.createMonthTooltip();
        var month = this.date.get('month');

        for(var i=0;i<this.months.length;i++){
            var el = $('<div>');
            el.addClass('ludo-calendar-month');
            el.setProperty('month', i);
            this.els.monthContainer.append(el);

            if(i==month){
                el.addClass('ludo-calendar-month-selected');
                el.html( '<span>' + this.months[i] + '</span>');
                el.mouseenter(this.hideTooltip.bind(this));
            }else{
                el.mouseenter(this.showTooltip.bind(this));
                el.setProperty('title', this.months[i]);
                el.addClass('ludo-calendar-month-inactive');
            }
            el.addEvent('click', this.clickMonth.bind(this));
        }
        this.els.monthContainer.addEvent('mouseleave', this.hideTooltip.bind(this));
    },

    clickMonth:function(e){
        var el = this.getMonthEl(e.target);
        this.setMonth(el.attr('month'));
        this.sendSetDateEvent();
    },

    setDate:function(date){
        this.parent(date);
        this.renderMonths();
    },

    showTooltip:function(e){
        var el = this.getMonthEl(e.target);
        var tip = this.els.monthTip;
        tip.setProperty('month', el.attr('month'));
        var month = this.months[el.attr('month')];
        tip.html( month);
        tip.css('left',  Math.max(0, el.offsetLeft) + 'px');
        tip.css('display',  '');
    },

    hideTooltip:function(){
        this.els.monthTip.css('display', 'none');
    },

    getMonthEl:function(dom){
        if(!dom.hasClass('ludo-calendar-month'))dom = dom.getParent('.ludo-calendar-month');
        return dom;
    }
});