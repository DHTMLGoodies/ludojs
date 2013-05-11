/**
 * Record for charts
 * @namespace chart
 * @class Record
 */
ludo.chart.Record = new Class({
    Extends:ludo.dataSource.Record,

    getStartPercent:function () {
        var c = this.getCollection();
        var i = c.indexOf(this) - 1;
        return c.getSumOf(0, i) / c.getSum() * 100;
    },

    getPercent:function(){
        return (this.getValue() / this.getCollection().getSum()) * 100;
    },

    getDegrees:function () {
        return this.getPercent() * 360 / 100;
    },

    getAngle:function () {
        var s = this.getCollection().startAngle;
        var ret = s + (this.getStartPercent() * 360 / 100);
        if (ret > 360)ret -= 360;
        return ret;
    },

    getValue:function(){
        return this.get('value');
    },

    setValue:function(value){
        value = parseFloat(value);
        if(value !== this.get('value')){
            this.set('value', value);
        }
    },

    focus:function(){
        this.fireEvent('focus', this);
        this.set('focused', true);
    },

    blur:function(){
        this.fireEvent('blur', this);
        this.set('focused', false);
    },

    click:function(){
        var focused = this.get('focused') ? true : false;
        this[focused ? 'blur' : 'focus']();
    },

    isFocused:function(){
        return this.get('focused') ? true : false;
    },

    enter:function(){
        this.fireEvent('enter', this);
    },

    leave:function(){
        this.fireEvent('leave', this);
    }
});