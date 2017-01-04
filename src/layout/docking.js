/**
 * Docking Layout
 * This layout extends <a href="ludo.layout.Tab.html">layout.Tab</a> and displays child views in a tab layout.
 *
 * The difference between the Docking Layout and the Tabs layout is that in the docking layout, you don't need
 * to show any child views. When no child views are visible, the view with the docking layout will collapse to
 * the size of the Tab Bar.
 *
 *
 * Initially, no child view is displayed unless **layout.visible** is set on a child view.
 *
 *
 * For a demo, see <a href="../demo/layout/docking.php" onclick="var w=window.open(this.href);return false">Docking layout demo</a>.
 * @class ludo.layout.Docking
 * @augments ludo.layout.Tab
 * @summary layout: layout: {type: "tab" }
 * @example
 var w = new ludo.Window({
        title:'Docking layout',
        id:'dockingWindow',
        layout:{
            left:50, top:50,
            width:700, height:600,
            type:'linear',
            orientation:'horizontal'
        },
        children:[ // Children for the accordion listed below
            {
                id:'dockingLayoutView',
                layout:{
                    type:'docking',
                    width:200,
                    resizable:true,
                    tabs:'left'
                },
                children:[
                    {
                        id:'view1',
                        title: 'Project',// Title for the accordion
                        html:'<ul><li>Content</li><li>Content</li><li>Content</li><li>Content</li></ul>'
                    },
                    {
                        id:'view2',
                        title: 'Structure', // Title for the accordion
                        html:'Second child view'
                    }
                ]
            },
            {
                html:'<h1>Main View</h1>',
                css:{
                    padding:5,
                    'border-left': '1px solid ' + ludo.$C('border')
                },
                layout:{
                    weight:1
                }
            }
        ]
    });
 */
ludo.layout.Docking = new Class({
    Extends: ludo.layout.Tab,
    type: 'layout.Docking',
    storedSize: undefined,
    collapsed: true,

    tabSize: undefined,
    tabSizeKey: undefined,


    prepareForChildrenOnCreate:function(children){

        jQuery.each(children, function(i, child){
            if(child.layout && child.layout.visible)this.collapsed = false;
        }.bind(this));


        if(this.collapsed){
            this.storedSize = {
                key: this.getTabSizeKey(),
                value: this.view.layout[this.getTabSizeKey()]
            };

            this.view.layout[this.getTabSizeKey()] = this.pixelSize();

        }
    },

    addChildEvents:function(child){
        this.parent(child);
        if (!this.isTabs(child)) {
            child.addEvent('hide', this.hideTab.bind(this));

        }
    },

    hideTab:function(child){
        if (child == this.visibleChild) {
           this.collapse();
           this.fireEvent('hideChild', child);
        }
    },

    setVisibleChild: function (child) {
        if (!this.collapsed) {
            this.visibleChild = child;
            this.fireEvent('showChild', child);
        }
    },

    collapse: function () {
        this.fireEvent('collapse', this);

        this.visibleChild = undefined;

        this.collapsed = true;

        this.storeSize();

        switch (this.getTabPosition()) {
            case 'top':
            case 'bottom':
                this.view.resize({
                    height: this.pixelSize()
                });
                break;
            case 'left':
            case 'right':
                this.view.layout.width = this.pixelSize();
                this.view.resize({
                    width: this.pixelSize()
                });
        }

        this.resizeParentView();
    },

    storeSize:function(){
        switch (this.getTabPosition()) {
            case 'top':
            case 'bottom':
                if(this.storedSize == undefined)this.storedSize = {key:'height', value : this.viewport.height};

                break;
            case 'left':
            case 'right':
                if(this.storedSize == undefined){
                    this.storedSize = {key:'width', value: this.viewport.width};
                }

        }
    },


    showTab: function (child) {
        if (child == this.visibleChild) {
            this.collapse();
            this.fireEvent('hideChild', child);
        } else {
            if (this.collapsed) {
                this.fireEvent('expand');
                this.collapsed = false;

                this.updateViewport(this.storedSize);
                var r = {};
                r[this.storedSize.key] = this.storedSize.value;

                this.view.resize(r);
                this.resize();

                this.resizeParentView();

            }
            this.parent(child);
        }

    },

    tabPixelSize:undefined,

    isHorizontal:function(){
        var pos= this.getTabPosition();
        return pos == 'top' || pos == 'bottom';
    },

    pixelSize:function(){
        if (this.tabPixelSize == undefined) {
            if(this.isHorizontal()){
                this.tabPixelSize = this.view.children[0].getBody().height();
            }else{
                this.tabPixelSize = this.view.children[0].getBody().width();
            }

        }
        return this.tabPixelSize;
    },

    getTabSize: function () {
        if (this.tabSize == undefined) {
            if(this.isHorizontal()){
                this.tabSize = {key: 'height', value: this.pixelSize()};
            }else{
                this.tabSize = {key: 'width', value:  this.pixelSize()};
            }
        }
        return this.tabSize;
    },

    getTabSizeKey: function () {
        if (this.tabSizeKey == undefined) {
            switch (this.getTabPosition()) {
                case 'top':
                case 'bottom':
                    this.tabSizeKey = 'height';
                    break;
                case 'left':
                case 'right':
                    this.tabSizeKey = 'width';
            }

        }
        return this.tabSizeKey;
    },

    autoShowFirst: function () {
        return false;
    },

    resizeParentView: function () {
        if (this.view.parentComponent) {
            this.view.parentComponent.getLayout().resize();
        }
    },

    beforeFirstResize:function(){
        if(this.collapsed){
            this.fireEvent('collapse');

        }
    },

    resizeChildren: function () {
        this.parent();
        if (!this.collapsed) {
            var key = this.getTabSizeKey();
            var val = this.viewport[key];

            if (val > this.getTabSize().value) {
                this.storedSize = {
                    key: key,
                    value: val
                };
            }
        }
    }
});