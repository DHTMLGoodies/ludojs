TestCase("PolylineTest", {
	"test should be able to create polyline": function(){
		var points = '20,20 40,25 60,40 80,120 120,140 200,180';
		var polyline = new ludo.canvas.Polyline(points);

		// then
		assertEquals(points, polyline.get('points'));
	},

	"test should be able to retrieve specific points": function(){
		// given
		var polyline = new ludo.canvas.Polyline('20,20 40,25 60,40 80,120 120,140 200,180');

		// when
		var point = polyline.getPoint(1);
		var pointTwo = polyline.getPoint(3);

		// then
		assertEquals(40, point.x);
		assertEquals(25, point.y);

		assertEquals(80, pointTwo.x);
		assertEquals(120, pointTwo.y);

	},

	"test should be able to update point": function(){
		// given
		var polyline = new ludo.canvas.Polyline('20,20 40,25 60,40 80,120 120,140 200,180');

		// when
		polyline.setPoint(1, 50,60);
		var point = polyline.getPoint(1);

		// then
		assertEquals(50, point.x);
		assertEquals(60, point.y);


		this.assertPoints(polyline, '20,20 50,60 60,40 80,120 120,140 200,180');
	},

	assertPoints:function(polyline, points){
		if(Browser.ie){
			// IE automatically inserts comma
			assertEquals(points, polyline.get('points'));
		}else{
			assertEquals(points.replace(/,/g,' '), polyline.get('points'));
		}
	},

	"test should be able to get size": function(){
		// given
		var polyline = new ludo.canvas.Polyline('20,20 40,25 60,40 80,120 120,140 200,180');

		var expected = {
			height: 180 - 20,
			width: 200 - 20
		};

		// when
		var size = polyline.getSize();

		// then
		assertEquals(expected.width, size.x);
		assertEquals(expected.height, size.y);
	},

	"test should be able to get position": function(){
		// given
		var polyline = new ludo.canvas.Polyline('40,15, 20,20 40,25 60,40 80,120 120,140 200,180');

		// when
		var pos = polyline.getPosition();

		// then
		assertEquals(20, pos.x);
		assertEquals(15, pos.y);
	}
});