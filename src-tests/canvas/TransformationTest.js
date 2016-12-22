TestCase("TransformationTest", {

	"test should be able to retrieve transformations":function () {
		// given
		var node = new ludo.svg.Node('rect', {
			'transform':'translate(90, 80)'
		});

		// when
		var translate = node.getTransformation('translate');

		// then
		assertEquals(90, translate.x);
		assertEquals(80, translate.y);


		// given
		node = new ludo.svg.Node('rect', {
			'transform':'translate(10, 20) scale(2,1)'
		});

		// when
		translate = node.getTransformation('translate');

		// then
		assertEquals(10, translate.x);
		assertEquals(20, translate.y);

		// when
		var scale = node.getTransformation('scale');
		assertEquals(2, scale.x);
		assertEquals(1, scale.y);

		// given
		node = new ludo.svg.Node('rect', {
			'transform':'translate(10, 20) scale(1.5)'
		});

		// when
		scale = node.getTransformation('scale');

		// then
		assertEquals(1.5, scale.x);
		assertEquals(1.5, scale.y);

		// given
		node = new ludo.svg.Node('rect', {
			'transform':'translate(10, 20) scale(1.5) skewX(10) skewY(20)'
		});

		// when
		var skewX = node.getTransformation('skewX');

		// then
		assertEquals(10, skewX);
	},

	"test should be able to retrieve rotate transformation":function () {
		// given
		var node = new ludo.svg.Node('rect', {
			'transform':'rotate(20)'
		});

		// when
		var rotation = node.getTransformation('rotate');

		// then
		assertEquals(20, rotation.degrees);

		// given
		node = new ludo.svg.Node('rect', {
			'transform':'rotate(30 10 15)'
		});

		// when
		rotation = node.getTransformation('rotate');

		// then
		assertEquals(30, rotation.degrees);
		assertEquals(10, rotation.cx);
		assertEquals(15, rotation.cy);

	},

	"test should be able to set transformation":function () {
		// given
		var node = new ludo.svg.Node('rect', {

				'transform':'rotate(20) translate(10,20)'

		});
		// when
		node.setTransformation('rotate', 25);
		node.setTransformation('translate', '20 30');
		rotation = node.getTransformation('rotate');

		var actual = ludo.svg.get(node.getEl(), 'transform');

		// then
		assertEquals(25, rotation.degrees);
		assertTrue(actual, actual.indexOf('rotate(25)') >=0);
		assertTrue(actual, actual.indexOf('translate(20 30)') >=0);
	},

	"test should be able to retrieve transformation keys": function(){
		// given
		var node = new ludo.svg.Node('rect', {

				'transform':'rotate(20) skewX(40) translate(20 40)'

		});

		// when
		var keys = ludo.svg.getTransformationKeys(node.getEl());

		// then
		assertEquals('rotate', keys[0]);
		assertEquals('skewX', keys[1]);
		assertEquals('translate', keys[2]);
		assertEquals(3, keys.length);
	},

	"test should be able to have cache of transformation values": function(){
		// given
		var node = new ludo.svg.Node('rect', {
				'transform':'rotate(20) skewX(40) translate(20 40)'
		});

		// when
		ludo.svg.buildTransformationCache(node.getEl());
		var cache = ludo.svg.getTCache(node.getEl());

		assertNotUndefined(cache['rotate']);
		assertEquals(20, cache['rotate'].values[0]);
		assertEquals(20, cache['translate'].values[0]);
		assertEquals(40, cache['translate'].values[1]);

		assertEquals(20, cache['rotate'].readable.degrees);
		assertEquals(20, cache['translate'].readable.x);
		assertEquals(40, cache['translate'].readable.y);
	},

	"test should be able to get transformation cache as string": function(){
		// given
		var transformation = 'rotate(20) skewX(40) translate(20 40)';
		var node = new ludo.svg.Node('rect', {
			id:'myNode',
			'transform':transformation

		});

		ludo.svg.buildTransformationCache(node.getEl());
		// when
		var cacheString = ludo.svg.getTransformationAsText('myNode');

		// then
		assertEquals(transformation, cacheString);

	},

	"test should be able to use translate method": function(){
		// given
		var node = new ludo.svg.Node('rect', {
			id:'myNode2'
		});

		// when
		node.translate(50,100);

		// then
		assertEquals('translate(50 100)', node.get('transform'));
	},

	"test should be able to use scale method": function(){
		// given
		var node = new ludo.svg.Node('rect', {
			id:'myNode3'
		});

		// when
		node.scale(50,100);

		// then
		assertEquals('scale(50 100)', node.get('transform'));
	},
	"test should be able to apply multiple transformations": function(){
		// given
		var node = new ludo.svg.Node('rect', {
			id:'myNode'
		});

		// when
		node.scale(2);
		node.translate(20,20);
		var realValue = node.get('transform');
		// then
		assertTrue(realValue, realValue.indexOf('scale') >=0);
		assertTrue(realValue, realValue.indexOf('translate') >=0);

	},

	"test should be able to retrieve scale transformations": function(){
		// given
		var node = new ludo.svg.Node('rect', {
			id:'myNode'
		});

		// when
		node.scale(50,100);

		// then


	}

});