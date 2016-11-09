/**
 * effect.Drag with support for drop events.
 * @namespace effect
 * @class DragDrop
 * @augments effect.Drag
 */
ludo.effect.DragDrop = new Class({
	Extends:ludo.effect.Drag,
	useShim:false,
	currentDropPoint:undefined,
	onValidDropPoint:undefined,

	/**
	 Capture regions when moving over drop points
	 @config {Boolean|undefined}
	 @optional
	 @default false
	 @example
	 	captureRegions:true
	 */
	captureRegions:false,

	/**
	 * While dragging, always show dragged element this amount of pixels below mouse cursor.
	 * @config mouseYOffset
	 * @type {Number|undefined}
	 * @optional
	 * @default undefined
	 */
	mouseYOffset:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		if (config.captureRegions !== undefined)this.captureRegions = config.captureRegions;

	},

	ludoEvents:function () {
		this.parent();
		this.addEvent('start', this.setStartProperties.bind(this));
		this.addEvent('end', this.drop.bind(this));
	},

	getDropIdByEvent:function (e) {
		var el = $(e.target);
		if (!el.hasClass('ludo-drop')) {
			el = el.getParent('.ludo-drop');
		}
		return el.attr('forId');
	},

	/**
	 * Remove node
	 * @function remove
	 * @param {String} id
	 * @return {Boolean} success
	 */
	remove:function (id) {
		if (this.els[id] !== undefined) {
			var el = document.id(this.els[id].el);
			el.unbind('mouseenter', this.enterDropTarget.bind(this));
			el.unbind('mouseleave', this.leaveDropTarget.bind(this));
			return this.parent(id);
		}
		return false;
	},

	/**
	 * Create new drop point.
	 * @function addDropTarget
	 * @param {ludo.effect.DropPoint} node
	 * @return {ludo.effect.DropPoint} node
	 */
	addDropTarget:function (node) {
		node = this.getValidNode(node);
		node.el.addClass('ludo-drop');
		if(node.el.mouseenter != undefined){
			node.el.mouseenter(this.enterDropTarget.bind(this));
			node.el.mouseleave(this.leaveDropTarget.bind(this));

		}else{
			node.el.on('mouseenter', this.enterDropTarget.bind(this));
			node.el.on('mouseleave', this.leaveDropTarget.bind(this));
		}

		var captureRegions = node.captureRegions !== undefined ? node.captureRegions : this.captureRegions;
		if (captureRegions) {
			node.el.on('mousemove', this.captureRegion.bind(this));
		}

		node = this.els[node.id] = Object.merge(node, {
			el:node.el,
			captureRegions:captureRegions
		});

		return node;
	},

	enterDropTarget:function (e) {
		if (this.isActive()) {
			this.setCurrentDropPoint(e);
			this.onValidDropPoint = true;
			/**
			 Enter drop point event. This event is fired when dragging is active
			 and mouse enters a drop point
			 @event enterDropTarget
			 @param {effect.DraggableNode} node
			 @param {effect.DropPoint} node
			 @param {effect.DragDrop} this
			 @param {HTMLElement} target
			 */
			this.fireEvent('enterDropTarget', this.getDropEventArguments(e));

			if (this.onValidDropPoint) {
				if (this.shouldCaptureRegionsFor(this.currentDropPoint)) {
					this.setMidPoint();
				}
				/**
				 Enters valid drop point.
				 @event validDropTarget
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('validDropTarget', this.getDropEventArguments(e));
			} else {
				/**
				 Enters invalid drop point.
				 @event invalidDropTarget
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('invalidDropTarget', this.getDropEventArguments(e));
			}
			return false;
		}
		return undefined;
	},

	setCurrentDropPoint:function (e) {
		this.currentDropPoint = this.getById(this.getDropIdByEvent(e));
	},

	leaveDropTarget:function (e) {
		if (this.isActive() && this.currentDropPoint) {
			this.fireEvent('leaveDropTarget', this.getDropEventArguments(e));
			this.onValidDropPoint = false;
			this.currentDropPoint = undefined;
		}
	},

	getDropEventArguments:function (e) {
		return [this.getDragged(), this.currentDropPoint, this, e.target];
	},

	/**
	 Set drop point invalid. This method is usually used in connection with a listener
	 for the enterDropTarget event
	 @function setInvalid
	 @example
	 	dd.addEvent('enterDropTarget', function(node, dd){
			 if(node.name === 'John Doe'){
				 dd.setInvalid(); // Triggers an invalidDropTarget event
			 }
		 });
	 */
	setInvalid:function () {
		this.onValidDropPoint = false;
	},

	getCurrentDropPoint:function () {
		return this.currentDropPoint;
	},

	drop:function (e) {
		/**
		 drop event caused by mouseup on valid drop point.
		 @event drop
		 @param {effect.DraggableNode} dragged node
		 @param {effect.DropPoint} drop target
		 @param {effect.DragDrop} this
		 @param {HTMLElement} target
		 */
		if (this.onValidDropPoint)this.fireEvent('drop', this.getDropEventArguments(e));
	},

	setStartProperties:function () {
		this.onValidDropPoint = false;
	},

	shouldCaptureRegionsFor:function (node) {
		return this.els[node.id].captureRegions === true;
	},

	getDropPointCoordinates:function () {
		if (this.currentDropPoint) {
			var el = this.currentDropPoint.el;
			var ret = el.position();
			ret.width = el.width();
			ret.height = el.height();
			return ret;
			return this.currentDropPoint.el.getCoordinates();
		}
		return undefined;
	},

	previousRegions:{
		h:undefined,
		v:undefined
	},

	captureRegion:function (e) {
		if (this.isActive() && this.onValidDropPoint && this.shouldCaptureRegionsFor(this.currentDropPoint)) {
			var midPoint = this.midPoint;
			if (e.pageY < midPoint.y && this.previousRegions.v !== 'n') {
				/**
				 Enter north region of a drop point
				 @event north
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('north', this.getDropEventArguments(e));
				this.previousRegions.v = 'n';
			} else if (e.pageY >= midPoint.y && this.previousRegions.v !== 's') {
				/**
				 Enter south region of a drop point
				 @event south
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('south', this.getDropEventArguments(e));
				this.previousRegions.v = 's';
			}
			if (e.pageX < midPoint.x && this.previousRegions.h !== 'w') {
				/**
				 Enter west region of a drop point
				 @event west
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('west', this.getDropEventArguments(e));
				this.previousRegions.h = 'w';
			} else if (e.pageX >= midPoint.x && this.previousRegions.h !== 'e') {
				/**
				 Enter east region of a drop point
				 @event east
				 @param {effect.DraggableNode} dragged node
				 @param {effect.DropPoint} drop target
				 @param {effect.DragDrop} this
				 @param {HTMLElement} target
				 */
				this.fireEvent('east', this.getDropEventArguments(e));
				this.previousRegions.h = 'e';
			}

		}
	},

	midPoint:undefined,
	setMidPoint:function () {
		var coords = this.getDropPointCoordinates();
		this.midPoint = {
			x:coords.left + (coords.width / 2),
			y:coords.top + (coords.height / 2)
		};
		this.previousRegions = {
			h:undefined,
			v:undefined
		};
	}
});