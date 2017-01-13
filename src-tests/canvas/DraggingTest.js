TestCase("DraggingTest", {

	setUp:function(){
		document.body.innerHTML = '';
	},

	svg:function(){
		var view = new ludo.View({
			width:800,
			height:800,
			renderTo:document.body
		});
		return view.svg();
	},

	getDD:function(config){
		config = config || {};
		return new ludo.svg.Drag(config);
	},

	"test should determine config objects": function(){
		var circle = new ludo.svg.Node('circle', { attr: {'cx' : 100, cy:100, r: 50} } );
		var dd = this.getDD();

		// then
		assertTrue(dd.isElConfigObject({
			el:circle
		}));
		assertFalse(dd.isElConfigObject(circle))
	},

	"test should get valid added node": function(){
		// given
		var circle = new ludo.svg.Node('circle', { attr: {'cx' : 100, cy:100, r: 50} } );
		var dd = this.getDD();

		var node = dd.add({
			el: circle
		});

		// then
		assertEquals(node.el, circle);
	},

	"test should be able to drag svg node": function(){
		// given
		var canvas = this.svg();
		var circle = new ludo.svg.Node('circle', {'cx' : 100, cy:100, r: 50 } );
		canvas.append(circle);
		var dd = this.getDD();
		dd.add(circle);

		assertEquals('Initial value wrong', '100', circle.get('cx'));
		assertEquals('Initial value wrong', '100', circle.get('cy'));

		var e = {
			pageX:70,
			pageY:70,
			target:circle.getEl()
		};

		dd.startDrag(e);

		e.pageX = 80;
		e.pageY = 90;
		dd.drag(e);

		// then
		assertEquals('100', circle.get('cx'));
		assertEquals('100', circle.get('cy'));

		this.assertInTransform(circle, 'translate(10 20)');
	},

	"test should be able to drag svg node step by step": function(){
		// given
		var canvas = this.svg();
		var circle = new ludo.svg.Node('circle', {'cx' : 100, cy:100, r: 50 } );
		canvas.append(circle);
		var dd = this.getDD();
		dd.add(circle);

		var e = {
			pageX:70,
			pageY:70,
			target:circle.getEl()
		};

		dd.startDrag(e);

		// when
		e.pageX = 80;
		e.pageY = 90;
		dd.drag(e);
		e.pageX = 90;
		e.pageY = 100;
		dd.drag(e);

		// then
		this.assertInTransform(circle, 'translate(20 30)');
	},

	"test should be able to drag svg node a second time": function(){
		// given
		var canvas = this.svg();
		var circle = new ludo.svg.Node('circle', { attr: {'cx' : 100, cy:100, r: 50} } );
		canvas.append(circle);
		var dd = this.getDD();
		dd.add(circle);

		var e = {
			pageX:70,
			pageY:70,
			target:circle.getEl()
		};

		dd.startDrag(e);

		// when
		e.pageX = 80;
		e.pageY = 90;
		dd.drag(e);
		dd.endDrag();
		dd.startDrag(e);

		e.pageX = 90;
		e.pageY = 100;
		dd.drag(e);

		// then
		this.assertInTransform(circle, 'translate(20 30)');
	},

	"test should be able to drag efficiently": function(){
		// given
		var canvas = this.svg();
		var circle = new ludo.svg.Node('circle', { attr: {'cx' : 100, cy:100, r: 50} } );
		canvas.append(circle);
		var dd = this.getDD();
		dd.add(circle);

		var e = {
			pageX:70,
			pageY:70,
			target:circle.getEl()
		};
		dd.startDrag(e);
		var start = new Date().getTime();

		for(var i=0;i<1000;i++){
			e.x++;e.y++;
			dd.drag(e);
		}

		// then
		var ellapsed = new Date().getTime() - start;
		assertTrue('Not efficient dragging, time: ' + ellapsed, ellapsed<50);

	},

	"test should be able to get id of dragged when drag is triggered by child DOM node": function(){
		// given
		var node = this.getSliderDom();
		var dd = this.getDD();
		dd.add(node);

		// when
		var e = {
			pageX:70,
			pageY:70,
			target:node.getEl().getElementsByTagName('use')[0]
		};
		dd.startDrag(e);

		// then
		assertNotUndefined(dd.getIdByEvent(e));

	},
	
	getSliderDom:function(){
		var canvas = new ludo.svg.Canvas({
			renderTo:document.body
		});
		var slider = new ludo.svg.Node('g', { x: 0, width:'100%', height:10, y: 0 });
		slider.css('cursor', 'pointer');
		var symbol = new ludo.svg.Node('symbol');
		canvas.appendDef(symbol);
		var p = new ludo.svg.Path('M 5 0 L 10 0 L 15 5 L 10 10 L 5 10 Z', { fill:'white', stroke : 'black'});
		symbol.append(p);

		var u = new ludo.svg.Node('use');
		u.href(symbol);
		slider.append(u);
		var u2 = new ludo.svg.Node('use', { x : '-100%', 'transform' : 'scale(-1,1)'});
		u2.href(symbol);
		slider.append(u2);
		canvas.append(slider);
		return slider;
	},
	assertInTransform:function(el, what){
		var t = el.get('transform');
		t = t || '<empty>';
		assertTrue('Actual: ' + t + ', expected: ' + what, t.indexOf(what)>=0);
	}
});