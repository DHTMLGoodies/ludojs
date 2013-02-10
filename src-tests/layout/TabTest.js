TestCase("TabLayout", {

	getView:function (tabs) {
		return new ludo.View({
			layout:{
				type:'tab',
				tabs:tabs
			},
			children:[
				{
					name:'a', title:'Child a'
				},
				{
					name:'b', title:'Child b'
				},
				{
					name:'c', title:'Child c', layout:{ visible:true }
				},
				{
					name:'d', title:'Child d'
				}
			]
		});
	},

	"test should be able to have tab layout":function () {
		// given
		var v = new ludo.View({
			layout:{
				type:'tab',
				tabs:'right'
			}
		});

		// then
		assertEquals('tab', v.layout.type);
		assertEquals('right', v.getLayoutManager().getTabPosition());
	},

	"test should set correct layout of children":function () {
		// given
		var v = this.getView();

		// then
		assertTrue(v.child['a'].layout.alignParentLeft);
		assertTrue(v.child['a'].layout.alignParentTop);
		assertTrue(v.child['a'].layout.fillDown);
		assertTrue(v.child['a'].layout.fillRight);
		assertUndefined(v.child['b'].layout.visible);
		assertTrue(v.child['c'].layout.visible);
	},

	"test should create tab strip":function () {
		// given
		var v = this.getView('top');

		// when
		var tabStrip = v.getLayoutManager().tabStrip;

		// then
		assertNotUndefined(tabStrip);
		assertTrue(v.getLayoutManager().isTabStrip(tabStrip));
		assertFalse(tabStrip.isHidden());

		assertEquals('top', tabStrip.tabPos);
		assertTrue(tabStrip.layout.absTop);
		assertTrue(tabStrip.layout.absLeft);
		assertTrue(tabStrip.layout.absWidth);
	},

	"test should show initial visible child":function () {
		// given
		var v = this.getView('top');

		// then
		assertTrue(v.child['a'].isHidden());
		assertTrue(v.child['b'].isHidden());
		assertFalse(v.child['c'].isHidden());
	},

	"test should show first child when no child has visible set to true":function () {
		var v = new ludo.View({
			layout:{
				type:'tab',
				tabs:'top'
			},
			renderTo:document.body,
			children:[
				{
					name:'a', title:'Child a'
				},
				{
					name:'b', title:'Child b'
				},
				{
					name:'c', title:'Child c'
				}
			]
		});

		// then
		assertEquals(v.child['a'].type, v.getLayoutManager().visibleChild.type);
		assertFalse(v.child['a'].isHidden());

	},

	"test should be able to show and hide tabs":function () {
		// given
		var v = this.getView('top');
		assertFalse(v.child['c'].isHidden());

		// when
		v.child['a'].show();

		// then
		assertFalse(v.child['a'].isHidden());
		assertTrue(v.child['c'].isHidden());
		assertTrue(v.child['b'].isHidden());

		// when
		v.child['b'].show();

		// then
		assertFalse(v.child['b'].isHidden());
		assertTrue(v.child['c'].isHidden());
		assertTrue(v.child['a'].isHidden());
	},

	"test tab strip should register added children":function () {
		// given
		var v = this.getView('top');

		// when
		var tabStrip = v.getLayoutManager().getTabStrip();

		// then
		assertEquals(4, tabStrip.getCount());
	},

	"test should highlight tab when child is shown":function () {
		// given
		var v = this.getView('top');

		// when
		var tabStrip = v.getLayoutManager().getTabStrip();
		var tab = tabStrip.getTabFor(v.child['c']);
		// then
		assertNotUndefined(tabStrip.activeTab);
		assertTrue(ludo.dom.hasClass(tab, 'ludo-tab-strip-tab-active'));
	},

	"test should fire showChild event when showing child":function () {
		// given
		var eventFired = false;
		var eventChild = undefined;
		var v = this.getView('top');
		v.getLayoutManager().addEvent('showChild', function (child) {
			eventFired = true;
			eventChild = child;
		});

		// when
		v.child['a'].show();

		// then
		assertTrue(eventFired);
		assertEquals(v.child['a'], eventChild);

	},

	"test should highlight tab when new child is shown":function () {
		// given
		var v = this.getView('top');

		// when
		var tabStrip = v.getLayoutManager().getTabStrip();
		v.child['b'].show();
		var tabB = tabStrip.getTabFor(v.child['b']);
		var tabC = tabStrip.getTabFor(v.child['c']);
		// then
		assertNotUndefined(tabStrip.activeTab);
		assertTrue(ludo.dom.hasClass(tabB, 'ludo-tab-strip-tab-active'));
		assertFalse(ludo.dom.hasClass(tabC, 'ludo-tab-strip-tab-active'));
	},

	"test should display previous tab when a child is disposed":function () {
		// given
		var v = this.getView('top');

		// when
		v.child['d'].show();
		var childCount = v.children.length;
		v.child['d'].dispose();
		// then
		assertFalse(v.child['c'].isHidden());
		assertEquals(childCount-1, v.children.length);

	}

});