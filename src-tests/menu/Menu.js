TestCase("Menu", {

    "test should set renderTo": function(){
        var c = new ludo.menu.Context({
            listeners:{
                click:function (el) {
                    switch (el.action) {

                    }
                }.bind(this),
                selectorclick:function (el) {
                    this.setContextMenuMove(el);
                }.bind(this)
            },
            selector:'notation-chess-move',
            children:[
                { label:'Add comment before', action : 'commentBefore' },
                { label:'Add comment after', action : 'commentAfter'},
                { label:'Grade', children:[
                    { icon:'', label:'Clear', action:'grade' },
                    { icon:'!', label:'Good move', action:'grade' },
                    { icon:'?', label:'Poor move', action:'grade' },
                    { icon:'!!', label:'Very good move', action:'grade' },
                    { icon:'??', label:'Very poor move', action:'grade' },
                    { icon:'?!', label:'Questionable move', action:'grade' },
                    { icon:'!?', label:'Speculative move', action:'grade' }
                ]},
                { label:'Delete remaining moves'}
            ]
        });
        c.show({
            page:{x:100,y:100},target:document.body
        });
        // then
        assertEquals(document.body, c.renderTo);
    }

});