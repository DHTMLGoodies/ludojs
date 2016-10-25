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
				if(key == 'css'){
					ludo.canvasEngine.css(el, value);
				}
				else if (key.substring(0, 6) == "xlink:") {
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

	addEvents:function(events){
		for(var key in events){
			if(events.hasOwnProperty(key)){
				this.on(key, events[key]);
			}
		}
	},

	on:function (event, fn) {

		switch (event.toLowerCase()) {
			case 'mouseenter':
				ludo.canvasEventManager.addMouseEnter(this, fn);
				break;
			case 'mouseleave':
				ludo.canvasEventManager.addMouseLeave(this, fn);
				break;
            default:
				this._addEvent(event, this.getDOMEventFn(event, fn), this.el);
                this.addEvent(event, fn);
		}
	},
	/**
	 * Add event to DOM element
	 * el is optional, default this.el
	 * @function _addEvent
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
				pageX: (e.pageX != null) ? e.pageX : e.clientX + document.scrollLeft,
				pageY: (e.pageY != null) ? e.pageY : e.clientY + document.scrollTop,
				clientX:(e.pageX != null) ? e.pageX - window.pageXOffset : e.clientX,
				clientY:(e.pageY != null) ? e.pageY - window.pageYOffset : e.clientY,
				event:e
			};
			if (fn) {
				fn.call(this, e, this, fn);
			}
			return false;
		}.bind(this);
	},

	/**
	 * append a new node
	 * @function append
	 * @param {canvas.Element|canvas.Node} node node
	 * @return {canvas.Node} parent
	 */
	append:function (node) {
		this.el.appendChild(node.getEl());
		node.parentNode = this;
		return this;
	},

	parent:function () {
		return this.parentNode;
	},

    show:function(){
        ludo.canvasEngine.show(this.el);
    },

    hide:function(){
        ludo.canvasEngine.hide(this.el);
    },

	setProperties:function(p){
		for(var key in p){
			if(p.hasOwnProperty(key)){
				this.set(key, p[key]);
			}
		}
	},

	set:function (key, value) {
		ludo.canvasEngine.set(this.el, key, value);
	},

	remove:function(key){
		ludo.canvasEngine.remove(this.el, key);
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
        if(y === undefined){
            y = x.y;
            x = x.x;
        }
		ludo.canvasEngine.setTransformation(this.el, 'translate', x + ' ' + y);
	},

	getTranslate:function () {
		return ludo.canvasEngine.getTransformation(this.el, 'translate');
	},

    rotate:function(rotation, x, y){
        ludo.canvasEngine[x !== undefined ? 'rotateAround' : 'rotate'](this.el, rotation, x, y);
    },

	/**
	 * Apply filter to node
	 * @function applyFilter
	 * @param {canvas.Filter} filter
	 */
	applyFilter:function (filter) {
		this.set('filter', filter.getUrl());
	},
	/**
	 * Apply mask to node
	 * @function addMask
	 * @param {canvas.Node} mask
	 */
	applyMask:function (mask) {
		this.set('mask', mask.getUrl());
	},

	/**
	 * Apply clip path to node
	 * @function applyClipPath
	 * @param {canvas.Node} clip
	 */
	applyClipPath:function(clip){
		this.set('clip-path', clip.getUrl());
	},

	/**
	 Create url reference
	 @function url
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
	 * @function text
	 * @param {String} text
	 */
	text:function (text) {
		ludo.canvasEngine.text(this.el, text);
	},
	/**
	 Adds a new child DOM node
	 @function add
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
		this.append(node);
		return node;
	},

	css:function (key, value) {
		if($.type(key) == "string"){
			ludo.canvasEngine.css(this.el, key, value);
		}else{
			this.setStyles(key);
		}
	},

	setStyles:function(styles){
		for(var key in styles){
			if(styles.hasOwnProperty(key)){
				ludo.canvasEngine.css(this.el, key, styles[key]);
			}
		}
	},

	/**
	 * Add css class to SVG node
	 * @function addClass
	 * @param {String} className
	 */
	addClass:function (className) {
		ludo.canvasEngine.addClass(this.el, className);
	},
	/**
	 Returns true if svg node has given css class name
	 @function hasClass
	 @param {String} className
	 @return {Boolean}
	 @example
	 var node = new ludo.canvas.Node('rect', { id:'myId2'});
	 node.addClass('myClass');
	 alert(node.hasClass('myClass'));
	 */
	hasClass:function (className) {
		return ludo.canvasEngine.hasClass(this.el, className);
	},
	/**
	 Remove css class name from css Node
	 @function removeClass
	 @param {String} className
	 @example
	 var node = new ludo.canvas.Node('rect', { id:'myId2'});
	 node.addClass('myClass');
	 node.addClass('secondClass');
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
	 * @function getBBox
	 * @return {Object}
	 */
	getBBox:function () {
		return this.el.getBBox();
	},

	/**
	 * Returns rectangular size of element, i.e. bounding box width - bounding box x and
	 * bounding box width - bounding box y. Values are returned as { x : 100, y : 150 }
	 * where x is width and y is height.
	 * @function getSize
	 * @return {Object} size x and y
	 */
	getSize:function(){
		var b = this.getBBox();
		return {
			x :b.width - b.x,
			y :b.height - b.y
		};
	},

	/**
	 * The nearest ancestor 'svg' element. Null if the given element is the outermost svg element.
	 * @function getCanvas
	 * @return {ludo.canvas.Node.el} svg
	 */
	getCanvas:function () {
		return this.el.ownerSVGElement;
	},
	/**
	 * The element which established the current viewport. Often, the nearest ancestor ‘svg’ element. Null if the given element is the outermost svg element
	 * @function getViewPort
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

	empty:function(){
		ludo.canvasEngine.empty(this.getEl());
	},

	_curtain:undefined,
	curtain:function(config){
		if(this._curtain === undefined){
			this._curtain = new ludo.canvas.Curtain(this, config);
		}
		return this._curtain;
	},

	_animation:undefined,
	animate:function(properties, duration, fps){
		this.animation().animate(properties,duration,fps);
	},

	animation:function(){
		if(this._animation === undefined){
			this._animation = new ludo.canvas.Animation(this.getEl());
		}
		return this._animation;
	},

    toFront:function(){
        ludo.canvasEngine.toFront(this.getEl());
    },

    toBack:function(){
        ludo.canvasEngine.toBack(this.getEl());
    }
});


