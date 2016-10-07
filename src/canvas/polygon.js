/**
 Class for drawing polygons.
 @namespace canvas
 @class Polygon
 @extends canvas.Polyline
 @constructor
 @param {String} points
 @param {canvas.NodeConfig} config
 @example
 	var polyline = new ludo.canvas.Polygon('20,20 40,25 60,40 80,120 120,140 200,180');
 */
ludo.canvas.Polygon = new Class({
	Extends: ludo.canvas.Polyline,
	tagName: 'polygon'
});