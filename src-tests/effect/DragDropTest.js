TestCase("DragDropTest", {

	dragDropMock:undefined,

	setUp:function () {
		if (window.dragDropMock === undefined) {
			window.DragDropMock = new Class({
				Extends:ludo.effect.DragDrop,
				getBodyWidth:function () {
					return 1900;
				}
			});
		}
	},

	getEl:function (id) {
		id = id || String.uniqueID();
		var el = $('<div>');
		$(document.body).append(el);
		el.css({
			width:200,
			height:100,
			left:100,
			top:200
		});
		var span = $('<span>');
		el.append(span);
		el.attr("id", id);
		return el;
	},
	"test should be able to drag":function () {
		// given
		var el = this.getEl();
		el.css({
			left:100,
			top:200
		});

		var c = new DragDropMock();
		c.add({
			el:el,
			handle:el.find('span').first()
		});
		var span = el.find('span').first();

		// when
		c.startDrag({
			pageX:100, pageY:100,
			target:span
		});

		c.drag({
			pageX:50, pageY:50
		});

		// then
		assertEquals('50px', el.css('left'));
		assertEquals('150px', el.css('top'));
	},
	"test should be able to have dragged below mouse cursor":function () {
		// given
		var el = this.getEl();
		var c = new DragDropMock({
			mouseYOffset:5
		});
		c.add({
			el:el,
			handle:el.find('span').first()
		});
		var span = el.find('span').first();

		// when
		c.startDrag({
			pageX:100,pageY:100,
			target:span
		});

		c.drag({
			pageX:50,pageY:50,
		});

		// then
		assertEquals('50px', el.css('left'));
		assertEquals('55px', el.css('top'));

	},
	"test should fire before drag event":function () {
		// given
		var el = this.getEl();
		el.id = 'myId';
		var c = new DragDropMock();
		c.add({
			el:el,
			col:'Alf'
		});
		var eventFired = false;
		var returnedArgs;
		c.addEvent('before', function (args) {
			eventFired = true;
			returnedArgs = args;
		});
		// when

		// when
		c.startDrag({
			pageX:100,pageY:100,
			target:el
		});

		// then
		assertTrue(eventFired);
		assertEquals('myId', returnedArgs.el.id);
		assertEquals('Alf', returnedArgs.col);
	},
	"test should be able to use shim":function () {
		// given
		var c = new DragDropMock({
			useShim:true
		});
		var el = this.getEl();
		c.add(el);

		// when

		// when
		c.startDrag({
			pageX:100,pageY:100,
			target:el
		});

		var shim = c.dragProcess.el;

		// then
		assertNotEquals(shim.id, el.id);
	},
	"test should be able to set shim content":function () {
		// given
		var c = new DragDropMock({
			useShim:true
		});

		c.setShimText('Content');

		// then
		assertEquals('Content', c.getShim().html());

	},
	"test should be able to specify shim cls":function () {
		// given
		var c = new DragDropMock({
			useShim:true,
			shimCls:['myShim', 'secondClass']
		});

		// then
		assertTrue(c.getShim().hasClass('myShim'));
		assertTrue(c.getShim().hasClass('secondClass'));
	},
	"test should be able to use ids for draggable":function () {
		// given
		var c = new DragDropMock();
		var el = this.getEl();

		// when
		c.add({
			id:'myId',
			el:el
		});

		// then
		assertNotUndefined(c.getById('myId'));

		// given
		el = this.getEl();
		el.attr("id",'SecondId');

		// when
		c.add(el);

		// then
		assertNotUndefined(c.getById('SecondId'));
	},
	"test should be able to specify custom min and max values for nodes":function () {
		// given
		var c = new DragDropMock();
		var el = this.getEl();
		c.add({
			id:'myId',
			el:el,
			minX:90,
			minY:80,
			maxX:490,
			maxY:480,
			directions:'Y'
		});

		// when
		c.startDrag({
			pageX:100,pageY:100,
			target:el
		});

		// then
		assertEquals(90, c.getMinX());
		assertEquals(80, c.getMinY());
		assertEquals(490, c.getMaxX());
		assertEquals(480, c.getMaxY());
		assertTrue(c.canDragAlongY());
		assertFalse(c.canDragAlongX());

	},
	"test should be able to add drop point":function () {
		// given
		var c = new DragDropMock();
		// when
		c.addDropTarget(this.getEl('dropPoint'));

		// then
		assertNotUndefined(document.getElementById('dropPoint'));
		assertNotUndefined(c.getById('dropPoint'));
	},
	"test should send correct arguments for drop events":function () {
		// given
		var c = new DragDropMock();
		var draggable = this.getEl('draggable');
		var dropPoint = this.getEl('dropPoint');
		c.add(draggable);
		c.addDropTarget(dropPoint);
		var argA, argB, argC;
		c.addEvent('enterDropTarget', function (a, b, c) {
			argA = a;
			argB = b;
			argC = c;
		});
		// when
		c.startDrag({
			pageX:100,pageY:100,
			target:draggable
		});

		c.enterDropTarget({
			target:dropPoint
		});

		// then
		assertEquals('draggable', argA.id);
		assertEquals('dropPoint', argB.id);
		assertEquals(c, argC);
	},
	"test should be able to fire invalid drop point event":function () {
		// given
		var c = new DragDropMock();
		var draggable = this.getEl('draggable');
		var dropPoint = this.getEl('dropPoint');
		var eventFired = false;

		c.add(draggable);
		c.addDropTarget(dropPoint);

		c.addEvent('invalidDropTarget', function () {
			eventFired = true
		});

		c.addEvent('enterDropTarget', function (dragged, droppedAt, dragDrop) {
			dragDrop.setInvalid();
		});

		// when
		c.startDrag({
			pageX:100,pageY:100,
			target:draggable
		});

		c.enterDropTarget({
			target:dropPoint
		});

		// then
		assertTrue(eventFired);
		assertEquals('dropPoint', c.getCurrentDropPoint().el.attr("id"));

	},
	"test should fire drop event on mouseup on valid drop point":function () {
		// given
		var c = new DragDropMock();
		var draggable = this.getEl('draggable');
		var dropPoint = this.getEl('dropPoint');
		var eventFired = false;

		c.add(draggable);
		c.addDropTarget(dropPoint);

		c.addEvent('drop', function () {
			eventFired = true
		});

		// when
		c.startDrag({
			pageX:100,pageY:100,
			target:draggable
		});

		c.enterDropTarget({
			target:dropPoint
		});
		c.endDrag();

		// then
		assertTrue(eventFired);

	},
	"test should not fire drop event on mouseup on invalid drop point":function () {
		// given
		var c = new DragDropMock();
		var draggable = this.getEl('draggable');
		var dropPoint = this.getEl('dropPoint');
		var eventFired = false;

		c.add(draggable);
		c.addDropTarget(dropPoint);

		c.addEvent('drop', function () {
			eventFired = true
		});

		c.addEvent('enterDropTarget', function (dragged, droppedAt, dragDrop) {
			dragDrop.setInvalid();
		});

		// when
		c.startDrag({
			pageX:100,pageY:100,
			target:draggable
		});

		c.enterDropTarget({
			target:dropPoint
		});
		c.endDrag();

		// then
		assertFalse(eventFired);

	},
	"test should be able to add elements without any id":function () {
		// given
		var c = new DragDropMock();
		var draggable =$('<div>');
		$(document.body).append(draggable);

		c.add({
			el:draggable
		});

		// when
		c.startDrag({
			pageX:100,pageY:100,
			target:draggable
		});

		c.drag({
			pageX:120,pageY:120,
		});


		// then
		assertNotUndefined(c.getDragged());
		assertNotUndefined(c.dragProcess.el);
	},
	"test should position components correctly when child of positioned":function () {
		// given

		var c = new DragDropMock();

		var parent =$('<div>');
		parent.css({
			left:200,
			top:50,
			position:'absolute',
			width:1000,
			height:1000
		});
		$(document.body).append(parent);

		var child =$('<div>');

		// when
		var el =$('<div>');
		el.css({
			top:50,
			left:50,
			width:200, height:200
		});
		parent.append(el);

		c.add(el);

		// then
		assertEquals('Initial x', 100, el.offset().top);
		assertEquals('Initial y', 250, el.offset().left);

		var drag = {
			pageX:100,pageY:100,
			target:el
		};
		// when
		c.startDrag(drag);
		c.drag(drag);

		// then
		assertEquals('first x', 100, el.offset().top);
		assertEquals('first y', 250, el.offset().left);

		// when
		drag.pageX = 200;
		drag.pageY = 200;
		c.drag(drag);

		// then
		assertEquals(200, el.offset().top);
		assertEquals(350, el.offset().left);


	},
	"test should position components correctly when grand child of positioned":function () {
		// given
		document.body.innerHTML = '';
		var c = new DragDropMock();

		var parent =$('<div>');
		parent.css({
			left:200,
			top:50,
			position:'absolute',
			width:1000,
			height:1000
		});
		$(document.body).append(parent);

		var child =$('<div>');
		parent.append(child);

		// when
		var el =$('<div>');
		el.css({
			top:50,
			left:50,
			width:200, height:200
		});
		child.append(el);

		c.add(el);

		// then
		assertEquals('Initial x', 100, el.offset().top);
		assertEquals('Initial y', 250, el.offset().left);

		var drag = {
			pageX:100, pageY:100,
			target:el
		};
		// when
		c.startDrag(drag);
		c.drag(drag);

		// then
		assertEquals('first x', 100, el.offset().top);
		assertEquals('first y', 250, el.offset().left);

		// when
		drag.pageX = 200;
		drag.pageY = 200;
		c.drag(drag);

		// then
		assertEquals(200, el.offset().top);
		assertEquals(350, el.offset().left);
	},
	"test should position relative nodes correctly":function () {
		// given
		$(document.body).css({
			margin:0, padding:0
		});
		var c = new DragDropMock();

		var parent = $('<div>');
		parent.css({
			left:200,
			top:50,
			position:'relative',
			width:1000,
			height:1000
		});
		$(document.body).append(parent);

		var child =$('<div>');
		parent.append(child);

		// when
		var el =$('<div>');
		el.css({
			position:'relative',
			width:200, height:200
		});
		child.append(el);

		c.add(el);

		// then

		assertEquals('Initial x', 50, el.offset().top);
		assertEquals('Initial y', 200, el.offset().left);

		var drag = {
			pageX:150,pageY:150,
			target:el
		};
		// when
		c.startDrag(drag);
		c.drag(drag);

		// then
		assertEquals('first x', 50, el.offset().top);
		assertEquals('first y', 200, el.offset().left);

		// when
		drag.pageX = 250;
		drag.pageY = 250;
		c.drag(drag);

		// then
		assertEquals(150, el.offset().top);
		assertEquals(300, el.offset().left);
	},
	"test should be able to capture regions":function () {
		// given
		var c = new DragDropMock({
			captureRegions:true
		});

		// then
		var draggable = this.getEl('draggable');
		var dropPoint = this.getEl('dropPoint');
		var dropPoint2 = this.getEl('dropPoint2');
		var eventFired = false;

		draggable = c.add(draggable);
		dropPoint = c.addDropTarget(dropPoint);
		dropPoint2 = c.addDropTarget({
			el:dropPoint2,
			captureRegions:false
		});


		// then
		assertTrue('dropPoint should capture', c.shouldCaptureRegionsFor(dropPoint));
		assertFalse('draggable should not', c.shouldCaptureRegionsFor(draggable));
		assertFalse('dropPoint2 should not', c.shouldCaptureRegionsFor(dropPoint2));
	},
	"test should be able to capture regions for only some":function () {
		// given
		var c = new DragDropMock({
		});

		// then

		var dropPoint = this.getEl('dp');
		var dropPoint2 = this.getEl('dp2');
		var eventFired = false;


		dropPoint = c.addDropTarget(dropPoint);
		dropPoint2 = c.addDropTarget({
			el:dropPoint2,
			captureRegions:true
		});


		// then
		assertFalse(c.shouldCaptureRegionsFor(dropPoint));
		assertTrue(c.shouldCaptureRegionsFor(dropPoint2));
	},
	"test should fire region events":function () {
		// given
		var c = new DragDropMock({
			captureRegions:true
		});
		var draggable = this.getEl('draggable');
		var dropPoint = this.getEl('dropPoint');
		dropPoint.css({
			position:'absolute'
		});
		c.add(draggable);
		c.addDropTarget(dropPoint);

		// when
		var e = {
			pageX:0,pageY:0,
			target:draggable
		};
		c.startDrag(e);
		c.drag(e);

		var northFired = false;
		var westFired = false;
		var southFired = false;
		var eastFired = false;

		c.addEvent('north', function () {
			northFired = true;
		});
		c.addEvent('west', function () {
			westFired = true;
		});
		c.addEvent('east', function () {
			eastFired = true;
		});
		c.addEvent('south', function () {
			southFired = true;
		});
		var pos = dropPoint.offset();
		pos.x = pos.left; pos.y = pos.top;

		var size = { x : dropPoint.width(), y: dropPoint.height() };

		c.enterDropTarget({
			pageX:pos.x, pageY:pos.y,
			target:dropPoint
		});
		c.captureRegion({
			pageX:pos.x, pageY:pos.y,
			target:dropPoint
		});

		// then
		assertTrue(northFired);
		assertTrue(westFired);
		assertFalse(southFired);
		assertFalse(eastFired);

		// when
		var northFired = false;
		var westFired = false;
		var southFired = false;
		var eastFired = false;
		c.captureRegion({
			page:{x:pos.x, y:pos.y},
			target:dropPoint
		});
		c.captureRegion({
			pageX:pos.x, pageY:pos.y,
			target:dropPoint
		});
		// then
		assertFalse(northFired);
		assertFalse(westFired);
		assertFalse(southFired);
		assertFalse(eastFired);

		// when
		c.captureRegion({
			pageX: pos.x + size.x, pageY:pos.y + size.y,
			target:dropPoint
		});

		// then
		assertFalse('north should not be fired', northFired);
		assertFalse('west should not be fired', westFired);
		assertTrue(southFired);
		assertTrue(eastFired);

	},
	"test should be able to ignore dom nodes":function () {


	}

});