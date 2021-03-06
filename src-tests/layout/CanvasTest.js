TestCase("LayoutCanvasTest", {

	"test should get correct layout manager":function () {
		// given
		var v = this.svgWithTwoChildren();

		// then
		assertEquals('Canvas', v.layout.type);
	},

	"test should render children":function () {
		// given
		var v = this.svgWithTwoChildren();
		assertNotUndefined(v.canvas);

		// when
		var children = v.children;

		// then
		assertEquals(2, children.length);
	},

	"test should render one child correctly":function () {
		// given
		var v = this.svgWithTheseChildren([
			{ type:'canvas.Group', layout:{
				alignParentLeft:true,
				alignParentTop:true,
				width:300,
				fillDown:true
			}}
		]);

		// when
		var child = v.children[0];

		// then
		assertEquals('translate(0 0)', child.get('transform'));
	},

	"test should render children correctly":function () {
		// given
		var v = this.svgWithTheseChildren([
			{
				name:'chart',
				type:'canvas.Group',
				layout:{
					top:0,
					leftOf:'labels',
					fillDown:true,
					fillLeft:true
				}
			},
			{
				name : 'labels',
				type:'canvas.Group',
				layout:{
					alignParentRight:true,
					top:0,
					width:100,
					filllDown:true
				}
			}
		]);

		// then
		assertEquals('400px', v.children[0].get('width'));
        assertEquals('translate(0 0)', v.children[0].get('transform'));

		assertEquals('translate(400 0)', v.children[1].get('transform'));
		assertEquals('100px', v.children[1].get('width'));
	},

	svgWithTwoChildren:function () {
		return new ludo.chart.Chart({
			children:[
				{
					type:'chart.Pie'
				},
				{
					type:'canvas.Group'
				}
			]

		});
	},

	svgWithTheseChildren:function (children) {

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