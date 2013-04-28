ludo.chart.Pie = new Class({
    Extends:ludo.chart.Base,
    title:'Chart title',
    slices:[],
    data:[],
    startColor:'#561AD9',
    styles:[],
    currentRadius:undefined,
    animation:{
        duration:1,
        fps:33
    },

    sliceData:[],

    currentHighlighted : undefined,

    ludoConfig:function (config) {
        this.parent(config);
        this.startDegree = 270;
    },

    renderChart:function (skipAnimation) {
        this.data = this.getChartData();
        this.origo = this.getChartOrigion();
        this.currentRadius = Math.min(this.origo.x, this.origo.y) * .8;

        if(this.animate && !skipAnimation){
            this.animateSlices();
        }else{
            this.renderSlices();
        }
    },
    renderSlices:function () {
        var d = this.data;
        var sum = this.getSum(d);
        var deg = this.startDegree;
        for (var i = 0; i < d.length; i++) {
            var slice = this.getSlice(i);
            var sliceDegrees = this.getDegrees(d[i].value, sum);
            slice.render({
                radius:this.currentRadius,
                startDegree:deg,
                degrees:sliceDegrees,
                origo:this.origo,
                offsetFromOrigo:0
            });
            deg += sliceDegrees;
        }
    },

    animateSlices:function () {
        var steps = this.getAnimationSteps();

        this.animateStep(0, steps);
    },

    animateStep:function(currentStep, data){
        for (var i = 0; i < this.data.length; i++) {
            var slice = this.getSlice(i);
            slice.render({
                radius:data.slices[i][currentStep].radius,
                startDegree:data.slices[i][currentStep].start,
                degrees:data.slices[i][currentStep].degrees,
                origo:this.origo,
                offsetFromOrigo:0
            });
        }

        if(currentStep <= data.count){
            this.animateStep.delay(this.animation.fps, this, [currentStep+1, data]);
        }
    },

    getAnimationSteps:function () {
        var sum = this.getSum(this.data);
        var ret = {
            count:this.animation.fps * this.animation.duration,
            slices:[]
        };
        var sliceDegrees = [];

        for (var i = 0; i < this.data.length; i++) {
            sliceDegrees.push(this.getDegrees(this.data[i].value, sum));
            ret.slices[i] = [];
        }

        for (var j = 0; j < ret.count; j++) {
            var deg = this.startDegree;
            for (i = 0; i < this.data.length; i++) {
                if (j === 0) {
                    ret.slices[i].push({
                        radius:0,
                        degrees:0,
                        start:deg
                    });
                }

                var degree = sliceDegrees[i] * j / ret.count;
                ret.slices[i].push({
                    radius:this.currentRadius * j / ret.count,
                    degrees:degree,
                    start : deg
                });

                deg += degree;
            }
        }
        deg = this.startDegree;
        for (i = 0; i < this.data.length; i++) {
            ret.slices[i].push({
                radius:this.currentRadius,
                degrees:sliceDegrees[i],
                start : deg
            });
            deg += sliceDegrees[i];
        }

        return ret;
    },

    resizeChart:function () {
        this.renderChart(true);
    },

    getDegrees:function (value, sum) {
        return value / sum * 360;
    },

    getSlice:function (index) {
        if (this.slices[index] === undefined) {
            this.slices[index] = new ludo.chart.PieSlice(this, this.getPaint(index));
            this.slices[index].addEvent('highlight', this.toggleHighlight.bind(this));
        }
        return this.slices[index];
    },

    toggleHighlight:function(slice){
        if(this.currentHighlighted && slice !== this.currentHighlighted && this.currentHighlighted.isHighlighted()){
            this.currentHighlighted.highlight();
        }
        this.currentHighlighted = slice;
    },

    getPaint:function (index) {
        if (this.styles[index] === undefined) {
            var color = this.data[index].color ? this.data[index].color : this.getColor(index);
            this.styles[index] = new ludo.canvas.Paint({
                'stroke-location':'inside',
                'fill':color,
                'stroke':'#fff',
                'cursor':'pointer'
            });
            this.getCanvas().adopt(this.styles[index]);
        }
        return this.styles[index];
    },

    getColor:function (index) {
        return this.color().offsetHue(this.startColor, index * (360 / this.getChartData().length));
    },

    getSum:function (chartData) {
        var sum = 0;
        for (var i = 0; i < chartData.length; i++) {
            sum += chartData[i].value;
        }
        return sum;
    }
});