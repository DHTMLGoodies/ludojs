TestCase("CircleTest", {

	"test should be able to create a circle": function(){
		// given
		var circle = new ludo.canvas.Circle({ cx:100, cy:150, r:250 });

		// then
		assertEquals(100, circle.getCx());
		assertEquals(150, circle.getCy());
		assertEquals(250, circle.getRadius());
	},

	"test should be able to update radius": function(){
		// given
		var circle = new ludo.canvas.Circle({ cx:100, cy:100, r:200 });

		// when
		circle.setRadius(250);

		// then
		assertEquals(250, circle.getRadius());
	},

	"test should be able to update centerX and centerY": function(){
		// given
		var circle = new ludo.canvas.Circle({ cx:100, cy:100, r:200 });

		// when
		circle.setCx(125);
		circle.setCy(225);

		// then
		assertEquals(125, circle.getCx());
		assertEquals(225, circle.getCy());
	},

	"test should be able to get coordinates": function(){
		// given
		var circle = new ludo.canvas.Circle({ cx:500, cy:420, r:200 });
		circle.translate(100,120);

		// when
		var pos = circle.position();

		// then
		assertEquals(500-200+100, pos.left);
		assertEquals(420-200+120, pos.top);

		// when
		var size = circle.getSize();

		// then
		assertEquals(400, size.x);
		assertEquals(400, size.y);
	}

});