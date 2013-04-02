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

    "test should get menu containers to show for a menu item": function(){
        // given
        var cmp = this.getMenuComponent();

        // when
        var child = cmp.child['b'];
        var grandChild = cmp.child['b'].child['ba'];
        var grandGrandChild = cmp.child['b'].child['ba'].child['baa'];

        // then
        assertEquals(1, child.getMenuContainersToShow().length);
        assertEquals(grandChild.getMenuContainer(), child.getMenuContainersToShow()[0]);

        assertEquals(2, grandChild.getMenuContainersToShow().length);
        assertEquals(grandGrandChild.getMenuContainer(), grandChild.getMenuContainersToShow()[1]);
        assertEquals(grandChild.getMenuContainer(), grandChild.getMenuContainersToShow()[0]);

        assertEquals(2, grandGrandChild.getMenuContainersToShow().length);
        assertEquals(grandGrandChild.getMenuContainer(), grandChild.getMenuContainersToShow()[1]);
        assertEquals(grandChild.getMenuContainer(), grandChild.getMenuContainersToShow()[0]);
    },

    "test default type of children should be menu.Item":function () {
        // given
        var cmp = this.getMenuComponent();

        // when
        var child = cmp.child['b'];

        // then
        assertEquals('menu.Item', child.type);
    },

    "test should render children inside menu container":function () {
        // given
        var cmp = this.getMenuComponent();

        // when
        var child = cmp.child['b'];
        var grandChild = cmp.child['b'].child['ba'];

        // then
        assertEquals(cmp.child['b'].getLayoutManager().getMenuContainer().getEl(), grandChild.getEl().parentNode);
        assertEquals(cmp.getBody(), child.getEl().parentNode);
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

    },

    "test should show sub menu container on mouse over":function () {

    },

    "test should find menu container to show for an item":function () {
        // given
        var c = this.getMenuComponent();

        // when
        var child = c.child['b'];

        // then
        assertEquals(child.getMenuContainerToShow().getEl(), child.child['ba'].getMenuContainer().getEl());
    },

    "test should find menu container OF an item":function () {
        // given
        var c = this.getMenuComponent();

        // when
        var child = c.child['b'];
    },

    "test should find parent menu item":function () {
        // given
        var c = this.getMenuComponent();

        // then

        assertUndefined(c.child['b'].getParentMenuItem());
        assertEquals(c.child['b'], c.child['b'].child['ba'].getParentMenuItem());
        assertEquals(c.child['b'].child['ba'], c.child['b'].child['ba'].child['baa'].getParentMenuItem());
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

    "test children with specific layout should not be changed": function(){
        // given
        var c = this.getMenuComponent();

        // when
        var calendar = c.child['b'].child['ba'].child['baa'];

        // then
        assertEquals('linear', calendar.layout.type);

    },

    "test children with different layout type than menu should not have any sub containers to show": function(){
        // given
        var c = this.getMenuComponent();

        // when
        var calendar = c.child['b'].child['ba'].child['baa'];

        // then
        assertUndefined(calendar.getMenuContainerToShow());

    },

    "test should find reference to top layout manager":function () {
        // given
        var c = this.getMenuComponent();
        var lm = c.getLayoutManager();
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

    getMenuComponent:function () {
        var v = new ludo.View({
            renderTo:document.body,
            layout:{
                type:'menu',
                orientation:'horizontal'
            },
            children:[
                { name:'a', html:'A'},
                { name:'b', id:'b',
                    children:[
                        { id:'ba', name:'ba', children:[
                            { name:'baa', id:'baa', type:'calendar.Calendar'},
                            { name:'bab', id:'bab', html:'bab'},
                            { name:'bac', id:'bac', children:[
                                { name : 'baca' }
                            ]}
                        ] },
                        { name:'bb', html:'BB' },
                        { name:'bc', html:'BC' },
                        { name:'bd', html:'BD' }
                    ]
                },
                { name:'c', html:'C', children:[
                    { name:'ca', html:'ca' },
                    { name:'cb', html:'cb', children:[
                        { name:'cba', html:'cba' },
                        { name:'cbb', html:'cbb' }
                    ] }

                ]},
                { name:'d', html:'D'},
                { name:'e', html:'E'}
            ]

        });
        v.child['b'].child['ba'].show();
        v.child['b'].child['ba'].child['baa'].show();
        v.child['b'].child['ba'].child['bac'].show();
        v.child['b'].child['ba'].child['bac'].child['baca'].show();
        return v;
    }

})
;