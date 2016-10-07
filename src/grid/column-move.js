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
        this.setConfigParams(config, ['gridHeader','columnManager']);
	},

	ludoEvents:function(){
		this.parent();
		this.addEvent('createShim', this.setZIndex.bind(this));
	},

	setZIndex:function(shim){
		shim.style.zIndex = 50000;
	},

	getMarker:function () {
		if (this.insertionMarker === undefined) {
            this.insertionMarker = ludo.dom.create({
                cls : 'ludo-grid-movable-insertion-marker',
                css : { display: 'none' },
                renderTo : document.body
            });
            ludo.dom.create({ cls : 'ludo-grid-movable-insertion-marker-bottom', renderTo : this.insertionMarker});
		}
		return this.insertionMarker;
	},

	hideMarker:function(){
		this.getMarker().css('display', 'none');
	},

	showMarkerAt:function(cell, pos){
		var coordinates = cell.getCoordinates();
        var s = this.getMarker().style;
        s.display='';
        s.left = (coordinates.left + (pos=='after' ? coordinates.width : 0)) + 'px';
        s.top = (coordinates.top - this.getArrowHeight()) + 'px';
        s.height = coordinates.height + 'px';
	},

	setMarkerHeight:function(height){
		this.getMarker().style.height = (height + (this.getArrowHeight() * 2)) + 'px';
	},

	getArrowHeight:function(){
		if(!this.arrowHeight){
			this.arrowHeight = this.getMarker().getElement('.ludo-grid-movable-insertion-marker-bottom').offsetHeight;
		}
		return this.arrowHeight;
	}
});