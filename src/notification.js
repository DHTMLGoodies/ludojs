/**
 Class for providing short messages and feedback in a popup.
 Notifications automatically disappear after a timeout. Positioning
 of notification can be configured using the layout object.

 Custom CSS styling can be done by adding styles to the .ludo-notification class.
 
 @class ludo.Notification
 @augments ludo.View
 @param {Object} config
 @param {String} config.html Message to display
 @param {Number} config.duration Seconds before notification is automatically hidden. Default is 3
 @param {String} config.effect Default effect used for displaying and hiding the notification. Default: fade
 @param {String} config.showEffect Effect used when Notification is displayed(fade or slide)
 @param {String} config.hideEffect Effect used when Notification is hidden(fade or slide)
 @param {Number} config.effectDuration Duration of show/hide effect in seconds. Default: 1
 @param {Boolean} config.autoRemove True to automatically remove the view from DOM when hiding it.
 @example

 new ludo.Notification({
	html : 'Your e-mail has been sent', // message
	duration:4 // Hidden after 4 seconds
});

 new ludo.Notification({
 	html: 'Hello there!',
 	layout:{ // Position right of other view
 		rightOf:'idOfOtherView',
 		alignTop:'idOfOtherView'
 	},
 	autoRemove:true // Automatically remove from DOM when hidden
 });
 */
ludo.Notification = new Class({
	Extends:ludo.View,
	alwaysInFront:true,

	duration:3,
	showEffect:undefined,
	hideEffect:undefined,
	effect:'fade',
	effectDuration:0.4,
	autoRemove:true,

	__construct:function (config) {
		config.renderTo = config.renderTo || document.body;
		
        this.setConfigParams(config, ['autoRemove','showEffect','hideEffect','effect','effectDuration','duration']);
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
		if(this.autoRemove){
			this.addEvent('hide', this.remove.bind(this));
		}
	},

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-notification');
	},

	__rendered:function () {
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
				this.getLayout().getRenderer().position()
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
				this.getLayout().getRenderer().position()
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
		this.getEl().css('display', 'none');
		this.fireEvent('hide', this);
	}
});