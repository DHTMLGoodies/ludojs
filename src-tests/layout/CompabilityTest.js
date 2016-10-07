TestCase("CompabilityTest", {

	"test should be able to have cols layout":function () {
		// when
		var view = this.getView('cols');

		// then
		assertEquals(300, view.child['childOne'].getEl().width());
		assertEquals(200, view.child['childTwo'].getEl().width());
		assertEquals(300, view.child['childTwo'].getEl().offset().left);
		assertEquals(200, view.child['childThree'].getEl().width());
		assertEquals(400, view.child['childFour'].getEl().width());

	},

	"test should preserve weight when defined in config": function(){
		// when
		var view = this.getView('cols');

		// then
		assertEquals(2, view.child['childFour'].layout.weight);

	},

	"test should be able to have rows layout":function () {
		// when
		var view = this.getView('rows');

		// then
		assertEquals(300, view.child['childOne'].getEl().height());
		assertEquals(200, view.child['childTwo'].getEl().height());
		assertEquals(200, view.child['childThree'].getEl().height());
		assertEquals(400, view.child['childFour'].getEl().height());

	},

	"test should preserve layouts set in class definition": function(){
		ludo.MyClass = new Class({
			Extends: ludo.View,
			layout:{
				type:'linear',
				orientation:'horizontal'
			}
		});

		new ludo.View({
			layout:{
			   type:'tab',
			   tabs:'top'
		   },
			renderTo:document.body,
			children:[{
				type:'MyClass',id:'myView', layout:{
					visible:true
				}
			}]
		});

		// then
		assertEquals('linear', ludo.get('myView').layout.type);

	},

	getView:function (layout) {
		return new ludo.View({
			layout:layout,
			width:1100,
			height:1100,
			renderTo:document.body,
			children:[
				{
					name:'childOne', width:300, height:300
				},
				{
					name:'childTwo', width:200, height:200
				},
				{
					name:'childThree', weight:1
				},
				{
					name:'childFour', weight:2
				}
			]
		});
	}

});