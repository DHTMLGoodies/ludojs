TestCase("GridTest", {

	"test should give children absolute positioning":function () {
		// given
		var view = this.getView();

		// when
		var pos = view.child['a'].getEl().css("position");

		// then
		assertEquals('absolute', pos);
	},

	"test should find rows and cols": function(){
		// given
		var view = this.getView();

		// then
		assertEquals(4, view.getLayout().columns);
		assertEquals(8, view.getLayout().rows);
	},

	"test should find cell size": function(){
		// given
		var view = this.getView();

		// when
		var cellSize = view.getLayout().getCellSize();

		// then

		assertEquals(1000/4, cellSize.x);
		assertEquals(2000/8, cellSize.y);

	},

	"test should position children correctly": function(){
		// given
		var view = this.getView();

		// then
		assertEquals(250, view.child['b'].getEl().offset().left);
		assertEquals(500, view.child['c'].getEl().offset().left);
		assertEquals(250, view.child['f'].getEl().offset().top);

		assertEquals(0, view.child['i'].getEl().offset().left);

		assertEquals(500, view.child['j'].getEl().offset().top);
		assertEquals(250, view.child['j'].getEl().offset().left);
	},

	getView:function () {
		return new ludo.View({
			renderTo:document.body,
			width:1000,
			height:2000,
			layout:{
				type:'grid',
				columns:4,
				rows:8
			},
			children:[
				{ name:'a'},
				{ name:'b'},
				{ name:'c'},
				{ name:'d'},

				{ name:'e'},
				{ name:'f'},
				{ name:'g'},
				{ name:'h'},

				{ name:'i'},
				{ name:'j'}
			]
		});
	}


});