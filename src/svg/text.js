/**
 * @class ludo.svg.Text
 * @param {String} text
 * @param {Object} config
 * @param {Object} config.css layout properties
 * @param {Number} config.x left position
 * @param {Number} config.y top position
 */
ludo.svg.Text = new Class({
	Extends: ludo.svg.NamedNode,
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
	 * Set text anchor to start, middle, end or inherit
	 * @function textAnchor
	 * @memberof ludo.svg.Text
	 * @param anchor
     */
	textAnchor:function(anchor){
		this.set("text-anchor", anchor);
	}
});