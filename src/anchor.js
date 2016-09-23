/**
 * Anchor Component
 * @class Anchor
 * @extends View
 */
ludo.Anchor = new Class({
    Extends:ludo.View,
    type:'Anchor',
    height:15,
    ludoConfig:function (config) {
        this.parent(config);
        this.anchorText = config.anchorText;
    },

    ludoDOM:function () {
        this.parent();
        this.els.anchor = new Element('a');
        this.els.anchor.addClass('ludo-anchor-text');
        this.els.anchor.set('html', this.html);
        this.els.anchor.setProperty('href', '#');
        this.els.anchor.addEvent('click', this.anchorClick.bind(this));
        this.getBody().append(this.els.anchor);
    },

    ludoEvents:function () {
        this.parent();
        this.getBody().addEvent('click', this.anchorClick.bind(this))
    },

    getAnchorTag:function () {
        return this.els.anchor;
    },

    anchorClick:function () {
        /**
         * Click on anchor
         * @event click
         * @param {Object} component
         */
        this.fireEvent('click', this);
        return false;
    }

});