TestCase("RectTest", {
	"test should be able to create a rectangle": function(){
		// given
		var rect = new ludo.svg.Rect({ x:100,y:120, width:200,height:300, rx:5, ry:7 });

		// then
		assertEquals(100, rect.getX());
		assertEquals(120, rect.getY());
		assertEquals(200, rect.getWidth());
		assertEquals(300, rect.getHeight());
		assertEquals(5, rect.getRx());
		assertEquals(7, rect.getRy());
	},

	"test should be able to update coordinates": function(){
		// given
		var rect = new ludo.svg.Rect({ x:100,y:120, width:200,height:300, rx:5, ry:7 });

		// when
		rect.setX(200);
		rect.setY(250);
		rect.setWidth(300);
		rect.setHeight(400);
		rect.setRx(4);
		rect.setRy(5);

		// then
		assertEquals(200, rect.getX());
		assertEquals(250, rect.getY());
		assertEquals(300, rect.getWidth());
		assertEquals(400, rect.getHeight());
		assertEquals(4, rect.getRx());
		assertEquals(5, rect.getRy());
	}
});