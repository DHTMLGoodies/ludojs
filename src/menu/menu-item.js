/**
 * Class for menu items. MenuItems are created dynamically from config object(children of ludo.menu.Menu or ludo.menu.Context)
 * @namespace menu
 * @class MenuItem
 * @extends View
 */
ludo.menu.Item = new Class({
    Extends:ludo.View,
    type:'menu.Item',
    menu:null,
    subMenu:null,
    menuItems:[],
    spacer:undefined,
    /**
     Path to menu item icon or text placed in the icon placeholder. If icon contains one
     or more periods(.) it will be consider an image. Otherwise, config.icon will be displayed
     as plain text
     @Attribute icon
     @type String
     @default undefined
     @example
     icon: 'my-icon.jpg'
     Sets icon to my-icon.jpg
     @example
     icon : '!'
     sets icon to the character "!", i.e. text
     */
    icon:undefined,
    expandSubMenuOnClick:true,
    menuDirection:'horizontal',
    /**
     * Initially disable the menu item
     * @attribute {Boolean} disabled
     * @default false
     */
    disabled:false,
    menuHandler:undefined,
    parentMenuItem:undefined,
    value:undefined,
    /**
     * Text for menu item
     * @attribute label
     * @type String
     * @default '' empty string
     */
    label:'',
    /**
     * Useful property if you want to apply only one click event for the menu
     * and then determine which menu item was clicked. example:
     *
     * switch(menuItem.action){
     *
     *
     *
     * }
     *
     * @Attribute {String} action
     * @type String
     * @default undefined
     */
    action:undefined,
    record:undefined,

    /**
     * Fire an event with this name on click
     * @config {String} fire
     * @default undefined
     */
    fire:undefined,

    ludoConfig:function (config) {
        if (config.children) {
            this.menuItems = config.children;
            config.children = [];
        }
        this.setConfigParams(config, ['menuDirection', 'icon', 'record', 'value', 'label', 'action', 'disabled', 'fire']);

        config.html = config.html || config.label;
        if (config.html === '|') {
            this.spacer = true;
        }
        if (this.label && !this.html) {
            this.html = this.label;
        }
        this.parent(config);
    },

    ludoEvents:function () {
        this.parent();
        if (!this.isSpacer()) {
            this.getEl().on('click', this.click.bind(this));
            this.mouseenter(this.mouseOver.bind(this));
            this.gmouseleave(this.mouseOut.bind(this));
        }
    },

    ludoDOM:function () {
        this.parent();
        this.createMenu();
        this.registerMenuHandler();

        this.getEl().addClass('ludo-menu-item');
        this.getBody().css('cursor', 'pointer');

        if (this.isSpacer()) {
            if (this.menuDirection === 'horizontal') {
                this.getEl().css('width', 1);
            }
            this.getEl().addClass('ludo-menu-item-spacer-' + this.menuDirection);
        }

        if (this.getParent()) {
            this.getEl().addClass('ludo-menu-item-' + this.menuDirection);
        }

        if (this.icon) {
            this.createIcon();
        }

        if (this.disabled) {
            this.disable();
        }
    },

    getLabel:function () {
        return this.label;
    },

    getRecord:function () {
        return this.record;
    },
    registerMenuHandler:function () {
        var rootMenuComponent = this.getRootMenuComponent();
        if (rootMenuComponent && rootMenuComponent.getMenuHandler) {
            this.menuHandler = rootMenuComponent.getMenuHandler();
            if (this.menuHandler) {
                this.menuHandler.addChild(this, this.menu, this.getParentMenuItem());
            }
        }

    },

    ludoRendered:function () {
        this.parent();
        if (this.isSpacer()) {
            this.getBody().setStyle('visibility', 'hidden');
        }
        this.parentMenuItem = this.getParentMenuItem();
    },

    click:function () {
        if (this.disabled) {
            return;
        }
        this.getEl().addClass('ludo-menu-item-down');
        this.fireEvent('click', this);
        if (this.fire)this.fireEvent(this.fire, this);
        var rootMenu = this.getRootMenuComponent();
        if (rootMenu) {
            rootMenu.click(this);
        }
        if (!this.parentMenuItem) {
            this.menuHandler.toggleActive(this);
        }
    },
    select:function () {
        this.getEl().addClass('ludo-menu-item-selected');
    },

    deselect:function () {
        this.getEl().removeClass('ludo-menu-item-selected');
    },

    /**
     * Disable menu item
     * @method disable
     * @return void
     */
    disable:function () {
        this.disabled = true;
        this.getEl().addClass('ludo-menu-item-disabled');
    },

    /**
     * Return disable state of menu item
     * @method isDisabled
     * @return {Boolean} disabled
     */
    isDisabled:function () {
        return this.disabled;
    },

    /**
     * Enable menu item
     * @method enable
     * @return void
     */
    enable:function () {
        this.disabled = false;
        this.getEl().removeClass('ludo-menu-item-disabled');
    },

    createIcon:function () {
        var el = this.els.icon = $('<div>');
        el.addClass('ludo-menu-item-icon');
        el.setStyles({
            'background-position':'top center',
            'background-repeat':'no-repeat',
            'position':'absolute',
            'text-align':'center',
            'left':0,
            'top':0,
            'height':'100%'
        });
        if (this.icon.indexOf('.') >= 0) {
            el.setStyle('background-image', 'url(' + this.icon + ')');
        } else {
            el.html( this.icon);
        }
        this.getEl().append(el);
    },

    mouseOver:function () {
        if (!this.disabled) {
            this.getEl().addClass('ludo-menu-item-over');
            this.showMenu();
        }
    },

    mouseOut:function () {
        if (!this.disabled) {
            this.getEl().removeClass('ludo-menu-item-over');
            this.getEl().removeClass('ludo-menu-item-down');
        }
    },
    createMenu:function () {
        if (this.menuItems.length === 0) {
            return;
        }
        this.menu = new ludo.menu.Menu({
            renderTo:document.body,
            direction:'vertical',
            children:this.menuItems,
            parentMenuItem:this
        });
        this.menu.hide();

        var el = this.els.expand = $('<div>');
        el.addClass('ludo-menu-item-expand');
        el.addClass('-expand');
        this.getEl().append(el);

    },

    getMeasuredWidth:function () {
        if (this.isSpacer()) {
            return ludo.dom.getTotalWidthOf(this.getEl());
        }
        return this.parent();
    },

    isSpacer:function () {
        return this.spacer;
    },

    showMenu:function () {
        if(this.menuHandler)this.menuHandler.showMenu(this);
    },

    getMenuDirection:function () {
        return this.menuDirection;
    },

    getRootMenuComponent:function () {
        var el;
        if (el = this.getParent()) {
            if (el.isMenu !== undefined) {
                if (el.parentMenuItem) {
                    return el.parentMenuItem.getRootMenuComponent();
                }
                return el;
            }
            return this;
        }
        return undefined;
    },

    getParentMenuItem:function () {
        var el;
        if (el = this.getParent()) {
            if (el.isMenu) {
                if (el.parentMenuItem) {
                    return el.parentMenuItem;
                }
            }
        }
        return null;
    }
});