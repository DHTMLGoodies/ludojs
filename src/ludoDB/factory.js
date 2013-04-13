ludo.ludoDB.Factory = new Class({
    Extends:ludo.Core,
    ludoDBConfig:undefined,

    recordId:undefined,
    resource:undefined,
    url:undefined,

    ludoConfig:function (config) {
        if (config.id) {
            this.recordId = config.id;
            config.id = undefined;
        }
        this.parent(config);
        this.setConfigParams(config, ['url', 'resource']);

        this.ludoDBConfig = config;
    },

    load:function () {
        var arguments = [this.resource];
        if(this.recordId)arguments.push(this.recordId);
        var req = new ludo.remote.JSON({
            resource:'LudoJS',
            url : this.getUrl()
        });
        req.addEvent('success', this.loadComplete.bind(this));
        req.send('form', arguments);
    },

    loadComplete:function(req){
        this.fireEvent('load', req.getResponseData());
    }

});