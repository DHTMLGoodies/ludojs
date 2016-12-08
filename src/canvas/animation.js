/**
 * Created by alfmagne1 on 07/12/2016.
 */
ludo.canvas.Animation = new Class({

    animationRate:13,

    fn:function(node, properties, duration, easing, complete, stepFn){
        
        easing = easing || ludo.canvas.Easing.inSine;

        var changes = {};
        var start = {};
        var special = {};

        jQuery.each(properties, function(key, value){
            special[key] = true;

            switch(key){
                case 'translate':
                    var cur = node.getTranslate();
                    changes[key] = [
                        value[0] - cur[0], value[1] - cur[1]
                    ];
                    start[key] = cur;
                    break;
                case 'rotate':
                case 'scale':

                default:
                    var current = parseInt(node.get(key));
                    changes[key] = value - current;
                    start[key] = current;
                    special[key] = false;
            }

        });

        var r = this.animationRate;

        var fn = function(t,d){
            var loopChanges;
            if(t<d){
                fn.delay(r, fn, [t+1,d]);
            }
            var delta = t>=d ? 1 : easing(t, 0, 1, d);
            jQuery.each(changes, function(key, value){

                if(special[key]){
                    switch(key){
                        case 'translate':
                            var x = start[key][0] + (delta * value[0]);
                            var y = start[key][1] + (delta * value[1]);
                            node.translate(x,y);
                            break;


                    }
                } else{
                    var val = start[key] + (value * delta);
                    ludo.canvasEngine.set(node.el, key, val);
                    if(stepFn != undefined){
                        if(loopChanges == undefined){
                            loopChanges = {};
                        }
                        loopChanges[key] = value * delta;
                    }
                }

            });

            if(stepFn != undefined){
                stepFn.call(node, node, delta, t/d, loopChanges);
            }
            if(t>=d){
                if(complete!=undefined){
                    complete.call(node);
                }
            }
        };

        fn.call(fn, 0, duration / this.animationRate);
    }


});

ludo.canvasAnimation = new ludo.canvas.Animation();

ludo.canvas.Easing = {

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
    }


};
