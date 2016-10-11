TestCase("ColorTestForm", {

	"test should update value on widgets": function(){
		// given
		var el = this.getColorWidget();

		// when
		el.val('#ffaa22');
		el.getDependency('menuButton').showMenu();
		this.showRGBSlider(el);

		// then
		assertEquals('#ffaa22', this.getRGBSlider(el).value);
	},

	"test should update sliders on value change": function(){
		// given
		var el = this.getColorWidget();

		// when
		el.val('#ffaa22');
		el.getDependency('menuButton').showMenu();
		this.showRGBSlider(el);

		// then
		assertEquals(255, this.getSlider(el, 'red').val());
		assertEquals(170, this.getSlider(el, 'green').val());
		assertEquals(34, this.getSlider(el, 'blue').val());
	},

	"test should fire event on change": function(){
		// given
		var el = this.getColorWidget();

		var triggered = false;

		el.addEvent('change', function(){
			triggered = true
		});

		el.val('#ffaa22');
		el.change();

		assertTrue(triggered);


	},

	"test should update widgets when value is changed after widgets has been opened": function(){
		// given
		var el = this.getColorWidget();

		// when
		el.getDependency('menuButton').showMenu();

		el.children[0].child['slider'].show();
		el.val('#ffaa22');

		assertEquals('#ffaa22', el.value);
		el.change();
		assertEquals('#ffaa22', el.value);

		// then
		assertEquals('#ffaa22', el.children[0].child['slider'].value);
		assertEquals(255, this.getSlider(el, 'red').val());
		assertEquals(170, this.getSlider(el, 'green').val());
		assertEquals(34, this.getSlider(el, 'blue').val());
	},



	getColorWidget:function(value){
		var v = new ludo.View({
			renderTo:document.body,
			children:[
				{ type:'form.Color', value : value}
			]
		});
		return v.children[0];
	},

	getSlider:function(el, color){
		return el.children[0].child['slider'].child[color];
	},

	getRGBSlider:function(el){
		return el.children[0].child['slider'];
	},

	showRGBSlider:function(el){
		el.children[0].child['slider'].show();
	}
});