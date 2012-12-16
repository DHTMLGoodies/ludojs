TestCase("LoaderTests", {

	"test should be able to create loader": function(){
		// given
		var view = new ludo.View();
		var loader = new ludo.view.Loader({
			view : 	view,
			txt : 'Loading content'
		});

		assertEquals(view, loader.view);
		assertEquals('Loading content', loader.txt);
	},

	"test should show loader when beforeLoad event is fired": function(){
		// given
		var view = new ludo.View({
			dataSource:{

			}
		});
		var loader = new ludo.view.Loader({
			view : 	view,
			txt : 'Loading content'
		});

		// when
		view.getDataSource().fireEvent('beforeload');

		// then
		assertNotUndefined(loader.el);
	},

	"test should hide loader on data source load event": function(){
		// given
		var view = new ludo.View({
			dataSource:{

			}
		});
		var loader = new ludo.view.Loader({
			view : 	view,
			txt : 'Loading content'
		});

		// when
		view.getDataSource().fireEvent('beforeload');
		assertEquals('', loader.el.style.display);
		view.getDataSource().fireEvent('load');

		// then
		assertEquals('none', loader.el.style.display);
	}
});