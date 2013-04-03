ludo.layout.Menu = new Class({
	Extends:ludo.layout.Base,
	active:false,

	onCreate:function () {
		this.menuContainer = new ludo.layout.MenuContainer(this);
	},

	getMenuContainer:function () {
		return this.menuContainer;
	},

	getValidChild:function (child) {
		if (ludo.util.isString(child))child = { html:child };
		child.layout = child.layout || {};
		if (child.children && !child.layout.type) {
			child.layout.type = 'menu';
			child.layout.orientation = 'vertical';
		}
		if (!child.type) {
			child.type = 'menu.Item';
		}
		if (child.type === 'menu.Item') {
			child.layout.height = 'wrap';
			child.menuDirection = this.view.layout.orientation;
		}

		if (this.view.layout.orientation === 'vertical' && !child.layout.width) {
			child.layout.width = 'fitParent';
		}

		return child;
	},

	parentForNewChild:undefined,

	getParentForNewChild:function () {
		if (this.parentForNewChild === undefined) {

			var isTop = !this.view.parentComponent || (this.view.parentComponent && this.view.parentComponent.layout.type.toLowerCase() !== 'menu');
			var p = isTop ? this.parent() : this.getMenuContainer().getBody();

			ludo.dom.addClass(p.parentNode, 'ludo-menu');
			ludo.dom.addClass(p.parentNode, 'ludo-menu-' + this.view.layout.orientation);
			if(isTop)ludo.dom.addClass(p.parentNode, 'ludo-menu-top');
			this.parentForNewChild = p;
		}
		return this.parentForNewChild;
	},

	onNewChild:function (child) {
		this.assignMenuItemFns(child);
		if (child.layout && child.layout.type && child.layout.type.toLowerCase() === 'menu') {
			child.addEvent('addChild', this.assignMenuItemFns.bind(this));
		}
	},

	parentContainers:undefined,

	getTopMenuComponent:function () {
		var v = this.view;
		while (v.parentComponent && v.parentComponent.layout.type.toLowerCase() === 'menu') {
			v = v.getParent();
		}
		return v;
	},

	assignMenuItemFns:function (child) {
		var lm = this;
		var p = lm.view.getParent();

		child.getMenuLayoutManager = function () {
			return this.parentComponent && this.parentComponent.getMenuLayoutManager ? this.parentComponent.getMenuLayoutManager() : lm;
		}.bind(child);

		child.getParentMenuItem = function () {
			return p && p.layout.type && p.layout.type.toLowerCase() === 'menu' ? lm.view : undefined;
		}.bind(child);

		child.isTopMenuItem = function () {
			return p ? p.layout.type.toLowerCase() !== 'menu' : true;
		}.bind(child);

		child.getMenuContainer = function () {
			return lm.getMenuContainer();
		}.bind(child);

		child.getMenuContainerToShow = function () {
			if (this.containerToShow === undefined) {
				if (this.layout.type && this.layout.type.toLowerCase() === 'menu' && this.children.length > 0) {
					if (this.children[0].isHidden())this.children[0].show();
					this.containerToShow = this.children[0].getMenuContainer();
				} else {
					this.containerToShow = undefined;
				}
			}

			return this.containerToShow;
		}.bind(child);

		child.getMenuContainersToShow = function () {
			if (!this.menuContainersToShow) {
				var cnt = [];
				var v = this.getParent();
				while (v && v.layout.orientation === 'vertical') {
					if (v.getMenuContainerToShow)cnt.unshift(v.getMenuContainerToShow());
					v = v.getParent();
				}
				var cmp = this.getMenuContainerToShow();
				if (cmp)cnt.push(cmp);

				this.menuContainersToShow = cnt;
			}
			return this.menuContainersToShow;
		}.bind(child);

		var menuComponent = this.getTopMenuComponent();
		child.getMenuComponent = function () {
			return menuComponent;
		}.bind(child);

		child.addEvent('click', function () {
			menuComponent.fireEvent('click', this);
		}.bind(child));

		if (this.view.layout.orientation === 'horizontal' && child.children.length > 0) {
			child.addEvent('click', function () {
				menuComponent.getLayoutManager().activate(child);
			}.bind(this));
		}

		child.addEvent('enterMenuItem', function () {
			menuComponent.getLayoutManager().showMenusFor(child);
		}.bind(this))
	},
	shownMenus:[],

	activate:function (child) {
		this.active = !this.active;
		this.showMenusFor(child);
	},

	showMenusFor:function (child) {
		if (!this.active) {
			this.hideMenus();
		} else {
			var menusToShow = child.getMenuContainersToShow();
			this.hideMenus(menusToShow);

			this.shownMenus = menusToShow;
			for (var i = 0; i < this.shownMenus.length; i++) {
				this.shownMenus[i].show();
			}
		}
	},

	hideMenus:function (except) {
		except = except || [];
		for (var i = 0; i < this.shownMenus.length; i++) {
			if (except.indexOf(this.shownMenus[i]) === -1) this.shownMenus[i].hide();
		}
	}
});