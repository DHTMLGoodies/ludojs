ludo.Tab = new Class({
    Extends : Events,

    els : {},
    component : null,
    title : null,
    tabStrip : null,

    initialize : function(config){
        if(config.listeners){
            this.addEvents(config.listeners);
        }
        this.tabStrip = config.tabStrip;
        this.component = config.component;
        this.component.addEvent('show', this.activateTabElement.bind(this));
        this.createElements();
    },

    createElements : function(){
        var el = this.els.el = new Element('div');
        ludo.dom.addClass(el, 'ludo-tab');
        el.set('html', this.component.getTitle());
        el.style.zIndex=5;
        this.title = this.component.getTitle();
        el.addEvent('click', this.show.bind(this));

        var left = new Element('div');
        ludo.dom.addClass(left, 'ludo-tab-left-ludo');
        left.setStyles({
            'position' : 'absolute',
            'left' : 0,
            'top' : 0
        });
        el.adopt(left);

        var right = new Element('div');
        ludo.dom.addClass(right, 'ludo-tab-right-ludo');
        right.setStyles({
            'position' : 'absolute',
            'right' : 0,
            'top' : 0
        });
        el.adopt(right);
    },

    getTitle : function(){
        return this.title;
    },
    getEl : function(){
        return this.els.el;
    },

    show : function(){
        this.fireEvent('beforeclick', this);
        this.activateTabElement();
        this.component.show();
        this.component.resize();
        this.component.resizeDOM();
        this.fireEvent('click', this);
    },

    activateTabElement : function() {
        this.tabStrip.deactivateAllTabElements();
        this.tabStrip.hideAllComponentsExcept(this.component);
        this.getEl().addClass('ludo-tab-active');
        this.getEl().setStyle('background-color', this.getActiveTabColor());
    },

    deactivateTabElement : function() {
        this.getEl().removeClass('ludo-tab-active');
        this.getEl().setStyle('background-color', '');
    },

    hide : function() {
        this.deactivateTabElement();
        this.component.hide();
    },

    getActiveTabColor : function() {
        var color = this.component.getBody().getStyle('background-color');
        if(color.indexOf('#') !== 0){
            color = this.component.getEl().getStyle('background-color');
        }
        if(color === 'transparent'){
            color = '#FFF';
        }
        return color;
    },

    width : undefined,
    getWidth : function() {
        if(this.width === undefined){
            this.width = this.getEl().getSize().x;
            this.width += ludo.dom.getMW(this.getEl());
        }
        return this.width;
    },

    getPosX : function() {
        return this.getEl().getPosition().x;
    }
});