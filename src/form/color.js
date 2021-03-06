ludo.form.Color = new Class({
	Extends:ludo.form.Combo,
	regex:/^#[0-9A-F]{6}$/i,
	childLayout:{
		width:290, height:250
	},

	__children:function () {
		return [
			{
				layout:{
					'type':'tabs'
				},
				cls:'ludo-tabs-in-dropdown',
				bodyCls:'ludo-tabs-in-dropdown-body',
				children:[

					{
						title:ludo.language.get('RGB'),
						type:'color.RgbColors',
						name:'rgbColors',
						value:this.value,
						listeners:{
							'setColor':this.receiveColor.bind(this),
							'render':this.setInitialWidgetValue.bind(this)
						}
					},{
						title:ludo.language.get('Named Colors'),
						type:'color.NamedColors',
						name:'boxes',
						value:this.value,
						listeners:{
							'setColor':this.receiveColor.bind(this),
							'render':this.setInitialWidgetValue.bind(this)
						}
					}
				]
			}
		];
	},

	setInitialWidgetValue:function (widget) {
		widget.setColor(this.value);
	},

	ludoEvents:function () {
		this.parent();
		this.addEvent('change', this.updateWidgets.bind(this));
	},

	updateWidgets:function () {
		var c = this.getColorWidgets();
		for (var i = 0; i < c.length; i++) {
			if (c[i].setColor) {
				c[i].setColor(this.value);
			}
		}
	},

	receiveColor:function (color) {
		this.val(color);
		this.hideMenu();
	},

	getColorWidgets:function () {
		return this.children[0].children;
	}
});