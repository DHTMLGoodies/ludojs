TestCase("CompabilityTest", {

	"test should be able to have cols layout":function () {
		// when
		var view = this.getView('cols');

		// then
		assertEquals(300, view.child['childOne'].getEl().offsetWidth);
		assertEquals(200, view.child['childTwo'].getEl().offsetWidth);
		assertEquals(300, view.child['childTwo'].getEl().offsetLeft);
		assertEquals(200, view.child['childThree'].getEl().offsetWidth);
		assertEquals(400, view.child['childFour'].getEl().offsetWidth);

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
		assertEquals(300, view.child['childOne'].getEl().offsetHeight);
		assertEquals(200, view.child['childTwo'].getEl().offsetHeight);
		assertEquals(200, view.child['childThree'].getEl().offsetHeight);
		assertEquals(400, view.child['childFour'].getEl().offsetHeight);

	},

	"test should preserve layouts set in class definition": function(){
		ludo.MyClass = new Class({
			Extends: ludo.View,
			layout:{
				type:'linear',
				orientation:'horizontal'
			}
		});

		var v = new ludo.View({
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