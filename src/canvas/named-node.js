/**
 * Super class for canvas.Circle, canvas.Rect +++
 * @namespace canvas
 * @class NamedNode
 */
ludo.canvas.NamedNode = new Class({
	Extends: ludo.canvas.Node,

	initialize:function (attributes, text) {
		this.parent(this.tagName, attributes, text);
	}

});