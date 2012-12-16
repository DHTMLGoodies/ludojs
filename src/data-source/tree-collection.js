/**
 * Special collection class for tree structures.
 * @namespace dataSource
 * @class TreeCollection
 * @extends dataSource.Collection
 */
ludo.dataSource.TreeCollection = new Class({
	Extends:ludo.dataSource.Collection,
	type : 'dataSource.TreeCollection',
	searcherType:'dataSource.TreeCollectionSearch',
	/**
	 * Return children of parent with this id
	 * @method getChildren
	 * @param {String} parent id
	 * @return {Array} children
	 */
	getChildren:function (parent) {
		parent = this.findRecord(parent);
		if (parent) {
			if (!parent.children)parent.children = [];
			return parent.children;
		}
	},

	addRecordEvents:function(record){
		this.parent(record);
		record.addEvent('addChild', this.indexRecord.bind(this));
		record.addEvent('insertBefore', this.indexRecord.bind(this));
		record.addEvent('insertAfter', this.indexRecord.bind(this));


		var events = ['insertBefore','insertAfter','addChild','removeChild'];
		for(var i=0;i<events.length;i++){
			record.addEvent(events[i], this.fireRecordEvent.bind(this));
		}
	},

	fireRecordEvent:function(record, otherRecord, eventName){
		this.fireEvent(eventName, [record, otherRecord]);
	},

	addSearcherEvents:function(){

	}
});