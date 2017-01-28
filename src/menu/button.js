/**
 Menu button arrow which you can apply to DOM Element to have a menu drop down
 below it.
 @namespace ludo.menu
 @class ludo.menu.Button
 @param {object} config
 @param {string|HTMLElement} renderTo Render menu button to this DOM node
 @param {boolean} alwaysVisible Button always visible. When false, it will be visible when mouse enters
 @param {string} region Position button in this region. Valid values : 'nw','ne','sw' and 'se'
 @param {object} menu View configuration for menu, example { layout:{}, children:[ { "item 1", "item 2" ]}
 @
 */
ludo.menu.Button = new Class({
    Extends: ludo.Core,
    width: 15,
    // TODO refactor this class

    renderTo: undefined,
    alwaysVisible: false,
    region: 'ne',
    el: undefined,
    menu: undefined,
    menuCreated: false,
    autoPosition: true,
    toggleOnClick: false,

    __construct: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['alwaysVisible', 'region', 'renderTo', 'menu', 'autoPosition', 'toggleOnClick']);
    },

    ludoEvents: function () {
        this.parent();
        this.ludoDOM();
        this.createButtonEvents();
    },

    ludoDOM: function () {
        var el = this.el = jQuery('<div>');
        el.id = 'ludo-menu-button-' + String.uniqueID();
        el.addClass('ludo-menu-button');
        jQuery(this.renderTo).append(el);
        el.css({
            position: 'absolute',
            height: '100%'
        });
        this.createButtonEl();
        this.positionButton();
    },

    createButtonEvents: function () {
        this.buttonEl.on('click', this.toggle.bind(this));
        ludo.EffectObject.addEvent('start', this.hideMenu.bind(this));

        this.buttonEl.mouseenter(this.enterButton.bind(this));
        this.buttonEl.mouseleave(this.leaveButton.bind(this));

        if (!this.alwaysVisible) {
            var el = jQuery(this.renderTo);
            el.on('mouseenter', this.show.bind(this));
            el.on('mouseleave', this.hide.bind(this));
            this.hide();
        } else {
            this.show();
        }
    },

    enterButton: function () {
        this.el.addClass('ludo-menu-button-over');
    },
    leaveButton: function () {
        this.el.removeClass('ludo-menu-button-over');
    },
    toggle: function (e) {
        e.stopPropagation();
        if (this.toggleOnClick && this.menuCreated) {
            this.menu[this.menu.isHidden() ? 'show' : 'hide']();
        } else {
            this.showMenu();
        }
    },

    createButtonEl: function () {
        var el = this.buttonEl = jQuery('<div>');
        el.addClass('ludo-menu-button-arrow');
        this.getEl().append(el);
    },

    positionButton: function () {
        var e = this.getEl();
        var r = this.region;
        if (r == 'ne' || r == 'se')e.css('right', 0);
        if (r == 'nw' || r == 'sw')e.css('left', 0);
        if (r == 'se' || r == 'sw')e.css('bottom', 0);
        if (r == 'ne' || r == 'nw')e.css('top', 0);
    },

    getEl: function () {
        return this.el;
    },

    showMenu: function () {
        if (!this.menuCreated) {
            this.createMenuView();
        }
        if (this.menu._button && this.menu._button !== this.id) {
            var el = ludo.get(this.menu._button);
            if (el)el.hideButton();
        }

        this.menu._button = this.id;
        this.menu.show();

        this.positionMenu();
        this.fireEvent('show', this);
    },

    /*
     This method should be called from function added as event handler to "beforeShow"
     @function cancelShow
     @example
     button.addEvent('beforeShow', function(button){
	 		if(!this.isOkToShowButton()){
	 			button.cancel();
	 		}
	 	});
     */
    cancelShow: function () {
        this.okToShowButton = false;
    },

    hideMenu: function () {
        if (this.menu.hidden)return;
        if (this.menu.hide !== undefined) {
            if (this.menu.getLayout().hideAllMenus)this.menu.getLayout().hideAllMenus();
            this.menu.hide();
        }
        this.hide();
    },

    createMenuView: function () {
        if (this.menu.id) {
            var menu = ludo.get(this.menu.id);
            if (menu)this.menu = menu;
        }
        this.menuCreated = true;
        if (this.menu.getEl === undefined) {
            this.menu.renderTo = document.body;
            this.menu.type = this.menu.type || 'View';
            this.menu.hidden = true;
            this.menu = this.createDependency('menuForButton', this.menu);
            this.menu._button = this.getEl().id;
            jQuery(document.body).on('mouseup', this.autoHideMenu.bind(this));
        } else {
            jQuery(document.body).append(this.menu.getEl());
        }

        this.menu.addEvent('show', this.showIf.bind(this));
        this.menu.addEvent('hide', this.hideButton.bind(this));
        this.menu.getEl().css('position', 'absolute');
        this.menu.getEl().addClass('ludo-menu-button-menu');
    },

    positionMenu: function () {
        if (this.autoPosition) {

            var pos = this.el.offset();
            this.menu.resize({
                left: pos.left,
                top: pos.top + this.el.height()
            });
        }
    },

    showIf: function () {
        if (this.menu._button === this.id) {
            this.show();
        }
    },

    okToShowButton: false,

    show: function () {
        this.okToShowButton = true;
        /*
         * Event fired before button is shown. You can use this event and call
         * the cancel method if there are situations where you don't always want to show the button
         * @event beforeShow
         * @param {menu.Button} this
         */
        this.fireEvent('beforeShow', this);

        if (this.okToShowButton) {
            this.buttonEl.css('display', '');
            this.el.addClass('ludo-menu-button-active');
        }
    },

    hide: function () {
        if (this.menu === undefined || this.menu.isHidden === undefined || this.menu.isHidden()) {
            this.hideButton();
        } else if (this.menu._button !== this.id) {
            this.hideButton();
        }
    },

    hideButton: function () {
        if (this.alwaysVisible)return;
        this.buttonEl.css('display', 'none');
        this.el.removeClass('ludo-menu-button-active');
    },
    getMenuView: function () {
        return this.menu;
    },

    autoHideMenu: function (e) {
        if (!this.menu || this.menu.hidden)return;
        if (!ludo.dom.isInFamilies(e.target, [this.el.id, this.menu.getEl().id])) {
            this.hideMenu();
            this.hideButton();
        }
    }
});