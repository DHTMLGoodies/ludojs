/**
 Class for SVG filter effects, example Drop Shadow
 Note! Filters will produce raster graphic, not Vector.
 Note! Filters are not supported by IE 9 and lower. (Support is added to IE10).
 Ref: http://caniuse.com/svg-filters
 @namespace ludo.canvas
 @class ludo.svg.Filter
 @augments canvas.NamedNode
 @param {Object} attributes
 @param {Object} config options
 *
 */
ludo.svg.Filter = new Class({
	Extends:ludo.svg.NamedNode,
	tagName:'filter',
	mergeTags:{},
	mergeTagsOrder : [
		'dropShadow', 'SourceGraphic'
	],

	effectNodes:{
		'dropShadow' : ['feGaussianBlur', 'feOffset']
	},
	nodes:{
		'dropShadow' : undefined
	},

	initialize:function(properties){
		properties = properties || {};
		if( properties.x === undefined)  properties.x = '-40%';
		if( properties.y === undefined)  properties.y = '-40%';
		properties.width = properties.width || '180%';
		properties.height = properties.height || '180%';
		this.parent(properties);
	},
	/**
	 Set drop shadow
	 @function setDropShadow
	 @param {Object} properties
	 @memberof ludo.svg.Filter.prototype
	 @example
	 	filter.setDropShadow({
	 		x: 2, y: 2, // Offset
	 		deviation: 2, // blur
	 		color : '#000'
	 	});
	 */
	setDropShadow:function (properties) {
		var nodes = this.getNodesForEffect('dropShadow');
		var blur = nodes['feGaussianBlur'];
		blur.set('in', 'SourceAlpha');
		blur.set('result', 'dropShadowBlur');
		blur.set('stdDeviation', properties.deviation);

		var o = nodes['feOffset'];
		o.set('dx', properties.x || 2);
		o.set('dy', properties.y || 2);
		o.set('in', 'dropShadowBlur');
		o.set('result', 'dropShadow');

	},



	getNodesForEffect:function(effect){
		var n = this.nodes[effect];
		if(n === undefined){
			n = {};
			var keys = this.effectNodes[effect];
			for(var i=0;i<keys.length;i++){
				n[keys[i]] = new ludo.svg.Node(keys[i]);
				this.append(n[keys[i]]);
			}
			this.addFeMergeNode('SourceGraphic');
			this.addFeMergeNode(effect);

		}
		return n;
	},

	updateMergeTag:function () {
		var m = this.getMergeTag();
		var o = this.mergeTagsOrder;
		for(var i=0;i<o.length;i++){
			if(this.mergeTags[o[i]] !== undefined){
				this.mergeTags[o[i]].toFront();
			}
		}
		m.toFront();
	},
	mergeTag:undefined,
	getMergeTag:function () {
		if (this.mergeTag === undefined) {
			this.mergeTag = new ludo.svg.Node('feMerge');
			this.append(this.mergeTag);

		}
		return this.mergeTag;
	},

	/**
	 * Adds a new feMergeNode DOM node to the feMerge node
	 * @function addFeMergeNode
	 * @param {String} key
	 * @return {canvas.Node} feMergeNode
	 * @memberof ludo.svg.Filter.prototype
	 */
	addFeMergeNode:function (key) {
		if (this.mergeTags[key] === undefined) {
			this.mergeTags[key] = new ludo.svg.Node('feMergeNode', { "in":key });
			this.getMergeTag().append(this.mergeTags[key]);
			this.updateMergeTag();
		}
		return this.mergeTags[key];
	}
});