ludo.remote.Shim = new Class({
    Extends:ludo.view.Shim,

    initialize:function (config) {
        this.parent(config);
        this.addShowHideEvents(config.remoteObj);
    },

    addShowHideEvents:function (obj) {
        if (obj) {
			obj.addEvents({
                'start':this.show.bind(this),
                'complete':this.hide.bind(this)
            });
        }
    }
});