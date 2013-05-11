/**
 * Special data source for charts
 * @namespace chart
 * @class DataProvider
 * @extends dataSource.Collection
 */
ludo.chart.DataProvider = new Class({
    Extends:ludo.dataSource.Collection,
    type:'chart.DataProvider',
    sum:undefined,
    recordValues:{},
    records:[],
    startColor:'#561AD9',
    startAngle: 270,

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['startColor']);
    },

    ludoEvents:function () {
        this.parent();
        this.addEvent('parsedata', this.setRecordValues.bind(this));
        if (this.data) {
            this.setRecordValues();
        }
    },

    get:function (id) {
        return this.getRecord(id);
    },

    setValue:function (id, value) {
        var rec = this.getRecord(id);
        if (rec)rec.set('value', value);
    },

    getValue:function (id) {
        var rec = this.getRecord(id);
        return rec ? rec.get('value') : undefined;
    },

    createIndex:function () {
        this.sum = 0;
        this.parent();
    },

    indexRecord:function (record, parent) {
        this.sum += record.value - (this.recordValues[record.uid] ? this.recordValues[record.uid] : 0);
        this.parent(record, parent);
        this.recordValues[record.uid] = record.value;
        this.createRecord(record);
    },


    getSum:function () {
        return this.sum;
    },

    addRecordEvents:function (record) {
        this.parent(record);
        this.assignMethods(record);
    },

    assignMethods:function (record) {
        record.getPercent = this.getPercentFn(record).bind(record);
        record.getValue = this.getGetValueFn(record).bind(record);
        record.setValue = this.getSetValueFn(record).bind(record);
        record.getStartPercent = this.getStartPercentFn(record).bind(record);
        record.getDegrees = this.getDegreesFn(record).bind(record);
        record.getAngle = this.getAngleFn(record).bind(record);
        record.focus = this.getFocusFn(record).bind(record);
        record.blur = this.getBlurFn(record).bind(record);
        record.enter = this.getEventFn(record, 'enter').bind(record);
        record.leave = this.getEventFn(record, 'leave').bind(record);
        record.click = this.getClickFn(record).bind(record);
    },

    getPercentFn:function (record) {
        return function () {
            return (record.getValue() / record.getCollection().getSum()) * 100;
        }.bind(record);
    },

    getDegreesFn:function(record){
        return function(){
            return record.getPercent() * 360 / 100;
        }
    },

    getGetValueFn:function (record) {
        return function () {
            return record.get('value');
        }
    },

    getSetValueFn:function (record) {
        return function (value) {
            value = parseFloat(value);
            if(value !== this.get('value')){
                record.set('value', value);

            }
        }
    },

    indexOf:function (record) {
        return this.records.indexOf(record);
    },

    getStartPercentFn:function (record) {
        return function () {
            var c = record.getCollection();
            var i = record.getCollection().indexOf(record) - 1;
            return c.getSumOf(0, i) / c.getSum() * 100;
        }
    },

    getEventFn:function(record, event){
        return function () {
            record.fireEvent(event, record);
        }
    },

    getClickFn:function(record){
        return function(){
            var clicked = record.get('clicked') ? true : false;
            record[clicked ? 'blur' : 'focus']();
        }
    },

    getFocusFn:function(record){
        return function(){
            record.fireEvent('focus', record);
            record.set('clicked', true);
        }
    },

    getBlurFn:function(record){
        return function(){
            record.fireEvent('blur', record);
            record.set('clicked', false);
        }
    },



    getAngleFn:function(record){
        var s = this.startAngle;
        return function(){
            var ret = s + (record.getStartPercent() * 360 / 100);
            if(ret > 360)ret-=360;
            return ret;
        }
    },

    getSumOf:function (start, end) {
        var ret = 0;
        for (var i = 0; i <= end; i++) {
            ret += this.records[i].getValue();
        }
        return ret;
    },

    createRecord:function (data) {
        var rec = this.parent(data);
        if (this.records.indexOf(rec) === -1) {
            this.records.push(rec);
            this.fireEvent('createRecord', rec);
            rec.addEvent('focus', this.focusRecord.bind(this));
        }
        return rec;
    },

    hasRecords:function () {
        return this.records.length > 0;
    },

    getRecords:function () {
        return this.records;
    },

    color:function () {
        return this.getDependency('color', { type:'color.Color' });
    },

    setRecordValues:function () {
        var color = this.startColor;
        var r = this.getRecords();
        for (var i = 0; i < r.length; i++) {
            if (!r[i].get('color')) {
                r[i].set('color', color);
                color = this.color().offsetHue(this.startColor, i * (360 / (r.length + 1)));
            }
        }
    },
    focused:undefined,
    focusRecord:function(record){
        if(this.focused)this.focused.blur();
        this.focused = record;
    }
});