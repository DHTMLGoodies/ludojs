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
	 * @config {String} icon
     * @default undefined
	 */
	icon:undefined,

	/**
	 Config object for the title bar
	 @config titleBar
	 @type {Object}
	 @default undefined
	 @example
	 	new ludo.Window({
	 		titleBar:{
				buttons: [{
					type : 'reload',
					title : 'Reload grid data'
				},'minimize','close'],
				listeners:{
					'reload' : function(){
						ludo.get('myDataSource').load();
					}
				}
			}
	 	});

	 You can create your own buttons by creating the following css classes:
	 @example
		 .ludo-title-bar-button-minimize {
			 background-image: url('../images/title-bar-btn-minimize.png');
		 }

		 .ludo-title-bar-button-minimize-over {
			 background-image: url('../images/title-bar-btn-minimize-over.png');
		 }

	 Replace "minimize" with the unique name of your button.

	 If you want to create a toggle button like minimize/maximize, you can do that with this code:

	 @example
		 ludo.view.registerTitleBarButton('minimize',{
			toggle:['minimize','maximize']
		 });
	 */
	titleBar:undefined,

	/**
	 * Don't show the title bar
	 * @config {Boolean} titleBarHidden
	 * @default false
	 */
	titleBarHidden:false,

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
        if (config.buttons) {
            config.buttonBar = {
                children:config.buttons
            }
        }

        this.setConfigParams(config,['buttonBar', 'hasMenu','menuConfig','icon','titleBarHidden','titleBar','buttons','boldTitle','minimized']);
		if (this.buttonBar && !this.buttonBar.children) {
			this.buttonBar = { children:this.buttonBar };
		}
	},

	ludoDOM:function () {
		this.parent();

		ludo.dom.addClass(this.els.container, 'ludo-framed-view');

		if(this.hasTitleBar()){
			this.getTitleBar().getEl().inject(this.getBody(), 'before');
		}
		ludo.dom.addClass(this.getBody(), 'ludo-framed-view-body');

		if (!this.getParent() && this.isResizable()) {
			this.getResizer().addHandle('s');
		}
	},


	ludoRendered:function () {
        // TODO create button bar after view is rendered.
        if (this.buttonBar) {
            this.getButtonBar()
        } else {
            ludo.dom.addClass(this.els.container, 'ludo-component-no-buttonbar')
        }
		this.parent();
		if (this.minimized) {
			this.minimize();
		}
	},

	resizer:undefined,
	getResizer:function () {
		if (this.resizer === undefined) {
			var r = this.getLayout().getRenderer();
			this.resizer = this.createDependency('resizer', new ludo.effect.Resize({
				component:this,
				preserveAspectRatio:this.layout.preserveAspectRatio,
				minWidth:r.getMinWidth(),
				minHeight:r.getMinHeight(),
				maxHeight:r.getMaxHeight(),
				maxWidth:r.getMaxWidth(),
				listeners:{
					stop:r.setSize.bind(r)
				}
			}));
			this.resizer.addEvent('stop', this.saveState.bind(this));
		}
		return this.resizer;
	},
	/**
	 * Set new title
	 * @method setTitle
	 * @param {String} title
	 */
	setTitle:function (title) {
		this.parent(title);
        this.fireEvent('setTitle', title);
	},

	resizeDOM:function () {
		var height = this.getHeight();
		height -= (ludo.dom.getMBPH(this.els.container) + ludo.dom.getMBPH(this.els.body) +  this.getHeightOfTitleAndButtonBar());
        if(height >= 0){
            this.els.body.style.height = height + 'px';
            this.cachedInnerHeight = height;

            if (this.buttonBarComponent) {
                this.buttonBarComponent.resize();
            }
        }
	},

	heightOfTitleAndButtonBar:undefined,
	getHeightOfTitleAndButtonBar:function () {
		if (this.isHidden())return 0;
		if (!this.heightOfTitleAndButtonBar) {
			this.heightOfTitleAndButtonBar = this.getHeightOfTitleBar() + this.getHeightOfButtonBar();
		}
		return this.heightOfTitleAndButtonBar;
	},

	getHeightOfButtonBar:function () {
		if (!this.buttonBar)return 0;
        return this.els.buttonBar.el.offsetHeight + ludo.dom.getMH(this.els.buttonBar.el);
	},

	getHeightOfTitleBar:function () {
		if (!this.hasTitleBar())return 0;
		return this.titleBarObj.getHeight();
	},

	hasTitleBar:function(){
		return !this.titleBarHidden;
	},

	getTitleBar:function(){
		if (this.titleBarObj === undefined) {

			if(!this.titleBar)this.titleBar = {};
			this.titleBar.view = this;
			this.titleBar.type = 'view.TitleBar';
			this.titleBarObj = this.createDependency('titleBar', this.titleBar);

			this.titleBarObj.addEvents({
				close:this.close.bind(this),
				minimize:this.minimize.bind(this),
				maximize:this.maximize.bind(this),
				collapse:this.hide.bind(this)
			});

			if (this.isMovable() && !this.getParent()) {
				this.drag = this.createDependency('drag', new ludo.effect.Drag({
					handle:this.titleBarObj.getEl(),
					el:this.getEl(),
					listeners:{
						start:this.increaseZIndex.bind(this),
						end:this.stopMove.bind(this)
					}
				}));
				this.titleBarObj.getEl().style.cursor = 'move';
			}
		}
		return this.titleBarObj;
	},

	getHeight:function () {
        return this.isMinimized() ? this.getHeightOfTitleBar() : this.parent();
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
        if (!this.hidden) {
            this.resize({
                height:this.layout.height
            });
            this.els.body.style.visibility = 'visible';
            this.showResizeHandles();
            /**
             * Fired when a component is maximized
             * @event maximize
             * @param component this
             */
            this.fireEvent('maximize', this);
        }
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
		if (!this.hidden) {
            var height = this.layout.height;
            var newHeight = this.getHeightOfTitleBar();
            this.els.container.setStyle('height', this.getHeightOfTitleBar());
            this.els.body.style.visibility = 'hidden';
            this.hideResizeHandles();

            this.layout.height = height;
            /**
             * @event minimize
             * @param Component this
             */
            this.fireEvent('minimize', [this, { height: newHeight }]);
        }
	},

	getHtml:function () {
		return this.els.body.get('html');
	},

	getButtonBar:function () {
		if (!this.els.buttonBar) {
			this.els.buttonBar = this.els.buttonBar || {};
			var el = this.els.buttonBar.el = ludo.dom.create({
                renderTo : this.els.container,
                cls : 'ludo-component-buttonbar'
            });

			ludo.dom.addClass(this.getEl(), 'ludo-component-with-buttonbar');
			this.buttonBar.renderTo = el;
			this.buttonBar.component = this;
			this.buttonBarComponent = this.createDependency('buttonBar', new ludo.view.ButtonBar(this.buttonBar));
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
        return this.buttonEffect(id, 'hide');
	},
	/**
	 * Show a button on the button bar
	 * @method showButton
	 * @param id of button
	 * @return {Boolean} success
	 */
	showButton:function (id) {
        return this.buttonEffect(id, 'show');
	},

	getButtons:function () {
        return this.buttonBarComponent ? this.buttonBarComponent.getButtons() : [];
	},
	/**
	 * Disable a button on the button bar
	 * @method disableButton
	 * @param id
	 * @return {Boolean} success
	 */
	disableButton:function (id) {
        return this.buttonEffect(id, 'disable');
	},
	/**
	 * Enable a button on the button bar
	 * @method enableButton
	 * @param id
	 * @return {Boolean} success
	 */
	enableButton:function (id) {
        return this.buttonEffect(id, 'enable');
	},

    buttonEffect:function(id,effect){
        var button = this.getButtonByKey(id);
        if (button) {
            button[effect]();
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
	/**
	 * Is component resizable
	 * @method isResizable
	 * @return {Boolean}
	 */
	isResizable:function () {
		return this.resizable;
	},
	stopMove:function (el, drag) {
		this.getLayout().getRenderer().setPosition(drag.getX(), drag.getY());
		/**
		 * Event fired after moving Component
		 * @event stopmove
		 * @param {Object} Component
		 */
		this.fireEvent('stopmove', this);
	}
});