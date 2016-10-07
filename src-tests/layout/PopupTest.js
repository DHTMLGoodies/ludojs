TestCase("PopupTest", {

    setUp:function(){

    },

	"test layout type should be popup":function () {


	},

	"test parent should be document.body":function () {
		// given
		var view = this.getViewWithChild();

		// then
		assertEquals($(document.body).attr("id"), view.child['a'].getEl().parent().attr("id"));

	},

	"test child should by default be hidden":function () {
		// given
		var view = this.getViewWithChild();

		// then
		assertTrue(view.child['a'].isHidden());

	},

	"test child with visible property should be displayed initially":function () {
		// given
		var view = this.getViewWithChild();

		// then
		assertFalse(view.child['b'].isHidden());
	},

	"test child should be absolute positioned":function () {
		// given
		var view = this.getViewWithChild();

		// then
		assertEquals('absolute', view.child['a'].getEl().css("position"));
	},

	"test should be able to toggle":function () {
		// given
		var view = new ludo.View({
			renderTo:document.body,
			layout:{
				type:'popup',
				toggle:true
			},
			children:[
				{ name:'a', html:'Hello world'},
				{ name:'b', html:'Hello world', layout:{ "visible":true }}
			]
		});

		// when
		view.child['a'].show();

		// then
		assertTrue(view.child['b'].isHidden());
	},

	"test should preserve layout properties of children": function(){
		// given
		var view = new ludo.View({
			id:'myView',
			renderTo:document.body,
			layout:{
				type:'popup',
				toggle:true
			},
			children:[
				{ name:'a', html:'Hello world', layout:{
					above:'myView'
				}},
				{ name:'b', html:'Hello world', layout:{ "visible":true }}
			]
		});

		// when
		view.child['a'].show();


		// then
		assertEquals(view.getEl(), view.child['a'].layout.above);

	},

	getViewWithChild:function () {
		return new ludo.View({
			renderTo:document.body,
			layout:{
				type:'popup'
			},
			children:[
				{ name:'a', html:'Hello world'},
				{ name:'b', html:'Hello world', layout:{ "visible":true }}
			]
		});
	}
});