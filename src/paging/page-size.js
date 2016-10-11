/**
 * Select box for setting page size of a Collection
 * @namespace paging
 * @class PageSize
 */
ludo.paging.PageSize = new Class({
	Extends: ludo.form.Select,

	options:[
		{ value : 10, text : '10' },
		{ value : 25, text : '25' },
		{ value : 50, text : '50' },
		{ value : 100, text : '100' }
	],

	label : 'Page size',
	applyTo:undefined,

	ludoConfig:function(config){
		this.applyTo = ludo.get(config.dataSource || this.applyTo);
		config.dataSource = undefined;
		this.parent(config);
	},

	ludoEvents:function(){
		this.parent();
		this.addEvent('change', this.setPageSize.bind(this));
	},

	setPageSize:function(){
		if(this.applyTo){
			this.applyTo.setPageSize(this.val());
		}
	}

});