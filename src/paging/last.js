/**
 Button used to navigate to last page in a dataSource.JSONArray
 @namespace ludo.paging
 @class ludo.paging.Last
 @augments ludo.paging.Button
 
 @param {Object} config
 @example
 	children:[
 		...
		 {
			 type:'paging.Last',
			 dataSource:'myDataSource'
		 }
 		...
 	}
 where 'myDataSource' is the id of a dataSource.JSONArray object used by a view.
 */
ludo.paging.Last = new Class({
	Extends:ludo.paging.Button,
	type:'grid.paging.Last',
	buttonCls:'ludo-paging-last',

	addDataSourceEvents:function () {
		this.addEvent('click', this.nextPage.bind(this));
		var ds = this.getDataSource();
		ds.addEvent('lastPage', this.disable.bind(this));
		ds.addEvent('notLastPage', this.enable.bind(this));
	},

	nextPage:function () {
		this.getDataSource().lastPage();
	}
});