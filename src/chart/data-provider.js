ludo.chart.DataProvider = new Class({
    Extends: ludo.Core,
    data:undefined,

    ludoConfig:function(config){
        this.parent(config);
        this.setConfigParams(config, ['data']);
    },

    setData:function(data){
        this.data = data;
        this.update();
    },

    setValue:function(key, value){
        this.data[key].value = value;
    },

    getData:function(){
        return this.data;
    },

    update:function(){
        this.fireEvent('update', this.data);
    }
});