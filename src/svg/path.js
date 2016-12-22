/**
 * Returns a path SVG element which can be adopted to a canvas.
 * @namespace ludo.canvas
 * @class ludo.svg.Path
 */
ludo.svg.Path = new Class({
    Extends:ludo.svg.NamedNode,
    tagName:'path',
    pointString:undefined,
    pointArray:undefined,
    size:undefined,
    position:undefined,

    initialize:function (points, properties) {
        properties = properties || {};
        if (points) {
            points = this.getValidPointString(points);
            properties.d = points;
        }
        this.parent(properties);
        this.pointString = points;
    },

    getValidPointString:function (points) {
        return points.replace(/([A-Z])/g, '$1 ').trim().replace(/,/g, ' ').replace(/\s+/g, ' ');
    },

    setPath:function (path) {
        this.pointString = this.getValidPointString(path);
        this.pointArray = undefined;
        this.set('d', this.pointString);
    },

    getPoint:function (index) {
        if (this.pointArray === undefined)this.buildPointArray();
        index *= 3;
        return {
            x:this.pointArray[index + 1],
            y:this.pointArray[index + 2]
        };
    },

    setPoint:function (index, x, y) {
        if (this.pointArray === undefined)this.buildPointArray();
        index *= 3;
        if (index < this.pointArray.length - 3) {
            this.pointArray[index + 1] = x;
            this.pointArray[index + 2] = y;
            this.pointString = this.pointArray.join(' ');
            this.set('d', this.pointString);
            this.size = undefined;
            this.position = undefined;
        }
    },

    buildPointArray:function () {
        var points = this.pointString.replace(/,/g, ' ').replace(/\s+/g, ' ');
        this.pointArray = points.split(/([A-Z\s])/g).erase(" ").erase("");
    },

    getSize:function () {
        if (this.size === undefined) {
            var minMax = this.getMinAndMax();
            this.size = {
                x:Math.abs(minMax.maxX - minMax.minX),
                y:Math.abs(minMax.maxY - minMax.minY)
            };
        }
        return this.size;
    },

    getPosition:function () {
        if (this.position === undefined) {
            var minMax = this.getMinAndMax();
            this.position = {
                x:minMax.minX,
                y:minMax.minY
            };
        }
        return this.position;
    },

    getMinAndMax:function () {
        if (this.pointArray === undefined)this.buildPointArray();
        var p = this.pointArray;
        var x = [];
        var y = [];
        for (var i = 0; i < p.length - 2; i += 3) {
            x.push(p[i + 1]);
            y.push(p[i + 2]);
        }
        return {
            minX:Math.min.apply(this, x), minY:Math.min.apply(this, y),
            maxX:Math.max.apply(this, x), maxY:Math.max.apply(this, y)
        };
    }
});