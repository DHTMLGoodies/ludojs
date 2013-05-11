ludo.chart.AddOn = new Class({
    Extends: ludo.Core,

    ludoConfig:function(config){
        this.parent(config);
        this.parentComponent = config.parentComponent;
    },

    getParent:function(){
        return this.parentComponent;
    }
});