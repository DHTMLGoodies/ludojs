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
	
	currentGroup:undefined,

	__construct:function(config){
		this.parent(config);
		this.layout.type = 'Canvas';
		this.getCanvas();

	},

	__rendered:function(){
		this.parent();
		this.getCanvas().on("mouseleave", this.enterGroup.bind(this));
	},

	updateChildren:function(){
		jQuery.each(this.children, function(index, child){
			if(child.rendered && child.update)child.onResize();
		});
	},
	
	insertJSON:function(){

	},

    resize:function(config){
        this.parent(config);
        this.updateChildren();
    },
	
	enterGroup:function(group){
		if(group.id != this.currentGroup){
			if(this.currentGroup){
				this.fireEvent('leavegroup', this.currentGroup);
			}
			this.currentGroup = group.id;
			this.fireEvent('entergroup', group.id);
		}
	}
});