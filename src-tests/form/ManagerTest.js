TestCase("ManagerTest", {

	 getComponent:function () {
		var component = new ludo.View({
			layout:'rows',
			children:[
				{ type:'form.Text', name:'firstname', 'value':'John' },
				{ type:'form.Text', name:'lastname', 'value':'Doe' },
				{ type:'form.Textarea', name:'address', 'value':'Park Avenue' }
			]
		});
		return component;
	},

	getPanelWithButton:function () {
		return new ludo.Window({
			renderTo:document.body,
			width:500, height:500,
			children:[
				{
					type:'form.Text', name:'alfa', minLength:5, value:''
				},
				{
					type:'form.Text', name:'beta', minLength:5, value:''
				}
			],
			buttonBar:[
				{
					type:'form.Button', value:'ok', disableOnInvalid:true
				}
			]
		})
	},

	"test should be able to create form Manager Dynamically":function () {
		// given
		var cmp =  this.getComponent();
		// when
		var manager = cmp.getFormManager();
		// then
		assertNotUndefined(manager);
		assertEquals(3, manager.formComponents.length);
	},

	"test should Get Values Of All Form Elements":function () {
		// given
		var cmp =  this.getComponent();
		var manager = cmp.getFormManager();
		// when
		cmp.child['firstname'].setValue('Jane');
		cmp.child['address'].setValue('Park Avenue 5');

		var values = manager.getValues();

		// then
		assertEquals('Jane', values['firstname']);
		assertEquals('Doe', values['lastname']);
		assertEquals('Park Avenue 5', values['address']);
	},
	"test should be able to reset form elements":function () {
		// given
		var cmp =  this.getComponent();
		var manager = cmp.getFormManager();
		// when
		cmp.child['firstname'].setValue('Jane');
		cmp.child['lastname'].setValue('Johnson');
		cmp.child['address'].setValue('Park Avenue 5');

		manager.reset();
		var values = manager.getValues();
		// then
		assertEquals('John', values['firstname']);
		assertEquals('Doe', values['lastname']);
		assertEquals('Park Avenue', values['address']);
	},
	"test should be able to register lazy form elements":function () {
		// given
		var cmp =  this.getComponent();
		var manager = cmp.getFormManager();

		// when
		var newChild = cmp.addChild({
			type:'form.Text', name:'newField', value:'my value'
		});

		// then
		assertTrue(manager.formComponents.indexOf(newChild) >= 0);
	},
	"test should fire invalid event when form element is invalid":function () {
		// given
		var component = new ludo.View({
			layout:'rows',
			children:[
				{ type:'form.Text', name:'firstname', 'value':'', minLength:5 },
				{ type:'form.Text', name:'lastname', 'value':'Doe' },
				{ type:'form.Textarea', name:'address', 'value':'Park Avenue' }
			]
		});

		var mgr = component.getFormManager();
		var firstname = component.child['firstname'];
		assertFalse(mgr.isValid());

		var eventFired = false;

		// when
		mgr.addEvent('invalid', function () {
			eventFired = true;
		});

		firstname.setValue('a');
		assertFalse('component should be invalid', component.child['firstname'].isValid());
		assertTrue('Form element not registered', mgr.formComponents.indexOf(firstname) >= 0);
		// then
		assertTrue('Event not fired', eventFired);

	},
	"test should initially register form components":function () {
		// given
		var cmp = this.getPanelWithButton();
		cmp.show();

		var mgr = cmp.getFormManager();

		// then
		assertTrue(mgr.component.isRendered);
		assertEquals('Wrong child count', 2, mgr.component.getAllChildren().length);
		assertEquals(2, mgr.formComponents.length);
	}

});