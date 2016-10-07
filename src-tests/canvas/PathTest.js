TestCase("PathTest", {
	"test should be able to create path": function(){
		var points = 'M150 0 L75 200 L225 200 Z';
		var path = new ludo.canvas.Path(points);

		// when
		var expected = 'M 150 0 L 75 200 L 225 200 Z';

		// then
		assertEquals(expected, path.get('d'));
		assertEquals(expected, path.pointString);
	},

	"test should be able to get a point": function(){
		// given
		var path = new ludo.canvas.Path('M150 0 L75 200 L225 200 Z');

		// when
		var point = path.getPoint(0);
		var pointTwo = path.getPoint(1);

		// then
		assertEquals(150, point.x);
		assertEquals(0, point.y);
		assertEquals(75, pointTwo.x);
		assertEquals(200, pointTwo.y);
	},

	"test should be able to update a point": function(){
		// given
		var path = new ludo.canvas.Path('M150 0 L75 200 L225 200 Z');

		// when
		path.setPoint(0, 140, 10);
		path.setPoint(2, 250, 40);
		var point = path.getPoint(0);
		var pointTwo = path.getPoint(2);

		// then
		assertEquals(140, point.x);
		assertEquals(10, point.y);
		assertEquals(250, pointTwo.x);
		assertEquals(40, pointTwo.y);

		assertEquals('M 140 10 L 75 200 L 250 40 Z', path.get('d'));
	},

	"test should be able to get size": function(){
		// given
		var path = new ludo.canvas.Path('M150 0 L75 200 L225 210 Z');
		// when
		var size = path.getSize();

		// then
		assertEquals(150, size.x);
		assertEquals(210, size.y);
	},

	"test should be able to get position": function(){
		// given
		var path = new ludo.canvas.Path('M150 0 L75 200 L225 210 Z');
		// when
		var pos = path.getPosition();

		// then
		assertEquals(75, pos.x);
		assertEquals(0, pos.y);
	}

});