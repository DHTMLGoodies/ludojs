ludo.canvas.EventManager = new Class({
	nodes:{},
	currentNodeId:undefined,
    currentNodeFn:undefined,
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
            if(this.okToEnterAndLeave(fn, node)){
				this.currentNodeId = node.getEl().id;
                this.currentNodeFn = fn;
				fn.call(node, e, node);
			}
		}.bind(this)
	},

	getMouseOutFn:function (fn) {
		return function (e, node) {
            if(this.okToEnterAndLeave(fn, node)){
				this.currentNodeId = undefined;
                this.currentNodeFn = undefined;
				fn.call(node, e, node);
			}
		}.bind(this)
	},

    okToEnterAndLeave:function(fn, node){
        return fn && (!this.isInCurrentBranch(node) || fn != this.currentNodeFn);
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