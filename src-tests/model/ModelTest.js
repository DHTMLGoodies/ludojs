TestCase("ModelTest", {

	setUp:function () {

		ludo.DefaultModel = new Class({
			Extends:ludo.model.Model,
			type:'DefaultModel',
			columns:['firstname', 'lastname', 'address'],
			autoload:false,
			singleton:true,

			initialize:function (config) {
				this.parent(config);
				if (window.countModels === undefined)window.countModels = 0;
				window.countModels++;
			}
		});


		ludo.SINGLETONS = {};
	},

	getModel:function () {
		return new ludo.model.Model({
			columns:['id', { name:'firstname' }, 'lastname', 'address']
		});
	},

	getComponentWithModel:function () {
		if (!window.cmpWithModel) {
			window.CmpWithModel = new Class({
				Extends:ludo.View,
				model:{
					type:'DefaultModel'
				},
				layout:'rows',
				children:[
					{
						type:'form.Text', name:'firstname'
					},
					{
						type:'form.Text', name:'lastname'
					},
					{
						type:'form.Text', name:'address'
					}
				]
			});
		}
		return new window.CmpWithModel({});
	},

	getComponentWithTplChildren:function () {
		if (!window.cmpWithTplModel) {
			window.CmpWithTplModel = new Class({
				Extends:ludo.View,
				model:{
					type:'DefaultModel'
				},
				children:[
					{
						tpl:'{firstname}'
					}
				]

			});
		}
		return new window.CmpWithTplModel({});

	},

	getComponentWithTpl:function () {
		if (!window.cmpTpl) {
			window.CmpTpl = new Class({
				Extends:ludo.View,
				model:{
					type:'DefaultModel'
				},
				tpl:'{firstname}'

			});
		}
		return new window.CmpTpl({});

	},

	getModelWithDefaultValues:function () {
		return new ludo.model.Model({
			columns:['id', { name:'firstname' }, 'lastname', 'address', { name:'age', defaultValue:20}]
		});
	},

	"tests_shouldCreateDynamicSetters":function () {
		// given
		var model = this.getModel();

		// then
		assertTrue(model.hasOwnProperty('setFirstname'));
		assertTrue(model.hasOwnProperty('setLastname'));

		model.setFirstname('alf');
		model.setAddress('alf');
		model.setLastname('alf');
	},
	"tests_shouldCreateDynamicGetters":function () {
		// given
		var model = this.getModel();

		// then
		assertTrue(model.hasOwnProperty('getFirstname'));
		assertTrue(model.hasOwnProperty('getLastname'));
		assertTrue(model.hasOwnProperty('getAddress'));

	},
	"test_shouldReturnRecordValues":function () {
		// given
		var model = this.getModel();
		// when
		model.currentRecord = {
			id:100,
			firstname:'Alf Magne',
			lastname:'Kalleland',
			address:'Rundaberget 27'
		};
		// then
		assertEquals(100, model.getId());
		assertEquals('Alf Magne', model.getFirstname());
		assertEquals('Kalleland', model.getLastname());
		assertEquals('Rundaberget 27', model.getAddress());
	},
	"test_sholdFindDefaultValues":function () {
		// given
		var model = this.getModelWithDefaultValues();
		// when
		var defaultValue = model._getDefaultValue('age');
		// then
		assertEquals(20, defaultValue);
	},
	"test_should_update_form_values_in_form":function () {
		// given
		var c = this.getComponentWithModel();

		var model = c.getFormManager().getModel();

		// when
		model.populate(100, {
			firstname:'Alf Magne',
			lastname:'Kalleland',
			address:'Rundaberget 27'
		});

		// then
		assertEquals('Alf Magne', c.child['firstname'].getValue());
		assertEquals('Kalleland', c.child['lastname'].getValue());
		assertEquals('Rundaberget 27', c.child['address'].getValue());
	},
	"test_should_update_components_with_tpl_equals_model_column":function () {
		// given
		var c = this.getComponentWithTplChildren();
		var model = c.getFormManager().getModel();

		// when
		model.populate(100, {
			firstname:'Alf Magne',
			lastname:'Kalleland',
			address:'Rundaberget 27'
		});

		// then
		assertTrue(c.getBody().get('html').indexOf('Alf Magne') >= 0);
	},
	"test_should_register_children_of_components_using_same_model":function () {
		// given
		var c = this.getComponentWithModel();
		this.getComponentWithTplChildren();
		var model = c.getFormManager().getModel();

		// then
		assertNotUndefined(model.formComponents['firstname']);
		assertEquals(1, model.views.length);

	},
	"test_should_update_multiple_components_using_same_model":function () {
		// given
		var c = this.getComponentWithModel();
		var c2 = this.getComponentWithTplChildren();
		var model = c.getFormManager().getModel();

		// when
		model.populate(100, {
			firstname:'John',
			lastname:'Kalleland',
			address:'Rundaberget 27'
		});

		// then
		assertEquals('John', c.child['firstname'].getValue());
		assertEquals('Kalleland', c.child['lastname'].getValue());
		assertEquals('Rundaberget 27', c.child['address'].getValue());
		assertTrue('content was ' + c2.getBody().get('html'), c2.getBody().get('html').indexOf('John') >= 0);
	},
	"test_should_update_component_with_tpl_and_model":function () {
		var c = this.getComponentWithTpl();

		var model = c.getFormManager().getModel();
		// when
		model.populate(100, {
			firstname:'Jane'
		});

		assertTrue('content was ' + c.getBody().get('html'), c.getBody().get('html').indexOf('Jane') >= 0);
	}


});