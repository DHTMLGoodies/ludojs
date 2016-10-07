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
	}
});