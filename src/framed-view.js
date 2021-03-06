/**
 * Displays a View with a title bar and support for a bottom button bar .
 * @parent ludo.View
 * @class ludo.FramedView
 * @extends ludo.View
 * @param {Object} config
 * @param {String} config.title Title for the title bar
 * @param {String} config.icon Path to icon to be placed in top left corner of title bar, default:undefined
 * @param {Boolean} config.minimizable True to add minimize button to the title bar.
 * @param {Boolean} config.minimized True to render the view minimized.
 * @param {Object} config.buttonBar Optional button bar configuration. The button bar is div at the bottom of the view where child views(example buttons) are rendered in a linear horizontal layout.
 * Alignment of button can be set using config.buttonBar.align(left, center or right).<br> Example: <br><code>buttonBar: { align:'left', children:[ {type:'ludo.form.Button', value: 'OK' }]}. </code>.<br>Default alignment is "right"
 * @fires ludo.FramedView#minimize Fired on mimimize. Argument: ludo.FramedView
 * @fires ludo.FramedView#maximize Fired on maximize
 */
ludo.FramedView = new Class({
	Extends:ludo.View,
	type:'FramedView',
	layout:{
		minWidth:100,
		minHeight:100
	},

	minimized:false,
	title:'',
	movable:false,
	minimizable:false,
	resizable:false,
	closable:false,

	width:null,
	height:200,

	preserveAspectRatio:false,
	icon:undefined,

	/**
	 Config object for the title bar
	 @config titleBar
	 @type {Object}
	 @default undefined
	 @memberof ludo.FramedView.prototype
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
	titleBarHidden:false,
	boldTitle:true,
	hasMenu:false,
	buttons:[],
	buttonBar:undefined,

	menuConfig:null,
	menuObj:null,

	state:{
		isMinimized:false
	},

	__construct:function (config) {
		this.parent(config);
        if (config.buttons) {
            config.buttonBar = {
                children:config.buttons
            }
        }

        this.__params(config,['buttonBar', 'hasMenu','menuConfig','icon','titleBarHidden','titleBar','buttons','boldTitle','minimized']);

	},

	/**
	 * Return config of title bar using a method instead of config object. Useful when you need to refer to "this"
	 * @function getTitleBarConfig
	 * @return {Object|undefined}
	 * @memberof ludo.FramedView.prototype
	 */
	getTitleBarConfig:function(){
		return undefined;
	},

	/**
	 * Return button bar config using a method instead of using buttonBar config object. Useful when you need to refer to
	 * "this"
	 * @function getButtonBarConfig
	 * @return {Object|undefined}
	 * @memberof ludo.FramedView.prototype
	 */
	getButtonBarConfig:function(){
		return undefined;
	},

	ludoDOM:function () {
		this.parent();

		this.$e.addClass('ludo-framed-view');

		if(this.hasTitleBar()){
			this.getTitleBar().getEl().insertBefore(this.$b());
		}
		this.$b().addClass('ludo-framed-view-body');

		if (!this.getParent() && this.isResizable()) {
			this.getResizer().addHandle('s');
		}
	},


	__rendered:function () {
        // TODO create button bar after view is rendered.


		if(!this.buttonBar)this.buttonBar = this.getButtonBarConfig();
		if (this.buttonBar && !this.buttonBar.children) {
			this.buttonBar = { children:this.buttonBar };
		}

        if (this.buttonBar) {
            this.getButtonBar()
        } else {
			this.$e.addClass('ludo-view-no-buttonbar')
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

	resizeDOM:function () {
		var height = this.getHeight();
		height -= (ludo.dom.getMBPH(this.$e) + ludo.dom.getMBPH(this.els.body) +  this.getHeightOfTitleAndButtonBar());

        if(height >= 0){
            this.els.body.css('height', height);
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
        return this.els.buttonBar.el.outerHeight();
	},

	getHeightOfTitleBar:function () {
		if (!this.hasTitleBar())return 0;
		return this.titleBarObj.getHeight();
	},

	hasTitleBar:function(){
		return !this.titleBarHidden;
	},

	titleBarButton:function(name){
		return this.getTitleBar().button(name);
	},

	getTitleBar:function(){
		if (this.titleBarObj === undefined) {

			if(!this.titleBar)this.titleBar = this.getTitleBarConfig() || {};
			this.titleBar.view = this;
			this.titleBar.type = 'view.TitleBar';
			this.titleBarObj = this.createDependency('titleBar', this.titleBar);

			this.titleBarObj.addEvents({
				close:this.close.bind(this),
				minimize:this.minimize.bind(this),
				maximize:this.maximize.bind(this),
				collapse:this.hide.bind(this)
			});

			if (this.movable && !this.getParent()) {
				this.drag = this.createDependency('drag', new ludo.effect.Drag({
					handle:this.titleBarObj.getEl(),
					el:this.getEl(),
					listeners:{
						start:this.increaseZIndex.bind(this),
						end:this.stopMove.bind(this)
					}
				}));
				this.titleBarObj.getEl().css('cursor', 'move');
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
	 * @function maximize
	 * @return void
	 * @memberof ludo.FramedView.prototype
	 */
	maximize:function () {
        this.state.isMinimized = false;
        if (!this.hidden) {
            this.resize({
                height:this.layout.height
            });
            this.els.body.css('visibility', 'visible');
            this.showResizeHandles();
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
	 * @function minimize
	 * @return void
	 * @memberof ludo.FramedView.prototype
	 */
	minimize:function () {
        this.state.isMinimized = true;
		if (!this.hidden) {
            var height = this.layout.height;
            var newHeight = this.getHeightOfTitleBar();
            this.$e.css('height', this.getHeightOfTitleBar());
            this.els.body.css('visibility', 'hidden');
            this.hideResizeHandles();

            this.layout.height = height;

            this.fireEvent('minimize', [this, { height: newHeight }]);
        }
	},

	getHtml:function () {
		return this.els.body.html();
	},

	getButtonBar:function () {
		if (!this.els.buttonBar) {
			this.els.buttonBar = this.els.buttonBar || {};

			var el = this.els.buttonBar.el = jQuery('<div class="ludo-view-buttonbar"></div>');
			this.$e.append(el);

			this.getEl().addClass('ludo-view-with-buttonbar');
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
	 * @function hideButton
	 * @param id of button
	 * @return {Boolean} success
	 * @memberof ludo.FramedView.prototype
	 */
	hideButton:function (id) {
        return this.buttonEffect(id, 'hide');
	},
	/**
	 * Show a button on the button bar
	 * @function showButton
	 * @param id of button
	 * @return {Boolean} success
	 * @memberof ludo.FramedView.prototype
	 */
	showButton:function (id) {
        return this.buttonEffect(id, 'show');
	},

	getButtons:function () {
        return this.buttonBarComponent ? this.buttonBarComponent.getButtons() : [];
	},
	/**
	 * Disable a button on the button bar
	 * @function disableButton
	 * @param id
	 * @return {Boolean} success
	 * @memberof ludo.FramedView.prototype
	 */
	disableButton:function (id) {
        return this.buttonEffect(id, 'disable');
	},
	/**
	 * Enable a button on the button bar
	 * @function enableButton
	 * @param id
	 * @return {Boolean} success
	 * @memberof ludo.FramedView.prototype
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
			if (this.buttons[i].getId() === key || this.buttons[i].val() == key || this.buttons[i].getName() == key) {
				return this.buttons[i];
			}
		}
		return null;
	},
	/**
	 * Is component resizable
	 * @function isResizable
	 * @return {Boolean}
	 * @memberof ludo.FramedView.prototype
	 */
	isResizable:function () {
		return this.resizable;
	},
	stopMove:function (el, drag) {
		this.getLayout().getRenderer().setPosition(drag.getX(), drag.getY());

		this.fireEvent('stopmove', this);
	}
});