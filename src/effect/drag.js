/**
 * Class for dragging DOM elements.
 @namespace ludo.effect
 @class ludo.effect.Drag
 @augments ludo.effect.Effect

 @param {Object} config
 @param {Number} config.minX Optional minimum left coordinate
 @param {Number} config.maxX Optional maximum left coordinate
 @param {Number} config.minY Optional minimum top coordinate
 @param {Number} config.maxY Optional maximum top coordinate
 @param {Number} config.maxY Optional maximum top coordinate
 @param {String|HTMLElement} config.el This element is draggable.
 @param {String|HTMLElement} config.handle Optional dom element. Mouse down on this element will initiate the drag process. example: A title bar above a view. If not set, Mouse down on this.el will initiate dragging.
 @param {String} config.directions Accept dragging in these directions, default: "XY". For horizontal dragging only, use "X" and for vertical "Y".
 @param {Number} config.minPos Alternative to minX and minY when you only accepts dragging along the X or Y-axis.
 @param {Number} config.maxPos Alternative to maxX and maxY when you only accepts dragging along the X or Y-axis.
 @param {Number} config.delay Optional delay in seconds from mouse down to dragging starts. Default: 0
 @param {Boolean} config.useShim True to drag a "ghost" DOM element while dragging, default: false
 @param {String} config.shimCls Name of css class to add to the shim
 @param {Boolean} config.autoHideShim True to automatically hide shim on drag end, default: true
 @param {Number} config.mouseYOffset While dragging, always show dragged element this amount of pixels below mouse cursor.
 @param {Number} config.mouseXOffset While dragging, always show dragged element this amount of pixels right of mouse cursor.
 @param {String} config.unit Unit used while dragging, default: "px"


 @fires ludo.effect.Drag#before Event fired before drag starts. Params: 1) Dom element to be dragged, 2) ludo.effect.Drag, 3) {x,y}
 @fires ludo.effect.Drag#start Event when drag starts. Params: 1) Dom element to be dragged, 2) ludo.effect.Drag, 3) {x,y}
 @fires ludo.effect.Drag#drag' Event when drag ends. Params: 1) Dom element to be dragged, 2) ludo.effect.Drag, 3) {x,y}
 @fires ludo.effect.Drag#end' Event when drag ends. Params: 1) {x,y}, 2) dragged node 3) ludo.effect.Drag
 @fires ludo.effect.Drag#showShim' Event fired when shim DOM node is shown. Argument: 1) Shim DOM Node, 2) ludo.effect.Drag
 @fires ludo.effect.Drag#flyToShim' Event fired after flyBack animation is complete. Arguments: 1) ludo.effect.Drag, 2) Shim DOM node
 @fires ludo.effect.Drag#flyBack' Event fired when shim DOM node is shown. Argument: Arguments: 1) ludo.effect.Drag, 2) Shim DOM node


 @example
 <style type="text/css">
 .ludo-shim {
		 border: 15px solid #AAA;
		 background-color: #DEF;
		 margin: 5;
		 opacity: .5;
		 border-radius: 5px;
	}
 .draggable{
		width:150px;
		z-index:1000;
		height:150px;
		border-radius:5px;
		border:1px solid #555;
		background-color:#DEF
	}
 </style>
 <div id="draggable" class="draggable">
 I am draggable
 </div>
 <script type="text/javascript">
 var d = new ludo.effect.Drag({
		useShim:true,
		 listeners:{
			 endDrag:function(dragged, dragEffect){
				 dragEffect.getEl().setStyles({
					 left : dragEffect.getX(),
					 top: dragEffect.getY()
				 });
			 },
			 drag:function(pos, dragEffect){
				 dragEffect.setShimText(dragEffect.getX() + 'x' + dragEffect.getY());
			 }
		 }
	 });
 d.add('draggable'); // "draggable" is the id of the div
 </script>

 */
