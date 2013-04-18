TestCase("ColorTest", {

	"test should update value on widgets": function(){
		// given
		var el = this.getColorWidget();

		// when
		el.setValue('#ffaa22');
		el.getDependency('menuButton').showMenu();
		this.showRGBSlider(el);

		// then
		assertEquals('#ffaa22', this.getRGBSlider(el).value);
	},

	"test should update sliders on value change": function(){
		// given
		var el = this.getColorWidget();

		// when
		el.setValue('#ffaa22');
		el.getDependency('menuButton').showMenu();
		this.showRGBSlider(el);


		// then
		assertEquals(255, this.getSlider(el, 'red').getValue());
		assertEquals(170, this.getSlider(el, 'green').getValue());
		assertEquals(34, this.getSlider(el, 'blue').getValue());
	},

	"test should update widgets when value is changed after widgets has been opened": function(){
		// given
		var el = this.getColorWidget();

		// when
		el.getDependency('menuButton').showMenu();
		this.showRGBSlider(el);
		el.setValue('#ffaa22');
		el.change();

		// then
		assertEquals('#ffaa22', this.getRGBSlider(el).value);
		assertEquals(255, this.getSlider(el, 'red').getValue());
		assertEquals(170, this.getSlider(el, 'green').getValue());
		assertEquals(34, this.getSlider(el, 'blue').getValue());
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
		return el.children[0].children[2].child[color];
	},

	getRGBSlider:function(el){
		return el.children[0].children[2];
	},

	showRGBSlider:function(el){

		el.children[0].children[2].show();
	}

});