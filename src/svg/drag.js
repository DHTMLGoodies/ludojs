/**
 Class for dragging {{#crossLink "canvas/Node"}}{{/crossLink}} elements.
 @namespace canvas
 @class ludo.svg.Drag
 @augments effect.Drag
 
 @param {Object} config, see {{#crossLink "effect/Drag"}}{{/crossLink}}
 @example
    var canvas = new ludo.svg.Canvas({
    	renderTo:document.body
    });

	var paintThree = new ludo.svg.Paint({
	  autoUpdate:true,
	  css:{
	  	  'fill' : '#DEF',
		  'stroke':'#888',
		  'stroke-width':'5',
		  cursor:'pointer'
	  }
	});
 	var circle = new ludo.svg.Circle({cx:280, cy:280, r:85}, { paint:paintThree });
    canvas.append(circle);

 	var drag = new ludo.svg.Drag();
 	drag.add(circle);
*/
ludo.svg.Drag = new Class({
	Extends:ludo.effect.Drag,
	
	ludoEvents:function () {
		this.parent();
		this.addEvent('before', this.setStartTranslate.bind(this));
	},

	setStartTranslate:function (node) {
		this.dragProcess.startTranslate = this.getPositionOf(node.el);
	},

	/**
	 * Add node
	 * @function add
	 * @param {ludo.effect.DraggableNode} node
	 * @return {effect.DraggableNode} added node
	 * @memberof ludo.svg.Drag.prototype
	 */
	add:function (node) {
		node = this.getValidNode(node);
		if (!node.handle)node.handle = node.el;
		var id = node.el.getEl().id;

		this.els[id] = Object.merge(node, {
			handle:node.handle
		});
		this.els[id].handle.on(ludo.util.getDragStartEvent(), this.startDrag.bind(this));
		return this.els[id];
	},

	getValidNode:function (node) {
		if (!this.isElConfigObject(node)) {
			node = {
				el:node
			};
		}
		node.el.set('forId', node.el.getEl().id);
		return node;
	},

	isElConfigObject:function (config) {
		return config.getEl === undefined;
	},

	getPositionedParent:function () {
		return undefined;
	},

	getIdByEvent:function (e) {
		var el = e.target || e.event.srcElement['correspondingUseElement'];
		var id = el.id;

		while(!this.els[id] && el.parentNode){
			el = el.parentNode;
			id = el.id;
		}

		return id;
	},
    startDrag:function(e){
        this.parent(e);
        this.dragProcess.startTranslate = this.els[this.dragProcess.dragged].el.getTranslate();
    },

	move:function (pos) {
		var node = this.els[this.dragProcess.dragged].el;
		var translate = {
			x:this.dragProcess.startTranslate[0],
			y:this.dragProcess.startTranslate[1]
		};


		if (pos.x !== undefined) {
			translate.x = pos.x;
			this.dragProcess.currentX = pos.x;
		}
		if (pos.y !== undefined) {
			translate.y = pos.y;
			this.dragProcess.currentY = pos.y;
		}
		node.setTranslate(translate.x, translate.y);


	},

    endDrag:function(e){
        if (this.dragProcess.active) {
            this.parent(e);
        }
    },

	getPositionOf:function (node) {
		var t = node.getTranslate();
		return {
			left : t[0], top: t[1]
		};
	}
});