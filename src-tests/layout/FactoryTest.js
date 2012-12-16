TestCase("FactoryTest", {

	"test should return valid layout object": function(){
		// given
		var view = new ludo.View({ weight:1});
		var config = { weight:1};

		// when
		var layout = ludo.layoutFactory.getValidLayoutObject(view, config);

		// then
		assertEquals(1, layout.weight);

	}



});