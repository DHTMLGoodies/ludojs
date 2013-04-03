ludo.layout.Menu = new Class({
	Extends:ludo.layout.Base,
	active:false,
	alwaysActive:false,

	onCreate:function () {
		this.menuContainer = new ludo.layout.MenuContainer(this);
		if (this.view.layout.active) {
			this.alwaysActive = true;
		}

		if (this.view.id === this.getTopMenuComponent().id) {
			document.id(document.documentElement).addEvent('click', this.autoHideMenus.bind(this));
			ludo.EffectObject.addEvent('start', this.hideAllMenus.bind(this) );
		}
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
			child.orientation = this.view.layout.orientation;
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
			if (isTop && !this.view.layout.isContext)ludo.dom.addClass(p.parentNode, 'ludo-menu-top');
			this.parentForNewChild = p;

            if(isTop){
                this.view.addEvent('show', this.resize.bind(this));
            }
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

		child.getParentMenuItems = function () {
			if (!this.parentMenuItems) {
				this.parentMenuItems = [];
				var v = this.getParent();
				while (v && v.getMenuContainer) {
					this.parentMenuItems.push(v);
					v = v.getParent();
				}
			}
			return this.parentMenuItems;
		}.bind(child);

		child.addEvent('click', function () {
			menuComponent.fireEvent('click', this);
		}.bind(child));

		if (this.view.layout.orientation === 'horizontal' && child.children.length > 0) {
			child.addEvent('click', function () {
				menuComponent.getLayoutManager().activate(child);
			}.bind(this));
		} else {
			child.addEvent('click', menuComponent.getLayoutManager().hideAllMenus.bind(menuComponent.getLayoutManager()));
		}

		child.addEvent('enterMenuItem', function () {
			menuComponent.getLayoutManager().showMenusFor(child);
			menuComponent.getLayoutManager().highlightItemPath(child);
		}.bind(this))
	},
	shownMenus:[],


	activate:function (child) {
		this.active = !this.active;
		this.showMenusFor(child);
	},

	showMenusFor:function (child) {
		if (!this.active && !this.alwaysActive) {
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

	hideAllMenus:function () {
		this.hideMenus();
		this.clearHighlightedPath();
		if(this.view.layout.isContext){
			this.view.getEl().style.display='none';
		}
	},

	hideMenus:function (except) {
		except = except || [];
		for (var i = 0; i < this.shownMenus.length; i++) {
			if (except.indexOf(this.shownMenus[i]) === -1) this.shownMenus[i].hide();
		}
	},

	highlightedItems:[],
	highlightItemPath:function (child) {
		var items = child.getParentMenuItems();
		this.clearHighlightedPath(items);
		for (var i = 0; i < items.length; i++) {
			ludo.dom.addClass(items[i].getEl(), 'ludo-menu-item-active');
		}
		this.highlightedItems = items;
	},

	clearHighlightedPath:function (except) {
		except = except || [];
		for (var i = 0; i < this.highlightedItems.length; i++) {
			if (except.indexOf(this.highlightedItems[i]) === -1) {
				ludo.dom.removeClass(this.highlightedItems[i].getEl(), 'ludo-menu-item-active');
			}
		}
	},

	autoHideMenus:function (e) {
		if (this.active || this.alwaysActive) {
			var el = e.target;
			if (el.className.indexOf('ludo-menu-item') >= 0) {
				return;
			}
			if (!el.getParent('.ludo-menu')) {
				this.hideAllMenus();
				if(this.view.layout.orientation === 'horizontal'){
					this.active = false;
				}
			}
		}
	}
});