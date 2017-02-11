TestCase("StoreTest", {

	setUp:function () {

		ludo.getLocalStorage().empty();
		
		if (ludo.StateFulCmp === undefined) {
			ludo.StateFulCmp = new Class({
				Extends:ludo.Core,
				stateful:true,
				statefulProperties:['firstname', 'lastname'],

				initialize:function (config) {
					this.parent(config);
					if (config.firstname !== undefined)this.firstname = config.firstname;
					if (config.lastname !== undefined)this.lastname = config.lastname;
				}
			});
		}
	},
	"test_should_be_able_to_store_objects_in_store":function () {
		// given
		var store = ludo.getLocalStorage();
		var object = {
			firstname:'John',
			lastName:'Doe'
		};
		assertTrue(store.supported);

		// when
		store.save('name', object);

		var newObject = store.get('name');

		// then
		assertEquals('John', newObject.firstname);
		assertEquals('Doe', newObject.lastName);
	},
	"test_should_be_able_to_save_states_for_a_component":function () {
		// given
		var id = 'MyComponent';
		var cmp = new ludo.StateFulCmp({
			id:'MyComponent',
			firstname:'John',
			lastname:'Doe'
		});

		// when
		cmp.fireEvent('state');

		// then
		assertNotUndefined(localStorage['state_' + id]);


	},


	"test should return default value": function(){
		// when
		var val = ludo.getLocalStorage().get('name', 'alf');

		// then
		assertEquals('alf', val);
	},


	"test_should_be_able_to_have_stateful_components":function () {
		// given
		var id = 'cmp-' + String.uniqueID();
		var cmp = new ludo.StateFulCmp({
			id:id,
			firstname:'John',
			lastname:'Doe'
		});

		assertNotUndefined(cmp.firstname);
		assertNotUndefined(cmp.lastname);
		// when
		cmp.fireEvent('state');

		var cmp2 = new ludo.StateFulCmp({id:id});

		// then
		assertEquals('John', cmp2.firstname);
		assertEquals('Doe', cmp2.lastname);

	}
});