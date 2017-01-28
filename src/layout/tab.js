/**
 * Layout rendering child views in a tab layout. By default, the first child view will be displayed. You can override
 * this by setting **layout.visible** to true for a specific child.
 *
 * For a demo, see <a href="../demo/layout/tab.php" onclick="var w=window.open(this.href);return false">Tab layout demo</a>.
 * @class layout.Tab
 * @namespace ludo.layout
 * @summary layout: layout: {type: "tab" }
 * @class ludo.layout.Tab
 * @param {Object} config
 * @param {String} config.tabPos Position of tabs, **left**, **top**, **right** or **bottom**
 * @param {String} config.title **Option** for child views layout object. The title will be displayed on the tab.
 * @param {Boolean} config.visible **Option** for child views layotu object. True to initially display a different
 * tab than the first
 * @example
 *     var w = new ludo.Window({
        left: 50, top: 50,
        title: 'Tab layout',
        width: 500, height: 400,
        layout: {
            type: 'tab',
            tabs: 'top'
        },
        children:[
            {
                title:'first tab'
            },
            {
                title:'second tab',
                layout:{
                    visible:true
                }
            }
        ]
        });
 */
ludo.layout.Tab = new Class({
    Extends: ludo.layout.Relative,
    visibleChild: undefined,
    tabStrip: undefined,
    type:'layout.Tab',

    onCreate: function () {
        this.parent();
        this.view.getEl().addClass('ludo-layout-tab');
        this.addChild(this.getTabs());

        this.updateViewport(this.tabStrip.getChangedViewport());
    },

    afterCreate:function(){

    },

    addChild: function (child, insertAt, pos) {


        if (!this.isTabs(child) && (!child.layout || !child.layout.visible))child.hidden = true;
        return this.parent(child, insertAt, pos);

    },

    onNewChild: function (child) {

        if (!this.isTabs(child)) {
            var l = child.layout;

            if (!child.isHidden()) {
                this.setVisibleChild(child);
            }

            l.alignParentLeft = true;
            l.alignParentTop = true;
            l.fillRight = true;
            l.fillDown = true;

        }
        this.parent(child);
    },

    setTemporarySize: function () {

    },

    addChildEvents: function (child) {
        if (!this.isTabs(child)) {
            child.addEvent('show', this.showTab.bind(this));
            child.addEvent('remove', this.onChildDispose.bind(this));
        }
    },

    getTabPosition: function () {
        return this.view.layout.tabs || 'top';
    },

    canHaveNoActiveTabs:false,

    getTabs: function () {
        if (this.tabStrip === undefined) {
            this.tabStrip = new ludo.layout.Tabs({
                lm: this,
                parentComponent: this.view,
                tabPos: this.getTabPosition(),
                renderTo: this.view.getBody(),
                layout: this.getTabsLayout(),
                canHaveNoActiveTabs:this.canHaveNoActiveTabs
            });
        }
        return this.tabStrip;
    },

    setVisibleChild: function (child) {
        if (this.visibleChild)this.visibleChild.hide();
        this.visibleChild = child;
        this.fireEvent('showChild', child);
    },

    showTab: function (child) {
        if (child !== this.visibleChild) {
            if(this.visibleChild){
                this.visibleChild.getEl().css('visibility', 'hidden');
            }
            child.getEl().css('visibility', 'visible');
            this.setVisibleChild(child);
            this.resize();
        }

    },

    resize: function () {

        if (this.visibleChild === undefined && this.autoShowFirst()) {
            if (this.view.children.length > 1)this.view.children[1].show();
        } else {

            if (this.children === undefined || (this.visibleChild && !this.visibleChild.layoutResizeFn)) {
                this.prepareResize();
            }

            this.tabStrip.layoutResizeFn.call(this.visibleChild, this);

            if (this.visibleChild) {

                if (!this.visibleChild.layoutResizeFn) {
                    this.prepareResize();
                }
                this.visibleChild.layoutResizeFn.call(this.visibleChild, this);
            }
        }
    },

    autoShowFirst: function () {
        return true;
    },

    getTabsLayout: function () {
        switch (this.getTabPosition()) {
            case 'top':
                return {
                    absTop: true,
                    absLeft: true,
                    absWidth: true
                };
            case 'left':
                return {
                    absTop: true,
                    absLeft: true,
                    absHeight: true
                };
            case 'right':
                return {
                    absTop: true,
                    absRight: true,
                    absHeight: true
                };
            case 'bottom':
                return {
                    absBottom: true,
                    absLeft: true,
                    absWidth: true
                };
        }
        return undefined;
    },

    isTabs: function (view) {
        return view.type === 'layout.Tabs';
    },

    onChildDispose: function (child) {
        if (this.visibleChild && this.visibleChild.id === child.id) {
            var i = this.view.children.indexOf(this.visibleChild);
            if (i > 1) {
                this.view.children[i - 1].show();
            } else {
                if (this.view.children.length > 2) {
                    this.view.children[i + 1].show();
                }
            }
        }

        this.fireEvent('removeChild', child);
    }
});