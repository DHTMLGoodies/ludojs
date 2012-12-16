ludo.DashboardItem_RSS = new Class({
    Extends : ludo.RichView,
    type : 'DashboardItem_RSS',
    
    statusBar : {
        visible : false
    },
    titleBar : true,


    height : 200,
    icon : 'images/icon-rss.gif',
    
    remote : {
        url : 'rss-reader/get.php',
        isJSON : true
    },

    tpl : '<div class="rss-item">' +
            '<div class="rss-item-title"><a href="{permalink}" onclick="window.open(this.href);return false">{title}</a> <br><i>({date})</i></div>' +
            '<div class="rss-item-content">{content}</div>' +
           '</div>',
    
    ludoConfig : function(config){
        this.parent(config);
        config.remote = config.remote || {};

        if(config.remote.feed){
            this.setDataForRemoteRequest('feed', config.remote.feed);
        }
        if(config.remote.limit){
            this.setDataForRemoteRequest('limit', config.remote.limit);
        }

    },
    receiveJSON : function(json){
        this.data = json.data;
        this.setTitle(json.title);

        this.insertJSON(json);
    },
    insertJSON : function(feed){
        
        this.setTitle(feed.title);
        this.parseContentTemplate(feed.items);
    }
});