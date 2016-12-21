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

	__construct:function(config){
		this.parent(config);
		this.layout.type = 'Canvas';
	},

	updateChildren:function(){
		jQuery.each(this.children, function(index, child){
			if(child.rendered && child.update)child.onResize();
		});
	},

	__rendered:function(){
		this.parent();
		var c = this.getCanvas();
		c.css('position', 'relative');
		c.node.on("mouseenter", this.enter.bind(this));
		c.node.on("mouseleave", this.leave.bind(this));
	},

	enter:function(e){
		//console.log("enter", e.target);
	},

	leave:function(e){
		//console.log("leave", e.target);
	},

	insertJSON:function(){

	},

    resize:function(config){
        this.parent(config);
        this.updateChildren();
    }
});