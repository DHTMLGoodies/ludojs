ludo.canvas.Engine = new Class({
	/**
	 * Transformation cache
	 * @property tCache
	 * @type {Object}
	 * @private
	 */
	tCache:{},
    /**
     * Internal cache
     * @property {Object} tCacheStrings
     * @private
     */
	tCacheStrings:{},
    /**
     * Cache of class names
     * @property {Object} classNameCache
     * @private
     */
    classNameCache:{},
    /**
     * Internal cache
     * @property {Object} tCacheStrings
     * @private
     */
    cache:{},

	/**
	 * Updates a property of a SVG DOM node
	 * @method set
	 * @param {HTMLElement} el
	 * @param {String} key
	 * @param {String} value
	 */
	set:function (el, key, value) {
		if (key.substring(0, 6) == "xlink:") {
            if(value['id']!==undefined)value = '#' + value.getId();
			el.setAttributeNS("http://www.w3.org/1999/xlink", key.substring(6), value);
		} else {
            if(value['id']!==undefined)value = 'url(#' + value.getId() + ')';
			el.setAttribute(key, value);
		}
	},
	/**
	 * Remove property from node.
	 * @method remove
	 * @param {HTMLElement} el
	 * @param {String} key
	 */
	remove:function(el, key){
		if (key.substring(0, 6) == "xlink:") {
			el.removeAttributeNS("http://www.w3.org/1999/xlink", key.substring(6));
		}else{
			el.removeAttribute(key);
		}
	},

	/**
	 * Returns property value of a SVG DOM node
	 * @method get
	 * @param {HTMLElement} el
	 * @param {String} key
	 */
	get:function (el, key) {
		if (key.substring(0, 6) == "xlink:") {
			return el.getAttributeNS("http://www.w3.org/1999/xlink", key.substring(6));
		} else {
			return el.getAttribute(key);
		}
	},

	text:function (el, text) {
		el.textContent = text;
	},

	show:function (el) {
        this.setStyle(el, 'display','');
	},

	hide:function (el) {
        this.setStyle(el, 'display','none');
	},

	moveTo:function (el, x, y) {
		el.setAttribute('x', x);
		el.setAttribute('y', y);
	},

	toBack:function (el) {
		if (Browser['ie']) this._toBack.delay(20, this, el); else this._toBack(el);
	},
	_toBack:function (el) {
		el.parentNode.insertBefore(el, el.parentNode.firstChild);
	},

	toFront:function (el) {
		if (Browser['ie'])this._toFront.delay(20, this, el); else this._toFront(el);
	},
	_toFront:function (el) {
		el.parentNode.appendChild(el);
	},

    /**
     * Apply rotation to element
     * @method rotate
     * @param {Node} el
     * @param {Number} rotation
     */
	rotate:function (el, rotation) {
		this.setTransformation(el, 'rotate', rotation);
	},

    /**
     * Rotate around a speific point
     * @method rotateAround
     * @param {Node} el
     * @param {Number} rotation
     * @param {Number} x
     * @param {Number} y
     */
    rotateAround:function(el, rotation, x, y){
        this.setTransformation(el, 'rotate', rotation + ' ' + x + ' ' + y);
    },

	skewX:function (el, degrees) {
		this.getTransformObject(el);
		el.transform.baseVal.getItem(0).setSkewX(degrees);
	},

	skewY:function (el, degrees) {
		this.getTransformObject(el);
		el.transform.baseVal.getItem(0).setSkewY(degrees);
	},

	getCenter:function (el) {
		return {
			x:this.getWidth(el) / 2,
			y:this.getHeight(el) / 2
		}
	},

	translate:function(el, x, y){
		this.setTransformation(el, 'translate', x + ' ' + y);
	},

	getCurrentCache:function(el, key){
		return this.cache[el.id]!==undefined && this.cache[el.id][key]!==undefined ? this.cache[el.id][key] : [0,0];
	},

	scale:function(el, width, height){
		height = height || width;
		this.setTransformation(el, 'scale', width + ' ' + height);
	},

	applyTransformationToMatrix:function(el, transformation, x, y){
		var t = this.getTransformObject(el);
		var c = this.getCurrentCache(el, transformation);
		if(y!==undefined){
			t.setMatrix(t.matrix[transformation](x - c[0], y - c[1]));
		}else{
			t.setMatrix(t.matrix[transformation](x - c[0]));
		}
		if(this.cache[el.id]=== undefined)this.cache[el.id] = {};
		if(transformation === 'scale'){
			x--;y--;
		}
		this.cache[el.id][transformation] = [x,y];
	},

	setTransformMatrix:function(el, a,b,c,d,e,f){
		this.getTransformObject(el).setMatrix(a,b,c,d,e,f);
	},

	getTransformObject:function(el){
		if(el.transform.baseVal.numberOfItems ==0){
			var owner;
			if(el.ownerSVGElement){
				owner = el.ownerSVGElement;
			}else{
				owner = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
			}
			var t = owner.createSVGTransform();
			el.transform.baseVal.appendItem(t);
		}
		return el.transform.baseVal.getItem(0);
	},

	setTransformation:function (el, transformation, value) {
		var id = this.get(el, 'id');
		this.buildTransformationCacheIfNotExists(el, id);
		this.updateTransformationCache(id, transformation, value);
		this.set(el, 'transform', this.getTransformationAsText(id));
	},

	updateTransformationCache:function (id, transformation, value) {
		value = value.toString();
		if (isNaN(value)) {
			value = value.replace(/,/g, ' ');
			value = value.replace(/\s+/g, ' ');
		}
		var values = value.split(/\s/g);
		this.tCache[id][transformation] = {
			values:values,
			readable:this.getValidReturn(transformation, values)
		};
		this.tCacheStrings[id] = undefined;
	},

	clearTransformation:function (el) {
		if (Browser.ie) {
			el.setAttribute('transform', null);
		} else {
			el.removeAttribute('transform');
		}
		this.clearTransformationCache(el);
	},

	clearTransformationCache:function(el){
		this.tCache[this.get(el, 'id')] = undefined;
	},

	getTransformation:function (el, key) {
		var id = this.get(el, 'id');
		this.buildTransformationCacheIfNotExists(el, id);
		return this.tCache[id][key] ? this.tCache[id][key].readable : undefined;
	},

	buildTransformationCacheIfNotExists:function (el, id) {
		if (!this.hasTransformationCache(id)) {
			this.buildTransformationCache(el, id);
		}
	},

	getTransformationValues:function (el, key) {
		var ret = [];
		key = key.toLowerCase();
		var t = (this.get(el, 'transform') || '').toLowerCase();
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

	/**
	 * @method hasTransformationCache
	 * @private
	 * @param {Number} id
	 * @return {Boolean}
	 */
	hasTransformationCache:function (id) {
		return this.tCache[id] !== undefined;
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

	/**
	 * @method buildTransformationCache
	 * @private
	 * @param {HTMLElement} el
	 * @param {String} id
	 */
	buildTransformationCache:function (el, id) {
		id = id || this.get(el, 'id');

		this.tCache[id] = {};
		var keys = this.getTransformationKeys(el);

		for (var i = 0; i < keys.length; i++) {
			var values = this.getTransformationValues(el, keys[i]);
			this.tCache[id][keys[i]] = {
				values:values,
				readable:this.getValidReturn(keys[i], values)
			};
		}
	},

	getTransformationKeys:function (el) {
		var ret = [];
		var t = this.get(el, 'transform') || '';

		var tokens = t.split(/\(/g);
		for (var i = 0; i < tokens.length-1; i++) {
			ret.push(tokens[i].replace(/[^a-z]/gi, ''));
		}
		return ret;
	},

	getTCache:function (el) {
		return this.tCache[this.get(el, 'id')];
	},

	getTransformationAsText:function(id){
		if(this.tCacheStrings[id] === undefined && this.tCache[id]!==undefined){
			this.buildCacheString(id);
		}
		return this.tCacheStrings[id];
	},

	buildCacheString:function(id){
		this.tCacheStrings[id] = '';
		var keys = Object.keys(this.tCache[id]);
		for(var i=0;i<keys.length;i++){
			this.tCacheStrings[id] += keys[i] + '(' + this.tCache[id][keys[i]].values.join(' ') + ') ';
		}
		this.tCacheStrings[id] = this.tCacheStrings[id].trim();
	},

	setStyle:function(el, key, value){
		el.style[String.camelCase(key)] = value;
	},

	addClass:function(el, className){
		if(!this.hasClass(el, className)){
			var id = this.getId(el);
			this.classNameCache[id].push(className);
			this.updateNodeClassNameById(el, id);
		}
		var cls = el.getAttribute('class');
		if(cls){
			cls = cls.split(/\s/g);
			if(cls.indexOf(className)>=0)return;
            cls.push(className);
            this.set(el, 'class', cls.join(' '));
		}else{
			this.set(el, 'class', className);
		}
	},

	hasClass:function(el, className){
		var id = this.getId(el);
		if(!this.classNameCache[id]){
			var cls = el.getAttribute('class');
			if(cls){
				this.classNameCache[id] = cls.split(/\s/g);
			}else{
				this.classNameCache[id] = [];
			}
		}
		return this.classNameCache[id].indexOf(className)>=0;
	},

	removeClass:function(el, className){
		if(this.hasClass(el, className)){
			var id = this.getId(el);
			this.classNameCache[id].erase(className);
			this.updateNodeClassNameById(el, id);
		}
	},

	updateNodeClassNameById:function(el, id){
		this.set(el, 'class', this.classNameCache[id].join(' '));
	},

	getId:function(el){
		if(!el.getAttribute('id')){
			el.setAttribute('id', String.uniqueID());
		}
		return el.getAttribute('id');
	},

    effect:function(){
        if(ludo.canvas.effectObject === undefined){
            ludo.canvas.effectObject = new ludo.canvas.Effect();
        }
        return ludo.canvas.effectObject;
    },

	empty:function(el){
		el.textContent = '';
	},

    /**
     * Degrees to radians method
     * @method toRad
     * @param degrees
     * @return {Number}
     */
    toRadians:function(degrees){
        return degrees * Math.PI / 180;
    },

    getPointAtDegreeOffset:function(from, degrees, size){
        var radians = ludo.canvasEngine.toRadians(degrees);
        var x = Math.cos(radians);
        var y = Math.sin(radians);

        return {
            x : from.x + (size * x),
            y : from.y + (size * y)
        }
    }

});
ludo.canvasEngine = new ludo.canvas.Engine();

