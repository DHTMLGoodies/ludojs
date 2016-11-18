/**
 Specification of a draggable node objects sent to {{#crossLink "effect.Drag/add"}}{{/crossLink}}. You will
 never create objects of this class.
 @namespace ludo.effect
 @class ludo.effect.DraggableNode
 @type {Object|String}
 */
ludo.effect.DraggableNode = new Class({
	/**
	 id of node. This attribute is optional
	 @property id
	 @type {String}
	 @default undefined
	 @optional
	 @example
	 	var dragDrop = new ludo.effect.Drag();
	 	var el = $('<div>');
	 	dragDrop.add({
	 		id: 'myId',
			el : el
	 	});
	 	var ref = dragDrop.getById('myId');
	 Or you can use this code which does the same:
	 @example
	 	var dragDrop = new ludo.effect.Drag();
	 	var el = $('<div>');
	 	el.id = 'myId';
	 	dragDrop.add(el);
	 	var ref = dragDrop.getById('myId');
	 Id's are only important if you need to access nodes later using {{#crossLink "effect.Drag/getById"}}{{/crossLink}}
	 */
	id: undefined,

	/**
	 * Reference to dragable DOM node
	 * @property el
	 * @default undefined
	 * @type {String|HTMLDivElement}
	 */
	el:undefined,
	/**
	 * Reference to handle for dragging. el will only be draggable by dragging the handle.
	 * @property handle
	 * @type {String|HTMLDivElement}
	 * @default undefined
	 * @optional
	 */
	handle:undefined,

	/**
	 * Minimum x position. This is an optional argument. If not set, you will use the params
	 * set when creating the ludo.effect.Drag component if any.
	 * @property minX
	 * @type {Number}
	 * @default undefined
	 * @optional
	 */
	minX:undefined,
	/**
	 * Maximum x position. This is an optional argument. If not set, you will use the params
	 * set when creating the ludo.effect.Drag component if any.
	 * @property maxX
	 * @type {Number}
	 * @default undefined
	 * @optional
	 */
	maxX:undefined,
	/**
	 * Minimum x position. This is an optional argument. If not set, you will use the params
	 * set when creating the ludo.effect.Drag component if any.
	 * @property minY
	 * @type {Number}
	 * @default undefined
	 * @optional
	 */
	minY:undefined,
	/**
	 * Maximum y position. This is an optional argument. If not set, you will use the params
	 * set when creating the ludo.effect.Drag component if any.
	 * @property maxY
	 * @type {Number}
	 * @default undefined
	 * @optional
	 */
	maxY:undefined,
	/**
	 Allow dragging in these directions. This is an optional argument. If not set, you will use the params
	 set when creating the ludo.effect.Drag component if any.
	 @property directions
	 @type {String}
	 @default 'XY'
	 @optional
	 @example
	 	directions:'XY'	//
	 	..
	 	directions:'X' // Only allow dragging along x-axis
	 	..
	 	directions:'Y' // Only allow dragging along y-axis
	 */
	directions:undefined
});