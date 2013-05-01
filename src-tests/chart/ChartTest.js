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

    "test should create data provider automatically": function(){
        // given
        var v = this.getCanvasWithTheseChildren([
            {
                type:'chart.Group'
            }
        ]);

        // then
        assertNotUndefined(v.getDataProvider());
    },

    "test should automatically create getChart methods for children": function(){
        // given
        var v = this.getCanvasWithTheseChildren([
            {
                type:'chart.Group'
            },
            {
                type:'chart.Group'
            }
        ]);

        // then
        assertEquals(v, v.children[0].getChart());
        assertEquals(v, v.children[1].getChart());

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