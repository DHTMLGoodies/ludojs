ludo.chart.Pie = new Class({
	Extends:ludo.chart.Group,
	slices:[],
	data:undefined,
	startColor:'#561AD9',
	styles:[],
	currentRadius:undefined,
	layout:{
		type:'svg'
	},
	animation:{
		duration:1,
		fps:33
	},

	rendered:false,
	sliceData:[],
	startAngle:270,

	currentHighlighted:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		this.setConfigParams(config, ['animate']);
	},

	renderChart:function (skipAnimation) {
		if(!this.data)return;

		this.origo = this.getChartOrigin();

		this.currentRadius = Math.min(this.origo.x, this.origo.y) * .9;
		if (this.animate && !skipAnimation) {
			this.animateSlices();
		} else {
			this.renderSlices();
		}
	},

	renderSlices:function () {
		var d = this.data;
		var sum = this.getSum(d);
		var deg = this.startAngle;
		for (var i = 0; i < d.length; i++) {
			var slice = this.getSlice(i);
			var sliceDegrees = this.getDegrees(d[i].value, sum);
			slice.render({
				radius:this.currentRadius,
				startAngle:deg,
				degrees:sliceDegrees,
				origo:this.origo
			});
			deg += sliceDegrees;
		}
	},

	animateSlices:function () {
		this.animateStep(0, this.getAnimationSteps());
	},

	animateStep:function (currentStep, data) {
		for (var i = 0; i < this.data.length; i++) {
			var slice = this.getSlice(i);
			slice.render({
				radius:data.slices[i][currentStep].radius,
				startAngle:data.slices[i][currentStep].startAngle,
				degrees:data.slices[i][currentStep].degrees,
				origo:this.origo,
				offsetFromOrigo:0
			});
		}

		if (currentStep < data.count) {
			this.animateStep.delay(this.animation.fps, this, [currentStep + 1, data]);
		}
	},

	getAnimationSteps:function (relative) {
		// TODO cleanup this method
		var sum = this.getSum();
		var ret = {
			count:this.animation.fps * this.animation.duration,
			slices:[]
		};
		var sliceDegrees = [];

		for (var i = 0; i < this.data.length; i++) {
			sliceDegrees.push(this.getDegrees(this.data[i].value, sum));
			ret.slices[i] = [];
		}
		var deg;
		for (var j = 0; j < ret.count; j++) {
			if (!relative) deg = this.startAngle;
			for (i = 0; i < this.data.length; i++) {
				if (relative && j === 0) {
					deg = this.sliceData[i].startAngle;
				}
				var offset = relative ? this.sliceData[i].degrees : 0;

				var degree = offset + ((sliceDegrees[i] - offset) * j / ret.count);
				ret.slices[i].push({
					radius:relative ? this.currentRadius : this.currentRadius * j / ret.count,
					degrees:degree,
					startAngle:deg
				});

				deg += degree;
			}
		}
		deg = this.startAngle;
		for (i = 0; i < this.data.length; i++) {
			var end = {
				radius:this.currentRadius,
				degrees:sliceDegrees[i],
				startAngle:deg
			};
			this.storeSliceData(i, end);
			ret.slices[i].push(end);
			deg += sliceDegrees[i];
		}

		return ret;
	},

	storeSliceData:function (index, data) {
		this.sliceData[index] = data;
	},

	resizeChart:function () {
		this.renderChart(true);
	},

	getDegrees:function (value, sum) {
		return value / sum * 360;
	},

	getSlice:function (index) {
		if (this.slices[index] === undefined) {
			this.slices[index] = new ludo.chart.PieSlice(this, this.getSliceStyle(index));
			this.slices[index].addEvent('highlight', this.toggleHighlight.bind(this));
		}
		return this.slices[index];
	},

	toggleHighlight:function (slice) {
		if (this.currentHighlighted && slice !== this.currentHighlighted && this.currentHighlighted.isHighlighted()) {
			this.currentHighlighted.highlight();
		}
		this.currentHighlighted = slice;
	},

	getSliceStyle:function (index) {
		if (this.styles[index] === undefined) {
			var color = this.data[index].color ? this.data[index].color : this.getColor(index);
			this.styles[index] = new ludo.canvas.Paint({
				'stroke-location':'inside',
				'fill':color,
				'stroke-linejoin':'round',
				'stroke':'#fff',
				'cursor':'pointer'
			});
			this.adopt(this.styles[index]);
		}
		return this.styles[index];
	},

	getColor:function (index) {
		return this.color().offsetHue(this.startColor, index * (360 / this.data.length));
	},

	updateChart:function () {
		if (this.animate) {
			var steps = this.getAnimationSteps(true);
			this.animateStep(0, steps);
		} else {
			this.renderChart();
		}
	},

	update:function(data){
		this.parent(data);
		this.renderChart();
	},

	getSum:function () {
		var sum = 0;
		for (var i = 0; i < this.data.length; i++) {
			sum += this.data[i].value;
		}
		return sum;
	},

	resize:function(config){
		this.parent(config);
		this.renderChart(true);
	}

});