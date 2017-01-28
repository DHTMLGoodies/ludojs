/**
 Class for menu layouts in LudoJS
 An instance of this class is created dynamically when
 layout.type for a View is set to "menu".
 @namespace ludo.layout
 @class ludo.layout.Menu
 
 @example
 layout:{
		 type:'Menu',
		 rightOf:'leftMenu'
	 },
 children:[
 {
     html:'Games',
     children:[
         { html:'Console games',
             children:['XBox 360',
                 {
                     html:'Wii U',
                     children:['NintendoLand', 'Batman Arkham City', 'SuperMario Wii U']
                 }, 'PlayStation']},
         'PC Games',
         'Mac Games',
         'Mobile games'
     ]
 },
 'Apps',
 'Utilities'
 ],
 listeners:{
 	 	'click' : function(item){
 	 		console.log('You clicked ' + item.html);
 	 	}
 	 }

 */
ludo.layout.Menu = new Class({
	Extends:ludo.layout.Base,
	active:false,
	alwaysActive:false,
	type:'layout.Menu',
	
	onCreate:function () {
		this.menuContainer = new ludo.layout.MenuContainer(this);
		if (this.view.layout.active) {
			this.alwaysActive = true;
		}

		if (this.view.id === this.getTopMenuComponent().id) {
			jQuery(document.documentElement).on('click', this.autoHideMenus.bind(this));
			ludo.EffectObject.addEvent('start', this.hideAllMenus.bind(this));
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
		child.type = child.type || 'menu.Item';
		if (child.type === 'menu.Item') {
			child.orientation = this.view.layout.orientation;
		} else {
			child.layout.height = child.layout.height || child.height;
		}

		return child;
	},

	parentForNewChild:undefined,

	getParentForNewChild:function () {
		if (this.parentForNewChild === undefined) {
			var isTop = !this.hasMenuLayout(this.view.parentComponent);
			var p = isTop ? this.parent() : this.getMenuContainer().getBody();


			p.parent().addClass('ludo-menu');
			p.parent().addClass('ludo-menu-' + this.view.layout.orientation);

			if (isTop && !this.view.layout.isContext)p.parent().addClass('ludo-menu-top');
			this.parentForNewChild = p;

			if (isTop) {
				this.view.addEvent('show', this.resize.bind(this));
			}
		}
		return this.parentForNewChild;
	},

	onNewChild:function (child) {
		this.assignMenuItemFns(child);
		if (this.hasMenuLayout(child)) {
			child.addEvent('addChild', this.assignMenuItemFns.bind(this));
		}
	},

	hasMenuLayout:function (item) {
		return item && item.layout && item.layout.type && item.layout.type.toLowerCase() === 'menu';
	},

	parentContainers:undefined,

	getTopMenuComponent:function () {
		var v = this.view;
		while (v.parentComponent && this.hasMenuLayout(v.parentComponent)) {
			v = v.getParent();
		}
		return v;
	},

	assignMenuItemFns:function (child) {
		var lm = this;
		var p = lm.view.getParent();
		var topMenu = this.getTopMenuComponent();
		var topLm = topMenu.getLayout();

		if (child.mouseOver === undefined) {
			child.getEl().mouseenter(function () {
				this.mouseOver();
			}.bind(child));
			child.mouseOver = function () {
				this.fireEvent('enterMenuItem', this);
			}.bind(child);
		}

		child.getMenuLayoutManager = function () {
			return this.parentComponent && this.parentComponent.getMenuLayoutManager ? this.parentComponent.getMenuLayoutManager() : lm;
		}.bind(child);
		child.getParentMenuItem = function () {
			return lm.hasMenuLayout(p) ? lm.view : undefined;
		}.bind(child);
		child.isTopMenuItem = function () {
			return !lm.hasMenuLayout(p);
		}.bind(child);
		child.getMenuContainer = function () {
			return lm.getMenuContainer();
		}.bind(child);

		child.getMenuContainerToShow = function () {
			if (this.containerToShow === undefined) {
				if (lm.hasMenuLayout(this) && this.children.length > 0) {
					if (!this.children[0].lifeCycleComplete)this.children[0].remainingLifeCycle();
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


		child.getMenuComponent = function () {
			return topMenu;
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
			topMenu.fireEvent('click', this);
		}.bind(child));

		if (this.view.layout.orientation === 'horizontal' && child.children.length > 0) {
			child.addEvent('click', function () {
				topLm.activate(child);
			}.bind(this));
		} else {
			child.addEvent('click', topLm.hideAllMenus.bind(topLm));
		}

		child.addEvent('enterMenuItem', function () {
			topLm.showMenusFor(child);
			topLm.highlightItemPath(child);
		}.bind(this));
	},
	shownMenus:[],

	activate:function (child) {
		this.active = !this.active;
		if (this.shownMenus.length === 0) {
			ludo.EffectObject.fireEvents();
		}
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
		if (this.view.layout.isContext) {
			this.view.getEl().css('display', 'none');
		}
		this.shownMenus = [];
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
			items[i].getEl().addClass('ludo-menu-item-active');
		}
		this.highlightedItems = items;
	},

	clearHighlightedPath:function (except) {
		except = except || [];
		var items = this.highlightedItems;
		for (var i = 0; i < items.length; i++) {
			if (except.indexOf(items[i]) === -1) {
				items[i].getEl().removeClass('ludo-menu-item-active');
			}
		}
	},

	autoHideMenus:function (e) {
		if (this.active || this.alwaysActive) {
			var parent = jQuery(e.target).parents('.ludo-menu');

			if (e.target.className && e.target.className.indexOf && e.target.className.indexOf('ludo-menu-item') === -1 && parent.length == 0) {
				this.hideAllMenus();
				if (this.view.layout.orientation === 'horizontal') {
					this.active = false;
				}
			}
		}
	}
});