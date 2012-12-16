/**
 * Class for remote data source.
 * @namespace dataSource
 * @class HTML
 * @extends dataSource.Base
 */
ludo.dataSource.HTML = new Class({
    Extends:ludo.dataSource.Base,
    type:'dataSource.HTML',


    getSourceType:function () {
        return 'HTML';
    },

    /**
     * Reload data from server
     * Components using this data-source will be automatically updated
     * @method load
     * @return void
     */
    load:function () {
        this.parent();
        this.Request(this.requestId, { onSuccess:this.loadComplete, data:this.query });
    },

    loadComplete:function (html) {
		this.parent();
        this.data = html;
        this.fireEvent('load', this.data);
    }
});