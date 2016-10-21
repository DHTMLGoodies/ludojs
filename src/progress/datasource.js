/**
 * Data source for progress bars
 * @namespace progress
 * @class DataSource
 * @augments dataSource.JSON
 */
ludo.progress.DataSource = new Class({
    Extends:ludo.dataSource.JSON,
    type:'progress.DataSource',
    singleton:true,
    autoload:false,
    progressId:undefined,
    stopped : false,
    pollFrequence : 1,

    resource:'LudoDBProgress',
    service:'read',
	listenTo:undefined,

    ludoConfig:function(config){
        this.parent(config);

		this.setConfigParams(config, ['pollFrequence','listenTo']);

        if(this.listenTo){
            ludo.remoteBroadcaster.withResourceService(this.listenTo).on('start', this.startProgress.bind(this));
        }
    },

    startProgress:function(){
		this.inject();
        this.stopped = false;
        this.fireEvent('start');
        this.load.delay(1000, this);
    },

	inject:function(){
		ludo.remoteInject.add(this.listenTo, {
			LudoDBProgressID : this.getNewProgressBarId()
		});
	},

    loadComplete:function (data) {
        this.fireEvent('load', data);
        if(data.percent<100 && !this.stopped){
            this.load.delay(this.pollFrequence * 1000, this);
        }else{
            if(data.percent>=100){
                this.finish();
            }
        }
    },

    getNewProgressBarId:function(){
        this.progressId = this.progressId = 'ludo-progress-' + String.uniqueID();
		this.arguments = this.progressId;
        return this.progressId;
    },

    getProgressId:function(){
        return this.progressId;
    },

    stop:function(){
        this.stopped = true;
        this.fireEvent('stop');
    },

    proceed : function(){
        this.stopped = false;
        this.load();
    },

    finish:function(){
        this.stopped = true;
        this.progressId = undefined;
        this.fireEvent('finish');
		this.inject();
    }
});