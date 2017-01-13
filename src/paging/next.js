/**
 Button used to navigate to next page in a dataSource.JSONArray
 @namespace paging
 @class ludo.paging.Next
 @augments paging.Button
 
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
 where 'myDataSource' is the id of a dataSource.JSONArray object used by a view.
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
	 * @function nextPage
	 * @memberof ludo.paging.Next.prototype
	 */
	nextPage:function () {
		this.getDataSource().nextPage();
	}
});