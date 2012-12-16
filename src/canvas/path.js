ludo.canvas.Path = new Class({
	Extends:ludo.canvas.NamedNode,
	tagName:'path',
	pointString:undefined,
	pointArray:undefined,
	size:undefined,
	position:undefined,

	initialize:function (points, properties) {
		properties = properties || {};
		points = this.getValidPointString(points);
		properties.d = points;
		this.parent(properties);
		this.pointString = points;
	},

	getValidPointString:function (points) {
		return points.replace(/([A-Z])/g, '$1 ').trim().replace(/,/g, ' ').replace(/\s+/g, ' ');
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
	/**
	 * Get size of polyline (max X - min X) and (max X - min Y)
	 * @method getSize
	 * @return {Object} x and y
	 */
	getSize:function(){
		if(this.size === undefined){
			var minMax = this.getMinAndMax();
			this.size = {
				x : Math.abs(minMax.maxX - minMax.minX),
				y : Math.abs(minMax.maxY - minMax.minY)
			};
		}
		return this.size;
	},

	getPosition:function(){
		if(this.position === undefined){
			var minMax = this.getMinAndMax();
			this.position = {
				x : minMax.minX,
				y : minMax.minY
			};
		}
		return this.position;
	},

	getMinAndMax:function () {
		if (this.pointArray === undefined)this.buildPointArray();
		var p = this.pointArray;
		var minX = 10000, maxX = -100000;
		var minY = 10000, maxY = -100000;
		for (var i = 0; i < p.length - 2; i += 3) {
			minX = Math.min(minX, p[i+1]);
			maxX = Math.max(maxX, p[i+1]);
			minY = Math.min(minY, p[i + 2]);
			maxY = Math.max(maxY, p[i + 2]);
		}
		return {
			minX:minX, minY:minY,
			maxX:maxX, maxY:maxY
		}
	}
});