/**
 * Base class, paging buttons for datasource.Collection
 * Assign a paging element to a data source by sending "id" or config object of
 * the source using the dataSource constructor property
 * @namespace ludo.paging
 * @class ludo.paging.Button
 * @augments ludo.form.Button
 */
ludo.paging.Button = new Class({
    Extends: ludo.form.Button,
    type : 'grid.paging.Next',
    width:25,
    buttonCls : '',
	tpl:undefined,
	onLoadMessage:undefined,

    ludoDOM:function(){
        this.parent();
        this.getBody().addClass(this.buttonCls);
    },

    ludoEvents:function(){
        this.parent();
        this.dataSourceEvents();
    },

    dataSourceEvents:function(){
        var ds = ludo.get(this.dataSource);
        if(ds){
            this.addDataSourceEvents();
        }else{
            this.dataSourceEvents.delay(100, this);
        }
    },

    addDataSourceEvents:function(){},

	JSON:function(){}
});