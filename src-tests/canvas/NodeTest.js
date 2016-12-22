TestCase("NodeTest", {

	"test be able to create a node":function () {
		// when
		var node = new ludo.svg.Node("svg");

		// then
		assertNotUndefined(node.el.tagName);

	},

	"test should be able to add paint object":function () {
		// given
		var paint = new ludo.svg.Paint({
			css:{
				'stroke-color':'#FFFFFF'
			}
		});
		// when
		var node = new ludo.svg.Node('rect', { "class" :paint });

		// then
		assertEquals(paint.getClassName(), node.get('class'));
	},

	"test should be able to apply properties":function () {
		// when
		var node = new ludo.svg.Node('rect', {
			id:'myId', x:50, y:60, width:150, height:250
		});

		// then
		assertEquals('myId', node.el.getAttribute('id'));
		assertEquals('50', node.el.getAttribute('x'));
		assertEquals('60', node.el.getAttribute('y'));
		assertEquals('150', node.el.getAttribute('width'));
		assertEquals('250', node.el.getAttribute('height'));
	},

	"test should be able to set html text":function () {
		// when
		var node = new ludo.svg.Node('title', {}, 'my text');
		// then
		assertTrue(node.el.textContent.indexOf('my text') >= 0)
	},

	"test should be able to set html text via add method":function () {
		// given
		var g = new ludo.svg.Node('g');
		// when

		var node = g.add('text', {}, 'my text');
		// then
		assertTrue(node.el.textContent.indexOf('my text') >= 0)
	},

	"test should be able to assign id to node":function () {
		// when
		var node = new ludo.svg.Node('rect', { id:'myId'});

		// then
		assertEquals('myId', node.getEl().id);
	},

	"test should be able to assign CSS class to nodes":function () {
		// given
		var node = new ludo.svg.Node('rect', { id:'myId'});

		// when
		node.addClass('myClass');

		// then
		assertEquals('myClass', node.get('class'));
	},

	"test should be able to determine if node has a class":function () {
		// given
		var node = new ludo.svg.Node('rect', { id:'myId2'});
		// then
		assertFalse(node.hasClass('myClass'));

		// when
		node.addClass('myClass');
		// then
		assertTrue(node.hasClass('myClass'));
	},

	"test should be able to remove css class":function () {
		// given
		var node = new ludo.svg.Node('rect', { id:'myId2'});
		node.addClass('myClass');
		node.addClass('secondClass');

		// when
		node.removeClass('myClass');

		// then
		assertFalse(node.hasClass('myClass'));
		assertTrue(node.hasClass('secondClass'));
	},

	"test should always assign id": function(){
		// given
		var mask = new ludo.svg.Mask();

		// when
		var id = mask.getId();

		assertNotUndefined(id);
		assertEquals(id, mask.el.getAttribute('id'));

	}
});