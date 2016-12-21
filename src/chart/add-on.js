ludo.chart.AddOn = new Class({
    Extends: ludo.Core,
    
    __construct:function(config){
        this.parent(config);
        this.parentComponent = config.parentComponent;
    },

    getParent:function(){
        return this.parentComponent;
    },

    getDataSource: function(){
        return this.parentComponent.getDataSource();
    },

    chart:function(){
        return this.parentComponent.chart();
    }
});