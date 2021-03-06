TestCase("ManagerTest", {

	getComponent:function () {
		return new ludo.View({
			layout:'rows',
			children:[
				{ type:'form.Text', name:'firstname', 'value':'John' },
				{ type:'form.Text', name:'lastname', 'value':'Doe' },
				{ type:'form.Textarea', name:'address', 'value':'Park Avenue' }
			]
		});
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

	"test should be able to have hidden fields": function(){

		// given
		var v = new ludo.View({
			layout:'rows',
			form:{
				hiddenFields: ['id']
			},
			children:[
				{ type:'form.Text', name:'firstname', 'value':'John' },
				{ type:'form.Text', name:'lastname', 'value':'Doe' },
				{ type:'form.Textarea', name:'address', 'value':'Park Avenue' }
			]
		});

		// when
		v.getForm().val('id', 100);

		// then
		assertEquals(100, v.getForm().val('id'));

		v.getForm().populate({
			'id' : 200
		});
		// then
		assertEquals(200, v.getForm().val('id'));


	},

	"test should be able to create form Manager Dynamically":function () {
		// given
		var cmp = this.getComponent();
		// when
		var manager = cmp.getForm();
		// then
		assertNotUndefined(manager);
		assertEquals(3, manager.formComponents.length);
	},

	"test should Get Values Of All Form Elements":function () {
		// given
		var cmp = this.getComponent();
		var manager = cmp.getForm();
		// when
		cmp.child['firstname'].val('Jane');
		cmp.child['address'].val('Park Avenue 5');

		var values = manager.values();

		// then
		assertEquals('Jane', values['firstname']);
		assertEquals('Doe', values['lastname']);
		assertEquals('Park Avenue 5', values['address']);
	},

	"test should be able to reset form elements":function () {
		// given
		var cmp = this.getComponent();
		var manager = cmp.getForm();
		// when
		cmp.child['firstname'].val('Jane');
		cmp.child['lastname'].val('Johnson');
		cmp.child['address'].val('Park Avenue 5');

		manager.reset();
		var values = manager.values();
		// then
		assertEquals('John', values['firstname']);
		assertEquals('Doe', values['lastname']);
		assertEquals('Park Avenue', values['address']);
	},


	"test should be able to register lazy form elements":function () {
		// given
		var cmp = this.getComponent();
		var manager = cmp.getForm();

		// when
		var newChild = cmp.addChild({
			type:'form.Text', name:'newField', value:'my value'
		});

		// then
		assertTrue(manager.formComponents.indexOf(newChild) >= 0);
	},

    "test should be able to store config params": function(){
        // given
        var v = new ludo.View({
            form:{
                resource:'Person',
                url : 'tester.php',
                autoLoad:true,
                arguments:1
            },
            children:[
                {
                    type:'form.Text', name:'firstname', value:'John'
                }
            ]
        });

        // when
        var f = v.getForm();

        // then
        assertEquals('tester.php', f.url);
        assertTrue(f.autoLoad);
    },

	"test should fire invalid event when form element is invalid":function () {
		// given
		var component = new ludo.View({
			renderTo:document.body,
			layout:'rows',
			children:[
				{ type:'form.Text', name:'firstname', 'value':'a', minLength:5 },
				{ type:'form.Text', name:'lastname', 'value':'Doe' },
				{ type:'form.Textarea', name:'address', 'value':'Park Avenue' }
			]
		});

		var mgr = component.getForm();
		var firstname = component.child['firstname'];
		assertFalse(mgr.isValid());

		var eventFired = false;

		// when
		mgr.addEvent('invalid', function () {
			eventFired = true;
		});

		firstname.val('ab');
		assertFalse('component should be invalid', component.child['firstname'].isValid());
		assertTrue('Form element not registered', mgr.formComponents.indexOf(firstname) >= 0);
		// then
		assertTrue('Event not fired', eventFired);

	},
	"test should initially register form components":function () {
		// given
		var cmp = this.getPanelWithButton();
		cmp.show();
		var mgr = cmp.getForm();

		// then
		assertTrue(mgr.view.isRendered);
		mgr.getFormElements();

		assertEquals('Wrong child count', 2, mgr.view.getAllChildren().length);
		assertEquals(2, mgr.formComponents.length);
	},

	"test should be able to configure submit": function(){
		var v = this.getViewWithSubmitConfig();

		assertNotUndefined(v.getForm().configs.submit);
		assertEquals(1, v.getForm().configs.submit.data.submit);
	},
	
	"test should get submit url": function(){
		var v = this.getViewWithSubmitConfig();
		
		// then
		assertEquals('controller.php', v.getForm().getUrl('submit'));
	},

	"test should get submit data": function(){
		var v = this.getViewWithSubmitConfig();

		// when
		var data = v.getForm().dataFor('submit');

		// then
		assertEquals(1, data.submit);
		assertEquals('Alf', data.name);
		assertEquals('Somewhere 1', data.address);
	},

	"test should get read data": function(){
		// given
		var v = this.getViewWithSubmitConfig();
		var form = v.getForm();
		// when
		var data = v.getForm().dataFor('read');

		// then
		assertUndefined(data.name);
		assertEquals(100, data.id);
		assertEquals(1, data.read);
	},


	getViewWithSubmitConfig:function(){
		var v= new ludo.View({
			renderTo:document.body,
			form:{
				hiddenFields:['id'],
				submit:{
					data:{
						submit:1
					},
					url: 'controller.php',
					listeners:{
						'success': function(json, form){

						},
						'fail' : function(text, error, form){

						}
					}
				},
				read: {
					data: {
						read: 1
					},
					keys:['id'],
					url:'controller.php'

				}
			},
			children:[
				{ type:'form.Text', name:'name', value:'Alf' },
				{ type:'form.Text', name:'address', value:'Somewhere 1' }
			]
		});
		v.getForm().set('id', 100);
		return v;

	},


	"test should be able to update value from form manager":function () {
		// given
		var v = this.getView_250_40();

		// when
		v.getForm().set('firstname', 'Alf');

		// then
		assertEquals('Alf', v.child['firstname'].val());
	},

	"test should be able to get value from form manager": function(){
		// given
		var v = this.getView_250_40();

		// then
		assertEquals('Doe', v.getForm().get('lastname'));
	},

	getReadResponseMock:function(){
		if(ludo.ResponseMock == undefined){
			ludo.ResponseMock = new Class({
				Extends: ludo.remote.JSON,
				getResponse:function(){

				},
				getResponseData:function(){
					return {
						'firstname'  : 'Jonathan',
						'lastname' : 'Johnson'
					};
				}
			});
		}

		return new ludo.ResponseMock();
	},

	getView_250_40:function (formConfig) {
		return new ludo.View({
			renderTo:document.body,
            form:formConfig,
			layout:'rows',
			children:[
				{ type:'form.Text', name:'firstname', 'value':'a', minLength:5 },
				{ type:'form.Text', name:'lastname', 'value':'Doe' },
				{ type:'form.Textarea', name:'address', 'value':'Park Avenue' }
			]
		});
	}
});