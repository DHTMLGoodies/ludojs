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
				if (window['countModels'] === undefined)window.countModels = 0;
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
		if (!window['cmpWithModel']) {
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
		if (!window['cmpWithTplModel']) {
			window.CmpWithTplModel = new Class({
				Extends:ludo.View,
                renderTo:document.body,
				model:{
					type:'DefaultModel'
				},
				children:[
					{
                        name:'firstname',
						tpl:'{firstname}'
					}
				]

			});
		}
		return new window.CmpWithTplModel({});

	},

	getComponentWithTpl:function () {
		if (!window['cmpTpl']) {
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

	"tests shouldCreateDynamicSetters":function () {
		// given
		var model = this.getModel();

		// then
		assertTrue(model.hasOwnProperty('setFirstname'));
		assertTrue(model.hasOwnProperty('setLastname'));

		model.setFirstname('alf');
		model.setAddress('alf');
		model.setLastname('alf');
	},
	"tests shouldCreateDynamicGetters":function () {
		// given
		var model = this.getModel();

		// then
		assertTrue(model.hasOwnProperty('getFirstname'));
		assertTrue(model.hasOwnProperty('getLastname'));
		assertTrue(model.hasOwnProperty('getAddress'));

	},
	"test shouldReturnRecordValues":function () {
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

    "test should get value from form when form is updated":function(){
        // given
        var c = this.getComponentWithModel();

        var model = c.getFormManager().getModel();

        // when
        model.populate(100, {
            firstname:'Alf Magne',
            lastname:'Kalleland',
            address:'Rundaberget 27'
        });
        c.child['firstname'].setValue('John');

        // then
        assertEquals('John', model.getFirstname());

    },

	"test should find default values":function () {
		// given
		var model = this.getModelWithDefaultValues();
		// when
		var defaultValue = model._getDefaultValue('age');
		// then
		assertEquals(20, defaultValue);
	},
	"test should update form values in form":function () {
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
	"test should update components with tpl equals model column":function () {
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
        assertTrue(c.getModel().views.indexOf(c.child['firstname']) >= 0);
		assertEquals('Alf Magne', c.child['firstname'].getBody().innerHTML);
	},
	"test should register children of components using same model":function () {
		// given
		var c = this.getComponentWithModel();
		this.getComponentWithTplChildren();
		var model = c.getFormManager().getModel();

		// then
		assertNotUndefined(model.formComponents['firstname']);
		assertEquals(1, model.views.length);

	},
	"test should update multiple components using same model":function () {
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

	"test should update component with tpl and model":function () {
        // given
		var c = this.getComponentWithTpl();
		var model = c.getFormManager().getModel();
		// when
		model.populate(100, {
			firstname:'Jane'
		});
        // then
		assertTrue('content was ' + c.getBody().get('html'), c.getBody().get('html').indexOf('Jane') >= 0);
	},

    "test should set record id after successful save": function(){
        // given
        var model = new ludo.model.Model({
            idField : "id",
            "columns": ["id", "firstname","lastname"]
        });
        // when
        var updates = {
            "id":200,
            "firstname": "Alf Magne"
        };
        model.handleModelUpdates(updates);

        // then
        assertEquals("Alf Magne", model.getFirstname());
        assertEquals(200, model.recordId);
        assertEquals(200, model.getId());

    }


});