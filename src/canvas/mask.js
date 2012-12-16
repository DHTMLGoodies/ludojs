/**
 Class for masking of SVG DOM nodes
 @namespace canvas
 @class Mask
 @constructor
 @param {Object} properties
 @example
	 var mask = new ludo.canvas.Mask({ id : 'Mask' });
	 canvas.adoptDef(mask); // canvas is a ludo.canvas.Canvas object

	 var gr = new ludo.canvas.Gradient({
		 id:'gradient'
	 });
	 gr.addStop('0%', 'white', 0);
	 gr.addStop('100%', 'white', 1);
 	 canvas.adopt(gr);

	 var rect2 = new ludo.canvas.Rect({ x:0,y:0, width:500,height:500, fill:gr });
	 mask.adopt(rect2); // Append rect to mask
	 // create ellipsis with reference to mask
 	 var ellipse = new ludo.canvas.Ellipse({ cx:100, cy:125, rx:50, ry:70,mask:mask });

 */
ludo.canvas.Mask = new Class({
	Extends: ludo.canvas.NamedNode,
	tagName : 'mask'
});