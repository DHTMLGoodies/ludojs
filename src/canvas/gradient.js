/**
Class for linear gradients
@namespace canvas
@class ludo.canvas.Gradient
@augments canvas.NamedNode

@param {Object} config
@example
	var gradient = new ludo.canvas.Gradient({
		id:'myGradient'
	});
	gradient.addStop('0%', 'red');
	gradient.addStop('100%', '#FFF', 1);

 */
ludo.canvas.Gradient = new Class({
	Extends:ludo.canvas.NamedNode,
	tagName:'linearGradient',
	stopTags:[],

	/**
	 Add stop point
	 @function addStop
	 @param {String} offset
	 @param {String} stopColor
	 @param {Number|undefined} stopOpacity
	 @return {ludo.canvas.Stop} stop
	 @memberof ludo.canvas.Gradient.prototype
	 @example
		 var gradient = new ludo.canvas.Gradient({
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
		var stopTag = new ludo.canvas.Stop(attr);
		this.append(stopTag);
		this.stopTags.push(stopTag);
		return stopTag;
	},

	/**
	 * Get stop node by index
	 * @function getStop
	 * @param {Number} index
	 * @return {canvas.Stop} stop
	 * @memberof ludo.canvas.Gradient.prototype
	 */
	getStop:function (index) {
		return this.stopTags[index];
	}

});