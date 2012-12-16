/**
 * Class for remote data source.
 * @namespace dataSource
 * @class JSON
 * @extends dataSource.Base
 */
ludo.dataSource.JSON = new Class({
    Extends:ludo.dataSource.Base,
    type:'dataSource.JSON',

    /**
     * Reload data from server
     * Components using this data-source will be automatically updated
     * @method load
     * @return void
     */
    load:function () {
        this.parent();
        this.JSONRequest(this.requestId, { onSuccess:this.loadComplete, data:this.getQuery() });
    },

    loadComplete:function (json) {
		this.parent();
        this.data = json.data;
        this.fireEvent('parsedata');
        this.fireEvent('load', json);
    },

    getQuery:function(){
        return this.query;
    }
});

ludo.factory.registerClass('dataSource.JSON', ludo.dataSource.JSON);