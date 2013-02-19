ludo.canvas.EventManager = new Class({
	nodes:{},
	currentNodeId:undefined,

	addMouseEnter:function (node, fn) {
		node.addEvent('mouseover', this.getMouseOverFn(fn));
		node.addEvent('mouseout', this.clearCurrent.bind(this, node));
	},

	addMouseLeave:function(node, fn){
		node.addEvent('mouseout', this.getMouseOutFn(fn));
		node.addEvent('mouseout', this.clearCurrent.bind(this, node));
	},

	clearCurrent:function(node){
		if(node.getEl().id === this.currentNodeId)this.currentNodeId = undefined;
	},

	getMouseOverFn:function (fn) {
		return function (e, node) {
			if(fn && !this.isInCurrentBranch(node)){
				this.currentNodeId = node.getEl().id;
				fn.call(node, e, node);
			}
		}.bind(this)
	},

	getMouseOutFn:function (fn) {
		return function (e, node) {
			if(fn && !this.isInCurrentBranch(node)){
				this.currentNodeId = undefined;
				fn.call(node, e, node);
			}
		}.bind(this)
	},

	isInCurrentBranch:function(leaf){
		if(!this.currentNodeId)return false;
		if(leaf.getEl().id === this.currentNodeId)return true;
		leaf = leaf.parentNode;
		while(leaf){
			if(leaf.getEl().id === this.currentNodeId)return true;
			leaf = leaf.parentNode;
		}
		return false;

	}
});
ludo.canvasEventManager = new ludo.canvas.EventManager();