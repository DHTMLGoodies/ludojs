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
	 * @function getMW
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
	 * @function getBW
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
	 * @function getPW
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
	 * @function getMH
	 * @param {Object} el
	 */
	getMH:function (el) {
		this.addId(el);
		var id = el.attr("id");
		if (ludo.dom.cache.MH[id] === undefined) {
			ludo.dom.cache.MH[id] = ludo.dom.getNumericStyle(el, 'margin-top') + ludo.dom.getNumericStyle(el, 'margin-bottom')
		}
		return ludo.dom.cache.MH[id];

	},
	/**
	 * Return Border height (top and bottom) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @function getBH
	 * @param {Object} el
	 */
	getBH:function (el) {
		this.addId(el);
		var id = el.attr("id");
		if (ludo.dom.cache.BH[id] === undefined) {
			ludo.dom.cache.BH[id] = ludo.dom.getNumericStyle(el, 'border-top-width') + ludo.dom.getNumericStyle(el, 'border-bottom-width');
		}
		return ludo.dom.cache.BH[id];
	},
	/**
	 * Return Padding height (top and bottom) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @function getPH
	 * @param {Object} el DOMElement or id of DOMElement
	 */
	getPH:function (el) {
		this.addId(el);
		var id = el.attr("id");
		if (ludo.dom.cache.PH[id] === undefined) {
			ludo.dom.cache.PH[id] = ludo.dom.getNumericStyle(el, 'padding-top') + ludo.dom.getNumericStyle(el, 'padding-bottom');
		}
		return ludo.dom.cache.PH[id];
	},
	getMBPW:function (el) {
		return ludo.dom.getPW(el) + ludo.dom.getMW(el) + ludo.dom.getBW(el);
	},
	getMBPH:function (el) {
		return ludo.dom.getPH(el) + ludo.dom.getMH(el) + ludo.dom.getBH(el);
	},

	addId:function(el){
		if(!el.attr("id"))el.attr("id", String.uniqueID());
	},

	/**
	 * @function clearCacheStyles
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
	 * @function getNumericStyle
	 * @private
	 * @param {Object} el
	 * @param {String} style
	 */
	getNumericStyle:function (el, style) {

		if (!el || !style || !el.css)return 0;
		var val = el.css(style);
		return val && val!='thin' && val!='auto' && val!='medium' ? parseInt(val) : 0;
	},

	isInFamilies:function (el, ids) {
		for (var i = 0; i < ids.length; i++) {
			if (ludo.dom.isInFamily(el, ids[i]))return true;
		}
		return false;
	},

	isInFamily:function (el, id) {
		el = $(el);
		if (el.attr("id") === id)return true;
		return el.parent('#' + id);
	},

    // TODO rename to cls
	addClass:function (el, className) {
		console.info("Use of deprecated ludo.dom.addClass");
		console.trace();
		if (el && !this.hasClass(el, className)) {
			if(el.attr != undefined){
				el.addClass(className);
			}else{
				el.className = el.className ? el.className + ' ' + className : className;
			}
		}
	},

	hasClass:function (el, className) {
		console.info("use of deprecated ludo.dom.hasClass");
		console.trace();
		if(el.attr != undefined)return el.hasClass(className);
		var search = el.attr != undefined ? el.attr("class") : el.className;
		return el && search ? search.split(/\s/g).indexOf(className) > -1 : false;
	},

	removeClass:function (el, className) {
		console.info("use of deprecated ludo.dom.removeClass");
		console.trace();
		el.removeClass(className);
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

	size:function(el){
		return {
			x: el.width(), y: el.height()
		}
	},

	getInnerWidthOf:function (el) {
		return el.width();
		/*
		if (el.style.width && el.style.width.indexOf('%') == -1) {
			return ludo.dom.getNumericStyle(el, 'width');
		}
		return el.offsetWidth - ludo.dom.getPW(el) - ludo.dom.getBW(el);
		*/
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
		b.css('position', 'absolute');

		var width = b.width();
		b.css('position', 'relative');
		var height = b.height();
		

		return {
			x:width + ludo.dom.getMBPW(b) + ludo.dom.getMBPW(el),
			y:height + ludo.dom.getMBPH(b) + ludo.dom.getMBPH(el) + (view.getHeightOfTitleBar ? view.getHeightOfTitleBar() : 0)
		}
	},

	/**
	 * Return measured width of a View
	 * @function getMeasuredWidth
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
		console.info("use of deprecated ludo.dom.create");
		console.trace();
        var el = $('<' + (node.tag || 'div') + '>');
        if(node.cls)el.addClass(node.cls);
        if(node.renderTo)$(node.renderTo).append(el);
        if(node.css){
			el.css(node.css);
          }
        if(node.id)el.attr("id", node.id);
        if(node.html)el.html(node.html);
        return el;

    }
};