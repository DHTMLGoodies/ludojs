ludo.dialog.ProgressBar = new Class({
    Extends: ludo.dialog.Dialog,
    type : 'dialog.ProgressBar',
    width: 300,
    height : 120,
    modal : false,

    ludoConfig : function(config){
        this.parent(config);
    },

    ludoRendered : function(){
        this.parent();

        this.progressBar = this.addChild({
            type : 'remote.ProgressBar'
        });
        this.progressBar.addEvent('finish', this.autoHide.bind(this));
    },

    autoHide : function() {
        this.hide.delay(500, this);
    },

    startProgress : function(url, progressTemplateId){
        this.progressBar.startProgress(url, progressTemplateId);
    },
    getProgressId : function(){
        return this.progressBar.getProgressId();
    },
    sendInitRequest : function(){
        this.progressBar.sendInitRequest();
    },
    sendStatusRequest : function(){
        this.progressBar.sendStatusRequest();
    },
    setPercent : function(percent){
        this.progressBar.setPercent(percent);
    },

    animate : function(){
        this.progressBar.animate();
    },
    finish : function(){
        this.progressBar.finish();
    }
});