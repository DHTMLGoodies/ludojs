/**
 * @class Accordion
 * @augments FramedView
 * @description Accordion component
 */
ludo.Accordion = new Class({
	Extends:ludo.FramedView,
	type:'Accordion',
	closable:false,
	heightBeforeMinimize:undefined,
	slideInProgress:false,
	fx:undefined,
	fxContent:undefined,
	minimized:false,

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
        this.getTitleBar().getEl().addEvent('click', this.toggleExpandCollapse.bind(this));
		this.parent();
	},
	toggleExpandCollapse:function () {
        this.state.isMinimized ? this.maximize() : this.minimize();
	},
	/**
	 * Maximize accordion component
	 * @function maximmize
	 * @return void
	 */
	maximize:function () {
		if (this.slideInProgress)return;
		this.slideInProgress = true;
		this.state.isMinimized = false;

        this.showResizeHandles();

		this.getEl().animate({
			'height':[this.getHeightOfTitleBar(), this.heightBeforeMinimize]
		}, 100, this.animationComplete.bind(this));


		this.getBody().animate({
			'margin-top':[this.getBody().css('margin-top'), 0]
		}, 100);

		this.fireEvent('maximize', this);
	},
	/**
	 * Minimize accordion component
	 * @function minimize
	 * @return void
	 */
	minimize:function () {
		if (this.slideInProgress)return;
		this.heightBeforeMinimize = this.getEl().height() - ludo.dom.getBH(this.getEl()) - ludo.dom.getPH(this.getEl());
		this.slideInProgress = true;

		this.state.isMinimized = true;
		this.hideResizeHandles();
        var h = this.getHeightOfTitleBar();

		this.getEl().animate({
			'height':[this.heightBeforeMinimize, h]
		},100, this.animationComplete.bind(this));

		this.getBody().animate({
			'margin-top':[ 0, (this.heightBeforeMinimize - h) * -1 ]
		}, 100);

        this.fireEvent('minimize', [this, { height: h }]);
	},

	animationComplete:function () {
		this.slideInProgress = false;
	}
});