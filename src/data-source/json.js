/**
 * Class for remote data source.
 * @namespace ludo.dataSource
 * @class ludo.dataSource.JSON
 * @augments ludo.dataSource.Base
 */
ludo.dataSource.JSON = new Class({
    Extends:ludo.dataSource.Base,
    type:'dataSource.JSON',

    /**
     * Reload data from server
     * Components using this data-source will be automatically updated
     * @function load
     * @return void
     * @memberof ludo.dataSource.JSON.prototype
     */
    load:function () {
        if(!this.url && !this.resource)return;
        this.parent();
        this.sendRequest(this.getPostData());
    },

    sendRequest:function(data){
        this.parent();
        $.ajax({
            url: this.url,
            method: 'post',
            cache: false,
            dataType: 'json',
            data: data,
            success: function (json) {

                var data = this.dataHandler(json);

                if(data === false){
                    this.fireEvent('fail', ['Validation error', 'Validation error', this]);
                }else{
                    this.parseNewData(data, json);
                    this.fireEvent('success', [json, this]);

                }
            }.bind(this),
            fail: function (text, error) {
                this.fireEvent('fail', [text, error, this]);
            }.bind(this)
        });
    },

    /**
     * Update data source with new data and trigger events "parseData",
     * @param {Array} data
     * @memberof ludo.dataSource.JSON.prototype
     */
    setData:function(data){
        this.parseNewData(data);
    },


    parseNewData:function (data) {

		this.parent();
		var firstLoad = !this.data;
		this.data = data;
        this.fireEvent('parsedata');
        this.fireEvent('load', [this.data, this]);

		if(firstLoad){
			this.fireEvent('firstLoad', [this.data, this]);
		}
    }
});

ludo.factory.registerClass('dataSource.JSON', ludo.dataSource.JSON);