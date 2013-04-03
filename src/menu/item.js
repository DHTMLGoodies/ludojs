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
     @config {String} icon
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
     * @config {Boolean} disabled
     * @default false
     */
    disabled:false,
    menuHandler:undefined,
    parentMenuItem:undefined,
    value:undefined,
    /**
     * Text for menu item
     * @config {String} label
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
            for(var i=0;i<config.children.length;i++){
                if(ludo.util.isString(config.children[i])){
                    config.children[i] = { html : config.children[i] };
                }
                config.children[i].hidden = true;
            }
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
            this.getEl().addEvents({
                'click' : this.click.bind(this),
                'mouseenter' : this.mouseOver.bind(this),
                'mouseleave' : this.mouseOut.bind(this)
            });
        }
    },

    ludoDOM:function () {
        this.parent();
        ludo.dom.addClass(this.getEl(), 'ludo-menu-item');
        this.getBody().setStyle('cursor', 'pointer');

        if (this.isSpacer()) {
            if (this.menuDirection === 'horizontal') {
                this.getEl().setStyle('width', 1);
            }
            ludo.dom.addClass(this.getEl(), 'ludo-menu-item-spacer-' + this.menuDirection);
        }

        ludo.dom.addClass(this.getEl(), 'ludo-menu-item-' + this.menuDirection);

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

    ludoRendered:function () {
        this.parent();
        if (this.isSpacer()) {
            this.getBody().setStyle('visibility', 'hidden');
        }
    },

    click:function () {
        if (this.disabled) {
            return;
        }
        ludo.dom.addClass(this.getEl(), 'ludo-menu-item-down');
        this.fireEvent('click', this);
        if (this.fire)this.fireEvent(this.fire, this);
    },



    select:function () {
        ludo.dom.addClass(this.getEl(), 'ludo-menu-item-selected');
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
        ludo.dom.addClass(this.getEl(), 'ludo-menu-item-disabled');
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
        var el = this.els.icon = new Element('div');
        ludo.dom.addClass(el, 'ludo-menu-item-icon');
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
            el.set('html', this.icon);
        }
        this.getEl().adopt(el);
    },

    mouseOver:function () {
        if (!this.disabled) {
            ludo.dom.addClass(this.getEl(), 'ludo-menu-item-over');
            this.fireEvent('enterMenuItem', this);
        }
    },

    mouseOut:function () {
        if (!this.disabled) {
            this.getEl().removeClass('ludo-menu-item-over');
            this.getEl().removeClass('ludo-menu-item-down');
            this.fireEvent('leaveMenuItem', this);
        }
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
        this.menuHandler.showMenu(this);
    },

    getMenuDirection:function () {
        return this.menuDirection;
    }
});