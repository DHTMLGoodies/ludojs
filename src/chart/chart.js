ludo.chart.Chart = new Class({
	Extends: ludo.View,
	css:{

	},


    data:undefined,

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
		this.setConfigParams(config, ['dataProvider','data']);
        this.css.backgroundColor = '#fff';

        if(!this.dataProvider){
            this.dataProvider = this.createDependency('dataProvider',
                {
                    type : 'chart.DataProvider',
                    data : this.data
                }
            );
        }
	},

    ludoEvents:function(){
        this.parent();
        this.dataProvider.addEvent('update', this.setData.bind(this));
    },

	ludoRendered:function(){
		this.parent();
		this.updateChildren.delay(50, this);
	},

	updateChildren:function(){
		var d = this.getChartData();
		for(var i=0;i<this.children.length;i++){
			if(this.children[i].update)this.children[i].update(d);
		}
	},

	getChartData:function(){
		return this.dataProvider ? this.dataProvider.getData() : this.data;
	},

	setData:function(data){
		this.data = data;
		this.updateChildren();
	},

    getDataProvider:function(){
        return this.dataProvider;
    }
});