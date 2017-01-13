/**
 Button used to navigate to first page in a dataSource.JSONArray
 @namespace ludo.paging
 @class ludo.paging.First
 @augments ludo.paging.Button
 
 @param {Object} config
 @example
 	children:[
 		...
		 {
			 type:'paging.First',
			 dataSource:'myDataSource'
		 }
 		...
 	}
 where 'myDataSource' is the id of a dataSource.JSONArray object used by a view.
 */
ludo.paging.First = new Class({
	Extends:ludo.paging.Button,
	type:'grid.paging.First',
	buttonCls:'ludo-paging-first',

	addDataSourceEvents:function () {
		this.addEvent('click', this.firstPage.bind(this));
		var ds = this.getDataSource();
		ds.addEvent('firstPage', this.disable.bind(this));
		ds.addEvent('notFirstPage', this.enable.bind(this));

		if (ds.isOnFirstPage()) {
			this.disable();
		}
	},

	firstPage:function () {
		this.getDataSource().firstPage();
	}

});