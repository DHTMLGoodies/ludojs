if(!window.ludo){
    window.ludo = {};
}

ludo.dashboard.Tab = new Class({
    Extends: ludo.View,
    active : false,
    label : '',

    type : 'dashboard.Tab',
    cType : 'dashboard.Dashboard',

    dashboard : null,
    els : {
        el : null,
        tab : null
    },
    ludoConfig : function(config){
        config.width = '100%';
        this.parent(config);

        this.active = config.active || false;
        this.label = config.label;

        for(var i=0;i<this.children.length;i++){
            this.addEvent('show', this.children[i].resize.bind(this.children[i]));
        }
    },


    setTitle : function(title){
        this.parent(title);
        var cmp = this.getParent();
        if(cmp){
            cmp.setTabTitle(this, title);
        }
    },

    dispose : function(){
        var cmp = this.getParent();
        if(cmp){
            cmp.deleteTabElement(this);
        }
        this.parent();
    },

    setTabEl : function(el){
        this.els.tab = el;
    },

    getTabEl : function(){
        return this.els.tab;
    },

    ludoDOM : function() {
        this.parent();
        ludo.dom.addClass(this.els.body, 'Dashboard-tab-el');
        this.getEl().addClass('ludo-dashboard-tab');
        this.getBody().setStyle('overflow', 'visible');
        this.getBody().setStyle('overflow-y', 'auto');
        this.getBody().setStyle('overflow-x', 'hidden');
    },

    getLabel : function(){
        return this.label;
    },

    resize : function(config) {
        if(this.getParent()){
            this.getEl().setStyle('height', this.getParent().getInnerHeightOfBody());
        }
        this.getBody().setStyle('height', '100%');
 

        this.parent(config);
    },

    resizeChildren : function(){
        for(var i=0;i<this.children.length;i++){
            this.children[i].resize({ width : '100%', height : '100%' });
        }
    }

    
    
});