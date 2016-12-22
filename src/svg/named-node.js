/**
 * Super class for canvas.Circle, canvas.Rect +++
 * @namespace ludo.canvas
 * @class ludo.svg.NamedNode
 */
ludo.svg.NamedNode = new Class({
	Extends: ludo.svg.Node,

	initialize:function (attributes, text) {
        attributes = attributes || {};
		if(attributes.listeners){
			this.addEvents(attributes.listeners);
			delete attributes.listeners;
		}
		this.parent(this.tagName, attributes, text);
	}
});