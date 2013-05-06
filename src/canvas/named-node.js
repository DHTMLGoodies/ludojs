/**
 * Super class for canvas.Circle, canvas.Rect +++
 * @namespace canvas
 * @class NamedNode
 */
ludo.canvas.NamedNode = new Class({
	Extends: ludo.canvas.Node,

	initialize:function (attributes, text) {
		if(attributes.listeners){
			this.addEvents(attributes.listeners);
			delete attributes.listeners;
		}
		this.parent(this.tagName, attributes, text);
	}
});