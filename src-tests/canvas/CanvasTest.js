TestCase("CanvasTest", {

	getParentNode:function () {

		if (!document.getElementById('canvasParent')) {
			var el = $('<div id="canvasParent" style="width:400px;height:500px;position:relative"></div>');
			$(document.body).append(el);
		}
		return $('#canvasParent');
	},

	"test should have default properties":function () {
		// when
		var canvas = new ludo.canvas.Canvas();

		// then
		assertEquals('http://www.w3.org/2000/svg', canvas.get('xmlns'));
		assertEquals('1.1', canvas.get('version'));
	},

	"test should have tag name equal to svg":function () {
		// when
		var canvas = new ludo.canvas.Canvas();

		// then
		assertEquals('svg', canvas.getEl().tagName);
	},

	"test should by default give svg node size of parent":function () {
		// given
		var parent = this.getParentNode();

		var canvas = new ludo.canvas.Canvas({
			renderTo:parent
		});

		// then
		assertEquals('400', canvas.get('width'));
		assertEquals('500', canvas.get('height'));
		assertEquals('0 0 400 500', canvas.get('viewBox'));
	},

	"test should be able to override default size":function () {
		// given
		var parent = this.getParentNode();

		var canvas = new ludo.canvas.Canvas({
			renderTo:parent,
			width:300, height:350
		});

		// then
		assertEquals('300', canvas.get('width'));
		assertEquals('350', canvas.get('height'));
		assertEquals('0 0 300 350', canvas.get('viewBox'));

	},

	"test should automatically resize canvas when parent view is resized":function () {
		// given
		var view = new ludo.View({
			width:600,
			height:700,
			renderTo:document.body
		});
		var canvas = new ludo.canvas.Canvas({
			renderTo:view
		});

		// when
		view.resize({
			width:600,height:700
		});

		// then
		assertEquals('600', canvas.get('width'));
		assertEquals('700', canvas.get('height'));
		assertEquals('0 0 600 700', canvas.get('viewBox'));

	},

	"test should be able to have title":function () {
		var canvas = new ludo.canvas.Canvas({
			renderTo:this.getParentNode(),
			title:'My Canvas'
		});

		// then

		try{
			var children = canvas.getEl().getElementsByTagName('title');

			assertEquals(1, children.length);

			assertEquals('title', children[0].tagName);
			assertTrue(children[0].textContent.indexOf('My Canvas') >= 0);
		}catch(e){

		}


	},

	"test should be able to have description":function () {
		var canvas = new ludo.canvas.Canvas({
			renderTo:this.getParentNode(),
			description:'Description'
		});

		// then
		assertEquals('desc', canvas.getEl().getElementsByTagName('desc')[0].tagName);
		assertTrue( canvas.getEl().getElementsByTagName('desc')[0].textContent.indexOf('Description') >= 0);
	},

	"test should be able to apply paint object":function () {
		var paint = new ludo.canvas.Paint({
			css:{
				'background-color':'#FFFFFF'
			}
		});
		var el = new ludo.canvas.Canvas({
			attr: { "class" :paint }
		});

		// then
		assertEquals(paint.getClassName(), el.get('class'));
	},

	"test should be able to render to view": function(){
		// given
		var w = new ludo.Window({
			width:500,
			height:500
		});
		// when
		var canvas = new ludo.canvas.Canvas({
			renderTo:w
		});
		// then
		assertEquals(w.getBody().attr("id"), ludo.canvasEngine.get(canvas.getEl().parentNode, "id"));
	},

	"test should be able to create canvas by calling view.getCanvas":function(){
		// given
		var view = new ludo.View({
			width:500,
			height:400,
			renderTo:document.body
		});

		// when
		var canvas = view.getCanvas();

		// then
		assertEquals('svg', canvas.getEl().tagName);
	},

	"test should be able to retrieve DEFS node": function(){
		// given
		var c = new ludo.canvas.Canvas();
		// when
		var d = c.getDefs();

		// then
		assertEquals('defs', d.tagName);

	},

	"test should be able to append Node to defs": function(){
		// given
		var c = new ludo.canvas.Canvas();
		var d = c.getDefs();

		// when
		var filter = new ludo.canvas.Filter();
		c.appendDef(filter);

		// then
		assertEquals('defs', filter.el.parentNode.tagName);
	}
});