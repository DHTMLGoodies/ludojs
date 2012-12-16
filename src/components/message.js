ludo.Message = new Class({
    Extends : ludo.View,

    message : '',
    alignTo : null,
    verticleAlign : 'below',
    height : 30,
    fadeOutDelay : 1,

    offsets : {
        x : 0,
        y : 8
    },
    
    ludoConfig : function(config){
        this.parent(config);
        this.message = config.message || this.message;
        this.alignTo = document.id(config.alignTo);
        this.offsets = config.offsets || this.offsets;
        this.offsets.x = this.offsets.x || 0;
        this.offsets.y = this.offsets.y || 0;
        this.verticleAlign = config.verticleAlign;
        this.fadeOutDelay = config.fadeOutDelay || this.fadeOutDelay;
        this.els.parent = document.body;
    },

    ludoDOM : function() {
        this.parent();
        this.getEl().addClass('ludo-message');
        this.getEl().setStyle('position', 'absolute');
    },

    ludoRendered : function() {
        this.show();
        this.getBody().set('html', this.message);
        this.positionMessageBox();
        this.fadeOut.delay(this.fadeOutDelay * 1000, this);
    },

    positionMessageBox : function() {
        var pos = document.id(this.alignTo).getPosition();
        var left = pos.x+ this.offsets.x;
        var top = pos.y+ this.offsets.y
        if(this.verticleAlign == 'above'){
            top -= (this.height + this.offsets.y*2);
        }
        this.getEl().setStyles({
            left : left,
            top : top
        });
    },

    fadeOut : function() {
        this.getEl().fade('out');
        this.dispose.delay(1000, this);
    }


});