ludo.svg.EventManager = new Class({
	nodes:{},
	currentNodeId:undefined,
    currentNodeFn:undefined,

	currentNode:undefined,

	addMouseEnter:function (node, fn) {
		node.on('mouseover', this.getMouseOverFn(fn));

	},

	addMouseLeave:function(node, fn){
		node.on('mouseout', this.getMouseOutFn(fn));

	},

	getMouseOverFn:function (fn) {
		return function (e, node) {
			if(!e.event.relatedTarget || !this.contains(node.getEl(), e.event.relatedTarget) ){
				fn.call(node, e, node);
			}

		}.bind(this)
	},

	contains:function(parent, child){
		if(parent.childNodes && parent.childNodes.length > 0){
			return this._contains(parent.childNodes, child);
		}
		return false;
	},

	_contains:function(children, child){
		for(var i=0,len = children.length;i<len;i++){
			var c = children[i];
			if(c == child)return true;
			if(c.childNodes && c.childNodes.length > 0){
				var found = this._contains(c.childNodes,child );
				if(found )return true;
			}
		}
		return false;
	},

	getMouseOutFn:function (fn) {
		return function (e, node) {
			if(!e.event.relatedTarget || !this.contains(node.getEl(), e.event.relatedTarget) ){
				fn.call(node, e, node);
			}
		}.bind(this)
	}
});
ludo.canvasEventManager = new ludo.svg.EventManager();