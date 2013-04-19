/**
 * Class/Object with DOM utility methods.
 * @class ludo.dom
 *
 */
ludo.dom = {
	cache:{
		PW:{}, PH:{},
		BW:{}, BH:{},
		MW:{}, MH:{}
	},
	/**
	 * Return Margin width (left and right) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @method getMW
	 * @param {Object} el
	 */
	getMW:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.MW[el.id] === undefined) {
			ludo.dom.cache.MW[el.id] = ludo.dom.getNumericStyle(el, 'margin-left') + ludo.dom.getNumericStyle(el, 'margin-right')
		}
		return ludo.dom.cache.MW[el.id];
	},

	/**
	 * Return Border width (left and right) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @method getBW
	 * @param {Object} el DOMElement or id of DOMElement
	 */
	getBW:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.BW[el.id] === undefined) {
			ludo.dom.cache.BW[el.id] = ludo.dom.getNumericStyle(el, 'border-left-width') + ludo.dom.getNumericStyle(el, 'border-right-width');
		}
		return ludo.dom.cache.BW[el.id];
	},
	/**
	 * Return Padding Width (left and right) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @method getPW
	 * @param {Object} el
	 */
	getPW:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.PW[el.id] === undefined) {
			ludo.dom.cache.PW[el.id] = ludo.dom.getNumericStyle(el, 'padding-left') + ludo.dom.getNumericStyle(el, 'padding-right');
		}
		return ludo.dom.cache.PW[el.id];

	},
	/**
	 * Return Margin height (top and bottom) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @method getMH
	 * @param {Object} el
	 */
	getMH:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.MH[el.id] === undefined) {
			ludo.dom.cache.MH[el.id] = ludo.dom.getNumericStyle(el, 'margin-top') + ludo.dom.getNumericStyle(el, 'margin-bottom')
		}
		return ludo.dom.cache.MH[el.id];

	},
	/**
	 * Return Border height (top and bottom) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @method getBH
	 * @param {Object} el
	 */
	getBH:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.BH[el.id] === undefined) {
			ludo.dom.cache.BH[el.id] = ludo.dom.getNumericStyle(el, 'border-top-width') + ludo.dom.getNumericStyle(el, 'border-bottom-width');
		}
		return ludo.dom.cache.BH[el.id];
	},
	/**
	 * Return Padding height (top and bottom) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @method getPH
	 * @param {Object} el DOMElement or id of DOMElement
	 */
	getPH:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.PH[el.id] === undefined) {
			ludo.dom.cache.PH[el.id] = ludo.dom.getNumericStyle(el, 'padding-top') + ludo.dom.getNumericStyle(el, 'padding-bottom');
		}
		return ludo.dom.cache.PH[el.id];
	},
	getMBPW:function (el) {
		return ludo.dom.getPW(el) + ludo.dom.getMW(el) + ludo.dom.getBW(el);
	},
	getMBPH:function (el) {
		return ludo.dom.getPH(el) + ludo.dom.getMH(el) + ludo.dom.getBH(el);
	},

	/**
	 * @method clearCacheStyles
	 * Clear cached padding,border and margins.
	 */
	clearCache:function () {
		ludo.dom.cache = {
			PW:{}, PH:{},
			BW:{}, BH:{},
			MW:{}, MH:{}
		};
	},

	/**
	 * Return numeric style value,
	 * @method getNumericStyle
	 * @private
	 * @param {Object} el
	 * @param {String} style
	 */
	getNumericStyle:function (el, style) {
		if (!el || !style || !el.getStyle)return 0;
		var val = el.getStyle(style);
		return val ? parseInt(val) : 0;
	},

	isInFamilies:function (el, ids) {
		for (var i = 0; i < ids.length; i++) {
			if (ludo.dom.isInFamily(el, ids[i]))return true;
		}
		return false;
	},

	isInFamily:function (el, id) {
		if (el.id === id)return true;
		return el.getParent('#' + id);

	},

    // TODO rename to cls
	addClass:function (el, className) {
		if (el && !this.hasClass(el, className)) {
			el.className = el.className ? el.className + ' ' + className : className;
		}
	},

	hasClass:function (el, className) {
		return el && el.className ? el.className.split(/\s/g).indexOf(className) > -1 : false;
	},

	removeClass:function (el, className) {
		if(el)el.className = el.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
	},

	getParent:function (el, selector) {
		el = el.parentNode;
		while (el && !ludo.dom.hasClass(el, selector))el = el.parentNode;
		return el;
	},

	scrollIntoView:function (domNode, view) {
		var c = view.getEl();
		var el = view.getBody();
		var viewHeight = c.offsetHeight - ludo.dom.getPH(c) - ludo.dom.getBH(c) - ludo.dom.getMBPH(el);

		var pos = domNode.getPosition(el).y;

		var pxBeneathBottomEdge = (pos + 20) - (c.scrollTop + viewHeight);
		if (pxBeneathBottomEdge > 0) {
			el.scrollTop += pxBeneathBottomEdge;
		}

        var pxAboveTopEdge = c.scrollTop - pos;
		if (pxAboveTopEdge > 0) {
			el.scrollTop -= pxAboveTopEdge;
		}
	},

	getInnerWidthOf:function (el) {
		if (el.style.width && el.style.width.indexOf('%') == -1) {
			return ludo.dom.getNumericStyle(el, 'width');
		}
		return el.offsetWidth - ludo.dom.getPW(el) - ludo.dom.getBW(el);
	},

	getInnerHeightOf:function (el) {
		if (el.style.height && el.style.height.indexOf('%') == -1) {
			return ludo.dom.getNumericStyle(el, 'height');
		}
		return el.offsetHeight - ludo.dom.getPH(el) - ludo.dom.getBH(el);
	},

	getTotalWidthOf:function (el) {
		return el.offsetWidth + ludo.dom.getMW(el);
	},

	getWrappedSizeOfView:function (view) {

		var el = view.getEl();
		var b = view.getBody();
		b.style.position = 'absolute';

		var width = b.offsetWidth;
		b.style.position = 'relative';
		var height = b.offsetHeight;

		return {
			x:width + ludo.dom.getMBPW(b) + ludo.dom.getMBPW(el),
			y:height + ludo.dom.getMBPH(b) + ludo.dom.getMBPH(el) + (view.getHeightOfTitleBar ? view.getHeightOfTitleBar() : 0)
		}
	},

	/**
	 * Return measured width of a View
	 * @method getMeasuredWidth
	 * @param {ludo.View} view
	 * @return {Number}
	 */
	getMeasuredWidth:function (view) {
		var el = view.getBody();
		var size = el.measure(function () {
			return this.getSize();
		});
		return size.x + ludo.dom.getMW(el);
	},

    create:function(node){
        var el = document.createElement(node.tag || 'div');
        if(node.cls)ludo.dom.addClass(el, node.cls);
        if(node.renderTo)node.renderTo.appendChild(el);
        if(node.css){
            for(var key in node.css){
                if(node.css.hasOwnProperty(key)){
                    el.style[key] = node.css[key];
                }
            }
        }
        if(node.id)el.id = node.id;
        if(node.html)el.innerHTML = node.html;
        return el;

    }
};