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

	"test should have button DOM": function(){
		// given
		var v = this.getView();
		// when
		var els = v.getEl().getElements('.ludo-title-bar-button');

		// then

		assertEquals('div', v.getEl().getElement('.ludo-title-bar-button-close').tagName.toLowerCase());
		assertEquals('div', v.getEl().getElement('.ludo-title-bar-button-minimize').tagName.toLowerCase());
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