/**
 A view containing buttons and views for navigating in a dataSource.JSONArray.
 default children: ['paging.First','paging.Previous','paging.PageInput','paging.TotalPages','paging.Next','paging.Last']
 You can customize which views to show by using the children constructor property.
 @namespace ludo.paging
 @class ludo.paging.NavBar
 @augments View
 
 @param {Object} config
 @example
 	children:[
 		{
			type:'grid.Grid',
			columnManager:{
				...
			},
			dataSource:{
				url:'data-source/grid.php',
				id:'myDataSource'
			}

 		},
 		...
 		...
		{
			type:'paging.NavBar',
			dataSource:'myDataSource'
		}
 		...
 	}
 where 'myDataSource' is the id of a dataSource.JSONArray object used by the Grid above.
 */
ludo.paging.NavBar = new Class({
	Extends:ludo.View,
	type:'paging.NavBar',
	layout:'cols',
	height:25,

	children:[
		{
			type:'paging.First'
		},
		{
			type:'paging.Previous'
		},
		{
			type:'paging.PageInput'
		},
		{
			type:'paging.TotalPages'
		},
		{
			type:'paging.Next'
		},
		{
			type:'paging.Last'
		}
	],

	__construct:function (config) {
		this.parent(config);

		if (config.dataSource) {
			for (var i = 0; i < config.children.length; i++) {
				config.children[i].dataSource = config.dataSource;
			}
			this.dataSource = undefined;
		}
	},

	JSON:function(){

	}
});