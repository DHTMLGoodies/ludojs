TestCase("MenuTest", {

    "test menu layout should be inherited to children":function () {
        // given
        var cmp = this.getMenuComponent();

        // when
        var child = cmp.child['b'];

        // then
        assertEquals('Menu', child.layout.type);
        assertEquals('horizontal', child.layout.orientation);
    },

    "test default type of children should be menu.Item": function(){

    },

    getMenuComponent:function () {
        return new ludo.View({
            renderTo:document.body,
            layout:{
                type:'Menu',
                orientation:'horizontal'
            },
            children:[
                { name:'a', html:'A'},
                { name:'b', html:'B',
                    children:[
                        { name:'ba', html:'BA' },
                        { name:'bb', html:'BB' },
                        { name:'bc', html:'BC' },
                        { name:'bd', html:'BD' }
                    ]
                },
                { name:'c', html:'C'},
                { name:'d', html:'D'},
                { name:'e', html:'E'}
            ]

        });
    }

})
;