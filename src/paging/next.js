/**
 Button used to navigate to next page in a dataSource.Collection
 @namespace paging
 @class Next
 @extends paging.Button
 @constructor
 @param {Object} config
 @example
 	children:[
 		...
		 {
			 type:'paging.Next',
			 dataSource:'myDataSource'
		 }
 		...
 	}
 where 'myDataSource' is the id of a dataSource.Collection object used by a view.
 */
ludo.paging.Next = new Class({
	Extends:ludo.paging.Button,
	type:'grid.paging.Next',
	buttonCls:'ludo-paging-next',

	addDataSourceEvents:function () {
		this.addEvent('click', this.nextPage.bind(this));
		var ds = this.getDataSource();
		ds.addEvent('lastPage', this.disable.bind(this));
		ds.addEvent('notLastPage', this.enable.bind(this));
	},

	/**
	 * Calls nextPage() method of data source
	 * @method nextPage
	 */
	nextPage:function () {
		this.getDataSource().nextPage();
	}
});