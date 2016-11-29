/**
 * Basic dialog class and base class for all other dialogs. This class extends
 * <a href="ludo.Window.html">ludo.Window</a>.
 * @class ludo.dialog.Dialog
 * @param {object} config
 * @param {Boolean} config.modal True to make the window modal, default: true
 * @param {Boolean} config.autoRemove True to destroy the dialog on close. Will remove the dialog from the DOM. Default: true
 * @param {String} config.buttonConfig Camel case string config for buttons. example: YesNoCancel for three buttons labeled "Yes", "No" and "Cancel"
 * @param {Boolean} config.autoHideOnBtnClick. True to automatically hide the dialog on click on one of the buttons.
 * @fires ludo.dialog.Dialog#buttonName buttonName will be the lowercase value of the button without spaces. Example: Button "Yes" will fire a "yes" event.
 * @augments ludo.Window
 * @example
 new ludo.dialog.Dialog({
              html : 'Do you want to save your work?',
               buttonConfig : 'YesNoCancel'
               listeners : {
                   'yes' : function(){ this.saveWork() },
                   'no' : function() { this.discardWork() }
               }
          });
 */
ludo.dialog.Dialog = new Class({
	Extends:ludo.Window,
	type:'dialog.Dialog',
	modal:true,
	autoRemove:true,
	autoHideOnBtnClick:true,
	buttonConfig:undefined,
	movable:true,
	closable:false,
	minimizable:false,

	__construct:function (config) {
		// TODO use buttons instead of buttonConfig and check for string
		config.buttonConfig = config.buttonConfig || this.buttonConfig;
		if (config.buttonConfig) {
			var buttons = config.buttonConfig.replace(/([A-Z])/g, ' $1');
			buttons = buttons.trim();
			buttons = buttons.split(/\s/g);
			config.buttons = [];
			for (var i = 0; i < buttons.length; i++) {
				config.buttons.push({
					value:buttons[i]
				});
			}
		}
		this.parent(config);
        this.setConfigParams(config, ['modal','autoRemove','autoHideOnBtnClick']);
	},

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-dialog');
	},

    getShim:function(){
        if(this.els.shim === undefined){
            var el = this.els.shim = ludo.dom.create({
                cls : 'ludo-dialog-shim',
                renderTo:document.body
            });
            el.css('display', 'none');
        }
        return this.els.shim;
    },

	ludoEvents:function () {
		this.parent();
		if (this.isModal()) {
			this.getEventEl().on('resize', this.resizeShim.bind(this));
		}
	},

	__rendered:function () {
		this.parent();
		if (!this.isHidden()) {
            this.center();
			this.showShim();
		}
		var buttons = this.getButtons();

		for (var i = 0; i < buttons.length; i++) {
			buttons[i].addEvent('click', this.buttonClick.bind(this));
		}
	},

	isModal:function () {
		return this.modal;
	},
	show:function () {

        this.showShim();
		this.parent();

	},

	hide:function () {
		this.parent();
		this.hideShim();
		if (this.autoRemove) {
			this.remove.delay(1000, this);
		}
	},

	showShim:function () {
        this.center();
		if (this.isModal()) {
			this.getShim().css({
				display:'',
				'z-index' : this.getEl().css('z-index') -1
			});
			this.resizeShim();
		}
	},

	resizeShim:function () {
		var b = $(document.body);
		var size = { x: b.width(), y: b.height() };
        this.getShim().css('width',  size.x);
        this.getShim().css('height',  size.y + 'px');
	},

	hideShim:function () {
		if (this.isModal()) {
            this.getShim().css('display', 'none');
		}
	},

	buttonClick:function (value, button) {

		this.fireEvent(button._get().replace(/\s/g, '').toLowerCase(), this);
		if (this.autoHideOnBtnClick) {
			this.hide();
		}
	}
});