/**
 Class for creating SVG DOM Nodes
 @namespace ludo.canvas
 @class ludo.canvas.Node

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
    Extends: Events,
    el: undefined,
    tagName: undefined,
    id: undefined,

    mat: undefined,

    dirty: undefined,

    _bbox: undefined,

    _attr: undefined,

    classNameCache:[],

    /*
     * Transformation cache
     * @property tCache
     * @type {Object}
     * @private
     */
    tCache:{},
    /*
     * Internal cache
     * @property {Object} tCacheStrings
     * @private
     */
    tCacheStrings:undefined,
    


    initialize: function (tagName, properties, text) {

        this._attr = {};

        properties = properties || {};
        properties.id = this.id = properties.id || 'ludo-svg-node-' + String.uniqueID();
        if (tagName !== undefined)this.tagName = tagName;
        this.createNode(this.tagName, properties);
        if (text !== undefined) {
            this.text(text);
        }

        this.mat = {
            translate: [0, 0],
            _translate: [0, 0],
            rotate: undefined,
            scale: undefined,
            skewX: undefined,
            skewY: undefined
        };
    },

    createNode: function (el, properties) {
        if (properties !== undefined) {
            if (typeof el == "string") {
                el = this.createNode(el);
            }
            var that = this;
            Object.each(properties, function (value, key) {
                if (value['getUrl'] !== undefined) {
                    value = value.getUrl();
                }
                if (key == 'css') {
                    ludo.svg.css(el, value);
                }
                else if (key.substring(0, 6) == "xlink:") {
                    el.setAttributeNS("http://www.w3.org/1999/xlink", key.substring(6), value);
                } else {
                    el.setAttribute(key, value);
                    that._attr[key] = value;
                }
            });
        } else {
            el = document.createElementNS("http://www.w3.org/2000/svg", el);
        }
        this.el = el;
        el.style && (el.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
        return el;
    },

    getEl: function () {
        return this.el;
    },

    engine: function () {
        return ludo.svg;
    },

    addEvents: function (events) {
        for (var key in events) {
            if (events.hasOwnProperty(key)) {
                this.on(key, events[key]);
            }
        }
    },

    on: function (event, fn) {

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
     * @memberof ludo.canvas.Node.prototype
     */
    _addEvent: (function () {
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
    getDOMEventFn: function (eventName, fn) {
        return function (e) {
            e = e || window.event;

            var target = e.target || e.srcElement;
            while (target && target.nodeType == 3) target = target.parentNode;
            target = target['correspondingUseElement'] || target;
            e = {
                target: target,
                pageX: (e.pageX != null) ? e.pageX : e.clientX + document.scrollLeft,
                pageY: (e.pageY != null) ? e.pageY : e.clientY + document.scrollTop,
                clientX: e.offsetX != undefined ? e.offsetX : (e.pageX != null) ? e.pageX - window.pageXOffset : e.clientX,
                clientY: e.offsetY != undefined ? e.offsetY : (e.pageY != null) ? e.pageY - window.pageYOffset : e.clientY,
                event: e
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
     * @param {canvas.View|canvas.Node} node node
     * @return {canvas.Node} parent
     * @memberof ludo.canvas.Node.prototype
     */
    append: function (node) {
        this.el.appendChild(node.getEl());
        node.parentNode = this;
        return this;
    },

    parent: function () {
        return this.parentNode;
    },

    show: function () {
        this.css('display','');
    },

    hide: function () {
        this.css('display','none');
    },

    isHidden: function () {
        return this.css('display') == 'none';
    },

    setProperties: function (p) {
        for (var key in p) {
            if (p.hasOwnProperty(key)) {
                this.set(key, p[key]);
            }
        }
    },

    attr: function (key, value) {
        if (arguments.length == 1)return this.get(key);
        this.set(key, value);
    },

    set: function (key, value) {
        this._attr[key] = value;
        this.dirty = true;

        if (key.substring(0, 6) == "xlink:") {
            if(value['id']!==undefined)value = '#' + value.getId();
            this.el.setAttributeNS("http://www.w3.org/1999/xlink", key.substring(6), value);
        } else {
            if(value['id']!==undefined)value = 'url(#' + value.getId() + ')';
            this.el.setAttribute(key, value);
        }
    },

    remove: function (key) {
        ludo.svg.remove(this.el, key);
    },

    get: function (key) {
        if (key.substring(0, 6) == "xlink:") {
            return this.el.getAttributeNS("http://www.w3.org/1999/xlink", key.substring(6));
        } else {
            return this.el.getAttribute(key);
        }
    },

    getTransformation: function (key) {
        return ludo.svg.getTransformation(this.el, key);
    },

    setTransformation: function (key, value) {
        var id = this._attr['id'];
        this.buildTransformationCacheIfNotExists();
        this.updateTransformationCache(key, value);
        this.set('transform', this.getTransformationAsText());
    },

    getTransformationAsText:function(id){
        if(this.tCacheStrings === undefined && this.tCache!==undefined){
            this.buildCacheString();
        }
        return this.tCacheStrings;
    },

    buildCacheString:function(){
        this.tCacheStrings= '';
        jQuery.each(this.tCache, function(key, value){
            this.tCacheStrings+= key + '(' + value.values.join(' ') + ') ';
        }.bind(this));
        this.tCacheStrings = this.tCacheStrings.trim();
    },

    buildTransformationCacheIfNotExists:function () {
        if (!this.hasTransformationCache()) {
            this.buildTransformationCache();
        }
    },

    buildTransformationCache:function () {


        this.tCache = {};
        var keys = this.getTransformationKeys();

        for (var i = 0; i < keys.length; i++) {
            var values = this.getTransformationValues(keys[i]);
            this.tCache[keys[i]] = {
                values:values,
                readable:this.getValidReturn(keys[i], values)
            };
        }
    },

    getValidReturn:function (transformation, values) {
        var ret = {};
        switch (transformation) {
            case 'skewX':
            case 'skewY':
                ret = values[0];
                break;
            case 'rotate':
                ret.degrees = values[0];
                ret.cx = values[1] ? values[1] : 0;
                ret.cy = values[2] ? values[2] : 0;
                break;
            default:
                ret.x = parseFloat(values[0]);
                ret.y = values[1] ? parseFloat(values[1]) : ret.x;

        }
        return ret;
    },

    getTransformationValues:function (key) {
        var ret = [];
        key = key.toLowerCase();
        var t = (this.get('transform') || '').toLowerCase();
        var pos = t.indexOf(key);
        if (pos >= 0) {
            t = t.substr(pos);
            var start = t.indexOf('(') + 1;
            var end = t.indexOf(')');
            var tr = t.substring(start, end);
            tr = tr.replace(/,/g, ' ');
            tr = tr.replace(/\s+/g, ' ');
            return tr.split(/[,\s]/g);
        }
        return ret;
    },

    getTransformationKeys:function () {
        var ret = [];
        var t = this.get('transform') || '';

        var tokens = t.split(/\(/g);
        for (var i = 0; i < tokens.length-1; i++) {
            ret.push(tokens[i].replace(/[^a-z]/gi, ''));
        }
        return ret;
    },

    updateTransformationCache:function (transformation, value) {
        value = value.toString();
        if (isNaN(value)) {
            value = value.replace(/,/g, ' ');
            value = value.replace(/\s+/g, ' ');
        }
        var values = value.split(/\s/g);
        this.tCache[transformation] = {
            values:values,
            readable:this.getValidReturn(transformation, values)
        };
        this.tCacheString = undefined;
    },

    hasTransformationCache:function (id) {
        return this.tCache[id] !== undefined;
    },

    commitTranslation: function () {
        this.mat._translate[0] = this.mat.translate[0];
        this.mat._translate[1] = this.mat.translate[1];
    },

    getTranslate: function () {
        return this._getMatrix().getTranslate();
    },

    /**
     * Apply filter to node
     * @function applyFilter
     * @param {canvas.Filter} filter
     * @memberof ludo.canvas.Node.prototype
     */
    applyFilter: function (filter) {
        this.set('filter', filter.getUrl());
    },
    /**
     * Apply mask to node
     * @function addMask
     * @param {canvas.Node} mask
     * @memberof ludo.canvas.Node.prototype
     */
    applyMask: function (mask) {
        this.set('mask', mask.getUrl());
    },

    /**
     * Apply clip path to node
     * @function applyClipPath
     * @param {canvas.Node} clip
     * @memberof ludo.canvas.Node.prototype
     */
    applyClipPath: function (clip) {
        this.set('clip-path', clip.getUrl());
    },

    /**
     Create url reference
     @function url
     @param {String} key
     @memberof ludo.canvas.Node.prototype
     @param {canvas.Node|String} to
     @example
     node.url('filter', filterObj); // sets node property filter="url(#&lt;filterObj->id>)"
     node.url('mask', 'MyMask'); // sets node property mask="url(#MyMask)"
     */
    url: function (key, to) {
        this.set(key, to['getUrl'] !== undefined ? to.getUrl() : 'url(#' + to + ')');
    },

    href: function (url) {
        ludo.svg.set(this.el, 'xlink:href', url);
    },
    /**
     * Update text content of node
     * @function text
     * @param {String} text
     * @memberof ludo.canvas.Node.prototype
     */
    text: function (text) {
        this.el.textContent = text;
    },
    /**
     Adds a new child DOM node
     @function add
     @param {String} tagName
     @param {Object} properties
     @param {String} text content
     @optional
     @return {ludo.canvas.Node} added node
     @memberof ludo.canvas.Node.prototype
     @example
     var filter = new ludo.canvas.Filter();
     filter.add('feGaussianBlur', { 'stdDeviation' : 2, result:'blur'  });
     */
    add: function (tagName, properties, text) {
        var node = new ludo.canvas.Node(tagName, properties, text);
        this.append(node);
        return node;
    },

    css: function (key, value) {
        if(arguments.length == 1 && jQuery.type(key) == 'string'){
            return this.el.style[String.camelCase(key)];
        }
        else if(arguments.length == 1){
            var el = this.el;
            $.each(key, function(attr, val){
                el.style[String.camelCase(attr)] = val;
            });
        }else{
            this.el.style[String.camelCase(key)] = value;
        }
    },

    /**
     * Add css class to SVG node
     * @function addClass
     * @param {String} className
     * @memberof ludo.canvas.Node.prototype
     */
    addClass: function (className) {
        if(!this.hasClass(className)){
            this.classNameCache.push(className);
            this.updateNodeClassNameById();
        }
        var cls = this.el.getAttribute('class');
        if(cls){
            cls = cls.split(/\s/g);
            if(cls.indexOf(className)>=0)return;
            cls.push(className);
            this.set('class', cls.join(' '));
        }else{
            this.set('class', className);
        }
    },
    /**
     Returns true if svg node has given css class name
     @function hasClass
     @param {String} className
     @return {Boolean}
     @memberof ludo.canvas.Node.prototype
     @example
     var node = new ludo.canvas.Node('rect', { id:'myId2'});
     node.addClass('myClass');
     alert(node.hasClass('myClass'));
     */
    hasClass:function(className){
        if(!this.classNameCache){
            var cls = this.el.getAttribute('class');
            if(cls){
                this.classNameCache = cls.split(/\s/g);
            }else{
                this.classNameCache = [];
            }
        }
        return this.classNameCache.indexOf(className)>=0;
    },

    /**
     Remove css class name from css Node
     @function removeClass
     @param {String} className
     @memberof ludo.canvas.Node.prototype
     @example
     var node = new ludo.canvas.Node('rect', { id:'myId2'});
     node.addClass('myClass');
     node.addClass('secondClass');
     node.removeClass('myClass');
     */
    removeClass:function(className){
        if(this.hasClass(className)){
            var id = this._attr['id'];
            this.classNameCache.erase(className);
            this.updateNodeClassNameById();
        }
    },

    updateNodeClassNameById:function(){
        this.set('class', this.classNameCache.join(' '));
    },

    getId: function () {
        return this.id;
    },

    getUrl: function () {
        return 'url(#' + this.id + ')';
    },

    position: function () {
        var bbox = this.getBBox();

        if (this.tagName == 'g') {
            if(this._matrix != undefined){
                var translate = this._matrix.getTranslate();
                return {
                    left: translate[0],
                    top: translate[1]
                }
            }else{
                return { left:0, top:0 };
            }

        }

        return {
            left: bbox.x + this.mat.translate[0],
            top: bbox.y + this.mat.translate[1]
        }
    },

    offset: function () {
        var pos = this.position();

        var p = this.parentNode;
        while (p && p.tagName != 'svg') {
            var parentPos = p.position();
            pos.left += parentPos.left;
            pos.top += parentPos.top;
            p = p.parentNode;
        }

        return pos;


    },

    /**
     * Returns bounding box of el as an object with x,y, width and height.
     * @function getBBox
     * @return {Object}
     * @memberof ludo.canvas.Node.prototype
     */
    getBBox: function () {

        if (this.tagName == 'g') {
            return this.el.getBBox();
        }
        if (this._bbox == undefined || this.dirty) {
            var attr = this._attr;

            switch (this.tagName) {
                case 'rect':
                    this._bbox = {
                        x: attr.x,
                        y: attr.y,
                        width: attr.width,
                        height: attr.height
                    };
                    break;
                case 'circle':
                    this._bbox = {
                        x: attr.cx - attr.r,
                        y: attr.cy - attr.r,
                        width: attr.r * 2,
                        height: attr.r * 2
                    };
                    break;
                case 'ellipse':
                    this._bbox = {
                        x: attr.cx - attr.rx,
                        y: attr.cy - attr.ry,
                        width: attr.rx * 2,
                        height: attr.ry * 2
                    };
                    break;
                case 'path':
                    this._setBBoxOfPath('d');
                    break;
                case 'polyline':
                case 'polygon':
                    this._setBBoxOfPath('points');
                    break;
                default:
                    this._bbox = {x: 0, y: 0, width: 0, height: 0};


            }
        }

        return this._bbox;
    },

    _setBBoxOfPath:function(property){
        var p = this._attr[property];
        p = p.replace(/,/g, ' ');
        p = p.replace(/([a-z])/g, '$1 ');
        p = p.replace(/\s+/g, ' ');

        if(property == 'd'){

            if(this.el.getBoundingClientRect != undefined){
                var r = this.el.getBoundingClientRect();
                if(r != undefined){
                    this._bbox = {
                        x: r.left, y: r.top,
                        width: r.width,
                        height: r.height
                    };
                    return;
                }
            }
        }

        p = p.replace(/[^0-9\.\s]/g, ' ')
        p = p.replace(/\s+/g, ' ');


        p = p.trim();
        var points = p.split(/\s/g);
        var minX, minY, maxX, maxY;
        for (var i = 0; i < points.length; i += 2) {
            var x = parseInt(points[i]);
            var y = parseInt(points[i + 1]);

            if (minX == undefined || x < minX)minX = x;
            if (maxX == undefined || x > maxX)maxX = x;
            if (minY == undefined || y < minY)minY = y;
            if (maxY == undefined || y > maxY)maxY = y;
        }

        this._bbox = {
            x: minX, y: minY,
            width: maxX - minX,
            height: maxY - minY
        };


        console.log(p);

        console.log( this._bbox );

    },

    /**
     * Returns rectangular size of element, i.e. bounding box width - bounding box x and
     * bounding box width - bounding box y. Values are returned as { x : 100, y : 150 }
     * where x is width and y is height.
     * @function getSize
     * @return {Object} size x and y
     * @memberof ludo.canvas.Node.prototype
     */
    getSize: function () {
        var b = this.getBBox();
        return {
            x: b.width - b.x,
            y: b.height - b.y
        };
    },

    /**
     * The nearest ancestor 'svg' element. Null if the given element is the outermost svg element.
     * @function getCanvas
     * @return {ludo.canvas.Node.el} svg
     * @memberof ludo.canvas.Node.prototype
     */
    getCanvas: function () {
        return this.el.ownerSVGElement;
    },
    /**
     * The element which established the current viewport. Often, the nearest ancestor ‘svg’ element. Null if the given element is the outermost svg element
     * @function getViewPort
     * @return {ludo.canvas.Node.el} svg
     * @memberof ludo.canvas.Node.prototype
     */
    getViewPort: function () {
        return this.el.viewPortElement;
    },

    getRotate:function(){
        return this._getMatrix().getRotation();
    },

    scale: function (x, y) {
        this.mat.scale = [x, y];
        this.updateMatrix();
        // ludo.svg.scale(this.el, width, height);
    },

    setRotate:function(rotation, x, y){
        this._getMatrix().setRotation(rotation, x,y);
    },

    rotate: function (rotation, x, y) {
        this._getMatrix().rotate(rotation, x,y);
    },

    setTranslate:function(x,y){
        this._getMatrix().setTranslate(x,y);
    },
    
    translate: function (x, y) {
        this._getMatrix().translate(x,y);

    },

    _matrix:undefined,
    _getMatrix:function(){
        if(this._matrix == undefined){
            this._matrix = new ludo.canvas.Matrix(this);
        }
        return this._matrix;
    },


    updateMatrix: function () {

        var m = this.getMatrix();

        console.log(m);
        /**
         *  this.mat = {
            translate: undefined,
            rotate: undefined,
            scale: undefined,
            skewX: undefined,
            skewY: undefined
        };

         */
        if (this.mat.translate)m = m.translate(this.mat.translate[0], this.mat.translate[1]);
        if (this.mat.scale)m = m.scale(this.mat.scale[0], this.mat.scale[1]);

        this.getTransformObject().setMatrix(m);
    },

    getTransformObject:function(){
        if(this.el.transform.baseVal.numberOfItems ==0){
            var owner;
            if(this.el.ownerSVGElement){
                owner = this.el.ownerSVGElement;
            }else{
                owner = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
            }
            var t = owner.createSVGTransform();
            this.el.transform.baseVal.appendItem(t);
        }
        return this.el.transform.baseVal.getItem(0);
    },

    empty: function () {
        this.el.textContent = '';
    },

    _curtain: undefined,
    curtain: function (config) {
        if (this._curtain === undefined) {
            this._curtain = new ludo.canvas.Curtain(this, config);
        }
        return this._curtain;
    },

    /**
     * Animate SVG node
     * @param {Object} properties Properties to animate, example: { x: 100, width: 100 }
     * @param {Number} duration Duration in milliseconds(1/1000s)
     * @param {Function} easing Reference to ludo.canvas.easing easing function, example: ludo.canvas.easing.linear
     * @param {Function} complete Function to execute on complete
     * @param {Function} stepFn Function executed after each animation step
     * @memberof ludo.canvas.Node.prototype
     */
    animate: function (properties, duration, easing, complete, stepFn) {
        ludo.canvasAnimation.fn(this, properties, duration, easing, complete, stepFn);
    },

    _animation: undefined,

    animateOld: function (properties, duration, fps) {
        this.animation().animate(properties, duration, fps);
    },

    animation: function () {
        if (this._animation === undefined) {
            this._animation = new ludo.canvas.Animation(this.getEl());
        }
        return this._animation;
    },

    toFront:function () {
        if (Browser['ie'])this._toFront.delay(20, this); else this._toFront();
    },

    _toFront:function () {
        this.el.parentNode.appendChild(this.el);
    },

    toBack:function () {
        if (Browser['ie']) this._toBack.delay(20, this); else this._toBack();
    },

    _toBack:function (el) {
        this.el.parentNode.insertBefore(this.el, this.el.parentNode.firstChild);
    },

    matrix: undefined,

    getMatrix: function () {
        if (this.matrix == undefined) {
            var owner = ludo.svg.getSVGElement(this.getEl());
            this.matrix = owner.createSVGMatrix();
        }
        return this.matrix;
    }
});


