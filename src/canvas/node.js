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
                    this.css(value);
                }
                else if (key.substring(0, 6) == "xlink:") {
                    el.setAttributeNS("http://www.w3.org/1999/xlink", key.substring(6), value);
                } else {
                    el.setAttribute(key, value);
                    that._attr[key] = value;
                }
            }.bind(this));
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

    addEvents: function (events) {
        for (var key in events) {
            if (events.hasOwnProperty(key)) {
                this.on(key, events[key]);
            }
        }
    },

    /**
     * Add DOM events to SVG node
     * @param {String} event
     * @param {Function} fn
     * @memberof ludo.canvas.Node.prototype
     */
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

    relativePosition:function(e){
        var rect = this.el.getBoundingClientRect();

        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    },

    getDOMEventFn: function (eventName, fn) {
        return function (e) {
            e = e || window.event;

            var target = e.currentTarget || e.target || e.srcElement;

            while (target && target.nodeType == 3) target = target.parentNode;
            target = target['correspondingUseElement'] || target;

            var mouseX, mouseY;
            var touches = e.touches;
            if (touches && touches.length > 0) {
                mouseX = touches[0].clientX;
                mouseY = touches[0].clientY;

            } else {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }


            var off = this.el.ownerSVGElement ? this.el.ownerSVGElement.getBoundingClientRect() : { left:0, top: 0};

            e = {
                target: target,
                pageX: (e.pageX != null) ? e.pageX : e.clientX + document.scrollLeft,
                pageY: (e.pageY != null) ? e.pageY : e.clientY + document.scrollTop,
                clientX: mouseX - off.left, // Relative position to SVG element
                clientY: mouseY - off.top,
                event: e
            };
            
            
            
            if (fn) {
                fn.call(this, e, this, fn);
            }
            return false;
        }.bind(this);
    },
    svgCoordinates:undefined,
    svgPos:function(target){
          if(this.svgCoordinates == undefined){
              while(target.tagName.toLowerCase() != 'g'){
                  target = target.parentNode;
              }
              this.svgCoordinates = $(target).position();

              console.log(this.svgCoordinates);

          }

        return this.svgCoordinates;
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

    /**
     * Show SVG node, i.e. set display css property to ''
     * @function show
     * @memberof ludo.canvas.Node.prototype
     */
    show: function () {
        this.css('display','');
    },

    /**
     * Hides SVG node, i.e. set display css property to 'none'
     * @function hide
     * @memberof ludo.canvas.Node.prototype
     */
    hide: function () {
        this.css('display','none');
    },

    /**
     * Returns true if SVG node is hidden
     * @returns {boolean}
     * @memberof ludo.canvas.Node.prototype
     */
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

    /**
     * Set or get attribute.
     * @param {String} key
     * @param {String|Number|ludo.canvas.Node} value
     * @returns {*}
     * @memberof ludo.canvas.Node.prototype
     * @example
     * var x = node.attr("x"); // Get attribute
     * node.attr("x", 100); // Sets attribute
     */
    attr: function (key, value) {
        if (arguments.length == 1)return this.get(key);
        this.set(key, value);
    },

    /**
     * Set SVG node attribute. If a ludo.canvas.Node object is sent as value, the set function will
     * set an url attribute( url(#<id>).
     * @param {String} key
     * @param {String|Number|ludo.canvas.Node} value
     * @memberof ludo.canvas.Node.prototype
     */
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

    /**
     * Remove SVG attribute
     * @param {String} key
     * @memberof ludo.canvas.Node.prototype
     */
    removeAttr:function(key){
        if (key.substring(0, 6) == "xlink:") {
            this.el.removeAttributeNS("http://www.w3.org/1999/xlink", key.substring(6));
        }else{
            this.el.removeAttribute(key);
        }
    },

    remove: function (key) {
        console.trace();
        ludo.svg.remove(this.el, key);
    },

    /**
     * Get SVG attribute
     * @param {String} key
     * @returns {*}
     * @memberof ludo.canvas.Node.prototype
     */
    get: function (key) {
        if (key.substring(0, 6) == "xlink:") {
            return this.el.getAttributeNS("http://www.w3.org/1999/xlink", key.substring(6));
        } else {
            return this.el.getAttribute(key);
        }
    },

    /**
     * Returns x and y translation, i.e. translated x and y coordinates
     * @function getTranslate
     * @memberof ludo.canvas.Node.prototype
     * @returns {Array}
     * @example
     * var translate = node.getTranslate(); // returns [x,y], example; [100,150]
     */

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
        this.set('xlink:href', url);
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


    /**
     * Set or get CSS property
     * @param {String}} key
     * @param {String|Number} value
     * @returns {*}
     * @example
     * var stroke = node.css('stroke'); // Get stroke css attribute
     * node.css('stroke', '#FFFFFF'); // set stroke css property
     */
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

    /**
     * Returns nodes position relative to parent
     * @function position()
     * @returns {Object}
     * @memberof ludo.canvas.Node.prototype
     * @example
     * var pos = node.position(); // returns {x: 100, y: 200 }
     *
     */
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
        var off = [0,0];
        if(this._matrix != undefined){
            off = this._matrix.getTranslate();
        }
        return {
            left: bbox.x + off[0],
            top: bbox.y + off[1]
        }
    },

    /**
     * Returns nodes position relative to top SVG element
     * @memberof ludo.canvas.Node.prototype
     * @returns {Object}
     * @example
     * var pos = node.offset(); // returns {x: 100, y: 200 }
     */
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

        if (this.tagName == 'g' ||this.tagName=='text') {
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

        p = p.replace(/[^0-9\.\s]/g, ' ');
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

    /**
     * Returns rotation as a [degrees, x, y]
     * @function getRotate
     * @memberof ludo.canvas.Node.prototype
     * @returns {Array}
     */

    getRotate:function(){
        return this._getMatrix().getRotation();
    },

    /**
     * Set scale
     * @function setScale
     * @param {Number} x
     * @param {Number} y (Optional y scale, assumes x if not set)
     * @memberof ludo.canvas.Node.prototype
     */

    setScale:function(x,y){
        this._getMatrix().setScale(x,y);
    },

    /**
     * Scale SVG node. The difference between scale and setScale is that scale adds to existing
     * scale values
     * @function scale
     * @param {Number} x
     * @param {Number} y
     * @memberof ludo.canvas.Node.prototype
     */
    scale: function (x, y) {
        this._getMatrix().scale(x,y);
    },

    /**
     * Set rotation
     * @function setRotate
     * @param {Number} degrees Rotation in degrees
     * @param {Number} x Optional x coordinate to rotate about
     * @param {Number} y Optional x coordinate to rotate about
     * @memberof ludo.canvas.Node.prototype
     * @example
     * node.rotate(100); // Rotation is 100
     * node.rotate(50); // Rotation is 50
     */
    setRotate:function(degrees, x, y){
        this._getMatrix().setRotation(degrees, x,y);
    },

    /**
     * Rotate SVG node
     * @functino rotate
     * @param {Number} degrees Rotation in degrees
     * @param {Number} x Optional x coordinate to rotate about
     * @param {Number} y Optional x coordinate to rotate about
     * @memberof ludo.canvas.Node.prototype
     * @example
     * node.rotate(100); // Rotation is 100
     * node.rotate(50); // Rotation is 150
     */
    rotate: function (degrees, x, y) {
        this._getMatrix().rotate(degrees, x,y);
    },


    /**
     * Set SVG translation(movement in x and y direction)
     * @function setTranslate
     * @param {Number} x
     * @param {Number} y
     * @memberof ludo.canvas.Node.prototype
     * @example
     * node.setTranslate(500,100);
     * node.setTranslate(550,200); // Node is offset by 550x200 ( second translation overwrites first)
     */
    setTranslate:function(x,y){
        this._getMatrix().setTranslate(x,y);
    },

    /**
     * Translate SVG node(movement in x and y direction)
     * @function translate
     * @param {Number} x
     * @param {Number} y
     * @memberof ludo.canvas.Node.prototype
     * @example
     * node.setTranslate(500,100);
     * node.setTranslate(550,200); // Node is offset by 1050x300 (first translation + second)
     */
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
     * Function to animate SVG properties such as radius, x,y, colors etc.
     *
     * When animating colors, set colors using the set function and not the css function since CSS fill and stroke has highest priority.
     *
     * For demos, see
     * <a href="../demo/canvas/animation.php">animation.php</a>
     * <a href="../demo/canvas/animation.php">queued-animation.php</a>
     * <a href="../demo/canvas/animation.php">transformation.php</a>
     * <a href="../demo/canvas/animation.php">clipping.php</a>
     * <a href="../demo/canvas/animation.php">masking.php</a>
     * @function animate
     * @param {Object} properties Properties to animate, example: { x: 100, width: 100 }
     * @param {Object} options Animation options
     * @param {Object} options.duration - Animation duration in milliseconds, default: 400/1000seconds
     * @param {Function} options.easing Reference to ludo.canvas.easing easing function, example: ludo.canvas.easing.linear
     * @param {Function} options.complete Function to execute on complete
     * @param {Function} options.progress Function executed after each animation step. Argument: completed from 0 to 1
     * @param {Boolean} options.queue True to queue animations for this SVG element. Default: true
     * @param {Function} options.validate Option function called before each step of the animation. If this function returns false, the animation will stop.
     * Arguments: 1) unique id of animation 2) unique id of latest animation for this SVG element. Useful if new animation should stop old animation.
     * @memberof ludo.canvas.Node.prototype
     * @example
     * // Animating using properties and options objects.
     * circle.animate({
     *      'cx': 100, cy: 100
     * },{
     *      easing: ludo.canvas.easing.bounce,
     *      duration: 1000,
     *      complete:function(){
     *          console.log('Animation complete');
     *      },
     *      progress:function(t){ // float from 0 to 1
     *          console.log('Progress: ' + Math.round(t*100) + '%');
     *      }
     * });
     *
     * // or with duration, easing and complete function as parameters.
     * circle.animate({
     *      'cx': 100, cy: 100
     * }, 400, ludo.canvas.easing.bounce, function(){ console.log('finished') });
     *
     *
     */
    animate: function (properties, options, easing, complete) {
        var opt = {};
        if(!jQuery.isPlainObject(options)){
            opt.duration = options;
            opt.easing = easing;
            opt.complete = complete;
        }else opt = options;
        ludo.canvasAnimation.animate(this, properties, opt);
        return this;
    },

    _animation: undefined,

    animation: function () {
        if (this._animation === undefined) {
            this._animation = new ludo.canvas.Animation(this.getEl());
        }
        return this._animation;
    },

    /**
     * Bring nodes to front (z index)
     * @function toFront
     * @memberof ludo.canvas.Node.prototype
     */
    toFront:function () {
        if (Browser['ie'])this._toFront.delay(20, this); else this._toFront();
    },

    _toFront:function () {
        this.el.parentNode.appendChild(this.el);
    },

    /**
     * Bring nodes to back (z index)
     * @function toFront
     * @memberof ludo.canvas.Node.prototype
     */
    toBack:function () {
        if (Browser['ie']) this._toBack.delay(20, this); else this._toBack();
    },

    _toBack:function () {
        this.el.parentNode.insertBefore(this.el, this.el.parentNode.firstChild);
    }
});


