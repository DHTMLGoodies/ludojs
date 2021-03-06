/**
 Displays number of pages in a data source
 @class ludo.paging.TotalPages
 @param {Object} config
 @param {String}config.tpl Template string. default: '/{pages}'.
 @example
 children:[
 ...
 {
			  type:'paging.TotalPages',
			  dataSource:'myDataSource'
		  }
 ...
 }
 where 'myDataSource' is the id of a dataSource.JSONArray object used by a view.
 */
ludo.paging.TotalPages = new Class({
	Extends:ludo.View,
	type:'grid.paging.TotalPages',
	width:25,
	onLoadMessage:'',

	tpl:'/{pages}',

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-paging-text');
		this.getEl().addClass('ludo-paging-total-pages');
	},

	ludoEvents:function () {
		this.parent();
        this.dataSourceEvents();
	},


	resize:function(config){
		this.parent(config);
		this.$b().css('line-height', (this.$b().height() * 0.8) + 'px');
	},

    dataSourceEvents:function(){
        if(ludo.get(this.dataSource)){
            var ds = this.getDataSource();
            if (ds) {
                ds.addEvent('load', this.setPageNumber.bind(this));
                ds.addEvent('pageCount', this.setPageNumber.bind(this));
                this.setPageNumber(ds.getPageNumber());
            }
        }else{
            this.dataSourceEvents.delay(100, this);
        }
    },

	setPageNumber:function () {
		this.html(this.tpl.replace('{pages}', this.getDataSource().getPageCount()));
	},

	JSON:function () {

	}
});