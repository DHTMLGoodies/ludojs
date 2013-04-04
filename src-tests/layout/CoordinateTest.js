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
	}

});