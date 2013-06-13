/**
 * Super class for all progress bar views
 * @namespace progress
 * @class Base
 * @extends View
 */
ludo.progress.Base = new Class({
    Extends:ludo.View,
	applyTo:undefined,
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
        this.setConfigParams(config, ['applyTo','pollFrequence','hideOnFinish']);

        if (!this.applyTo) {
            this.applyTo = this.getParent();
        }
		this.applyTo = ludo.get(this.applyTo);

        this.dataSource = {
            url:this.getUrl(),
            type:'progress.DataSource',
            pollFrequence:this.pollFrequence,
            component:this.applyTo
        };

        this.applyTo.getForm().addEvent('beforeSave', this.show.bind(this));

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