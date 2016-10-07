/**
 * Text input for navigating to a specific page in a datasource.Collection
 * @namespace paging
 * @class PageInput
 * @extends form.Number
 */
ludo.paging.PageInput = new Class({
    Extends: ludo.form.Number,
    type : 'grid.paging.PageInput',
    width: 35,
    fieldWidth:30,
    minValue : 1,
    reverseWheel:true,

    ludoEvents:function(){
        this.parent();
        this.dataSourceEvents();
    },

    dataSourceEvents:function(){
        if(ludo.get(this.dataSource)){
            var ds = this.getDataSource();
            if(ds){
                ds.addEvent('page', this.setPageNumber.bind(this));
                ds.addEvent('load', this.updateMaxValue.bind(this));
                this.setPageNumber(ds.getPageNumber());
                this.addEvent('change', this.updateDataSourcePageNumber.bind(this));
                this.updateMaxValue();
            }

        }else{
            this.dataSourceEvents.delay(100, this);
        }
    },
    setPageNumber:function(number){
        this.value = number;
        this.els.formEl.val(number);
    },

    updateDataSourcePageNumber:function(){
        this.getDataSource().toPage(this.getValue());
    },

    updateMaxValue:function(){
        this.maxValue = this.getDataSource().getPageCount();
    },

	insertJSON:function(){

	}
});