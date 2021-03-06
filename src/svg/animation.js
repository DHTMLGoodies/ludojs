/**
 * Animation of SVG DOM Nodes
 * @class ludo.svg.Animation
 * @example
 * circle.animate({
 *      cx : 100, cy: 100, r: 10
 * }, 200,
 * ludo.svg.easing.outCubic,
 * function(){ console.log('finished') }
 * );
 */
ludo.svg.Animation = new Class({

    animationRate: 13,
    color: undefined,
    _queue:undefined,
    _animationIds:undefined,

    testing:false,
    initialize:function(){
        this._queue = {};
        this._animationIds = {};
    },


    colorUtil: function () {
        if (this.color == undefined)this.color = new ludo.color.Color();
        return this.color;
    },

    getPathSegments:function(path){
        if(path.substr == undefined)return path;
        path = path.replace(/,/g, " ");
        path = path.replace(/\s+/g, " ");
        var tokens = path.split(/\s/g);
        jQuery.each(tokens, function(index, value){
           if(!isNaN(value)){
               tokens[index] = parseFloat(value);
           }
        });

        return tokens;
    },
    
    animate:function(node, properties,options){
        if(this.color == undefined)this.colorUtil();

        this.queue({ node: node, properties:properties, options: options });
    },

    queue:function(animation){
        animation.__finish = this.next.bind(this);
        animation.id = animation.node.id;
        animation.animationId = String.uniqueID();

        this._animationIds[animation.id] = animation.animationId;

        var hasQueue = this.hasQueue(animation);
        var shouldQueue = animation.options.queue != undefined ?  animation.options.queue :  true;

        if(this._queue[animation.id] == undefined){
            this._queue[animation.id] = [];
        }

        if(shouldQueue){
            this._queue[animation.id].push(animation);
        }

        if(!shouldQueue || !hasQueue){
            this.fn.call(this, animation);
        }
    },

    hasQueue:function(animation){

        return this._queue[animation.id] != undefined && this._queue[animation.id].length > 0;
    },



    fn: function (animation) {
        var node = animation.node;

        var properties = animation.properties;
        var options = animation.options;

        var duration = options.duration || 400;
        var easing = options.easing || ludo.svg.easing.inSine;


        var changes = {};
        var start = {};
        var special = {};
        var finishedFn = animation.__finish;

        jQuery.each(properties, function (key, value) {
            special[key] = true;

            switch (key) {
                
                case "d":
                    var p = node.attr("d");

                    start[key] = this.getPathSegments(p);
                    changes[key] = this.getPathSegments(value);

                    jQuery.each(changes[key], function(index, value){
                        if(!isNaN(value)){
                            changes[key][index] = value - start[key][index];
                        }
                    });
                    break;
                case 'fill':
                case 'stroke':
                case 'stop-color':
                    var clr = node.attr(key) || '#000000';

                    if (clr.length == 4) clr = clr + clr.substr(1);
                    var u = this.colorUtil();
                    var rgb = u.rgbColors(clr);
                    var to = u.rgbColors(value);

                    changes[key] = [
                        to.r - rgb.r, to.g - rgb.g, to.b - rgb.b
                    ];
                    start[key] = rgb;
                    break;
                case 'translate':
                    var add = jQuery.type(value[0]) == 'string' && (/[+\-]/.test(value[0]));
                    value[0] = parseInt(value[0]);
                    value[1] = value[1] ? parseInt(value[1]) : 0;
                    var cur = add ? [0,0] : node.getTranslate();
                    changes[key] = [
                        value[0] - cur[0], value[1] - cur[1]
                    ];
                    start[key] = node.getTranslate();
                    special[key] = true;
                    break;
                case 'rotate':
                    var c = node.getRotate();
                    changes[key] = [
                        value[0] - c[0], value[1], value[2]
                    ];
                    start[key] = c[0];
                    break;
                case 'scale':

                default:
                    var current = parseFloat(node.get(key));
                    if(isNaN(current)){
                        current = 1;
                    }

                    changes[key] = value - current;
                    start[key] = current;

                    special[key] = false;

            }

        }.bind(this));

        var progress = options.progress;
        var startFn = options.start;
        var stepFn = options.step;
        
        var fn = function (t, d) {

            if(options.validate != undefined){
                var success = options.validate.call(this, animation.animationId, this._animationIds[animation.id]);
                if(!success){
                    finishedFn.call(ludo.svgAnimation , animation);
                    return;
                }
            }

            var isFinished = t >= d;

            if (!isFinished && !this.testing) {
                fn.delay(this.animationRate, this, [t + 1, d]);
            }

            var vals;

            if(t == 0 && startFn){
                startFn.call(node);
            }

            if(isFinished)t = d;
            var delta = easing(t, 0, 1, d);
            var x,y;

            for(var key in changes) {
                if(changes.hasOwnProperty(key)) {
                    var value = changes[key];
                    
                    
                    if (special[key]) {
                        switch (key) {
                            case 'd':
                                var v = [];

                                jQuery.each(start[key], function (index, v2) {
                                    if (isNaN(v2)) {
                                        v.push(v2);
                                    } else {
                                        v.push(v2 + (value[index] * delta))
                                    }
                                });

                                if(stepFn != undefined)value = stepFn.call(this, v, delta, t/d) || value;
                                
                                node.set("d", v.join(" "));
                                break;
                            case 'stroke':
                            case 'fill':
                            case 'stop-color':
                                var r = Math.round(start[key].r + (delta * value[0]));
                                var g = Math.round(start[key].g + (delta * value[1]));
                                var b = Math.round(start[key].b + (delta * value[2]));
                                var c = this.color.toRGB(r, g, b);
                                node.el.setAttribute(key, c);
                                node._attr[key] = c;
                                node.dirty = true;

                                break;
                            case 'translate':
                                x = start[key][0] + (delta * value[0]);
                                y = start[key][1] + (delta * value[1]);
                                node._getMatrix().setTranslate(x, y);
                                break;
                            case 'rotate':
                                var rotate = start[key] + (delta * value[0]);
                                x = value[1];
                                y = value[2];
                                rotate = rotate % 360;
                                node._getMatrix().setRotation(rotate, x, y);
                                break;
                        }
                    } else {
                        var val = start[key] + (value * delta);
                        if(stepFn != undefined)val = stepFn.call(this, val, delta, t/d) || val;
                        node.el.setAttribute(key, val);
                        node._attr[key] = val;
                        node.dirty = true;

                        if (progress) {
                            if (vals == undefined) {
                                vals = {};
                            }
                            vals[key] = val;
                        }
                    }
                }

            }

            /*
            if (options.step != undefined) {
                options.step.call(node, node, vals, delta, t / d);
            }
            */

            if(progress!= undefined){
                progress.call(node, t/d, vals);
            }
            if (isFinished) {
                if (options.complete != undefined) {
                    options.complete.call(node);
                }

                finishedFn.call(ludo.svgAnimation , animation);
            }


            if(this.testing && !isFinished){
                fn.call(this, t + 1, d);
            }
        }.bind(this);
        animation.startTime = new Date().getTime();
        fn.call(this, 1, Math.ceil(duration / this.animationRate));
    },
    
    next:function(anim){
        var index = this._queue[anim.id].indexOf(anim);
        if(index >= 0){
            this._queue[anim.id].splice(index,1);
        }

        if(this._queue[anim.id].length > 0){
            this.fn(this._queue[anim.id][0]);
        }
    }


});

