/**
 Button used to navigate to last page in a dataSource.Collection
 @namespace paging
 @class Last
 @extends paging.Button
 @constructor
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
 where 'myDataSource' is the id of a dataSource.Collection object used by a view.
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