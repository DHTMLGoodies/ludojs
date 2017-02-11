TestCase("GridTest", {

	setUp:function(){
		$(document.body).empty();
	},

	"test should give children absolute positioning":function () {
		// given
		var view = this.getView_250_40();

		// when
		var pos = ludo.$('child00').getEl().css("position");

		// then
		assertEquals('absolute', pos);

		assertEquals('relative', view.$b().css('position'));
	},

	"test find correct col width": function(){
		// given
		var v = this.getView_250_40();
		var l = v.getLayout();
		
		// then
		assertEquals(1000/4, l.colWidth);

	},

	"test should position children correctly": function(){
		this.getView_250_40();

		// then

		this.assertPosition(0,0,'child00' );
		this.assertPosition(250,80,'child12' );


	},

	"test should return correct position": function(){
		var l = this.getView_250_40().getLayout();

		this.assertLayoutPos(0,0, l, 'child00');
		this.assertLayoutPos(250,80, l, 'child12');



	},

	assertLayoutPos:function(x, y, layout, childId){
		var pos = layout.pos(ludo.$(childId));

		assertEquals(x, pos.left);
		assertEquals(y, pos.top);

	},


	"test should find width of views": function(){
		var l = this.getView_250_40().getLayout();


		// then
		assertEquals(250, l.widthOfView(ludo.$('child00')));
		assertEquals(500, l.widthOfView(ludo.$('child31')));

	},

	"test should find correct width when spacing is added": function(){
		var v= this.getView_250_40_spacing_10_5();



		assertEquals(490, ludo.$('spacing31_21').getEl().outerWidth());
		assertEquals(740, ludo.$('spacing40_32').getEl().outerWidth());
		assertEquals(75, ludo.$('spacing40_32').getEl().outerHeight());


	},


	assertPosition:function(x, y, id){
		assertEquals(id, x, ludo.$(id).getEl().position().left);
		assertEquals(id, y, ludo.$(id).getEl().position().top);
	},

	getView_250_40:function () {
		return new ludo.View({
			renderTo:document.body,
			width:1000,
			height:200,
			layout:{
				type:'grid',
				columns:4,
				rows:5
			},
			children:[
				{ id: 'child00', layout: { x: 0, y: 0 }},
				{ id: 'child12', layout: { x: 1, y: 2 }},
				{ id: 'child31', layout: { x: 3, y: 1, colspan:2 }}
			]
		});
	},

	getView_250_40_spacing_10_5:function () {
		return new ludo.View({
			renderTo:document.body,
			width:1000,
			height:200,
			layout:{
				type:'grid',
				columns:4,
				rows:5,
				padX: 10, padY: 5
			},
			children:[
				{ id: 'spacing00', layout: { x: 0, y: 0 }},
				{ id: 'spacing12', layout: { x: 1, y: 2 }},
				{ id: 'spacing31_21', layout: { x: 3, y: 1, colspan:2 }},
				{ id: 'spacing40_32', layout: { x: 3, y: 1, colspan:3,rowspan:2 }}
			]
		});
	}


});