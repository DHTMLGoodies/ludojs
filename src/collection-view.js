/**
 * Base class for List and tree.Tree
 * @class ludo.CollectionView
 * @param {Object} config
 * @param {String} config.emptyText Text to show on no data
 */
ludo.CollectionView = new Class({
    Extends: ludo.View,

    emptyText: undefined,

    __construct: function (config) {
        this.parent(config);
        this.setConfigParams(config, ['emptyText']);
    },

    ludoEvents: function () {
        this.parent();
        if (this.emptyText && !this.getDataSource().hasRemoteSearch()) {
            this.getDataSource().getSearcher().addEvents({
                'matches': this.hideEmptyText.bind(this),
                'noMatches': this.showEmptyText.bind(this)
            });
        }
    },

    hideEmptyText: function () {
        this.emptyEl().css('display', 'none');
    },

    showEmptyText: function () {
        var el = this.emptyEl();
        el.css('display', '');
        el.html(this.getEmptyText());

        el.css({
            top: this.getEl().height() / 2 - (el.height() / 2)
        });
    },

    emptyEl: function () {
        if (this._emptyEl === undefined) {
            this._emptyEl = jQuery('<div class="ludo-empty-text" style="width:100%;position:absolute">' + this.getEmptyText() + '</div>');
            this._emptyEl.css('z-index', 2000);
            this.getEl().append(this._emptyEl);
        }
        return this._emptyEl;
    },

    getEmptyText: function () {
        return ludo.util.isFunction(this.emptyText) ? this.emptyText.call() : this.emptyText;
    },

    _nodeContainer: undefined,

    nodeContainer: function () {
        if (this._nodeContainer === undefined) {
            this._nodeContainer = jQuery('<div style="position:relative">');
            this.getBody().append(this._nodeContainer);

        }
        return this._nodeContainer;
    },

    render: function () {
        if (this.emptyText) {
            var ds = this.getDataSource();

            var hasData = ds.isWaitingData() || ds.getCount() > 0;
            
            this[hasData ? 'hideEmptyText' : 'showEmptyText']();
        }
    },

    JSON: function () {

    }
});