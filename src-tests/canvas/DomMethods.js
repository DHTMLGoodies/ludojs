TestCase("DomMethods", {

	"test should have native DOM methods": function(){
		// given
		var v = new ludo.View({
			renderTo:document.body,
			width:1000,
			height:1000
		});

		var path = new ludo.canvas.Path("M 100 100 L 200 200 L 50 300 Z");
		v.getCanvas().append(path);

		var circle = new ludo.canvas.Circle({ cx: 400, cy: 400, r: 50 });
		v.getCanvas().append(circle);

		var rect = new ludo.canvas.Rect({ x: 500, y: 600, width:100,height:100 });
		v.getCanvas().append(rect);
		// when
		var methods = [
			'nearestViewportElement', // Nearest <svg> element
			'farthestViewportElement', // Nearest <svg> element
			'getTotalLength',
			'getPointAtLength', // Nearest <svg> element
			'getPathSegAtLength',
			// 'pathSegList',
			'transform',
			'getBBox',
			'compareDocumentPosition'
		];
		var pathEl = path.getEl();
		// then
		for(var i=0;i<methods.length;i++){
			assertNotUndefined(methods[i], pathEl[methods[i]]);
		}
	},


	getNode:function(){
		// given
		var v = new ludo.View({
			renderTo:document.body,
			width:1000,
			height:1000
		});

		var path = new ludo.canvas.Path("M 100 100 L 200 200 L 50 300 Z");
		path.getEl().setAttribute('transform', 'scale(1)');
		v.getCanvas().append(path);
		return path;
	}



});