/**
 * Parent View for all Charts. You build the charts by adding child views(ludo.chart.*).
 * Child views are always rendered using a <a href="layout.Relative.html">relative</a> layout model.
 * @class ludo.chart.Chart
 * @namespace ludo.chart
 */
ludo.chart.Chart = new Class({
	Extends: ludo.View,
	css:{

	},
    /*
     * Class providing data to the chart
     * @config {chart.DataProvider} dataProvider
     * @optional
     * @default undefined
     */
    dataProvider:undefined,

	__construct:function(config){
		this.parent(config);
		this.layout.type = 'Canvas';
	},

	updateChildren:function(){
		for(var i=0;i<this.children.length;i++){
			if(this.children[i].rendered && this.children[i].update)this.children[i].onResize();
		}
	},

	getRecords:function(){
		return this.dataProvider.getRecords();
	},

	insertJSON:function(){

	},


    getDataProvider:function(){
        return this.dataProvider;
    },

    resize:function(config){
        this.parent(config);
        this.updateChildren();
    }
});