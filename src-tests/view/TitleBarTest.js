TestCase("TitleBarTest", {

    "test should minimize on click on minimize button" : function(){
        // given
        var v = this.getView_250_40();

        // when
        v.getTitleBar().fireEvent('minimize');
        var titleBarHeight = v.getHeightOfTitleBar();

        // then
        assertEquals(titleBarHeight + 'px', v.getEl().css('height'));

    },

    "test should minimize on click on maximize button" : function(){
        // given
        var v = this.getView_250_40();

        // when
        v.getTitleBar().fireEvent('minimize');
        v.getTitleBar().fireEvent('maximize');
        var titleBarHeight = v.getHeightOfTitleBar();

        // then
        assertEquals('300px', v.getEl().css('height'));

    },

    "test should close on close event": function(){
        // given
        var v = this.getView_250_40();

        // when
        v.getTitleBar().fireEvent('close');

        // then
        assertEquals('none', v.getEl().css('display'));
    },

	"test should have button DOM": function(){
		// given
		var v = this.getView_250_40();
		// when

		// then

		assertEquals('div', v.getEl().find('.ludo-title-bar-button-close').first().prop("tagName").toLowerCase());
		assertEquals('div', v.getEl().find('.ludo-title-bar-button-minimize').first().prop("tagName").toLowerCase());
	},

    getView_250_40:function(){
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