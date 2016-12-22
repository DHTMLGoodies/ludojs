/**
Class for linear gradients
@namespace canvas
@class ludo.svg.Gradient
@augments canvas.NamedNode

@param {Object} config
@example
	var gradient = new ludo.svg.Gradient({
		id:'myGradient'
	});
	gradient.addStop('0%', 'red');
	gradient.addStop('100%', '#FFF', 1);

 */
ludo.svg.Gradient = new Class({
	Extends:ludo.svg.NamedNode,
	tagName:'linearGradient',
	stopTags:[],

	/**
	 Add stop point
	 @function addStop
	 @param {String} offset
	 @param {String} stopColor
	 @param {Number|undefined} stopOpacity
	 @return {ludo.svg.Stop} stop
	 @memberof ludo.svg.Gradient.prototype
	 @example
		 var gradient = new ludo.svg.Gradient({
			id:'myGradient'
		 });
		 gradient.addStop('0%', 'red');
		 gradient.addStop('100%', '#FFF', 1);
	 	 canvas.append(gradient);
	 */
	addStop:function (offset, stopColor, stopOpacity) {
		var attr = {
			offset:offset,
			'stop-color':stopColor
		};
		if (stopOpacity !== undefined) {
			if (stopOpacity > 1)stopOpacity = stopOpacity / 100;
			attr['stop-opacity'] = stopOpacity
		}
		var stopTag = new ludo.svg.Stop(attr);
		this.append(stopTag);
		this.stopTags.push(stopTag);
		return stopTag;
	},

	/**
	 * Get stop node by index
	 * @function getStop
	 * @param {Number} index
	 * @return {canvas.Stop} stop
	 * @memberof ludo.svg.Gradient.prototype
	 */
	getStop:function (index) {
		return this.stopTags[index];
	}

});