TestCase("GradientTest", {

	"test should be able to create gradient": function(){
		// given
		var gradient = new ludo.canvas.Gradient();
		// then
		assertEquals('linearGradient', gradient.getEl().tagName);
	},

	"test should be able to add stops": function(){
		// given
		var gradient = new ludo.canvas.Gradient();
		gradient.addStop('0%', '#000000', 1);
		gradient.addStop('100%', '#FFFFFF', 1);

		// then
		assertEquals(2, gradient.getEl().getElementsByTagName('stop').length);

	},

	"test should have correct stop points": function(){
		// given
		var gradient = new ludo.canvas.Gradient();
		gradient.addStop('0%', '#000000', 1);
		gradient.addStop('100%', '#FFFFFF', 1);

		// when
		var stopPoints = gradient.getEl().getElementsByTagName('stop');
		assertEquals('0%', stopPoints[0].getAttribute('offset'));

	},

	"test should be able to get stop node": function(){
		// given
		var gradient = new ludo.canvas.Gradient();
		gradient.addStop('0%', '#000000', 1);
		gradient.addStop('100%', '#FFFFFF', 1);

		// when
		var stopPoint = gradient.getStop(0);

		// then
		assertEquals('#000000', stopPoint.get('stop-color'))
		// when
		var stopPoint = gradient.getStop(1);

		// then
		assertEquals('#FFFFFF', stopPoint.get('stop-color').toUpperCase())
	},

	"test should be able to update attributes of stop tags": function(){
		// given
		var gradient = new ludo.canvas.Gradient();
		gradient.addStop('0%', '#000000', 1);
		gradient.addStop('100%', '#FFFFFF', 1);

		// when
		var stopPoint = gradient.getStop(0);
		stopPoint.setOffset('10%');
		stopPoint.setStopColor('#DDEEFF');
		stopPoint.setStopOpacity('#DDEEFF');

		// then
		assertEquals('#DDEEFF', stopPoint.getStopColor().toUpperCase());
		assertEquals('10%', stopPoint.getOffset());
	}
});