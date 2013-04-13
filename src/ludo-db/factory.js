ludo.ludoDB.Factory = new Class({
    Extends:ludo.Core,
    ludoDBConfig:undefined,

    arguments:undefined,
    resource:undefined,
    url:undefined,

    ludoConfig:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['url', 'resource','arguments']);
        if(this.arguments && !ludo.util.isArray(this.arguments)){
            this.arguments = [this.arguments];
        }
        this.ludoDBConfig = config;
    },

    load:function () {
        var arguments = [this.resource];
        if(this.arguments)arguments.splice(1, 0, this.arguments);
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