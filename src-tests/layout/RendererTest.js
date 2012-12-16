TestCase("Renderer", {

	"test should be able to define renderer for a view":function () {
		// given
		var v = new ludo.View({
			layout:{
				width:'matchParent',
				height:'matchParent'
			}
		});

		// then
		assertNotUndefined(v.getLayoutManager().renderer);
		assertEquals(v, v.getLayoutManager().renderer.view);
	},

	"test should set default layout properties when not set":function () {
		var v = new ludo.View({
			renderTo:document.body
		});
		// when
		var renderer = v.getLayoutManager().getRenderer();

		// then
		assertEquals('matchParent', renderer.rendering.width);

	},

	"test should preserve left and top attributes":function () {
		var w = new ludo.Window({
			title:'Tree demo - Random countries and cities',
			layout:{
				type:'rows',
				width:500, height:370,
				left:250, top:50
			}
		});

		// then
		assertEquals(250, w.layout.left);
		assertEquals(50, w.layout.top);


	},

	"test should be able to set viewport":function () {
		// given
		var v = this.getViewInParent();
		// then
		assertEquals(500, v.getLayoutManager().renderer.viewport.width);
		assertEquals(600, v.getLayoutManager().renderer.viewport.height);
	},

	"test should be able to match parent size":function () {
		// given
		var el = document.createElement('div');
		el.style.width = '500px';
		el.style.height = '600px';
		document.body.adopt(el);

		// when
		var v = new ludo.View({
			layout:{
				width:'matchParent',
				height:'matchParent'
			},
			renderTo:el
		});

		assertNotUndefined(v.getEl().parentNode);

		// then
		assertEquals('500', v.getLayoutManager().renderer.coordinates.width);
		assertEquals('600', v.getLayoutManager().renderer.coordinates.height);
		assertEquals(500, v.getEl().offsetWidth);
		assertEquals(600, v.getEl().offsetHeight);

	},

	"test should be able to center":function () {
		var el = document.createElement('div');
		el.style.width = '500px';
		el.style.top = '0';
		el.style.left = '0';
		el.style.position = 'absolute';
		el.style.height = '600px';
		document.body.adopt(el);

		var v = new ludo.View({
			renderTo:document.body,
			layout:{
				width:200,
				height:100,
				centerIn:el
			}
		});

		// then
		assertEquals(250, v.getEl().offsetTop);
		assertEquals(150, v.getEl().offsetLeft);
	},

	getViewInParent:function () {
		var el = document.createElement('div');
		el.style.width = '500px';
		el.style.height = '600px';
		document.body.adopt(el);

		// when
		return new ludo.View({
			layout:{
				width:'matchParent',
				height:'matchParent'
			},
			renderTo:el
		});
	}

});