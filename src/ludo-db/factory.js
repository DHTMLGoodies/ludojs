/**
 Factory for automatic creation of children from server ludoDB config. This class is used
 internally by ludoJS when you specify a ludoDB config object in your view configuration.
 namespace ludoDB
 class Factory
 
 param config
 type {Object}
 augments ludo.Core
 example {lang Javascript}
    new ludo.Window({
        title:'LudoDB Integration',
        stateful:true,
        layout:{
            'width':500, height:400
        },
        children:[
            {
                'layout':{
                    type:'linear',
                    orientation:'vertical'
                },
                'ludoDB':{ // Creates children of this window automatically based on LudoDB model config
                    'resource':'LudoJSPerson',
                    'arguments':1,
                    'url':'../ludoDB/router.php'
                }
            }
        ],
        buttons:[
            { type:'form.SubmitButton', value:'Save' },
            { type:'form.CancelButton', value:'Cancel' }
        ]
    });
 */
ludo.ludoDB.Factory = new Class({
    Extends:ludo.Core,
    ludoDBConfig:undefined,

    arguments:undefined,
    resource:undefined,
    url:undefined,

    __construct:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['url', 'resource', 'arguments']);
        if (this.arguments && !ludo.util.isArray(this.arguments)) {
            this.arguments = [this.arguments];
        }
        this.ludoDBConfig = config;
    },

    load:function () {
        var arguments = [this.resource];
        if (this.arguments)arguments.splice(1, 0, this.arguments);
        var req = new ludo.remote.JSON({
            resource:'LudoJS',
            url:this.getUrl()
        });
        req.addEvent('success', this.loadComplete.bind(this));
        req.send('form', arguments);
    },

    loadComplete:function (req) {
        this.fireEvent('load', req.getResponseData());
    }

});