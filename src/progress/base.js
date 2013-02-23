/**
 * Super class for all progress bar views
 * @namespace progress
 * @class Base
 * @extends View
 */
ludo.progress.Base = new Class({
    Extends:ludo.View,
    component:undefined,
    pollFrequence:1,
    url:undefined,
    onLoadMessage:'',
    /**
     * Hide progress bar on finish
     * @attribute {Boolean} hideOnFinish
     */
    hideOnFinish:true,

    ludoConfig:function (config) {
        this.parent(config);
        if (config.component !== undefined)this.component = config.component;
        if (config.pollFrequence !== undefined)this.pollFrequence = config.pollFrequence;
        if (config.hideOnFinish !== undefined)this.hideOnFinish = config.hideOnFinish;

        if (!this.component) {
            this.component = this.getParent();
        }
        this.dataSource = {
            url:this.getUrl(),
            type:'progress.DataSource',
            pollFrequence:this.pollFrequence,
            component:this.component
        };

        this.component.getFormManager().addEvent('beforesubmit', this.show.bind(this));

        this.getDataSource().addEvent('load', this.insertJSON.bind(this));
        this.getDataSource().addEvent('start', this.start.bind(this));
        if (this.hideOnFinish) {
            this.getDataSource().addEvent('finish', this.hideAfterDelay.bind(this));
        }
        this.getDataSource().addEvent('finish', this.finishEvent.bind(this));
    },

    start:function(){
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
     * @method finish
     */
    finish:function () {
        this.getDataSource().finish();
    },

    finishEvent:function(){
        /**
         * Event fired when progress bar is finished
         * @event render
         * @param Component this
         */
        this.fireEvent('finish');
    }
});