/**
 * Base class, paging buttons for datasource.Collection
 * Assign a paging element to a data source by sending "id" or config object of
 * the source using the dataSource constructor property
 * @namespace paging
 * @class Button
 * @extends form.Button
 */
ludo.paging.Button = new Class({
    Extends: ludo.form.Button,
    type : 'grid.paging.Next',
    width:25,
    buttonCls : '',

    ludoDOM:function(){
        this.parent();
        this.getBody().addClass(this.buttonCls);
    },

    ludoEvents:function(){
        this.parent();
        var ds = this.getDataSource();
        if(ds){
            this.addDataSourceEvents();
        }
    },
    addDataSourceEvents:function(){

    },

	insertJSON:function(){

	}
});