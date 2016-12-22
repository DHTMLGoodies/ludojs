TestCase("ElementTest", {

	getRect:function () {
		var paint = new ludo.svg.Paint({
			css:{
				'stroke-color':'#FFFFFF'
			}
		});
		return new ludo.svg.View({
			tag:'rect',
			paint:paint
		});
	},

	"test be able to create an element":function () {
		var paint = new ludo.svg.Paint({
			css:{
				'stroke-color':'#FFFFFF'
			}
		});
		var el = new ludo.svg.View({
			tag:'rect',
			paint:paint
		});

		// then
		assertEquals('rect', el.getEl().tagName);
	},

	"test should be able to set properties":function () {
		// given
		var rect = this.getRect();

		// when
		rect.set('width', '567');

		// then
		assertEquals('567', rect.getEl().getAttribute('width'));
	},

	"test should be able to apply paint object":function () {
		var paint = new ludo.svg.Paint({
			css:{
				'stroke-color':'#FFFFFF'
			}
		});
		var el = new ludo.svg.View({
			tag:'rect',
			attr:{ "class": paint }
		});

		// then
		assertEquals(paint.getClassName(), el.get('class'));

	},

	"test should be able to access node":function () {
		var el = new ludo.svg.View({
			tag:'rect'
		});

		// when
		var node = el.getNode();

		// then
		assertEquals('rect', node.el.tagName);
	},

	"test should be able to access properties":function () {
		// when
		var element = new ludo.svg.View({
			tag:'rect',
			attr:{x1:100, y1:150, x2:200, y2:250}
		});
		// then
		assertEquals('100', element.get('x1'));
	}
});