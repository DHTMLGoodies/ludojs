ludo.chart.Area = new Class({
    Extends: ludo.chart.Line,
    type:'chart.Area',
    showDots:false,
    revealAnim:false,
    halfInset:false,
    getFragmentProperties:function(){
        return {
            filled: true
        }
    }
});