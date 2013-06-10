/**
 Class for providing short messages and feedback in a small popup.
 Notifications automatically disappear after a timeout. Positioning
 of notification can be configured using the layout object.

 @class Notification
 @extends View
 @constructor
 @param {Object} config
 @example
 	new ludo.Notification({
 		html : 'Your e-mail has been sent',
 		duration:4
	});
 */
ludo.Notification = new Class({
	Extends:ludo.View,
	alwaysInFront:true,
	/**
	 * Seconds before notification is automatically hidden
	 * @config {Number} duration
	 * @default 3
	 */
	duration:3,

	/**
	 * Use an effect when notification is shown
	 * Possible values: fade, slide
	 * @config {String} effect
	 * @default undefined
	 */
	showEffect:undefined,
	/**
	 * Use an effect when notification is hidden
	 * Possible values: fade, slide
	 * @config {String} effect
	 * @default undefined
	 */
	hideEffect:undefined,
	/**
	 * Effect used for both show and hide. Individual effects can be set by
	 * defining showEffect and hideEffect
	 * Possible values: fade, slide
	 * @config {String} effect
	 * @default 'fade'
	 */
	effect:'fade',
	/**
	 * Duration of animation effect
	 * @config {Number} effectDuration
	 * @default 1
	 */
	effectDuration:1,

	/**
	 * true to dispose/erase notification on hide
	 * @config {Boolean} autoDispose
	 * @default false
	 */
	autoDispose:false,

	ludoConfig:function (config) {
		config.renderTo = config.renderTo || document.body;

        this.setConfigParams(config, ['autoDispose','showEffect','hideEffect','effect','effectDuration','duration']);
		this.showEffect = this.showEffect || this.effect;
		this.hideEffect = this.hideEffect || this.effect;
		if (!config.layout && !this.layout) {
			config.layout = {
				centerIn:config.renderTo
			};
		}
		this.parent(config);
	},

	ludoEvents:function(){
		this.parent();
		if(this.autoDispose){
			this.addEvent('hide', this.dispose.bind(this));
		}
	},

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-notification');
	},

	ludoRendered:function () {
		if (!this.layout.width || !this.layout.height) {
			var size = ludo.dom.getWrappedSizeOfView(this);
			if (!this.layout.width)this.layout.width = size.x;
			if (!this.layout.height)this.layout.height = size.y;
		}
		this.parent();
		this.show();
	},

	hide:function () {
		if (this.hideEffect) {
			var effect = new ludo.effect.Effect();
			effect[this.getEndEffectFn()](
				this.getEl(),
				this.effectDuration,
				this.onHideComplete.bind(this),
				this.getLayout().getRenderer().getPosition()
			);
		} else {
			this.parent();
		}
	},

	show:function () {
		this.parent();

		if (this.showEffect) {
			var effect = new ludo.effect.Effect();
			effect[this.getStartEffectFn()](
				this.getEl(),
				this.effectDuration,
				this.autoHide.bind(this),
				this.getLayout().getRenderer().getPosition()
			);
		}

	},

	getStartEffectFn:function () {
		switch (this.showEffect) {
			case 'fade':
				return 'fadeIn';
			case 'slide':
				return 'slideIn';
			default:
				return this.showEffect;
		}
	},

	getEndEffectFn:function () {
		switch (this.hideEffect) {
			case 'fade':
				return 'fadeOut';
			case 'slide':
				return 'slideOut';
			default:
				return this.hideEffect;
		}
	},

	autoHide:function () {
		this.hide.delay(this.duration * 1000, this);
	},

	onHideComplete:function () {
		this.getEl().style.display = 'none';
		this.fireEvent('hide', this);
	}
});