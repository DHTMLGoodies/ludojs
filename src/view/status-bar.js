ludo.view.StatusBar = new Class({
    Extends: ludo.Core,

    text:undefined,
    icon:undefined,

    el:undefined,
    textEl:undefined,
    iconEl:undefined,

    hidden:false,

    ludoConfig:function(config){
        this.parent(config);
        this.text = config.text;
        this.icon = config.icon;
        this.createDOM();
    },

    createDOM:function(){
        var el = this.el = new Element('div');
        ludo.dom.addClass(el, 'ludo-component-statusbar');

        var statusIcon = this.iconEl = new Element('div');
        ludo.dom.addClass(statusIcon, 'ludo-component-statusbar-icon');
        if (this.icon) {
            statusIcon.setStyle('background-image', 'url(' + this.icon + ')');
        } else {
            statusIcon.setStyle('display', 'none');
        }
        el.adopt(statusIcon);

        var statusText = this.textEl = new Element('div');
        ludo.dom.addClass(statusText, 'ludo-component-statusbar-text');
        if (this.text) {
            statusText.set('html', this.text);
        }
        el.adopt(statusText);
    },

    getEl:function(){
        return this.el;
    },

    hideIcon:function(){
        this.iconEl.style.visibility = 'hidden';
    },

    setText:function(text){
        this.textEl.set('html', text);
    },

    showIcon:function(icon){
        this.iconEl.setStyle('display', '');
        if (icon !== undefined) {
            this.iconEl.setStyle('background-image', 'url(' + icon + ')');
        }
    },
    hide:function(){
        this.el.style.display='none';
        this.hidden = true;
    },

    getHeight:function(){
        var ret = this.el.getSize();
        if (ret.y == 0) {
            ret.y = 1;
        } else {
            ret.y += ludo.dom.getMH(this.el);
        }
        return ret.y;
    }
});