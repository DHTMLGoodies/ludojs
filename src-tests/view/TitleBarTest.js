TestCase("TitleBarTest", {

    "test should minimize on click on minimize button" : function(){
        // given
        var v = this.getView();

        // when
        v.getTitleBar().fireEvent('minimize');
        var titleBarHeight = v.getHeightOfTitleBar();

        // then
        assertEquals(titleBarHeight + 'px', v.getEl().style.height);

    },

    "test should minimize on click on maximize button" : function(){
        // given
        var v = this.getView();

        // when
        v.getTitleBar().fireEvent('minimize');
        v.getTitleBar().fireEvent('maximize');
        var titleBarHeight = v.getHeightOfTitleBar();

        // then
        assertEquals('300px', v.getEl().style.height);

    },

    "test should close on close event": function(){
        // given
        var v = this.getView();

        // when
        v.getTitleBar().fireEvent('close');

        // then
        assertEquals('none', v.getEl().style.display);
    },

    getView:function(){
        return new ludo.FramedView({
            minimizable:true,
            closable:true,
            renderTo:document.body,
            layout:{
                width:300,height:300
            }
        });
    }


});