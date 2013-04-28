ludo.chart.Pie = new Class({
    Extends:ludo.chart.Base,
    title:'Chart title',
    slices:[],
    data:[],
    startColor : '#561AD9',
    styles:[],

    ludoConfig:function(config){
        this.parent(config);
        this.startDegree = Math.round(Math.random() * 360);
    },

    renderChart:function () {
        var d = this.data = this.getChartData();
        var sum = this.getSum(d);
        var origo = this.getChartOrigion();
        var radius = Math.min(origo.x, origo.y) * .8;
        var deg = this.startDegree;

        for(var i=0;i< d.length;i++){
            var slice = this.getSlice(i);
            var sliceDegrees = this.getDegrees(d[i].value, sum);
            slice.render({
                radius : radius,
                startDegree : deg,
                degrees : sliceDegrees,
                origo : origo,
                offsetFromOrigo : 0
            });
            deg += sliceDegrees;
        }

    },

    resizeChart:function(){
        this.renderChart();
    },

    getDegrees:function(value, sum){
        return value / sum * 360;
    },

    getSlice:function(index){
        if(this.slices[index] === undefined){
            this.slices[index] = new ludo.chart.PieSlice(this,this.getPaint(index));
        }
        return this.slices[index];
    },

    getPaint:function(index){
        if(this.styles[index] === undefined){
            var color = this.data[index].color ? this.data[index].color : this.getColor(index);
            this.styles[index] = new ludo.canvas.Paint({
                'stroke-location':'inside',
                'fill' : color,
                'stroke' : '#fff',
                'cursor' : 'pointer'
            });
            this.getCanvas().adopt(this.styles[index]);
        }
        return this.styles[index];
    },

    getColor:function(index){
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