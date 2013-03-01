/**
 * Class used to select month for a calendar.
 * @namespace calendar
 * @class MonthSelector
 * @extends calendar.Base
 * @type {Class}
 */
ludo.calendar.MonthSelector = new Class({
    Extends: ludo.calendar.Base,
    height:25,

    ludoRendered:function(){
        this.parent();
        this.createMonthContainer();
        this.renderMonths();
        this.autoResize();
    },
    autoResize:function(){
        var height = this.els.monthContainer.offsetHeight;
        height += ludo.dom.getMH(this.els.monthContainer);
        height += ludo.dom.getMBPH(this.getBody()) + ludo.dom.getMBPH(this.getEl());
        this.height = height;

    },
    createMonthTooltip:function(){
        var el = this.els.monthTip = new Element('div');
        el.setStyles({
            'position' : 'absolute',
            display:'none'
        });
        ludo.dom.addClass(el, 'ludo-calendar-month-tip');
        ludo.dom.addClass(el, 'ludo-calendar-month');
        el.addEvent('click', this.clickMonth.bind(this));
        this.els.monthContainer.adopt(el);
    },

    createMonthContainer:function(){
        var el = this.els.monthContainer = new Element('div');
        ludo.dom.addClass(el, 'ludo-calendar-month-container');
        el.setStyles({
            position:'absolute', width : '3000px', left:0,top:0
        });
        this.getBody().adopt(el);
    },

    renderMonths:function(){
        this.els.monthContainer.set('html', '');
        this.createMonthTooltip();
        var month = this.date.get('month');

        for(var i=0;i<this.months.length;i++){
            var el = new Element('div');
            ludo.dom.addClass(el, 'ludo-calendar-month');
            el.setProperty('month', i);
            this.els.monthContainer.adopt(el);

            if(i==month){
                ludo.dom.addClass(el, 'ludo-calendar-month-selected');
                el.set('html', '<span>' + this.months[i] + '</span>');
                el.addEvent('mouseenter', this.hideTooltip.bind(this));
            }else{
                el.addEvent('mouseenter', this.showTooltip.bind(this));
                el.setProperty('title', this.months[i]);
                ludo.dom.addClass(el, 'ludo-calendar-month-inactive');
            }
            el.addEvent('click', this.clickMonth.bind(this));
        }
        this.els.monthContainer.addEvent('mouseleave', this.hideTooltip.bind(this));
    },

    clickMonth:function(e){
        var el = this.getMonthEl(e.target);
        this.setMonth(el.getProperty('month'));
        this.sendSetDateEvent();
    },

    setDate:function(date){
        this.parent(date);
        this.renderMonths();
    },

    showTooltip:function(e){
        var el = this.getMonthEl(e.target);
        this.els.monthTip.setProperty('month', el.getProperty('month'));
        var month = this.months[el.getProperty('month')];
        this.els.monthTip.set('html', month);
        this.els.monthTip.style.left = Math.max(0, el.offsetLeft) + 'px';
        this.els.monthTip.style.display = '';
    },

    hideTooltip:function(){
        this.els.monthTip.style.display='none';
    },

    getMonthEl:function(dom){
        if(!dom.hasClass('ludo-calendar-month'))dom = dom.getParent('.ludo-calendar-month');
        return dom;
    }
});