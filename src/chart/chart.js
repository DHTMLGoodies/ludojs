ludo.chart.Chart = new Class({
	Extends: ludo.View,
	css:{
		'background-color' : '#fff'
	},
	ludoConfig:function(config){
		this.parent(config);
		this.layout.type = 'Canvas';
		this.setConfigParams(config, ['dataProvider','data']);


	},

	ludoRendered:function(){
		this.parent();
		this.updateChildren.delay(50, this);
	},

	updateChildren:function(){
		var d = this.getChartData();
		for(var i=0;i<this.children.length;i++){
			this.children[i].update(d);
		}
	},

	getChartData:function(){
		return this.dataProvider ? this.dataProvider.getData() : this.data;
	},

	setData:function(data){
		this.data = data;
		this.updateChildren();
	}

});