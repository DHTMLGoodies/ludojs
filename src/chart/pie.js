ludo.chart.Pie = new Class({
	Extends:ludo.chart.Base,
	title:'Chart title',

	data:[
		{
			name:'IE8',
			value:10,
			selected:true,
			color:'#fed',
			drillDown:{
				name:'Browser versions',
				data:[
					{
						name:'IE6', value:2
					},
					{
						name:'IE7', value:3
					},
					{
						name:'IE8', value:5
					}
				]
			}
		}
	]
});