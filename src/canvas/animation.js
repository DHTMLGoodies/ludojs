/**
 * Animation of SVG DOM Nodes
 * @class ludo.canvas.Animation
 * @example
 * circle.animate({
 *      cx : 100, cy: 100, r: 10
 * }, 200,
 * ludo.canvas.easing.outCubic,
 * function(){ console.log('finished') }
 * );
 */
ludo.canvas.Animation = new Class({

    animationRate: 13,
    color: undefined,
    _queue:undefined,

    benchmark:false,
    initialize:function(){
        this._queue = {};

    },


    colorUtil: function () {
        if (this.color == undefined)this.color = new ludo.color.Color();
        return this.color;
    },

    getPathSegments:function(path){
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


        var hasQueue = this.hasQueue(animation);
        var shouldQueue = animation.options.queue != undefined ?  animation.options.queue :  true;

        if(this._queue[animation.id] == undefined){
            this._queue[animation.id] = [];
        }

        this._queue[animation.id].push(animation);

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
        var easing = options.easing || ludo.canvas.easing.inSine;

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

        var r = this.animationRate;

        var fn = function (t, d) {
            if (t < d) {
                fn.delay(r, this, [t + 1, d]);
            }


            var bt;
            if(this.benchmark){
                bt = new Date().getTime();
            }
            var vals;

            if(t == 0 && options.start != undefined){
                options.start.call(node);
            }

            if(t > d)t = d;
            var delta = easing(t, 0, 1, d);
            var x,y;

            jQuery.each(changes, function (key, value) {

                if (special[key]) {
                    switch (key) {
                        case 'd':
                            var v = [];

                            jQuery.each(start[key], function(index, v2){
                                if(isNaN(v2)){
                                    v.push(v2);
                                }else{
                                    v.push(v2 + (value[index] * delta))
                                }
                            });
                            node.set("d", v.join(" "));
                            break;
                        case 'stroke':
                        case 'fill':
                        case 'stop-color':
                            var r = Math.round(start[key].r + (delta * value[0]));
                            var g = Math.round(start[key].g + (delta * value[1]));
                            var b = Math.round(start[key].b + (delta * value[2]));
                            node.set(key, this.color.toRGB(r,g,b));
                            break;
                        case 'translate':
                            x = start[key][0] + (delta * value[0]);
                            y = start[key][1] + (delta * value[1]);
                            node.setTranslate(x, y);
                            break;
                        case 'rotate':
                            var d = start[key] + (delta * value[0]);
                            x = value[1];
                            y = value[2];
                            d = d % 360;
                            node.setRotate(d,x,y);
                            break;
                    }
                } else {
                    var val = start[key] + (value * delta);
                    node.set(key, val);
                    if (options.step != undefined) {
                        if (vals == undefined) {
                            vals = {};
                        }
                        vals[key] = val;
                    }
                }

            }.bind(this));

            if (options.step != undefined) {
                options.step.call(node, node, vals, delta, t / d);
            }
            if(options.progress != undefined){
                options.progress.call(node, t/d);
            }
            if (t >= d) {
                if (options.complete != undefined) {
                    options.complete.call(node);
                }

                finishedFn.call(ludo.canvasAnimation , animation);
            }

            if(this.benchmark){
                console.log('time ' + (new Date().getTime() - bt));
            }

        }.bind(this);
        animation.startTime = new Date().getTime();
        fn.call(this, 1, Math.ceil(duration / this.animationRate));
    },
    
    next:function(anim){
        if(this.benchmark){
            console.log('elapsed: ' + (new Date().getTime() - anim.startTime));
        }
        var index = this._queue[anim.id].indexOf(anim);
        if(index >= 0){
            this._queue[anim.id].splice(index,1);
        }

        if(this._queue[anim.id].length > 0){
            this.fn(this._queue[anim.id][0]);
        }
    }


});

ludo.canvasAnimation = new ludo.canvas.Animation();

ludo.canvas.easing = {

    /**
     *
     * @param t current time
     * @param b start value
     * @param c change in value
     * @param d duration
     * @returns {*}
     */
    linear: function (t, b, c, d) {
        return c * t / d + b;
    },

    inQuad: function (t, b, c, d) {
        t /= d;
        return c * t * t + b;
    },

    outQuad: function (t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
    },

    inOutQuad: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    },


    inCubic: function (t, b, c, d) {
        t /= d;
        return c * t * t * t + b;
    },

    outCubic: function (t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    },

    inOutCubic: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    },

    inQuart: function (t, b, c, d) {
        t /= d;
        return c * t * t * t * t + b;
    },

    outQuart: function (t, b, c, d) {
        t /= d;
        t--;
        return -c * (t * t * t * t - 1) + b;
    },

    inOutQuart: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    },

    inQuint: function (t, b, c, d) {
        t /= d;
        return c * t * t * t * t * t + b;
    },

    outQuint: function (t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t * t * t + 1) + b;
    },

    inOutQuint: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t * t * t + 2) + b;
    },

    inSine: function (t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },

    // sinusoidal easing out - decelerating to zero velocity
    outSine: function (t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },

    // sinusoidal easing in/out - accelerating until halfway, then decelerating
    inOutSine: function (t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },

    // exponential easing in - accelerating from zero velocity
    inExpo: function (t, b, c, d) {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
    },


    // exponential easing out - decelerating to zero velocity
    outExpo: function (t, b, c, d) {
        return c * ( -Math.pow(2, -10 * t / d) + 1 ) + b;
    },


    // exponential easing in/out - accelerating until halfway, then decelerating
    inOutExpo: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        t--;
        return c / 2 * ( -Math.pow(2, -10 * t) + 2 ) + b;
    },

    // circular easing in - accelerating from zero velocity
    inCirc: function (t, b, c, d) {
        t /= d;
        return -c * (Math.sqrt(1 - t * t) - 1) + b;
    },


    // circular easing out - decelerating to zero velocity
    outCirc: function (t, b, c, d) {
        t /= d;
        t--;
        return c * Math.sqrt(1 - t * t) + b;
    },


    // circular easing in/out - acceleration until halfway, then deceleration
    inOutCirc: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        t -= 2;
        return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
    },

    /**
     *
     * @param t current time
     * @param b start value
     * @param c change in value
     * @param d duration
     * @returns {*}
     */

    bounce: function (t, b, c, d) {
        var progress = t / d;
        progress = 1 - ludo.canvas.easing._bounce(1 - progress);
        return c * progress + b;
    },

    bow:function(t,b,c,d){
        var progress = ludo.canvas.easing._back(t/d, 1.5);
        return c * progress + b;
    },

    elastic:function(t,b,c,d){
        var progress = ludo.canvas.easing._elastic(t/d, 1.5);
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

    _back:function(progress, x){
        return Math.pow(progress, 2) * ((x + 1) * progress - x)

    }


};
