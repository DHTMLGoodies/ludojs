ludo.factory.createNamespace('myApp');

myApp.CustomGrid = new Class({
	Extends:ludo.FramedView,
	id:'gridWindowSearchable',
	title:'Grid - capital and population',

	gridUrl : '../resources/grid-data.json',

	layout:{
		width:'100%',
		height:'100%',
		type:'linear',
		orientation:'vertical'
	},

	elCss:{
		margin:0
	},

	getTitleBarConfig:function () {
		return {
			buttons:[
				{
					type:'reload',
					title:'Reload grid data'
				},
				'minimize',
				'close'
			],
			listeners:{
				'reload':function () {
					this.child['grid'].getDataSource().load();
				}.bind(this)
			}
		};
	},

	css:{
		'border-bottom':0
	},

	__children:function () {
		return [
			{
				height:27,
				labelWidth:50,
				type:'form.Text',
				label:'Search',

				listeners:{
					key:function (value) {
						this.child['grid'].getDataSource().search(value);
					}.bind(this)
				}
			},
			{
				id:'myGrid',
				name:'grid',
				type:'grid.Grid',
				weight:1,
				elCss:{
					'border':0,
					'border-right':'0',
					'border-top':'1px solid #EBF0F5',
					'border-bottom':'1px solid #EBF0F5'
				},
				stateful:false,
				resizable:false,

				fill:true,
				columns:{
					info:{
						heading:'Country and Capital',
						headerAlign:'center',
						columns:{
							'country':{
								heading:'Country',
								removable:false,
								sortable:true,
								movable:true,
								width:200,
								renderer:function (val) {
									return '<span style="color:blue">' + val + '</span>';
								}
							},
							'capital':{
								heading:'Capital',
								sortable:true,
								removable:true,
								movable:true,
								width:150
							}
						}
					},
					population:{
						heading:'Population',
						movable:true,
						removable:true
					}

				},
				dataSource:{
					url:this.gridUrl,
					id:'myDataSource',
					shim:{
						txt:'Loading content. Please wait'
					},
					paging:{
						size:12,
						remotePaging:false,
						cache:false,
						cacheTimeout:1000
					},
					searchConfig:{
						index:['capital', 'country'],
						delay:.5
					},
					listeners:{
						count:function (countRecords) {
							this.setTitle('Grid - capital and population - Stateful (' + countRecords + ' records)');
						}.bind(this)
					}
				}

			}
		]
	},

	getButtonBarConfig:function () {
		var ds = this.child['grid'].getDataSource().id;

		return {
			height:28,
			align:'left',
			buttonBarCss:{
				margin:0,
				'border-left' : 0,
				'border-right' : 0
			},
			css:{
				'border-left' : 0,
				'border-right' : 0
			},
			children:[
				{
					type:'paging.First',
					dataSource:ds
				},
				{
					type:'paging.Previous',
					dataSource:ds
				},
				{
					type:'paging.PageInput',
					dataSource:ds
				},
				{
					type:'paging.TotalPages',
					dataSource:ds
				},
				{
					type:'paging.Next',
					dataSource:ds
				},
				{
					type:'paging.Last',
					dataSource:ds
				}
			]
		};
	}
});