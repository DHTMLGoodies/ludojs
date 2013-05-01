ludo.chart.Pie = new Class({
    Extends:ludo.chart.ChartBase,
    slices:[],
    data:undefined,
    startColor:'#561AD9',
    styles:[],
    currentRadius:undefined,

    rendered:false,
    sliceData:[],
    startAngle:270,

    itemType : 'chart.PieSlice',

    renderChart:function (forUpdate) {
        if (!this.data)return;

        this.origo = this.getChartOrigin();

        this.currentRadius = Math.min(this.origo.x, this.origo.y) * .9;
        if (this.animate && (forUpdate || !this.rendered)) {
            this.renderSlices('animate');
        } else {
            this.renderSlices('render');
        }

        this.rendered = true;
    },

    getRadius:function(){
        return this.currentRadius;
    },

    getOrigo:function(){
        return this.origo;
    },

    renderSlices:function (method) {
        var d = this.data;
        var sum = this.getSum(d);
        var deg = this.startAngle;
        for (var i = 0; i < d.length; i++) {
            var slice = this.getChartItem(i);
            var sliceDegrees = this.getDegrees(d[i].value, sum);
            slice[method]({
                angle : deg,
                degrees : sliceDegrees
            });
            deg += sliceDegrees;
            if(deg > 360)deg-=360;
        }
    },

    getDegrees:function (value, sum) {
        return value / sum * 360;
    },

    getSum:function () {
        var sum = 0;
        for (var i = 0; i < this.data.length; i++) {
            sum += this.data[i].value;
        }
        return sum;
    }
});