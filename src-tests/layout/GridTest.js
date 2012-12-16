TestCase("GridTest", {

	"test should give children absolute positioning":function () {
		// given
		var view = this.getView();

		// when
		var pos = view.child['a'].getEl().style.position;

		// then
		assertEquals('absolute', pos);
	},

	"test should find rows and cols": function(){
		// given
		var view = this.getView();

		// then
		assertEquals(4, view.getLayoutManager().columns);
		assertEquals(8, view.getLayoutManager().rows);
	},

	"test should find cell size": function(){
		// given
		var view = this.getView();

		// when
		var cellSize = view.getLayoutManager().getCellSize();

		// then

		assertEquals(1000/4, cellSize.x);
		assertEquals(2000/8, cellSize.y);

	},

	"test should position children correctly": function(){
		// given
		var view = this.getView();

		// then
		assertEquals(250, view.child['b'].getEl().offsetLeft);
		assertEquals(500, view.child['c'].getEl().offsetLeft);
		assertEquals(250, view.child['f'].getEl().offsetTop);

		assertEquals(0, view.child['i'].getEl().offsetLeft);

		assertEquals(500, view.child['j'].getEl().offsetTop);
		assertEquals(250, view.child['j'].getEl().offsetLeft);
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