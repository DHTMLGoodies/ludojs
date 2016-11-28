/**
 * Stop tag used by gradients
 * @namespace canvas
 * @class ludo.canvas.Stop
 * @augments ludo.canvas.Node
 */
ludo.canvas.Stop = new Class({
	Extends: ludo.canvas.Node,

	initialize:function(config){
		this.parent('stop', config);
	},

	/**
	 Set new offset
	 @function setOffset
	 @param {String} offset
	 @memberof ludo.canvas.Stop.prototype
	 @example
	 	gradient.getStop(0).setOffset('10%');
	 */
	setOffset:function(offset){
		this.set('offset', offset);
	},
	/**
	 Set new stop color
	 @function setStopColor
	 @param {String} stopColor
	 @memberof ludo.canvas.Stop.prototype
	 @example
	 	gradient.getStop(0).setStopColor('#FFFFFF');
	 */
	setStopColor:function(stopColor){
		this.set('stop-color', stopColor);
	},

	/**
	 * Returns value of offset attribute
	 * @function getOffset
	 * @return {String} offset
	 * @memberof ludo.canvas.Stop.prototype
	 */
	getOffset:function(){
		return this.get('offset');
	},

	/**
	 * Returns value of stop-color attribute
	 * @function getStopColor
	 * @return {String} stop color
	 * @memberof ludo.canvas.Stop.prototype
	 */
	getStopColor:function(){
		return this.get('stop-color');
	},

	/**
	 * Set new stop opacity(0 = transparent, 1 = full opacity)
	 * @function setStopOpacity
	 * @param {Number} stopOpacity
	 * @memberof ludo.canvas.Stop.prototype
	 */
	setStopOpacity:function(stopOpacity){
		this.set('stop-opacity', stopOpacity);
	},

	/**
	 * Returns value of stop-opacity property
	 * @function getStopOpacity
	 * @return {Number} stop opacity
	 * @memberof ludo.canvas.Stop.prototype
	 */
	getStopOpacity:function(){
		return this.get('stop-opacity');
	}
});