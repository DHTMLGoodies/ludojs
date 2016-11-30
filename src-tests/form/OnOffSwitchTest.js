TestCase("OnOffTest", {

    "test should be able to check": function(){

        // given
        var OnOff = new ludo.form.OnOff({
            renderTo:document.body,
            layout:{
                width:300,height:50
            }
        });

        // when
        OnOff.check();

        // then
        assertEquals('1', OnOff.val());
    },
    
    "test should be able to set default to checked": function(){
        // given
        var OnOff = new ludo.form.OnOff({
            renderTo:document.body,
            layout:{
                width:300,height:50
            },
            valOn: 'On',
            checked:true
        });

        // then
        assertEquals('On', OnOff.val());
    },

    "test should fire change event on change": function(){

        var eventFired = false;

        // given
        var OnOff = new ludo.form.OnOff({
            renderTo:document.body,
            layout:{
                width:300,height:50
            },
            valOn: 'On',
            checked:true,
            listeners:{
                'change': function(){
                    eventFired = true;
                }
            }
        });

        // when
        OnOff.uncheck();

        // then
        assertTrue(eventFired);

        // given
        eventFired = false;
        // when
        OnOff.toggle();
        // then
        assertTrue(eventFired);
    }


});