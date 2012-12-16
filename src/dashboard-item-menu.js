
ludo.DashboardItemMenu = new Class({
    Extends : Events,
    els : {
        el : null,
        icon : null,
        text : null,
        alignTo : null,
        currentHighlightedItem : null,
        menuItems : []
    },
    active : null,

    align : 'right',

    menuConfig : [
    ],

    initialize : function(config) {
        this.menuConfig = config.menuConfig || this.menuConfig;
        if(config.alignTo){
            this.els.alignTo = document.id(config.alignTo);
        }
        this.align = config.align || this.align;
        this.width = config.width;
        if(config.listeners){
            this.addEvents(config.listeners);
        }
        this.createElements();

        document.body.addEvent('click', this.autoHide.bind(this));
    },

    setAlignTo : function(el){
        this.els.alignTo = el;
    },

    createElements : function() {
        var el = this.els.el = new Element('div');
        ludo.dom.addClass(el, 'ludo-dashboard-menu');
        el.setStyle('display','none');
        document.body.adopt(el);
        if(this.width){
            el.setStyle('width', this.width);
        }
        this.createMenuItems();
    },
    
    createMenuItems : function() {
        this.clearMenuItems();
        var el;
        for(var i=0;i<this.menuConfig.length;i++) {
            if(this.isHidden(this.menuConfig[i])){

            }else if(this.isSpacer(this.menuConfig[i])){
                el = new Element('div');
                ludo.dom.addClass(el, 'ludo-dashboard-menu-item-spacer');
            }else{
                el = this.els.menuItems[i] = new Element('div');
                ludo.dom.addClass(el, 'ludo-dashboard-menu-item');

                if(this.menuConfig[i].disabled){
                    ludo.dom.addClass(el, 'ludo-dashboard-menu-item-disabled');
                }else{
                    el.addEvent('mouseover', this.mouseoverMenuItem.bind(this));
                    el.addEvent('mouseout', this.mouseoutMenuItem.bind(this));
                    el.addEvent('click', this.clickOnMenuItem.bind(this));
                }

                if(this.menuConfig[i].listeners){
                    el.addEvents(this.menuConfig[i].listeners)
                }

                el.setProperty('menu-index', i);
                var icon = new Element('div');
                ludo.dom.addClass(icon, 'ludo-dashboard-menu-item-icon');
                if(this.menuConfig[i].icon){
                    icon.setStyle('background-image', 'url(' + this.menuConfig[i].icon + ')');
                }
                el.adopt(icon);

                if(this.menuConfig[i].type && this.menuConfig[i].type == 'checkbox'){
                    var checkEl = new Element('input');
                    checkEl.setProperty('type', 'checkbox');
                    icon.adopt(checkEl);
                    if(this.menuConfig[i].checked){
                        checkEl.setProperty('checked', true);
                    }
                }

                var text = new Element('div');
                text.set('html', this.menuConfig[i].label);
                ludo.dom.addClass(text, 'ludo-dashboard-menu-item-text');
                el.adopt(text);
            }
            this.els.el.adopt(el);
        }
    },

    isHidden : function(menuItemConfig){
        return menuItemConfig.hidden ? true : false
    },

    isSpacer : function(menuItemConfig){
        return menuItemConfig.spacer ? true : false
    },

    clearMenuItems : function() {
        this.clearDomElements('.ludo-dashboard-menu-item');
        this.clearDomElements('.ludo-dashboard-menu-item-spacer');
    },

    clearDomElements : function(cls){
        var els = this.els.el.getElements(cls);
        for(var i=els.length-1;i>=0;i--){
            els[i].dispose();
        }
    },

    clickOnMenuItem : function(e) {
        this.updateMenuItemDom(e.target);

        var menuConfigIndex = this.getMenuItemIndex(e.target);
        this.updateMenuItemConfig(menuConfigIndex);
        var events = ['click'];
        if(this.menuConfig[menuConfigIndex].event){
            events.push(this.menuConfig[menuConfigIndex].event);
        }
        for(var i=0;i<events.length;i++){
            this.fireEvent(events[i], [ this.menuConfig[menuConfigIndex], this, e]);
        }

        this.hide();

    },

    updateMenuItemDom : function(clickEl) {
        var menuConfigIndex = this.getMenuItemIndex(clickEl);
        if(this.menuConfig[menuConfigIndex].type == 'checkbox' && clickEl.tagName.toLowerCase()!='input'){
            var el = this.els.menuItems[menuConfigIndex].getElement('input');
            el.setProperty('checked', el.getProperty('checked'));
        }
    },

    updateMenuItemConfig : function(index) {
        if(this.menuConfig[index].type == 'checkbox'){
            this.menuConfig[index].checked = this.els.menuItems[index].getElements('input')[0].checked ? true : false;
        }
    },

    getMenuConfigByDomElement : function(el){
        return this.menuConfig[this.getMenuItemIndex(el)];
    },

    getMenuItemIndex : function(el) {
        el = this.getMenuItemEl(el);
        return el.getProperty('menu-index');
    },

    getMenuItemEl : function(el){
        if(!el.hasClass('ludo-dashboard-menu-item')){
            el = el.getParent('.ludo-dashboard-menu-item');
        }
        return el;
    },



    mouseoverMenuItem : function(e){
        this.getMenuItemElByEl(e).addClass('ludo-dashboard-menu-item-over');
    },
    mouseoutMenuItem: function(e) {
        this.getMenuItemElByEl(e).removeClass('ludo-dashboard-menu-item-over');
    },

    getMenuItemElByEl : function(e) {
        var el = e.target;
        if(!el.hasClass('ludo-dashboard-menu-item')){
            el = el.getParent('.ludo-dashboard-menu-item');
        }
        return el;
    },
    
    toggle : function() {
        if(this.active){
            this.hide();
        } else {
            this.show.delay(20, this);
        }
    },

    show : function() {
        this.fireEvent('show', this);

        
        if(this.menuConfig.length == 0){
            return;
        }
        this.els.el.setStyle('display','');
        this.els.el.setStyle('visibility','hidden');
        this.positionMenu();
        this.positionAndSetVisibility.delay(50, this);
        this.active = true;
    },

    positionAndSetVisibility : function() {
        this.els.el.setStyle('visibility','visible');
        this.positionMenu();
    },

    isActive : function() {
        return this.active;
    },


    hide : function() {
        this.els.el.setStyle('display','none');
        this.active = false;
        this.fireEvent('hide', this);
    },

    autoHide : function(e){
        if(this.active && !e.target.getParent('.ludo-dashboard-menu')){
            this.hide();
        }
    },

    positionAt : function (x, y){
        this.els.el.setStyles({
            left : x,
            top : y
        });
    },

    positionMenu : function() {
        if(!this.els.alignTo){
            return;
        }
        var coords =  this.els.alignTo.getCoordinates();
        var leftPos = coords.left;
        if(this.align == 'right') {
            var size = this.els.el.getSize();
            leftPos -= size.x;
            leftPos +=  coords.width;
        }

        this.els.el.setStyles({
            left : leftPos,
            top : coords.top + coords.height
        });
    },

    setNewMenuConfig : function(menuConfig){
        this.menuConfig = menuConfig;
        this.createMenuItems();
    }
});