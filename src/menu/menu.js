/**
 * Menu class
 * @namespace menu
 * @class Menu
 * @extends View
 */
ludo.menu.Menu = new Class({

    Extends : ludo.View,
    type : 'menu.Menu',
    cType : 'menu.MenuItem',
    /**
     * Direction of menu, "horizontal" or "vertical"
     * @property direction
     * @type String
     * @default horizontal
     */
    direction : 'horizontal',
    layout : { type : 'cols',width:'wrap' },
    menuItems : [],
    parentMenuItem : undefined,
    menuHandler : undefined,
    selectedRecord : undefined,
    selectedMenuItem : undefined,

    ludoConfig : function(config){
        this.menuItems = config.children;
        config.children = [];
        this.direction = config.direction || this.direction;
        this.parentMenuItem = config.parentMenuItem || this.parentMenuItem;
        if(this.direction === 'vertical'){
            config.height = 'auto';
			this.layout.type = 'rows';
        }

        this.parent(config);
    },

    ludoDOM : function(){
        this.parent();
        this.getEl().addClass('ludo-menu-' + this.direction);
        this.getEl().addClass('ludo-menu');
    },

    ludoRendered : function() {
        this.parent();
        if(!this.menuItems){
            return;
        }
        if(this.direction == 'horizontal'){
            var height = this.getInnerHeightOfBody();
        }
        var lm = this.getLayoutManager();
        var i;
        for(i=0;i<this.menuItems.length;i++){
            var item = this.getMenuItemConfigObject(this.menuItems[i]);

            item = lm.getNewComponent(item);
            this.menuItems[i] = item;
            this.getBody().adopt(item.getEl());

            if(this.direction == 'horizontal'){
                item.resize({ height : height, width : item.width ? item.width : undefined });
            }
        }
        if(this.direction === 'horizontal'){
            for(i=0;i<this.menuItems.length;i++){
                this.menuItems[i].getEl().setStyle('position', 'absolute');
            }
        }
        if(this.parentMenuItem){
            this.getEl().setStyle('position', 'absolute');
        }
        if(this.direction == 'horizontal'){
            this.resizeMenuItems.delay(100, this);
        }
        this.positionMenuItems();
    },

    resizeMenuItems : function() {
        var height = this.getInnerHeightOfBody();
        for(var i=0;i<this.menuItems.length;i++){
            this.menuItems[i].resize({ height : height });
        }
    },

    selectRecord : function(recordToSelect){
        if(this.selectedMenuItem){
            this.selectedMenuItem.deselect();
        }
        for(var i=0;i<this.menuItems.length;i++){
            var record = this.menuItems[i].getRecord();
            if(record){
                if(record.type && record.type == recordToSelect.type && record.id === recordToSelect.id){
                    this.menuItems[i].select();
                    this.selectedMenuItem = this.menuItems[i];
                }
            }
        }
    },

    getMenuItemConfigObject : function(obj){
        if(obj.substr){
            obj = {
                html : obj,
                type : 'menu.MenuItem'
            }
        }
        obj.menuDirection = this.direction;
        return obj;
    },

    positionMenuItems : function(){
        ludo.dom.clearCache();
        if(this.direction == 'horizontal'){
            var left = 0;
            for(var i=0;i<this.menuItems.length;i++){
                this.menuItems[i].getEl().setStyle('left', left);
                var width = this.menuItems[i].getMeasuredWidth();
                width += ludo.dom.getMBPW(this.menuItems[i].getEl());
                left += width;
            }
        }
    },

    getDirection : function(){
        return this.direction;
    },
    alignWithMenuItem : function(){
        if(!this.parentMenuItem){
            return;
        }
        var menuDirection = this.parentMenuItem.getMenuDirection();
        var coords = this.parentMenuItem.getEl().getCoordinates();
        var styles;
        if(menuDirection === 'horizontal'){
            styles = {
                left : coords.left,
                top : coords.top + coords.height
            }
        }else{
            var x = coords.left + coords.width;
            if(this.isEnoughSpaceToTheRight(x)){
            styles = {
                left : x,
                top : coords.top
            }
            }else{
                styles = {
                    left : coords.left - this.getEl().getSize().x,
                    top : coords.top
                }
            }
        }

        this.getEl().setStyles(styles);
    },

    isEnoughSpaceToTheRight : function(x) {
        return x + this.getEl().getSize().x <= document.body.clientWidth;
    },

    getMenuHandler : function(){
        if(!this.menuHandler){
            this.menuHandler = new ludo.menu.MenuHandler();
        }
        return this.menuHandler;
    },

    show:function(){
        this.parent();
        this.alignWithMenuItem();
    },
    addCoreEvents : function(){

    },

    click : function(menuItem){
        /**
         * Event fired when menu item is clicked
         * @event click
         * @param {Object} ludo.menu.MenuItem
         * @param {Object} ludo.menu.Menu
         */
        this.fireEvent('click', [menuItem, this]);
    },

    isMenu:function(){
        return true;
    }


});


