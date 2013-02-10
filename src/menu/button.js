/**
 Menu button arrow which you can apply to DOM Element to have a menu drop down
 below it.
 @namespace menu
 @class Button
 @extends Core
 */
ludo.menu.Button = new Class({
	Extends: ludo.Core,
	width:15,

	/**
	 * Render button to this element
	 * @attribute renderTo
	 * @type {String}|DOMElement
	 * @default undefined
	 */
	renderTo:undefined,

	/**
	 * Button always visible. When false, it will be visible when mouse enters
	 * parent DOM element and hidden when it leaves it
	 * @attribute alwaysVisible
	 * @type {Boolean}
	 * default false
	 */
	alwaysVisible:false,

	/**
	 * Position button in this region. Valid values : 'nw','ne','sw' and 'se'
	 * @attribute region
	 * @type String
	 * @default 'ne'
	 */
	region : 'ne',

	el:undefined,

	/**
	 * Configuration object for the object to show on click on button
	 * @attribute menu
	 * @type {View}
	 * @default undefined
	 */
	menu:undefined,

	menuCreated:false,

	ludoConfig:function(config){
		this.parent(config);
		if(config.alwaysVisible!==undefined)this.alwaysVisible = config.alwaysVisible;
		if(config.region!==undefined)this.region = config.region;
		if(config.renderTo!==undefined)this.renderTo = config.renderTo;
		if(config.menu!==undefined)this.menu = config.menu;


	},

	ludoEvents:function(){
		this.parent();
		this.ludoDOM();
		this.createButtonEvents();
	},

	ludoDOM:function(){
		var el = this.el = new Element('div');
		el.id = 'ludo-menu-button-' + String.uniqueID();
		ludo.dom.addClass(el, 'ludo-menu-button');
		document.id(this.renderTo).adopt(el);
		el.setStyles({
			position : 'absolute',
			height : '100%'
		});
		this.createButtonEl();
		this.positionButton();

	},

	createButtonEvents:function(){
		this.buttonEl.addEvent('click', this.showMenu.bind(this));
		ludo.EffectObject.addEvent('start', this.hideMenu.bind(this));
		if(!this.alwaysVisible){
			var el = document.id(this.renderTo);
			el.addEvent('mouseenter', this.show.bind(this));
			el.addEvent('mouseleave', this.hide.bind(this));
			this.hide();
		}else{
			this.show();
		}
	},

	createButtonEl:function(){
		var el = this.buttonEl = new Element('div');
		ludo.dom.addClass(el, 'ludo-menu-button-arrow');
		this.getEl().adopt(el);
	},

	positionButton:function(){
		var e = this.getEl();
		var r = this.region;
		if(r == 'ne' || r == 'se')e.setStyle('right', 0);
		if(r == 'nw' || r == 'sw')e.setStyle('left', 0);
		if(r == 'se' || r == 'sw')e.setStyle('bottom', 0);
		if(r == 'ne' || r == 'nw')e.setStyle('top', 0);
	},

	getEl:function(){
		return this.el;
	},



	showMenu:function(e){
		e.stop();
		if(!this.menuCreated){
			this.createMenuView();
		}
		if(this.menu._button && this.menu._button !== this.id){
			var el = ludo.get(this.menu._button);
			if(el)el.hideButton();
		}

		this.menu._button = this.id;
		this.menu.show();

		this.positionMenu();
		this.fireEvent('show', this);
	},

	/**
	 This method should be called from function added as event handler to "beforeShow"
	 @method cancelShow
	 @example
	 	button.addEvent('beforeShow', function(button){
	 		if(!this.isOkToShowButton()){
	 			button.cancel();
	 		}
	 	});
	 */
	cancelShow:function(){
		this.okToShowButton = false;
	},

	hideMenu:function(){
		if(this.menu.hide !== undefined)this.menu.hide();
		this.hide();
	},

	createMenuView:function(){
		if(this.menu.id){
			var menu = ludo.get(this.menu.id);
			if(menu)this.menu = menu;
		}

		if(this.menu.getEl === undefined){
			this.menu.renderTo = document.body;
			this.menu.type = this.menu.type || 'View';
			this.menu.hidden = true;
			this.menu = ludo._new(this.menu);
			this.menu._button = this.getEl().id;
			document.body.addEvent('mouseup', this.autoHideMenu.bind(this));
		}else{
			document.body.adopt(this.menu.getEl());
		}

		this.menu.addEvent('show', this.showIf.bind(this));
		this.menu.addEvent('hide', this.hideButton.bind(this));
		this.menu.getEl().style.position = 'absolute';
		this.menu.getEl().addClass('ludo-menu-button-menu');
	},

	positionMenu:function(){
		if(!this.menu){
			return;
		}
		var pos = this.el.getCoordinates();
		this.menu.resize({
			left:pos.left,
			top:pos.top + pos.height
		});
	},

	showIf:function(){
		if(this.menu._button === this.id){
			this.show();
		}
	},

	okToShowButton:false,

	show:function(){
		this.okToShowButton = true;
		/**
		 * Event fired before button is shown. You can use this event and call
		 * the cancel method if there are situations where you don't always want to show the button
		 * @event beforeShow
		 * @param {menu.Button} this
		 */
		this.fireEvent('beforeShow', this);

		if(this.okToShowButton){
			this.buttonEl.style.display='';
			ludo.dom.addClass(this.el, 'ludo-menu-button-active');
		}
	},

	hide:function(){
		if(this.menu === undefined || this.menu.isHidden === undefined || this.menu.isHidden()){
			this.hideButton();
		}else if(this.menu._button !== this.id){
			this.hideButton();
		}
	},

	hideButton:function(){
		this.buttonEl.style.display='none';
		this.el.removeClass('ludo-menu-button-active');
	},
	getMenuView:function(){
		return this.menu;
	},

	autoHideMenu:function(e){
		if(this.menu && this.menu.hidden)return;
		if(!ludo.dom.isInFamilies(e.target, [this.el.id, this.menu.getEl().id])){
			this.hideMenu();
			this.hideButton();
		}
	}
});