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
		assertFalse(cmp.isValid());
	},

	"test should not validate when too long":function () {
		// given
		var cmp = this.getFormComponent('Text', { maxLength:5});

		// when
		cmp.setValue('San Fransisco');

		// then
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
		assertFalse(cmp.isValid());
	},

	"test should alidate when matching validator":function () {
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
		assertFalse(cmp.isValid());

	},

	"test should validate number when between min and max":function () {
		// given
		var cmp = this.getFormComponent('Number', { minValue:100, maxValue:255 });

		// when
		cmp.setValue(150);

		// then
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

	"test should validate number when matching regex":function () {
		// given
		var cmp = this.getFormComponent('Text', { regex:'[a-z0-9 ]', regexFlags:'g' });

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
		var valueSentToValidator;
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
		assertNotUndefined(el.validatorFn);
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
		el.getFormEl().value = 'Invalid';
		el.change();

		// then
		assertFalse('valueChange was fired', valueChangeFired);
		assertFalse('change was fired', changeFired);

	}
});