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
        if (rec)rec.setValue(value);
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
    },

    indexOf:function (record) {
        return this.records.indexOf(record);
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
                r[i].set('color-over', this.color().brighten(color, 7));
                color = this.color().offsetHue(this.startColor, i * (360 / (r.length + 1)));
            }
        }
    },
    focused:undefined,
    focusRecord:function(record){
        if(this.focused)this.focused.blur();
        this.focused = record;
    },

    recordInstance:function(data){
        return new ludo.chart.Record(data, this);
    }
});