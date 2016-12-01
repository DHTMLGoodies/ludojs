TestCase("TooltipTest", {

	"test should be able to define template for tooltip":function () {
		// given
		var c = this.getChartWithTooltip({
			tpl : '{label}'
		});

		// when
		c.dataProvider().records[0].enter();
		c.fireEvent('mouseenter', { page : {x:0,y:0}});

		// then
		assertEquals('First label', c.plugins[0].getParsedHtml());
	},

	getChartWithTooltip:function (tooltipConfig) {
		tooltipConfig = tooltipConfig || {};
		tooltipConfig.type = 'chart.Tooltip';

		var c = new ludo.chart.Chart({
			layout:{
				width:500,height:500
			},
			renderTo:document.body,
			data:[
				{ label:'First label', value:150 },
				{ label:'Second label', value:100 }
			],
			children:[
				{
					type:'chart.Pie',
					plugins:[tooltipConfig
					]
				}
			]
		});

		return c.children[0];
	}
});