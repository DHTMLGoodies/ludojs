
if(!window.ludo){
    window.ludo = {};
}

ludo.dashboard.DashboardWithTabs = new Class({
    Extends: ludo.View,

    type : 'TabbedDashboard',
    cType : 'dashboard.Tab',
    
    els : {
        el : null,
        parent : null,
        tabContainer : null,
        contentContainer : null,
        tabs : []
    },

    defaultConfigNewTab : {
        title : 'New tab',
        children : [
            {
            children : [
                {

                }
            ]
            }
        ]
    },

    indexOfActiveTab : null,

    ludoConfig : function(config){
        this.parent(config);
        this.expand = config.expand || false;
    },

    ludoDOM : function() {
        this.parent();
        this.createTabElements();
        this.addTabForNewDashboard();
        this.getEl().setStyle('height', '100%');
        this.getEl().setStyle('width', '100%');
        this.getBody().setStyle('width', '100%');
        this.getEl().addClass('ludo-tabbed-dashboard');
        this.resizeDOM();
    },

    ludoRendered : function() {
        this.showActiveTab();
    },

    createTabElements : function() {
        
        var el = this.els.tabContainer = new Element('div');
        ludo.dom.addClass(el, 'ludo-tab-container');
        this.getEl().adopt(el);

        contentEl = this.getBody();
        ludo.dom.addClass(contentEl, 'ludo-tab-container-content');
        this.getEl().adopt(this.getBody());
    },

    addChild : function(item) {
        item = this.parent(item);
        this.addTab(item);
        if(item.setTabEl){
            item.setTabEl(this.els.tabs[this.els.tabs.length-1].textEl);
        }
    },
    addTab : function(item) {
        var tabEl = new Element('div');
        ludo.dom.addClass(tabEl, 'ludo-tab');
        this.indexOfActiveTab = item.isActive() ? this.els.tabs.length : this.indexOfActiveTab;

        var titleEl = new Element('span');
        titleEl.id = 'tabbed-dashboard-title-' + String.uniqueID();
        titleEl.set('html', item.getTitle());
        
        tabEl.adopt(titleEl);

        var textField = new Element('input');
        textField.setStyle('display', 'none');
        textField.addEvent('blur', this.changeTitle.bind(this));

        tabEl.adopt(textField);
        
        tabEl.setStyle('position', 'relative');
        tabEl.setProperty('tab-index', this.els.tabs.length);
        tabEl.addEvent('click', this.activateTab.bind(this));
        tabEl.addEvent('mouseover', this.autoActivate.bind(this));
        tabEl.addEvent('dblclick', this.editTabTitle.bind(this));
        this.els.tabContainer.adopt(tabEl);

        if(Browser.ie){
            var leftCorner = new Element('div');
            ludo.dom.addClass(leftCorner, 'tab-left-corner');
            leftCorner.setStyles({
                'position' : 'absolute',
                'left' : '0px',
                'top' : '0px'
            });
            tabEl.adopt(leftCorner);

            var rightCorner = new Element('div');
            ludo.dom.addClass(rightCorner, 'tab-right-corner');
            rightCorner.setStyles({
                'position' : 'absolute',
                'right' : '0px',
                'top' : '0px'
            });
            tabEl.adopt(rightCorner);
        }

        var closeEl = new Element('div');
        ludo.dom.addClass(closeEl, 'ludo-tab-close-button');
        closeEl.addEvent('mouseover', this.mouseOverCloseButton.bind(this));
        closeEl.addEvent('mouseout', this.mouseOutCloseButton.bind(this));
        closeEl.addEvent('click', this.deleteTab.bind(this));
        tabEl.adopt(closeEl);
        if(!item.isClosable()){
            closeEl.setStyle('display', 'none');
        }

        var tabSpacer = new Element('div');
        ludo.dom.addClass(tabSpacer, 'ludo-tab-spacer');
        this.els.tabContainer.adopt(tabSpacer);

        this.els.tabs.push({
            itemId : item.getId(),
            tab : tabEl,
            textField : textField,
            textEl : titleEl,
            spacer : tabSpacer,
            content : item.getEl()
        });

        if(this.els.tabDynamicNew){
            this.els.tabContainer.adopt(this.els.tabDynamicNew);
        }


    },

    getTabForItem : function(item){
        for(var i=0;i<this.els.tabs.length;i++){
            if(this.els.tabs[i].itemId == item.getId()){
                return this.els.tabs[i];
            }
        }
    },

    setTabTitle : function(item, title){
        var tab = this.getTabForItem(item);
        if(tab){
            tab.textEl.set('html', title);
        }
    },

    hideTabForItem : function(item){
        var tab = this.getTabForItem(item);
        if(tab){
            tab.tab.setStyle('display','none');
        }
    },

    editTabTitle : function(e) {

        var index = this.getTabIndex(e.target);
        this.editTab(index);
    },

    editTab : function(index){

        if(index != this.indexOfActiveTab){
            return;
        }
        this.els.tabs[index].textField.setStyle('width', Math.max(20, this.els.tabs[index].textEl.getCoordinates().width));
        this.els.tabs[index].textEl.setStyle('display', 'none');
        this.els.tabs[index].textField.setStyle('display', '');
        this.els.tabs[index].textField.focus();
        this.els.tabs[index].textField.select.delay(20, this.els.tabs[index].textField);
        this.els.tabs[index].textField.set('value', this.els.tabs[index].textEl.get('html'));
    },

    changeTitle : function(e) {
        var newTitle = e.target.get('value');
        this.children[this.indexOfActiveTab].setTitle(newTitle);
        this.els.tabs[this.indexOfActiveTab].textEl.set('html', newTitle);
        this.els.tabs[this.indexOfActiveTab].textEl.setStyle('display', '');
        this.els.tabs[this.indexOfActiveTab].textField.setStyle('display', 'none');

    },

    mouseOverCloseButton : function(e) {
        ludo.dom.addClass(e.target, 'ludo-tab-close-button-over');
    },
    mouseOutCloseButton : function(e){
        e.target.removeClass('ludo-tab-close-button-over');
    },

    deleteTabElement : function(item){
        this.deleteTabByIndex(this.getItemIndex(item));
    },

    getItemIndex : function(item){
        return this.children.indexOf(item);
    },

    deleteTab : function(e) {
        var index = this.getTabIndex(e.target.getParent());
        if(index >= 0){
            this.children[index].dispose();
        }
        this.disposeItem(index);
        this.deleteTabByIndex(index);
        e.stop();
    },

    deleteTabByIndex : function(index){

        if(index == -1){
            return;
        }

        this.els.tabs[index].tab.dispose();
        this.els.tabs[index].spacer.dispose();
        this.els.tabs.erase(this.els.tabs[index]);
        this.children.erase(this.children[index]);
        for(var i=0;i<this.els.tabs.length;i++){
            this.els.tabs[i].tab.setProperty('tab-index', i);
        }
        if(this.indexOfActiveTab == index){
            this.indexOfActiveTab = Math.min(index, this.children.length-1);
            this.showActiveTab();
        }

    },

    addTabForNewDashboard : function() {
        var tabEl = new Element('div');
        ludo.dom.addClass(tabEl, 'ludo-tab');
        tabEl.set('html', '+');
        this.els.tabContainer.adopt(tabEl);
        tabEl.addEvent('click', this.createDynamicTab.bind(this));

        this.els.tabDynamicNew = tabEl;
        if(!this.expand){
            tabEl.setStyle('display', 'none');
        }

    },

    createDynamicTab : function() {
        this.addChild(this.defaultConfigNewTab);
        this.indexOfActiveTab = this.children.length-1;
        this.showActiveTab();
        this.editTab(this.indexOfActiveTab);

    },

    autoActivate : function(e) {
        if(this.isDragDropActive()){
            this.activateTab(e);
        }
    },


    showTab : function(id){
        for(var i=0;i<this.children.length;i++){
            if(this.children[i].id == id){
                this.indexOfActiveTab = i;
                this.showActiveTab();
                return;
            }
        }
    },

    activateTab : function(e) {
        this.indexOfActiveTab = this.getTabIndex(e.target);
        this.showActiveTab();
    },

    showActiveTab : function(){
        if(!this.children.length){
            return;
        }
        this.deactivateAll();
        if(!this.indexOfActiveTab){
            this.indexOfActiveTab = 0;
        }

        this.children[this.indexOfActiveTab].show();
        this.els.tabs[this.indexOfActiveTab]ludo.dom.addClass(.tab, 'ludo-tab-active');
        this.els.tabs[this.indexOfActiveTab].content.setStyle('display','');
        this.fireEvent('show', this.indexOfActiveTab);
        this.hideSpacersAroundActiveTab();
    },

    hideSpacersAroundActiveTab : function() {
        var index = this.getIndexOfActiveTab();
        this.hideSpacerEl(index-1);
        this.hideSpacerEl(index);
        if(!this.expandable){
            this.hideSpacerEl(this.children.length-1);
        }
    },

    hideSpacerEl : function(index) {
        if(index < 0 || index >= this.children.length){
            return;
        }
        this.els.tabs[index].spacer.setStyle('visibility', 'hidden');
    },

    getIndexOfActiveTab : function() {
        return this.indexOfActiveTab;
    },

    deactivateAll : function() {
        for(var i=0;i<this.children.length;i++){
            this.deactivateTab(i);
        }
    },

    deactivateTab : function(index) {
        this.els.tabs[index].tab.removeClass('ludo-tab-active');
        this.children[index].hide();
        this.els.tabs[index].spacer.setStyle('visibility','visible');
    },

    getTabIndex : function(el){
        var ret = el.getProperty('tab-index');
        if(!ret){
            ret = el.getParent().getProperty('tab-index');
        }
        ret = ret /1;
        return ret;
    },

    getDragDropObjectOfFirstItem : function(){
        if(this.children[0].getObjMovable){
            return this.children[0].getObjMovable();
        }
        return null;
    },

    ludoEvents : function() {
        this.parent();
        document.id(window).addEvent('resize', this.resize.bind(this));

    },

    resizeDOM : function() {

        this.getBody().setStyle('height', this.getNewHeightOfContent());

    },
    
    getNewHeightOfContent : function() {
        var ret = this.getEl().getSize().y;
        ret -= this.els.tabContainer.getSize().y;
        return ret;
    },

    getNewWidthOfContent : function() {
        return this.getEl().getSize().x;
    },


    resizeChildren : function(){
        for(var i=0;i<this.children.length;i++){
            this.children[i].resize({ width : '100%', height : '100%' });
        }
    }



});