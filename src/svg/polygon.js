/**
 Class for drawing polygons.
 @namespace ludo.canvas
 @class ludo.svg.Polygon
 @augments canvas.Polyline
 @param {String} points
 @param {canvas.NodeConfig} config
 @example
 	var polyline = new ludo.svg.Polygon('20,20 40,25 60,40 80,120 120,140 200,180');
 */
ludo.svg.Polygon = new Class({
	Extends: ludo.svg.Polyline,
	tagName: 'polygon'
});