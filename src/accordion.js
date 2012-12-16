/**
 * @class Accordion
 * @extends RichView
 * @description Accordion component
 */
ludo.Accordion = new Class({
	Extends:ludo.RichView,
	type:'Accordion',

	closable:false,
	fullScreen:false,
	minimizable:true,
	resizable:false,

	heightBeforeMinimize:undefined,
	slideInProgress:false,
	fx:null,
	fxContent:null,
	minimized:false,
	titleBar:true,

	ludoConfig:function (config) {
		if (!config.height) {
			config.height = 'auto';
		}

		this.parent(config);
	},

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-accordion');
	},
	ludoRendered:function () {
		this.fx = new Fx.Morph(this.getEl(), {
			duration:100
		});
		this.fxContent = new Fx.Morph(this.getBody(), {
			duration:100
		});
		this.fx.addEvent('complete', this.animationComplete.bind(this));

		var titleBar = this.getTitleBarEl();
		titleBar.addEvent('click', this.toggleExpandCollapse.bind(this));
		this.parent();
	},
	toggleExpandCollapse:function () {
		if (this.state.isMinimized) {
			this.maximize();
		} else {
			this.minimize();
		}
	},
	/**
	 * Maximize accordion component
	 * @method maximmize
	 * @return void
	 */
	maximize:function () {
		if (this.slideInProgress)return;
		this.slideInProgress = true;
		this.state.isMinimized = false;

		this.showAllHandles();

		this.fx.start({
			'height':[this.getHeightOfTitleBar(), this.heightBeforeMinimize]
		});
		this.fxContent.start({
			'margin-top':[this.getBody().getStyle('margin-top'), 0]
		});
		this.cssMaxMinButton();
	},
	/**
	 * Minimize accordion component
	 * @method minimize
	 * @return void
	 */
	minimize:function () {
		if (this.slideInProgress)return;
		this.heightBeforeMinimize = this.getEl().getSize().y - ludo.dom.getBH(this.getEl()) - ludo.dom.getPH(this.getEl());
		this.slideInProgress = true;

		this.state.isMinimized = true;
		this.hideResizeHandles();

		this.fx.start({
			'height':[this.heightBeforeMinimize, this.getHeightOfTitleBar()]
		});

		this.fxContent.start({
			'margin-top':[ 0, (this.heightBeforeMinimize - this.getHeightOfTitleBar()) * -1 ]
		});
		this.cssMaxMinButton();

	},

	animationComplete:function () {
		this.slideInProgress = false;
	}

});