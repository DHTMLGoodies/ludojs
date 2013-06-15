/**
 * Data source for progress bars
 * @namespace progress
 * @class DataSource
 * @extends dataSource.JSON
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

    /**
     * Reference to parent component
     * @property object Component
     */
    applyTo:undefined,
    requestId:'getProgress',

    ludoConfig:function(config){
        this.parent(config);

        if(config.pollFrequence)this.pollFrequence = config.pollFrequence;

        if(config.listenTo){
            ludo.remoteBroadcaster.withResourceService(config.listenTo).on('start', this.startProgress.bind(this));
        }
    },

    startProgress:function(){
        console.log('starting');
        this.stopped = false;
        this.fireEvent('start');
        this.load.delay(1000, this);
    },

    loadComplete:function (json) {
        this.fireEvent('load', json);

        if(json.data.percent<100 && !this.stopped){
            this.load.delay(this.pollFrequence * 1000, this);
        }else{
            if(json.data.percent>=100){
                this.finish();
            }
        }
    },

    getNewProgressBarId:function(){
        this.progressId = this.progressId = 'ludo-progress-' + String.uniqueID();
        return this.progressId;
    },

    getProgressId:function(){
        if(!this.progressId){
            this.setPostParam('progressBarId', this.getNewProgressBarId());
        }
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
    }
});