/**
 Displays number of pages in a data source
 @class paging.TotalPages
 @extends View
 @constructor
 @param {Object} config
 @example
 children:[
 ...
 {
			  type:'paging.TotalPages',
			  dataSource:'myDataSource'
		  }
 ...
 }
 where 'myDataSource' is the id of a dataSource.Collection object used by a view.
 */
ludo.paging.TotalPages = new Class({
	Extends:ludo.View,
	type:'grid.paging.TotalPages',
	width:25,
	onLoadMessage:'',
	/**
	 * Text template for view. {pages} is replaced by number of pages in data source.
	 * @attribute {String} tpl
	 * @default '/{pages}'
	 */
	tpl:'/{pages}',

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-paging-total-pages');
	},

	ludoEvents:function () {
		this.parent();
		var ds = this.getDataSource();
		if (ds) {
			ds.addEvent('load', this.setPageNumber.bind(this));
			ds.addEvent('pageCount', this.setPageNumber.bind(this));
			this.setPageNumber(ds.getPageNumber());
		}
	},
	setPageNumber:function () {
		this.setHtml(this.tpl.replace('{pages}', this.getDataSource().getPageCount()));
	},

	insertJSON:function () {

	}
});