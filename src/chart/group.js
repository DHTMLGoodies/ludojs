ludo.chart.Group = new Class({
	Extends:ludo.canvas.Element,
	tag:'g',
	layout:{},
	colorHandler:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		this.setConfigParams(config, ['layout','containerCss','renderTo','parentComponent','animation']);
		this.renderTo.adopt(this);

		if(this.containerCss){
			this.node.setStyles(this.containerCss);
		}
	},

	resize:function (coordinates) {
		if (coordinates.width && coordinates.height){
			this.width = coordinates.width;
			this.set('width', coordinates.width + 'px');
			this.height = coordinates.height;
			this.set('height', coordinates.height + 'px');
		}
	},

	isHidden:function () {
		return false;
	},

	getChartOrigin:function () {
		return {
			x : this.width / 2,
			y : this.height /2
		}
	},

	update:function(data){
		this.data = data;
	},

	getCanvas:function(){
		return this.parentComponent.getCanvas();
	},

	getChartView:function(){
		return this.parentComponent;
	},

	color:function(){
		if(this.colorHandler === undefined){
			this.colorHandler = new ludo.color.Color();
		}
		return this.colorHandler;
	},

	getTooltipStyles:function(){
		var s = this.tooltip && this.tooltip.css ? this.tooltip.css : {};
		return Object.merge({
			'stroke-location':'inside',
			'fill-opacity':.7,
			'fill':'#fff',
			'stroke':'#008'
		}, s);
	}
});