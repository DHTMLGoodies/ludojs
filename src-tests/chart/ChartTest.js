TestCase("ChartTest", {

	"test should be able to assign css to groups":function () {
		// given
		var v = this.getCanvasWithTheseChildren([
			{
				type:'chart.Group',
				containerCss:{
					'fill' : '#fff'
				}
			}
		]);

		// when
		var child = v.children[0];

		// then
		assertEquals('#ffffff', child.getEl().style.fill.toLowerCase());

	},

	"test should get reference to parent canvas": function(){
		// given
		var v = this.getCanvasWithTheseChildren([
			{
				type:'chart.Group'
			}
		]);

		// when
		var child = v.children[0];


		// when
		assertEquals('Canvas', v.layout.type);

		assertEquals(v.getCanvas(), child.getCanvas());


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