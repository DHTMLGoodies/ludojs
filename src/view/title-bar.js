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

        this.setConfigParams(config, ['view', 'buttons']);

        if (!this.buttons)this.buttons = this.getDefaultButtons();

        this.view.addEvent('setTitle', this.setTitle.bind(this));
        this.view.addEvent('resize', this.resizeDOM.bind(this));
        this.createDOM();
        this.setSizeOfButtonContainer();
    },

    getDefaultButtons:function () {
        var ret = [];
        var v = this.view;
        if (v.isMinimizable())ret.push('minimize');
        if (v.isCollapsible())ret.push('collapse');
        if (v.isClosable())ret.push('close');
        return ret;
    },

    createDOM:function () {
        var el = this.els.el = $('<div>');
        el.addClass(this.view.boldTitle ? 'ludo-framed-view-titlebar' : 'ludo-component-titlebar');
        var left = 0;
        if (this.view.icon) {
            this.createIconDOM();
            left += ludo.dom.getNumericStyle(el, 'width');
        }
        this.createTitleDOM();
        el.append(this.getButtonContainer());
        this.resizeButtonContainer.delay(20, this);
        this.els.title.css('left', left);
        el.on('selectstart', ludo.util.cancelEvent);
    },

    createIconDOM:function () {
        this.els.icon = ludo.dom.create({
            renderTo:this.els.el,
            cls:'ludo-framed-view-titlebar-icon',
            css:{ 'backgroundImage':'url(' + this.view.icon + ')'}
        });
    },

    setTitle:function (title) {
        this.els.title.html(title);
    },

    createTitleDOM:function () {

        this.els.title = $('<div class="ludo-framed-view-titlebar-title"></div>');
        this.els.el.append(this.els.title);

        this.setTitle(this.view.title);
    },

    cancelTextSelection:function () {
        return false;
    },

    getButtonContainer:function () {


        var el = this.els.controls = $('<div class="ludo-title-bar-button-container"></div>');
        el.css('cursor.default');

        this.createEdge('left', el);
        this.createEdge('right', el);

        for (var i = 0; i < this.buttons.length; i++) {
            el.append(this.getButton(this.buttons[i]));
        }

        this.addBorderToButtons();
        return el;
    },

    createEdge:function (pos, parent) {
        var el = $('<div class="ludo-title-bar-button-container-' + pos + '-edge"></div>');
        parent.append(el);

        el.attr("style", 'position:absolute;z-index:1;' + pos + ':0;top:0;width:55%;height:100%;background-repeat:no-repeat;background-position:top ' + pos);
        return el;

    },

    shouldShowCollapseButton:function () {
        var parent = this.view.getParent();
        return parent.layout && parent.layout.type ? parent.layout.type === 'linear' || parent.layout.type == 'relative' : false;
    },

    resizeButtonContainer:function () {
        this.els.controls.css('width', this.getWidthOfButtons());
    },

    getButton:function (buttonConfig) {
        buttonConfig = ludo.util.isString(buttonConfig) ? { type:buttonConfig } : buttonConfig;

        var b = this.els.buttons[buttonConfig.type] = $('<div>');
        b.id = 'b-' + String.uniqueID();
        b.attr("class", 'ludo-title-bar-button ludo-title-bar-button-' + buttonConfig.type);

        b.on("click", this.getButtonClickFn(buttonConfig.type));
        b.mouseenter(this.enterButton.bind(this));
        b.mouseleave(this.leaveButton.bind(this));

        b.attr('title', buttonConfig.title ? buttonConfig.title : buttonConfig.type.capitalize());
        b.attr('buttonType', buttonConfig.type);

        if (buttonConfig.type === 'collapse') {
            b.addClass('ludo-title-bar-button-collapse-' + this.getCollapseButtonDirection());
        }
        this.els.buttonArray.push(b);
        return b;
    },


    getButtonClickFn:function (type) {
        var buttonConfig = ludo.view.getTitleBarButton(type);
        var toggle = buttonConfig && buttonConfig.toggle ? buttonConfig.toggle : undefined;

        return function (e) {
            this.leaveButton(e);
            var event = type;
            if (toggle) {
                if (this.toggleStatus[type]) {
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

    getNextToggle:function (toggle, current) {
        var ind = toggle.indexOf(current) + 1;
        return toggle[ind >= toggle.length ? 0 : ind];
    },

    addBorderToButtons:function () {
        var firstFound = false;
        for (var i = 0; i < this.els.buttonArray.length; i++) {
            this.els.buttonArray[i].removeClass('ludo-title-bar-button-with-border');
            if (firstFound)this.els.buttonArray[i].addClass('ludo-title-bar-button-with-border');
            firstFound = true;
        }
    },

    enterButton:function (e) {
        var el = $(e.target);
        var type = el.attr('buttonType');
        el.addClass('ludo-title-bar-button-' + type + '-over');
    },

    leaveButton:function (e) {
        var el = $(e.target);
        el.removeClass('ludo-title-bar-button-' + el.attr('buttonType') + '-over');
    },

    getWidthOfButtons:function () {
        var ret = 0;
        var els = this.els.buttonArray;
        for (var i = 0, count = els.length; i < count; i++) {
            var width = els[i].outerWidth();
            if (width) {
                ret += width;
            } else {
                ret += els[i].width();
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
            this.els.controls.css('width',  width + 'px');
            this.els.controls.css('display',  width > 0 ? '' : 'none');
        }
        if (this.icon) {
            this.els.title.css('left', $(this.els.icon).css('width'));
        }
    },

    getWidthOfIconAndButtons:function () {
        var ret = this.view.icon ? this.els.icon.width() : 0;
        return ret + this.els.controls.width();
    },

    resizeDOM:function () {
        var width = (this.view.width - this.getWidthOfIconAndButtons());
        if (width > 0)this.els.title.css('width', width);
    },

    height:undefined,
    getHeight:function () {
        if (this.height === undefined) {
            var el = this.els.el;
            this.height = el.outerHeight();

            // this.height += ludo.dom.getMH(el) + ludo.dom.getBH(el) + ludo.dom.getPH(el);
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

ludo.view.registerTitleBarButton = function (name, config) {
    ludo.registry.set('titleBar-' + name, config);
};

ludo.view.getTitleBarButton = function (name) {
    return ludo.registry.get('titleBar-' + name);
};

ludo.view.registerTitleBarButton('minimize', {
    toggle:['minimize', 'maximize']
});