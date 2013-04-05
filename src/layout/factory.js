/**
 * Factory class for layout managers
 * @namespace layout
 * @class Factory
 */
ludo.layout.Factory = new Class({

    /**
     * Returns layout manager, a layout.Base or subclass
	 * @method getManager
     * @param {ludo.View} view
     * @return {ludo.layout.Base} manager
     */
	getManager:function(view){
		return new ludo.layout[this.getLayoutClass(view)](view);
	},

    /**
     * Returns correct name of layout class
     * @method getLayoutClass
     * @param {ludo.View} view
     * @return {String} className
     * @private
     */
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
            case 'menu':
                return ['Menu', (view.layout.orientation && view.layout.orientation.toLowerCase()=='horizontal') ? 'Horizontal' : 'Vertical'].join('');
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

    /**
     * Returns valid layout configuration for a view
     * @method getValidLayoutObject
     * @param {ludo.View} view
     * @param {Object} config
     * @return {Object}
     * @private
     */
	getValidLayoutObject:function(view, config){

		view.layout = this.toLayoutObject(view.layout);
		config.layout = this.toLayoutObject(config.layout);

		if(!this.hasLayoutProperties(view, config)){
			return {};
		}

		var ret = this.getMergedLayout(view.layout, config.layout);


		if (typeof ret === 'string') {
			ret = { type:ret }
		}

		ret = this.transferFromView(view, config, ret);

		if(ret.left === undefined && ret.x !== undefined)ret.left = ret.x;
		if(ret.top === undefined && ret.y !== undefined)ret.top = ret.y;

		if (ret.aspectRatio) {
			if (ret.width) {
				ret.height = Math.round(ret.width / ret.aspectRatio);
			} else if (ret.height) {
				ret.width = Math.round(ret.height * ret.aspectRatio);
			}
		}
		
        ret.type = ret.type || 'Base';


		return ret;
	},

	toLayoutObject:function(obj){
		if(!obj)return {};
		if(ludo.util.isString(obj))return { type : obj };
		return obj;
	},

	hasLayoutProperties:function(view, config){
		if(view.layout || config.layout)return true;
		var keys = ['left','top','height','width','weight','x','y'];
		for(var i=0;i<keys.length;i++){
			if(config[keys[i]] !== undefined || view[keys[i]] !== undefined)return true;
		}
		return false;
	},

	transferFromView:function(view, config, ret){
		var keys = ['left','top','width','height','weight','x','y'];
		for(var i=0;i<keys.length;i++){
			if(ret[keys[i]] === undefined && (config[keys[i]] !== undefined || view[keys[i]] !== undefined))ret[keys[i]] = config[keys[i]] || view[keys[i]];
            view[keys[i]] = undefined;
		}
		return ret;
	},

    /**
     * Returned merged layout object, i.e. layout defind on HTML page merged
     * with internal layout defined in class
     * @method getMergedLayout
     * @param {Object} layout
     * @param {Object} mergeWith
     * @return {Object}
     * @private
     */
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