ludo.chart.DataProvider = new Class({
    Extends:ludo.dataSource.Collection,
    sum:undefined,
    recordValues:{},
    records:[],
    startColor:'#561AD9',

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
    },

    getPercentFn:function (record) {
        return function () {
            return (record.getValue() / record.getCollection().getSum()) * 100;
        }.bind(record);
    },

    getGetValueFn:function (record) {
        return function () {
            return record.get('value');
        }
    },

    getSetValueFn:function (record) {
        return function (value) {
            record.set('value', parseFloat(value));
        }
    },

    createRecord:function (data) {
        var rec = this.parent(data);
        if (this.records.indexOf(rec) === -1) {
            this.records.push(rec);
        }
        return rec;
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
            if(!r[i].get('color')){
                r[i].set('color', color);
                color = this.color().offsetHue(this.startColor, i * (360 / (r.length + 1)));
            }
        }
    }
});