TestCase("PaintTest", {

	"test should be able to set styles":function () {
		// given

		var paint = new ludo.svg.Paint({
			'stroke-opacity':.5
		});

		// when
		var opacity = paint.getStyle('stroke-opacity');

		// then
		assertEquals(.5, opacity);
		this.assertHasPropertyInText(paint, 'stroke-opacity');
	},


	assertHasPropertyInText:function (paint, txt) {
		assertTrue(paint.el.textContent.indexOf(txt) >= 0);
	},

	"test should be able to update a style":function () {
		var paint = new ludo.svg.Paint({
			'stroke-opacity':0.5,
			'fill-opacity':1
		});

		// when
		paint.setStyle('stroke-opacity', 0.7);


		var opacity = paint.getStyle('stroke-opacity');

		// then
		assertEquals(0.7, opacity);
	},


	"test should be able to use standard css styles":function () {
		var paint = new ludo.svg.Paint({
			'color':'#FFF'
		});
		// then
		assertEquals('#FFF', paint.getStyle('color'));
		assertEquals('#FFF', paint.getStyle('stroke-color'));
	},

	"test should be able to use gradient node as style value":function () {
		// given
		var gradient = new ludo.svg.Gradient({
			id:'myGradient'
		});
		gradient.addStop('0%', 'red');
		gradient.addStop('100%', '#FFF', 1);

		assertEquals('myGradient', gradient.id);
		// when
		var paint = new ludo.svg.Paint({
			'fill':gradient

		});
		var expected = 'url(#myGradient)';
		// then
		assertEquals(expected, paint.getStyle('fill'));


	}
});