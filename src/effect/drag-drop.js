/**
 * effect.Drag with support for drop events.
 * @namespace ludo.effect
 * @class ludo.effect.DragDrop
 * @augments effect.Drag
 * @param {Object} config
 * @param {Boolean} config.captureRegions. True to capture regions. When set, events like "north", "south", "west" and "east"
 * will be fired when dragging over drop points.
 * @fires ludo.effect.Dragdrop#enterDropTarget Fired when entering drop target DOM node. Arguments: 1) DOM dragged 2) DOM drop target, 3) ludo.effect.DragDrop, 4) event.target
 * @fires ludo.effect.Dragdrop#validDropTarget Fired when entering valid drop target DOM node. Arguments: 1) DOM dragged 2) DOM drop target, 3) ludo.effect.DragDrop, 4) event.target
 * @fires ludo.effect.Dragdrop#invalidDropTarget Fired when entering invalid drop target DOM node. This happens when you have an event handler on enterDropTarget and
 * call the setInvalid method. Arguments: 1) DOM dragged 2) DOM drop target, 3) ludo.effect.DragDrop, 4) event.target
 * @fires ludo.effect.Dragdrop#drop Fired on drop. Arguments: 1) DOM dragged 2) DOM drop target, 3) ludo.effect.DragDrop, 4) event.target
 * @fires ludo.effect.Dragdrop#north When captureRegions is set, this event is fired when entering north region of a drop point. Same arguments as otehr drop events.
 * @fires ludo.effect.Dragdrop#south When captureRegions is set, this event is fired when entering south region of a drop point. Same arguments as otehr drop events.
 * @fires ludo.effect.Dragdrop#west When captureRegions is set, this event is fired when entering west region of a drop point. Same arguments as otehr drop events.
 * @fires ludo.effect.Dragdrop#east When captureRegions is set, this event is fired when entering east region of a drop point. Same arguments as otehr drop events.
 */
ludo.effect.DragDrop = new Class({
	Extends:ludo.effect.Drag,
	useShim:false,
	currentDropPoint:undefined,
	onValidDropPoint:undefined,

	captureRegions:false,

	/*
	 * While dragging, always show dragged element this amount of pixels below mouse cursor.
	 * @config mouseYOffset
	 * @type {Number|undefined}
	 * @optional
	 * @default undefined
	 */
	mouseYOffset:undefined,

	__construct:function (config) {
		this.parent(config);
		if (config.captureRegions !== undefined)this.captureRegions = config.captureRegions;

	},

	ludoEvents:function () {
		this.parent();
		this.addEvent('start', this.setStartProperties.bind(this));
		this.addEvent('end', this.drop.bind(this));
	},

	getDropIdByEvent:function (e) {
		var el = jQuery(e.target);
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
	 * @memberof ludo.effect.DragDrop.prototype
	 */
	remove:function (id) {
		if (this.els[id] !== undefined) {
			var el = jQuery(this.els[id].el);
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
	 * @memberof ludo.effect.DragDrop.prototype
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

			this.fireEvent('enterDropTarget', this.getDropEventArguments(e));

			if (this.onValidDropPoint) {
				if (this.shouldCaptureRegionsFor(this.currentDropPoint)) {
					this.setMidPoint();
				}

				this.fireEvent('validDropTarget', this.getDropEventArguments(e));
			} else {

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
	 @memberof ludo.effect.DragDrop.prototype
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
				this.fireEvent('north', this.getDropEventArguments(e));
				this.previousRegions.v = 'n';
			} else if (e.pageY >= midPoint.y && this.previousRegions.v !== 's') {

				this.fireEvent('south', this.getDropEventArguments(e));
				this.previousRegions.v = 's';
			}
			if (e.pageX < midPoint.x && this.previousRegions.h !== 'w') {

				this.fireEvent('west', this.getDropEventArguments(e));
				this.previousRegions.h = 'w';
			} else if (e.pageX >= midPoint.x && this.previousRegions.h !== 'e') {

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