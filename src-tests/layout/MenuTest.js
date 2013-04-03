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

    "test should find menu containers to show for sub item with children": function(){
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

    "test should only set width to wrap of menu.Item": function(){
        // given
        var c = this.getMenuComponent();

        // when
        var textBox = c.child['b'].child['textBox'];

        // then
        assertEquals(25, textBox.layout.height);

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
        assertEquals(cmp.child['b'].getLayoutManager().getMenuContainer().getBody(), grandChild.getEl().parentNode);
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

    "test should find parent menu item":function () {
        // given
        var c = this.getMenuComponent();

        // then

        assertUndefined(c.child['b'].getParentMenuItem());
        assertEquals(c.child['b'], c.child['b'].child['ba'].getParentMenuItem());
        assertEquals(c.child['b'].child['ba'], c.child['b'].child['ba'].child['baa'].getParentMenuItem());
    },

    "test should set layout of menu containers for sub menu of horizontal": function(){
        // given
        var c = this.getMenuComponent();

        // when
        var grandChild = c.child['b'].child['ba'];

        // then
        assertEquals(c.child['b'], grandChild.getMenuContainer().layout.below);
        assertEquals(c.child['b'], grandChild.getMenuContainer().layout.alignLeft);

    },
    "test should set layout of menu containers for sub menu of vertical": function(){
        // given
        var c = this.getMenuComponent();

        // when
        var grandChild = c.child['b'].child['ba'].child['baa'];

        // then
        assertEquals(c.child['b'].child['ba'], grandChild.getMenuContainer().layout.leftOrRightOf);
        assertEquals(c.child['b'].child['ba'], grandChild.getMenuContainer().layout.alignTop);
        assertTrue(grandChild.getMenuContainer().layout.fitVerticalViewPort);

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

    "test should be able to navigate in menu items using arrow keys": function(){

    },

    "test children with different layout type than menu should not have any sub containers to show": function(){
        // given
        var c = this.getMenuComponent();

        // when
        var calendar = c.child['b'].child['ba'].child['baa'];

        // then
        assertUndefined(calendar.getMenuContainerToShow());

    },

    "test items without children should not have any menu container to show": function(){
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

    "test should get reference top top menu component": function(){
        // given
        var c = this.getMenuComponent();

        // then
        assertEquals(c, c.child['b'].getMenuComponent());
        assertEquals(c, c.child['b'].child['ba'].getMenuComponent());
        assertEquals(c, c.child['b'].child['ba'].child['baa'].getMenuComponent());
    },

    "test should expand sub menu of horizontal menu on click": function(){
        // given
        var c = this.getMenuComponent();

        // when
        c.child['b'].click();

        // then
        assertEquals('', c.child['b'].child['ba'].getMenuContainer().getEl().style.display);
    },

    "test expand menus on mouse over after activating on click": function(){
        // given
        var c = this.getMenuComponent();

        // when
        c.child['b'].click();
        c.child['c'].mouseOver();

        // then
        assertEquals('', c.child['c'].child['ca'].getMenuContainer().getEl().style.display);
        assertEquals('none', c.child['b'].child['ba'].getMenuContainer().getEl().style.display);
    },

    "test should show sub menus on mouse over": function(){
        // given
        var c = this.getMenuComponent();

        // when
        c.child['b'].click();
        c.child['b'].child['ba'].mouseOver();


        // then
        assertEquals('', c.child['b'].getMenuContainer().getEl().style.display);
        assertEquals('', c.child['b'].child['ba'].getMenuContainer().getEl().style.display);

    },

    "test should hide other menus on click on new one": function(){
        // given
        var c = this.getMenuComponent();

        // when
        c.child['b'].click();
        c.child['c'].click();
        c.child['c'].click();

        // then
        assertEquals('', c.child['c'].child['ca'].getMenuContainer().getEl().style.display);
        assertEquals('none', c.child['b'].child['ba'].getMenuContainer().getEl().style.display);
    },

    "test should determine if a menu is active": function(){

    },

    "test should show sub menu on mouse over": function(){

    },

    "test click event should be relayed to top menu component": function(){
        // given
        var c = this.getMenuComponent();
        var eventFired = false;
        var firedFromView = undefined;

        //  when
        c.addEvent('click', function(view){
            eventFired = true;
            firedFromView = view;
        });
        var child = c.child['b'].child['ba'];
        child.click();

        // then
        assertTrue(eventFired);
        assertEquals(c.child['b'].child['ba'], firedFromView);
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
                        { name:'bd', html:'BD' },
                        { name:'textBox', type:'form.Text', label:'First name' }
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