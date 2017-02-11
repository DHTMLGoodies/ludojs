/**
 * Anchor Component
 * DELETED
 */
ludo.Anchor = new Class({
    Extends:ludo.View,
    type:'Anchor',
    height:15,
    __construct:function (config) {
        this.parent(config);
        this.anchorText = config.anchorText;
    },

    ludoDOM:function () {
        this.parent();
        this.els.anchor = new Element('a');
        this.els.anchor.addClass('ludo-anchor-text');
        this.els.anchor.html( this._html);
        this.els.anchor.setProperty('href', '#');
        this.els.anchor.addEvent('click', this.anchorClick.bind(this));
        this.$b().append(this.els.anchor);
    },

    ludoEvents:function () {
        this.parent();
        this.$b().addEvent('click', this.anchorClick.bind(this))
    },

    getAnchorTag:function () {
        return this.els.anchor;
    },

    anchorClick:function () {

        this.fireEvent('click', this);
        return false;
    }

});