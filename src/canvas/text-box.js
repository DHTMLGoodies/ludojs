ludo.canvas.TextBox = new Class({
	Extends:ludo.canvas.Group,
	tag:'g',
	text:undefined,
	css:{
		'line-height':13
	},
	presentationAttributes:['x','y','width','height'],

	ludoConfig:function (config) {
		config = config || {};
		config.attr = this.getAttributes(config);
		this.parent(config);
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
				tag:'text',
				text:'',
				properties:undefined,
				parent:undefined
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
					tag:'text',
					text:this.text.substr(index)
				}
			);
		}

		for(i= 0;i<ret.length;i++){
			ret[i] = this.getProperties(ret[i]);
			ret[i].text = this.stripTags(ret[i].text);
		}



		return ret;
	},

	renderText:function(){
		var tags = this.tagsToInsert();
		for(var i=0;i<tags.length;i++){
			var n = new ludo.canvas.Node(tags[i].tag, tags[i].properties, tags[i].text);
			if(tags[i].parent)tags[i].parent.adopt(n); else this.adopt(n);
		}
	},

	currentDy : 15,

	getProperties:function (item) {
		var ret = {};
		var tag = item.text.match(/<([a-z]+?)>/g);
		if(tag){
			switch(tag[0].toLowerCase()){
				case '<b>':
					ret['font-weight'] = 'bold';
					break;
				case '<br>':
					ret['dx'] = 0;
					this.currentDy+=15;
					break;
			}
		}

		ret['dy'] = this.currentDy;

		item.properties = ret;

		return item;
	},

	stripTags:function (text) {
		return text.replace(/<\/?[^>]+?>/g, '');
	}

});