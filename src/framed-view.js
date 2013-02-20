/**
 * Rich Component
 * @class FramedView
 * @extends View
 */
ludo.FramedView = new Class({
	Extends:ludo.View,
	type:'FramedView',
	layout:{
		type:'fill',
		minWidth:100,
		minHeight:100
	},
	minimized:false,

	/**
	 * Title of component. A title is only useful for FramedView's or when the component is collapsible.
	 * @attribute {String} title
	 */
	title:'',


	movable:false,
	/**
	 * Is component minimizable. When set to true, a minimize button will appear on the title bar of the component
	 * @attribute minimizable
	 * @type {Boolean}
	 */
	minimizable:true,

	resizable:false,
	fullScreen:false,
	/**
	 * Is component closable. When set to true, a close button will appear on the title bar of the component
	 * @attribute closable
	 * @type {Boolean}
	 * @default false
	 */
	closable:false,

	width:null,
	height:200,

	preserveAspectRatio:false,
	/**
	 * Path to icon to be placed on the title bar
	 * @attribute icon
	 */
	icon:null,
	/**
	 * Initial display of status bar
	 * @attribute {Boolean} statusBar
	 * @default false
	 */
	statusBar:false,
	/**
	 * Initial text of status bar
	 * @attribute statusText
	 * @type String
	 * @default '' (empty string)
	 */
	statusText:'',
	/**
	 * Path to icon on status bar
	 * @attribute statusIcon
	 * @type String
	 * @default undefined
	 */
	statusIcon:undefined,

	/**
	 * Show or hide title bar
	 * @attribute titleBar
	 * @type {Boolean}
	 * @default true
	 */
	titleBar:true,
	/**
	 * Bold title bar. True to give the component a window type title bar, false to give it a smaller title bar
	 * @attribute boldTitle
	 * @type {Boolean}
	 * @default true
	 */
	boldTitle:true,
	hasMenu:false,

	buttons:[],
	/**
	 Button bar object. Components to be placed on the button bar.
	 @attribute buttonBar
	 @type Object
	 @example
	 	buttonBar : {
			align : 'left',
			children : [{ type: form.Button, value: 'Send' }]
		}
	 */
	buttonBar:undefined,

	menuConfig:null,
	menuObj:null,

	column:null,

	state:{
		isMinimized:false
	},

	ludoConfig:function (config) {
		this.parent(config);
        if (config.buttons !== undefined) {
            config.buttonBar = {
                children:config.buttons
            }
        }

        var keys = ['buttonBar','hasMenu','menuConfig','icon','statusIcon','statusText','statusBar','titleBar','buttons','boldTitle','minimized'];
        this.setConfigParams(config,keys);

		if (this.buttonBar !== undefined && !this.buttonBar.children) {
			this.buttonBar = { children:this.buttonBar };
		}
	},

	ludoDOM:function () {
		this.parent();
		var el = this.els.container;
		ludo.dom.addClass(el, 'ludo-rich-view');

		if (this.titleBar)this.getTitleBarEl().inject(this.getBody(), 'before');

		var body = this.getBody();
		ludo.dom.addClass(body, 'ludo-rich-view-body');

		if (this.buttonBar) {
			this.getButtonBar()
		} else {
			ludo.dom.addClass(el, 'ludo-component-no-buttonbar')
		}
		if (this.statusBar)el.adopt(this.getStatusBar());

		var parent = this.getParent();
		if (!parent && this.isResizable()) {
			this.getResizer().addHandle('s');
		}
	},


	ludoRendered:function () {
		this.parent();
		if (this.minimized) {
			this.minimize();
		}
	},

	resizer:undefined,
	getResizer:function () {
		if (this.resizer === undefined) {
			var r = this.getLayoutManager().getRenderer();
			this.resizer = new ludo.effect.Resize({
				component:this,
				preserveAspectRatio:this.layout.preserveAspectRatio,
				minWidth:r.getMinWidth(),
				minHeight:r.getMinHeight(),
				maxHeight:r.getMaxHeight(),
				maxWidth:r.getMaxWidth(),
				listeners:{

					stop:r.setSize.bind(r)
				}
			});
			this.resizer.addEvent('stop', this.saveState.bind(this));
		}
		return this.resizer;
	},
	/**
	 * Set status bar text
	 * @method setStatusText
	 * @param text
	 * @return void
	 */
	setStatusText:function (text) {
		this.getStatusBar().setText(text);
	},
	/**
	 * Clear status bar text
	 * @method clearStatusText
	 * @return void
	 */
	clearStatusText:function () {
		this.getStatusBar().setText('');
	},
	/**
	 * Set new title
	 * @method setTitle
	 * @param {String} title
	 */
	setTitle:function (title) {
		this.parent(title);
		if(this.titleBarObj)this.titleBarObj.setTitle(title);
	},

	autoSize:function () {
		this.resize({ width:this.els.container.offsetWidth  });
	},

	resizeDOM:function () {
		var height = this.getHeight();
		height -= (ludo.dom.getMBPH(this.els.container) + ludo.dom.getMBPH(this.els.body) +  this.getTotalHeightOfTitleAndStatusBar());
		if (height < 0) {
			return;
		}
		this.els.body.style.height = height + 'px';
		this.cachedInnerHeight = height;

		if (this.buttonBarComponent) {
			this.buttonBarComponent.resize();
		}
		if (this.titleBarObj && this.width && this.width > 30) {
			this.titleBarObj.resizeDOM();
		}
	},

	heightTitleAndStatusBar:undefined,
	getTotalHeightOfTitleAndStatusBar:function () {
		if (this.isHidden())return 0;
		if (!this.heightTitleAndStatusBar) {
			this.heightTitleAndStatusBar = this.getHeightOfTitleBar() + this.getHeightOfStatusBar() + this.getHeightOfButtonBar();
		}
		return this.heightTitleAndStatusBar;
	},

	heightOfButtonBar:undefined,
	getHeightOfButtonBar:function () {
		if (!this.buttonBar)return 0;
		if (this.heightOfButtonBar === undefined) {
			this.heightOfButtonBar = this.els.buttonBar.el.offsetHeight + ludo.dom.getMH(this.els.buttonBar.el);
		}
		return this.heightOfButtonBar;
	},

	getHeightOfTitleBar:function () {
		if (!this.titleBar)return 0;
		return this.titleBarObj.getHeight();
	},

	getHeightOfStatusBar:function () {
		if (!this.statusBarObj)return 0;
		return this.statusBarObj.getHeight();
	},

	getTitleBar:function(){
		if (this.titleBarObj === undefined) {
			this.titleBarObj = ludo._new({
				type:'view.TitleBar',
				view:this,
				listeners:{
					close:this.close.bind(this),
					minimize:this.minimize.bind(this),
					maximize:this.maximize.bind(this),
					collapse:this.hide.bind(this)
				}
			});

			if (this.isMovable() && !this.getParent()) {
				this.drag = new ludo.effect.Drag({
					handle:this.titleBarObj.getEl(),
					el:this.getEl(),
					listeners:{
						start:this.increaseZIndex.bind(this),
						end:this.stopMove.bind(this)
					}
				});
				this.titleBarObj.getEl().style.cursor = 'move';
			}
		}
		return this.titleBarObj;
	},

	getTitleBarEl:function () {
		return this.getTitleBar().getEl();
	},

	getHeight:function () {
		if (this.isMinimized()) {
			return this.getHeightOfTitleBar();
		}
        return this.parent();
	},

	close:function () {
		this.hide();
		this.fireEvent('close', this);
	},

	isMinimized:function () {
		return this.state.isMinimized;
	},

	/**
	 * Maximize component
	 * @method maximize
	 * @return void
	 */
	maximize:function () {
		this.state.isMinimized = false;
		if (this.hidden) {
			return;
		}
		this.resize({
			height:this.height
		});
		this.els.body.style.visibility = 'visible';
		this.showResizeHandles();
		/**
		 * Fired when a component is maximized
		 * @event maximize
		 * @param component this
		 */
		this.fireEvent('maximize', this);
	},

	showResizeHandles:function () {
		if (this.isResizable()) {
			this.getResizer().showAllHandles();
		}
	},

	hideResizeHandles:function () {
		if (this.isResizable()) {
			this.getResizer().hideAllHandles();
		}
	},

	/**
	 * Minimize component
	 * @method minimize
	 * @return void
	 */
	minimize:function () {
		this.state.isMinimized = true;
		if (this.hidden) {
			return;
		}
		var height = this.height;
		var newHeight = this.getHeightOfTitleBar();
		this.els.container.setStyle('height', this.getHeightOfTitleBar());
		this.els.body.style.visibility = 'hidden';
		this.hideResizeHandles();

		this.height = height;
		/**
		 * @event minimize
		 * @param Component this
		 */
		this.fireEvent('minimize', [this, { height: newHeight }]);
	},

	getHtml:function () {
		return this.els.body.get('html');
	},

	getButtonBar:function () {
		if (!this.els.buttonBar) {
			this.els.buttonBar = this.els.buttonBar || {};
			var el = this.els.buttonBar.el = document.createElement('div');
			this.els.container.appendChild(el);
			el.className = 'ludo-component-buttonbar';
			ludo.dom.addClass(this.getEl(), 'ludo-component-with-buttonbar');
			this.buttonBar.renderTo = el;
			this.buttonBar.component = this;
			this.buttonBarComponent = new ludo.view.ButtonBar(this.buttonBar);
		}
		return this.els.buttonBar.el;
	},

	getButton:function (key) {
		return this.getButtonByKey(key);
	},
	/**
	 * Hide a button on the button bar
	 * @method hideButton
	 * @param id of button
	 * @return {Boolean} success
	 */
	hideButton:function (id) {
		var button = this.getButtonByKey(id);
		if (button) {
			button.hide();
			return true;
		}
		return false;
	},
	/**
	 * Show a button on the button bar
	 * @method showButton
	 * @param id of button
	 * @return {Boolean} success
	 */
	showButton:function (id) {
		var button = this.getButtonByKey(id);
		if (button) {
			button.show();
			return true;
		}
		return false;
	},

	getButtons:function () {
		if (this.buttonBarComponent) {
			return this.buttonBarComponent.getButtons();
		}
		return [];
	},
	/**
	 * Disable a button on the button bar
	 * @method disableButton
	 * @param id
	 * @return {Boolean} success
	 */
	disableButton:function (id) {
		var button = this.getButtonByKey(id);
		if (button) {
			button.disable();
			return true;
		}
		return false;
	},
	/**
	 * Enable a button on the button bar
	 * @method enableButton
	 * @param id
	 * @return {Boolean} success
	 */
	enableButton:function (id) {
		var button = this.getButtonByKey(id);
		if (button) {
			button.enable();
			return true;
		}
		return false;
	},

	getButtonByKey:function (key) {
		if (this.buttonBarComponent) {
			return this.buttonBarComponent.getButton(key);
		}
		for (var i = 0; i < this.buttons.length; i++) {
			if (this.buttons[i].getId() === key || this.buttons[i].getValue() == key || this.buttons[i].getName() == key) {
				return this.buttons[i];
			}
		}
		return null;
	},

	getStatusBar:function () {
		if (this.statusBarObj == undefined) {
			this.statusBarObj = ludo._new({
				type:'view.StatusBar',
				text:this.statusText,
				icon:this.statusIcon
			})
		}
		return this.statusBarObj.getEl();
	},
	/**
	 * Is component resizable
	 * @method isResizable
	 * @return {Boolean}
	 */
	isResizable:function () {
		return this.resizable;
	},
	stopMove:function (el, drag) {
		this.getLayoutManager().getRenderer().setPosition(drag.getX(), drag.getY());
		/**
		 * Event fired after moving Component
		 * @event stopmove
		 * @param {Object} Component
		 */
		this.fireEvent('stopmove', this);
	}
});