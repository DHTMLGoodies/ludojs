/* TODO should be able to update tab title when view title is changed */
ludo.layout.Tabs = new Class({
    Extends: ludo.View,
    type: 'layout.Tabs',
    tabPos: 'left',
    lm: undefined,
    tabs: {},
    currentPos: -1,
    activeTab: undefined,
    currentZIndex: 3,
    activeTabId: undefined,

    tabParent: undefined,

    tabPositions: undefined,

    tabMenuEl: undefined,
    elLine: undefined,

    maxPos: undefined,

    maxSize: undefined,

    hiddenTabs: undefined,

    menu: undefined,

    tabTitles: undefined,

    __construct: function (config) {
        this.parent(config);
        if (config.tabPos !== undefined)this.tabPos = config.tabPos;
        this.lm = config.lm;
        this.hiddenTabs = [];
        this.tabTitles = {};
    },
    ludoEvents: function () {
        this.parent();
        this.lm.addEvent('addChild', this.registerChild.bind(this));
        this.lm.addEvent('addChildRuntime', this.resizeTabs.bind(this));
        this.lm.addEvent('showChild', this.activateTabFor.bind(this));
        this.lm.addEvent('removeChild', this.removeTabFor.bind(this));
        this.addEvent('resize', this.resizeTabs.bind(this));
    },

    __rendered: function () {
        this.parent();
        this.resizeTabs();
    },

    registerChild: function (layout, parent, child) {
        if (!this.lm.isTabs(child)) {
            this.createTabFor(child);
        }
    },

    resizeTabs: function () {


        this.showAllTabs();
        if (this.tabPositions == undefined) {
            this.tabPositions = {};
        }

        this.resizeTabsDom();

        if (this.tabPos === 'top' || this.tabPos === 'bottom')this.findHiddenTabs();
    },

    showAllTabs:function(){
        $.each(this.tabs, function (key) {
            this.tabs[key].show();

        }.bind(this));
    },

    resizeTabsDom: function () {
        var pos = 0;
        var size;

        $.each(this.tabs, function (key) {

            var node = this.tabs[key];
            if (this.tabPos === 'top' || this.tabPos === 'bottom') {
                size = node.outerWidth(true);
            } else {
                size = node.outerHeight(true);
            }
            this.tabPositions[key] = {
                pos: pos,
                size: size
            };
            node.css(this.getPosAttribute(), pos + 'px');

            pos += size;

            this.maxPos = pos;

        }.bind(this));
    },

    findHiddenTabs: function () {

        if (!this.tabParent)return;

        this.tabParent.css('left', 0);

        if (!this.haveTabsOutOfView()) {
            if (this.tabMenuEl)this.tabMenuEl.hide();
            return;
        }

        this.moveCurrentIntoView();

        this.hiddenTabs = [];

        var size = this.getBody().width();
        var menu = this.getMenuIcon();


        size -= menu.outerWidth(true);

        var pos = Math.abs(this.tabParent.position().left);

        $.each(this.tabPositions, function (id, position) {
            if (position.pos < pos || position.pos + position.size > pos + size) {
                this.hiddenTabs.push(id);

                if (position.pos >= pos) {
                    this.tabs[id].hide();
                }
            } else {
                this.tabs[id].show();
            }
        }.bind(this));

        menu.html(this.hiddenTabs.length);

        menu.css('visibility', this.hiddenTabs.length > 0 ? 'visible' : 'hidden');


        if (this.hiddenTabs.length > 0) {
            this.maxSize = size - menu.outerWidth(true);
            this.moveCurrentIntoView();
            this.getMenuIcon().show();
        }
        this.resizeTabsDom();
    },

    moveCurrentIntoView: function () {

        var size =  this.getBody().width();
        var menu = this.getMenuIcon();
        size -= menu.outerWidth(true);
        var pos = Math.abs(this.tabParent.position().left);

        var tabPosition = this.tabPositions[this.activeTabId];

        var offsetStart = tabPosition.pos - pos;
        var offsetEnd = (tabPosition.pos + tabPosition.size) - (pos + size);

        if(offsetStart < 0){
            this.tabParent.css('left', offsetStart);
        }else if(offsetEnd > 0){
            var newPos = pos - offsetEnd;
            this.tabParent.css('left', newPos);
        }
    },

    haveTabsOutOfView: function () {
        return this.maxPos > this.getBody().width();
    },

    getMenuIcon: function () {
        if (this.tabMenuEl == undefined) {

            if(this.tabPos == 'left' || this.tabPos == 'right') {
                this.tabMenuEl = this.getBody();
                return this.tabMenuEl;
            }
            this.tabMenuEl = $('<div class="ludo-tab-expand-box ludo-tab-expand-box-' + this.tabPos + '"></div>');
            this.getBody().append(this.tabMenuEl);

            var s = this.getBody().outerHeight() - this.elLine.height();
            var k = this.tabPos == 'top' ||this.tabPos == 'bottom' ? 'height' : 'width';
            this.tabMenuEl.css(k, s);

            if(this.tabPos == 'bottom'){
                this.tabMenuEl.css('top', this.elLine.height());
            }

            this.tabMenuEl.css('line-height', s + "px");

            this.tabMenuEl.on('click', this.toggleMenu.bind(this));
            this.tabMenuEl.css('visibility', 'hidden');

            this.tabMenuEl.mouseenter(this.enterMenuIcon.bind(this));
            this.tabMenuEl.mouseleave(this.leaveMenuIcon.bind(this));

        }
        return this.tabMenuEl;
    },

    enterMenuIcon:function(e){
        $(e.target).addClass('ludo-tab-expand-box-' + this.tabPos + '-over');
    },

    leaveMenuIcon:function(e){
        $(e.target).removeClass('ludo-tab-expand-box-' + this.tabPos + '-over');
    },

    getMenu: function () {
        if (this.menu == undefined) {
            var layout = {
                type: 'menu',
                orientation: 'vertical',
                alignLeft: this.tabMenuEl,
                height: 'wrap',
                width: 'wrap'
            };

            if(this.tabPos == 'top'){
                layout.below = this.tabMenuEl
            }else{
                layout.above = this.tabMenuEl;
            }
            this.menu = new ludo.menu.Menu({
                renderTo: document.body,
                hidden:true,
                alwaysInFront: true,
                layout: layout,
                listeners: {
                    'click': function (item) {
                        if(item.action && this.tabs[item.action] != undefined){
                            ludo.$(item.action).show();
                            this.menu.hide();
                            this.resizeTabs();
                        }
                    }.bind(this)
                }

            });
            this.menu.getEl().mousedown(ludo.util.cancelEvent);;
            ludo.EffectObject.on('start', this.hideMenu.bind(this));
            $(document.documentElement).mousedown(this.domClick.bind(this));

        }
        return this.menu;
    },

    menuShown:false,

    domClick:function(e){
        if(this.menu == undefined)return;
        if(e.target == this.tabMenuEl[0])return;
        this.hideMenu();
    },

    autoHide:function(){
        this.hideMenu();
    },

    hideMenu: function () {
        this.getMenu().hide();
    },


    toggleMenu:function(){
        var menu = this.getMenu();

        if(menu.isHidden()){
            this.showMenu();
        }else{
            this.menu.hide();
        }
    },

    showMenu: function () {
        this.menuShown = true;
        var menu = this.getMenu();

        menu.show();

        menu.disposeAllChildren();
        $.each(this.hiddenTabs, function (index, id) {
            menu.addChild({
                label: this.tabTitles[id],
                action: id
            });
        }.bind(this));

        this.menu.getLayout().resize();
    },

    createTabFor: function (child) {

        if (this.tabParent == undefined) {
            this.tabParent = $('<div style="position:absolute"></div>');
            if (this.tabPos == 'top' || this.tabPos == 'bottom') {
                this.tabParent.css({
                    height: this.getBody().height(),
                    width: 10000
                });
            } else {
                this.tabParent.css({
                    width: this.getBody().width(),
                    height: 10000
                });
            }

            this.getBody().append(this.tabParent);
        }
        var node;
        if (this.tabPos === 'top' || this.tabPos == 'bottom') {
            node = this.getPlainTabFor(child);
        } else {
            node = this.getSVGTabFor(child);
        }

        node.on('click', child.show.bind(child, false));
        this.tabParent.append(node);
        if (child.layout.closable) {
            this.addCloseButton(node, child);
        }
        node.css(this.getPosAttribute(), this.currentPos);
        node.addClass("ludo-tab-strip-tab");
        node.addClass('ludo-tab-strip-tab-' + this.tabPos);
        this.tabs[child.getId()] = node;

        if (!child.isHidden())this.activateTabFor(child);

    },

    addCloseButton: function (node, child) {
        var el = $('<div>');
        el.addClass('ludo-tab-close ludo-tab-close-' + this.tabPos);
        el.mouseenter(this.enterCloseButton.bind(this));
        el.mouseleave(this.leaveCloseButton.bind(this));
        el.attr('id', 'tab-close-' + child.id);
        el.on('click', this.removeChild.bind(this));
        node.append(el);
        var p;
        switch (this.tabPos) {
            case 'top':
            case 'bottom':
                p = node.css('padding-right');
                node.css('paddingRight', (parseInt(p) + el.outerWidth()));
                break;
            case 'right':
                p = node.css('padding-right');
                node.css('paddingBottom', (parseInt(p) + el.outerHeight()));
                break;
            case 'left':
                p = node.css('padding-right');
                node.css('paddingTop', (parseInt(p) + el.outerHeight()));
                break;
        }
    },

    removeChild: function (e) {
        var id = e.target.id.replace('tab-close-', '');
        ludo.get(id).remove();
        return false;
    },

    removeTabFor: function (child) {
        this.tabs[child.getId()].remove();
        delete this.tabs[child.getId()];
        this.resizeTabs();
    },

    enterCloseButton: function (e) {
        $(e.target).addClass('ludo-tab-close-' + this.tabPos + '-over');
    },

    leaveCloseButton: function (e) {
        $(e.target).removeClass('ludo-tab-close-' + this.tabPos + '-over');
    },

    getPosAttribute: function () {
        if (!this.posAttribute) {
            switch (this.tabPos) {
                case 'top':
                case 'bottom':
                    this.posAttribute = 'left';
                    break;
                case 'left':
                case 'right':
                    this.posAttribute = 'top';
                    break;
            }
        }
        return this.posAttribute;
    },


    getPlainTabFor: function (child) {
        var el = $('<div>');
        this.getBody().append(el);
        el.className = 'ludo-tab-strip-tab ludo-tab-strip-tab-' + this.tabPos;
        el.html('<div class="ludo-tab-strip-tab-bg-first"></div><div class="ludo-tab-strip-tab-bg-last"></div><span>' + this.getTitleFor(child) + '</span>');
        return el;
    },

    getSVGTabFor: function (child) {
        var el = $('<div>');
        this.getBody().append(el);
        el.html('<div class="ludo-tab-strip-tab-bg-first"></div><div class="ludo-tab-strip-tab-bg-last">');
        var svgEl = $('<div>');
        el.append(svgEl);
        var box = new ludo.layout.TextBox({
            renderTo: svgEl,
            width: 1000, height: 1000,
            className: 'ludo-tab-strip-tab-txt-svg',
            text: this.getTitleFor(child),
            rotation: this.getRotation()
        });
        var size = box.getSize();
        svgEl.css({
            'width': size.x, height: size.y
        });

        return el;
    },

    getRotation: function () {
        if (this.rotation === undefined) {
            switch (this.tabPos) {
                case 'left' :
                    this.rotation = 270;
                    break;
                case 'right' :
                    this.rotation = 90;
                    break;
                case 'bottom' :
                    this.rotation = 180;
                    break;
                default :
                    this.rotation = 0;
                    break;
            }
        }
        return this.rotation;
    },

    getTitleFor: function (child) {
        var title = (child.title || child.layout.title || child.getTitle());
        this.tabTitles[child.id] = title;
        return title;
    },

    activateTabFor: function (child) {
        if (this.activeTab !== undefined) {
            this.activeTab.removeClass('ludo-tab-strip-tab-active');
        }
        if (this.tabs[child.id] !== undefined) {
            this.tabs[child.id].addClass('ludo-tab-strip-tab-active');
            this.activeTab = this.tabs[child.id];
            this.activeTab.css('zIndex', this.currentZIndex);
            this.currentZIndex++;

            this.activeTabId = child.id;

            if(this.hiddenTabs.length > 0){
                this.resizeTabs();
            }
        }

    },

    ludoDOM: function () {
        this.parent();
        this.getEl().addClass('ludo-tab-strip');
        this.getEl().addClass('ludo-tab-strip-' + this.tabPos);

        var el = $('<div>');
        el.addClass('ludo-tab-strip-line');
        this.elLine = el;
        this.getBody().append(el);

        this.getMenuIcon();
    },

    getTabFor: function (child) {
        return this.tabs[child.id]
    },

    getChangedViewport: function () {
        var value;
        if (this.tabPos === 'top' || this.tabPos === 'bottom') {
            value = this.getEl().outerHeight();
        } else {
            value = this.getEl().outerWidth();
        }
        return {
            key: this.tabPos, value: value
        };
    },
    getCount: function () {
        return Object.keys(this.tabs).length;
    },

    resize: function (size) {
        this.parent(size);
    }
});