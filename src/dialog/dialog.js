/**
 * Basic dialog class and base class for all other dialogs
 * @namespace dialog
 * @class dialog.Dialog
 * @extends Window
 */
ludo.dialog.Dialog = new Class({
	Extends:ludo.Window,
	type:'dialog.Dialog',
	/**
	 * Show modal version of dialog
	 * @attribute {Boolean} modal
	 * @default true
	 */
	modal:true,
	/**
	 * Auto dispose/erase component on close
	 * @attribute {Boolean} autoDispose
	 * @default true
	 */
	autoDispose:true,
	/**
	 * Auto hide component on button click. If autoDispose is set to true, the component
	 * will be deleted
	 * @attribute {Boolean} autoHideOnBtnClick
	 * @default true
	 */
	autoHideOnBtnClick:true,

	/**
	 * Camelcase string config for buttons.<br>
	 * example: YesNoCancel for three buttons labeled "Yes", "No" and "Cancel"<br>
	 * Example of use: <br>
	 * new ludo.dialog.Dialog({<br>
     *      html : 'Do you want to save your work?',<br>
     *      buttonConfig : 'YesNoCancel'<br>
     *      listeners : {<br>
     *          'yes' : this.saveWork.bind(this),<br>
     *          'no' : this.discardWork.bind(this),<br>
     *          'cancel' : this.hide.bind(this)   <br>
     *      }
     * });
	 * @attribute {String} buttonConfig
	 * @default undefined
	 */
	buttonConfig:undefined,


	movable:true,
	closable:false,
	minimizable:false,
	fullScreen:false,

	ludoConfig:function (config) {

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
		if (config.modal !== undefined) this.modal = config.modal;
		if (config.autoDispose !== undefined)this.autoDispose = config.autoDispose;
		if (config.autoHideOnBtnClick !== undefined) this.autoHideOnBtnClick = config.autoHideOnBtnClick;
	},

	ludoDOM:function () {
		this.parent();
		if (this.isModal()) {
			var el = this.els.shim = new Element('div');
			ludo.dom.addClass(el, 'ludo-dialog-shim');
			el.setStyle('display', 'none');
			document.body.adopt(el);
		}
		this.getEl().addClass('ludo-dialog');
	},

	ludoEvents:function () {
		this.parent();
		if (this.isModal()) {
			this.getEventEl().addEvent('resize', this.resizeShim.bind(this));
		}
	},

	ludoRendered:function () {
		this.parent();
		if (!this.isHidden()) {
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
		this.parent();
		this.showShim();
	},

	hide:function () {
		this.parent();
		this.hideShim();
		if (this.autoDispose) {
			this.dispose.delay(100, this);
		}
	},

	showShim:function () {
		this.center();
		if (this.isModal()) {
			this.els.shim.setStyles({
				display:'',
				'z-index':this.getEl().getStyle('z-index') - 1
			});
			this.resizeShim();
		}
	},

	resizeShim:function () {
		var size = document.body.getSize();
		this.els.shim.style.width = size.x + 'px';
		this.els.shim.style.height = size.y + 'px';
	},

	hideShim:function () {
		if (this.isModal()) {
			this.els.shim.setStyle('display', 'none');
		}
	},

	center:function () {
		var size = document.body.getSize();
		this.setPosition({
			left:Math.round(size.x / 2) - Math.round(this.getWidth() / 2),
			top:Math.round(size.y / 2) - Math.round(this.getHeight() / 2)
		})
	},

	buttonClick:function (value, button) {
		/**
		 * This event is fired when a button is clicked.
		 * The name of the button is lowercase version of button value with white space removed
		 * Example: for a button with value "OK", an "ok" event will be sent.
		 *
		 * @event <lowercase button value>
		 * @param {Object} ludo.View (Parent component of button)
		 */
		this.fireEvent(button.getValue().replace(/\s/g, '').toLowerCase(), this);
		if (this.autoHideOnBtnClick) {
			this.hide();
		}
	}
});