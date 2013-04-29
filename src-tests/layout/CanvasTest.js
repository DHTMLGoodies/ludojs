TestCase("CanvasTest", {

	"test should get correct layout manager":function () {
		// given
		var v = this.getCanvasWithTwoChildren();

		// then
		assertEquals('Canvas', v.layout.type);
	},

	"test should render children":function () {
		// given
		var v = this.getCanvasWithTwoChildren();
		assertNotUndefined(v.canvas);

		// when
		var children = v.children;

		// then
		assertEquals(2, children.length);
	},

	"test should render one child correctly":function () {
		// given
		var v = this.getCanvasWithTheseChildren([
			{ type:'chart.Group', layout:{
				alignParentLeft:true,
				alignParentTop:true,
				width:300,
				fillDown:true
			}}
		]);

		// when
		var child = v.children[0];

		// then
		assertEquals('300px', child.get('width'));
		assertEquals(0, child.get('x'));
		assertEquals(0, child.get('y'));


	},

	"test should render children correctly":function () {
		// given
		var v = this.getCanvasWithTheseChildren([
			{
				name:'chart',
				type:'chart.Group',
				layout:{
					top:0,
					leftOf:'labels',
					fillDown:true,
					fillLeft:true
				}
			},
			{
				name : 'labels',
				type:'chart.Group',
				layout:{
					alignParentRight:true,
					top:0,
					width:100,
					filllDown:true
				}
			}
		]);

		// then
		assertEquals(400, v.children[0].get('width'));
		assertEquals(0, v.children[0].get('x'));
		assertEquals(0, v.children[0].get('y'));

		assertEquals(400, v.children[1].get('x'));
		assertEquals(100, v.children[1].get('width'));
	},

	getCanvasWithTwoChildren:function () {
		return new ludo.chart.Chart({
			children:[
				{
					type:'chart.Pie'
				},
				{
					type:'chart.Group'
				}
			]

		});
	},

	getCanvasWithTheseChildren:function (children) {

		var v = new ludo.View({
			renderTo:document.body,
			layout:{
				width:500, height:500
			},
			children:[
				{
					type:'chart.Chart',
					children:children
				}
			]

		});

		return v.children[0];
	}


});