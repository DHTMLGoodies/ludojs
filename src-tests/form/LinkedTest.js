TestCase("LinkedTest", {

	getWindowWithLinkedFormComponents:function () {
		return new ludo.Window({
			children:[
				{ name:'slider', type:'form.Number', id:'mySlider', direction:'horizontal', label:'form.Slider', value:10 },
				{ name:'number', type:'form.Number', linkWith:'mySlider', label:'form.Number(slider value)'}
			]
		});

	},

	"test_should_set_initial_value_of_linked":function () {
		// given
		var win = this.getWindowWithLinkedFormComponents();

		// then
		assertEquals(10, parseInt(win.child['number'].getValue()));
	},
	"test_should_fire_change_event_in_linked_element_when_value_is_changed":function () {
		// given
		var win = this.getWindowWithLinkedFormComponents();
		var eventFired = false;
		win.child['slider'].addEvent('valueChange', function () {
			eventFired = true;
		});
		// when
		win.child['number'].setValue(5);

		// then
		assertTrue(eventFired);
	},
	"test_should_fire_change_event_in_linked_element_when_value_in_linked_is_changed":function () {
		// given
		var win = this.getWindowWithLinkedFormComponents();
		var eventFired = false;
		win.child['number'].addEvent('valueChange', function () {
			eventFired = true;
		});
		// when
		win.child['slider'].setValue(5);

		// then
		assertTrue(eventFired);
	}

});