ludo.svgAnimation = new ludo.svg.Animation();


/**
 * Easing methods for SVG animations.
 *
 * To see how the different functions work, see the <a href="../demo/svg/animation.php">SVG animation demo</a>.
 *
 * @class ludo.svg.easing
 * @example
 * circle.animate({
 *      cx : 100, cy: 100, r: 10
 * }, {
 *      duration: 200,
 *      easing: ludo.svg.easing.outCubic,
 *      complete: function(){ console.log('finished') }
 * });
 */


ludo.svg.easing = {

    /**
     *
     * @function linear
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body,
     *      layout:{
     *          width:'matchParent', height:'matchParent'
     *      }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50 });
     * circle.css('fill', '#ff0000');
     * svg.append(circle);
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.linear
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    linear: function (t, b, c, d) {
        return c * t / d + b;
    },

    /**
     * inQuad easing functions
     * @function inQuad
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.inQuad
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    inQuad: function (t, b, c, d) {
        t /= d;
        return c * t * t + b;
    },

    /**
     * outQuad easing functions
     * @function outQuad
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.outQuad
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    outQuad: function (t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
    },

    /**
     * inOutQuad easing functions
     * @function inOutQuad
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.inOutQuad
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    inOutQuad: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    },

    /**
     * inCubic easing functions
     * @function inCubic
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.inCubic
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    inCubic: function (t, b, c, d) {
        t /= d;
        return c * t * t * t + b;
    },

    /**
     * outCubic easing functions
     * @function outCubic
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.outCubic
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    outCubic: function (t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    },

    /**
     * inOutCubic easing functions
     * @function inOutCubic
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.inOutCubic
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    inOutCubic: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    },

    /**
     * inQuart easing functions
     * @function inQuart
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.inQuart
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    inQuart: function (t, b, c, d) {
        t /= d;
        return c * t * t * t * t + b;
    },

    /**
     * outQuart easing functions
     * @function outQuart
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.outQuart
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    outQuart: function (t, b, c, d) {
        t /= d;
        t--;
        return -c * (t * t * t * t - 1) + b;
    },

    /**
     * inOutQuart easing functions
     * @function inOutQuart
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.inOutQuart
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    inOutQuart: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    },

    /**
     * inQuint easing functions
     * @function inQuint
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.inQuint
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    inQuint: function (t, b, c, d) {
        t /= d;
        return c * t * t * t * t * t + b;
    },

    /**
     * outQuint easing functions
     * @function outQuint
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.outQuint
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    outQuint: function (t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t * t * t + 1) + b;
    },

    /**
     * inOutQuint easing functions
     * @function inOutQuint
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.inOutQuint
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    inOutQuint: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t * t * t + 2) + b;
    },

    /**
     * inSine easing functions
     * @function inSine
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.inSine
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    inSine: function (t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },

    /**
     * outSine easing functions
     * @function outSine
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.outSine
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    outSine: function (t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },

    /**
     * outSine easing functions
     * sinusoidal easing in/out - accelerating until halfway, then decelerating
     * @function outSine
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.outSine
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    inOutSine: function (t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },


    /**
     * inExpo easing functions
     * exponential easing in - accelerating from zero velocity
     * @function inExpo
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.inExpo
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    inExpo: function (t, b, c, d) {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
    },

    /**
     * outExpo easing functions
     * exponential easing out - decelerating to zero velocity
     * @function outExpo
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.outExpo
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    outExpo: function (t, b, c, d) {
        return c * ( -Math.pow(2, -10 * t / d) + 1 ) + b;
    },


    /**
     * inOutExpo easing functions
     * exponential easing in/out - accelerating until halfway, then decelerating
     * @function inOutExpo
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.inOutExpo
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    inOutExpo: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        t--;
        return c / 2 * ( -Math.pow(2, -10 * t) + 2 ) + b;
    },

    /**
     * inCirc easing functions
     * circular easing in - accelerating from zero velocity
     * @function inCirc
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.inCirc
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    inCirc: function (t, b, c, d) {
        t /= d;
        return -c * (Math.sqrt(1 - t * t) - 1) + b;
    },


    /**
     * outCirc easing functions
     * circular easing out - decelerating to zero velocity
     * @function outCirc
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.outCirc
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    outCirc: function (t, b, c, d) {
        t /= d;
        t--;
        return c * Math.sqrt(1 - t * t) + b;
    },

    /**
     * inOutCirc easing functions
     * circular easing in/out - acceleration until halfway, then deceleration
     * @function inOutCirc
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.inOutCirc
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    inOutCirc: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        t -= 2;
        return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
    },

    /**
     * bounce easing functions
     * @function bounce
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.bounce
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    bounce: function (t, b, c, d) {
        var progress = t / d;
        progress = 1 - ludo.svg.easing._bounce(1 - progress);
        return c * progress + b;
    },

    /**
     * bounce easing functions
     * @function bounce
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.outCirc
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    bow:function(t,b,c,d){
        var progress = ludo.svg.easing._bow(t/d, 1.5);
        return c * progress + b;
    },

    /**
     * elastic easing functions
     * @function elastic
     * @memberof ludo.svg.easing
     * @example
     * var v = new ludo.View({
     *      renderTo: document.body, layout:{ width:'matchParent', height:'matchParent'  }
     * });
     * var svg = v.svg();
     *
     * var circle = svg.$('circle', { cx: 100, cy: 100, r: 50, fill: '#ff0000' });
     * svg.append(circle);
     *
     * circle.animate({
     *      cx:300, cy: 200
     * },{
     *      easing: ludo.svg.easing.elastic
     *      duration: 1000,
     *      complete:function(){
     *          console.log('completed');
     *   }
     * });
     */
    elastic:function(t,b,c,d){
        var progress = ludo.svg.easing._elastic(t/d, 1.5);
        return c * progress + b;
    },

    _elastic:function(progress, x){
        return Math.pow(2, 10 * (progress-1)) * Math.cos(20*Math.PI*x/3*progress)

    },

    _bounce: function (progress) {
        for(var a = 0, b = 1; 1; a += b, b /= 2) {
            if (progress >= (7 - 4 * a) / 11) {
                return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
            }
        }
    },

    _bow:function(progress, x){
        return Math.pow(progress, 2) * ((x + 1) * progress - x)

    }


};
