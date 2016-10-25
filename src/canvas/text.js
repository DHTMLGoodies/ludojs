/**
 * @class ludo.canvas.Text
 * @config {String} text
 * @config {Object} config
 * @config {Object} config.css layout properties
 * @config {Number} config.x left position
 * @config {Number} config.y top position
 */
ludo.canvas.Text = new Class({
	Extends: ludo.canvas.NamedNode,
	tagName : 'text',

	initialize:function(text, attributes){
		this.parent(attributes, text);
		this.fireSize();
	},

	fireSize:function(){
		if(this.getEl().parentNode){
			this.fireEvent('textSize', this.getSize());
		}
	},

	/**
	 * Set text anchor to start, middel, end or inherit
	 * @function textAnchor
	 * @memberof ludo.canvas.Text
	 * @param anchor
     */
	textAnchor:function(anchor){
		this.set("text-anchor", anchor);
	}
});