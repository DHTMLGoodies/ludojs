TestCase("LinearTest", {


	"test should be able to have linear layout":function () {
		// given
		var view = this.getLayoutWithChildren({
			'type':'linear',
			'orientation':'horizontal'
		});

		// then
		assertEquals(300, view.child['childOne'].getEl().offsetWidth);



	},

	getLayoutWithChildren:function (layout) {
		return new ludo.View({
			layout:layout,
			renderTo:document.body,
			width:1000,
			height:1000,
			children:[
				{
					name:'childOne',
					width:300,
					height:300
				},
				{
					name:'childTwo',
					width:250,
					height:250
				},
				{
					name:'childThree',
					weight:1
				}
			]
		});

	}

});