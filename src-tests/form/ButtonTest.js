TestCase("ButtonTest", {


	"test should be able to initially disable a button":function () {
		// given
		var button = this.getButton({
			disabled:true
		});

		// then
		assertTrue(button.isDisabled());
	},
	"test should add mouse over effect":function () {
		// given
		var button = this.getButton({
			disabled:false
		});

		// when
		button.mouseOver();

		// then
		assertTrue(button.getBody().hasClass('ludo-form-button-over'));
	},
	"test should not add mouse over effect when button is disabled":function () {
		// given
		var button = this.getButton({
			disabled:true
		});

		// when
		button.mouseOver();

		// then
		assertFalse(button.getBody().hasClass('ludo-form-button-over'));
	},
	"test should be able to update icon":function () {
		// given
		var button = this.getButton({
		});

		// when
		button.setIcon('image.gif');

		// then
		assertTrue(this.getIconOf(button).indexOf('image.gif')>=0);

	},
	"test should be able to have menu in buttons":function () {
		// given
		var button = this.getButton({
			menu:{
				children:[]
			}
		});

		// then
		assertNotUndefined(button.menu);
	},

	"test should be able to disable button when form is invalid":function () {
		// given
		var cmp = this.getPanelWithButton();
		var button = cmp.getButton('ok');
		var mgr = cmp.getForm();
		var fn = cmp.child['firstname'];

        // when
		fn.setValue('a');
        mgr.getFormElements();

        // then
        assertTrue(button.disableOnInvalid);
        assertEquals(cmp, button.getParentComponent());
		assertEquals(1, cmp.getAllChildren().length);
		assertFalse(fn.isValid());
		assertTrue(button.isDisabled());
	},

	getButton:function (config) {
		config = config || {};
		config.value = config.value || 'OK';
		config.renderTo = document.body;
		return new ludo.form.Button(config);
	},

	getPanelWithButton:function () {
		return new ludo.Window({
			children:[
				{
					type:'form.Text', name:'firstname', minLength:5, value:''
				}
			],
			buttonBar:[
				{
					type:'form.Button', value:'ok', disableOnInvalid:true
				}
			]
		})
	},

	getIconOf:function (button) {
		var style = button.els.icon.css('background-image');
		style = style.replace(/.*?\(([^\)]+?)\).*/g, '$1');
		style = style.replace(/[^a-z0-9\.]/g, '');
		return style;
	}
});