/* TODO should be able to update tab title when view title is changed */
ludo.layout.TabStrip = new Class({
    Extends:ludo.View,
    type:'layout.TabStrip',
    tabPos:'left',
    lm:undefined,
    tabs:{},
    currentPos:-1,
    activeTab:undefined,
    currentZIndex:3,

    __construct:function (config) {
        this.parent(config);
        if (config.tabPos !== undefined)this.tabPos = config.tabPos;
        this.lm = config.lm;
    },
    ludoEvents:function () {
        this.parent();
        this.lm.addEvent('addChild', this.registerChild.bind(this));
        this.lm.addEvent('showChild', this.activateTabFor.bind(this));
        this.lm.addEvent('removeChild', this.removeTabFor.bind(this));
        this.addEvent('resize', this.resizeTabs.bind(this));
    },

    __rendered:function(){
        this.parent();
        this.resizeTabs();
    },

    registerChild:function (layout, parent, child) {
        if (!this.lm.isTabStrip(child)) {
            this.createTabFor(child);
        }
    },

    resizeTabs:function () {
        this.currentPos = -1;
        for (var key in this.tabs) {
            if (this.tabs.hasOwnProperty(key)) {
                var node = this.tabs[key];
                node.css(this.getPosAttribute(), this.currentPos + 'px');
                this.increaseCurrentPos(node);
            }
        }
    },

    createTabFor:function (child) {
        var node;
        if (this.tabPos === 'top' || this.tabPos == 'bottom') {
            node = this.getPlainTabFor(child);
        } else {
            node = this.getSVGTabFor(child);
        }

        node.on('click', child.show.bind(child, false));
        this.getBody().append(node);
        if (child.layout.closable) {
            this.addCloseButton(node, child);
        }
        node.css(this.getPosAttribute(), this.currentPos);
        node.addClass("ludo-tab-strip-tab");
        node.addClass('ludo-tab-strip-tab-' + this.tabPos);
        this.tabs[child.getId()] = node;
        this.increaseCurrentPos(node);
        if (!child.isHidden())this.activateTabFor(child);
    },

    addCloseButton:function (node, child) {
        var el = $('<div>');
        el.addClass('ludo-tab-close ludo-tab-close-' + this.tabPos);
        el.mouseenter(this.enterCloseButton.bind(this));
        el.mouseleave(this.leaveCloseButton.bind(this));
        el.id = 'tab-close-' + child.id;
        el.on('click', this.removeChild.bind(this));
        node.append(el);
        var p;
        switch (this.tabPos) {
            case 'top':
            case 'bottom':
                p = node.css('padding-right');
                node.css('paddingRight', (parseInt(p) + el.width()));
                break;
            case 'right':
                p = node.css('padding-right');
                node.css('paddingBottom', (parseInt(p) + el.height()));
                break;
            case 'left':
                p = node.css('padding-right');
                node.css('paddingTop',(parseInt(p) + el.height()));
                break;
        }
    },

    removeChild:function (e) {
        var id = e.target.id.replace('tab-close-', '');
        ludo.get(id).dispose();
        return false;
    },

    removeTabFor:function (child) {
        this.tabs[child.getId()].remove();
        delete this.tabs[child.getId()];
        this.resizeTabs();
    },

    enterCloseButton:function (e) {
        $(e.target).addClass('ludo-tab-close-' + this.tabPos + '-over');
    },

    leaveCloseButton:function (e) {
        $(e.target).removeClass('ludo-tab-close-' + this.tabPos + '-over');
    },

    getPosAttribute:function () {
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

    increaseCurrentPos:function (node) {
        if (this.tabPos === 'top' || this.tabPos === 'bottom') {
            this.currentPos += node.outerWidth() + ludo.dom.getMW(node);
        } else {
            this.currentPos += node.outerHeight() + ludo.dom.getMH(node);
        }
        this.currentPos--;
    },

    getPlainTabFor:function (child) {
        var el = $('<div>');
        this.getBody().append(el);
        el.className = 'ludo-tab-strip-tab ludo-tab-strip-tab-' + this.tabPos;
        el.html('<div class="ludo-tab-strip-tab-bg-first"></div><div class="ludo-tab-strip-tab-bg-last"></div><span>' + this.getTitleFor(child) + '</span>');
        return el;
    },

    getSVGTabFor:function (child) {
        var el = $('<div>');
        this.getBody().append(el);
        el.html('<div class="ludo-tab-strip-tab-bg-first"></div><div class="ludo-tab-strip-tab-bg-last">');
        var svgEl = $('<div>');
        el.append(svgEl);
        var box = new ludo.layout.TextBox({
            renderTo:svgEl,
            width:1000, height:1000,
            className:'ludo-tab-strip-tab-txt-svg',
            text:this.getTitleFor(child),
            rotation:this.getRotation()
        });
        var size = box.getSize();
        svgEl.css({
            'width':size.x, height: size.y
        });

        return el;
    },

    getRotation:function () {
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

    getTitleFor:function (child) {
        return (child.title || child.layout.title || child.getTitle());
    },

    activateTabFor:function (child) {
        if (this.activeTab !== undefined) {
            this.activeTab.removeClass('ludo-tab-strip-tab-active');
        }
        if (this.tabs[child.id] !== undefined) {
            this.tabs[child.id].addClass('ludo-tab-strip-tab-active');
            this.activeTab = this.tabs[child.id];
            this.activeTab.css('zIndex', this.currentZIndex);
            this.currentZIndex++;
        }
    },

    ludoDOM:function () {
        this.parent();
        this.getEl().addClass('ludo-tab-strip');
        this.getEl().addClass('ludo-tab-strip-' + this.tabPos);

        var el = $('<div>');
        el.addClass('ludo-tab-strip-line');
        this.getBody().append(el);
    },

    getTabFor:function (child) {
        return this.tabs[child.id]
    },

    getChangedViewport:function () {
        var value;
        if (this.tabPos === 'top' || this.tabPos === 'bottom') {
            value = this.getEl().outerHeight();
        } else {
            value = this.getEl().outerWidth();
        }
        return {
            key:this.tabPos, value:value
        };
    },
    getCount:function () {
        return Object.keys(this.tabs).length;
    }
});