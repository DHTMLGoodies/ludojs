/**
 * Super class for all progress bar views
 * @namespace progress
 * @class ludo.progress.Base
 * @param {Object} config
 * @param {Boolean} config.hideOnFinish Hide View on finish. Default: true
 * @augments View
 * @fires ludo.progress.Base#finish Fired on finish(100%)
 */
ludo.progress.Base = new Class({
    Extends:ludo.View,
	applyTo:undefined,
    pollFrequence:1,
    url:undefined,
    onLoadMessage:'',

    hideOnFinish:true,

    defaultDS:'progress.DataSource',

    __construct:function (config) {
        this.parent(config);
        this.setConfigParams(config, ['applyTo','listenTo', 'pollFrequence','hideOnFinish']);

        if(this.applyTo)this.applyTo = ludo.get(this.applyTo);
        this.dataSource = this.dataSource || {};
        this.dataSource.pollFrequence = this.pollFrequence;
        this.dataSource.listenTo = this.listenTo;

        if(this.listenTo){
            ludo.remoteBroadcaster.withResourceService(this.listenTo).on('start', this.show.bind(this));
        }

        this.getDataSource().addEvents({
            'load' : this.insertJSON.bind(this),
            'start' : this.start.bind(this),
            'finish' : this.finishEvent.bind(this)
        });
    },

    start:function(){
        this.fireEvent('start');
        this.insertJSON({text:'',percent:0});
    },

    hideAfterDelay:function(){
        this.hide.delay(1000, this);
    },

    getProgressBarId:function () {
        return this.getDataSource().getProgressId();
    },

    stop:function () {
        this.getDataSource().stop();
    },

    proceed:function(){
        this.getDataSource().proceed();
    },
    /**
     * Finish progress bar manually
     * @function finish
     * @memberof ludo.progress.Base.prototype
     */
    finish:function () {
        this.getDataSource().finish();
    },

    finishEvent:function(){

        if (this.hideOnFinish) {
            this.hideAfterDelay();
        }

        /*
         * Event fired when progress bar is finished
         * @event render
         * @param Component this
         */
        this.fireEvent('finish');
        
    }
});