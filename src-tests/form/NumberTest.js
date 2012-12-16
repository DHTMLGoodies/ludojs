TestCase("NumberTest", {

	getFormComponent:function (type, config) {
		config = config || {};
		type = type || 'Number';
		return new ludo.form[type](config);
	},

	"test should be able to increment":function () {
		// given
		var cmp = this.getFormComponent('Number', { value:100, minValue:0, maxValue:255});
		assertEquals(100, cmp.getValue() / 1);
		assertEquals(100, cmp.value / 1);
		// when
		cmp.incrementBy(1);

		// then
		assertEquals(101, cmp.getValue() / 1);

	}

});