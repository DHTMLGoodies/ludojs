ludo.DashboardItem_Twitter_RSS = new Class({
    Extends : ludo.DashboardItem_RSS,
    type : 'DashboardItem_Twitter_RSS',
    
    statusBar : {
        visible : false
    },
    titleBar : true,

    height : 200,
    icon : 'images/icon-twitter.gif',

    tpl :   '<div class="rss-item">' +
                '<div class="rss-item-content">{content}<br><i>({date})</i></div>' +
            '</div>',

    
    ludoConfig : function(config){
        this.parent(config);
        config.remote = config.remote || {};
        if(config.remote.screen_name){
            this.setDataForRemoteRequest('screen_name', config.remote.screen_name);
        }

    },

    getTplValue : function(key, value){
        if(key == 'title'){
            value = value.replace(/http:.*?$/g,'');
        }
        if(key == 'content'){
            value = this.getAnchorsAroundUrls(value);
        }
        return value;
    },

    getAnchorsAroundUrls : function(value){
        return value.replace(/(http\:.*?)($|\s)/g,'<a href="$1" onclick="window.open(this.href);return false">$1</a>');
    }



});