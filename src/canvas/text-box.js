ludo.canvas.TextBox = new Class({
	Extends:ludo.canvas.NamedNode,
	tagName:'text',
	text:undefined,
	css:{
		'line-height':13
	},
	presentationAttributes:['x','y','width','height'],

	initialize:function (config) {
		this.parent(this.getAttributes(config), "");
		this.text = config.text;
		if (config.css)this.css = config.css;

		this.renderText();
	},

	getAttributes:function(config){
		var ret = config.attr || {};
		var p = this.presentationAttributes;
		for(var i=0;i<p.length;i++){
			if(config[p[i]] !== undefined){
				ret[p[i]] = config[p[i]];
			}
		}
		return ret;

	},

	tagsToInsert:function () {
		var tokens = this.text.match(/(<\/?[a-z]+?>)/gmi);


		var index = 0;

		var ret = [];
		for (var i = 0; i < tokens.length; i++) {
			var obj = {
				tag:'tspan',
				text:'',
				properties:undefined
			};
			var pos = this.text.indexOf(tokens[i], index);
			if (pos > index) {
				obj.text = this.text.substr(index, pos - index);
			}
			index = pos;
			ret.push(obj);
		}

		if (index < this.text.length) {
			ret.push({
					tag:'tspan',
					text:this.text.substr(index)
				}
			);
		}

		for(i= 0;i<ret.length;i++){
			ret[i].properties = this.getProperties(ret[i].text);
			ret[i].text = this.stripTags(ret[i].text);
		}



		return ret;
	},

	renderText:function(){
		var tags = this.tagsToInsert();
		for(var i=0;i<tags.length;i++){
			var n = new ludo.canvas.Node(tags[i].tag, tags[i].properties, tags[i].text);

			this.adopt(n);
		}
	},

	getProperties:function (text) {
		var ret = {};
		var tag = text.match(/<([a-z]+?)>/g);
		if(tag){
			switch(tag[0].toLowerCase()){
				case '<b>':
					ret['font-weight'] = 'bold';
					break;
				case '<br>':
					ret['dx'] = 0;
					ret['dy'] = 15;
					break;
			}
		}
		return ret;
	},

	stripTags:function (text) {
		return text.replace(/<\/?[^>]+?>/g, '');
	}

});