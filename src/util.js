ludo.util = {
	type:function (o) {
		return !!o && Object.prototype.toString.call(o).match(/(\w+)\]/)[1];
	},

	isArray:function (obj) {
		return typeof(obj) == 'object' && (obj instanceof Array);
	},

	isObject:function (obj) {
		return typeof(obj) == 'object';
	},

	isBool:function (obj) {
		return typeof(obj) == 'boolean';
	},

	isString:function (obj) {
		return typeof(obj) == 'string';
	},

	isFunction:function (obj) {
		return typeof(obj) === 'function';
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
		return Browser.Platform['android'] ? true : false;
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
	
	disposeView:function(view){
		if (view.getParent()) {
			view.getParent().removeChild(view);
		}
        view.removeEvents();
        view.disposeAllChildren();

		for (var name in view.els) {
			if (view.els.hasOwnProperty(name)) {
				if (view.els[name] && view.els[name].tagName && name != 'parent') {
					view.els[name].dispose();
				}
			}
		}
		view.getEl().dispose();

		ludo.CmpMgr.deleteComponent(view);
		if(view.layoutManager)delete view.layoutManager;
		delete view.els;

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
        return date;
    },

    getDragStartEvent:function () {
        return ludo.util.isTabletOrMobile() ? 'touchstart' : 'mousedown';
    },

    getDragMoveEvent:function () {
        return ludo.util.isTabletOrMobile() ? 'touchmove' : 'mousemove';
    },

    getDragEndEvent:function () {
        return ludo.util.isTabletOrMobile() ? 'touchend' : 'mouseup';
    }
};