/**
 * Class responsible for moving columns using drag and drop.
 * An instance of this class is automatically created by the grid. It is
 * rarely nescessary to create your own instances of this class
 * @namespace grid
 * @class ColumnMove
 */
ludo.grid.ColumnMove = new Class({
	Extends:ludo.effect.DragDrop,
	gridHeader:undefined,
	columnManager:undefined,

	shimCls:['ludo-grid-movable-shim'],
	insertionMarker:undefined,

	arrowHeight:undefined,

	ludoConfig:function (config) {
		this.parent(config);
		this.gridHeader = config.gridHeader;
		this.columnManager = config.columnManager;
	},

	ludoEvents:function(){
		this.parent();
		this.addEvent('createShim', this.setZIndex.bind(this));
	},

	setZIndex:function(shim){
		shim.setStyle('z-index', 50000);
	},

	getMarker:function () {
		if (this.insertionMarker === undefined) {
			var el = this.insertionMarker = new Element('div');
			ludo.dom.addClass(el, 'ludo-grid-movable-insertion-marker');
			el.setStyle('display', 'none');
			document.body.adopt(el);
			var b = new Element('div');
			ludo.dom.addClass(b, 'ludo-grid-movable-insertion-marker-bottom');
			el.adopt(b);
		}
		return this.insertionMarker;
	},

	hideMarker:function(){
		this.getMarker().style.display='none';
	},

	showMarkerAt:function(cell, pos){
		var coordinates = cell.getCoordinates();
		this.getMarker().setStyle('display','');
		this.getMarker().setStyles({
			left : coordinates.left  + (pos=='after' ? coordinates.width : 0),
			top : coordinates.top - this.getArrowHeight(),
			height: coordinates.height
		});
	},

	setMarkerHeight:function(height){
		this.getMarker().setStyle('height', height + (this.getArrowHeight() * 2));
	},

	getArrowHeight:function(){
		if(!this.arrowHeight){
			this.arrowHeight = this.getMarker().getElement('.ludo-grid-movable-insertion-marker-bottom').getSize().y;
		}
		return this.arrowHeight;
	}
});