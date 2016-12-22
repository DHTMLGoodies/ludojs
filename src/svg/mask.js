/**
 Class for masking of SVG DOM nodes
 @namespace ludo.canvas
 @class ludo.svg.Mask
 
 @param {Object} properties
 @example
	 var mask = new ludo.svg.Mask({ id : 'Mask' });
	 canvas.appendDef(mask); // canvas is a ludo.svg.Canvas object

	 var gr = new ludo.svg.Gradient({
		 id:'gradient'
	 });
	 gr.addStop('0%', 'white', 0);
	 gr.addStop('100%', 'white', 1);
 	 canvas.append(gr);

	 var rect2 = new ludo.svg.Rect({ x:0,y:0, width:500,height:500, fill:gr });
	 mask.append(rect2); // Append rect to mask
	 // create ellipsis with reference to mask
 	 var ellipse = new ludo.svg.Ellipse({ cx:100, cy:125, rx:50, ry:70,mask:mask });

 */
ludo.svg.Mask = new Class({
	Extends: ludo.svg.NamedNode,
	tagName : 'mask'
});