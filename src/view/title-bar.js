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

    ludoConfig:function (config) {
        this.parent(config);
        this.view = config.view;
        this.createDOM();
        this.createEvents();
        this.setSizeOfButtonContainer.delay(20, this);
    },

    createDOM:function () {
        var el = this.els.el = new Element('div');
        if (this.view.boldTitle) {
            ludo.dom.addClass(el, 'ludo-rich-view-titlebar');
        } else {
            ludo.dom.addClass(el, 'ludo-component-titlebar');
        }

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
        var icon = this.els.icon = document.createElement('div');
        ludo.dom.addClass(icon, 'ludo-rich-view-titlebar-icon');
		icon.style.backgroundImage = 'url(' + this.view.icon + ')';
        this.els.el.appendChild(icon);
    },

	setTitle:function(title){
		this.els.title.innerHTML = title;
	},

    createTitleDOM:function () {
        var title = this.els.title = document.createElement('div');
		title.className = 'ludo-rich-view-titlebar-title';
        this.els.el.appendChild(title);
		this.setTitle(this.view.title);
    },
    createEvents:function () {
        this.addEvent('minimize', this.showMaximize.bind(this));
        this.addEvent('maximize', this.showMinimize.bind(this));
    },

    showMaximize:function () {
        this.els.buttons.maximize.style.display = '';
        this.els.buttons.minimize.style.display = 'none';
    },

    showMinimize:function () {
        this.els.buttons.maximize.style.display = 'none';
        this.els.buttons.minimize.style.display = '';
    },

    cancelTextSelection:function () {
        return false;
    },

    getButtonContainer:function () {
        var el = this.els.controls = document.createElement('div');
		el.className = 'ludo-title-bar-button-container';
        el.style.cursor = 'default';

        var le = document.createElement('div');
		le.className = 'ludo-title-bar-button-container-left-edge';
		le.style.cssText = "position:absolute;z-index:1;left:0;top:0;width:55%;height:100%;background-repeat:no-repeat;background-position:top left";
        el.appendChild(le);

        var re = document.createElement('div');
		re.className = 'ludo-title-bar-button-container-right-edge';
		re.style.cssText = 'position:absolute;z-index:1;right:0;top:0;width:55%;height:100%;background-repeat:no-repeat;background-position:top right';
        el.appendChild(re);

        if (this.view.isMinimizable()) {
            el.appendChild(this.getButton('minimize'));
            var max = this.getButton('maximize');
            max.style.display = 'none';
            el.appendChild(max);
        }
        if (this.view.isCollapsible()) {
            if (this.shouldShowCollapseButton()) {
                var button = this.getButton('collapse', 'collapse');
				var direction = this.getCollapseButtonDirection();
    			ludo.dom.addClass(button, 'ludo-title-bar-button-collapse-' + direction);
                el.appendChild(button);
            }
        }
        if (this.view.isClosable()) {
            el.appendChild(this.getButton('close', 'close'));
        }
        this.addBorderToButtons();
        return el;
    },

    shouldShowCollapseButton:function () {
        var parent = this.view.getParent();
		return parent.layout && parent.layout.type ? parent.layout.type ==='linear' || parent.layout.type=='relative' : false;
    },

    resizeButtonContainer:function () {
        this.els.controls.style.width = this.getWidthOfButtons() + 'px';
    },

    getButton:function (buttonType) {
        var b = this.els.buttons[buttonType] = new Element('div');
        b.id = 'ludo-title-bar-button-' + String.uniqueID();
		b.className = 'ludo-title-bar-button ludo-title-bar-button-' + buttonType;
        b.addEvent('click', this.buttonClick.bind(this));
        b.addEvent('mouseenter', this.enterButton.bind(this));
        b.addEvent('mouseleave', this.leaveButton.bind(this));
        b.setProperty('title', buttonType.capitalize());
        b.setProperty('buttonType', buttonType);
        this.els.buttonArray.push(b);
        return b;
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

    buttonClick:function (e) {
        var event = e.target.getProperty('buttonType');
        this.leaveButton(e);
        this.addBorderToButtons();
        this.resizeButtonContainer();
        this.fireEvent(event);
    },

    getWidthOfButtons:function () {
        var ret = 0;
        var els = this.els.buttonArray;
        for (var i = 0, count = els.length; i < count; i++) {
            if (els[i].style.display == 'none')continue;
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
        this.els.title.style.width = (this.view.width - this.getWidthOfIconAndButtons()) + 'px';
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
		if(ludo.util.isString(this.view.layout.collapsible)){
			return this.view.layout.collapsible;
		}
		var parent = c.getParent();
        if (parent && parent.layout && parent.layout.type === 'linear' && parent.layout.orientation === 'horizontal') {
            return parent.getIndexOf(this) === 0 ? 'left' : 'right';
        } else {
            return parent.getIndexOf(this) === 0 ? 'top' : 'bottom';
        }
    }
});