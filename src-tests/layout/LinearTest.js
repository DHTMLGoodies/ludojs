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

	"test should set correct height of children": function(){
		// given
		var parent = this.getVerticalTwoChildrenWithWeight();

		// when
		var child = parent.child['weightOf1'];
		var childTwo = parent.child['weightOf2'];

		// then
		assertEquals(200, child.getEl().offsetHeight);
		assertEquals(400, childTwo.getEl().offsetHeight);

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
	},

	getVerticalTwoChildrenWithWeight:function(){
		return new ludo.View({
			layout:{
				type:'linear',
				orientation:'vertical'
			},
			renderTo:document.body,
			width:1000,
			height:1000,
			children:[
				{
					name:'childOne',
					layout:{
						height:400
					}
				},
				{
					name:'weightOf1',
					layout:{
						weight:1

					}
				},
				{
					name:'weightOf2',
					layout:{
						weight:2
					}
				}
			]
		});


	}



});