ludo.effect.Drag = new Class({
    Extends: ludo.effect.Effect,


    handle: undefined,

    el: undefined,


    minX: undefined,

    minY: undefined,


    maxX: undefined,

    maxY: undefined,


    minPos: undefined,

    maxPos: undefined,

    directions: 'XY',


    unit: 'px',

    dragProcess: {
        active: false
    },

    coordinatesToDrag: undefined,

    delay: 0,

    inDelayMode: false,

    els: {},


    useShim: false,


    autoHideShim: true,


    shimCls: undefined,

    mouseYOffset: undefined,


    mouseXOffset: undefined,

    fireEffectEvents: true,

    __construct: function (config) {
        this.parent(config);
        if (config.el !== undefined) {
            this.add({
                el: config.el,
                handle: config.handle
            });
        }

        this.setConfigParams(config, ['useShim', 'autoHideShim', 'directions', 'delay', 'minX', 'maxX', 'minY', 'maxY',
            'minPos', 'maxPos', 'unit', 'shimCls', 'mouseYOffset', 'mouseXOffset', 'fireEffectEvents']);
    },

    ludoEvents: function () {
        this.parent();
        this.getEventEl().on(ludo.util.getDragMoveEvent(), this.drag.bind(this));
        this.getEventEl().on(ludo.util.getDragEndEvent(), this.endDrag.bind(this));
        if (this.useShim) {
            this.addEvent('start', this.showShim.bind(this));
            if (this.autoHideShim) {
                this.addEvent('end', this.hideShim.bind(this));
            }
        }
    },

    /**
     Add draggable object
     @function add
     @param {effect.DraggableNode|String|HTMLDivElement} node
     @memberof ludo.effect.Effect.prototype
     @return {effect.DraggableNode}
     @example
     dragObject.add({
			el: 'myDiv',
			handle : 'myHandle'
		});
     handle is optional.

     @example
     dragObject.add('idOfMyDiv');

     You can also add custom properties:

     @example
     dragobject.add({
	 		id: "myReference',
			el: 'myDiv',
			column: 'city'
		});
     ...
     ...
     dragobject.addEvent('before', beforeDrag);
     ...
     ...
     function beforeDrag(dragged){
	 		console.log(dragged.el);
	 		console.log(dragged.column);
	 	}
     */
    add: function (node) {
        node = this.getValidNode(node);
        var el = $(node.el);
        this.setPositioning(el);

        var handle = node.handle ? $(node.handle) : el;

        handle.attr("id",  handle.id || 'ludo-' + String.uniqueID());
        handle.addClass("ludo-drag");

        handle.on(ludo.util.getDragStartEvent(), this.startDrag.bind(this));
        handle.attr('forId', node.id);
        this.els[node.id] = Object.merge(node, {
            el: $(el),
            handle: handle
        });
        return this.els[node.id];
    },

    /**
     * Remove node
     * @function remove
     * @param {String} id
     * @return {Boolean} success
     * @memberof ludo.effect.Effect.prototype
     */
    remove: function (id) {
        if (this.els[id] !== undefined) {
            var el = $("#" + this.els[id].handle);
            el.off(ludo.util.getDragStartEvent(), this.startDrag.bind(this));
            this.els[id] = undefined;
            return true;
        }
        return false;
    },

    removeAll: function () {
        var keys = Object.keys(this.els);
        for (var i = 0; i < keys.length; i++) {
            this.remove(keys[i]);
        }
        this.els = {};
    },

    getValidNode: function (node) {
        if (!this.isElConfigObject(node)) {
            node = {
                el: $(node)
            };
        }
        if (typeof node.el === 'string') {
            if (node.el.substr(0, 1) != "#")node.el = "#" + node.el;
            node.el = $(node.el);
        }
        node.id = node.id || node.el.attr("id") || 'ludo-' + String.uniqueID();
        if (!node.el.attr("id"))node.el.attr("id", node.id);
        node.el.attr('forId', node.id);
        return node;
    },

    isElConfigObject: function (config) {
        return config.el !== undefined || config.handle !== undefined;
    },

    setPositioning: function (el) {
        if (!this.useShim) {
            el.css('position', 'absolute');
        } else {
            var pos = el.css('position');
            if (!pos || (pos != 'relative' && pos != 'absolute')) {
                el.css('position', 'relative');
            }
        }
    },

    getById: function (id) {
        return this.els[id];
    },

    getIdByEvent: function (e) {
        var el = $(e.target);
        if (!el.hasClass('ludo-drag')) {
            el = el.closest('.ludo-drag');
        }
        return el.attr('forId');
    },


    getDragged: function () {
        return this.els[this.dragProcess.dragged];
    },

    /**
     * Returns reference to draggable DOM node
     * @function getEl
     * @return {HTMLElement} DOMNode
     * @memberof ludo.effect.Effect.prototype
     */
    getEl: function () {
        return this.els[this.dragProcess.dragged].el;
    },

    getShimOrEl: function () {
        return this.useShim ? this.getShim() : this.getEl();
    },

    getSizeOf: function (el) {
        return el.outerWidth !== undefined ? {x: el.outerWidth(), y: el.outerHeight()} : {x: 0, y: 0};
    },

    getPositionOf: function (el) {

        return $(el).position();
    },

    setDragCoordinates: function () {
        this.coordinatesToDrag = {
            x: 'x', y: 'y'
        };
    },
    startDrag: function (e) {
        var id = this.getIdByEvent(e);

        var el = this.getById(id).el;

        var size = this.getSizeOf(el);
        var pos;
        if (this.useShim) {
            pos = el.position();
        } else {
            var parent = this.getPositionedParent(el);
            pos = parent ? el.getPosition(parent) : this.getPositionOf(el)
        }

        var x = pos.left;
        var y = pos.top;

        var p = e.touches != undefined && e.touches.length > 0 ? e.touches[0] : e;

        this.dragProcess = {
            active: true,
            dragged: id,
            currentX: x,
            currentY: y,
            elX: x,
            elY: y,
            width: size.x,
            height: size.y,
            mouseX: p.pageX,
            mouseY: p.pageY
        };

        var dp = this.dragProcess;

        dp.el = this.getShimOrEl();

        this.fireEvent('before', [this.els[id], this, {x: x, y: y}]);

        if (!this.isActive()) {
            return undefined;
        }

        dp.minX = this.getMinX();
        dp.maxX = this.getMaxX();
        dp.minY = this.getMinY();
        dp.maxY = this.getMaxY();
        dp.dragX = this.canDragAlongX();
        dp.dragY = this.canDragAlongY();

        if (this.delay) {
            this.setActiveAfterDelay();
        } else {

            this.fireEvent('start', [this.els[id], this, {x: x, y: y}]);

            if (this.fireEffectEvents)ludo.EffectObject.start();
        }

        if(!ludo.util.isTabletOrMobile()){
            return false;
        }


    },

    getPositionedParent: function (el) {

        var parent = el.parentNode;
        while (parent) {
            var pos = parent.getStyle('position');
            if (pos === 'relative' || pos === 'absolute')return parent;
            parent = parent.getParent();
        }
        return undefined;
    },

    /**
     Cancel drag. This method is designed to be called from an event handler
     attached to the "beforeDrag" event.
     @function cancelDrag
     @memberof ludo.effect.Effect.prototype
     @example
     // Here, dd is a {{#crossLink "effect.Drag"}}{{/crossLink}} object
     dd.on('before', function(draggable, dd, pos){
	 		if(pos.x > 1000 || pos.y > 500){
	 			dd.cancelDrag();
			}
	 	});
     In this example, dragging will be cancelled when the x position of the mouse
     is greater than 1000 or if the y position is greater than 500. Another more
     useful example is this:
     @example
     dd.on('before', function(draggable, dd){
		 	if(!this.isDraggable(draggable)){
		 		dd.cancelDrag()
		 	}
		});
     Here, we assume that we have an isDraggable method which returns true or false
     for whether the given node is draggable or not. "draggable" in this example
     is one of the {{#crossLink "effect.DraggableNode"}}{{/crossLink}} objects added
     using the {{#crossLink "effect.Drag/add"}}{{/crossLink}} method.
     */

    cancelDrag: function () {
        this.dragProcess.active = false;
        this.dragProcess.el = undefined;
        if (this.fireEffectEvents)ludo.EffectObject.end();
    },

    getShimFor: function (el) {
        return el;
    },

    setActiveAfterDelay: function () {
        this.inDelayMode = true;
        this.dragProcess.active = false;
        this.startIfMouseNotReleased.delay(this.delay * 1000, this);
    },

    startIfMouseNotReleased: function () {
        if (this.inDelayMode) {
            this.dragProcess.active = true;
            this.inDelayMode = false;
            this.fireEvent('start', [this.getDragged(), this, {x: this.getX(), y: this.getY()}]);
            ludo.EffectObject.start();
        }
    },

    drag: function (e) {
        if (this.dragProcess.active && this.dragProcess.el) {
            var pos = {
                x: undefined,
                y: undefined
            };
            if (this.dragProcess.dragX) {
                pos.x = this.getXDrag(e);

            }

            if (this.dragProcess.dragY) {
                pos.y = this.getYDrag(e);
            }


            this.move(pos);

            /*
             * Event fired while dragging. Sends position, example {x:100,y:50}
             * and reference to effect.Drag as arguments
             * @event drag
             * @param {Object} x and y
             * @param {effect.Drag} this
             */
            this.fireEvent('drag', [pos, this.els[this.dragProcess.dragged], this]);
            return false;

        }
        return undefined;
    },

    move: function (pos) {
        if (pos.x !== undefined) {
            this.dragProcess.currentX = pos.x;
            this.dragProcess.el.css('left', pos.x + this.unit);
        }
        if (pos.y !== undefined) {
            this.dragProcess.currentY = pos.y;
            this.dragProcess.el.css('top', pos.y + this.unit);
        }
    },

    /**
     * Return current x pos
     * @function getX
     * @return {Number} x
     * @memberof ludo.effect.Effect.prototype
     */
    getX: function () {
        return this.dragProcess.currentX;
    },
    /**
     * Return current y pos
     * @function getY
     * @return {Number} y
     * @memberof ludo.effect.Effect.prototype
     */
    getY: function () {
        return this.dragProcess.currentY;
    },

    getXDrag: function (e) {
        var posX;

        var p = e.touches != undefined && e.touches.length > 0 ? e.touches[0] : e;

        if (this.mouseXOffset) {
            posX = p.pageX + this.mouseXOffset;
        } else {
            posX = p.pageX - this.dragProcess.mouseX + this.dragProcess.elX;
        }

        if (posX < this.dragProcess.minX) {
            posX = this.dragProcess.minX;
        }
        if (posX > this.dragProcess.maxX) {
            posX = this.dragProcess.maxX;
        }
        return posX;
    },

    getYDrag: function (e) {
        var posY;
        var p = e.touches != undefined && e.touches.length > 0 ? e.touches[0] : e;

        if (this.mouseYOffset) {
            posY = p.pageY + this.mouseYOffset;
        } else {
            posY = p.pageY - this.dragProcess.mouseY + this.dragProcess.elY;
        }

        if (posY < this.dragProcess.minY) {
            posY = this.dragProcess.minY;
        }
        if (posY > this.dragProcess.maxY) {
            posY = this.dragProcess.maxY;
        }
        return posY;
    },

    endDrag: function () {
        if (this.dragProcess.active) {
            this.cancelDrag();

            this.fireEvent('end', [
                this.getDragged(),
                this,
                {
                    x: this.getX(),
                    y: this.getY()
                }
            ]);

        }
        if (this.inDelayMode)this.inDelayMode = false;

    },

    /**
     * Set new max X pos
     * @function setMaxX
     * @param {Number} x
     * @memberof ludo.effect.Effect.prototype
     */
    setMaxX: function (x) {
        this.maxX = x;
    },
    /**
     * Set new min X pos
     * @function setMinX
     * @param {Number} x
     * @memberof ludo.effect.Effect.prototype
     */
    setMinX: function (x) {
        this.minX = x;
    },
    /**
     * Set new min Y pos
     * @function setMinY
     * @param {Number} y
     * @memberof ludo.effect.Effect.prototype
     */
    setMinY: function (y) {
        this.minY = y;
    },
    /**
     * Set new max Y pos
     * @function setMaxY
     * @param {Number} y
     * @memberof ludo.effect.Effect.prototype
     */
    setMaxY: function (y) {
        this.maxY = y;
    },
    /**
     * Set new min pos
     * @function setMinPos
     * @param {Number} pos
     * @memberof ludo.effect.Effect.prototype
     */
    setMinPos: function (pos) {
        this.minPos = pos;
    },
    /**
     * Set new max pos
     * @function setMaxPos
     * @param {Number} pos
     * @memberof ludo.effect.Effect.prototype
     */
    setMaxPos: function (pos) {
        this.maxPos = pos;
    },

    getMaxX: function () {
        return this.getMaxPos('maxX');
    },

    getMaxY: function () {
        return this.getMaxPos('maxY');
    },

    getMaxPos: function (key) {
        var max = this.getConfigProperty(key);
        return max !== undefined ? max : this.maxPos !== undefined ? this.maxPos : 100000;
    },

    getMinX: function () {
        var minX = this.getConfigProperty('minX');
        return minX !== undefined ? minX : this.minPos;
    },

    getMinY: function () {
        var dragged = this.getDragged();
        return dragged && dragged.minY !== undefined ? dragged.minY : this.minY !== undefined ? this.minY : this.minPos;
    },
    /**
     * Return amount dragged in x direction
     * @function getDraggedX
     * @return {Number} x
     * @memberof ludo.effect.Effect.prototype
     */
    getDraggedX: function () {
        return this.getX() - this.dragProcess.elX;
    },
    /**
     * Return amount dragged in y direction
     * @function getDraggedY
     * @return {Number} y
     * @memberof ludo.effect.Effect.prototype
     */
    getDraggedY: function () {
        return this.getY() - this.dragProcess.elY;
    },

    canDragAlongX: function () {
        return this.getConfigProperty('directions').indexOf('X') >= 0;
    },
    canDragAlongY: function () {
        return this.getConfigProperty('directions').indexOf('Y') >= 0;
    },

    getConfigProperty: function (property) {
        var dragged = this.getDragged();
        return dragged && dragged[property] !== undefined ? dragged[property] : this[property];
    },

    /**
     * Returns width of dragged element
     * @function getHeight
     * @return {Number}
     * @memberof ludo.effect.Effect.prototype
     */
    getWidth: function () {
        return this.dragProcess.width;
    },

    /**
     * Returns height of dragged element
     * @function getHeight
     * @return {Number}
     * @memberof ludo.effect.Effect.prototype
     */
    getHeight: function () {
        return this.dragProcess.height;
    },
    /**
     * Returns current left position of dragged
     * @function getLeft
     * @return {Number}
     * @memberof ludo.effect.Effect.prototype
     */
    getLeft: function () {
        return this.dragProcess.currentX;
    },

    /**
     * Returns current top/y position of dragged.
     * @function getTop
     * @return {Number}
     * @memberof ludo.effect.Effect.prototype
     */
    getTop: function () {
        return this.dragProcess.currentY;
    },

    /**
     * Returns reference to DOM element of shim
     * @function getShim
     * @return {HTMLDivElement} shim
     * @memberof ludo.effect.Effect.prototype
     */
    getShim: function () {
        if (this.shim === undefined) {
            this.shim = $('<div>');
            this.shim.addClass('ludo-shim');
            this.shim.css({
                position: 'absolute',
                'z-index': 50000,
                display: 'none'
            });
            $(document.body).append(this.shim);

            if (this.shimCls) {
                for (var i = 0; i < this.shimCls.length; i++) {
                    this.shim.addClass(this.shimCls[i]);
                }
            }

            this.fireEvent('createShim', this.shim);
        }
        return this.shim;
    },


    showShim: function () {
        this.getShim().css({
            display: '',
            left: this.getShimX(),
            top: this.getShimY(),
            width: this.getWidth() + this.getShimWidthDiff(),
            height: this.getHeight() + this.getShimHeightDiff()
        });

        this.fireEvent('showShim', [this.getShim(), this]);
    },

    getShimY: function () {
        if (this.mouseYOffset) {
            return this.dragProcess.mouseY + this.mouseYOffset;
        } else {
            return this.getTop() + ludo.dom.getMH(this.getEl()) - ludo.dom.getMW(this.shim);
        }
    },

    getShimX: function () {
        if (this.mouseXOffset) {
            return this.dragProcess.mouseX + this.mouseXOffset;
        } else {
            return this.getLeft() + ludo.dom.getMW(this.getEl()) - ludo.dom.getMW(this.shim);
        }
    },

    getShimWidthDiff: function () {
        return ludo.dom.getMW(this.getEl()) - ludo.dom.getMBPW(this.shim);
    },
    getShimHeightDiff: function () {
        return ludo.dom.getMH(this.getEl()) - ludo.dom.getMBPH(this.shim);
    },

    /**
     * Hide shim
     * @function hideShim
     * @memberof ludo.effect.Effect.prototype
     */
    hideShim: function () {
        this.getShim().css('display', 'none');
    },

    /**
     * Set text content of shim
     * @function setShimText
     * @param {String} text
     * @memberof ludo.effect.Effect.prototype
     */
    setShimText: function (text) {
        this.getShim().html(text);
    },
    

    isActive: function () {
        return this.dragProcess.active;
    }
});