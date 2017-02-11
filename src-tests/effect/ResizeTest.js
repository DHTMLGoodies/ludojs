TestCase("ResizeTest", {
	setUp:function () {
		if (ludo.ResizeMock === undefined) {
			ludo.ResizeMock = new Class({
				Extends:ludo.effect.Resize,
				$bWidth:function () {
					return 1900;
				},
				$bHeight:function () {
					return 1200;
				}
			});
		}
	},

	"test should register component":function() {
	    // given
	    var win = this.getWin();
	
	    // when
	    var resize = new ludo.effect.Resize({
	        component:win
	    });
	
	    // then
	    assertNotUndefined(resize.component);
	}
	
	
	,
	"test should be able to add handle":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400();
	
	    // when
	    resize.addHandle('e');
	
	    // then
	    assertNotUndefined(resize.els.handle.e);
	    assertEquals(resize.component.getEl().attr("id"), resize.els.handle.e.parent().attr("id"));
	}
	
	
	,
	"test should set correct cursor on drag start":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400();
	
	    // when
	    resize.startResize(this.getEventMock('e'));
	    // then
	    assertEquals('e-resize', this.$bCursor());
	    // when
	    resize.startResize(this.getEventMock('se'));
	    // then
	    assertEquals('se-resize', this.$bCursor());
	}
	
	,
	"test should revert body cursor on stop resize":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400();
	    var e = this.getEventMock('e');
	    resize.startResize(e);
	    // when
	    resize.stopResize(e);
	
	    // then
	    assertEquals('default', this.$bCursor());
	}
	
	,
	"test should create shim on resize start":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400();
	
	    assertUndefined(resize.els.shim);
	
	    // when
	    resize.startResize(this.getEventMock('e'));
	
	    // then
	    assertNotUndefined(resize.els.shim);
	}
	
	,
	"test should position shim when showing":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400();
	    var window = resize.component;
	
	    // when
	    resize.startResize(this.getEventMock('e'));
	
	    // then
	    assertTrue('left is wrong', this.hasSameStyle(window, resize, 'left'));
	    assertTrue('top is wrong', this.hasSameStyle(window, resize, 'top'));
	    assertTrue('width is wrong', this.hasSameStyle(window, resize, 'width'));
	    assertTrue('height is wrong', this.hasSameStyle(window, resize, 'height'));
	},
	
	hasSameStyle:function(window, resize, property) {
	    if (property === 'width') {
	        return window.getEl().width() == resize.els.shim.width();
	    }
	    if (property === 'height') {
	        return window.getEl().height() == resize.els.shim.height();
	    }
	    return window.getEl().css(property) == resize.els.shim.css(property);
	}
	
	,
	"test should return only needed coordinastes during resize":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400();
	    var e = this.getEventMock('e', {
			pageX:100, pageY:100
	    });
	    resize.startResize(e);
	    e.pageX = 150;
	    e.pageY = 120;

		var coords = resize.getCoordinates();

	    // then
	    assertEquals('e', resize.dragProperties.region);
		assertNotUndefined('width is undefined', resize.getCoordinates().width);
		assertUndefined('left is not undefined', resize.getCoordinates().left);
		assertUndefined('height is not undefined', resize.getCoordinates().height);
		assertUndefined('top is not undefined', resize.getCoordinates().top);
	
	
	}
	
	,
	"test should move shim when resizing east":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400();
	    var e = this.getEventMock('e', {
			pageX:100, pageY:100
	    });
	    resize.startResize(e);

		var size = {
			x : resize.els.shim.width(), y: resize.els.shim.height()
		};
	
	
	    // when
	    e.pageX = 150;
	    e.pageY = 180;
	    resize.resize(e);
	    var newSize = this.size(resize.els.shim);
	
	    // then
	    var d = resize.dragProperties;
	    assertEquals(50, d.current.x - d.start.x);
	    assertEquals(80, d.current.y - d.start.y);
	    assertEquals(size.x + 50, newSize.x);
	    assertEquals(size.y, newSize.y);
	},

	size:function(el){
		return { x : el.width(), y: el.height() };
	}
	,
	"test should move shim when resizing sout east":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400();
	    var e = this.getEventMock('se', {
			pageX:100, pageY:100
	    });
	    resize.startResize(e);

		var size = {
			x : resize.els.shim.width(), y: resize.els.shim.height()
		};
	
	    e = this.getEventMock('se', {
			pageX:150, pageY:180
	    });
	    // when
	    resize.resize(e);
	    var newSize = this.size(resize.els.shim);
	    // then
	    assertEquals(size.x + 50, newSize.x);
	    assertEquals(size.y + 80, newSize.y);
	}
	
	,
	"test should move shim when resizing north":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400();
	    var e = this.getEventMock('n', {
			pageX:100, pageY:100
	    });
	    resize.startResize(e);

		var coords = this.coordinates(resize.els.shim);

	    // when
	    e.pageX = 150;
	    e.pageY = 180;
	    resize.resize(e);
	
	    var newCoords = this.coordinates(resize.els.shim);
	    // then
	    assertEquals(coords.left, newCoords.left);
	    assertEquals(coords.top + 80, newCoords.top);
	    assertEquals(coords.height - 80, newCoords.height);
	},

	coordinates:function(el){
		var coords = el.offset();
		coords.width = el.width();
		coords.height = el.height();
		return coords;
	}	
	
	,
	"test should move shim when resizing west":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400();
	    var e = this.getEventMock('w', {
			pageX:100, pageY:100
	    });
	    resize.startResize(e);
		var coords = this.coordinates(resize.els.shim);
	    // when
	    e.pageX = 70;
	    e.pageY = 180;
	    resize.resize(e);
	
	    var newCoords = this.coordinates(resize.els.shim);
	    // then
	    var d = resize.dragProperties;
	    assertEquals(-30, d.current.x - d.start.x);
	
	    assertEquals('left is wrong', coords.left - 30, newCoords.left);
	    assertEquals('width is wrong', coords.width + 30, newCoords.width);
	    assertEquals('top is wrong', coords.top, newCoords.top);
	}
	
	,
	"test should set min x when start dragging west":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        maxWidth:600
	    });
	
	    // when
	    var e = this.getEventMock('w', {
			pageX:100, pageY:100
	    });
	    resize.startResize(e);
	
	    // then
	    assertNotUndefined(resize.maxWidth);
	    assertEquals(resize.component.getEl().offset().left - 100, resize.getDragMinX());
	}
	
	,
	"test should set min x when start dragging east":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        minWidth:400
	    });
	
	    // when
	    var e = this.getEventMock('e', {
			pageX:100, pageY:100
	    });
	    resize.startResize(e);
	
	    // then
	    assertNotUndefined(resize.minWidth);
	    assertEquals(resize.component.getEl().offset().left + resize.component.getWidth() - 100, resize.getDragMinX());
	}
	
	,
	"test should set max x when start dragging west":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        minWidth:400
	    });
	
	    // when
	    var e = this.getEventMock('w', {
			pageX:100, pageY:100
	    });
	    resize.startResize(e);
	
	    // then
	    assertEquals(resize.component.getEl().offset().left + 100, resize.getDragMaxX());
	}
	
	,
	"test should set max x when start dragging east":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        maxWidth:600
	    });
	
	    // when
	    var e = this.getEventMock('e', {
			pageX:100, pageY:100
	    });
	    resize.startResize(e);
	
	    // then
	    assertEquals(resize.component.getEl().offset().left + resize.component.getWidth() + 100, resize.getDragMaxX());
	}
	
	
	,
	"test should set min y when start dragging north":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        maxHeight:500
	    });
	
	    // when
	    var e = this.getEventMock('n', {
			pageX:100, pageY:100
	    });
	    resize.startResize(e);
	
	    // then
	    assertNotUndefined(resize.maxHeight);
	    assertEquals(resize.component.getEl().offset().top - 100, resize.getDragMinY());
	}
	
	,
	"test should set min x when start dragging south":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        minHeight:300
	    });
	
	    // when
	    var e = this.getEventMock('s', {
			pageX:100, pageY:100
	    });
	    resize.startResize(e);
	
	    // then
	    assertNotUndefined(resize.minHeight);
	    assertEquals(resize.component.getEl().offset().top + resize.component.getHeight() - 100, resize.getDragMinY());
	}
	
	,
	"test should set max x when start dragging north":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        minHeight:300
	    });
	
	    // when
	    var e = this.getEventMock('n', {
			pageX:100, pageY:100
	    });
	    resize.startResize(e);
	
	    // then
	    assertEquals(resize.component.getEl().offset().top + 100, resize.getDragMaxY());
	}
	
	,
	"test should set max x when start dragging south":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        maxHeight:500
	    });
	
	    // when
	    var e = this.getEventMock('s', {
			pageX:100, pageY:100
	    });
	    resize.startResize(e);
	
	    // then
	    assertEquals(resize.component.getEl().offset().top + resize.component.getHeight() + 100, resize.getDragMaxY());
	}
	
	
	,
	"test should move shim correctly when resizing west and max width is set":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        maxWidth:600
	    });
	    var e = this.getEventMock('w', {
			pageX:300, pageY:300
	    });
	    resize.startResize(e);
	    var coords = this.coordinates(resize.els.shim);
	
	    // when
	    e.pageX = 170;
	    e.pageY = 180;
	
	    resize.resize(e);
	
	    var newCoords = this.coordinates(resize.els.shim);
	    // then
	
	    assertUndefined(resize.getDragMinY());
	    assertUndefined(resize.getDragMaxY());
	    assertEquals('left is wrong', coords.left - 100, newCoords.left);
	    assertEquals('width is wrong', coords.width + 100, newCoords.width);
	    assertEquals('top is wrong', coords.top, newCoords.top);
	}
	
	,
	"test should be able to have no shim":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        maxWidth:600,
	        useShim:false
	    });
	    var e = this.getEventMock('e', {
			pageX:800, pageY:300
	    });
	    resize.startResize(e);
	
	    // when
	    e.pageX += 50;
	    resize.resize(e);
	    resize.stopResize(e);
	    var coordinates = this.coordinates(resize.getEl());
	    // then
	
	    assertUndefined(resize.els.shim);
	    assertEquals(550, coordinates.width);
	
	}
	
	,
	"test should set drag max x when aspect ratio and max height is set":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        preserveAspectRatio:true,
	        maxHeight:480
	    });
	    var e = this.getEventMock('e', {
			pageX:800, pageY:300
	    });
	
	    // when
	    resize.startResize(e);
	
	    // then
	    assertEquals("Wrong max X " + JSON.stringify(resize.dragProperties), 900, resize.getDragMaxX());
	}
	
	,
	"test should set drag min x when aspect ratio and min height is set":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        preserveAspectRatio:true,
	        minHeight:320
	    });
	    var e = this.getEventMock('e', {
			pageX:800, pageY:300
	    });
	
	    // when
	    resize.startResize(e);
	
	    // then
	    assertEquals(700, resize.getDragMinX());
	}
	
	,
	"test should set drag max y when aspect ratio and max width is set":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        preserveAspectRatio:true,
	        maxWidth:600
	    });
	    var e = this.getEventMock('s', {
			pageX:800, pageY:300
	    });
	
	    // when
	    resize.startResize(e);
	
	    // then
	    assertEquals(780, resize.getDragMaxY());
	}
	
	,
	"test should set drag min y when aspect ratio and min width is set":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        preserveAspectRatio:true,
	        minWidth:400
	    });
	    var e = this.getEventMock('s', {
	        page:{
	            x:800, y:300
	        }
	    });
	
	    // when
	    resize.startResize(e);
	
	    // then
	    assertEquals(620, resize.getDragMinY());
	}
	
	,
	"test should be able to preserve aspect ratio when dragging east":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        preserveAspectRatio:true
	    });
	    var e = this.getEventMock('e', {
			pageX:300, pageY:300
	    });
	    resize.startResize(e);
	
	    // when
	    e.pageX += 100;
	    resize.resize(e);
	    var coordinates = resize.getCoordinates();
	
	    // then
	    assertTrue(resize.preserveAspectRatio);
	    assertEquals(1.25, resize.getAspectRatio());
	
	    assertEquals('width is wrong', 600, coordinates.width);
	    assertEquals('height is wrong', 480, coordinates.height);
	    assertUndefined(coordinates.left);
	    assertUndefined(coordinates.top);
	}
	
	
	,
	"test should be able to preserve aspect ratio when dragging west":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        preserveAspectRatio:true
	    });
	    var e = this.getEventMock('w', {
			pageX:300, pageY:300
	    });
	    resize.startResize(e);
	
	    // when
	    e.pageX -= 100;
	    resize.resize(e);
	    var coordinates = resize.getCoordinates();
	
	    // then
	    assertTrue(resize.preserveAspectRatio);
	    assertEquals(1.25, resize.getAspectRatio());
	
	    assertEquals('width is wrong', 600, coordinates.width);
	    assertEquals('height is wrong', 480, coordinates.height);
	    assertEquals('left is wrong', 200, coordinates.left);
	    assertUndefined(coordinates.top);
	}
	
	,
	"test should be able to preserve aspect ratio when dragging south":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        preserveAspectRatio:true
	    });
	    var e = this.getEventMock('s', {
			pageX:300, pageY:300
	    });
	    resize.startResize(e);
	
	    // when
	    e.pageY += 100;
	    resize.resize(e);
	    var coordinates = resize.getCoordinates();
	
	    // then
	    assertEquals('width is wrong', 500 * resize.getAspectRatio(), coordinates.width);
	    assertEquals('height is wrong', 500, coordinates.height);
	    assertUndefined(coordinates.left);
	    assertUndefined(coordinates.top);
	}
	,
	"test should be able to preserve aspect ratio when dragging north":function() {
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        preserveAspectRatio:true
	    });
	    var e = this.getEventMock('n', {
			pageX:300, pageY:300
	    });
	    resize.startResize(e);
	
	    // when
	    e.pageY -= 100;
	    resize.resize(e);
	    var coordinates = resize.getCoordinates();
	
	    // then
	    assertEquals('width is wrong', 500 * resize.getAspectRatio(), coordinates.width);
	    assertEquals('height is wrong', 500, coordinates.height);
	    assertEquals('top is wrong', 200, coordinates.top);
	    assertUndefined(coordinates.left);
	}
	
	
	,
	"test should find relative drag size south east":function(){
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        preserveAspectRatio:true
	    });
	    var e = this.getEventMock('se', {
			pageX:800, pageY:700
	    });
	    resize.startResize(e);
	
	    // when
	    e.pageX = 300;
	    resize.resize(e);
	
	    var expectedArea = (400+500);
	    // then
	    assertEquals(expectedArea, resize.getScalingFactors().sum);
	    assertEquals('sc1', 30, Math.floor(resize.getScaleFactor() *100));
	
	    // when
	    e.pageX = 300 + 250;
	    e.pageY = 300 + 200;
	    resize.resize(e);
	
	    // then
	    assertEquals('sc2', 47, Math.floor(resize.getScaleFactor() *100));
	
	    // when
	    e.pageX = 800;
	    e.pageY = 700;
	    resize.resize(e);
	    assertEquals(1, resize.getScaleFactor());
	}
	
	,
	"test should find relative drag size north east":function(){
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        preserveAspectRatio:true
	    });
	    var e = this.getEventMock('ne', {
			pageX:800, pageY:300
	    });
	    resize.startResize(e);
	
	    // when
	    e.pageX = 900;
	    resize.resize(e);
	
	    // then
	    assertEquals('sc1', 113, Math.floor(resize.getScaleFactor() *100));
	    // when
	    e.pageX = 1200;
	    resize.resize(e);
	
	    // then
	    assertEquals('sc1', 155, Math.floor(resize.getScaleFactor() *100));
	    var shimSize = this.getSize(resize.getShim());
	    assertEquals(Math.round(500*resize.getScaleFactor()), Math.round(shimSize.x));
	    // when
	    e.pageX = 900;
	    e.pageY = 400;
	    resize.resize(e);
	
	    // then
	    assertEquals('sc2', 105, Math.floor(resize.getScaleFactor() *100));
	
	    // when
	    e.pageX = 800;
	    e.pageY = 300;
	    resize.resize(e);
	    assertEquals(1, resize.getScaleFactor());
	},
	
	getSize:function(el){
		return {
			x:el.width(), y: el.height()		
		}
	}
	,
	"test should find relative drag size north west":function(){
	    // given
	    var resize = this.getResize_x300_y300_w500_h400({
	        preserveAspectRatio:true
	    });
	    var e = this.getEventMock('nw', {
	        pageX:300, pageY:300
	    });
	    resize.startResize(e);
	
	    // when
	    e.pageX = 400;
	    resize.resize(e);
	
	    // then
	    assertEquals('sc1', 86, Math.floor(resize.getScaleFactor() *100));
	
	    // when
	    e.pageX = 200;
	    e.pageY = 300;
	    resize.resize(e);
	
	    // then
	    assertEquals('sc2', 113, Math.floor(resize.getScaleFactor() *100));
	
	}
	
	
	
	,
	"test should set max height based on body height when aspect ratio and large max width":function() {
	    // given
	    // bodyHeight is mocked to 1200
	    // bodyWidth is mocked to 1900
	    var resize = this.getResize_x300_y300_w500_h400({
	        preserveAspectRatio:true,
	        maxWidth:4000
	    });
	    var e = this.getEventMock('e', {
	        page:{
	            x:800, y:300
	        }
	    });
	    // when
	    resize.startResize(e);
	
	    var top = 300;
	    var maxHeight = resize.$bHeight() - top;
	    var expectedMax = maxHeight * resize.getAspectRatio();
	
	    // then
	    assertEquals(expectedMax, resize.dragProperties.maxWidth);
	},

	getWin:function () {
		return new ludo.Window();
	},

	getResize_x300_y300_w500_h400:function (config) {
		config = config || {};

		config.component = new ludo.Window({
			left:300, top:300,
			width:500, height:400
		});
		return new ludo.ResizeMock(config)
	},

	getShimCoords:function(resizer){
		return resizer.getShim().getCoordinates();
	},

	getEventMock:function(region, properties) {
	    properties = properties || {};
	    if (properties.pageX === undefined) {
	        properties.pageX = 0;
	    }
	    if (properties.pageY === undefined) {
	        properties.pageY = 0;
	    }
	    var el = $('<div>');
	    el.attr('region', region);
	    return Object.merge(properties, {
	        target:el
	    });
	},

	$bCursor:function(){
		return document.body.style.cursor;
	}

});