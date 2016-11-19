/*
 * Specification of config object used to create canvas.Node. You will never create
 * any objects of this class. It is used as help and spec only.
 * @namespace canvas
 * @name ludo.canvas.NodeConfig
 * @type {object}
 */
ludo.canvas.NodeConfig = new Class({
	/*
	 * Id of node.
	 * @config id
	 * @type {String}
	 * @optional
	 */
	id:undefined,
	/*
	 Attributes added to node
	 @config attr
	 @type {Object}
	 @example
	 	{
	 		...
	 		attr:{
				x:100,y:200
	 		}
		}
	 */
	attr:undefined,

	/*
	 * canvas.Paint object used for styling
	 * @config paint
	 * @type {canvas.Paint}
	 * @default undefined
	 */
	paint:undefined

});