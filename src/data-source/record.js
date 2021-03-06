/**
 * Class representing a record in a <a href="ludo.dataSource.JSONArray.html">Collection</a>
 * Instances of this class are created by the collections getRecord method.
 * When you update a record
 * @namespace ludo.dataSource
 * @class ludo.dataSource.Record
 */
ludo.dataSource.Record = new Class({
	Extends:Events,
	record:undefined,
	collection:undefined,

    /*
     * Array of events which should fire update event
     * @property {Array} eventKeys
     * @default undefined
     */
    eventKeys:undefined,

	initialize:function (record, collection) {
		this.record = record;
		this.collection = collection;
	},

	/**
	 * Update property of record
	 * @function set
	 * @param {String} key
	 * @param {String|Number|Object} value
	 * @return {dataSource.Record}
	 * @memberof ludo.dataSource.Record.prototype
	 */
	set:function (key, value) {
		this.fireEvent('beforeUpdate', this.record);
		this.record[key] = value;
		if(!this.eventKeys || this.eventKeys.indexOf(key) >= 0){
            this.fireEvent('update', this.record);
        }
		return this;
	},

	/**
	 Return value of key
	 @function get
	 @param {String} key
	 @return {String|Number|Object} value
	 @memberof ludo.dataSource.Record.prototype
	 */
	get:function (key) {
		return this.record[key];
	},
	/**
	 Update multiple properties
	 @function setProperties
	 @param {Object} properties
	 @return {dataSource.Record|undefined}
	 @memberof ludo.dataSource.Record.prototype
	 @example
	    var collection = new ludo.dataSource.JSONArray({
	 		idField:'id'
		});
	 collection.getRecord(100).setProperties({ country:'Norway', capital:'Oslo' });
	 will set country to "Norway" and capital to "Oslo" for record where "id" is equal to 100. If you're not sure
	 that the record exists, you should use code like this:
	 @example
	    var rec = collection.getRecord(100);
	    if(rec)rec.setProperties({ country:'Norway', capital:'Oslo' });
	 */
	setProperties:function (properties) {
		this.fireEvent('beforeUpdate', this.record);
		for (var key in properties) {
			if (properties.hasOwnProperty(key)) {
				this.record[key] = properties[key];
			}
		}
		this.fireEvent('update', [this.record,undefined, 'update']);
		return this;
	},

	addChild:function (record) {
		record = this.getPlainRecord(record);
		this.record.children = this.record.children || [];
		this.record.children.push(record);
		if (record.parentUid) {
			var parent = this.collection.getRecord(record.parentUid);
			if (parent)parent.removeChild(record);
		}
		this.fireEvent('addChild', [record, this.record, 'addChild']);
		return this;
	},

	getParent:function () {
		return this.collection.getRecord(this.record.parentUid);
	},

	getCollection:function(){
		return this.collection;
	},

	isRecordObject:function (rec) {
		return rec['initialize'] !== undefined && rec.record !== undefined;
	},

	getChildren:function () {
		return this.record.children;
	},

	removeChild:function (record) {
		record = this.getPlainRecord(record);
		var index = this.record.children.indexOf(record);
		if (index >= 0) {
			this.record.children.splice(index, 1);
			this.fireEvent('removeChild', [record, this.record, 'removeChild']);
		}
	},

	getPlainRecord:function (record) {
		return this.isRecordObject(record) ? record.record : record;
	},

    select:function(){
        this.fireEvent('select', this);
    },

	insertBefore:function (record, before) {
		if (this.inject(record, before)) {
			this.fireEvent('insertBefore', [record, before, 'insertBefore']);
		}
	},

	insertAfter:function (record, after) {
		if (this.inject(record, after, 1)) {
			this.fireEvent('insertAfter', [record, after, 'insertAfter']);
		}
	},

	inject:function (record, sibling, offset) {
		offset = offset || 0;
		record = this.getPlainRecord(record);
		sibling = this.getPlainRecord(sibling);
		if (record === sibling)return false;
		if (record.parentUid) {
			var parent = this.collection.getRecord(record.parentUid);
			if (parent){
				if(this.isMyChild(record)){
					this.record.children.splice(this.getChildIndex(record), 1);
				}else{
					parent.removeChild(record);
				}
			}
		}
		var index = this.record.children.indexOf(sibling);
		if (index !== -1) {
			this.record.children.splice(index + offset, 0, record);
			return true;
		}
		return false;
	},

	getChildIndex:function (record) {
		return this.record.children ? this.record.children.indexOf(this.getPlainRecord(record)) : -1;
	},

	isMyChild:function (record) {
		return this.record.children && this.record.children.indexOf(this.getPlainRecord(record)) !== -1;
	},

	getUID:function(){
		return this.record.uid;
	},

	getData:function(){
		return this.record;
	},

	dispose:function(){
		this.fireEvent('remove', this.record);
		delete this.record;
	}
});