/**
 * A class with a lot of color conversion functions.
 *
 * With this class, you can convert between RGB and HSV, darken and brighten colors,
 * increase and decrease saturation and brightness of a color etc.
 * 
 * @class ludo.color.Color
 * @example {@lang JavaScript}
 * var util = new ludo.color.Color();
 * var rgbCode = '#669900';
 * var rgbObject = util.rgbObject(rgbCode);
 *
 */
ludo.color.Color = new Class({

    /**
     * Converting color into RGB Object. This method accepts color in HSV format({h:120,s:40,v:100})
     * and in string format(RGB), example: '#669900'
     * @memberof ludo.color.prototype
     * @function rgbColors
     * @param {object|String} a
     * @returns {object}
     * @memberof ludo.color.Color.prototype
     * @example
     * var util = new ludo.color.Color();
     * console.log(util.rgbColors('#669900');
     * console.log(util.rgbColors({ h: 300, s: 100, v: 50 });
     *
     *
     */
    rgbColors:function (a) {
        if (a.substr !== undefined) {
            return this.rgbObject(a);
        }
        if (a.h !== undefined) {
            return this.hsvToRGB(a.h, a.s, a.v);
        }
        return undefined;
    },
    /**
     Converts rgb color string to rgb color object
     @public
     @param {string} rgbColor
     @memberof ludo.color
     @return {Object}
     @memberof ludo.color.Color.prototype
     @example {@lang JavaScript}
     * var c = new ludo.color.Color();
     * console.log(c.rgbObject('#FFEEDD');
     * // returns { 'r': 'FF','g' : 'EE', 'b' : 'DD' }
     */
    rgbObject:function (rgbColor) {
        rgbColor = rgbColor.replace('#', '');
        return {
            r:rgbColor.substr(0, 2).toInt(16),
            g:rgbColor.substr(2, 2).toInt(16),
            b:rgbColor.substr(4, 2).toInt(16)
        };
    },
    /**
     * Converts RGB or HSV color object to rgb code
     * @memberof ludo.color.Color.prototype
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @return {string}
     * @example
     * var c = new ludo.color.Color();
     * console.log(c.rgbCode({r:100,g:125,b:200});
     * console.log(c.rgbCode({h:144,s:45,b:55});
     */
    rgbCode:function (a, b, c) {
        if (b === undefined) {
            if (a.r !== undefined) {
                b = a.g;
                c = a.b;
                a = a.r;
            }
            else if (a.h !== undefined) {
                var color = this.hsvToRGB(a.h, a.s, a.v);
                a = color.r;
                b = color.g;
                c = color.b;
            }
        }
        return this.toRGB(a, b, c);
    },
    /**
     * Converts rgb object to rgb string
     * @memberof ludo.color.Color.prototype
     * @function toRGB
     * @param {Number} red
     * @param {Number} green
     * @param {Number} blue
     * @return {String}
     * @example
     * var c = new ludo.color.Color();
     * console.log(c.toRgb(100,14,200));
     */
    toRGB:function (red, green, blue) {
        var r = Math.round(red).toString(16);
        var g = Math.round(green).toString(16);
        var b = Math.round(blue).toString(16);
        if (r.length === 1)r = ['0', r].join('');
        if (g.length === 1)g = ['0', g].join('');
        if (b.length === 1)b = ['0', b].join('');
        return ['#', r, g, b].join('').toUpperCase();
    },
    toRGBFromObject:function (color) {
        return this.toRGB(color.r, color.g, color.b);
    },

    brightness:function(color, brightness){
        if(arguments.length == 1){

            return this.toHSV(color).v;
        }else{
            var hsv = this.toHSV(color);
            hsv.v = brightness;
            return this.rgbCode(hsv);
        }
    },

    saturation:function(color, saturation){
        if(arguments.length == 1){
            return this.toHSV(color).s;
        }else{
            var hsv = this.toHSV(color);
            hsv.s = saturation;
            return this.rgbCode(hsv);
        }
    },

    /**
     * Converts a RGB color to HSV(Hue, Saturation, Brightness)
     * @param {String|Object} color
     * @memberof ludo.color.Color.prototype
     * @returns {Object}
     * @example
     * var c = new ludo.color.Color();
     * console.log(c.toHSV('#7e8080'));
     * // outputs {h: 180, s: 1.5624999999999944, v: 50.19607843137255}
     */
    toHSV:function (color) {
        if (color.r === undefined)color = this.rgbObject(color);
        return this.toHSVFromRGB(color.r, color.g, color.b);
    },
    toHSVFromRGBCode:function (rgbColor) {
        var color = this.rgbObject(rgbColor);
        return this.toHSVFromRGB(color.r, color.g, color.b);
    },
    /**
     * Converts red,green and blue to HSV(Hue, Saturation, Brightness)
     * @memberof ludo.color.Color.prototype
     * @function toHSVFromRGB
     * @param r
     * @param g
     * @param b
     * @return {Object}
     * @example
     * var c = new ludo.color.Color();
     * var hsv = c.toHSVFromRGB(100,200,10);
     * console.log(hsv);
     */
    toHSVFromRGB:function (r, g, b) {
        r = r / 255;
        g = g / 255;
        b = b / 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0;
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return {
            h:h * 360,
            s:s * 100,
            v:max * 100
        };
    },

    /**
     * Converts Hue,Saturation,Brightness to RGB Code
     * @memberof ludo.color.Color.prototype
     * @param h
     * @param s
     * @param v
     * @returns {String}
     * @example
     * var c = new ludo.color.Color();
     * var color = c.hsvToRGBCode(200,40,60);
     * console.log(color);
     */
    hsvToRGBCode:function (h, s, v) {
        if (s === undefined) {
            s = h.s;
            v = h.v;
            h = h.h;
        }
        var rgb = this.hsvToRGB(h, s, v);
        return this.toRGB(rgb.r, rgb.g, rgb.b);
    },


    /**
     * Converts HSV(Hue, Saturation, Brightness) to RGB(red, green, blue).
     * @memberof ludo.color.Color.prototype
     * @param h
     * @param s
     * @param v
     * @returns {{r: number, g: number, b: number}}
     * @example {@lang JavaScript}
     * var colorUtil = new ludo.color.Color();
     * var hue = 300;
     * var saturation = 40;
     * var brightness = 90;
     * var rgb = colorUtil.hsvToRGB(hue, saturation, brightness);
     *  // returns { r: 229, g: 138, b: 229 }
     */
    hsvToRGB:function (h, s, v) {
        if (s === undefined) {
            s = h.s;
            v = h.v;
            h = h.h;
        }
        h /= 360;
        s /= 100;
        v /= 100;

        var r, g, b;

        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
        return{
            r:r * 255,
            g:g * 255,
            b:b * 255
        };
    },

    hslToRgb:function (h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return { r:r * 255, g:g * 255, b:b * 255 }
    },

    /**
     * Return rgb code after hue has been adjusted by a number of degrees
     * @function offsetHue
     * @memberof ludo.color.Color.prototype
     * @param color
     * @param offset
     * @return {String}
     * @example
     * var c = new ludo.color.Color();
     * var color = '#FF0000'; // red
     * color = c.offsetHue(color, 10);
     * console.log(color); // Outputs #FF2A00
     */
    offsetHue:function(color, offset){
        var hsv = this.toHSV(color);
        hsv.h += offset;
        hsv.h = hsv.h % 360;
        return this.rgbCode(hsv);
    },

    /**
     * Return rgb code after hue has been adjusted by a number of degrees
     * @function offsetBrightness
     * @memberof ludo.color.Color.prototype
     * @param color
     * @param offset
     * @return {String}
     * @example
     * var c = new ludo.color.Color();
     * var color = '#FF0000'; // Bright red with full brightness and saturation
     * color = c.offsetBrightness(color, -10); // 10 degrees darker
     * console.log(color); // outputs #E60000
     */
    offsetBrightness:function(color, offset){
        var hsv = this.toHSV(color);
        hsv.v += offset;
        if(hsv.v > 100) hsv.v = 100;
        if(hsv.v < 0)hsv.v = 0;
        return this.rgbCode(hsv);
    },

    /**
     * Return rgb code after saturation(color intensity) has been adjusted. Saturation can be 0-100(no saturation to full saturation)
     * @function offsetSaturation
     * @memberof ludo.color.Color.prototype
     * @param {Object|String} color
     * @param {Number} offset
     * @return {String}
     * @example
     * var c = new ludo.color.Color();
     * var color = '#80994d'; // Green color with a saturation of 50
     * color = c.offsetSaturation(color, 10); // Increase saturation by 10 points
     * console.log(color); // outputs #85995C
     */
    offsetSaturation:function(color, offset){
        var hsv = this.toHSV(color);
        hsv.s += offset;
        if(hsv.s > 100) hsv.s = 100;
        if(hsv.s < 0)hsv.s = 0;
        return this.rgbCode(hsv);
    },

    /**
     * Returns a brighter color.
     * @memberof ludo.color.Color.prototype
     * @param {String|Object} color
     * @param {number} percent
     * @returns {String}
     * @example
     * var util = new ludo.color.Color();
     * var color = '#669900';
     * var brighterColor = util.brighten(color, 10);
     * console.log(brighterColor); // outputs #76A811;
     * color = '#AAAAAA';
     * brighterColor = util.brighten(color, 10);
     * console.log(brighterColor); // outputs #BBBBBB;
     */
    brighten:function(color, percent){
        var hsv = this.toHSV(color);
        color = this.offsetBrightness(color, hsv.v * percent/100);
        color = this.offsetSaturation(color, hsv.s * percent/100 * -1);
        return color;
    },

    /**
     * Brightens a color
     * @memberof ludo.color.Color.prototype
     * @param color
     * @param percent
     * @returns {String}
     * @example
     var c = new ludo.color.Color();
     var color = '#BBBBBB';
     var darker = c.darken(color, 10);
     console.log(darker); // outputs #A8A8A8
     */
    darken:function(color, percent){
        var hsv = this.toHSV(color);
        color = this.offsetBrightness(color, hsv.v * percent/100 * -1);
        color = this.offsetSaturation(color, hsv.s * percent/100);
        return color;
    }
});

