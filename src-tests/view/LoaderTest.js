TestCase("LoaderTests", {

	"test should be able to create loader": function(){
		// given
		var view = new ludo.View();
		var loader = new ludo.view.Shim({
			renderTo : 	view.getEl(),
			txt : 'Loading content'
		});

		assertEquals(view.getEl(), loader.renderTo);
		assertEquals('Loading content', loader.txt);
	}
});