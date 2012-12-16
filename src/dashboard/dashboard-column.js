ludo.dashboard.Column = new Class({
    Extends : ludo.View,
    type : 'dashboard.Column',
    cType : 'RichView',
    id : null,
    
    els : {
        el : null,
        parent : null
    },
    dashboard : null,


        movable : false,
        resizable : true,
        preserveAspectRatio : false,

    minWidth : 100,
    maxWidth : null,
    width : null,

    dragdrop : false,

    ludoConfig : function(config){
        this.parent(config);
        if(config.dragdrop || config.dragdrop === undefined) {
            this.dragdrop = true;
        }
    },

    resizeDOM : function(){
        var height = '100%';
        this.getBody().setStyle('height', height);
    },
    ludoDOM : function(){
        this.parent();
        var el = this.getEl();
        el.setStyles({
            'position' : 'absolute'
        });
        if(this.width){
            el.setStyle('width', this.width);
        }
        ludo.dom.addClass(el, 'ludo-dashboard-column');
        this.getBody().setStyle('height', '100%');
        if(this.dragdrop){
            this.getObjMovable().addTarget({ component : this });
        }
    }

});