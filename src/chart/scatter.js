ludo.chart.Scatter = new Class({
    Extends:ludo.chart.Base,
    fragmentType:'chart.ScatterSeries',
    type:'chart.Scatter',
    revealAnim:true,

    getTooltipPosition:function(){
        return 'above';
    }

});