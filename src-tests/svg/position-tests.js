TestCase("PositionTests", {


    setUp:function(){
        if(this.view == undefined){
            this.view = new ludo.View({
                renderTo:document.body,
                layout:{
                    type:'Canvas',
                    width:2000,height:1000
                },
                children:[
                    {
                        id:'group1',
                        type:'svg.Group',
                        layout:{
                            width:200,
                            height:'matchParent'
                        }
                    },
                    {
                        id:'group2',
                        type:'svg.Group',
                        layout:{
                            rightOf:'group1',
                            height:'matchParent'
                        },
                        children:[
                            {
                                id:'group2_1',
                                type:'svg.Group',
                                layout:{
                                    width:200,
                                    height:'matchParent'
                                }
                            },
                            {
                                id:'group2_2',
                                type:'svg.Group',
                                layout:{
                                    rightOf:'group2_1',
                                    height:'300'
                                }
                            },
                            {
                                id:'group2_3',
                                type:'svg.Group',
                                layout:{
                                    rightOf:'group2_1',
                                    below:'group2_2',
                                    fillDown:true
                                }
                            }

                        ]
                    }

                ]
            });
        }
    },
    view:undefined,

    "test should resize group": function(){
        // when
        var svg = ludo.$('group1');

        // then
        assertNotUndefined(svg);
        assertEquals(200, svg.width);
        assertEquals(1000, svg.height);

    },

    "test should position group": function(){
        // when
        var svg = ludo.$('group2');

        // then
        assertNotUndefined(svg);
        assertEquals(200, svg.position().left);
        assertEquals(0, svg.position().top);

    },

    "test should be able to render children of group": function(){
        // when
        var group = ludo.$('group2_1');

        // then
        assertNotUndefined(group);

    }
});