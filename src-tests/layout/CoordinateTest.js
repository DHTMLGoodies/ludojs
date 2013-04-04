TestCase("CoordinateTest", {

	"test layout left should be equal to view left": function(){
		// given
		var c = new ludo.View({
			left:100
		});

		// then
		assertEquals(100, c.layout.left);
	},

	"test layout top should be equal to view top": function(){
		// given
		var c = new ludo.View({
			top:100
		});

		// then
		assertEquals(100, c.layout.top);
	},

	"test layout width should be equal to view width": function(){
		// given
		var c = new ludo.View({
			width:100
		});

		// then
		assertEquals(100, c.layout.width);
	},

	"test layout height should be equal to view height": function(){
		// given
		var c = new ludo.View({
			height:100
		});

		// then
		assertEquals(100, c.layout.height);
	},

	"test should preserve aspect ratio": function(){
		// given
		var c = new ludo.View({
			layout:{
				width:200,
				aspectRatio: 2
			}
		});

		// then
		assertEquals(100, c.layout.height);

	},

	"test should transfer x and y coordinates": function(){
		// given
		var c = new ludo.View({
			x:100,y:150
		});

		// then
		assertEquals(100, c.layout.left);
		assertEquals(150, c.layout.top);
		// given
		var d = new ludo.View({
			layout:{ x:100,y:150 }
		});

		// then
		assertEquals(100, d.layout.left);
		assertEquals(150, d.layout.top);
	}

});