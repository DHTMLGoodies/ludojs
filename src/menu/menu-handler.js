ludo.menu.MenuHandler = new Class({
    items:{},
    menus:[],
    initialItems:[],
    itemPrepared:false,
    isActive:true,
    alwaysActive:true,

    addChild:function (item, menu, parentMenuItem) {
        if (parentMenuItem && parentMenuItem.menuDirection === 'horizontal') {
            this.isActive = false;
            this.alwaysActive = false;
        }
        this.initialItems.push({
            id:item.getId(),
            label : item.label,
            menu:menu ? [menu.getId()] : null,
            parent:parentMenuItem ? parentMenuItem.getId() : null
        });
        item.addEvent('click', this.hideMenus.bind(this));
    },

    toggleActive:function (menuItem) {
        if (this.alwaysActive) {
            return;
        }
        this.isActive = !this.isActive;
        if (this.isActive) {
            this.showMenu(menuItem);
        } else {
            this.hideMenus();
        }
    },

    prepareItems:function () {
        for (var i = this.initialItems.length - 1; i >= 0; i--) {
            var item = this.initialItems[i];
            item.menu = item.menu || [];
            this.items[item.id] = {
                label:ludo.get(item.id).label,
                menus:this.getParentMenus(item.parent).concat(item.menu),
                item:item.id
            };

            this.menus = this.menus.concat(this.items[item.id].menus);
        }
        this.itemPrepared = true;

        document.id(document.documentElement).addEvent('click', this.autoHideMenus.bind(this));
    },

    getParentMenus:function (item) {
        if (item && this.items[item]) {
            return this.items[item].menus || [];
        }
        return [];
    },

    showMenu:function (menuItem) {
        if (!this.isActive) {
            return;
        }
        if (!this.itemPrepared) {
            this.prepareItems();
        }
        this.hideMenus();
        var menus = this.items[menuItem.getId()].menus;

        for (var i = 0; i < menus.length; i++) {
            ludo.getView(menus[i]).show();
        }
    },

    hideMenus:function () {
        for (var i = 0; i < this.menus.length; i++) {
            ludo.getView(this.menus[i]).hide();
        }
    },

    autoHideMenus:function (e) {
        if (this.isActive) {
            var el = e.target;
            if (el.className.indexOf('ludo-menu-item') >= 0) {
                return;
            }
            if (!el.getParent('.ludo-menu')) {
                this.hideMenus();
                this.setInactive();
            }
        }
    },

    setInactive:function () {
        if (!this.alwaysActive) {
            this.isActive = false;
        }
    }
});