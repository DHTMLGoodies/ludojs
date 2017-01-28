/**
 Specification of a drop point node sent to {{#crossLink "effect.DragDrop/addDropTarget"}}{{/crossLink}}.
 You may add your own properties in addition to the ones below.
 @namespace ludo.effect
 @class ludo.effect.DropPoint

 @param {Object} config
 @example
 var dd = new ludo.effect.DragDrop();
 var el = jQuery('<div>');
 dd.addDropTarget({
 		id:'myDropPoint',
 		el:el,
 		name:'John Doe'
	});
 var el = jQuery('<div>');
 dd.addDropTarget({
		id:'myDropPoint',
		el:el,
		name:'Jane Doe'
	});
 dd.addEvent('enterDropTarget', function(node, dd){
 		if(node.name === 'John Doe'){
 			dd.setInvalid(); // Triggers an invalidDropTarget event
 		}
 	});
 */
ludo.effect.DropPoint = new Class({
    /**
     id of node. This attribute is optional
     @property id
     @type {String}
     @default undefined
     @optional
     @memberof ludo.effect.DropPoint.prototype
     */
    id: undefined,

    /**
     * Reference to dragable DOM node
     * @property el
     * @default undefined
     * @type {String|HTMLDivElement}
     * @memberof ludo.effect.DropPoint.prototype
     */
    el: undefined,

    /**
     Capture regions(north,south, west east) when moving over drop points
     @config {Boolean|undefined} captureRegions
     @optional
     @default false
     @memberof ludo.effect.DropPoint.prototype
     @example
     captureRegions:true
     */
    captureRegions: undefined
});