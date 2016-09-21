ludo.util = {

	types:{},

	isIe:function(){
		return navigator.appName == 'Microsoft Internet Explorer';
	},

	isArray:function (obj) {
		return  ludo.util.type(obj) == 'array';
	},

	isObject:function (obj) {
		return ludo.util.type(obj) === 'object';
	},

	isString:function (obj) {
		return ludo.util.type(obj) === 'string';
	},

	isFunction:function (obj) {
		return ludo.util.type(obj) === 'function';
	},

	argsToArray:function(arguments){
		return Array.prototype.slice.call(arguments);
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			ludo.util.types[ ludo.util.types.toString.call(obj) ] || "object" :
			typeof obj;
	},

    isLudoJSConfig:function(obj){
        return obj.initialize===undefined && obj.type;
    },

	tabletOrMobile:undefined,

	isTabletOrMobile:function () {
		if (ludo.util.tabletOrMobile === undefined) {
			ludo.util.tabletOrMobile = this.isIpad() || this.isIphone() || this.isAndroid();
		}
		return ludo.util.tabletOrMobile;
	},

	isIpad:function () {
		return navigator.platform.indexOf('iPad') >= 0;
	},

	isIphone:function () {
		return navigator.platform.indexOf('iPhone') >= 0;
	},

	isAndroid:function () {
		return navigator.platform.indexOf('android') >= 0;
	},

	cancelEvent:function () {
		return false;
	},

	log:function (what) {
		if (window['console']) {
			console.log(what);
		}
	},

    warn:function(what){
        if(window['console']){
            console.warn(what);
        }
    },

	getNewZIndex:function (view) {
		var ret = ludo.CmpMgr.getNewZIndex();
		if (view.renderTo == document.body && view.els.container.style.position==='absolute') {
			ret += 10000;
		}
		if (view.alwaysInFront) {
			ret += 400000;
		}
		return ret;
	},

	/**
	 * Dispose LudoJS components
	 * @method dispose
	 * @param {Core} view
	 */
	dispose:function(view){
		if (view.getParent()) {
			view.getParent().removeChild(view);
		}
        view.removeEvents();

		this.disposeDependencies(view.dependency);

        view.disposeAllChildren();

		for (var name in view.els) {
			if (view.els.hasOwnProperty(name)) {
				if (view.els[name] && view.els[name].tagName && name != 'parent') {
					view.els[name].dispose();
					if(view.els[name].removeEvents)view.els[name].removeEvents();
				}
			}
		}

		ludo.CmpMgr.deleteComponent(view);

		delete view.els;
	},

	disposeDependencies:function(deps){
		for(var key in deps){
			if(deps.hasOwnProperty(key)){
				if(deps[key].removeEvents)deps[key].removeEvents();
				if(deps[key].dispose){
					deps[key].dispose();
				}else if(deps[key].dependency && deps[key].dependency.length){
					ludo.util.disposeDependencies(deps[key].dependency);
				}
				delete deps[key];
			}
		}

	},
	
    parseDate:function(date, format){
        if(ludo.util.isString(date)){
            var tokens = format.split(/[^a-z%]/gi);
            var dateTokens = date.split(/[\.\-\/]/g);
            var dateParts = {};
            for(var i=0;i<tokens.length;i++){
                dateParts[tokens[i]] = dateTokens[i];
            }
            dateParts['%m'] = dateParts['%m'] ? dateParts['%m'] -1 : 0;
            dateParts['%h'] = dateParts['%h'] || 0;
            dateParts['%i'] = dateParts['%i'] || 0;
            dateParts['%s'] = dateParts['%s'] || 0;
            return new Date(dateParts['%Y'], dateParts['%m'], dateParts['%d'], dateParts['%h'], dateParts['%i'], dateParts['%s']);
        }
        return ludo.util.isString(date) ? '' : date;
    },

    getDragStartEvent:function () {
        return ludo.util.isTabletOrMobile() ? 'touchstart' : 'mousedown';
    },

    getDragMoveEvent:function () {
        return ludo.util.isTabletOrMobile() ? 'touchmove' : 'mousemove';
    },

    getDragEndEvent:function () {
        return ludo.util.isTabletOrMobile() ? 'touchend' : 'mouseup';
    },

    supportsSVG:function(){
        return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg')['createSVGRect'];
    }
};

var ludoUtilTypes = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
for(var i=0;i<ludoUtilTypes.length;i++){
	ludo.util.types[ "[object " + ludoUtilTypes[i] + "]" ] = ludoUtilTypes[i].toLowerCase();
}
