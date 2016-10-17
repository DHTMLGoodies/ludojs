/**
 Displays current page number shown in a collection
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
ludo.paging.CurrentPage = new Class({
	Extends:ludo.View,
	type:'grid.paging.CurrentPage',
	width:25,
	onLoadMessage:'',
	/**
	 * Text template for view. {pages} is replaced by number of pages in data source.
	 * @attribute {String} tpl
	 * @default '/{pages}'
	 */
	tpl:'{page}',

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-paging-text');
		this.getEl().addClass('ludo-paging-current-page');
	},

	ludoEvents:function () {
		this.parent();
        this.dataSourceEvents();
	},

    dataSourceEvents:function(){
        if(ludo.get(this.dataSource)){
            var ds = this.getDataSource();
            if (ds) {
                ds.addEvent('page', this.setPageNumber.bind(this));
                this.setPageNumber(ds.getPageNumber());
            }
        }else{
            this.dataSourceEvents.delay(100, this);
        }
    },

	setPageNumber:function () {
		this.html(this.tpl.replace('{page}', this.getDataSource().getPageNumber()));
	},

	insertJSON:function () {

	}
});