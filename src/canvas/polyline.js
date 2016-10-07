/**
 Class for drawing polylines.
 @namespace canvas
 @class Polyline
 @extends canvas.NamedNode
 @constructor
 @param {String} points
 @param {canvas.NodeConfig} config
 @example
 	var polyline = new ludo.canvas.Polyline('20,20 40,25 60,40 80,120 120,140 200,180');
 */
ludo.canvas.Polyline = new Class({
	Extends: ludo.canvas.NamedNode,
	tagName : 'polyline',
	pointString : '',
	pointArray : undefined,
	size:undefined,
	position:undefined,

	initialize:function(points, properties){
		properties = properties || {};
		properties.points = points;
		this.parent(properties);
		this.pointString = points;
	},

	/**
	 * Return x and y of a point
	 * @method getPoint
	 * @param {Number} index
	 * @return {Object|undefined} x and y
	 */
	getPoint:function(index){
		if(this.pointArray === undefined)this.buildPointArray();
		index *=2;
		if(index > this.pointArray.length-2)return undefined;
		return {
			x : this.pointArray[index],
			y : this.pointArray[index+1]
		}
	},

	/**
	 Set new x and y for one of the points.
	 @method setPoint
	 @param {Number} index
	 @param {Number} x
	 @param {Number} y
	 @example
		 var polyline = new ludo.canvas.Polyline('20,20 40,25 60,40 80,120 120,140 200,180');
	     polyline.setPoint(0,10,5);
	     polyline.setPoint(1,120,40);
	 will change the points to
	 @example
	 	'10,5 120,40 60,40 80,120 120,140 200,180'
	 */
	setPoint:function(index, x, y){
		if(this.pointArray === undefined)this.buildPointArray();
		index *=2;
		if(index > this.pointArray.length-2)return;
		this.pointArray[index] = x;
		this.pointArray[index+1] = y;
		this.set('points', this.pointArray.join(' '));
		this.size = undefined;
		this.position = undefined;
	},

	buildPointArray:function(){
		var points = this.pointString.replace(/,/g,' ');
		points = points.replace(/\s+/g,' ');
		this.pointArray = points.split(/\s/g);
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
	/**
	 * Get position of polyline, min X and min Y)
	 * @method getPosition
	 * @return {Object} x and y
	 */
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

	getMinAndMax:function(){
		if(this.pointArray === undefined)this.buildPointArray();
		var p = this.pointArray;
		var minX = 10000, maxX = -100000;
		var minY = 10000, maxY = -100000;
		for(var i=0;i< p.length;i+=2){
			minX = Math.min(minX, p[i]);
			maxX = Math.max(maxX, p[i]);
			minY = Math.min(minY, p[i+1]);
			maxY = Math.max(maxY, p[i+1]);
		}
		return {
			minX: minX, minY: minY,
			maxX: maxX, maxY: maxY
		}
	}
});