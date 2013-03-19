/**
 * Color functions
 * @namespace color
 * @class Color
 */
ludo.color.Color = new Class({

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
     @method rgbObject
     @param {String} rgbColor
     @return {Object}
     @example
        var c = new ludo.color.Color();
        console.log(c.rgbObject('#FFEEDD'); // returns { 'r': 'FF','g' : 'EE', 'b' : 'DD' }
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
     * @method rgbCode
     * @param a
     * @param b
     * @param c
     * @return {String}
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
     * @method toRGB
     * @param {Number} red
     * @param {Number} green
     * @param {Number} blue
     * @return {String}
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
    toHSV:function (color) {
        if (color.r === undefined)color = this.rgbObject(color);
        return this.toHSVFromRGB(color.r, color.g, color.b);
    },
    toHSVFromRGBCode:function (rgbColor) {
        var color = this.rgbObject(rgbColor);
        return this.toHSVFromRGB(color.r, color.g, color.b);
    },
    /**
     * Converts red,green and blue to hsv h,s v
     * @method toHSVFromRGB
     * @param r
     * @param g
     * @param b
     * @return {Object}
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

    hsvToRGBCode:function (h, s, v) {
		if(s === undefined){
			s = h.s;v = h.v;h= h.h;
		}
        var rgb = this.hsvToRGB(h, s, v);
        return this.toRGB(rgb.r,rgb.g,rgb.b);
    },
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
    }
});

