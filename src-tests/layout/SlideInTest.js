TestCase("SlideIn", {

    "test main view should have the same width and height as viewport": function(){
        // given
        var v = this.getView();

        // when
        var child = v.children[1];

        // then
        assertEquals(1000, child.getEl().width());
        assertEquals(500, child.getEl().height());
    },

    "test body should have left set to minus width of first child": function(){
        // given
        var v = this.getView();

        // then
        assertEquals('-300px', v.getLayout().slideEl.css("left"));
        assertEquals('hidden', v.getBody().css("overflowX"));
    },


    "test children should have absolute positioning": function(){
        // given
        var v = this.getView();

        // then
        assertEquals('absolute', v.children[0].getEl().css("position"));
        assertEquals('absolute', v.children[1].getEl().css("position"));

    },

    getView:function(){
        return new ludo.View({
            renderTo:document.body,
            layout:{
                width:1000,
                height:500,
                type : 'SlideIn'
            },
            children:[
                {
                    name : 'menu',
                    layout:{
                        width:300
                    }
                },{
                    name : 'view'
                }
            ]

        });
    }

});