/**
 * Class for menu items. MenuItems are created dynamically from config object(children of ludo.menu.Menu or ludo.menu.Context)
 * @namespace ludo.menu
 * @class ludo.menu.MenuItem
 * @param {Object} config
 * @param {String} config.icon Path to Icon for the menu item. If no period sign(.) is found in the icon, the text will be displayed
 * where the icon should be. example: icon: "myicon.png" to display the icon image, or icon: "!" to display the exclamation mark.
 * @param {Boolean} disabled True to initially disable the menu item
 * @param {String} label Text for the menu item
 * @param {String} action Useful when adding click events to the parent menu. Determine what to do based on the clicked menu item's action attribute.
 * @param {String} orientation Useful when adding click events to the parent menu. Determine what to do based on the clicked menu item's action attribute.
 * @param {Boolean} spacer Spacer menu item. Creates a non-clickable spacer between menu items.
 * @fires ludo.menu.item#click Fired on click. Arguments: 1) ludo.menu.Item
 * @augments View
 */
ludo.menu.Item = new Class({
    Extends:ludo.View,
    type:'menu.Item',
    menu:null,
    subMenu:null,
    menuItems:[],
    spacer:undefined,

    icon:undefined,
    orientation:'vertical',
    disabled:false,

    label:'',

    action:undefined,
    record:undefined,

    /*
     * Fire an event with this name on click
     * @config {String} fire
     * @default undefined
     */
    fire:undefined,

    __construct:function (config) {

        this.parent(config);
        this.setConfigParams(config, ['orientation', 'icon', 'record', 'value', 'label', 'action', 'disabled', 'fire']);

        this._html = this._html || this.label;

        if(this._html == '|')this.spacer = true;

        if (this.spacer) {
            this.layout.height = 1;
		}else{
			this.layout.height = this.layout.height || this.orientation === 'vertical' ? 'wrap' : 'matchParent';
        }

    },

    ludoEvents:function () {
        this.parent();
        if (!this.isSpacer()) {
            this.getEl().on("click", this.click.bind(this));
            this.getEl().mouseenter(this.mouseOver.bind(this));
            this.getEl().mouseleave(this.mouseOut.bind(this));
        }
    },

    resizeDOM:function(){
        this.parent();
        this.$b().css('lineHeight', this.$b().height + 'px');
    },
	resizeParent:function(){

	},

    ludoDOM:function () {
        this.parent();
        this.getEl().addClass('ludo-menu-item');

        if (this.isSpacer()) {
            if (this.orientation === 'horizontal') {
                this.getEl().css('width', 1);
            }
            this.getEl().addClass('ludo-menu-item-spacer-' + this.orientation);
        }

        this.getEl().addClass('ludo-menu-item-' + this.orientation);

        if (this.icon) {
            this.createIcon();
        }

        if (this.disabled) {
            this.disable();
        }

		if(this.children.length){
			var el = this.els.expand = jQuery('<div>');
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

    __rendered:function () {
        this.parent();
        if (this.isSpacer()) {
            this.$b().css('visibility', 'hidden');
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
     * @function disable
     * @return void
     * @memberof ludo.menu.Item.prototype
     */
    disable:function () {
        this.disabled = true;
        this.getEl().addClass('ludo-menu-item-disabled');
    },

    /**
     * Return disable state of menu item
     * @function isDisabled
     * @return {Boolean} disabled
     * @memberof ludo.menu.Item.prototype
     */
    isDisabled:function () {
        return this.disabled;
    },

    /**
     * Enable menu item
     * @function enable
     * @return void
     * @memberof ludo.menu.Item.prototype
     */
    enable:function () {
        this.disabled = false;
        this.getEl().removeClass('ludo-menu-item-disabled');
    },

    createIcon:function () {
        var el = this.els.icon = jQuery('<div class="ludo-menu-item-icon">');
        el.css({
            'background-position':'center center',
            'background-repeat':'no-repeat',
            'position':'absolute',
            'text-align':'center',
            'left':0,
            'top':0,
            'height':'100%'
        });
        if (this.icon.indexOf('.') >= 0) {
            el.css('background-image', 'url(' + this.icon + ')');
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