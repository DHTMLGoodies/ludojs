/**
 * Stop tag used by gradients
 * @namespace canvas
 * @class Stop
 * @extends ludo.canvas.Node
 */
ludo.canvas.Stop = new Class({
	Extends: ludo.canvas.Node,

	initialize:function(config){
		this.parent('stop', config);
	},

	/**
	 Set new offset
	 @method setOffset
	 @param {String} offset
	 @example
	 	gradient.getStop(0).setOffset('10%');
	 */
	setOffset:function(offset){
		this.set('offset', offset);
	},
	/**
	 Set new stop color
	 @method setStopColor
	 @param {String} stopColor
	 @example
	 	gradient.getStop(0).setStopColor('#FFFFFF');
	 */
	setStopColor:function(stopColor){
		this.set('stop-color', stopColor);
	},

	/**
	 * Returns value of offset attribute
	 * @method getOffset
	 * @return {String} offset
	 */
	getOffset:function(){
		return this.get('offset');
	},

	/**
	 * Returns value of stop-color attribute
	 * @method getStopColor
	 * @return {String} stop color
	 */
	getStopColor:function(){
		return this.get('stop-color');
	},

	/**
	 * Set new stop opacity(0 = transparent, 1 = full opacity)
	 * @method setStopOpacity
	 * @param {Number} stopOpacity
	 */
	setStopOpacity:function(stopOpacity){
		this.set('stop-opacity', stopOpacity);
	},

	/**
	 * Returns value of stop-opacity property
	 * @method getStopOpacity
	 * @return {Number} stop opacity
	 */
	getStopOpacity:function(){
		return this.get('stop-opacity');
	}
});