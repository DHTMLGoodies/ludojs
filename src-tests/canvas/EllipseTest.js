TestCase("EllipseTest", {

	"test should be able to create an ellipse":function () {
		// given
		var ellipse = new ludo.canvas.Ellipse({ cx:100, cy:150, rx:250, ry:200 });

		// then
		assertEquals(100, ellipse.getCx());
		assertEquals(150, ellipse.getCy());
		assertEquals(250, ellipse.getRadiusX());
		assertEquals(200, ellipse.getRadiusY());
	},

	"test should be able to update radius":function () {
		// given
		var ellipse = new ludo.canvas.Ellipse({ cx:100, cy:150, rx:250, ry:200 });

		// when
		ellipse.setRadiusX(250);
		ellipse.setRadiusY(150);

		// then
		assertEquals(250, ellipse.getRadiusX());
		assertEquals(150, ellipse.getRadiusY());
	},

	"test should be able to get coordinates":function () {
		// given
		var ellipse = new ludo.canvas.Ellipse({ cx:500, cy:425, rx:250, ry:200 });
		ellipse.translate(100, 120);

		// when
		var pos = ellipse.getPosition();

		// then
		assertEquals(500 - 250 + 100, pos.x);
		assertEquals(425 - 200 + 120, pos.y);

		// when
		var size = ellipse.getSize();

		// then
		assertEquals(500, size.x);
		assertEquals(400, size.y);
	}

});