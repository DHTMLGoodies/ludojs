/**
 * @namespace ludo.menu
 * @class ludo.menu.DropDown
 * @augments menu.Menu
 *
 */
ludo.menu.DropDown = new Class({
    Extends:ludo.menu.Menu,
    type:'menu.DropDown',

    __construct:function (config) {
        config.renderTo = document.body;
        this.parent(config);
		this.setConfigParams(config, ['applyTo']);
		this.layout.below = this.layout.below || this.applyTo;
		this.layout.alignLeft = this.layout.alignLeft || this.applyTo;
    },

    ludoEvents:function () {
        this.parent();
        $(document.documentElement).on('click', this.hideAfterDelay.bind(this));
    },

    hideAfterDelay:function () {
        if (!this.isHidden()) {
            this.hide.delay(50, this);
        }
    },

    toggle:function(){
        if(this.isHidden()){
            this.show();
        }else{
            this.hide();
        }
    }
});