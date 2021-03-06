TestCase("TextTest", {

	setUp:function () {
		if (!ludo.get('d1')) {
			this.getFormComponent('Textarea', { id:'d2' });
			this.getFormComponent('Text', { linkWith:'d2', id:'d1' });
		}
	},
	getFormComponent:function (type, config) {
		config = config || {};
		type = type || 'Text';
		return new ludo.form[type](config);

	},

	getMd5ValidatorMock:function (config) {
		if (ludo.form.validator.Md5Mock === undefined) {
			ludo.form.validator.Md5Mock = new Class({
				Extends:ludo.form.validator.Md5,
				initialize:function (config) {
					if (config.listeners) {
						this.addEvents(config.listeners);
					}
					this.parent(config);
				},
				loadValue:function () {
					this.fireEvent('loadvalue');
				}
			});
		}
		return new ludo.form.validator.Md5Mock(config);
	},

	"test should not validate when too short":function () {
		// given
		var textComponent = this.getFormComponent('Text', { minLength:5});

		// when
		textComponent.val('Hi');

		// then
		assertFalse(textComponent.isValid());
	},
	"test should fire invalid event when invalid":function () {
		// given
		var textComponent = new ludo.form.Text({
			value:'AlfM',
			maxLength:5
		});
		var eventFired = false;
		// when

		textComponent.addEvent('invalid', function () {
			eventFired = true;
		});
		textComponent.val('Alf Magne');
		// then
		assertTrue(eventFired);

	},

    "test should be able to add placeholder": function(){
        // given
        var el = new ludo.form.Text({
            placeholder : 'Zip code',
            inlineLabel : true
        });

        // then
		assertEquals('Zip code', el.getFormEl().attr("placeholder"));
    },

    "test should be able to define inlineLabel in parent view": function(){

    },

	"test should not validate when too long":function () {
		// given
		var textComponent = this.getFormComponent('Text', { maxLength:5});

		// when
		textComponent.val('Hello there');

		// then
		assertFalse(textComponent.isValid());
	},

	"test should not validate when not equal to twin":function () {
		// given
		var t1 = this.getFormComponent('Text', { twin:'t2', id:'t1' });
		var t2 = this.getFormComponent('Textarea', { twin:'t1', id:'t2' });

		// when
		t1.val('John');

		// then
		assertFalse('t1 is invalid', t1.isValid());
		assertFalse('t2 is invalid', t2.isValid());
	},

	"test should be able to link form components":function () {
		// given
		var c1 = this.getFormComponent('Text', { linkWith:'c2', id:'c1' });
		var c2 = this.getFormComponent('Textarea', { id:'c2' });

		// when
		c1.val('John');

		// then

		assertEquals('John', c2.val());

	},

	"test should be able to link form components2":function () {
		// given
		var d1 = ludo.get('d1');
		var d2 = ludo.get('d2');

		// when
		d1.val('Jane');

		// then
		assertEquals('d1 is incorrect', 'Jane', d1.val());
		assertEquals('Jane', d2.val());

	},
	"test should be able to update linked element":function () {
		// given
		var d1 = ludo.get('d1');
		var d2 = ludo.get('d2');

		// when
		d2.val('John');

		// then
		assertEquals('John', d1.val());
	},
	"test should not validate if not matching validator":function () {
		// given
		var component = new ludo.form.Text({
			validator:{
				type:'form.validator.Md5',
				value:faultylabs.MD5('Alf')
			}
		});

		// when
		component.val('Invalid value');

		// then
		assertFalse(component.isValid());
	},
	"test should be able to get value sent to constructor":function () {
		// given
		var field = this.getFormComponent('Text', { value:'John', required:1});

		// then
		assertEquals('John', field.val());
	},
	"test should validate if matching validator":function () {
		// given
		var component = new ludo.form.Text({
			validator:{
				type:'form.validator.Md5',
				value:faultylabs.MD5('Alf')
			}
		});

		// when
		component.val('Alf');

		// then
		assertTrue(component.isValid());

	},
	"test validator should send server request if no value is set":function () {
		// given
		var eventFired = false;

		// when
		this.getMd5ValidatorMock({
			listeners:{
				loadvalue:function () {
					eventFired = true;
				}
			}
		});

		// then
		assertTrue(eventFired);
	},


	"test should get correct md5 value":function () {
		// given
		var expected = faultylabs.MD5('John');
		var el = new ludo.form.Password({
			md5:true,
			value:'John'
		});

		// then
		assertEquals(expected, el.val());

		// when
		el.val('John');
		// then
		assertEquals(expected, el.val());


		// when
		el.getFormEl().value = 'John';
		el.blur();

		assertEquals(expected, el.val());

	},

	"test should fire change event when value is changed manually": function(){
		// given
		var view = new ludo.form.Text({
			value : 'My value',
			renderTo:document.body
		});
		var eventFired = false;

		// when
		view.addEvent('change', function(){
			eventFired = true;
		});
		view.getFormEl().value = 'New value';
		view.change();

		// then
		assertTrue(eventFired);
	},

	"test should not fire change event on setValue method call": function(){
		// given
		var view = new ludo.form.Text({
			value : 'My value',
			renderTo:document.body
		});
		var eventFired = false;

		// when
		view.addEvent('change', function(){
			eventFired = true;
		});
		view.val('New value');

		// then
		assertFalse(eventFired);

	},

	"test should fire valueChange event when value is changed manually": function(){
		// given
		var view = new ludo.form.Text({
			value : 'My value',
			renderTo:document.body
		});
		var eventFired = false;
		var changeEventFired = false;
		// when
		view.addEvent('valueChange', function(){
			eventFired = true;
		});
		view.addEvent('valueChange', function(){
			changeEventFired = true;
		});
		view.getFormEl().val('New value');
		view.change();

		// then
		assertTrue(eventFired);
		assertTrue(changeEventFired);
	},
	
	"test should not apply invalid css class to valid fields": function(){
		var el = new ludo.form.Number({
			value : 255,
			minValue:0,
			maxValue:255,
			name:'r'
		});
		// when
		el.blur();

		// then
		assertTrue('Is not valid', el.isValid());
		assertFalse(el.getEl().hasClass('ludo-form-el-invalid'));

	},

    "test should be able to reset form field": function(){
        // given
        var el = new ludo.form.Text({
           renderTo:document.body
        });
        el.val('My value');
        // when
        el.reset();

        // then
        assertEquals('', el.val());
        assertEquals('', el.getFormEl().val());
    }
});