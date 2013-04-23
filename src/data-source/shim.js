ludo.dataSource.Shim = new Class({
    Extends:ludo.view.Shim,

    initialize:function (config) {
        this.parent(config);
        this.addDataSourceEvents(config.dataSource);
    },

    addDataSourceEvents:function (ds) {
        if (ds) {
            ds.addEvents({
                'beforeload':this.show.bind(this),
                'load':this.hide.bind(this)
            });
            if (ds.isLoading())this.show();
        }
    }
});