ludo.chart.Area = new Class({
    Extends: ludo.chart.Line,
    type:'chart.Area',
    showDots:false,
    revealAnim:false,
    halfInset:false,
    areaStyles:undefined,
    
    
    __construct:function(config){
        if(config.areaStyles != undefined)this.areaStyles = config.areaStyles;
        this.parent(config);    
    },
    
    getFragmentProperties:function(){
        return {
            filled: true
        }
    }
});