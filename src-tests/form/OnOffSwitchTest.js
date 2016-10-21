TestCase("OnOffSwitchTest", {

    "test should be able to check": function(){

        // given
        var onOffSwitch = new ludo.form.OnOffSwitch({
            renderTo:document.body,
            layout:{
                width:300,height:50
            }
        });

        // when
        onOffSwitch.check();

        // then
        assertEquals('1', onOffSwitch.val());
    },
    
    "test should be able to set default to checked": function(){
        // given
        var onOffSwitch = new ludo.form.OnOffSwitch({
            renderTo:document.body,
            layout:{
                width:300,height:50
            },
            checkedVal: 'On',
            checked:true
        });

        // then
        assertEquals('On', onOffSwitch.val());
    },

    "test should fire change event on change": function(){

        var eventFired = false;

        // given
        var onOffSwitch = new ludo.form.OnOffSwitch({
            renderTo:document.body,
            layout:{
                width:300,height:50
            },
            checkedVal: 'On',
            checked:true,
            listeners:{
                'change': function(){
                    eventFired = true;
                }
            }
        });

        // when
        onOffSwitch.uncheck();

        // then
        assertTrue(eventFired);

        // given
        eventFired = false;
        // when
        onOffSwitch.toggle();
        // then
        assertTrue(eventFired);
    }


});