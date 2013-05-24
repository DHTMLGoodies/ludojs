TestCase("SlideIn", {

    "test main view should have the same width and height as viewport": function(){
        // given
        var v = this.getView();

        // when
        var child = v.children[1];

        // then
        assertEquals(1000, child.getEl().offsetWidth);
        assertEquals(500, child.getEl().offsetHeight);
    },

    "test body should have left set to minus width of first child": function(){
        // given
        var v = this.getView();

        // then
        assertEquals('-300px', v.getLayout().slideEl.style.left);
        assertEquals('hidden', v.getBody().style.overflowX);
    },


    "test children should have absolute positioning": function(){
        // given
        var v = this.getView();

        // then
        assertEquals('absolute', v.children[0].getEl().style.position);
        assertEquals('absolute', v.children[1].getEl().style.position);

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