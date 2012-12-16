ludo.layout.Factory = new Class({

	getManager:function(view){
		return new ludo.layout[this.getLayoutClass(view)](view);
	},

	getLayoutClass:function(view){
		if(!view.layout || !view.layout.type)return 'Base';

		switch(view.layout.type.toLowerCase()){
			case 'relative':
				return 'Relative';
			case 'fill':
				return 'Fill';
			case 'card':
				return 'Card';
			case 'grid':
				return 'Grid';
			case 'tabs':
			case 'tab':
				return 'Tab';
			case 'column':
			case 'cols':
				return 'LinearHorizontal';
			case 'popup':
				return 'Popup';
			case 'rows':
			case 'row':
				return 'LinearVertical';
			case 'linear':
				return ['Linear', (view.layout.orientation && view.layout.orientation.toLowerCase()=='horizontal') ? 'Horizontal' : 'Vertical'].join('');
			default:
				return 'Base';
		}
	},

	getValidLayoutObject:function(view, config){
		var ret;
		if(view.layout === undefined && config.layout === undefined && view.weight === undefined && config.weight === undefined && config.left===undefined)return {};
		if(config.layout !== undefined){
			if(view.layout !== undefined)config.layout = this.getMergedLayout(view.layout, config.layout);
			ret = config.layout;
		}else{
			ret = view.layout || { type : 'Base' };
		}

		if (typeof ret === 'string') {
			ret = { type:ret }
		}

		if(ret.width === undefined)ret.width = config.width || view.width;
		if(ret.height === undefined)ret.height = config.height || view.height;
		if(ret.weight === undefined)ret.weight = config.weight || view.weight;
		if(ret.type === undefined)ret.type = 'Base';
		return ret;
	},

	getMergedLayout:function(layout, mergeWith){
		for(var key in mergeWith){
			if(mergeWith.hasOwnProperty(key)){
				layout[key] = mergeWith[key];
			}
		}
		return layout;
	}
});

ludo.layoutFactory = new ludo.layout.Factory();