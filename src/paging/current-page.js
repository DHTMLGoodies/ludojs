/**
 Displays current page number shown in a collection
 @class ludo.paging.TotalPages
 @param {Object} config
 @param {String} tpl Template string. default: {page}
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
ludo.paging.CurrentPage = new Class({
	Extends:ludo.View,
	type:'grid.paging.CurrentPage',
	width:25,
	onLoadMessage:'',

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

	resize:function(config){
		this.parent(config);
		this.$b().css('line-height', (this.$b().height() * 0.8) + 'px');
	},

	setPageNumber:function () {
		this.html(this.tpl.replace('{page}', this.getDataSource().getPageNumber()));
	},

	JSON:function () {

	}
});