/**
 * @class Accordion
 * @extends FramedView
 * @description Accordion component
 */
ludo.Accordion = new Class({
	Extends:ludo.FramedView,
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

        this.getTitleBarEl().addEvent('click', this.toggleExpandCollapse.bind(this));
		this.parent();
	},
	toggleExpandCollapse:function () {
        this.state.isMinimized ? this.maximize() : this.minimize();
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

        this.showResizeHandles();
		this.fx.start({
			'height':[this.getHeightOfTitleBar(), this.heightBeforeMinimize]
		});
		this.fxContent.start({
			'margin-top':[this.getBody().getStyle('margin-top'), 0]
		});
		this.fireEvent('maximize', this);
	},
	/**
	 * Minimize accordion component
	 * @method minimize
	 * @return void
	 */
	minimize:function () {
		if (this.slideInProgress)return;
		this.heightBeforeMinimize = this.getEl().offsetHeight - ludo.dom.getBH(this.getEl()) - ludo.dom.getPH(this.getEl());
		this.slideInProgress = true;

		this.state.isMinimized = true;
		this.hideResizeHandles();
        var h = this.getHeightOfTitleBar();
		this.fx.start({
			'height':[this.heightBeforeMinimize, h]
		});
		this.fxContent.start({
			'margin-top':[ 0, (this.heightBeforeMinimize - h) * -1 ]
		});
        this.fireEvent('minimize', [this, { height: h }]);
	},

	animationComplete:function () {
		this.slideInProgress = false;
	}
});