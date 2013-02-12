if(!window.ludo){
    window.ludo = {};
}
// TODO refactor this to support setting and getting ludoJS config parameters.
// LUDOJS_CONFIG should be dropped.
ludo.SystemConfig = new Class({
    relativePath : './',

    initialize : function(){

    },

    getRealPath : function(url){
        if(url.indexOf('http:') == 0){
            return url;
        }
        return this.relativePath + url;
    },
    
    setRelativePath : function(relativePath){
        this.relativePath = relativePath;
    }

});

ludo_Config = new ludo.SystemConfig();