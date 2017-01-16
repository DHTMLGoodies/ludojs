TestCase("FilterTest", {

	"test should be able to create filter":function () {
		var filter = new ludo.svg.Filter({ id:'myFilter'});

		assertEquals('myFilter', filter.get('id'));


	},

	"test should have id by default":function () {
		// given
		var filter = new ludo.svg.Filter();

		// then
		assertNotUndefined(filter.get('id'));
	},

	"test should be able to apply filter to nodes":function () {
		var filter = new ludo.svg.Filter({ id:'myFilter'});
		var circle = new ludo.svg.Node('circle', {cx:100, cy:100, r:50});

		assertEquals('myFilter', filter.id);
		circle.applyFilter(filter);

		// then
		assertEquals('url(#' + filter.get('id') + ')', circle.get('filter'));
	},

	"test should be able to add drop shadow":function () {
		var canvas = new ludo.svg.Canvas();
		$(document.body).append(canvas.getEl());
		var filter = new ludo.svg.Filter({ id:'myFilter'});
		filter.setDropShadow({
			x:2, y:2, deviation : 3
		});
		canvas.appendDef(filter);

		this.assertHasNode(filter, 'feGaussianBlur');
		this.assertProperty(filter, 'feGaussianBlur', 'in', 'SourceAlpha');
		this.assertProperty(filter, 'feGaussianBlur', 'stdDeviation', 3);
	},

	"test should be able to build custom filters": function(){
		// given
		var filter = new ludo.svg.Filter();

		// when
		filter.add('feGaussianBlur', { 'stdDeviation' : 2, result:'blur'  });

		// then
		this.assertHasNode(filter, 'feGaussianBlur');
		this.assertProperty(filter, 'feGaussianBlur', 'stdDeviation', 2);
		this.assertProperty(filter, 'feGaussianBlur', 'result', 'blur');

		filter.addFeMergeNode('blur');
		this.assertHasNode(filter, 'feMergeNode');
		this.assertProperty(filter, 'feMergeNode', 'in', 'blur', 0);

	},

	assertProperty:function (filter, tag, property, expected, index) {
		index = index || 0;
		var node = filter.el.getElementsByTagName(tag)[index];
		var val =  ludo.svg.get(node, property);
		assertEquals(property + ' wrong', expected, val);
	},

	assertHasNode:function (filter, tagName) {
		var nodes = filter.el.getElementsByTagName(tagName);
		assertTrue(tagName + ' missing', nodes.length > 0);
	}

});