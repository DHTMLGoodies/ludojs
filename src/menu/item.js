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
    orientation:'vertical',
    /**
     * Initially disable the menu item
     * @config {Boolean} disabled
     * @default false
     */
    disabled:false,

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
        this.parent(config);
        this.setConfigParams(config, ['orientation', 'icon', 'record', 'value', 'label', 'action', 'disabled', 'fire']);

        this.html = this.html || this.label;
        if (this.html === '|') {
            this.spacer = true;
            this.layout.height = 1;
		}else{
			this.layout.height = this.layout.height || this.orientation === 'vertical' ? 25 : 'matchParent';
        }

    },

    ludoEvents:function () {
        this.parent();
        if (!this.isSpacer()) {
            this.getEl().on("click", this.click.bind(this));
            this.mouseenter(this.mouseOver.bind(this));
            this.mouseleave(this.mouseOut.bind(this));
        }
    },

    resizeDOM:function(){
        this.parent();
        this.getBody().style.lineHeight = this.cachedInnerHeight + 'px';
    },
	resizeParent:function(){

	},

    ludoDOM:function () {
        this.parent();
        this.getEl().addClass('ludo-menu-item');

        if (this.isSpacer()) {
            if (this.orientation === 'horizontal') {
                this.getEl().setStyle('width', 1);
            }
            ludo.dom.addClass(this.getEl(), 'ludo-menu-item-spacer-' + this.orientation);
        }

        ludo.dom.addClass(this.getEl(), 'ludo-menu-item-' + this.orientation);

        if (this.icon) {
            this.createIcon();
        }

        if (this.disabled) {
            this.disable();
        }

		if(this.children.length){
			var el = this.els.expand = $('<div>');
		    el.addClass('ludo-menu-item-expand');
		    el.addClass('-expand');
		    this.getEl().append(el);
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
        this.getEl().addClass('ludo-menu-item-down');
        this.fireEvent('click', this);
        if (this.fire)this.fireEvent(this.fire, this);
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
            'background-position':'center center',
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
        }
        this.fireEvent('enterMenuItem', this);
    },

    mouseOut:function () {
        if (!this.disabled) {
            this.getEl().removeClass('ludo-menu-item-over');
            this.getEl().removeClass('ludo-menu-item-down');
            this.fireEvent('leaveMenuItem', this);
        }
    },

    isSpacer:function () {
        return this.spacer;
    },

    showMenu:function () {
        this.menuHandler.showMenu(this);
    }
});