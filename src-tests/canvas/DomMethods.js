TestCase("DomMethods", {
	"test should find offset": function(){
		var v = new ludo.View({
			renderTo:document.body,
			layout:{
				width:'matchParent', height:'matchParent'
			}
		});

		var c = v.svg();

		var rect = c.$('rect', { x : 150, y: 200, width:20,height:20 });
		c.append(rect);
		var offset = rect.offset();

		assertEquals(150, offset.left);
		assertEquals(200, offset.top);


	},

	"test should find offset of nested": function(){
		var v = new ludo.View({
			renderTo:document.body,
			layout:{
				width:'matchParent', height:'matchParent'
			}
		});

		var c = v.svg();

		var g = c.$('g');
		c.append(g);
		g.translate(100,250);

		var rect = c.$('rect', { x : 150, y: 200, width:20,height:20 });
		g.append(rect);
		assertEquals(g, rect.parentNode);
		var offset = rect.offset();
		
		var off = g.position();
		assertEquals(100, off.left);
		assertEquals(250, off.top);

		assertEquals(150, rect._attr.x);
		assertEquals(200, rect._attr.y);



		assertEquals(450, offset.top);
		assertEquals(250, offset.left);

		
	}


});