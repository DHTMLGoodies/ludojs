TestCase("CollapsedBar", {

	"test should get correct layout for left hand collapse bar": function(){
		// given
		var view = new ludo.View({
			layout:{
				type : 'relative',
				collapseBar:'left'
			}
		});
		var bar = view.getLayoutManager().getCollapseBar();

		// then
		assertTrue(bar.layout.absLeft);
		assertTrue(bar.layout.alignParentTop);
		assertTrue(bar.layout.fillDown);

	},

	"test should get correct layout for right hand collapse bar": function(){
		// given
		var view = new ludo.View({
			layout:{
				type : 'relative',
				collapseBar:'right'
			}
		});
		var bar = view.getLayoutManager().getCollapseBar('right');

		// then
		assertTrue(bar.layout.absRight);
		assertTrue(bar.layout.alignParentTop);
		assertTrue(bar.layout.fillDown);
	},

	"test should assign correct css class": function(){
		// given
		var view = new ludo.View({
			layout:{
				type : 'relative',
				collapseBar:'right'
			}
		});
		// when
		var bar = view.getLayoutManager().getCollapseBar();
		// then
		assertTrue(ludo.dom.hasClass(bar.getEl(), 'ludo-collapse-bar'));
		assertTrue(ludo.dom.hasClass(bar.getEl(), 'ludo-collapse-bar-vertical'));
	},

	"test should be able to set collapsible in layout object of view": function(){
		new ludo.View({
			layout:{
				type : 'relative',
				collapseBar:'right'
			},
			children:[{
				id:'coll',
				layout:{
					collapsible:true
				}
			}]
		});

		// then
		assertTrue(ludo.get('coll').isCollapsible());

	},

	"test should be able to specify where to collapse view": function(){
		var view = new ludo.View({
			id:'myView',
			layout:{
				type : 'relative',
				collapseBar:'right'
			},
			children:[{
				id:'coll',
				layout:{
					collapsible:'right',
					collapseTo:'myView'
				}
			}]
		});

		// when
		var bar = view.getLayoutManager().getCollapseBar('right');
		var views = bar.getViews();
		// then
		assertEquals('coll', views[0].id);
		assertEquals(1, views.length);

	}
});