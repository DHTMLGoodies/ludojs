TestCase("CurtainTest", {

	"test should be able to get curtain from node":function () {
		// given
		var rect = this.getRect();

		// then
		assertNotUndefined(rect.curtain());
	},

	"test should be able to get directions to open":function () {
		// given
		var rect = this.getRect();
		var curtain = rect.curtain();

		// when
		var dir = curtain.getDirections('LeftRight');
		// then
		assertEquals(['Left', 'Right'], dir);
	},

	"test should be able to open curtain":function () {
		// given
		var rect = this.getRect();
		var curtain = rect.curtain();

		// when
		curtain.open('LeftRight');

		// then
		assertEquals(1, curtain.getEl().childNodes.length);
	},

	"test should get animation coordinates from left right":function () {
		// given
		var rect = this.getRect();
		var curtain = rect.curtain();
		curtain.setBB();

		// when
		var coordinates = curtain.getCoordinates('LeftRight', false);

		// then
		assertNotUndefined(coordinates.width);
		assertEquals(0, coordinates.width.from);
		assertEquals(200, coordinates.width.to);
	},


	"test should get animation coordinates from right to left":function () {
		// given
		var rect = this.getRect();
		var curtain = rect.curtain();
		curtain.setBB();

		// when
		var coordinates = curtain.getCoordinates('RightLeft', false);

		// then
		assertNotUndefined(coordinates.width);
		assertEquals(0, coordinates.width.from);
		assertEquals(200, coordinates.width.to);
		assertEquals(300, coordinates.x.from);
		assertEquals(100, coordinates.x.to);
	},


	"test should get animation coordinates from top to bottom":function () {
		// given
		var rect = this.getRect();
		var curtain = rect.curtain();
		curtain.setBB();

		// when
		var coordinates = curtain.getCoordinates('TopBottom', false);

		// then
		assertNotUndefined(coordinates.height);
		assertEquals(0, coordinates.height.from);
		assertEquals(300, coordinates.height.to);
	},


	"test should get animation coordinates from bottom to top":function () {
		// given
		var rect = this.getRect();
		var curtain = rect.curtain();
		curtain.setBB();

		// when
		var coordinates = curtain.getCoordinates('BottomTop', false);

		// then
		assertNotUndefined(coordinates.height);
		assertNotUndefined(coordinates.y);
		assertEquals(0, coordinates.height.from);
		assertEquals(300, coordinates.height.to);
		assertEquals(420, coordinates.y.from);
		assertEquals(120, coordinates.y.to);
	},

	"test should get animation coordinates from left right when closing":function () {
		// given
		var rect = this.getRect();
		var curtain = rect.curtain();
		curtain.setBB();

		// when
		var coordinates = curtain.getCoordinates('LeftRight', true);

		// then
		assertNotUndefined(coordinates.width);
		assertEquals(200, coordinates.width.from);
		assertEquals(0, coordinates.width.to);
	},

	getRect:function () {
		var v = new ludo.View({
			layout:{ width:500, height:500},
			renderTo:document.body
		});
		var rect = new ludo.svg.Rect({ x:100, y:120, width:200, height:300, rx:5, ry:7 });
		v.svg().append(rect);
		return rect;
	}

});