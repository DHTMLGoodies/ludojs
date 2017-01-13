/**
 * Special collection class for tree structures.
 * @namespace ludo.dataSource
 * @class ludo.dataSource.JSONTree
 * @augments ludo.dataSource.JSONArray
 */
ludo.dataSource.JSONTree = new Class({
	Extends:ludo.dataSource.JSONArray,
	type : 'dataSource.JSONTree',
	searcherType:'dataSource.JSONTreeSearch',
	/**
	 * Return children of parent with this id
	 * @function getChildren
	 * @param {String} parent id
	 * @return {Array|undefined} children
	 * @memberof ludo.dataSource.JSONTree.prototype
	 */
	getChildren:function (parent) {
		var p = this.findRecord(parent);
		if (p) {
			if (!p.children)p.children = [];
			return p.children;
		}
		return undefined;
	},

    fireSelect:function(record){
        this.fireEvent('select', this.getRecord(record));
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
        this.searcher.addEvent('match', function(record){
            this.fireEvent('show', this.getRecord(record));
        }.bind(this));
        this.searcher.addEvent('mismatch', function(record){
            this.fireEvent('hide', this.getRecord(record));
        }.bind(this));
	}
});