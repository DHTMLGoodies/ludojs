/**
 Button used to navigate to previous page in a dataSource.Collection
 @namespace paging
 @class Last
 @augments paging.Button
 @constructor
 @param {Object} config
 @example
 	children:[
 		...
		 {
			 type:'paging.Previous',
			 dataSource:'myDataSource'
		 }
 		...
 	}
 where 'myDataSource' is the id of a dataSource.Collection object used by a view.
 */
ludo.paging.Previous = new Class({
	Extends:ludo.paging.Button,
	type:'grid.paging.Previous',
	buttonCls:'ludo-paging-previous',

	addDataSourceEvents:function () {
		this.addEvent('click', this.nextPage.bind(this));
		var ds = this.getDataSource();
		ds.addEvent('firstPage', this.disable.bind(this));
		ds.addEvent('notFirstPage', this.enable.bind(this));

		if (ds.isOnFirstPage()) {
			this.disable();
		}
	},

	nextPage:function () {
		this.getDataSource().previousPage();
	}

});