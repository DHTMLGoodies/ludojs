/**
 Class for dragging {{#crossLink "canvas/Node"}}{{/crossLink}} elements.
 @namespace canvas
 @class Drag
 @extends effect.Drag
 @constructor
 @param {Object} config, see {{#crossLink "effect/Drag"}}{{/crossLink}}
 @example
    var canvas = new ludo.canvas.Canvas({
    	renderTo:document.body
    });

	var paintThree = new ludo.canvas.Paint({
	  autoUpdate:true,
	  css:{
	  	  'fill' : '#DEF',
		  'stroke':'#888',
		  'stroke-width':'5',
		  cursor:'pointer'
	  }
	});
 	var circle = new ludo.canvas.Circle({cx:280, cy:280, r:85}, { paint:paintThree });
    canvas.adopt(circle);

 	var drag = new ludo.canvas.Drag();
 	drag.add(circle);
*/
ludo.canvas.Drag = new Class({
	Extends:ludo.effect.Drag,

	ludoEvents:function () {
		this.parent();
		this.addEvent('before', this.setStartTranslate.bind(this));
	},

	setStartTranslate:function (node) {
		this.dragProcess.startTranslate = node.el.getTransformation('translate') || {x:0, y:0};
	},

	/**
	 * Add node
	 * @method add
	 * @param {ludo.effect.DraggableNode} node
	 * @return {effect.DraggableNode} added node
	 */
	add:function (node) {
		node = this.getValidNode(node);
		if (!node.handle)node.handle = node.el;
		var id = node.el.getEl().id;

		this.els[id] = Object.merge(node, {
			handle:node.handle
		});
		this.els[id].handle.addEvent(ludo.util.getDragStartEvent(), this.startDrag.bind(this));
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
    transformationExists:false,
    startDrag:function(e){
        this.parent(e);
        this.transformationExists = this.hasTransformation();
    },

    hasTransformation:function(){
        //
        var translate = this.els[this.dragProcess.dragged].el.get('transform');
        if(translate){
            var items = translate.split(/\s([a-z])/g);
            if(items.length > 1)return true;
            if(items.length === 0)return false;
            return items[0].split(/\(/g)[0] !== 'translate';
        }
        return false;
    },

	move:function (pos) {
		var node = this.els[this.dragProcess.dragged].el;
		var translate = {
			x:this.dragProcess.startTranslate.x,
			y:this.dragProcess.startTranslate.y
		};

		if (pos.x !== undefined) {
			translate.x = pos.x;
			this.dragProcess.currentX = pos.x;
		}
		if (pos.y !== undefined) {
			translate.y = pos.y;
			this.dragProcess.currentY = pos.y;
		}
		// return node.translate(translate.x, translate.y);
        if(this.transformationExists){
			node.translate(translate.x, translate.y);
            node.setTransformation('translate', translate.x + ' ' + translate.y);
        }else{
            node.el.setAttribute('transform', ['translate(', translate.x, ' ', translate.y, ')'].join('') );
            this.lastTranslate = translate;
        }
	},

    endDrag:function(e){
        if (this.dragProcess.active) {
            if(this.lastTranslate !== undefined){
                var node = this.els[this.dragProcess.dragged].el;
                node.setTransformation('translate', this.lastTranslate.x + ' ' + this.lastTranslate.y);
            }
            this.parent(e);
        }
    },

	getPositionOf:function (node) {
		return node.getTransformation('translate') || {x:0, y:0}
	}
});