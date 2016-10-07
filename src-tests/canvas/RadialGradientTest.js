TestCase("RadialGradientTest", {

	"test should be able to create gradient": function(){
		// when
		var gradient = new ludo.canvas.RadialGradient();

		// then
		assertEquals('radialGradient', gradient.getEl().tagName);

	},

	"test should be able to add properties": function(){
		// when
		var gradient = new ludo.canvas.RadialGradient({
			cx:400,cy:200,r:300,fx:400,fy:200
		});

		// then
		assertEquals('400', gradient.el.getAttribute('cx'));

	},

	"test should use userSpaceOnUse as default for gradientUnits" :function(){
		// when
		var gradient = new ludo.canvas.RadialGradient({
			cx:400,cy:200,r:300,fx:400,fy:200
		});

		// then
		assertEquals('userSpaceOnUse', gradient.el.getAttribute('gradientUnits'));
	}

});