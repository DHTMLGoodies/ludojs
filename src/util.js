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

	getNewZIndex:function (view) {
		var ret = ludo.CmpMgr.getNewZIndex();
		if (view.els.parent == document.body) {
			ret += 10000;
		}
		if (view.alwaysInFront) {
			ret += 400000;
		}
		return ret;
	}
};