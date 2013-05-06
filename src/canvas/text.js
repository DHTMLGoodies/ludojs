ludo.canvas.Text = new Class({
	Extends: ludo.canvas.NamedNode,
	tagName : 'text',

	initialize:function(text, attributes){
		this.parent(attributes, text);
		this.fireSize();
	},

	fireSize:function(){
		this.fireEvent('textSize', this.getSize());
	}
});