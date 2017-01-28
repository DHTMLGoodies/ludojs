/**
 * Class for remote data source.
 * @namespace ludo.dataSource
 * @class ludo.dataSource.JSON
 * @augments ludo.dataSource.Base
 */
ludo.dataSource.JSON = new Class({
    Extends:ludo.dataSource.Base,
    type:'dataSource.JSON',

    _loaded:false,




    /**
     * Reload data from server
     * Components using this data-source will be automatically updated
     * @function load
     * @return void
     * @memberof ludo.dataSource.JSON.prototype
     */
    load:function () {
        if(this._url()){
            this.parent();
            this.sendRequest(this.getPostData());

        }
    },

    _url:function(){
        return this.url || ludo.config.getUrl();
    },

    sendRequest:function(data){
        this.parent();
        $.ajax({
            url: this._url(),
            method: 'post',
            cache: false,
            dataType: 'json',
            data: data,
            complete: function (response, status) {
                this._loaded = true;
                if(status == 'success'){
                    var json = response.responseJSON;
                    var data = this.dataHandler(json);
                    if(data === false){
                        this.fireEvent('fail', ['error', 'error', this]);
                    }else{
                        this.parseNewData(data, json);
                        this.fireEvent('success', [json, this]);

                    }
                }else{
                    this.fireEvent('fail', [response.responseText, status, this]);
                }
                
                this.fireEvent('complete');
                

            }.bind(this),
            fail: function (text, error) {
                console.log('error', error);
                this.fireEvent('fail', [text, error, this]);
                this.fireEvent('complete');
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