ludo.TabStrip = new Class({
    Extends : Events,
    els : {

    },
    parentComponent : null,
    components : [],
    tabs : [],
    layout : null,

    initialize : function(config) {
        this.parentComponent = config.parentComponent;
        this.layout = this.parentComponent.getLayout();
        if(config.listeners){
            this.addEvents(config.listeners);
        }
        this.alterCSSOfParentComponent();
        this.createElements();
        this.injectEl();
    },

    alterCSSOfParentComponent : function() {
        this.parentComponent.getBody().addClass('ludo-component-content-tabs');
    },

    createElements : function() {
        var el = this.els.el = new Element('DIV');
        ludo.dom.addClass(el, 'ludo-tab-strip');
        if(this.layout.position == 'bottom'){
            ludo.dom.addClass(el, 'ludo-tab-strip-bottom');
        }else{
            ludo.dom.addClass(el, 'ludo-tab-strip-top');
        }
        el.setStyle('position', 'relative');
        this.els.content = new Element('div');
        this.els.content.setStyle('position', 'absolute');
        ludo.dom.addClass(this.els.content, 'ludo-tab-strip-content-container');
        this.els.el.adopt(this.els.content);

        var bg = new Element('div');
        bg.setStyles({
            'position' : 'absolute',
            'width' : '100%',
            'bottom' : '0px'
        });
        ludo.dom.addClass(bg, 'ludo-tab-strip-bg');

        this.els.content.adopt(bg);

        var l = this.els.arrowLeft = new Element('div');
        ludo.dom.addClass(l, 'ludo-tab-strip-arrow');
        ludo.dom.addClass(l, 'ludo-tab-strip-arrow-left');
        l.addEvent('click', this.slideLeft.bind(this));
        this.els.el.adopt(l);
        l.addEvent('mouseenter', this.mouseEnter.bind(this));
        l.addEvent('mouseleave', this.mouseLeave.bind(this));

        var r = this.els.arrowRight = new Element('div');
        ludo.dom.addClass(r, 'ludo-tab-strip-arrow');
        ludo.dom.addClass(r, 'ludo-tab-strip-arrow-right');
        r.addEvent('click', this.slideRight.bind(this));
        this.els.el.adopt(r);
        r.addEvent('mouseenter', this.mouseEnter.bind(this));
        r.addEvent('mouseleave', this.mouseLeave.bind(this));
        this.hideNavButtons();
    },
    mouseEnter : function(e) {
        ludo.dom.addClass(e.target, 'ludo-tab-over');
    },

    mouseLeave : function(e) {
        e.target.removeClass('ludo-tab-over');
    },
    
    slideRight : function() {
        var pos = this.getLeftPos();
        var maxLeft = this.getSlideMinimumLeft();
        if(pos <= maxLeft){
            return;
        }
        this.slideEffect(pos, Math.max(maxLeft, pos-this.getSlideSizeRight()));
    },

    slideLeft : function() {
        var maxLeft = this.getSlideMaximumLeft();
        var pos = this.getLeftPos();
        if(pos >= maxLeft){
            return;
        }
        this.slideEffect(pos, Math.min(maxLeft, pos+this.getSlideSizeLeft()));
    },

    getLeftPos : function() {
        return parseInt(this.els.content.getStyle('left').replace('px',''));
    },

    getSlideMinimumLeft : function() {
        return (this.getWidth() - this.getTabStripWidth() + this.getNavButtonWidth() + 5) *-1;

    },

    getSlideMaximumLeft : function() {
        return this.getNavButtonWidth();

    },

    getSlideSizeRight : function() {
        var rightludoPos = this.els.arrowRight.getPosition().x;
        for(var i=0, count = this.tabs.length; i<count; i++){
            var tabPos = this.tabs[i].getPosX();
            if(tabPos > rightludoPos){
                return tabPos - rightludoPos;
            }
        }
        return 100;
    },

    getSlideSizeLeft : function() {
        var leftpos = this.els.arrowLeft.getPosition().x + this.els.arrowLeft.getSize().x;
        for(var i=this.tabs.length-1; i>=0; i--){
            var tabPos = this.tabs[i].getPosX();
            if( tabPos<leftpos){
                return (tabPos - leftpos - 5) *-1;
            }
        }
        return 100;
    },

    slideEffect : function(from, to) {
        var myFx = new Fx.Morph(this.els.content, {
            duration : 200,
            unit : 'px'
        });
        myFx.start({
            'left' : [ from , to ]
        });
    },

    injectEl : function() {
        if(this.layout.position == 'bottom'){
            this.getEl().inject(this.parentComponent.getButtonBar(), 'before');
        }else{
            this.getEl().inject(this.parentComponent.getBody(), 'before');
        }
    },

    addChildren : function(children){
        for(var i=0;i<children.length;i++){
            this.addChild(children[i]);
        }
    },

    getCountItems : function(){
        return this.tabs.length;
    },

    addChild : function(child) {
        this.components.push(child);

        if(child.hideTitleBar){
            child.hideTitleBar();
        }
        if(child.hideStatusBar){
            child.hideStatusBar();
        }
        
        var tab = new ludo.Tab({
            component: child,
            tabStrip : this,
            listeners : {
                beforeclick: this.hideAllChildren.bind(this)
            }
        });
        child.getEl().addClass('ludo-view-container-aTab');
        this.tabs.push(tab);
        this.getBody().adopt(tab.getEl());
        this.fireEvent('add', this);
        return tab;
    },

    hideAllChildren : function() {
        for(var i=0;i<this.tabs.length;i++){
            this.tabs[i].hide();
        }
    },

    hideAllComponentsExcept : function(cmp){
        for(var i=0;i<this.components.length;i++){
            if(cmp.id != this.components[i].id){
                this.components[i].hide();
            }
        }
    },

    deactivateAllTabElements : function() {
        for(var i=0;i<this.tabs.length;i++){
            this.tabs[i].deactivateTabElement();
        }
    },

    getEl : function(){
        return this.els.el;
    },

    getBody : function() {
        return this.els.content;
    },

    showFirstActiveTab : function() {
        if(!this.tabs.length){
            return;
        }
        this.tabs[this.getIndexOfFirstActiveTab()].show();
    },

    getIndexOfFirstActiveTab : function() {
        for(var i=0;i<this.components.length;i++){
            if(this.components[i].isActive()){
                return i;
            }
        }
        return 0;
    },

    height : undefined,
    getHeight : function() {
        if(this.height === undefined){
            this.height = this.els.el.getSize().y;
        }
        return this.height;
    },

    getWidth : function() {
        var ret = 0;
        for(var i=0;i<this.tabs.length;i++){
            ret += this.tabs[i].getWidth();
        }
        return ret;
    },

    getTabStripWidth : function() {
        return this.getEl().getSize().x;
    },

    getWidthOfView : function() {
        return this.getTabStripWidth() - (this.getNavButtonWidth() * 2);
    },

    onComponentResize : function() {
        if(this.getWidth() > this.getTabStripWidth()){
            this.showNavButtons();
        }else{
            this.hideNavButtons();
        }
    },

    showNavButtons : function() {
        this.els.arrowRight.setStyle('display', '');
        this.els.arrowLeft.setStyle('display', '');
        this.els.content.setStyle('left', this.getNavButtonWidth());
    },

    hideNavButtons : function() {
        this.els.arrowRight.setStyle('display', 'none');
        this.els.arrowLeft.setStyle('display', 'none');
        this.els.content.setStyle('left', 0);
    },

    navButtonWidth : undefined,
    getNavButtonWidth : function() {
        if(!this.navButtonWidth){
            var size = this.els.arrowLeft.getSize().x;
            if(size === 0){
                return 30;
            }
            this.navButtonWidth = size;
        }
        return this.navButtonWidth;
    }



});