/**
 * @module Canvas
 */

/**
 Factory for new svg DOM nodes
 @namespace canvas
 @class Node
 @constructor
 @param {String} tag
 @param {Object} properties
 @optional
 @param {String} text
 @optional
 @example
 var paint = new ludo.canvas.Paint({
		'stroke-color' : '#000'
 	});
 var node = new ludo.canvas.Node('rect', { id:'myRect', x:20,y:20,width:100,height:100 , "class": paint, filter:filter });

 or
 @example
 var node = new ludo.canvas.Node('title', {}, 'My title' );

 */
ludo.canvas.Node = new Class({
	Extends:Events,
	el:undefined,
	tagName:undefined,

	/**
	 * Id of node
	 * @config {String} id
	 */
	id:undefined,

	initialize:function (tagName, properties, text) {
		properties = properties || {};
		properties.id = this.id = properties.id || 'ludo-svg-node-' + String.uniqueID();
		if (tagName !== undefined)this.tagName = tagName;
		this.createNode(this.tagName, properties);
		if (text !== undefined) {
			ludo.canvasEngine.text(this.el, text);
		}
	},

	createNode:function (el, properties) {
		if (properties !== undefined) {
			if (typeof el == "string") {
				el = this.createNode(el);
			}
			Object.each(properties, function (value, key) {
				if (value['getUrl'] !== undefined) {
					value = value.getUrl();
				}
				if (key.substring(0, 6) == "xlink:") {
					el.setAttributeNS("http://www.w3.org/1999/xlink", key.substring(6), value);
				} else {
					el.setAttribute(key, value);
				}
			});
		} else {
			el = document.createElementNS("http://www.w3.org/2000/svg", el);
		}

		this.el = el;
		el.style && (el.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
		return el;
	},

	getEl:function () {
		return this.el;
	},

    engine:function(){
        return ludo.canvasEngine;
    },

	addEvent:function (event, fn) {
		switch (event.toLowerCase()) {
			case 'mouseenter':
				ludo.canvasEventManager.addMouseEnter(this, fn);
				break;
			case 'mouseleave':
				ludo.canvasEventManager.addMouseLeave(this, fn);
				break;
			default:
				this._addEvent(event, this.getDOMEventFn(event, fn), this.el);
		}
	},
	/**
	 * Add event to DOM element
	 * el is optional, default this.el
	 * @method _addEvent
	 * @param {String} ev
	 * @param {Function} fn
	 * @param {Object} el
	 * @private
	 */
	_addEvent:(function () {
		if (document.addEventListener) {
			return function (ev, fn, el) {
				if (el == undefined)el = this.el;
				el.addEventListener(ev, fn, false);
			}
		} else {
			return function (ev, fn, el) {
				if (el == undefined)el = this.el;
				el.attachEvent("on" + ev, fn);
			}
		}
	})(),
	getDOMEventFn:function (eventName, fn) {
		return  function (e) {
			e = e || window.event;

			var target = e.target || e.srcElement;
			while (target && target.nodeType == 3) target = target.parentNode;
			target = target['correspondingUseElement'] || target;
			e = {
				target:target,
				page:{
					x:(e.pageX != null) ? e.pageX : e.clientX + document.scrollLeft,
					y:(e.pageY != null) ? e.pageY : e.clientY + document.scrollTop
				},
				client:{
					x:(e.pageX != null) ? e.pageX - window.pageXOffset : e.clientX,
					y:(e.pageY != null) ? e.pageY - window.pageYOffset : e.clientY
				},
				event:e
			};
			if (fn) {
				fn.call(this, e, this, fn);
			}
			return false;
		}.bind(this);
	},

	/**
	 * Adopt a new node
	 * @method adopt
	 * @param {canvas.Element|canvas.Node} node node
	 * @return {canvas.Node} parent
	 */
	adopt:function (node) {
		this.el.appendChild(node.getEl());
		node.parentNode = this;
		return this;
	},

	getParent:function () {
		return this.parentNode;
	},

    show:function(){
        ludo.canvasEngine.show(this.el);
    },

    hide:function(){
        ludo.canvasEngine.hide(this.el);
    },

	set:function (key, value) {
		ludo.canvasEngine.set(this.el, key, value);
	},

	get:function (key) {
		return ludo.canvasEngine.get(this.el, key);
	},

	getTransformation:function (key) {
		return ludo.canvasEngine.getTransformation(this.el, key);
	},

	setTransformation:function (key, value) {
		ludo.canvasEngine.setTransformation(this.el, key, value);
	},

	translate:function (x, y) {
		ludo.canvasEngine.setTransformation(this.el, 'translate', x + ' ' + y);
	},

	getTranslate:function () {
		return ludo.canvasEngine.getTransformation(this.el, 'translate');
	},

	/**
	 * Apply filter to node
	 * @method applyFilter
	 * @param {canvas.Filter} filter
	 */
	applyFilter:function (filter) {
		this.set('filter', filter.getUrl());
	},
	/**
	 * Apply mask to node
	 * @method addMask
	 * @param {canvas.Node} mask
	 */
	applyMask:function (mask) {
		this.set('filter', mask.getUrl());
	},
	/**
	 Create url reference
	 @method url
	 @param {String} key
	 @param {canvas.Node|String} to
	 @example
	 node.url('filter', filterObj); // sets node property filter="url(#&lt;filterObj->id>)"
	 node.url('mask', 'MyMask'); // sets node property mask="url(#MyMask)"
	 */
	url:function (key, to) {
		this.set(key, to['getUrl'] !== undefined ? to.getUrl() : 'url(#' + to + ')');
	},

	href:function (url) {
		ludo.canvasEngine.set(this.el, 'xlink:href', url);
	},
	/**
	 * Update text content of node
	 * @method text
	 * @param {String} text
	 */
	text:function (text) {
		ludo.canvasEngine.text(this.el, text);
	},
	/**
	 Adds a new child DOM node
	 @method add
	 @param {String} tagName
	 @param {Object} properties
	 @param {String} text content
	 @optional
	 @return {ludo.canvas.Node} added node
	 @example
	 var filter = new ludo.canvas.Filter();
	 filter.add('feGaussianBlur', { 'stdDeviation' : 2, result:'blur'  });
	 */
	add:function (tagName, properties, text) {
		var node = new ludo.canvas.Node(tagName, properties, text);
		this.adopt(node);
		return node;
	},

	setStyle:function (key, value) {
		ludo.canvasEngine.setStyle(this.el, key, value);
	},

	/**
	 * Add css class to SVG node
	 * @method addClass
	 * @param {String} className
	 */
	addClass:function (className) {
		ludo.canvasEngine.addClass(this.el, className);
	},
	/**
	 Returns true if svg node has given css class name
	 @method hasClass
	 @param {String} className
	 @return {Boolean}
	 @example
	 var node = new ludo.canvas.Node('rect', { id:'myId2'});
	 ludo.dom.addClass(node, 'myClass');
	 alert(node.hasClass('myClass'));
	 */
	hasClass:function (className) {
		return ludo.canvasEngine.hasClass(this.el, className);
	},
	/**
	 Remove css class name from css Node
	 @method removeClass
	 @param {String} className
	 @example
	 var node = new ludo.canvas.Node('rect', { id:'myId2'});
	 ludo.dom.addClass(node, 'myClass');
	 ludo.dom.addClass(node, 'secondClass');
	 node.removeClass('myClass');
	 */
	removeClass:function (className) {
		ludo.canvasEngine.removeClass(this.el, className);
	},

	getId:function () {
		return this.id;
	},

	getUrl:function () {
		return 'url(#' + this.id + ')';
	},
	/**
	 * Returns bounding box of el as an object with x,y, width and height.
	 * @method getBBox
	 * @return {Object}
	 */
	getBBox:function () {
		return this.el.getBBox();
	},

	/**
	 * The nearest ancestor 'svg' element. Null if the given element is the outermost svg element.
	 * @method getCanvas
	 * @return {ludo.canvas.Node.el} svg
	 */
	getCanvas:function () {
		return this.el.ownerSVGElement;
	},
	/**
	 * The element which established the current viewport. Often, the nearest ancestor ‘svg’ element. Null if the given element is the outermost svg element
	 * @method getViewPort
	 * @return {ludo.canvas.Node.el} svg
	 */
	getViewPort:function () {
		return this.el.viewPortElement;
	},

	scale:function (width, height) {
		ludo.canvasEngine.scale(this.el, width, height);
	},
	setTransformMatrix:function (el, a, b, c, d, e, f) {
		this.setTransformMatrix(this.el, a, b, c, d, e, f);
	},

    getPointAtDegreeOffset:function(from, degrees, size){
        var radians = this.toRadians(degrees);
        var x = Math.cos(radians);
        var y = Math.sin(radians);

        return {
            x : from.x + (size * x),
            y : from.y + (size * y)
        }
    },

    /**
     * Degrees to radians method
     * @method toRad
     * @param degrees
     * @return {Number}
     */
    toRadians:function(degrees){
        return degrees * Math.PI / 180;
    }
});


