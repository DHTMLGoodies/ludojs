// TODO support all kinds of buttons - customizable
ludo.view.TitleBar = new Class({
    Extends:ludo.Core,
    view:undefined,
    els:{
        el:undefined,
        icon:undefined,
        title:undefined,
        buttons:{},
        buttonArray:[]
    },

	toggleStatus:{},

    ludoConfig:function (config) {
        this.parent(config);

        this.setConfigParams(config, ['view','buttons']);

		if(!this.buttons)this.buttons = this.getDefaultButtons();

        this.view.addEvent('setTitle', this.setTitle.bind(this));
        this.view.addEvent('resize', this.resizeDOM.bind(this));
        this.createDOM();
        this.setSizeOfButtonContainer();
    },

	getDefaultButtons:function(){
		var ret  = [];
		if(this.view.isMinimizable())ret.push('minimize');
		if(this.view.isCollapsible())ret.push('collapse');
		if(this.view.isClosable())ret.push('close');
		return ret;
	},

    createDOM:function () {
        var el = this.els.el = new Element('div');
        ludo.dom.addClass(el, this.view.boldTitle ? 'ludo-framed-view-titlebar' : 'ludo-component-titlebar');
        var left = 0;
        if (this.view.icon) {
            this.createIconDOM();
            left += parseInt(this.els.icon.getStyle('width').replace(/[^0-9]/g, ''));
        }
        this.createTitleDOM();
        el.adopt(this.getButtonContainer());
        this.resizeButtonContainer.delay(20, this);
        this.els.title.style.left = left + 'px';
        el.addEvent('selectstart', ludo.util.cancelEvent);
    },

    createIconDOM:function () {
        this.els.icon = ludo.dom.create({
            renderTo:this.els.el,
            cls:'ludo-framed-view-titlebar-icon',
            css:{ 'backgroundImage':'url(' + this.view.icon + ')'}
        });
    },

    setTitle:function (title) {
        this.els.title.innerHTML = title;
    },

    createTitleDOM:function () {
        var title = this.els.title = ludo.dom.create({
            cls : 'ludo-framed-view-titlebar-title',
            renderTo : this.els.el
        });
        this.setTitle(this.view.title);
    },

    cancelTextSelection:function () {
        return false;
    },

    getButtonContainer:function () {
        var el = this.els.controls = ludo.dom.create({
            cls : 'ludo-title-bar-button-container'
        });
        el.style.cursor = 'default';

        var le = ludo.dom.create({
            cls : 'ludo-title-bar-button-container-left-edge',
            renderTo:el
        });
        le.style.cssText = "position:absolute;z-index:1;left:0;top:0;width:55%;height:100%;background-repeat:no-repeat;background-position:top left";

        var re = ludo.dom.create({
            cls : 'ludo-title-bar-button-container-right-edge',
            renderTo:el
        });
        re.style.cssText = 'position:absolute;z-index:1;right:0;top:0;width:55%;height:100%;background-repeat:no-repeat;background-position:top right';

		for(var i=0;i<this.buttons.length;i++){
			el.appendChild(this.getButton(this.buttons[i]));
		}

	    this.addBorderToButtons();
        return el;
    },

    shouldShowCollapseButton:function () {
        var parent = this.view.getParent();
        return parent.layout && parent.layout.type ? parent.layout.type === 'linear' || parent.layout.type == 'relative' : false;
    },

    resizeButtonContainer:function () {
        this.els.controls.style.width = this.getWidthOfButtons() + 'px';
    },

    getButton:function (buttonConfig) {
		buttonConfig = ludo.util.isString(buttonConfig) ? { type : buttonConfig } : buttonConfig;

        var b = this.els.buttons[buttonConfig.type] = new Element('div');
        b.id = 'b-' + String.uniqueID();
        b.className = 'ludo-title-bar-button ludo-title-bar-button-' + buttonConfig.type;
        b.addEvents({
            'click':this.getButtonClickFn(buttonConfig.type),
            'mouseenter':this.enterButton.bind(this),
            'mouseleave':this.leaveButton.bind(this)
        });
        b.setProperty('title', buttonConfig.title ? buttonConfig.title : buttonConfig.type.capitalize());
        b.setProperty('buttonType', buttonConfig.type);

		if(buttonConfig.type === 'collapse'){
    		ludo.dom.addClass(b, 'ludo-title-bar-button-collapse-' + this.getCollapseButtonDirection());
		}
        this.els.buttonArray.push(b);
        return b;
    },


	getButtonClickFn:function(type){
		var buttonConfig = ludo.view.getTitleBarButton(type);
		var toggle = buttonConfig && buttonConfig.toggle ? buttonConfig.toggle : undefined;

		return function(e){
			this.leaveButton(e);
			var event = type;
			if(toggle){
				if(this.toggleStatus[type]){
					event = this.toggleStatus[type];
					ludo.dom.removeClass(e.target, 'ludo-title-bar-button-' + event);
					event = this.getNextToggle(toggle, event);

				}
				ludo.dom.removeClass(e.target, 'ludo-title-bar-button-' + event);
				this.toggleStatus[type] = event;
				ludo.dom.addClass(e.target, 'ludo-title-bar-button-' + this.getNextToggle(toggle, event));
			}
			this.fireEvent(event);
		}.bind(this);
	},

	getNextToggle:function(toggle, current){
		var ind = toggle.indexOf(current) + 1;
		return toggle[ind>=toggle.length ? 0 : ind];
	},

    addBorderToButtons:function () {
        var firstFound = false;
        for (var i = 0; i < this.els.buttonArray.length; i++) {
            if (this.els.buttonArray[i].style.display == 'none') {
                continue;
            }
            this.els.buttonArray[i].removeClass('ludo-title-bar-button-with-border');
            if (firstFound)this.els.buttonArray[i].addClass('ludo-title-bar-button-with-border');
            firstFound = true;
        }
    },

    enterButton:function (e) {
        var el = e.target;
        var type = el.getProperty('buttonType');
        ludo.dom.addClass(el, 'ludo-title-bar-button-' + type + '-over');
    },

    leaveButton:function (e) {
        var el = e.target;
        el.removeClass('ludo-title-bar-button-' + el.getProperty('buttonType') + '-over');
    },

    getWidthOfButtons:function () {
        var ret = 0;
        var els = this.els.buttonArray;
        for (var i = 0, count = els.length; i < count; i++) {
            var width = ludo.dom.getNumericStyle(els[i], 'width') + ludo.dom.getBW(els[i]) + ludo.dom.getPW(els[i]) + ludo.dom.getMW(els[i]);
            if (!isNaN(width) && width) {
                ret += width;
            } else {
                ret += els[i].offsetWidth;
            }
        }
        return ret ? ret : els.length * 10;
    },

    getEl:function () {
        return this.els.el;
    },

    setSizeOfButtonContainer:function () {
        if (this.els.controls) {
            var width = this.getWidthOfButtons();
            this.els.controls.style.width = width + 'px';
            this.els.controls.style.display = width > 0 ? '' : 'none';
        }
        if (this.icon) {
            this.els.title.setStyle('left', document.id(this.els.icon).getStyle('width'));
        }
    },

    hide:function () {
        this.els.el.style.display = 'none';
    },

    getWidthOfIconAndButtons:function () {
        var ret = this.view.icon ? this.els.icon.offsetWidth : 0;
        return ret + this.els.controls.offsetWidth;
    },

    resizeDOM:function () {
		var width = (this.view.width - this.getWidthOfIconAndButtons());
		if(width>0)this.els.title.style.width = width + 'px';
    },

    height:undefined,
    getHeight:function () {
        if (this.height === undefined) {
            var el = this.els.el;
            this.height = parseInt(el.getStyle('height').replace('px', ''));
            this.height += ludo.dom.getMH(el) + ludo.dom.getBH(el) + ludo.dom.getPH(el);
        }
        return this.height;
    },

    getCollapseButtonDirection:function () {
        var c = this.view;
        if (ludo.util.isString(c.layout.collapsible)) {
            return c.layout.collapsible;
        }
        var parent = c.getParent();
        if (parent && parent.layout && parent.layout.type === 'linear' && parent.layout.orientation === 'horizontal') {
            return parent.children.indexOf(c) === 0 ? 'left' : 'right';
        } else {
            return parent.children.indexOf(c) === 0 ? 'top' : 'bottom';
        }
    }
});

ludo.view.registerTitleBarButton = function(name, config){
	ludo.registry.set('titleBar-' + name, config);
};

ludo.view.getTitleBarButton = function(name){
	return ludo.registry.get('titleBar-' + name);
};

ludo.view.registerTitleBarButton('minimize',{
	toggle:['minimize','maximize']
});