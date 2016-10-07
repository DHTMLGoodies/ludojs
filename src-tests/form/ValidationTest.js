TestCase("ValidationTest", {

	setUp:function () {
		if (ludo.Validator === undefined) {
			ludo.Validator = new Class({
				Extends:ludo.form.validator.Base,
				type:'Validator',
				value:'Valid value'
			});
		}
	},

	getFormComponent:function (type, config) {
		config = config || {};
		type = type || 'Text';
		return new ludo.form[type](config);
	},

	"test should not validate when too short":function () {
		// given
		var cmp = this.getFormComponent('Text', { minLength:5});

		// when
		cmp.setValue('');

		// then
        assertEquals(1, cmp.validators.length);
		assertTrue(cmp.isValid());
	},

	"test should not validate when too long":function () {
		// given
		var cmp = this.getFormComponent('Text', { maxLength:5});

		// when
		cmp.setValue('San Fransisco');

		// then
        assertEquals('maxLength', cmp.validators[0].key);
        assertEquals(1, cmp.validators.length);
		assertFalse(cmp.isValid());
	},

	"test should not validate when not matching validator":function () {
		// given
		var cmp = this.getFormComponent('Text', { validator:{
			type:'Validator'
		}});

		// when
		cmp.setValue('Invalid value');
        
		// then
        assertEquals(1, cmp.validators.length);
		assertFalse(cmp.isValid());
	},

	"test should validate when matching validator":function () {
		// given
		var cmp = this.getFormComponent('Text', { validator:{
			type:'Validator'
		}});

		// when
		cmp.setValue('Valid value');

		// then
		assertTrue(cmp.isValid());
	},

	"test should not validate number when to big":function () {
		// given
		var cmp = this.getFormComponent('Number', { minValue:100, maxValue:255 });

		// when
		cmp.setValue(333);

		// then
		assertFalse(cmp.isValid());

	},

	"test should not validate number when to small":function () {
		// given
		var cmp = this.getFormComponent('Number', { minValue:100, maxValue:255 });

		// when
		cmp.setValue(50);

		// then
        assertEquals('50', cmp.getFormEl().val().trim());
       //assertEquals(4, cmp.validators.length);

        assertEquals('regex', cmp.validators[0].key);
        assertEquals('minValue', cmp.validators[1].key);
        assertEquals('maxValue', cmp.validators[2].key);
		assertFalse(cmp.isValid());

	},

	"test should validate number when between min and max":function () {
		// given
		var cmp = this.getFormComponent('Number', { minValue:100, maxValue:255 });

		// when
		cmp.setValue(150);

		// then
        assertEquals(3, cmp.validators.length);
		assertTrue(cmp.isValid());
	},

	"test should not validate number when not matching regex":function () {
		// given
		var cmp = this.getFormComponent('Text', { regex:'[a-z]', regexFlags:'g' });

		// when
		cmp.setValue('INVALID');

		// then
		assertFalse(cmp.isValid());

		// when
		cmp.setValue('123');

		// then
		assertFalse(cmp.isValid());

	},

    "test should validate email": function(){
        // given
        var cmp = this.getFormComponent('Email', { });

        // when
        cmp.setValue('alf.magne.kalleland@gmail.com');

        // then
        assertTrue(cmp.isValid());

        // when
        cmp.setValue('invalid@v');

        // then
        assertFalse(cmp.isValid());
    },

	"test should validate number when matching regex":function () {
		// given
		var cmp = this.getFormComponent('Text', { regex:/[a-z0-9\s]/ });

		// when
		cmp.setValue('valid expression');

		// then
		assertTrue(cmp.isValid());

		// when
		cmp.setValue('123');

		// then
		assertTrue(cmp.isValid());
	},

	"test should be able to use custom function as validator": function(){
		// given
		var valueSentToValidator = undefined;
		var el = new ludo.form.Text({
			value:'invalid',
			validator:function(value){
				valueSentToValidator = value;
				return value === 'Valid';
			}
		});

		// when
		// then
		assertEquals('invalid', valueSentToValidator);
		assertFalse(el.isValid());
	},

	"test should not fire valueChange or change event when invalid value is set": function(){
		// given
		var el = new ludo.form.Text({
			value:'Valid',
			validator:function(value){
				return value === 'Valid';
			}
		});
		var changeFired = false;
		var valueChangeFired = false;

		el.addEvent('valueChange', function(){
			valueChangeFired = true;
		});
		el.addEvent('change', function(){
			changeFired = true;
		});

		// when
		el.getFormEl().val('Invalid');
		el.change();

		// then
		assertFalse('valueChange was fired', valueChangeFired);
		assertFalse('change was fired', changeFired);

	},

    "test should be able to set min value": function(){
        // given
        var cmp = this.getFormComponent('Number', { value:100, minValue:50, maxValue:255});

        // when
        cmp.setValue('20');

        // then
        assertFalse(cmp.isValid());
    },

    "test should be able to set max value": function(){
        // given
        var cmp = this.getFormComponent('Number', { value:100, minValue:50, maxValue:255});

        // when
        cmp.setValue('300');

        // then
        assertFalse(cmp.isValid());
    },

    "test should be able to set required": function(){
        // given
        var cmp = this.getFormComponent('Number', { required:true,value:''});
        // then
        assertFalse(cmp.isValid());
        // when
        cmp.setValue('20');


        // then
        assertEquals(2, cmp.validators.length);
        assertEquals('required', cmp.validators[0].key);
        assertEquals('regex', cmp.validators[1].key);
        assertTrue(cmp.isValid());
    }
});