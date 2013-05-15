ludo.chart.Chart = new Class({
	Extends: ludo.View,
	css:{

	},

    /**
     * Class providing data to the chart
     * @config {chart.DataProvider} dataProvider
     * @optional
     * @default undefined
     */
    dataProvider:undefined,

	ludoConfig:function(config){
		this.parent(config);
		this.layout.type = 'Canvas';
		this.setConfigParams(config, ['dataProvider']);
        this.css.backgroundColor = '#fff';

        if(!this.dataProvider){
            this.dataProvider = this.createDependency('dataProvider',
                {
                    type : 'chart.DataProvider',
                    data : config.data
                }
            );
        }
	},

	updateChildren:function(){
		for(var i=0;i<this.children.length;i++){
			if(this.children[i].rendered && this.children[i].update)this.children[i].onResize();
		}
	},

	getRecords:function(){
		return this.dataProvider.getRecords();
	},

    getDataProvider:function(){
        return this.dataProvider;
    },

    resize:function(config){
        this.parent(config);
        this.updateChildren();
    }
});