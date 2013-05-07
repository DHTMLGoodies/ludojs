ludo.chart.DataProvider = new Class({
	Extends:ludo.dataSource.Collection,
	sum:undefined,
	recordValues:{},
	records:[],

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

	addRecordEvents:function(record){
		this.parent(record);
		this.assignMethods(record);
	},

	assignMethods:function(record){
		record.getPercent = this.getPercentFn(record).bind(record);
		record.getValue = this.getGetValueFn(record).bind(record);
		record.setValue = this.getSetValueFn(record).bind(record);
	},

	getPercentFn:function(record){
		return function(){
			return (record.getValue() / record.getCollection().getSum()) * 100;
		}.bind(record);
	},

	getGetValueFn:function(record){
		return function(){
			return record.get('value');
		}
	},

	getSetValueFn:function(record){
		return function(value){
			record.set('value', parseFloat(value));
		}
	},

	createRecord:function(data){
		var rec = this.parent(data);
		if(this.records.indexOf(rec) === -1){
			this.records.push(rec);
		}
		return rec;
	},

	getRecords:function(){
		return this.records;
	}
});