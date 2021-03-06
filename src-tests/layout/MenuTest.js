TestCase("MenuTest", {

    "test menu layout should be inherited to children":function () {
        // given
        var cmp = this.getMenuComponent();

        // when
        var child = cmp.child['b'];

        // then
        assertEquals('menu', child.layout.type);
        assertEquals('vertical', child.layout.orientation);
    },

    "test should get menu containers to show for a menu item":function () {
        // given
        var cmp = this.getMenuComponent();

        // when
        var child = cmp.child['b'];
        var childBa = cmp.child['b'].child['ba'];
        var grandGrandChild = cmp.child['b'].child['ba'].child['baa'];

        var childC = cmp.child['c'];
        var childD = cmp.child['d'];


        // then
        assertEquals(1, child.getMenuContainersToShow().length);
        assertEquals(0, childD.getMenuContainersToShow().length);
        assertEquals(1, childC.getMenuContainersToShow().length);


        assertEquals(1, child.getMenuContainersToShow().length);
        assertEquals(1, child.getMenuContainersToShow().length);
        assertEquals(childBa.getMenuContainer(), child.getMenuContainersToShow()[0]);


        assertEquals(cmp.child['c'].child['ca'].getMenuContainer(), childC.getMenuContainersToShow()[0]);

        assertEquals(2, grandGrandChild.getMenuContainersToShow().length);
        assertEquals(childBa.getMenuContainer().getEl(), childBa.getMenuContainersToShow()[0].getEl());
        assertEquals(grandGrandChild.getMenuContainer().getEl(), childBa.getMenuContainersToShow()[1].getEl());

        assertNotUndefined(childBa.getMenuContainerToShow());
        assertEquals(2, childBa.getMenuContainersToShow().length);
        assertEquals(childBa.getMenuContainer(), childBa.getMenuContainersToShow()[0]);
        assertEquals(grandGrandChild.getMenuContainer().getEl(), childBa.getMenuContainersToShow()[1].getEl());
    },

    "test should find menu containers to show for sub item with children":function () {
        // given
        var cmp = this.getMenuComponent();

        // when
        var childBa = cmp.child['b'].child['ba'];
        var grandGrandChild = cmp.child['b'].child['ba'].child['baa'];

        assertNotUndefined(childBa.getMenuContainerToShow());
        assertEquals(2, childBa.getMenuContainersToShow().length);
        assertEquals(childBa.getMenuContainer().getEl(), childBa.getMenuContainersToShow()[0].getEl());
        assertEquals(grandGrandChild.getMenuContainer().getEl(), childBa.getMenuContainersToShow()[1].getEl());
    },

    "test default type of children should be menu.Item":function () {
        // given
        var cmp = this.getMenuComponent();

        // when
        var child = cmp.child['b'];

        // then
        assertEquals('menu.Item', child.type);
    },

    "test should not hide and show menu container when moving from sibling to sibling":function () {
        // given
        var c = this.getMenuComponent();
        var eventFired = false;

        // when
        c.child['b'].click();
        c.child['b'].child['bb'].mouseOver();

        c.child['b'].child['bb'].getMenuContainer().addEvent('hide', function () {
            eventFired = true;
        });

        c.child['b'].child['bc'].mouseOver();

        // then
        assertFalse(eventFired);
    },

    "test should render children inside menu container":function () {
        // given
        var cmp = this.getMenuComponent();

        // when
        var child = cmp.child['b'];
        var grandChild = cmp.child['b'].child['ba'];

        // then
        assertEquals(cmp.child['b'].getLayout().getMenuContainer().$b().attr("id"), grandChild.getEl().parent().attr("id"));
        assertEquals(cmp.$b().attr("id"), child.getEl().parent().attr("id"));
    },

    "test width of horizontal menu items should be wrap":function () {

    },

    "test should determine if a menu item is top menu item":function () {
        // given
        var c = this.getMenuComponent();

        // when
        var childTop = c.child['a'];
        var childSub = c.child['b'].child['ba'];
        var childSubSub = c.child['b'].child['ba'].child['baa'];

        // then
        assertTrue(childTop.isTopMenuItem());
        assertFalse(childSub.isTopMenuItem());
        assertFalse(childSubSub.isTopMenuItem());
    },

    "test should activate horizontal menu items on click":function () {


    },

    "test should by default activate vertical menu on mouse over":function () {
        // given
        var c = this.getMenuComponent({
            orientation:'vertical'
        });

        // when
        c.child['b'].mouseOver();

        // then
        assertEquals('block', c.child['b'].child['ba'].getMenuContainer().getEl().css('display'));

    },

    "test vertical menu items on top level should by default be visible":function () {
        // given
        var c = this.getMenuComponent({
            orientation:'vertical'
        });

        // when
        assertFalse(c.child['b'].isHidden());
    },

    "test menu container of vertical top menu should be parents body":function () {
        // given
        var c = this.getMenuComponent({
            orientation:'vertical'
        });

        // when
        var child = c.child['b'];

        // then
        assertEquals(c.$b().attr("id"), child.getEl().parent().attr("id"));
    },

    "test should assign css class to menu containers":function () {
        // given
        var c = this.getMenuComponent({
            orientation:'vertical'
        });

        // then
        assertTrue(c.child['b'].child['ba'].getEl().parent().parent().hasClass('ludo-menu'));
        assertTrue(c.child['b'].getEl().parent().parent().hasClass('ludo-menu'));
    },

    "test should be able to get parent menu items as array":function () {
        // given
        var c = this.getMenuComponent();
        var child = c.child['b'].child['ba'].child['bab'];
        // when
        var items = child.getParentMenuItems();

        // then
        assertEquals(2, items.length);
        assertEquals(c.child['b'].child['ba'], items[0]);
        assertEquals(c.child['b'], items[1]);

    },

    "test should set parent menu items to active when mouse over sub item":function () {
        // given
        var c = this.getMenuComponent();
        c.child['b'].click();
        var child = c.child['b'].child['ba'].child['bab'];

        // when
        child.mouseOver();
        var items = child.getParentMenuItems();

        // then
        assertTrue(items[0].getEl().className, ludo.dom.hasClass(items[0].getEl(), 'ludo-menu-item-active'));
        assertTrue(ludo.dom.hasClass(items[1].getEl(), 'ludo-menu-item-active'));
    },

    "test should clear previous highlighted path when mouse over new path":function () {
        // given
        var c = this.getMenuComponent();
        var child = c.child['b'].child['ba'].child['bab'];

        // when
        child.mouseOver();
        var items = child.getParentMenuItems();
        c.child['c'].mouseOver();

        // then
        assertFalse(ludo.dom.hasClass(items[0].getEl(), 'ludo-menu-item-active'));
        assertFalse(ludo.dom.hasClass(items[1].getEl(), 'ludo-menu-item-active'));
    },

    "test should hide menus on menu item click":function () {
        // given
        var c = this.getMenuComponent();

        // when
        c.child['b'].click();
        assertEquals('block', c.child['b'].child['ba'].getMenuContainer().getEl().css('display'));
        c.child['b'].child['bb'].click();


        // then
        assertEquals('none', c.child['b'].child['ba'].getMenuContainer().getEl().css('display'));
    },


    "test should find menu container to show for an item":function () {
        // given
        var c = this.getMenuComponent();

        // when
        var child = c.child['b'];

        // then
        assertEquals(child.getMenuContainerToShow().getEl(), child.child['ba'].getMenuContainer().getEl());
    },

    "test should find parent menu item":function () {
        // given
        var c = this.getMenuComponent();

        // then

        assertUndefined(c.child['b'].getParentMenuItem());
        assertEquals(c.child['b'], c.child['b'].child['ba'].getParentMenuItem());
        assertEquals(c.child['b'].child['ba'], c.child['b'].child['ba'].child['baa'].getParentMenuItem());
    },

    "test should set layout of menu containers for sub menu of horizontal":function () {
        // given
        var c = this.getMenuComponent();

        // when
        var grandChild = c.child['b'].child['ba'];

        // then
        assertEquals(c.child['b'].getParent().getEl(), grandChild.getMenuContainer().layout.below);
        assertEquals(c.child['b'], grandChild.getMenuContainer().layout.alignLeft);

    },
    "test should set layout of menu containers for sub menu of vertical":function () {
        // given
        var c = this.getMenuComponent();

        // when
        var grandChild = c.child['b'].child['ba'].child['baa'];

        // then
        assertEquals(c.child['b'].child['ba'].getEl(), grandChild.getMenuContainer().layout.rightOrLeftOf);
        assertEquals(c.child['b'].child['ba'], grandChild.getMenuContainer().layout.alignTop);
        assertTrue(grandChild.getMenuContainer().layout.fitVerticalViewPort);

    },

    "test menu containers of sub items should have fitVerticalViewPort set to true":function () {
        // given
        var c = this.getMenuComponent();

        // when
        c.child['b'].click();
        c.child['b'].child['ba'].mouseOver();

        var child = c.child['b'].child['ba'].child['baa'];

        // then
        assertEquals('layout.MenuContainer', child.getMenuContainer().type);
        assertTrue(child.getMenuContainer().layout.fitVerticalViewPort);
    },

    "test should be able to define keyboard shortcuts":function () {

    },

    "test should be able to specify leftOrRight layout":function () {

    },

    "test width and height of menu container(vertical) should be set to wrap":function () {

    },

    "test top level menu items should use parent as menu container":function () {

    },

    "test top pos of menu container should be adjusted when there's not enough space":function () {

    },

    "test children with specific layout should not be changed":function () {
        // given
        var c = this.getMenuComponent();

        // when
        var calendar = c.child['b'].child['ba'].child['baa'];

        // then
        assertEquals('linear', calendar.layout.type);
    },

    "test should be able to navigate in menu items using arrow keys":function () {

    },

    "test children with different layout type than menu should not have any sub containers to show":function () {
        // given
        var c = this.getMenuComponent();

        // when
        var calendar = c.child['b'].child['ba'].child['baa'];

        // then
        assertUndefined(calendar.getMenuContainerToShow());

    },

    "test items without children should not have any menu container to show":function () {
        // given
        var c = this.getMenuComponent();

        // when
        var child = c.child['d'];

        // then
        assertUndefined(child.getMenuContainerToShow());
        assertEquals(0, child.getMenuContainersToShow().length);
    },

    "test should find reference to top layout manager":function () {
        // given
        var c = this.getMenuComponent();
        var lm = c.getLayout();
        c.child['b'].show();
        c.child['b'].showChild('ba');
        c.child['b'].child['ba'].showChild('baa');

        // when
        var lmItem = c.child['b'].getMenuLayoutManager();
        var lmItemSub = c.child['b'].child['ba'].getMenuLayoutManager();
        var lmItemSubSub = c.child['b'].child['ba'].child['baa'].getMenuLayoutManager();

        // then
        assertEquals(lm, lmItem);
        assertEquals(lm, lmItemSub);
        assertEquals(lm, lmItemSubSub);
    },

    "test should get reference top top menu component":function () {
        // given
        var c = this.getMenuComponent();

        // then
        assertEquals(c, c.child['b'].getMenuComponent());
        assertEquals(c, c.child['b'].child['ba'].getMenuComponent());
        assertEquals(c, c.child['b'].child['ba'].child['baa'].getMenuComponent());
    },

    "test should expand sub menu of horizontal menu on click":function () {
        // given
        var c = this.getMenuComponent();

        // when
        c.child['b'].click();

        // then
        assertEquals('block', c.child['b'].child['ba'].getMenuContainer().getEl().css('display'));
    },

    "test expand menus on mouse over after activating on click":function () {
        // given
        var c = this.getMenuComponent();

        // when
        c.child['b'].click();
        c.child['c'].mouseOver();

        // then
        assertEquals('block', c.child['c'].child['ca'].getMenuContainer().getEl().css('display'));
        assertEquals('none', c.child['b'].child['ba'].getMenuContainer().getEl().css('display'));
    },

    "test should show sub menus on mouse over":function () {
        // given
        var c = this.getMenuComponent();

        // when
        c.child['b'].click();
        c.child['b'].child['ba'].mouseOver();


        // then
        assertEquals('block', c.child['b'].child['ba'].getMenuContainer().getEl().css('display'));
        assertEquals('block', c.child['b'].child['ba'].child['baa'].getMenuContainer().getEl().css('display'));

    },

    "test should hide other menus on click on new one":function () {
        // given
        var c = this.getMenuComponent();

        // when
        c.child['b'].click();
        c.child['c'].click();
        c.child['c'].click();

        // then
        assertEquals('block', c.child['c'].child['ca'].getMenuContainer().getEl().css('display'));
        assertEquals('none', c.child['b'].child['ba'].getMenuContainer().getEl().css('display'));
    },

    "test should be able to set menu default active":function () {
        // given
        var c = this.getMenuComponent({
            active:true
        });

        // when
        c.child['b'].mouseOver();

        // then
        assertEquals('block', c.child['b'].child['ba'].getMenuContainer().getEl().css('display'));
    },

    "test click event should be relayed to top menu component":function () {
        // given
        var c = this.getMenuComponent();
        var eventFired = false;
        var firedFromView = undefined;

        //  when
        c.addEvent('click', function (view) {
            eventFired = true;
            firedFromView = view;
        });
        var child = c.child['b'].child['ba'];
        child.click();

        // then
        assertTrue(eventFired);
        assertEquals(c.child['b'].child['ba'], firedFromView);
    },

    "test size of menu containers should not change on second display":function () {
        // given
        var c = this.getMenuComponent();


        c.child['c'].click();
        c.child['c'].child['cb'].mouseOver();
        var expectedSize = c.child['c'].child['cb'].getMenuContainer().getEl().width();

        // when
        c.child['c'].child['cc'].mouseOver();
        c.child['c'].child['cb'].mouseOver();

        var size = c.child['c'].child['cb'].getMenuContainer().getEl().width();

        assertEquals(expectedSize, size);


    },
    "test classes extending menu items should have correct layout settings":function () {
        // given
        var c = this.getMenuComponent();

        // when
        var child = c.child['custom'];

        // then
        assertEquals(25, child.layout.height);
    },

    "test menu containers without any Menu.Item should be wider than widest menu item":function () {
        // given
        var c = new ludo.menu.Context({
            children:[
                { type:'form.Checkbox', width:200, label:'Hello', labelWidth:150 },
                { type:'form.Checkbox', layout:{ width:300 }, label:'Next item is coming here' },
                { type:'form.Checkbox', layout:{ width:220 }, label:'Next item' },
                { type:'form.Checkbox', layout:{ width:180 }, label:'Next item' },
                { type:'calendar.Calendar', layout:{ width:400 } }

            ]
        });
        c.show({
            page:{x:10, y:10}
        });

        var expectedWidth = 0;
        for (var i = 0; i < c.children.length; i++) {
            expectedWidth = Math.max(expectedWidth, c.children[i].getEl().width() + ludo.dom.getMW(c.children[i].getEl()));
        }

        var containerWidth = c.getEl().width() + ludo.dom.getMW(c.getEl());
        console.log(containerWidth);
        assertEquals(expectedWidth, containerWidth);
    },

    "test should not show context menu in max width when item has layout width":function () {
        // given
        var c = new ludo.menu.Context({
            children:[
                { type:'calendar.Calendar', layout:{ width:400, height:200 } }
            ]
        });

        // when
        c.show({ pageX:10, pageY:10 });

        console.log(c.layout);
        console.log(c.children[0].layout);

        assertEquals(400, ludo.dom.getWrappedSizeOfView(c).x);
        assertEquals(200, ludo.dom.getWrappedSizeOfView(c).y);

        // then
        assertEquals(400, c.getEl().width() - ludo.dom.getPW(c.getEl()) - ludo.dom.getBW(c.getEl()));

    },

    "test should not call resize function more than necessary":function () {

        var countResize = 0;
        // given
        var c = this.getMenuComponent({
            orientation:'vertical'
        });
        c.child['a'].click();
        // when
        c.child['c'].child['ca'].getMenuContainer().addEvent('resize', function () {
            countResize++;
        });
        c.child['c'].mouseOver();
        c.child['c'].mouseOver();
        c.child['c'].child['ca'].mouseOver();
        c.child['c'].child['cb'].mouseOver();

        // then
        assertEquals(1, countResize);

    },

    "test height of context menu should be correct":function () {
        // given
        var c = new ludo.menu.Context({
            children:['One', 'Two', 'Three', 'Four', 'Five']
        });
        c.show({
            pageX:100,pageY:100
        });

        var expectedHeight = 0;
        for (var i = 0; i < c.children.length; i++) {
            expectedHeight += c.children[i].getEl().height() + ludo.dom.getMH(c.children[i].getEl());
        }

        assertEquals(expectedHeight, c.getEl().height() - ludo.dom.getBH(c.getEl()) - ludo.dom.getPH(c.getEl()));
    },

    "test should be able to show vertical sub menu above horizontal menu items":function () {
        // given
        var c = this.getMenuComponent({
            alignSubMenuV:'above'
        });
        // when
        var child = c.child['b'];
        var grandChild = c.child['b'].child['ba'];
        // then

        assertEquals('above', c.layout.alignSubMenuV);
        assertEquals('above', child.layout.alignSubMenuV);
        assertEquals('above', grandChild.layout.alignSubMenuV);

        assertUndefined(grandChild.getMenuContainer().layout.below);
        assertNotUndefined(grandChild.getMenuContainer().layout.above);
    },

    "test context menu should have correct layout settings":function () {
        // given
        var cm = new ludo.menu.Context();

        // then
        assertEquals('menu', cm.layout.type.toLowerCase());
        assertEquals('vertical', cm.layout.orientation.toLowerCase());
    },

    "test context menu items should have correct layout settings":function () {
        // given
        var c = this.getContextMenu();
        c.show({
            page:{ x:100, y:100 }
        });

        // then
        assertEquals(25, c.child['a'].layout.height);
        assertEquals(25, c.child['c'].layout.height);
    },

    "test context menu should expand sub menus on mouse over":function () {
        // given
        var c = this.getContextMenu();

        // when
        c.child['a'].mouseOver();

        // then
        assertEquals('block', c.child['a'].child['aa'].getMenuContainer().getEl().css('display'));

    },

	"test only one menu should be visible at any given time": function(){


	},

    getContextMenu:function () {
        return new ludo.menu.Context({

            children:[
                { name:'a', html:'Item 1', children:[
                    { name:'aa', html:'Item 1.1 '},
                    { name:'ab', html:'Item 1.2 '},
                    { name:'ac', html:'Item 1.2 '}
                ]},
                'b',
                { name:'c', html:'Item 3' }
            ]
        });
    },

    getMenuComponent:function (layout) {

        if (!ludo.CustomItem) {
            ludo.CustomItem = new Class({
                Extends:ludo.menu.Item,
                type:'CustomItem'
            })
        }
        layout = layout || {};
        layout.type = 'menu';
        layout.orientation = layout.orientation || 'horizontal';
        var v = new ludo.View({
            renderTo:document.body,
            layout:layout,
            children:[
                { name:'a', html:'A'},
                { name:'b', id:'b',
                    children:[
                        { id:'ba', name:'ba', children:[
                            { name:'baa', id:'baa', type:'calendar.Calendar'},
                            { name:'bab', id:'bab', html:'bab'},
                            { name:'bac', id:'bac', children:[
                                { name:'baca' }
                            ]}
                        ] },
                        { name:'bb', html:'BB' },
                        { name:'bc', html:'BC' },
                        { name:'bd', html:'BD' },
                        { name:'textBox', type:'form.Text', label:'First name' }
                    ]
                },
                { name:'c', html:'Component c', children:[
                    { name:'ca', html:'Fugitant' },
                    { name:'cb', html:'cb', children:[
                        { name:'cba', html:'John' },
                        { name:'cbb', html:'Splendida porro oculi' }
                    ] },
                    { name:'cc', html:'Doe' }

                ]},
                { name:'d', html:'D'},
                { name:'e', html:'E'},
                { name:'custom', type:'CustomItem' }
            ]

        });
        v.child['b'].child['ba'].show();
        v.child['b'].child['ba'].child['baa'].show();
        v.child['b'].child['ba'].child['bac'].show();
        v.child['b'].child['ba'].child['bac'].child['baca'].show();
        return v;
    },


    getMenuComponentInsideView:function (layout) {

        if (!ludo.CustomItem) {
            ludo.CustomItem = new Class({
                Extends:ludo.menu.Item,
                type:'CustomItem'
            })
        }
        layout = layout || {};
        layout.type = 'menu';
        layout.orientation = layout.orientation || 'horizontal';
        var view = new ludo.View({
            renderTo:document.body,
            children:[
                {
                    layout:layout,
                    name:'mainView',
                    children:[
                        { name:'a', html:'A'},
                        { name:'b', id:'b',
                            children:[
                                { id:'ba', name:'ba', children:[
                                    { name:'baa', id:'baa', type:'calendar.Calendar'},
                                    { name:'bab', id:'bab', html:'bab'},
                                    { name:'bac', id:'bac', children:[
                                        { name:'baca' }
                                    ]}
                                ] },
                                { name:'bb', html:'BB' },
                                { name:'bc', html:'BC' },
                                { name:'bd', html:'BD' },
                                { name:'textBox', type:'form.Text', label:'First name' }
                            ]
                        },
                        { name:'c', html:'Component c', children:[
                            { name:'ca', html:'Fugitant' },
                            { name:'cb', html:'cb', children:[
                                { name:'cba', html:'John' },
                                { name:'cbb', html:'Splendida porro oculi' }
                            ] },
                            { name:'cc', html:'Doe' }

                        ]},
                        { name:'d', html:'D'},
                        { name:'e', html:'E'},
                        { name:'custom', type:'CustomItem' }
                    ]
                }
            ]
        });
        var v = view.child['mainView'];
        v.child['b'].child['ba'].show();
        v.child['b'].child['ba'].child['baa'].show();
        v.child['b'].child['ba'].child['bac'].show();
        v.child['b'].child['ba'].child['bac'].child['baca'].show();
        return v;
    }

});