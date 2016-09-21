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
	 * @optional
	 * @default true
	 */
	modal:true,
	/**
	 * Auto dispose/erase component on close
	 * @attribute {Boolean} autoDispose
	 * @optional
	 * @default true
	 */
	autoDispose:true,
	/**
	 * Auto hide component on button click. If autoDispose is set to true, the component
	 * will be deleted
	 * @attribute {Boolean} autoHideOnBtnClick
	 * @optional
	 * @default true
	 */
	autoHideOnBtnClick:true,

	/**
	  Camel case string config for buttons.<br>
	  example: YesNoCancel for three buttons labeled "Yes", "No" and "Cancel"<br>
	  Example of use: <br>

	  @attribute {String} buttonConfig
	  @default undefined
      @example
         new ludo.dialog.Dialog({
              html : 'Do you want to save your work?',
               buttonConfig : 'YesNoCancel'
               listeners : {
                   'yes' : this.saveWork.bind(this),
                   'no' : this.discardWork.bind(this),
                   'cancel' : this.hide.bind(this)
               }
          });
	 */
	buttonConfig:undefined,


	movable:true,
	closable:false,
	minimizable:false,

	ludoConfig:function (config) {
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
        this.setConfigParams(config, ['modal','autoDispose','autoHideOnBtnClick']);
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
			this.getEventEl().addEvent('resize', this.resizeShim.bind(this));
		}
	},

	ludoRendered:function () {
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
		if (this.autoDispose) {
			this.dispose.delay(1000, this);
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
		var size = document.body.getSize();
        this.getShim().css('width',  size.x);
        this.getShim().css('height',  size.y + 'px');
	},

	hideShim:function () {
		if (this.isModal()) {
            this.getShim().css('display', 'none');
		}
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