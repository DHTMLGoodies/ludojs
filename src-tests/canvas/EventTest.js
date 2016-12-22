TestCase("EventTest", {

	"test should be able to register mouse enter events": function(){
		// given
		var rect = new ludo.svg.Node('g', {
			attr:{
				x:100,y:100,width:200,height:100
			}
		});
		var line = new ludo.svg.Node('line', {
			attr:{
				x1:10,y1:10,x2:100,y2:100
			}
		});
		rect.append(line);

		ludo.canvasEventManager.currentNodeId = rect.getEl().id;
		// then
		assertTrue('Rect and Rect', ludo.canvasEventManager.isInCurrentBranch(rect));
		assertTrue('Line and Rect', ludo.canvasEventManager.isInCurrentBranch(line));

		ludo.canvasEventManager.currentNodeId = line.getEl().id;
		assertFalse('Rect and Line', ludo.canvasEventManager.isInCurrentBranch(rect));

	}

});