ludo.dataSource.Shim = new Class({
    Extends: ludo.view.Shim,

    initialize:function(config){
        this.parent(config);
        this.addDataSourceEvents(config.dataSource);
    },

    addDataSourceEvents:function (ds) {
        if (ds) {
            ds.addEvent('beforeload', this.show.bind(this));
            ds.addEvent('load', this.hide.bind(this));
            if (ds.isLoading())this.show();
        }
    }
});