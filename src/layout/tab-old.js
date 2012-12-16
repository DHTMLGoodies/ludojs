ludo.layout.Tab = new Class({
	Extends:ludo.layout.Base,

	initialize:function (view) {
		this.parent(view);
		this.view.addEvent('resize', this.resizeTabs.bind(this));
	},

	resize:function () {
		var height = this.view.getInnerHeightOfBody();
		if (height <= 0)return;
		for (var i = 0; i < this.view.children.length; i++) {
			this.view.children[i].resize({ height:height });
		}
	},

	resizeTabs:function () {
		if (this.view.children.length === 0) {
			return;
		}
		this.getTabStrip().onComponentResize();
	},

	onNewChild:function (child) {
		this.parent(child);
		var tab = this.getTabStrip().addChild(child);
		if (this.getTabStrip().getCountItems() === 1) {
			tab.show();
		}
	},

	getTabStrip:function () {
		if (!this.tabStrip) {
			this.tabStrip = new ludo.TabStrip({
				parentComponent:this.view,
				listeners:{
					add:this.resize.bind(this)
				}
			});
		}
		return this.tabStrip;
	},

	prepareView:function () {
		this.view.getEl().addClass('ludo-component-tab-layout');
		this.prepareTabLayout();
	},

	prepareTabLayout:function () {
		var tabStrip = this.getTabStrip();
		tabStrip.showFirstActiveTab();
	},

	getHeightOfNavElements:function () {
		return this.tabStrip.getHeight();
	}
});